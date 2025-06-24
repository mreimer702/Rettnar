from .schemas import location_schema, locations_schema
from flask import request, jsonify
from sqlalchemy import select
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
