// Simple Node.js test to verify frontend-backend connectivity
// This simulates what the React Native app would do

const API_BASE_URL = 'http://localhost:5000/api';

async function testConnectivity() {
  console.log('🧪 Testing Frontend-Backend Connectivity...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test 2: Auth login endpoint (should work with our sample data)
    console.log('\n2. Testing auth login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Auth login:', {
        message: loginData.message,
        userFirstName: loginData.user?.first_name,
        tokenReceived: !!loginData.token
      });
      
      // Test 3: Protected endpoint with token
      console.log('\n3. Testing protected endpoint...');
      const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Protected endpoint:', {
          userEmail: profileData.email,
          firstName: profileData.first_name
        });
      } else {
        console.log('❌ Protected endpoint failed:', profileResponse.status);
      }
      
    } else {
      console.log('❌ Auth login failed:', loginResponse.status);
      const errorData = await loginResponse.text();
      console.log('Error details:', errorData);
    }

    // Test 4: Listings endpoint
    console.log('\n4. Testing listings endpoint...');
    const listingsResponse = await fetch(`${API_BASE_URL}/listings/`);
    if (listingsResponse.ok) {
      const listingsData = await listingsResponse.json();
      console.log('✅ Listings endpoint:', {
        listingsCount: listingsData.listings?.length || 0,
        totalInDb: listingsData.pagination?.total || 0
      });
    } else {
      console.log('❌ Listings endpoint failed:', listingsResponse.status);
    }

    // Test 5: Nearby listings endpoint
    console.log('\n5. Testing nearby listings endpoint...');
    const nearbyResponse = await fetch(`${API_BASE_URL}/listings/nearby?lat=37.7749&lng=-122.4194&radius=50`);
    if (nearbyResponse.ok) {
      const nearbyData = await nearbyResponse.json();
      console.log('✅ Nearby listings endpoint:', {
        nearbyCount: nearbyData.listings?.length || 0,
        center: nearbyData.pagination?.center
      });
    } else {
      console.log('❌ Nearby listings endpoint failed:', nearbyResponse.status);
    }

  } catch (error) {
    console.log('❌ Connectivity test failed:', error.message);
  }
  
  console.log('\n✅ Connectivity testing complete!');
}

// Run if this file is executed directly
if (require.main === module) {
  testConnectivity();
}

module.exports = { testConnectivity }; 