import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CloudRain, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: { id: string; name: string; email: string }) => void; // Recibimos una función para establecer los datos del usuario
}

export default function LoginPage({ setIsAuthenticated, setUser }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username && password) {
      try {
        const response = await fetch('https://clima-ad4e.onrender.com/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        const data = await response.json();
        Cookies.set('auth_token', data.token, { expires: 7 });
        Cookies.set('user_data', JSON.stringify(data.user), { expires: 7 });

        setIsAuthenticated(true);
        setUser(data.user); // Actualiza los datos del usuario en el estado

        console.log('Datos del usuario:', data.user);

        navigate('/dashboard');
      } catch (error) {
        console.error('Error:', error);
        // Mostrar un mensaje al usuario o manejar el error según tu diseño
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Nubes decorativas interactivas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <CloudRain
            key={index}
            className={`absolute w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-white/30 animate-float`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="text-white text-center mb-8">
        <CloudRain className="w-12 h-12 mx-auto mb-2 animate-spin-slow" />
        <h1 className="text-3xl font-semibold">Weather Watch</h1>
      </div>

      {/* Tarjeta de inicio de sesión */}
      <div className="w-full max-w-md bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-md">
        <h2 className="text-2xl text-blue-700 font-medium mb-6">Bienvenido de nuevo</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 space-y-4 sm:space-y-0">
  <button
    type="submit"
    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white text-lg py-3 px-8 rounded-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
  >
    Iniciar sesión
  </button>
  <a
    href="/forgot"
    className="w-full sm:w-auto text-center text-violet-500 hover:text-violet-600 text-sm transition duration-300 ease-in-out"
  >
    ¿Olvidaste tu contraseña?
  </a>
</div>

        </form>

        <p className="mt-8 text-center text-gray-500">
          ¿No tienes una cuenta?{' '}
          <a
            href="/register"
            className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
