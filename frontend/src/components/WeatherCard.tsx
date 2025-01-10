import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Wind, Droplets } from 'lucide-react';

interface WeatherCardProps {
  data: {
    date: string;
    temperatureMin: number;
    temperatureMax: number;
    rainSum: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
  };
  darkMode: boolean;
  onClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, darkMode, onClick }) => {
  const WeatherIcon = ({ isRainy }: { isRainy: boolean }) => (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
    >
      {isRainy ? (
        <CloudRain className="w-12 h-12 text-blue-400" />
      ) : (
        <Sun className="w-12 h-12 text-yellow-400" />
      )}
    </motion.div>
  );

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 }
    }
  };

  const getGradient = (min: number, max: number) => {
    const avgTemp = (min + max) / 2;
    if (avgTemp < 10) return 'from-blue-400 to-cyan-300';
    if (avgTemp < 20) return 'from-green-400 to-emerald-300';
    if (avgTemp < 30) return 'from-yellow-400 to-amber-300';
    return 'from-orange-400 to-red-300';
  };

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <motion.div 
      className={`rounded-lg p-4 cursor-pointer ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } bg-opacity-80 backdrop-blur-md`}
      onClick={handleClick}
      variants={cardVariants}
      whileHover="hover"
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className={`h-full flex flex-col justify-between bg-gradient-to-br ${getGradient(data?.temperatureMin ?? 0, data?.temperatureMax ?? 0)} rounded-lg p-3`}>
        <div>
          <p className={`text-lg font-bold text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{data?.date ?? 'Unknown Date'}</p>
          <div className="flex justify-center my-2">
            <WeatherIcon isRainy={data?.weatherCode !== 1} />
          </div>
        </div>
        <div>
          <p className={`text-sm text-center font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {`${data?.temperatureMin ?? 0}°C - ${data?.temperatureMax ?? 0}°C`}
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-1 text-blue-600" />
              <span>{data?.humidity ?? 0}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="w-4 h-4 mr-1 text-green-600" />
              <span>{data?.windSpeed ?? 0} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
