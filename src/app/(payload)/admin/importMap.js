import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { VercelBlobClientUploadHandler as VercelBlobClientUploadHandler_7c1d4a9e2b5f8036a4d9e6c2b7f0a35d } from '@payloadcms/storage-vercel-blob/client'

/**
 * Payload's import map: every client component referenced by config must appear here.
 *
 * Normally `payload generate:importmap` writes this file, but that CLI route loads its scripts through
 * tsx, which crashes inside undici in this workspace (see docs/CMS.md). The Vercel Blob client upload
 * handler is therefore declared by hand - the trailing hash is only an identifier, and the key must match
 * the `#componentPath` string the plugin injects into the media collection.
 *
 * @type import('payload').ImportMap
 */
export const importMap = {
  '@payloadcms/next/rsc#CollectionCards': CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
  '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler':
    VercelBlobClientUploadHandler_7c1d4a9e2b5f8036a4d9e6c2b7f0a35d,
}
