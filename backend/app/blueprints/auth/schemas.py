from app.extensions import ma
from app.models import User, Location
from marshmallow import fields


class AuthLocationSchema(ma.Schema):
    """Simplified location schema for auth responses to match frontend expectations"""
    lat = fields.Method("get_latitude")
    lng = fields.Method("get_longitude") 
    address = fields.Method("get_formatted_address")

    def get_latitude(self, obj):
        return obj.latitude if obj else None
    
    def get_longitude(self, obj):
        return obj.longitude if obj else None
    
    def get_formatted_address(self, obj):
        if not obj:
            return None
        # Create a simple address format like "San Francisco, CA"
        parts = []
        if obj.city:
            parts.append(obj.city)
        if obj.state:
            parts.append(obj.state)
        return ", ".join(parts) if parts else obj.address


class AuthUserSchema(ma.Schema):
    """User schema for auth responses to match frontend expectations"""
    id = fields.Method("get_user_id")
    email = fields.Str()
    firstName = fields.Method("get_first_name")
    lastName = fields.Method("get_last_name")
    avatar = fields.Method("get_avatar")
    location = fields.Nested(AuthLocationSchema)

    def get_user_id(self, obj):
        return str(obj.user_id)
    
    def get_first_name(self, obj):
        return obj.first_name
    
    def get_last_name(self, obj):
        return obj.last_name
    
    def get_avatar(self, obj):
        # For now, return a placeholder avatar URL
        # TODO: Add avatar_url field to User model
        return "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"


class AuthResponseSchema(ma.Schema):
    """Complete auth response schema matching frontend expectations"""
    token = fields.Str()
    user = fields.Nested(AuthUserSchema) 