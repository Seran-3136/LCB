import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import "./Map.css";
import { db } from "./firebaseConfig"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods

const MapUpdater = ({ coordinates, zoomLevel, searchTrigger }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, zoomLevel);
  }, [coordinates, zoomLevel, searchTrigger, map]);
  return null;
};

const SatelliteMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(5);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "d7ea8f258623d8a4cb52ca26b8e61e5e";

  useEffect(() => {
    const savedCoords = localStorage.getItem("coordinates");
    const savedQuery = localStorage.getItem("searchQuery");
    const savedZoom = localStorage.getItem("zoom");

    if (savedCoords) setCoordinates(JSON.parse(savedCoords));
    if (savedQuery) setSearchQuery(savedQuery);
    if (savedZoom) setZoom(parseInt(savedZoom, 10));
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const newWeatherData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        timestamp: new Date().toLocaleTimeString(), // Adding a timestamp
      };
      setWeatherData((prevData) => {
        // Append new data to existing data
        const updatedData = prevData ? [...prevData, newWeatherData] : [newWeatherData];
        return updatedData.slice(-5); // Keep only the last 5 data points
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerData = async (location) => {
    try {
      const docRef = doc(db, "farmerLocations", location.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching farmer data:", error);
      return null;
    }
  };

  const handleMarkerClick = async () => {
    const lat = coordinates[0];
    const lon = coordinates[1];
    await fetchWeatherData(lat, lon); // Fetch weather data
    const farmerData = await fetchFarmerData(searchQuery); // Fetch farmer data
    navigate("/farmer-details", {
      state: { searchQuery, coordinates, weatherData, farmerData },
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a location to search!");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0 (your.email@example.com)",
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];
        setCoordinates(newCoords);
        setZoom(13);
        setSearchTrigger((prev) => prev + 1);
        setWeatherData(null); // Reset weather data on new search
        localStorage.setItem("coordinates", JSON.stringify(newCoords));
        localStorage.setItem("searchQuery", searchQuery);
        localStorage.setItem("zoom", "13");

        await fetchWeatherData(lat, lon);
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("An error occurred while searching: " + error.message);
    }
  };

  const handleAddClick = () => {
    navigate("/add-farmer", { state: { searchQuery } });
  };

  return (
    <div className="satellite-map-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <button onClick={handleAddClick} className="add-button">
        Add Farmer Details
      </button>

      <div className="map-container">
        <MapContainer center={coordinates} zoom={zoom} key={searchTrigger}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='© <a href="https://www.esri.com/">Esri</a> & contributors'
          />
          <MapUpdater
            coordinates={coordinates}
            zoomLevel={zoom}
            searchTrigger={searchTrigger}
          />
          {coordinates && (
            <Marker
              position={coordinates}
              eventHandlers={{
                click: handleMarkerClick,
              }}
            >
              <Popup>
                <div>
                  <h3>{searchQuery || "Searched Location"}</h3>
                  {loading ? (
                    <p>Loading weather data...</p>
                  ) : weatherData && weatherData.length > 0 ? (
                    <div>
                      <p>
                        Temperature: {weatherData[weatherData.length - 1].temperature}°C
                      </p>
                      <p>Humidity: {weatherData[weatherData.length - 1].humidity}%</p>
                    </div>
                  ) : (
                    <p>Click the pin to see details</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SatelliteMap;