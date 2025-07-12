from app.blueprints.locations.schemas import location_schema, locations_schema
from flask import request, jsonify
from sqlalchemy import select, func
from app.models import Listing, User, Location, Subcategory, db
from marshmallow import ValidationError
from . import locations_bp
from typing import List, cast

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LOCATION ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@locations_bp.route("/", methods=["POST"]) # <------------------------------------------ CREATE LOCATION ROUTE
def create_location():
    try:
        data = request.get_json()
        location_data = location_schema.load(data)
    except ValidationError as e:
        return jsonify(e.messages), 400

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

@locations_bp.route("/", methods=["GET"]) # <------------------------------------------ GET LOCATIONS ROUTE
def get_locations():
    locations = db.session.execute(select(Location)).scalars().all()
    return locations_schema.jsonify(locations), 200

@locations_bp.route("/<int:page>/<int:per_page>", methods=["GET"]) # <------------------------------------------ GET LOCATIONS BY PAGINATION
def get_locations_paginated(page, per_page):
    if page < 1 or per_page < 1 or per_page > 100:
        return jsonify({"error": "Invalid pagination values"}), 400

    query = select(Location)

    count_q = query.with_only_columns(func.count()).order_by(None)
    total = db.session.execute(count_q).scalar_one()

    results = db.session.execute(
        query.limit(per_page).offset((page - 1) * per_page)
    ).scalars().all()

    if not results:
        return jsonify({"message": "No locations found."}), 404

    return jsonify({
        "data": locations_schema.dump(results)
    }), 200

@locations_bp.route("/<int:location_id>", methods=["GET"]) # <------------------------------------------ GET LOCATION BY ID ROUTE
def get_location(location_id):
    location = db.session.execute(select(Location).where(Location.location_id == location_id)).scalars().first()
    if not location:
        return jsonify({"error": "Location not found"}), 404
    return location_schema.jsonify(location), 200

@locations_bp.route("/<int:location_id>", methods=["PUT"]) # <------------------------------------------ UPDATE LOCATION ROUTE
def update_location(location_id):
    location = db.session.execute(select(Location).where(Location.location_id == location_id)).scalars().first()
    if not location:
        return jsonify({"error": "Location not found"}), 404
    
    try:
        incoming_data = request.get_json()
        location_schema.load(incoming_data, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    fields  =["address", "city", "state", "zip_code", "country", "latitude", "longitude"]
    for field in fields:
        if field in incoming_data:
            setattr(location, field, incoming_data[field])

    db.session.commit()
    return location_schema.jsonify(location), 200

@locations_bp.route("/<int:location_id>", methods=["DELETE"]) # <------------------------------------------ DELETE ROUTE
def delete_location(location_id):
    location = db.session.execute(select(Location).where(Location.location_id == location_id)).scalars().first()
    if not location:
        return jsonify({"error": "Location not found"}), 404
    
    db.session.delete(location)
    db.session.commit()
    return jsonify({"message": "Location deleted successfully"}), 200

@locations_bp.route("/search", methods=["GET"])  # <------------------------------------------ SEARCH LOCATIONS ROUTE
def search_locations():
    city = request.args.get("city")
    state = request.args.get("state")
    zip_code = request.args.get("zip_code")

    query = select(Location)

    if city:
        query = query.where(Location.city.ilike(f"%{city}%"))
    if state:
        query = query.where(Location.state.ilike(f"%{state}%"))
    if zip_code:
        query = query.where(Location.zip_code.ilike(f"%{zip_code}%"))

    locations = db.session.execute(query).scalars().all()

    if not locations:
        return jsonify({"message": "No locations found matching your criteria."}), 404

    return locations_schema.jsonify(locations), 200