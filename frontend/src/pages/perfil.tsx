import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CloudRain, User, Phone, UserCheck } from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    username: '',
    full_name: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userCookie = Cookies.get('user_data');

      if (!userCookie) {
        navigate('/login');
        return;
      }

      const data = JSON.parse(userCookie);

      setUserData({
        id: data.id,
        email: data.email,
        username: data.username,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
      });
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://clima-ad4e.onrender.com/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('auth_token')}`,
        },
        body: JSON.stringify({
          username: userData.username,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar los datos');
      }

      // Opcionalmente, manejar una respuesta exitosa o redirigir

    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Interactive Clouds */}
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

      {/* Profile Card */}
      <div className="w-full max-w-md bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-700">Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              id="email"
              value={userData.email}
              readOnly
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={userData.full_name}
              onChange={handleInputChange}
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              id="role"
              name="role"
              value={userData.role}
              readOnly
              className="w-full pl-10 py-3 bg-blue-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-3 px-8 rounded-xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
