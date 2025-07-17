#!/usr/bin/env python3
"""
Test script for listings endpoints
"""

import requests
import threading
import time
from app import create_app

def test_listings():
    # Start app in background
    app = create_app('development')

    def run_app():
        app.run(debug=False, host='localhost', port=5003, use_reloader=False)

    server_thread = threading.Thread(target=run_app, daemon=True)
    server_thread.start()
    time.sleep(2)

    print("🧪 Testing Listings Endpoints...")

    # Test nearby endpoint with San Francisco coordinates
    try:
        # SF coordinates: 37.7749, -122.4194
        response = requests.get('http://localhost:5003/api/listings/nearby?lat=37.7749&lng=-122.4194&radius=50')
        print(f'✅ Nearby listings test: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            listings = data.get("listings", [])
            pagination = data.get("pagination", {})
            print(f'   Found {len(listings)} listings within 50km of SF')
            print(f'   Total in DB: {pagination.get("total", 0)}')
            for listing in listings[:2]:  # Show first 2
                title = listing.get("title", "N/A")
                price = listing.get("price", "N/A")
                print(f'   - {title} (${price})')
        else:
            print(f'   Error: {response.text}')
    except Exception as e:
        print(f'❌ Nearby test failed: {e}')

    # Test regular listings endpoint  
    try:
        response = requests.get('http://localhost:5003/api/listings/')
        print(f'✅ Regular listings test: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            listings = data.get("listings", [])
            print(f'   Found {len(listings)} total listings')
        else:
            print(f'   Error: {response.text}')
    except Exception as e:
        print(f'❌ Regular listings test failed: {e}')

    print('✅ Listings testing complete!')

if __name__ == "__main__":
    test_listings() 