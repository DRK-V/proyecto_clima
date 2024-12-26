import { Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherCardProps {
  day: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
};

export function WeatherCard({ day, temperature, condition }: WeatherCardProps) {
  const Icon = weatherIcons[condition];

  return (
    <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center">
      <p className="font-semibold text-violet-700">{day}</p>
      <Icon className="w-12 h-12 my-2 text-violet-500" />
      <p className="text-lg font-bold text-gray-800">{temperature}°C</p>
      <p className="text-sm text-gray-600 capitalize">{condition}</p>
    </div>
  );
}

