import React, { useEffect, useState } from 'react';
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

const LiveChart = () => {
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
  const [isLoading, setIsLoading] = useState(true);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Poppins' }, // Modern font
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

          setChartData({
            labels,
            datasets: [
              { ...chartData.datasets[0], data: temperatures },
              { ...chartData.datasets[1], data: humidities },
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
  }, [chartData.datasets]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '18px',
          color: '#3498db',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        Loading chart data...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '900px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LiveChart;