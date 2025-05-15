import { useState } from 'react';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { AppLayout } from '@/modules';
import { authService } from '@/lib/services';
import { AxiosError } from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Валидация полей
      if (!username.trim() || !password.trim()) {
        throw new Error('Все поля обязательны для заполнения');
      }

      await authService.login(username, password);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      
      // Типизированная обработка ошибок
      let errorMessage = 'Произошла неизвестная ошибка';
      
      if (err instanceof Error) {
        // Обработка обычных ошибок
        errorMessage = err.message;
      }
      
      if (err instanceof AxiosError) {
        // Обработка Axios-ошибок
        errorMessage = err.response?.data?.detail 
          || err.response?.data?.non_field_errors?.join(', ') 
          || err.message;
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
          <h2 className="text-2xl font-bold text-green-400 mb-6">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">username</label>
              <input
                type="username"
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
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}