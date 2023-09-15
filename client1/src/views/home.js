import React, { useState,useEffect } from "react";
import Chart from "react-apexcharts";
import Sidebar from "../components/sidebar";

export function Dashboard() {
  const [employeeData, setEmployeeData] = useState({
    empid: [],
    empname: []
  });

  const [chartData1, setChartData1] = useState({
    options: {
      labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
      datalabels:{
        enabled: true,
        style:{
          fontSize: '20px',
          padding: '4px',
        }
      },
    },
    series: [44, 55, 13, 43, 22],
  })

  const [selectedEmployee, setSelectedEmployee] = useState();

  useEffect(() => {
    fetch("/dashh",{
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      setEmployeeData(data['response']);
      console.log(data['response'])
    })
    .catch((error) => console.error(error));

    fetch("/chartdata")
      .then((response) => response.json())
      .then((data) => {
        // Update the chartData state with the fetched data
        setChartData1({
          options: {
            labels: data.labels,
          },
          series: data.series,
        });
      })
      .catch((error) => console.error(error));

  }, []);

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

  const handleEmployeeChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    setSelectedEmployee(selectedId);
  };

  const chartStyle = {
    width: "100%", // Set the width of the chart container
    height: "330px", // Set the height of the chart container
  };

  return (
    <div className="bg-white">
      <Sidebar />
      <div className="z-0 mt-5 ml-64">
      <div className="mb-4">
          <label htmlFor="employeeSelect" className="mr-2">
            Select Employee:
          </label>
          <select
            id="employeeSelect"
            onChange={handleEmployeeChange}
            value={selectedEmployee || ""}
          >
            <option value="">Select an Employee</option>
            {employeeData.empid.map((empid, index) => (
              <option key={empid} value={empid}>
                {`${employeeData.empname[index]} (${empid})`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-12 grid-rows-2 grid gap-y-5 gap-x-4 md:grid-cols-2 xl:grid-cols-2 ">

        <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart 
            options={chartData1.options} 
            series={chartData1.series} 
            type="pie" 
            width="100%"
            height="80%"
            />
            <p className="mt-2 text-gray-500">Description for Chart 3</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="100%" // Set the width of the chart itself
              height="80%" // Set the height of the chart itself
            />
            <p className="mt-2 text-gray-500">Description for Chart 3</p>
          </div>
          {/* Chart 3 */}
          <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="100%" // Set the width of the chart itself
              height="80%" // Set the height of the chart itself
            />
            <p className="mt-2 text-gray-500">Description for Chart 3</p>
          </div>

          {/* Chart 4 */}
          <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              width="100%" // Set the width of the chart itself
              height="80%" // Set the height of the chart itself
            />
            <p className="mt-2 text-gray-500">Description for Chart 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
