#!/bin/bash

# SafeAreaWrapper iOS Testing Script
# This script helps verify that the SafeAreaWrapper implementation is working correctly

echo "🚀 Testing SafeAreaWrapper Implementation for iOS..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if SafeAreaWrapper exists
if [ ! -f "src/assets/components/SafeAreaWrapper.js" ]; then
    echo "❌ Error: SafeAreaWrapper.js not found"
    exit 1
fi

echo "✅ SafeAreaWrapper component found"

# Check for updated screens
updated_screens=("HomePage.js" "LoginPage.js" "RegisterPage.js" "OnboardingScreen.js")
for screen in "${updated_screens[@]}"; do
    if grep -q "SafeAreaWrapper" "src/assets/screens/$screen"; then
        echo "✅ $screen is using SafeAreaWrapper"
    else
        echo "⚠️  $screen may not be using SafeAreaWrapper yet"
    fi
done

echo ""
echo "📱 To test on iOS simulator:"
echo "1. Run: npx expo start"
echo "2. Press 'i' to open iOS simulator"
echo "3. Test the following screens:"
echo "   - Onboarding Screen (initial screen)"
echo "   - Home Page"
echo "   - Login Page"  
echo "   - Register Page"
echo ""
echo "🔍 What to check:"
echo "   - Content doesn't overlap with notch or home indicator"
echo "   - Status bar is visible and properly styled"
echo "   - Navigation between screens is smooth"
echo "   - No double padding or spacing issues"
echo ""
echo "📋 Remaining screens to update (see SafeAreaWrapper-Implementation-Guide.md):"

# List screens that haven't been updated yet
remaining_screens=("ProductPage.js" "AccountPage.js" "AddPaymentPage.js" "DraftsPage.js" "EquipmentPage.js" "ListingPage.js" "MapPage.js" "NotificationPage.js" "PaymentPage.js" "ProfilePage.js" "RentalPages.js" "SearchResultPage.js" "UploadPage.js" "VenuePage.js")

for screen in "${remaining_screens[@]}"; do
    if [ -f "src/assets/screens/$screen" ]; then
        if ! grep -q "SafeAreaWrapper" "src/assets/screens/$screen"; then
            echo "   - $screen"
        fi
    fi
done

echo ""
echo "📖 For detailed implementation instructions, see:"
echo "   SafeAreaWrapper-Implementation-Guide.md"
