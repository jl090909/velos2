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
