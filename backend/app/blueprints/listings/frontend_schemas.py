from app.extensions import ma
from app.models import Listing, User
from marshmallow import fields
from sqlalchemy import func


class FrontendLocationSchema(ma.Schema):
    """Location schema formatted for frontend consumption"""
    lat = fields.Method("get_latitude")
    lng = fields.Method("get_longitude")
    distance = fields.Float(allow_none=True)  # Added when doing nearby searches

    def get_latitude(self, obj):
        return obj.latitude if obj else None
    
    def get_longitude(self, obj):
        return obj.longitude if obj else None


class FrontendOwnerSchema(ma.Schema):
    """Owner schema with expanded information for frontend"""
    id = fields.Method("get_owner_id")
    name = fields.Method("get_owner_name")
    avatar = fields.Method("get_owner_avatar")
    rating = fields.Method("get_owner_rating")

    def get_owner_id(self, obj):
        return str(obj.user_id) if obj else None
    
    def get_owner_name(self, obj):
        if not obj:
            return None
        name_parts = []
        if obj.first_name:
            name_parts.append(obj.first_name)
        if obj.last_name:
            name_parts.append(obj.last_name)
        return " ".join(name_parts) if name_parts else obj.email
    
    def get_owner_avatar(self, obj):
        # TODO: Use actual avatar_url field when added to User model
        return "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"
    
    def get_owner_rating(self, obj):
        # TODO: Calculate actual rating from reviews
        return 4.8


class FrontendListingSchema(ma.Schema):
    """Listing schema formatted for frontend consumption"""
    id = fields.Method("get_listing_id")
    title = fields.Str()
    description = fields.Str()
    price = fields.Float()
    category = fields.Method("get_category_name")
    images = fields.Method("get_image_urls")
    owner = fields.Method("get_owner_info")
    location = fields.Method("get_location_info")
    availability = fields.Method("get_availability_dates")
    rating = fields.Method("get_listing_rating")
    reviews = fields.Method("get_reviews_count")

    def get_listing_id(self, obj):
        return str(obj.listing_id)
    
    def get_category_name(self, obj):
        if obj.subcategory and obj.subcategory.category:
            return obj.subcategory.name
        return "Unknown"
    
    def get_image_urls(self, obj):
        # TODO: Return actual image URLs when images are properly stored
        if obj.images:
            return [img.image_url for img in obj.images]
        # Return placeholder images based on category
        category_name = self.get_category_name(obj).lower()
        if "camera" in category_name or "photography" in category_name:
            return ["https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg"]
        elif "tool" in category_name:
            return ["https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg"]
        else:
            return ["https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"]
    
    def get_owner_info(self, obj):
        from app.models import User
        if obj.owner:
            # If owner is already loaded as relationship
            owner = obj.owner if hasattr(obj, 'owner') and obj.owner else None
            if not owner:
                # Load owner from database
                owner = User.query.get(obj.owner) if isinstance(obj.owner, int) else obj.owner
            
            if owner:
                schema = FrontendOwnerSchema()
                return schema.dump(owner)
        return None
    
    def get_location_info(self, obj):
        if obj.location:
            schema = FrontendLocationSchema()
            return schema.dump(obj.location)
        return None
    
    def get_availability_dates(self, obj):
        # TODO: Return actual availability dates from database
        # For now, return some sample dates
        return ["2024-01-15", "2024-01-16", "2024-01-17"]
    
    def get_listing_rating(self, obj):
        # TODO: Calculate actual rating from reviews
        return 4.8
    
    def get_reviews_count(self, obj):
        # TODO: Count actual reviews
        return len(obj.reviews) if obj.reviews else 24


class FrontendListingsResponseSchema(ma.Schema):
    """Response schema that wraps listings in the format frontend expects"""
    items = fields.List(fields.Nested(FrontendListingSchema)) 