import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Sidebar from "../components/sidebar";

export function Dashboard() {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
      },
    },
    series: [
      {
        name: "Series 1",
        data: [30, 40, 45, 50, 49],
      },
    ],
  });

  return (
    <div className="bg-white">
      <Sidebar className="" />
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="500"
      />
    </div>
  )
}


export default Dashboard;
