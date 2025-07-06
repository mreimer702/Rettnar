from app.models import SearchLog, Location
from app.extensions import ma
from marshmallow import fields, validate

class LocationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Location
        load_instance = True

class SearchLogSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = SearchLog
        load_instance = True
        include_relationships = True

    location = fields.Nested(LocationSchema, dump_only=True)

class SearchLogCreateSchema(ma.SQLAlchemyAutoSchema):

    keyword = fields.Str(required=True, validate=validate.Length(min=1, max=255))

    address = fields.Str(validate=validate.Length(max=200))
    city = fields.Str(validate=validate.Length(max=100))
    state = fields.Str(validate=validate.Length(max=100))
    country = fields.Str(validate=validate.Length(max=100))
    zip_code = fields.Str(validate=validate.Length(max=20))
    latitude = fields.Float()
    longitude = fields.Float()

class SearchAnalyticsSchema(ma.SQLAlchemyAutoSchema):
    
    keyword = fields.Str()
    search_count = fields.Int()
    last_searched = fields.DateTime()

search_log_schema = SearchLogSchema()
search_logs_schema = SearchLogSchema(many=True)
search_log_create_schema = SearchLogCreateSchema()
search_analytics_schema = SearchAnalyticsSchema(many=True)