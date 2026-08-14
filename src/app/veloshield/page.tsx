'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VeloshieldPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/product');
  }, [router]);
  return null;
}
