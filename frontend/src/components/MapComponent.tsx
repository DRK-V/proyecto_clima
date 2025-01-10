import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  weatherData: any; // Cambiar a tipos adecuados si están definidos
}

const MapComponent: React.FC<MapComponentProps> = ({ weatherData }) => {
  const defaultPosition = [0, 0]; // Coordenadas predeterminadas si no hay datos

  const generateMarkers = () => {
    if (!weatherData) return [];
    const markers = weatherData.daily.time.map((_, index: number) => {
      const lat = weatherData.latitude; // Asegúrate de que existan estos valores en los datos
      const lon = weatherData.longitude;
      const condition =
        weatherData.daily.weathercode[index] === 1
          ? 'Soleado'
          : 'Lluvioso';

      return (
        <Marker key={index} position={[lat, lon]}>
          <Popup>
            <p><strong>{condition}</strong></p>
            <p>Temp. Máx: {weatherData.daily.temperature_2m_max[index]}°C</p>
            <p>Temp. Mín: {weatherData.daily.temperature_2m_min[index]}°C</p>
          </Popup>
        </Marker>
      );
    });
    return markers;
  };

  return (
    <MapContainer
      center={defaultPosition}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {generateMarkers()}
    </MapContainer>
  );
};

export default MapComponent;
