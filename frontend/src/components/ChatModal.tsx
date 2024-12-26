import React, { useState } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

interface WeatherData {
  city_name: string;
  temp: number;
  weather: {
    description: string;
  };
  rh: number; // relative humidity
  wind_spd: number;
  datetime: string; // datetime of the weather data
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const API_KEY = 'bb375237635f47d3bf879076c5dad7f7';

  if (!isOpen) return null;

  const handleWeatherQuery = async (query: string) => {
    try {
      // Extract location from query
      const location = query.toLowerCase().replace('clima en ', '').trim();
      
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?city=${location}&key=${API_KEY}&lang=es`
      );
      
      const data = await response.json();
      if (data.data && data.data[0]) {
        const weather: WeatherData = data.data[0];
        const weatherDate = new Date(weather.datetime).toLocaleDateString();
        const weatherResponse = `
          Clima en ${weather.city_name} (${weatherDate}):
          🌡️ Temperatura: ${weather.temp}°C
          🌥️ Condición: ${weather.weather.description}
          💧 Humedad: ${weather.rh}%
          💨 Velocidad del viento: ${Math.round(weather.wind_spd * 3.6)} km/h
        `;
        return weatherResponse;
      }
      return 'Lo siento, no pude encontrar información del clima para esa ubicación.';
    } catch {
      return 'Hubo un error al consultar el clima. Por favor, intenta de nuevo.';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      
      let response = '';
      if (inputMessage.toLowerCase().includes('clima en')) {
        response = await handleWeatherQuery(inputMessage);
      } else {
        response = 'Para consultar el clima, escribe "clima en" seguido de la ciudad. Por ejemplo: "clima en Ginebra Valle del Cauca"';
      }

      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
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
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pregunta por el clima (ej: clima en Ginebra)"
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
