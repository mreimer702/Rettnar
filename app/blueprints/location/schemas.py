from app.extensions import ma
from app.models import Location

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx LOCATION Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


class LocationSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Location Schema
    class Meta:
        model = Location
        load_instance = True

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)