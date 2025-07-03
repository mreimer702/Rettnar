from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, Enum, Text, Table, Column
from datetime import datetime
from typing import List
import enum

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx BASE CLASS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class Base(DeclarativeBase):  # <------------------------------------------ Base Class
    pass

db = SQLAlchemy(model_class=Base)

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ASSOCIATION TABLES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

user_roles = Table(  # <------------------------------------------ user_roles association table
    'user_roles',
    Base.metadata,
    Column('user_id', ForeignKey('users.user_id'), primary_key=True),
    Column('role_id', ForeignKey('roles.role_id'), primary_key=True)
)

favorites = Table(  # <------------------------------------------ favorites association table
    'favorites',
    Base.metadata,
    Column('user_id', ForeignKey('users.user_id'), primary_key=True),
    Column('listing_id', ForeignKey('listings.listing_id'), primary_key=True)
)

listing_amenities = Table(  # <------------------------------------------ listing amenities association table
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
#  ---------------------------------------------------------------------          MARK: Will need to look into this asap 
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
    city: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    zip_code: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
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
