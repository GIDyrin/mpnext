import { useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { AppLayout } from '@/modules';
import { authService } from '@/lib/services';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Валидация полей
      if (!email.trim() || !username.trim() || !password.trim()) {
        throw new Error('Все поля обязательны для заполнения');
      }

      await authService.register(username, email, password);
      router.push('/login');
    } catch (err) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Произошла неизвестная ошибка при регистрации';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      if (err instanceof AxiosError) {
        errorMessage = 
          err.response?.data?.email?.join(' ') ||
          err.response?.data?.username?.join(' ') ||
          err.response?.data?.password?.join(' ') ||
          err.response?.data?.detail ||
          err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Register</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Password</label>
              <div className='flex'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 bg-gray-700 rounded-l focus:outline-none focus:ring-1 focus:ring-green-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className={'bg-green-500 rounded-r py-2 ' + (showPassword ? 'px-4' : 'px-3')}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}