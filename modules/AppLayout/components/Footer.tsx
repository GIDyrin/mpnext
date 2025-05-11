import Link from 'next/link';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-6 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-row justify-between items-center">
          {/* Лого и название */}
          <div className="mb-4 sm:mb-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-green-400 hover:text-green-300"
            >
              <Logo />
            </Link>
          </div>

          {/* Навигационные ссылки */}
          <div className="flex sm:flex-row flex-col justify-center space-x-4 sm:space-x-6">
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-green-400 transition-colors mb-2"
            >
              О нас
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-300 hover:text-green-400 transition-colors mb-2"
            >
              Конфиденциальность
            </Link>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-1 border-t border-gray-700 pt-2 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GlebbassMP. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};