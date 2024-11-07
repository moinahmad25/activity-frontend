"use client";
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [insights, setInsights] = useState(null);

  // Fetching insights data from the backend
  useEffect(() => {
    const getInsight = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/get-customer-activity"
        );
        const result = await response.json();

        // storing the insights to the state
        setInsights(result.insights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getInsight();
  }, []);

  // Check if insights are available, if not, show loading message
  if (!insights) {
    return <div>Loading...</div>;
  }

  // Preparing the data for the pie chart dynamically
  const chartData = {
    labels: [
      `Most Active Area: ${insights.mostActiveArea.area}`,
      `Least Active Area: ${insights.leastActiveArea.area}`,
    ],
    datasets: [
      {
        label: "Activity Insights",
        data: [
          insights.mostActiveArea.totalDwellTime,
          insights.leastActiveArea.totalDwellTime,
        ],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            let label = tooltipItem.label;

            if (index === 0) {

              // Most Active Area
              label = `${label} - Activity Type: ${insights.mostActiveArea.activity_type}, Dwell Time: ${insights.mostActiveArea.totalDwellTime} seconds`;
            } else if (index === 1) {

              // Least Active Area
              label = `${label} - Activity Type: ${insights.leastActiveArea.activity_type}, Dwell Time: ${insights.leastActiveArea.totalDwellTime} seconds`;
            } else if (index === 2) {

              // Peak Hour
              label = `${label} - Dwell Time: ${insights.peakHour.totalDwellTime} seconds`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px" }} className="w-full">
      <h1 className="text-3xl font-semibold">Hotel Activity Dashboard</h1>
      <h2 className="text-2xl my-4 mt-8 font-semibold">Insights</h2>
      <div className="grid grid-cols-4 gap-4 w-full min-h-[30vh] mt-4">
        <div className="h-30vh w-full shadow-xl shadow-black/5 border-2 border-black/2 rounded-md p-4">
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Most Active Area:{" "}
            <span className="font-normal">{insights.mostActiveArea.area}</span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Activity Type:{" "}
            <span className="font-normal">
              {insights.mostActiveArea.activity_type}
            </span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Dwell Time:{" "}
            <span className="font-normal">
              {insights.mostActiveArea.totalDwellTime} seconds
            </span>
          </p>
        </div>
        <div className="h-30vh w-full shadow-xl shadow-black/5 border-2 border-black/2 rounded-md p-4">
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Least Active Area:{" "}
            <span className="font-normal">{insights.leastActiveArea.area}</span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Activity Type:{" "}
            <span className="font-normal">
              {insights.leastActiveArea.activity_type}
            </span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Dwell Time:{" "}
            <span className="font-normal">
              {insights.leastActiveArea.totalDwellTime} seconds
            </span>
          </p>
        </div>
        <div className="h-30vh w-full shadow-xl shadow-black/5 border-2 border-black/2 rounded-md p-4">
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Peak Hours:{" "}
            <span className="font-normal">{insights.peakHour.hour-1}:00 - {insights.peakHour.hour}:00 {" "}</span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Activity Count:{" "}
            <span className="font-normal">
            {insights.peakHour.count} activities
            </span>
          </p>
          <p className="text-[1.2rem] font-semibold mt-6 mb-4">
            Dwell Time:{" "}
            <span className="font-normal">
            {insights.peakHour.totalDwellTime} seconds
            </span>
          </p>
        </div>
      </div>

      <h3 className="text-2xl my-4 mt-8 font-semibold">Activity Pie Chart</h3>
      <div
        className="chart-container"
        style={{
          width: "100%",
          height: "600px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
