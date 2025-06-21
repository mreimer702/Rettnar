from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, Enum, Text, Table, Column, select
from datetime import datetime
from typing import List, cast
from flask_marshmallow import Marshmallow
from marshmallow import ValidationError, fields
import enum
from passwords import password


# Instance
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:{password}@localhost/renttar_db'

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx BASE CLASS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
class Base(DeclarativeBase):  # <------------------------------------------ Base Class
    pass

db = SQLAlchemy(model_class=Base)
ma = Marshmallow()

db.init_app(app)
ma.init_app(app)

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ASSOCIATION TABLES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

user_roles = Table(  # <------------------------------------------ user_roles association model
    'user_roles',
    Base.metadata,
    Column('user_id', ForeignKey('users.user_id'), primary_key=True),
    Column('role_id', ForeignKey('roles.role_id'), primary_key=True)
)

favorites = Table(  # <------------------------------------------ favorites association model
    'favorites',
    Base.metadata,
    Column('user_id', ForeignKey('users.user_id'), primary_key=True),
    Column('listing_id', ForeignKey('listings.listing_id'), primary_key=True)
)

listing_amenities = Table(  # <------------------------------------------ listing amenities association model
    "listing_amenities",
    Base.metadata,
    Column('listing_id', ForeignKey('listings.listing_id'), primary_key=True),
    Column('amenity_id', ForeignKey('amenities.amenity_id'), primary_key=True)
)

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx MODELS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
class Role(Base):  # <------------------------------------------ Role Model
    __tablename__ = "roles"

    role_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)

    users: Mapped[List["User"]] = relationship("User", secondary=user_roles, back_populates="roles")

class User(Base):  # <------------------------------------------ User Model
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"), nullable=True)

    roles: Mapped[List["Role"]] = relationship("Role", secondary=user_roles, back_populates="users")
    listings: Mapped[List["Listing"]] = relationship("Listing", back_populates="owner")
    sent_messages: Mapped[List["Message"]] = relationship("Message", back_populates="sender", foreign_keys="[Message.sender_id]")
    received_messages: Mapped[List["Message"]] = relationship("Message", back_populates="receiver", foreign_keys="[Message.receiver_id]")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="user")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="user")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="user")
    favorites: Mapped[List["Listing"]] = relationship("Listing", secondary=favorites, back_populates="favorited_by")
    notifications: Mapped[List["GeneralNotification"]] = relationship("GeneralNotification", back_populates="user")
    search_logs: Mapped[List["SearchLog"]] = relationship("SearchLog", back_populates="user")
    delivery_notifications: Mapped[List["DeliveryNotification"]] = relationship("DeliveryNotification", back_populates="user")
    deliveries: Mapped[List["Delivery"]] = relationship("Delivery", back_populates="user")
    location: Mapped["Location"] = relationship("Location")

class Listing(Base):  # <------------------------------------------ Listing Model
    __tablename__ = "listings"

    listing_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    subcategory_id: Mapped[int] = mapped_column(ForeignKey("subcategories.subcategory_id"))
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))

    owner: Mapped["User"] = relationship("User", back_populates="listings")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="listing")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="listing")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="listing")
    favorited_by: Mapped[List["User"]] = relationship("User", secondary=favorites, back_populates="favorites")
    availability: Mapped[List["Availability"]] = relationship("Availability", back_populates="listing")
    images: Mapped[List["Image"]] = relationship("Image", back_populates="listing")
    subcategory: Mapped["Subcategory"] = relationship("Subcategory", back_populates="listings")
    location: Mapped["Location"] = relationship("Location", back_populates="listing")
    deliveries: Mapped[List["Delivery"]] = relationship("Delivery", back_populates="listing")
    amenities: Mapped[List["Amenity"]] = relationship("Amenity", secondary=listing_amenities, back_populates="listings")
    features: Mapped[List["ListingFeature"]] = relationship("ListingFeature", back_populates="listing")

class Message(Base):  # <------------------------------------------ Message Model
    __tablename__ = "messages"

    message_id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    sender_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)

    sender: Mapped["User"] = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

class Payment(Base):  # <------------------------------------------ Payment Model
    __tablename__ = "payment"

    payment_id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[float] = mapped_column(nullable=False)
    paid_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="payments")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="payments")

class BookingStatusEnum(enum.Enum):  # <------------------------------------------ Booking Status Model
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class Booking(Base):  # <------------------------------------------ Booking Model
    __tablename__ = "bookings"

    booking_id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[datetime] = mapped_column(nullable=False)
    end_date: Mapped[datetime] = mapped_column(nullable=False)
    status: Mapped[BookingStatusEnum] = mapped_column(Enum(BookingStatusEnum, native_enum=False), default=BookingStatusEnum.PENDING)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="bookings")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="bookings")

class Review(Base):  # <------------------------------------------ Review Model
    __tablename__ = "reviews"

    review_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.user_id'), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey('listings.listing_id'), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="reviews")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="reviews")

class Availability(Base):  # <------------------------------------------ Availability Model
    __tablename__ = "availability"

    availability_id: Mapped[int] = mapped_column(primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(nullable=False)
    end_date: Mapped[datetime] = mapped_column(nullable=False)
    is_available: Mapped[bool] = mapped_column(default=True, nullable=False)

    listing: Mapped["Listing"] = relationship("Listing", back_populates="availability")

class Image(Base):  # <------------------------------------------ Image Model
    __tablename__ = "images"

    image_id: Mapped[int] = mapped_column(primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    is_primary: Mapped[bool] = mapped_column(default=False, nullable=False)

    listing: Mapped["Listing"] = relationship("Listing", back_populates="images")

class Category(Base):  # <------------------------------------------ Category Model
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    subcategories: Mapped[List["Subcategory"]] = relationship("Subcategory", back_populates="category")

class Subcategory(Base):  # <------------------------------------------ Subcategory Model
    __tablename__ = "subcategories"

    subcategory_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.category_id"), nullable=False)

    category: Mapped["Category"] = relationship("Category", back_populates="subcategories")
    listings: Mapped[List["Listing"]] = relationship("Listing", back_populates="subcategory")

class Location(Base):  # <------------------------------------------ Location Model
    __tablename__ = "locations"

    location_id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    state: Mapped[str] = mapped_column(String(50), nullable=False)
    zip_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(50), nullable=False)
    latitude: Mapped[float] = mapped_column(nullable=True)
    longitude: Mapped[float] = mapped_column(nullable=True)

    listing: Mapped["Listing"] = relationship("Listing", back_populates="location", uselist=False)
    search_logs: Mapped[List["SearchLog"]] = relationship("SearchLog", back_populates="location")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="location", uselist=False)
    search_logs: Mapped[List["SearchLog"]] = relationship("SearchLog", back_populates="location")

class GeneralNotification(Base):  # <------------------------------------------ General Notifications Model
    __tablename__ = "general_notifications"

    notification_id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=True)

    user:Mapped["User"] = relationship("User", back_populates="notifications")

class SearchLog(Base):  # <------------------------------------------ Search Log Model
    __tablename__ = "search_logs"

    search_log_id: Mapped[int] = mapped_column(primary_key=True)
    keyword: Mapped[str] = mapped_column(String(255), nullable=False)
    searched_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))

    location: Mapped["Location"] = relationship("Location", back_populates="search_logs")
    user: Mapped["User"] = relationship("User", back_populates="search_logs")

class Delivery(Base):  # <------------------------------------------ Delivery Model
    __tablename__ = "deliveries"

    delivery_id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    scheduled_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="deliveries")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="deliveries")
    delivery_notifications: Mapped[List["DeliveryNotification"]] = relationship("DeliveryNotification", back_populates="delivery")

class DeliveryNotification(Base):  # <------------------------------------------ Delivery Notification Model
    __tablename__ = "delivery_notifications"

    delivery_notification_id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="info")
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    delivery_id: Mapped[int] = mapped_column(ForeignKey("deliveries.delivery_id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="delivery_notifications")
    delivery: Mapped["Delivery"] = relationship("Delivery", back_populates="delivery_notifications")

class Amenity(Base):  # <------------------------------------------ Amenity Model
    __tablename__ = "amenities"

    amenity_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    listings: Mapped[List["Listing"]] = relationship("Listing", secondary=listing_amenities, back_populates="amenities")

class ListingFeature(Base):  # <------------------------------------------ Listing Feature Model
    __tablename__ = "listing_features"

    feature_id: Mapped[int] = mapped_column(primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"))
    key: Mapped[str] = mapped_column(String(100))
    value: Mapped[str] = mapped_column(String(100))

    listing: Mapped["Listing"] = relationship("Listing", back_populates="features")

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx SCHEMAS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class RoleSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Role Schema
    class Meta:
        model = Role
        load_instance = True

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

class LocationSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Location Schema
    class Meta:
        model = Location
        load_instance = True

location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Users Schema
    roles = fields.Nested(RoleSchema, many=True, dump_only=True)
    location = fields.Nested(LocationSchema, dump_only=True)
    
    address = fields.String(required=True)
    city = fields.String(required=True)
    state = fields.String(required=True)
    zip_code = fields.String(required=True)
    country = fields.String(required=True)

    role_ids = fields.List(fields.Integer(), load_only=True, required=True, error_messages={"required": "Role is required."})
    class Meta:
        model = User
        load_instance = True
        include_fk = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ROLE ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@app.route("/roles", methods=["POST"])  # <------------------------------------------ CREATE ROLE ROUTE
def create_role():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Role name is required"}), 400

    existing = db.session.execute(select(Role).where(Role.name == name)).scalars().first()
    if existing:
        return jsonify({"error": "Role already exists"}), 400

    new_role = Role(name=name)
    db.session.add(new_role)
    db.session.commit()
    return role_schema.jsonify(new_role), 201

@app.route("/roles", methods=["GET"])  # <------------------------------------------ GET ALL ROLES ROUTE
def get_roles():
    roles = db.session.execute(select(Role)).scalars().all()
    return roles_schema.jsonify(roles), 200

@app.route("/roles/<int:role_id>", methods=["GET"])  # <------------------------------------------ GET ROLE BY ID ROUTE
def get_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return role_schema.jsonify(role), 200

@app.route("/roles/<int:role_id>", methods=["PUT"])  # <------------------------------------------ UPDATE ROLE
def update_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "New role name is required"}), 400

    existing = db.session.execute(
        select(Role).where(Role.name == new_name, Role.role_id != role_id)
    ).scalars().first()
    if existing:
        return jsonify({"error": "Role name already exists"}), 400

    role.name = new_name
    db.session.commit()
    return role_schema.jsonify(role), 200

@app.route("/roles/<int:role_id>", methods=["DELETE"])  # <------------------------------------------ DELETE ROLE
def delete_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": f"Role '{role.name}' deleted successfully"}), 200

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx USER ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@app.route("/users", methods=['POST'])  # <------------------------------------------ CREATE USER ROUTE
def create_user():
    try:
        incoming_data = request.get_json()
        user_data = user_schema.load(incoming_data)
    except ValidationError as e:
        return jsonify(e.messages), 400

    if db.session.execute(select(User).where(User.email == user_data.email)).scalars().first():
        return jsonify({"error": "Email already exists"}), 400

    role_ids = incoming_data.get("role_ids")
    roles_query = select(Role).where(Role.role_id.in_(role_ids))
    matched_roles = db.session.execute(roles_query).scalars().all()
    if len(matched_roles) != len(role_ids):
        return jsonify({"error": "One or more roles not found"}), 404

    new_location = Location(
        address=incoming_data["address"],
        city=incoming_data["city"],
        state=incoming_data["state"],
        zip_code=incoming_data["zip_code"],
        country=incoming_data["country"]
    )
    db.session.add(new_location)
    db.session.flush()  

    new_user = User(
        first_name=user_data.first_name,
        email=user_data.email,
        location_id=new_location.location_id,
        roles=matched_roles
    )

    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 201

@app.route("/users", methods=['GET'])  # <------------------------------------------ GET ALL USERS ROUTE
def get_users():
    users = db.session.execute(select(User)).scalars().all()
    return users_schema.jsonify(users), 200

@app.route("/users/<int:user_id>", methods=['GET'])  # <------------------------------------------ GET USER BY ID ROUTE
def get_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return user_schema.jsonify(user), 200

@app.route("/users/<int:user_id>", methods=['PUT'])  # <------------------------------------------ UPDATE USER ROUTE
def update_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        incoming_data = request.get_json()
        user_schema.load(incoming_data, partial=True)  # <--- Validating 
    except ValidationError as e:
        return jsonify(e.messages), 400

    if "first_name" in incoming_data:
        user.first_name = incoming_data["first_name"]

    if "email" in incoming_data:
        existing_user = db.session.execute(
            select(User).where(User.email == incoming_data["email"], User.user_id != user_id)
        ).scalars().first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400
        user.email = incoming_data["email"]

    location_fields = ["address", "city", "state", "zip_code", "country"] # <--- Location Update
    if all(field in incoming_data for field in location_fields):
        new_location = Location(
            address=incoming_data["address"],
            city=incoming_data["city"],
            state=incoming_data["state"],
            zip_code=incoming_data["zip_code"],
            country=incoming_data["country"]
        )
        db.session.add(new_location)
        db.session.flush()
        user.location_id = new_location.location_id

    if "role_ids" in incoming_data: # <--- Role Update
        role_ids = incoming_data.get("role_ids")
        roles_query = select(Role).where(Role.role_id.in_(role_ids))
        matched_roles = db.session.execute(roles_query).scalars().all()
        
        if len(matched_roles) != len(role_ids):
            return jsonify({"error": "One or more roles not found"}), 404
        user.roles = cast(List[Role], matched_roles)

    db.session.commit()
    return user_schema.jsonify(user), 200

@app.route("/users/<int:user_id>", methods=['DELETE'])  # <------------------------------------------ DELETE USER ROUTE
def delete_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx CREATE ALL TABLES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

with app.app_context():
    db.drop_all()
    db.create_all()

app.run(debug=True)
