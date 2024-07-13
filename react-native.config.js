/**
 * When using auto linking, it will automatically add all fonts to the Build Phases, Copy Pods Resources.
 * Which will end up in your bundle. To avoid that, create a react-native.config.js file at the root of your react-native project with:
 */
module.exports = {
  dependencies: {
    "react-native-vector-icons": {
      platforms: {
        ios: null,
      },
    },
  },
};
