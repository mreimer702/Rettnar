from .schemas import listing_schema, listings_schema
from flask import request, jsonify
from sqlalchemy import select
from app.models import Listing, User, Location, Subcategory, db
from marshmallow import ValidationError
from . import listings_bp
from typing import List, cast

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LISTING ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@listings_bp.route("", methods=["POST"])  # <------------------------------------------ CREATE LISTING ROUTE
def create_listing():
    try:
        data = request.get_json()
        listing_data = listing_schema.load(data)
    except ValidationError as e:
        return jsonify(e.messages), 400

    owner = db.session.get(User, listing_data.owner_id)
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    subcategory = db.session.get(Subcategory, listing_data.subcategory_id)
    if not subcategory:
        return jsonify({"error": "Subcategory not found"}), 404

    location = db.session.get(Location, listing_data.location_id)
    if not location:
        return jsonify({"error": "Location not found"}), 404

    new_listing = Listing( # <--- Create New Listing
        title=listing_data.title,
        description=listing_data.description,
        price=listing_data.price,
        subcategory_id=listing_data.subcategory_id,
        owner_id=listing_data.owner_id,
        location_id=listing_data.location_id
    )

    db.session.add(new_listing)
    db.session.commit()
    return listing_schema.jsonify(new_listing), 201
