// Babel configuration for Expo SDK 54
// Required for expo-router and react-native-reanimated (drawer animations)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated plugin must be listed last
    plugins: ['react-native-reanimated/plugin'],
  };
};
