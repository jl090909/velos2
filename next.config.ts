import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  /**
   * Browsing this machine by its WSL address (http://172.24.x.x:3020) is a different host as far as
   * the dev server is concerned, and Next blocks cross-origin /_next requests for hosts it does not
   * know. The page then arrives server-rendered but never hydrates, which looks exactly like broken
   * buttons. Allowlisting the LAN/WSL hosts fixes that.
   */
  allowedDevOrigins: ['172.24.222.122', '172.24.*.*', 'localhost', '*.local'],
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      // The OT carousel slides ship with the app (public/ot-carousel) rather than through the CMS,
      // so next/image needs that path allowlisted too.
      { pathname: '/ot-carousel/**' },
    ],
  },
  trailingSlash: true,
  /**
   * Baseline response hardening. HSTS was already present via the platform; these were not.
   * Deliberately no CSP here: the CMS admin and Next's inline bootstrap need a nonce/hash
   * pipeline, and a guessed policy would break /admin rather than protect it. Add CSP as a
   * separate, tested change.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ]
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
