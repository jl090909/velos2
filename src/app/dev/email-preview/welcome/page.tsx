import { renderWelcome } from '@/lib/email/welcome';

export default function WelcomePreview() {
  if (process.env.NODE_ENV === 'production') {
    return <p>Not available</p>;
  }
  const r = renderWelcome({ firstName: 'Lionel' });
  return (
    <div>
      <p><strong>Subject:</strong> {r.subject}</p>
      <div dangerouslySetInnerHTML={{ __html: r.html }} />
    </div>
  );
}