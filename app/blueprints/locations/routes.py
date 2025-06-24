from .schemas import location_schema, locations_schema
from flask import request, jsonify
from sqlalchemy import select
from app.models import Listing, User, Location, Subcategory, db
from marshmallow import ValidationError
from . import locations_bp
from typing import List, cast

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LOCATION ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@locations_bp.route("/", methods=["POST"])  
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
