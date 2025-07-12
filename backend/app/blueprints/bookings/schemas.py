from app.extensions import ma
from app.models import Booking, BookingStatusEnum
from marshmallow import fields, validate

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx BOOKING Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class BookingSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Booking Schema
    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)
    user_id = fields.Integer(required=True)
    listing_id = fields.Integer(required=True)
    status = fields.String(
        validate=validate.OneOf([status.value for status in BookingStatusEnum]),
        load_default=BookingStatusEnum.PENDING.value
    )

    class Meta:
        model = Booking
        load_instance = True
        include_fk = True

booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)