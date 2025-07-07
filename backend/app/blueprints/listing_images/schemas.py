from app.models import Image
from app.extensions import ma
from marshmallow import fields, validate, validates_schema, ValidationError

class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True

class ImageCreateSchema(ma.Schema):
    url = fields.Str(required=True, validate=validate.Length(min=1, max=500))
    is_primary = fields.Bool(load_default=False)

class ImageUpdateSchema(ma.Schema):
    url = fields.Str(required=False, validate=validate.Length(min=1, max=500))
    is_primary = fields.Bool(load_default=False)

class BulkImageCreateSchema(ma.Schema):
    images = fields.List(fields.Nested(ImageCreateSchema), required=True, validate=validate.Length(min=1, max=10))

image_schema = ImageSchema()
images_schema = ImageSchema(many=True)
image_create_schema = ImageCreateSchema()
image_update_schema = ImageUpdateSchema()
bulk_image_create_schema = BulkImageCreateSchema()