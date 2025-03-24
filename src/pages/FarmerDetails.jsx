import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './FarmerDetails.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Firebase config
const secondaryFirebaseConfig = {
  apiKey: "AIzaSyCWrVs7XSSuRNvlc1AOqRXOtsoSoagSdFQ",
  authDomain: "dht11-b7875.firebaseapp.com",
  databaseURL: "https://dht11-b7875-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dht11-b7875",
  storageBucket: "dht11-b7875.firebasestorage.app",
  messagingSenderId: "661069657900",
  appId: "1:661069657900:web:ec8cd4e27e0bfc7de39e89",
  measurementId: "G-LS1NF9D3EQ",
};

const secondaryApp = initializeApp(secondaryFirebaseConfig, "secondary");
const secondaryDatabase = getDatabase(secondaryApp);

const FarmerWeatherDashboard = () => {
  const { state } = useLocation();
  const { searchQuery, coordinates, weatherData: initialWeatherData, farmerData } = state || {};

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  const [temperatureChartData, setTemperatureChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  const [humidityChartData, setHumidityChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(initialWeatherData || null);
  const [weatherError, setWeatherError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Poppins' },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Temperature and Humidity Live Data',
        font: { size: 20, family: 'Poppins', weight: 'bold' },
        color: '#2c3e50',
      },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          font: { size: 14, family: 'Poppins' },
          color: '#7f8c8d',
        },
        ticks: { maxTicksLimit: 10, color: '#7f8c8d' },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          font: { size: 14, family: 'Poppins' },
          color: '#7f8c8d',
        },
        min: 0,
        max: 100,
        ticks: { color: '#7f8c8d' },
      },
    },
  };

  const temperatureOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: 'Temperature Live Data',
        font: { size: 20, family: 'Poppins', weight: 'bold' },
        color: '#2c3e50',
      },
    },
  };

  const humidityOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: 'Humidity Live Data',
        font: { size: 20, family: 'Poppins', weight: 'bold' },
        color: '#2c3e50',
      },
    },
  };

  // Fetch weather data from OpenWeatherMap API
  useEffect(() => {
    if (coordinates && !initialWeatherData) {
      const [lat, lon] = coordinates;
      const apiKey = 'd7ea8f258623d8a4cb52ca26b8e61e5e';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch weather data');
          return response.json();
        })
        .then(data => {
          setWeatherData({
            temperature: data.main.temp,
            humidity: data.main.humidity,
            description: data.weather[0].description,
          });
          setWeatherError(null);
        })
        .catch(error => {
          console.error('OpenWeatherMap API error:', error);
          setWeatherError('Failed to load weather data from OpenWeatherMap.');
        });
    }
  }, [coordinates, initialWeatherData]);

  // Fetch chart data from Firebase
  useEffect(() => {
    const dataPath = 'weather';
    const dataRef = ref(secondaryDatabase, dataPath);
    console.log('Querying Firebase path:', dataPath);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log('Raw Firebase data:', data);
        if (data) {
          const labels = Object.keys(data);
          const temperatures = Object.values(data).map(item => item.temperature);
          const humidities = Object.values(data).map(item => item.humidity);

          console.log('Labels:', labels);
          console.log('Temperatures:', temperatures);
          console.log('Humidities:', humidities);

          // Update original combined chart
          setChartData({
            labels,
            datasets: [
              { ...chartData.datasets[0], data: temperatures },
              { ...chartData.datasets[1], data: humidities },
            ],
          });

          // Update separate temperature chart
          setTemperatureChartData({
            labels,
            datasets: [
              { ...temperatureChartData.datasets[0], data: temperatures },
            ],
          });

          // Update separate humidity chart
          setHumidityChartData({
            labels,
            datasets: [
              { ...humidityChartData.datasets[0], data: humidities },
            ],
          });

          setIsLoading(false);
        } else {
          console.log('No data available at path:', dataPath);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Firebase error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chartData.datasets, temperatureChartData.datasets, humidityChartData.datasets]);

  if (isLoading) {
    return <div className="loading">Loading chart data...</div>;
  }

  return (
    <div className="farmer-weather-dashboard">
      {/* Farmer Details Section */}
      <div className="farmer-details-container">
        <h2>Farmer Details for {searchQuery || "Unknown Location"}</h2>

        {coordinates && (
          <p>
            Coordinates: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
          </p>
        )}

        {farmerData ? (
          <div className="farmer-info">
            <h3>Farmer Information</h3>
            <p><strong>Name:</strong> {farmerData.name}</p>
            <p><strong>Farm Size:</strong> {farmerData.farmSize} acres</p>
            <p><strong>Phone Number:</strong> {farmerData.phoneNumber}</p>
          </div>
        ) : (
          <p>No farmer data available. Please add farmer details.</p>
        )}

        {weatherData ? (
          <div className="weather-info">
            <h3>Weather Information </h3>
            <p><strong>Temperature:</strong> {weatherData.temperature}°C</p>
            <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
          </div>
        ) : weatherError ? (
          <p>{weatherError}</p>
        ) : (
          <p>Loading weather data from OpenWeatherMap...</p>
        )}
      </div>

      {/* Original Combined Weather Chart */}
      <div className="chart-container">
        <h3>Combined Temperature and Humidity Chart</h3>
        <Line options={options} data={chartData} />
      </div>

      {/* Separate Temperature Chart */}
      <div className="chart-container">
        <h3>Temperature Chart</h3>
        <Line options={temperatureOptions} data={temperatureChartData} />
      </div>

      {/* Separate Humidity Chart */}
      <div className="chart-container">
        <h3>Humidity Chart</h3>
        <Line options={humidityOptions} data={humidityChartData} />
      </div>
    </div>
  );
};

export default FarmerWeatherDashboard;