// components/Navbar.tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { Logo } from './Logo';
import { authService } from '@/lib/api';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';

type UserData = {
  username: string;
  email: string;
};

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const cookies = parseCookies();
      if (cookies.access) {
        try {
          const response: AxiosResponse = await authService.getMe();
          setUserData(response.data);
        } catch (error) {
          destroyCookie(null, 'access');
          destroyCookie(null, 'refresh');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Logo />
        </Link>
        
        {userData ? (
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300"
            >
              <span>{userData.username}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  Настройки
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  Выход
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-1 sm:space-x-4">
            <Link href="/login" className="text-green-400 hover:text-green-300 px-4 py-2 text-sm sm:text-lg">
              Login
            </Link>
            <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm sm:text-lg transition-colors">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};