from app.blueprints.bookings.schemas import booking_schema, bookings_schema
from flask import request, jsonify
from sqlalchemy import select, and_
from app.models import Booking, Listing, User, db
from marshmallow import ValidationError
from . import bookings_bp
from datetime import datetime

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx CREATE BOOKING ROUTE xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@bookings_bp.route("", methods=["POST"])  # <------------------------------------------ CREATE BOOKING ROUTE
def create_booking():
    try:
        incoming_data = request.get_json()
        booking_data = booking_schema.load(incoming_data)
    except ValidationError as e:
        return jsonify(e.messages), 400

    user = db.session.execute(select(User).where(User.user_id == booking_data.user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    listing = db.session.execute(select(Listing).where(Listing.listing_id == booking_data.listing_id)).scalars().first()
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if booking_data.start_date >= booking_data.end_date:
        return jsonify({"error": "End date must be after start date"}), 400

    if booking_data.start_date < datetime.utcnow():
        return jsonify({"error": "Start date must be in the future"}), 400

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

@bookings_bp.route("", methods=["GET"])  #MARK: GET ALL BOOKINGS
def get_all_bookings():
    bookings = db.session.execute(select(Booking)).scalars().all()
    return bookings_schema.jsonify(bookings), 200

@bookings_bp.route("/<int:booking_id>", methods=["GET"])  #NOTE<------------------------------------------ GET BOOKING BY ID ROUTE
def get_booking(booking_id):
    booking = db. session.get(Booking, booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    return booking_schema.jsonify(booking), 200