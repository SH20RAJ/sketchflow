'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading';

export default function LogoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      signOut({ redirect: false }).then(() => {
        router.push('/');
      });
    } else {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
