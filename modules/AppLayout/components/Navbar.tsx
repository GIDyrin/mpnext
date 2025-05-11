import Link from 'next/link';
import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Logo />
        </Link>
        <div className="space-x-1 sm:space-x-4">
          <Link href="/login" className="text-green-400 hover:text-green-300 px-4 py-2 text-sm sm:text-lg">
            Login
          </Link>
          <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm sm:text-lg transition-colors">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};