from app.extensions import ma
from app.models import Location
from marshmallow import fields

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LOCATION Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class LocationSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Location Schema
    latitude = fields.Float()
    longitude = fields.Float()
    class Meta:
        model = Location
        load_instance = True

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)