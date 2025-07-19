#!/usr/bin/env python3
"""
Script to add sample data to the database for testing
"""

from app import create_app
from app.models import db, User, Role, Category, Subcategory, Location, Listing, Amenity
from werkzeug.security import generate_password_hash
from datetime import datetime
from sqlalchemy import select

def add_sample_data():
    """Add sample data to the database"""
    app = create_app('development')
    
    with app.app_context():
        print("🚀 Adding sample data...")
        
        # Create roles
        admin_role = Role(name="admin")
        user_role = Role(name="user")
        db.session.add_all([admin_role, user_role])
        db.session.flush()  # Get IDs
        
        # Create sample locations
        sf_location = Location(
            address="123 Market St",
            city="San Francisco",
            state="CA",
            country="USA",
            zip_code="94105",
            latitude=37.7749,
            longitude=-122.4194
        )
        
        nyc_location = Location(
            address="456 Broadway",
            city="New York",
            state="NY", 
            country="USA",
            zip_code="10013",
            latitude=40.7128,
            longitude=-74.0060
        )
        
        db.session.add_all([sf_location, nyc_location])
        db.session.flush()
        
        # Create sample users
        admin_user = User(
            first_name="Admin",
            last_name="User",
            email="admin@rettnar.com",
            password_hash=generate_password_hash("admin123"),
            location_id=sf_location.location_id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.roles = [admin_role, user_role]
        
        test_user = User(
            first_name="Test",
            last_name="User", 
            email="test@example.com",
            password_hash=generate_password_hash("test123"),
            location_id=nyc_location.location_id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        test_user.roles = [user_role]
        
        john_doe = User(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password_hash=generate_password_hash("password123"),
            location_id=sf_location.location_id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        john_doe.roles = [user_role]
        
        db.session.add_all([admin_user, test_user, john_doe])
        db.session.flush()
        
        # Create categories and subcategories
        equipment_category = Category(name="Equipment")
        venue_category = Category(name="Venues")
        vehicle_category = Category(name="Vehicles")
        
        db.session.add_all([equipment_category, venue_category, vehicle_category])
        db.session.flush()
        
        # Equipment subcategories
        camera_subcat = Subcategory(name="Camera & Photography", category_id=equipment_category.category_id)
        tools_subcat = Subcategory(name="Tools & Construction", category_id=equipment_category.category_id)
        sports_subcat = Subcategory(name="Sports Equipment", category_id=equipment_category.category_id)
        
        # Venue subcategories
        event_subcat = Subcategory(name="Event Spaces", category_id=venue_category.category_id)
        studio_subcat = Subcategory(name="Studios", category_id=venue_category.category_id)
        
        # Vehicle subcategories
        car_subcat = Subcategory(name="Cars", category_id=vehicle_category.category_id)
        bike_subcat = Subcategory(name="Bikes", category_id=vehicle_category.category_id)
        
        db.session.add_all([camera_subcat, tools_subcat, sports_subcat, event_subcat, studio_subcat, car_subcat, bike_subcat])
        db.session.flush()
        
        # Create amenities
        wifi_amenity = Amenity(name="WiFi")
        parking_amenity = Amenity(name="Parking")
        kitchen_amenity = Amenity(name="Kitchen")
        
        db.session.add_all([wifi_amenity, parking_amenity, kitchen_amenity])
        db.session.flush()
        
        # Create sample listings
        camera_listing = Listing(
            title="Professional DSLR Camera Kit",
            description="Complete DSLR camera setup perfect for professional photography and videography. Includes camera body, multiple lenses (50mm, 85mm, 24-70mm), tripod, extra batteries, memory cards, and carrying case.",
            price=45,
            subcategory_id=camera_subcat.subcategory_id,
            owner_id=john_doe.user_id,
            location_id=sf_location.location_id
        )
        
        drill_listing = Listing(
            title="DeWalt Power Drill Set",
            description="Professional grade power tools for construction and DIY projects. Includes drill, bits, charger, and carrying case.",
            price=25,
            subcategory_id=tools_subcat.subcategory_id,
            owner_id=test_user.user_id,
            location_id=nyc_location.location_id
        )
        
        studio_listing = Listing(
            title="Photography Studio Space",
            description="Professional photography studio with lighting equipment, backdrops, and props. Perfect for portrait sessions and product photography.",
            price=100,
            subcategory_id=studio_subcat.subcategory_id,
            owner_id=admin_user.user_id,
            location_id=sf_location.location_id
        )
        
        db.session.add_all([camera_listing, drill_listing, studio_listing])
        
        # Commit all changes
        db.session.commit()
        
        print("✅ Sample data added successfully!")
        print(f"📊 Created:")
        print(f"   - {len([admin_role, user_role])} roles")
        print(f"   - {len([admin_user, test_user, john_doe])} users")
        print(f"   - {len([equipment_category, venue_category, vehicle_category])} categories")
        print(f"   - {len([camera_subcat, tools_subcat, sports_subcat, event_subcat, studio_subcat, car_subcat, bike_subcat])} subcategories")
        print(f"   - {len([sf_location, nyc_location])} locations")
        print(f"   - {len([camera_listing, drill_listing, studio_listing])} listings")
        print(f"   - {len([wifi_amenity, parking_amenity, kitchen_amenity])} amenities")
        
        print("\n👥 Test User Credentials:")
        print("   - admin@rettnar.com / admin123 (Admin)")
        print("   - test@example.com / test123 (User)")
        print("   - john.doe@example.com / password123 (User)")

def add_or_update_user(first_name, last_name, email, password_hash, phone, location_id):
    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalars().first()

    if existing_user:
        print(f"⚠️ User with email {email} already exists. Updating...")
        existing_user.first_name = first_name
        existing_user.last_name = last_name
        existing_user.password_hash = password_hash
        existing_user.phone = phone
        existing_user.location_id = location_id
    else:
        print(f"✅ Adding new user with email {email}.")
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=password_hash,
            phone=phone,
            location_id=location_id,
            is_active=True
        )
        db.session.add(new_user)

    db.session.commit()

def add_sample_user(first_name, last_name, email, password_hash, phone, location_id):
    # Check if the user already exists
    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalars().first()

    if existing_user:
        print(f"⚠️ User with email {email} already exists. Skipping...")
        return

    # Add the new user
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash,
        phone=phone,
        location_id=location_id,
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()
    print(f"✅ User {email} added successfully.")

if __name__ == "__main__":
    add_sample_data()