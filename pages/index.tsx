import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { AppLayout, Welcome } from '@/modules';
import Link from 'next/link';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    setIsAuthenticated(!!cookies.token);
  }, []);

  return (
    <AppLayout>
      <div className="w-full max-w-4xl px-4">
        <div className="text-center">
          <Welcome />
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
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
          )}
        </div>
      </div>
    </AppLayout>
  );
}