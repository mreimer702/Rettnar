from app.extensions import ma
from app.models import Subcategory, Location, Amenity, ListingFeature, User, Listing
from marshmallow import fields

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LISTING Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class SubcategorySchema(ma.SQLAlchemyAutoSchema):  # <--- Nesting Schema
    class Meta:
        model = Subcategory
        load_instance = True

class LocationSchema(ma.SQLAlchemyAutoSchema):  # <--- Nesting Schema
    class Meta:
        model = Location
        load_instance = True

class AmenitySchema(ma.SQLAlchemyAutoSchema):  # <--- Nesting Schema
    class Meta:
        model = Amenity
        load_instance = True

class ListingFeatureSchema(ma.SQLAlchemyAutoSchema):  # <--- Nesting Schema
    class Meta:
        model = ListingFeature
        load_instance = True

class UserMiniSchema(ma.SQLAlchemyAutoSchema):  # <--- Nesting Schema
    class Meta:
        model = User
        fields = ("user_id", "first_name", "email")
        load_instance = True

class ListingSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Listing Schema
    owner = fields.Nested(UserMiniSchema, dump_only=True)
    location = fields.Nested(LocationSchema, dump_only=True)
    subcategory = fields.Nested(SubcategorySchema, dump_only=True)
    amenities = fields.Nested(AmenitySchema, many=True, dump_only=True)
    features = fields.Nested(ListingFeatureSchema, many=True, dump_only=True)

    subcategory_id = fields.Integer(required=True)
    owner_id = fields.Integer(required=True)
    location_id = fields.Integer(required=True)

    class Meta:
        model = Listing
        load_instance = True
        include_fk = True

listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
