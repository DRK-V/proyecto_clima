import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, Thermometer, Droplets, Search, Moon, Sun, UserCircle } from 'lucide-react';
import ForecastModal from '../components/ForecastModal';
import ChatModal from '../components/ChatModal';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const navigate = useNavigate();
  const [city, setCity] = useState('Ginebra, Valle del Cauca');
  interface WeatherData {
    daily: {
      temperature_2m_min: number[];
      temperature_2m_max: number[];
      rain_sum: number[];
      weathercode: number[];
      time: string[];
    };
    hourly: {
      temperature_2m: number[];
      relativehumidity_2m: number[];
      windspeed_10m: number[];
      time: string[];
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface ForecastData {
    date: string;
    temperatureMin: number;
    temperatureMax: number;
    rainSum: number;
    weatherCode: number;
    hourlyTemperature: number[];
    hourlyTime: string[];
    humidity: number;
    windSpeed: number;
  }

  const [selectedForecast, setSelectedForecast] = useState<ForecastData | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    const userData = Cookies.get('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchCoordinates = async (city: string) => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=b729402228094e39bcc73e66871c05bc`);
      if (!response.ok) throw new Error('No se pudo obtener las coordenadas');
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const coordinates = data.results[0]?.geometry;
        return { latitude: coordinates.lat, longitude: coordinates.lng };
      } else {
        throw new Error('No se encontraron resultados');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching coordinates:', error.message);
      } else {
        console.error('Error fetching coordinates:', String(error));
      }
      return null;
    }
  };
  
  const fetchWeatherData = async (city: string) => {
    try {
      const coordinates = await fetchCoordinates(city);
      if (!coordinates) throw new Error('No se obtuvieron coordenadas válidas');
      const { latitude, longitude } = coordinates;
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum,weathercode&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto&forecast_days=8`);
      if (!response.ok) throw new Error('No se pudo obtener los datos del clima');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching weather data:', error.message);
      } else {
        console.error('Error fetching weather data:', String(error));
      }
    }
  };
  


  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Buscando clima para ${city}`);
    setWeatherData(null);
    fetchWeatherData(city);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const generateWeatherDataForFutureDays = (data: WeatherData) => {
    const futureDaysData = [];
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    for (let i = 1; i < data.daily.time.length; i++) {
      const date = new Date(data.daily.time[i]);
      const startIndex = (i - 1) * 24;
      const endIndex = i * 24;
      futureDaysData.push({
        date: days[date.getDay()],
        temperatureMin: data.daily.temperature_2m_min[i],
        temperatureMax: data.daily.temperature_2m_max[i],
        rainSum: data.daily.rain_sum[i],
        weatherCode: data.daily.weathercode[i],
        hourlyTemperature: data.hourly.temperature_2m.slice(startIndex, endIndex),
        hourlyTime: data.hourly.time.slice(startIndex, endIndex).map((time: string) => new Date(time).getHours() + ':00'),
        humidity: Math.round(data.hourly.relativehumidity_2m[startIndex + 12]),
        windSpeed: Math.round(data.hourly.windspeed_10m[startIndex + 12]),
      });
    }
    return futureDaysData;
  };

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Clima</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center px-3 py-2 rounded-full transition duration-300 ease-in-out ${
              darkMode
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 mr-2" />
            ) : (
              <Moon className="w-5 h-5 mr-2" />
            )}
            {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`flex items-center rounded-full p-2 transition duration-300 ease-in-out ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                }`}
              >
                <UserCircle className="w-8 h-8" />
              </button>
              {menuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 shadow-lg rounded-lg ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  <ul>
                    <li>
                      <button
                        onClick={() => navigate('/perfil')}
                        className={`block w-full text-left px-4 py-2 text-sm transition duration-300 ease-in-out ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        Perfil
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm transition duration-300 ease-in-out ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center px-3 py-2 rounded-full transition duration-300 ease-in-out ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div
          className={`flex items-center rounded-full p-2 ${
            darkMode ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}
        >
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Ingrese el nombre de la ciudad"
            className={`flex-grow bg-transparent outline-none px-4 py-2 ${
              darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            type="submit"
            className={`rounded-full p-2 transition duration-300 ease-in-out ${
              darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div
        className={`rounded-2xl p-6 mb-6 ${
          darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Clima actual en {city}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData ? (
            <>
              <div className={`flex items-center p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-blue-100'
              }`}>
                <Thermometer className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm">Temperatura Min</p>
                  <p className="text-xl font-bold">{weatherData.daily.temperature_2m_min[0]}°C</p>
                </div>
              </div>
              <div className={`flex items-center p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-red-100'
              }`}>
                <Thermometer className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm">Temperatura Max</p>
                  <p className="text-xl font-bold">{weatherData.daily.temperature_2m_max[0]}°C</p>
                </div>
              </div>
              <div className={`flex items-center p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-indigo-100'
              }`}>
                <Droplets className="w-8 h-8 text-indigo-500 mr-3" />
                <div>
                  <p className="text-sm">Probabilidad de lluvia</p>
                  <p className="text-xl font-bold">
                    {weatherData.daily.weathercode[0] === 1 ? 'No lloverá' : 'Lloverá'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="col-span-3 text-center">Cargando datos del clima...</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Pronóstico</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weatherData && generateWeatherDataForFutureDays(weatherData).map((dayData, index) => (
            <WeatherCard 
              key={index} 
              data={dayData}
              darkMode={darkMode}
              onClick={() => {
                setSelectedForecast(dayData);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      {selectedForecast && (
        <ForecastModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedForecast}
          darkMode={darkMode}
        />
      )}
      {user && (
        <>
          <button
            onClick={() => setIsChatModalOpen(true)}
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${
              darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} darkMode={darkMode} />
        </>
      )}
    </div>
  );
}

interface WeatherCardProps {
  data: {
    date: string;
    temperatureMin: number;
    temperatureMax: number;
    rainSum: number;
    weatherCode: number;
    hourlyTemperature: number[];
    hourlyTime: string[];
    humidity: number;
    windSpeed: number;
  };
  darkMode: boolean;
  onClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, darkMode, onClick }) => {
  const WeatherIcon = ({ isRainy }: { isRainy: boolean }) => (
    <div className={`w-16 h-16 mx-auto my-2 ${isRainy ? 'text-blue-500' : 'text-yellow-500'}`}>
      {isRainy ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M20 15.5C20 18.5376 17.5376 21 14.5 21H7C4.23858 21 2 18.7614 2 16C2 13.4031 3.98032 11.2751 6.5 11.0252C6.5 11.0168 6.5 11.0084 6.5 11C6.5 7.96243 8.96243 5.5 12 5.5C15.0376 5.5 17.5 7.96243 17.5 11C17.5 11.0084 17.5 11.0168 17.5 11.0252C20.0197 11.2751 22 13.4031 22 16C22 16.5 21.5 17.5 20 17.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path 
            d="M12 12V17M12 17L14 15M12 17L10 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </div>
  );

  return (
    <div 
      className={`rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'
      }`} 
      onClick={onClick}
    >
      <p className="text-lg font-bold text-center">{data.date}</p>
      <p className="text-sm text-center">{`${data.temperatureMin}°C - ${data.temperatureMax}°C`}</p>
      <WeatherIcon isRainy={data.weatherCode !== 1} />
      <p className="text-xs text-center mt-2">{data.rainSum > 0 ? `${data.rainSum} mm lluvia` : 'Sin lluvia'}</p>
    </div>
  );
};

