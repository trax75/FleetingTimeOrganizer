const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch shared package for changes
config.watchFolders = [workspaceRoot];

// Resolve modules from both project and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Ensure shared package is resolved correctly
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
