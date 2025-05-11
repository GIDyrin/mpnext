import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { AppLayout, Welcome } from '@/modules';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const authStatus = !!cookies.refresh;
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      router.push('/usermp');
    }
  }, [router]);

  if (isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="w-full max-w-4xl px-4">
        <div className="text-center">
          <Welcome />
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <span className="mr-2">🚀</span> Get Started
            </Link>
            <Link
              href="/register"
              className="border-2 border-green-500 text-green-400 hover:bg-green-900 px-6 py-3 rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}