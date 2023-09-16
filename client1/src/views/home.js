import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Sidebar from "../components/sidebar";

export function Dashboard() {
  const [employeeData, setEmployeeData] = useState({
    empid: [],
    empname: []
  });
  const [selectedid, setSelectedid] = useState(1)
  const [chartData1, setChartData1] = useState({
    options: {
      labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
      datalabels: {
        enabled: true,
        style: {
          fontSize: '20px',
          padding: '4px',
        }
      },
    },
    series: [44, 55, 13, 43, 22],
  })

  const [chartData2, setChartData2] = useState({
    chart: {
      id: "line-chart",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "November"],
    },
    series: [
      {
        name: "Series 1",
        data: [30, 40, 45, 50, 49, 60, 70],
      }
    ],
  })

  const [selectedEmployee, setSelectedEmployee] = useState(1);

  useEffect(() => {
    if (selectedEmployee !== null) {
      console.log("Selectedid:- ",selectedid)
      fetch("/get_employee_data", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empid: selectedid }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the chartData state with the fetched data
          setChartData2({
            chart: {
              id: "line-chart",
            },
            xaxis: {
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "November"],
            },
            series: [
              {
                name: data.s1,
                data: data.r1,
              },
              {
                name: data.s2,
                data: data.r2,
              },
              {
                name: data.s3,
                data: data.r3,
              },
              {
                name: data.s4,
                data: data.r4,
              },
              {
                name: data.s5,
                data: data.r5,
              }
            ],
          });
        })
        .catch((error) => console.error(error));
    }
  }, [selectedid]);
  useEffect(() => {
    fetch("/dashh", {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setEmployeeData(data['response']);
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


  const handleEmployeeChange = (event) => {
    const sec = event.target.value;
    setSelectedid(sec);
    setSelectedEmployee(sec);
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
            value={selectedEmployee}
          >
            <option value="">Select an Employee</option>
            {employeeData.empid.map((empid, index) => (
              <option key={empid} value={empid}>
                {`${employeeData.empname[index]} (${empid})`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-12 grid-rows-1 grid gap-y-5 gap-x-4 md:grid-cols-2 xl:grid-cols-2 ">

          <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData1.options}
              series={chartData1.series}
              type="pie"
              width="100%"
              height="80%"
            />
            <p className="mt-2 text-black font-semibold text-center">Analytics of the Products provided By our Bank</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData2}
              series={chartData2.series}
              type="line"
              width="100%" // Set the width of the chart itself
              height="80%" // Set the height of the chart itself
            />
            <p className="mt-2 text-black font-semibold text-center">TARGET REPORT</p>
          </div>
        </div>
        <iframe title="Report Section" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiZDY3OWY3NjMtZDMxNC00Y2IzLWE0YWYtNTQwNzAxMjQ5NGRmIiwidCI6ImQxZjE0MzQ4LWYxYjUtNGEwOS1hYzk5LTdlYmYyMTNjYmM4MSIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </div>
  );
}

export default Dashboard;
