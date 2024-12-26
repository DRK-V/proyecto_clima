import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
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
}

const ForecastModal: React.FC<ForecastModalProps> = ({ isOpen, onClose, darkMode, data }) => {
  if (!isOpen) return null;

  const chartData = {
    labels: data.hourlyTime,
    datasets: [
      {
        label: 'Temperatura',
        data: data.hourlyTemperature,
        borderColor: darkMode ? 'rgb(59, 130, 246)' : 'rgb(220, 38, 38)',
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(220, 38, 38, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: 'Temperatura por Hora',
        color: darkMode ? '#fff' : '#000',
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#fff' : '#000',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#fff' : '#000',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`rounded-lg p-6 max-w-3xl w-full ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Pronóstico para {data.date}</h2>
          <button 
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 ${
              darkMode ? 'hover:text-gray-300' : 'hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Información detallada del clima</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className="font-semibold mb-2">Temperatura</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-500">Min: {data.temperatureMin}°C</span>
              <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{width: `${((data.temperatureMax - data.temperatureMin) / (50 - (-10))) * 100}%`}}
                ></div>
              </div>
              <span className="text-red-500">Max: {data.temperatureMax}°C</span>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className="font-semibold mb-2">Lluvia</h3>
            <p>{data.rainSum} mm</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className="font-semibold mb-2">Humedad</h3>
            <p>{data.humidity}%</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h3 className="font-semibold mb-2">Velocidad del viento</h3>
            <p>{data.windSpeed} km/h</p>
          </div>
        </div>
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
          <h3 className="font-semibold mb-2">Temperatura por hora</h3>
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default ForecastModal;

