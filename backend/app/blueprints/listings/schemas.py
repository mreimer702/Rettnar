from app.models import Listing, Category, Subcategory, Location, Image, Amenity, ListingFeature
from app.extensions import ma
from marshmallow import fields, validate, validates_schema, ValidationError

class LocationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Location
        load_instance = True

class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        exclude = ['listing_id']

class AmenitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Amenity

class ListingFeatureSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ListingFeature
        exclude = ['listing_id']

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category

class SubcategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Subcategory

    category = fields.Nested(CategorySchema, dump_only=True)

class ListingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Listing
        load_instance = True
        include_relationships = True

    location = fields.Nested(LocationSchema)
    images = fields.List(fields.Nested(ImageSchema), many=True, dump_only=True)
    amenities = fields.List(fields.Nested(AmenitySchema), many=True, dump_only=True)
    features = fields.List(fields.Nested(ListingFeatureSchema), many=True, dump_only=True)
    subcategory = fields.Nested(SubcategorySchema, dump_only=True)

    amenity_ids = fields.List(fields.Int(), load_only=True, missing=[])
    feature_data = fields.List(fields.Dict(), load_only=True, missing=[])

class ListingCreateSchema(ListingSchema):
    titled = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(validate=validate.Length(max=1000))
    price = fields.Int(required=True, validate=validate.Range(min=0))
    subcategory_id = fields.Int(required=True)

    adress = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    city = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    state = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    country = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    zip_code = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    latitude = fields.Float(missing=None)
    longitude = fields.Float(missing=None)

    amenity_ids = fields.List(fields.Int(), missing=[])
    features = fields.List(fields.Dict(), missing=[])

class ListingUpdateSchema(ListingSchema):
    titled = fields.Str(validate=validate.Length(min=1, max=100))
    description = fields.Str(validate=validate.Length(max=1000))
    price = fields.Int(validate=validate.Range(min=0))
    subcategory_id = fields.Int()

    adress = fields.Str(validate=validate.Length(min=1, max=200))
    city = fields.Str(validate=validate.Length(min=1, max=100))
    state = fields.Str(validate=validate.Length(min=1, max=100))
    country = fields.Str(validate=validate.Length(min=1, max=100))
    zip_code = fields.Str(validate=validate.Length(min=1, max=20))
    latitude = fields.Float()
    longitude = fields.Float()

    amenity_ids = fields.List(fields.Int(), missing=None)
    features = fields.List(fields.Dict(), missing=None)

listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
listing_create_schema = ListingCreateSchema()
listing_update_schema = ListingUpdateSchema()
