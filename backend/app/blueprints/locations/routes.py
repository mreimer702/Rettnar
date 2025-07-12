from app.blueprints.locations.schemas import location_schema, locations_schema
from flask import request, jsonify
from sqlalchemy import select, func
from app.models import Listing, User, Location, Subcategory, db
from marshmallow import ValidationError
from . import locations_bp
from app.utils.util import user_token_required, admin_required
from app.extensions import limiter

# ========================================
# PUBLIC ROUTES (No Authentication Required)
# ========================================

@locations_bp.route("/", methods=["GET"])
def get_locations():
    """Public: Get all locations with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    if page < 1 or per_page < 1:
        return jsonify({"error": "Invalid pagination values"}), 400

    query = select(Location)
    total = db.session.execute(select(func.count(Location.location_id))).scalar()

    offset = (page - 1) * per_page
    locations = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'locations': locations_schema.dump(locations),
        'pagination': pagination_info
    }), 200

@locations_bp.route("/<int:location_id>", methods=["GET"])
def get_location(location_id):
    """Public: Get location by ID"""
    location = db.session.execute(
        select(Location).where(Location.location_id == location_id)
    ).scalars().first()
    
    if not location:
        return jsonify({"error": "Location not found"}), 404
    
    return location_schema.jsonify(location), 200

@locations_bp.route("/search", methods=["GET"])
def search_locations():
    """Public: Search locations by city, state, or zip code"""
    city = request.args.get("city")
    state = request.args.get("state")
    zip_code = request.args.get("zip_code")
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    query = select(Location)

    # Apply search filters
    if city:
        query = query.where(Location.city.ilike(f"%{city}%"))
    if state:
        query = query.where(Location.state.ilike(f"%{state}%"))
    if zip_code:
        query = query.where(Location.zip_code.ilike(f"%{zip_code}%"))

    # Get total count
    total = db.session.execute(
        select(func.count(Location.location_id)).where(query.whereclause)
    ).scalar() if query.whereclause is not None else db.session.execute(
        select(func.count(Location.location_id))
    ).scalar()

    # Apply pagination
    offset = (page - 1) * per_page
    locations = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()

    if not locations and (city or state or zip_code):
        return jsonify({"message": "No locations found matching your criteria."}), 404

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'locations': locations_schema.dump(locations),
        'pagination': pagination_info
    }), 200

# ========================================
# AUTHENTICATED USER ROUTES
# ========================================

@locations_bp.route("/", methods=["POST"])
@user_token_required
@limiter.limit("10 per minute")
def create_location(user_id):
    """Create a new location (authenticated users only)"""
    try:
        data = request.get_json()
        location_data = location_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    # Check if location already exists with same address
    existing_location = db.session.execute(
        select(Location).where(
            Location.address == location_data.address,
            Location.city == location_data.city,
            Location.state == location_data.state,
            Location.zip_code == location_data.zip_code
        )
    ).scalars().first()

    if existing_location:
        return jsonify({
            "message": "Location already exists",
            "location": location_schema.dump(existing_location)
        }), 200

    new_location = Location(
        address=location_data.address,
        city=location_data.city,
        state=location_data.state,
        zip_code=location_data.zip_code,
        country=location_data.country,
        latitude=location_data.latitude,
        longitude=location_data.longitude
    )

    db.session.add(new_location)
    db.session.commit()
    return location_schema.jsonify(new_location), 201

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@locations_bp.route("/admin/all", methods=["GET"])
@admin_required
def admin_get_all_locations(user_id):
    """Admin: Get all locations with enhanced pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    if page < 1 or per_page < 1:
        return jsonify({"error": "Invalid pagination values"}), 400

    query = select(Location)
    total = db.session.execute(select(func.count(Location.location_id))).scalar()

    offset = (page - 1) * per_page
    locations = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'locations': locations_schema.dump(locations),
        'pagination': pagination_info
    }), 200

@locations_bp.route("/<int:location_id>", methods=["PUT"])
@admin_required
@limiter.limit("10 per minute")
def update_location(user_id, location_id):
    """Admin: Update location"""
    location = db.session.execute(
        select(Location).where(Location.location_id == location_id)
    ).scalars().first()
    
    if not location:
        return jsonify({"error": "Location not found"}), 404
    
    try:
        incoming_data = request.get_json()
        location_schema.load(incoming_data, partial=True)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    
    # Update location fields
    fields = ["address", "city", "state", "zip_code", "country", "latitude", "longitude"]
    for field in fields:
        if field in incoming_data:
            setattr(location, field, incoming_data[field])

    db.session.commit()
    return location_schema.jsonify(location), 200

@locations_bp.route("/<int:location_id>", methods=["DELETE"])
@admin_required
@limiter.limit("5 per minute")
def delete_location(user_id, location_id):
    """Admin: Delete location (only if not referenced by listings or users)"""
    location = db.session.execute(
        select(Location).where(Location.location_id == location_id)
    ).scalars().first()
    
    if not location:
        return jsonify({"error": "Location not found"}), 404
    
    # Check if location is referenced by any listings
    listings_count = db.session.execute(
        select(func.count(Listing.listing_id)).where(Listing.location_id == location_id)
    ).scalar()
    
    if listings_count > 0:
        return jsonify({
            "error": f"Cannot delete location. It is referenced by {listings_count} listing(s)"
        }), 400
    
    # Check if location is referenced by any users
    users_count = db.session.execute(
        select(func.count(User.user_id)).where(User.location_id == location_id)
    ).scalar()
    
    if users_count > 0:
        return jsonify({
            "error": f"Cannot delete location. It is referenced by {users_count} user(s)"
        }), 400
    
    db.session.delete(location)
    db.session.commit()
    return jsonify({"message": "Location deleted successfully"}), 200

@locations_bp.route("/admin/analytics", methods=["GET"])
@admin_required
def admin_location_analytics(user_id):
    """Admin: Get location analytics"""
    # Get locations with listing counts
    query = (
        select(
            Location,
            func.count(Listing.listing_id).label('listing_count')
        )
        .outerjoin(Listing, Location.location_id == Listing.location_id)
        .group_by(Location.location_id)
        .order_by(func.count(Listing.listing_id).desc())
        .limit(20)
    )
    
    results = db.session.execute(query).all()
    
    analytics = []
    for result in results:
        location_data = location_schema.dump(result[0])
        location_data['listing_count'] = result[1]
        analytics.append(location_data)
    
    return jsonify({'location_analytics': analytics}), 200