import { permanentRedirect } from 'next/navigation';

/**
 * Legacy standalone landing page, folded into /product when the CMS took over.
 *
 * This used to be a 'use client' component that called router.replace('/product') after mount:
 * an unindexable blank shell that flashed empty for every visitor. A server-side permanent
 * redirect answers 308 before any HTML is sent.
 */
export default function VeloshieldPage(): never {
  permanentRedirect('/product');
}
