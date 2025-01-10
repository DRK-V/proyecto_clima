import React, { useState } from 'react';
import MapComponent from './MapComponent'; // Asegúrate de tener este componente

interface ForecastViewerProps {
  weatherData: any; // Cambiar a tipos adecuados si los tienes definidos
  user: { name: string; email: string } | null;
}

const ForecastViewer: React.FC<ForecastViewerProps> = ({ weatherData, user }) => {
  const [showFullForecast, setShowFullForecast] = useState(false);

  const handleViewMore = () => {
    if (user) {
      setShowFullForecast(true);
    } else {
      alert('Inicia sesión para ver más detalles.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pronóstico</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {weatherData &&
          weatherData.daily.time
            .slice(0, showFullForecast ? undefined : 3)
            .map((day: string, index: number) => (
              <div
                key={index}
                className="p-4 bg-white shadow rounded-lg dark:bg-gray-800"
              >
                <p className="font-medium">
                  {new Date(day).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p>Temp. Máx: {weatherData.daily.temperature_2m_max[index]}°C</p>
                <p>Temp. Mín: {weatherData.daily.temperature_2m_min[index]}°C</p>
              </div>
            ))}
      </div>
      {!showFullForecast && (
        <button
          onClick={handleViewMore}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Ver más días
        </button>
      )}

      {user && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Mapa del Clima</h3>
          <MapComponent weatherData={weatherData} />
        </div>
      )}
    </div>
  );
};

export default ForecastViewer;
