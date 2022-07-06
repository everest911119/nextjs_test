/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
};
const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig);
