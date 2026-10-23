import { permanentRedirect } from 'next/navigation';

/** /company is a hub with no content of its own; it permanently belongs at /company/about. */
export default function CompanyPage() {
  permanentRedirect('/company/about');
}
