import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto'; // Required for Chart.js v3+
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import './chart.css';

const ChartsDashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${apiUrl}/dashboard/email-stats`);
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Failed to load data.
        </Typography>
      </Box>
    );
  }

  const statusColors = {
    Success: "#4CAF50",   // Green
    Failed: "#F44336",    // Red
    "Not Processed": "#FFC107",  // Amber
    // Add other statuses here as needed
  };

  // Chart data preparation
  const chartData = {
    labels: dashboardData.emailStatusCounts.map((item) => item.status),
    datasets: [
      {
        label: "Email Status Counts",
        data: dashboardData.emailStatusCounts.map((item) => parseInt(item.count)),
        backgroundColor: dashboardData.emailStatusCounts.map((item) => statusColors[item.status] || "#2196F3"), // Default to blue if status is not found
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Set step size to 5
        },
      },
    },
  };

  return (
    <div className="campcontainerchart">
      <div className="filter-header">
        <h5>Email status </h5>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartsDashboard;
