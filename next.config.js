/** @type {import('next').NextConfig} */
const path = require('path')
const webpack = require('webpack')

const nextConfig = {
  reactStrictMode: true,
  // react-pdf/fontkit is stable in dev but breaks after SWC minification in production bundles.
  // Fall back to Terser and force the browser builds for client-side PDF generation.
  swcMinify: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@react-pdf/renderer$': require.resolve('@react-pdf/renderer/lib/react-pdf.browser.cjs.js'),
        fontkit$: require.resolve('fontkit').replace(/main\.cjs$/, 'browser.cjs'),
      }
    }

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@swc\/helpers\/_\/_define_property$/,
        require.resolve('@swc/helpers/cjs/_define_property.cjs')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^@swc\/helpers\/_\/_ts_decorate$/,
        require.resolve('@swc/helpers/cjs/_ts_decorate.cjs')
      )
    )

    return config
  },
}

module.exports = nextConfig

