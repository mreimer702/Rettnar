from app.blueprints.bookings.schemas import booking_schema, bookings_schema
from flask import request, jsonify
from sqlalchemy import select, and_
from app.models import Booking, Listing, User, db
from marshmallow import ValidationError
from . import bookings_bp
from datetime import datetime
from app.utils.util import user_token_required, admin_required
from app.extensions import limiter

# ========================================
# AUTHENTICATED USER ROUTES
# ========================================

@bookings_bp.route("", methods=["POST"])
@user_token_required
@limiter.limit("5 per minute")
def create_booking(user_id):
    """Create a new booking for the authenticated user"""
    try:
        incoming_data = request.get_json()
        booking_data = booking_schema.load(incoming_data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    # Verify the booking is for the authenticated user
    if booking_data.user_id != user_id:
        return jsonify({"error": "Cannot create booking for another user"}), 403

    # Verify listing exists
    listing = db.session.execute(
        select(Listing).where(Listing.listing_id == booking_data.listing_id)
    ).scalars().first()
    
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    # Prevent users from booking their own listings
    if listing.owner_id == user_id:
        return jsonify({"error": "Cannot book your own listing"}), 400

    # Validate dates
    if booking_data.start_date >= booking_data.end_date:
        return jsonify({"error": "End date must be after start date"}), 400

    if booking_data.start_date < datetime.utcnow():
        return jsonify({"error": "Start date must be in the future"}), 400

    # Check for conflicts
    conflict_query = select(Booking).where(
        and_(
            Booking.listing_id == booking_data.listing_id,
            Booking.status != "cancelled",
            Booking.end_date > booking_data.start_date,
            Booking.start_date < booking_data.end_date
        )
    )

    conflicts = db.session.execute(conflict_query).scalars().all()
    if conflicts:
        return jsonify({"error": "Listing is not available for the selected dates"}), 409

    db.session.add(booking_data)
    db.session.commit()
    return booking_schema.jsonify(booking_data), 201

@bookings_bp.route("/my-bookings", methods=["GET"])
@user_token_required
def get_my_bookings(user_id):
    """Get bookings for the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    query = select(Booking).where(Booking.user_id == user_id)
    total = db.session.execute(
        select(db.func.count(Booking.booking_id)).where(Booking.user_id == user_id)
    ).scalar()
    
    offset = (page - 1) * per_page
    bookings = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'bookings': bookings_schema.dump(bookings),
        'pagination': pagination_info
    }), 200

@bookings_bp.route("/my-listings-bookings", methods=["GET"])
@user_token_required
def get_my_listings_bookings(user_id):
    """Get bookings for listings owned by the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    # Join with Listing to find bookings for user's listings
    query = select(Booking).join(Listing).where(Listing.owner_id == user_id)
    total = db.session.execute(
        select(db.func.count(Booking.booking_id)).join(Listing).where(Listing.owner_id == user_id)
    ).scalar()
    
    offset = (page - 1) * per_page
    bookings = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'bookings': bookings_schema.dump(bookings),
        'pagination': pagination_info
    }), 200

@bookings_bp.route("/<int:booking_id>", methods=["GET"])
@user_token_required
def get_booking(user_id, booking_id):
    """Get a specific booking if user owns it or owns the listing"""
    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Users can only see their own bookings or bookings for their listings
    if booking.user_id != user_id and booking.listing.owner_id != user_id:
        return jsonify({"error": "Access denied"}), 403
    
    return booking_schema.jsonify(booking), 200

@bookings_bp.route("/<int:booking_id>", methods=["PUT"])
@user_token_required
@limiter.limit("10 per minute")
def update_booking(user_id, booking_id):
    """Update a booking (status changes only)"""
    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Only booking owner or listing owner can update
    if booking.user_id != user_id and booking.listing.owner_id != user_id:
        return jsonify({"error": "Access denied"}), 403
    
    try:
        data = request.get_json()
        # Only allow status updates for security
        if 'status' in data and data['status'] in ['confirmed', 'cancelled']:
            booking.status = data['status']
            db.session.commit()
        else:
            return jsonify({"error": "Only status updates allowed"}), 400
    except Exception as e:
        return jsonify({"error": "Invalid update data"}), 400
    
    return booking_schema.jsonify(booking), 200

@bookings_bp.route("/<int:booking_id>", methods=["DELETE"])
@user_token_required
@limiter.limit("5 per minute")
def cancel_booking(user_id, booking_id):
    """Cancel a booking (only booking owner can cancel)"""
    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    # Only booking owner can cancel
    if booking.user_id != user_id:
        return jsonify({"error": "Only the person who made the booking can cancel it"}), 403
    
    booking.status = "cancelled"
    db.session.commit()
    
    return jsonify({"message": "Booking cancelled successfully"}), 200

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@bookings_bp.route("", methods=["GET"])
@admin_required
def get_all_bookings(user_id):
    """Admin: Get all bookings with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    query = select(Booking)
    total = db.session.execute(select(db.func.count(Booking.booking_id))).scalar()
    
    offset = (page - 1) * per_page
    bookings = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'bookings': bookings_schema.dump(bookings),
        'pagination': pagination_info
    }), 200

@bookings_bp.route("/admin/<int:booking_id>", methods=["DELETE"])
@admin_required
@limiter.limit("10 per minute")
def admin_delete_booking(user_id, booking_id):
    """Admin: Permanently delete a booking"""
    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    db.session.delete(booking)
    db.session.commit()
    
    return jsonify({"message": "Booking permanently deleted"}), 200