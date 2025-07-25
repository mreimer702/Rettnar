from flask import request, jsonify
from sqlalchemy import select, func, and_, or_, text
from marshmallow import ValidationError
import math
from app.models import Listing, Category, Subcategory, Location, Amenity, ListingFeature, User, db
from app.blueprints.listings.schemas import (
    listing_schema, listings_schema, listing_create_schema, listing_update_schema
)
from app.blueprints.listings.frontend_schemas import (
    FrontendListingsResponseSchema, FrontendListingSchema
)
from app.blueprints.listings import listings_bp
from app.utils.util import user_token_required, admin_token_required
from app.extensions import cache, limiter

# ========================================
# PUBLIC ROUTES (No Authentication Required)
# ========================================

@listings_bp.route('/', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def get_listings():
    """Public: Get all listings with filtering and pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    query = select(Listing)

    # Apply filters
    category_id = request.args.get('category_id', type=int)
    subcategory_id = request.args.get('subcategory_id', type=int)
    min_price = request.args.get('min_price', type=int)
    max_price = request.args.get('max_price', type=int)
    city = request.args.get('city')
    state = request.args.get('state')
    zip_code = request.args.get('zip_code')
    search = request.args.get('search')
    
    # Nearby search parameters
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius', type=float, default=10.0)  # Default 10 km radius

    if category_id:
        query = query.join(Subcategory).where(Subcategory.category_id == category_id)

    if subcategory_id:
        query = query.where(Listing.subcategory_id == subcategory_id)

    if min_price is not None:
        query = query.where(Listing.price >= min_price)

    if max_price is not None:
        query = query.where(Listing.price <= max_price)

    if city:
        query = query.join(Location).where(Location.city.like(f'%{city.lower()}%'))

    if state:
        query = query.join(Location).where(Location.state.like(f'%{state.lower()}%'))

    if zip_code:
        query = query.join(Location).where(Location.zip_code.like(f'%{zip_code.lower()}%'))

    if search:
        search_term = f'%{search.lower()}%'
        query = query.where(
            or_(
                func.lower(Listing.title).like(search_term),
                func.lower(Listing.description).like(search_term),
                func.lower(Location.address).like(search_term),
                func.lower(Location.city).like(search_term),
                func.lower(Location.state).like(search_term),
                func.lower(Location.zip_code).like(search_term)
            )
        )

    # Nearby/Geolocation filtering
    if lat is not None and lng is not None:
        # Join with Location if not already joined
        if not any('location' in str(query) for table in ['city', 'state', 'zip_code']):
            query = query.join(Location)
        
        # Use Haversine formula to calculate distance with SQLAlchemy functions
        distance_expr = func.acos(
            func.cos(func.radians(lat)) * 
            func.cos(func.radians(Location.latitude)) * 
            func.cos(func.radians(Location.longitude) - func.radians(lng)) + 
            func.sin(func.radians(lat)) * 
            func.sin(func.radians(Location.latitude))
        ) * 6371  # Earth's radius in kilometers
        
        # Filter by radius
        query = query.where(
            and_(
                Location.latitude.isnot(None),
                Location.longitude.isnot(None),
                distance_expr <= radius
            )
        )

    # Get total count
    total_query = select(func.count(Listing.listing_id))
    if query.whereclause is not None:
        total_query = total_query.where(query.whereclause)
    total = db.session.execute(total_query).scalar()

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    listings = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    # Use frontend schema to format response
    frontend_schema = FrontendListingsResponseSchema()
    response_data = frontend_schema.dump({'items': listings})
    return jsonify(response_data), 200

@listings_bp.route('/<int:listing_id>', methods=['GET'])
@cache.cached(timeout=300)
def get_listing(listing_id):
    """Public: Get a single listing by ID"""
    listing = db.session.execute(
        select(Listing).where(Listing.listing_id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    # Use frontend schema to format response
    frontend_schema = FrontendListingSchema()
    return jsonify(frontend_schema.dump(listing)), 200

@listings_bp.route('/user/<int:owner_id>', methods=['GET'])
def get_user_listings(owner_id):
    """Public: Get listings by a specific user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    user = db.session.execute(
        select(User).where(User.user_id == owner_id)
    ).scalars().first()

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    query = select(Listing).where(Listing.owner_id == owner_id)

    total = db.session.execute(
        select(func.count(Listing.listing_id)).where(Listing.owner_id == owner_id)
    ).scalar()

    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    listings = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'listings': listings_schema.dump(listings),
        'pagination': pagination_info
    }), 200

@listings_bp.route('/nearby', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def get_nearby_listings():
    """Public: Get listings near a specific location"""
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius', type=float, default=10.0)
    
    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    # Base query with location join
    query = select(Listing).join(Location)
    
    # Apply other filters if provided
    category_id = request.args.get('category_id', type=int)
    subcategory_id = request.args.get('subcategory_id', type=int)
    min_price = request.args.get('min_price', type=int)
    max_price = request.args.get('max_price', type=int)
    
    if category_id:
        query = query.join(Subcategory).where(Subcategory.category_id == category_id)
    
    if subcategory_id:
        query = query.where(Listing.subcategory_id == subcategory_id)
    
    if min_price is not None:
        query = query.where(Listing.price >= min_price)
    
    if max_price is not None:
        query = query.where(Listing.price <= max_price)
    
    # Geolocation filtering using Haversine formula
    # Create a subquery with distance calculation
    distance_expr = func.acos(
        func.cos(func.radians(lat)) * 
        func.cos(func.radians(Location.latitude)) * 
        func.cos(func.radians(Location.longitude) - func.radians(lng)) + 
        func.sin(func.radians(lat)) * 
        func.sin(func.radians(Location.latitude))
    ) * 6371  # Earth's radius in kilometers
    
    # Filter by radius
    query = query.where(
        and_(
            Location.latitude.isnot(None),
            Location.longitude.isnot(None),
            distance_expr <= radius
        )
    )
    
    # Order by distance (closest first)
    query = query.order_by(distance_expr)
    
    # Get total count
    total_query = select(func.count(Listing.listing_id)).select_from(
        query.subquery()
    )
    total = db.session.execute(total_query).scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    listings = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total,
        'radius_km': radius,
        'center': {'lat': lat, 'lng': lng}
    }
    
    return jsonify({
        'listings': listings_schema.dump(listings),
        'pagination': pagination_info
    }), 200

# ========================================
# AUTHENTICATED USER ROUTES
# ========================================

@listings_bp.route('/', methods=['POST'])
@user_token_required
@limiter.limit("10 per minute")
def create_listing(user_id):
    """Create a new listing for the authenticated user"""
    try:
        data = request.get_json()
        validated_data = listing_create_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400

    # Verify subcategory exists
    subcategory = db.session.execute(
        select(Subcategory).where(Subcategory.subcategory_id == validated_data['subcategory_id'])
    ).scalars().first()

    if not subcategory:
        return jsonify({'error': 'Subcategory not found'}), 404

    # Create location
    location = Location(
        address=validated_data['address'],
        city=validated_data['city'],
        state=validated_data['state'],
        country=validated_data['country'],
        zip_code=validated_data['zip_code'],
        latitude=validated_data.get('latitude'),
        longitude=validated_data.get('longitude')
    )

    db.session.add(location)
    db.session.flush()  # Ensure location ID is available

    # Create listing with authenticated user as owner
    listing = Listing(
        title=validated_data['title'],
        description=validated_data.get('description', ''),
        price=validated_data['price'],
        subcategory_id=validated_data['subcategory_id'],
        owner_id=user_id,  # Use authenticated user ID
        location_id=location.location_id
    )

    db.session.add(listing)
    db.session.flush()

    # Add amenities if provided
    if validated_data.get('amenity_ids'):
        amenities = db.session.execute(
            select(Amenity).where(Amenity.amenity_id.in_(validated_data['amenity_ids']))
        ).scalars().all()
        listing.amenities = amenities

    # Add features if provided
    if validated_data.get('features'):
        for feature_data in validated_data['features']:
            if 'key' in feature_data and 'value' in feature_data:
                feature = ListingFeature(
                    listing_id=listing.listing_id,
                    key=feature_data['key'],
                    value=feature_data['value']
                )
                db.session.add(feature)

    db.session.commit()
    
    # Use frontend schema to format response
    frontend_schema = FrontendListingSchema()
    return jsonify(frontend_schema.dump(listing)), 201

@listings_bp.route('/my-listings', methods=['GET'])
@user_token_required
def get_my_listings(user_id):
    """Get listings owned by the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    query = select(Listing).where(Listing.owner_id == user_id)

    total = db.session.execute(
        select(func.count(Listing.listing_id)).where(Listing.owner_id == user_id)
    ).scalar()

    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    listings = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    # Use frontend schema to format response  
    frontend_schema = FrontendListingsResponseSchema()
    response_data = frontend_schema.dump({'items': listings})
    return jsonify(response_data), 200

@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@user_token_required
@limiter.limit("10 per minute")
def update_listing(user_id, listing_id):
    """Update a listing (only by owner)"""
    listing = db.session.execute(
        select(Listing).where(Listing.listing_id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    # Check ownership
    if listing.owner_id != user_id:
        return jsonify({'error': 'Unauthorized to update this listing'}), 403
    
    try:
        data = request.get_json()
        validated_data = listing_update_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400
    
    # Update basic listing fields
    if 'title' in validated_data:
        listing.title = validated_data['title']
    if 'description' in validated_data:
        listing.description = validated_data.get('description')
    if 'price' in validated_data:
        listing.price = validated_data['price']
    if 'subcategory_id' in validated_data:
        subcategory = db.session.execute(
            select(Subcategory).where(Subcategory.subcategory_id == validated_data['subcategory_id'])
        ).scalars().first()

        if not subcategory:
            return jsonify({'error': 'Subcategory not found'}), 404
        
        listing.subcategory_id = validated_data['subcategory_id']

    # Update location if provided
    location_fields = ['address', 'city', 'state', 'country', 'zip_code', 'latitude', 'longitude']
    if any(field in validated_data for field in location_fields):
        if listing.location:
            for field in location_fields:
                if field in validated_data:
                    setattr(listing.location, field, validated_data[field])
        else:
            location = Location(
                address=validated_data.get('address', ''),
                city=validated_data.get('city', ''),
                state=validated_data.get('state', ''),
                country=validated_data.get('country', ''),
                zip_code=validated_data.get('zip_code', ''),
                latitude=validated_data.get('latitude'),
                longitude=validated_data.get('longitude')
            )
            db.session.add(location)
            db.session.flush()
            listing.location_id = location.location_id

    # Update amenities if provided
    if 'amenity_ids' in validated_data:
        amenities = db.session.execute(
            select(Amenity).where(Amenity.amenity_id.in_(validated_data['amenity_ids']))
        ).scalars().all()
        listing.amenities = amenities

    # Update features if provided
    if 'features' in validated_data:
        # Remove existing features
        db.session.execute(
            ListingFeature.__table__.delete().where(ListingFeature.listing_id == listing.listing_id)
        )
        
        # Add new features
        for feature_data in validated_data['features']:
            if 'key' in feature_data and 'value' in feature_data:
                feature = ListingFeature(
                    listing_id=listing.listing_id,
                    key=feature_data['key'],
                    value=feature_data['value']
                )
                db.session.add(feature)

    db.session.commit()
    cache.delete_memoized(get_listing, listing_id)
    return listing_schema.jsonify(listing), 200

@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@user_token_required
@limiter.limit("5 per minute")
def delete_listing(user_id, listing_id):
    """Delete a listing (only by owner)"""
    listing = db.session.execute(
        select(Listing).where(Listing.listing_id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    # Check ownership
    if listing.owner_id != user_id:
        return jsonify({'error': 'Unauthorized to delete this listing'}), 403

    db.session.delete(listing)
    db.session.commit()
    cache.delete_memoized(get_listing, listing_id)

    return jsonify({'message': 'Listing deleted successfully'}), 200

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@listings_bp.route('/admin/all', methods=['GET'])
@admin_token_required
def admin_get_all_listings(user_id):
    """Admin: Get all listings with additional details"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    query = select(Listing)
    total = db.session.execute(select(func.count(Listing.listing_id))).scalar()
    
    offset = (page - 1) * per_page
    listings = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'listings': listings_schema.dump(listings),
        'pagination': pagination_info
    }), 200

@listings_bp.route('/admin/<int:listing_id>', methods=['DELETE'])
@admin_token_required
@limiter.limit("10 per minute")
def admin_delete_listing(user_id, listing_id):
    """Admin: Delete any listing"""
    listing = db.session.execute(
        select(Listing).where(Listing.listing_id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    db.session.delete(listing)
    db.session.commit()
    cache.delete_memoized(get_listing, listing_id)

    return jsonify({'message': 'Listing deleted by admin'}), 200