import React, { useState, useEffect } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

interface WeatherData {
  temperature: number; // current temperature
  windspeed: number; // wind speed in km/h
  weathercode: number; // code representing the weather condition
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'user') {
      setIsBotTyping(true);
      setTimeout(() => {
        handleBotResponse(lastMessage.text);
      }, 1500); // Simula un retraso en la respuesta del bot
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleWeatherQuery = async (query: string) => {
    try {
      const location = query.toLowerCase().replace('clima en ', '').trim();

      // Diccionario con ciudades y sus coordenadas
      const geocoding: Record<string, { latitude: number; longitude: number }> = {
        "ginebra, valle del cauca": { latitude: 4.329, longitude: -75.812 },
        "cali, valle del cauca": { latitude: 3.4516, longitude: -76.5319 },
        "bogotá, cundinamarca": { latitude: 4.711, longitude: -74.0721 },
        "medellín, antioquia": { latitude: 6.2442, longitude: -75.5812 },
        // Agrega más ciudades según sea necesario
      };

      if (!geocoding[location]) {
        return 'Lo siento, no reconozco esa ubicación. Por favor, intenta con otra ciudad.';
      }

      const { latitude, longitude } = geocoding[location];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const data = await response.json();
      if (data.current_weather) {
        const weather: WeatherData = data.current_weather;
        return `
          Clima en ${location.charAt(0).toUpperCase() + location.slice(1)}:
          🌡️ Temperatura: ${weather.temperature}°C
          💨 Velocidad del viento: ${weather.windspeed} km/h
          🌥️ Condición: ${getWeatherDescription(weather.weathercode)}
        `;
      }
      return 'Lo siento, no pude encontrar información del clima para esa ubicación.';
    } catch {
      return 'Hubo un error al consultar el clima. Por favor, intenta de nuevo.';
    }
  };

  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Cielo despejado',
      1: 'Principalmente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Neblina helada',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos intensos',
    };
    return descriptions[code] || 'Condición desconocida';
  };

  const handleBotResponse = async (userMessage: string) => {
    let response = '';
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Respuestas de saludo
    if (normalizedMessage.includes('hola') || normalizedMessage.includes('buenos días') || normalizedMessage.includes('buenas tardes')) {
      response = '¡Hola! ¿Cómo puedo ayudarte hoy?';
    } else if (normalizedMessage.includes('clima en')) {
      response = await handleWeatherQuery(userMessage);
    } else {
      response = 'Para consultar el clima, escribe "clima en" seguido de la ciudad y región. Por ejemplo: "clima en Ginebra, Valle del Cauca".';
    }

    setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
    setIsBotTyping(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-md rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Chat del Clima</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-96 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg whitespace-pre-line ${
                message.sender === 'user'
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="mb-4 text-left text-gray-500 dark:text-gray-400">
              <div className="inline-block p-2 rounded-lg">
                <span>El bot está escribiendo...</span>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pregunta por el clima (ej: clima en Ginebra, Valle del Cauca)"
              className={`flex-grow p-2 rounded-l-lg focus:outline-none ${
                darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-r-lg ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
