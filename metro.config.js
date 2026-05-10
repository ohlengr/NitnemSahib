// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Tell Metro to recognize and bundle .sqlite files
config.resolver.assetExts.push('sqlite');

module.exports = config;
