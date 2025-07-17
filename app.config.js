export default {
  expo: {
    name: "Renttar",
    slug: "renttar", 
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single", 
      favicon: "./assets/images/favicon.png"
    },
    plugins: ["expo-router", "expo-font", "expo-web-browser", "expo-image-picker"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Environment variables
      useMockApi: process.env.USE_MOCK_API || "false",
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000/api"
    }
  }
}; 