from app.models import GeneralNotification, DeliveryNotification, Delivery
from app.extensions import ma
from marshmallow import fields, validate

class GeneralNotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = GeneralNotification
        load_instance = True

class GeneralNotificationCreateSchema(ma.Schema):
    message = fields.Str(required=True, validate=validate.Length(min=1, max=1000))
    user_id = fields.Int(required=True)

class GeneralNotificationUpdateSchema(ma.Schema):
    is_read = fields.Bool()
    message = fields.Str(validate=validate.Length(min=1, max=1000))

class DeliverySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Delivery
        exclude = ['user', 'listing']

class DeliveryNotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeliveryNotification
        load_instance = True
        include_relationships = True

    delivery = fields.Nested(DeliverySchema, dump_only=True)

class DeliveryNotificationCreateSchema(ma.Schema):
    message = fields.Str(required=True, validate=validate.Length(min=1, max=1000))
    type = fields.Str(validate=validate.OneOf(['info', 'warning', 'success', 'error']), load_default='info')
    user_id = fields.Int(required=True)
    delivery_id = fields.Int(required=True)

class BulkNotificationCreateSchema(ma.Schema):
    message = fields.Str(required=True, validate=validate.Length(min=1, max=1000))
    user_ids = fields.List(fields.Int(), required=True, validate=validate.Length(min=1))

# Schema instances
general_notification_schema = GeneralNotificationSchema()
general_notifications_schema = GeneralNotificationSchema(many=True)
general_notification_create_schema = GeneralNotificationCreateSchema()
general_notification_update_schema = GeneralNotificationUpdateSchema()

delivery_notification_schema = DeliveryNotificationSchema()
delivery_notifications_schema = DeliveryNotificationSchema(many=True)
delivery_notification_create_schema = DeliveryNotificationCreateSchema()

bulk_notification_create_schema = BulkNotificationCreateSchema()