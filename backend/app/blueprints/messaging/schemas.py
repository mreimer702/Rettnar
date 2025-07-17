from app.models import Message, User
from app.extensions import ma
from marshmallow import fields, validate


class MessageSchema(ma.SQLAlchemyAutoSchema):
    """Schema for Message model"""
    class Meta:
        model = Message
        load_instance = True

    sender = fields.Nested('UserSchema', exclude=['password_hash', 'bookings', 'listings'], dump_only=True)
    receiver = fields.Nested('UserSchema', exclude=['password_hash', 'bookings', 'listings'], dump_only=True)


class MessageCreateSchema(ma.Schema):
    """Schema for creating new messages"""
    text = fields.Str(required=True, validate=validate.Length(min=1, max=1000))
    receiver_id = fields.Int(required=True)


class ConversationSchema(ma.Schema):
    """Schema for conversation response"""
    id = fields.Str()
    participant = fields.Dict()
    lastMessage = fields.Dict()
    item = fields.Dict()


# Schema instances
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)
message_create_schema = MessageCreateSchema()
conversation_schema = ConversationSchema()
conversations_schema = ConversationSchema(many=True)
