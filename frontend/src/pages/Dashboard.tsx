import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, Thermometer, Droplets, Search, Moon, Sun, UserCircle } from 'lucide-react';
import ForecastModal from '../components/ForecastModal';
import ChatModal from '../components/ChatModal';

// Interfaces
interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

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

interface WeatherMapProps {
  darkMode: boolean;
  userLocation: { lat: number; lon: number } | null;
  city: string;
  onLocationSelect: (lat: number, lon: number, cityName: string) => void;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ darkMode, userLocation, city, onLocationSelect }) => {
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    if (userLocation) {
      setMapKey(Date.now());
    }
  }, [userLocation?.lat, userLocation?.lon, city]);

  if (!userLocation) return null;

  const handleMapClick = (event: React.MouseEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget;
    const rect = iframe.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lat = userLocation.lat + (y / rect.height - 0.5) * 0.1;
    const lon = userLocation.lon + (x / rect.width - 0.5) * 0.1;

    onLocationSelect(lat, lon, city);
  };

  return (
    <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className="text-2xl font-semibold mb-4">Mapa del Clima - {city}</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          key={mapKey}
          src={`https://embed.windy.com/embed2.html?lat=${userLocation.lat}&lon=${userLocation.lon}&zoom=11&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=true&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
          className="w-full h-[500px] rounded-lg"
          title="Weather Map"
          onClick={handleMapClick}
        />
      </div>
    </div>
  );
};


// LoadMoreLoginModal Component
interface LoadMoreLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const LoadMoreLoginModal: React.FC<LoadMoreLoginModalProps> = ({ isOpen, onClose, darkMode }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl`}>
        <h3 className="text-xl font-semibold mb-4">Ver mapa del clima</h3>
        <p className="mb-6">Para ver el mapa del clima, debes iniciar sesión primero.</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}>
            Cancelar
          </button>
          <button onClick={() => {
            onClose();
            navigate('/login');
          }} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

// LoadMoreButton Component
interface LoadMoreButtonProps {
  isAuthenticated: boolean;
  darkMode: boolean;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isAuthenticated, darkMode, showMap, setShowMap }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Ver mapa del clima
        </button>

        <LoadMoreLoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => setShowMap(!showMap)}
        className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${darkMode
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {showMap ? 'Ocultar mapa' : 'Ver mapa del clima'}
      </button>
    </div>
  );
};

// Dashboard Component
export default function Dashboard({ setIsAuthenticated }: DashboardProps) {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<ForecastData | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const userData = Cookies.get('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    getUserLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userLocation) {
        fetchWeatherData(city);
      }
    }, 600000); // cada 10 minutos
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [userLocation, city]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=es`
            );

            if (!response.ok) throw new Error('Error en la respuesta de Nominatim');

            const data = await response.json();

            const cityName = data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.municipality ||
              'Ciudad desconocida';

            const regionName = data.address.state ||
              data.address.region ||
              data.address.county ||
              '';

            const locationName = `${cityName}${regionName ? `, ${regionName}` : ''}`;
            setCity(locationName);
            await fetchWeatherData(locationName);
          } catch {
            console.error('Error getting location name:', error);
            setError('Error al obtener el nombre de la ubicación');
            setCity('Ciudad desconocida');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Error al obtener la ubicación. Por favor, ingrese una ciudad manualmente.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocalización no está soportada en este navegador. Por favor, ingrese una ciudad manualmente.');
    }
  };

  const fetchCoordinates = async (searchQuery: string) => {
    try {
      // Usar Nominatim para una búsqueda más precisa
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );

      if (!response.ok) throw new Error('No se pudo obtener las coordenadas');

      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const address = location.address;

        // Construir un nombre de ubicación más preciso
        let locationName = '';

        if (address.city || address.town || address.village) {
          locationName += address.city || address.town || address.village;
        }

        if (address.county) {
          locationName += locationName ? `, ${address.county}` : address.county;
        }

        if (address.state) {
          locationName += locationName ? `, ${address.state}` : address.state;
        }

        if (address.country) {
          locationName += locationName ? `, ${address.country}` : address.country;
        }

        return {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          formattedName: locationName || searchQuery
        };
      }

      throw new Error('No se encontraron resultados');
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };


  const fetchWeatherData = async (city: string) => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const coordinates = await fetchCoordinates(city);
      if (!coordinates) throw new Error('No se obtuvieron coordenadas válidas');

      const { latitude, longitude } = coordinates;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum,weathercode&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto&forecast_days=14`
      );

      if (!response.ok) throw new Error('No se pudo obtener los datos del clima');

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error al obtener los datos del clima. Por favor, inténtelo nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const locationData = await fetchCoordinates(city);

      if (locationData) {
        setUserLocation({
          lat: locationData.latitude,
          lon: locationData.longitude
        });
        setCity(locationData.formattedName);
        await fetchWeatherData(locationData.formattedName);
      } else {
        setError('No se pudo encontrar la ubicación especificada');
      }
    } catch (error) {
      setError('Error al buscar la ubicación');
    } finally {
      setLoading(false);
    }
  };
  const handleLocationSelect = async (lat: number, lon: number, cityName: string) => {
    setUserLocation({ lat, lon });
    setCity(cityName);
    await fetchWeatherData(cityName);
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
        hourlyTime: data.hourly.time.slice(startIndex, endIndex).map((time: string) =>
          new Date(time).getHours() + ':00'
        ),
        humidity: Math.round(data.hourly.relativehumidity_2m[startIndex + 12]),
        windSpeed: Math.round(data.hourly.windspeed_10m[startIndex + 12]),
      });
    }
    return futureDaysData;
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'}`}>
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 mr-4">Panel de Clima</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center px-3 py-2 rounded-full transition duration-300 ease-in-out ${darkMode ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            <span className="hidden sm:inline">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`flex items-center rounded-full p-2 transition duration-300 ease-in-out ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
              >
                <UserCircle className="w-8 h-8" />
              </button>
              {menuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                >
                  <ul>
                    <li>
                      <button
                        onClick={() => navigate('/perfil')}
                        className={`block w-full text-left px-4 py-2 text-sm transition duration-300 ease-in-out ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        Perfil
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm transition duration-300 ease-in-out ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
              className={`flex items-center px-3 py-2 rounded-full transition duration-300 ease-in-out ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={getUserLocation}
          className={`flex items-center px-3 py-2 rounded-full transition duration-300 ease-in-out ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {loading ? 'Cargando...' : 'Mi ubicación'}
        </button>

        <form onSubmit={handleSearch} className="flex-1">
          <div className={`flex items-center rounded-full p-2 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Ingrese el nombre de la ciudad"
              className={`flex-grow bg-transparent outline-none px-4 py-2 ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
            />
            <button
              type="submit"
              className={`rounded-full p-2 transition duration-300 ease-in-out ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              disabled={loading}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'}`}>
        <h2 className="text-2xl font-semibold mb-4">Clima actual en {city}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData ? (
            <>
              <div className={`flex items-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                <Thermometer className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm">Temperatura Min</p>
                  <p className="text-xl font-bold">{weatherData.daily.temperature_2m_min[0]}°C</p>
                </div>
              </div>
              <div className={`flex items-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-100'}`}>
                <Thermometer className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-sm">Temperatura Max</p>
                  <p className="text-xl font-bold">{weatherData.daily.temperature_2m_max[0]}°C</p>
                </div>
              </div>
              <div className={`flex items-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                <Droplets className="w-8 h-8 text-indigo-500 mr-3" />
                <div>
                  <p className="text-sm">Probabilidad de lluvia</p>
                  <p className="text-xl font-bold">{weatherData.daily.weathercode[0] === 1 ? 'No lloverá' : 'Lloverá'}</p>
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
          {weatherData && generateWeatherDataForFutureDays(weatherData)
            .slice(0, 7)
            .map((dayData, index) => (
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

        <LoadMoreButton
          isAuthenticated={user !== null}
          darkMode={darkMode}
          showMap={showMap}
          setShowMap={setShowMap}
        />

        {showMap && user && userLocation && (
          <WeatherMap
            darkMode={darkMode}
            userLocation={userLocation}
            city={city}
            onLocationSelect={handleLocationSelect}
          />
        )}
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
            className={`fixed bottom-6 right-6 p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 ${darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-600'}`}
          >
            <img
              src="../../public/0c675a8e1061478d2b7b21b330093444.gif" // Asegúrate de que la ruta de la imagen sea correcta
              alt="Bot"
              className="h-16 w-16 object-cover rounded-full"
            />
          </button>

          <ChatModal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
}

// WeatherCard Component
interface WeatherCardProps {
  data: {
    date: string;
    temperatureMin: number;
    temperatureMax: number;
    rainSum: number;
    weatherCode: number;
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
      className={`rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'}`}
      onClick={onClick}
    >
      <p className="text-lg font-bold text-center">{data.date}</p>
      <p className="text-sm text-center">{`${data.temperatureMin}°C - ${data.temperatureMax}°C`}</p>
      <WeatherIcon isRainy={data.weatherCode !== 1} />
      <p className="text-xs text-center mt-2">{data.rainSum > 0 ? `${data.rainSum} mm lluvia` : 'Sin lluvia'}</p>
    </div>
  );
}
