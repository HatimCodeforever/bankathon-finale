import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Sidebar } from "react-custom-sidebar";
import { FaHome, FaComments } from 'react-icons/fa';


export function Dashboard() {
  const [isMenuOpen, setIsMenuOpened] = useState(false);
  const themeColors = {
    light: {
      bgColor: "#9C254D",
      textColor: "white",
      highlights: "#D23369",
    },
    dark: {
      bgColor: "#0f0f1f",
      textColor: "#ffffff",
      highlights: "#21213d",
    },
  };
  // menu list
  const menuItems = [
    {
      title: "Home",
      link: "/home",
      icon: <FaHome />,
    },
    {
      title: "Chatbot",
      link: "/chat",
      icon: <FaComments />,
    },
  ];

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
      },
      legend: {
        show: false, // Hide the legend
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
      labels: {
        style: {
          colors: "white",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "white", // Set the text color for Y-axis labels
        },
      },
    },
    series: [
      {
        name: "Series 1",
        data: [30, 40, 45, 50, 49, 60, 70],
      }
    ],
  })

  const [chartData3, setChartData3] = useState({
    options: {
      chart: {
        id: 'bar-chart',
      },
      xaxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
      },
    },
    series: [
      {
        name: 'Series 1',
        data: [44, 55, 13, 43, 22],
      },
    ],
  })

  const [selectedEmployee, setSelectedEmployee] = useState(1);

  useEffect(() => {
    if (selectedEmployee !== null) {
      console.log("Selectedid:- ", selectedid)
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
            title: {
              text: "TARGET REPORT",
              align: "center",
              style: {
                fontSize: "18px",
                color: "black",
              },
            },
            xaxis: {
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "November"],
            }, legend: {
              show: true,
              labels: {
                colors: 'white',
              }
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
    backgroundColor: "#9C254D",
  };

  return (
    <div className="h-screen w-screen flex bg-white">
      <div className="w-[15%]">
        <Sidebar
          menuItems={menuItems}
          theme="light"
          themeColors={themeColors}
          isSidebarOpened={isMenuOpen}
          handleSidebarToggle={setIsMenuOpened}
          showToggleButton={false}
        >
        </Sidebar>
      </div>
      <div className="w-[75%] ml-16 mt-3" >
        <div className="mb-4 " >
          <label htmlFor="employeeSelect" className="mr-2 text-lg">
            <b>Select Employee:</b>
          </label>
          <select
            id="employeeSelect"
            className="text-white p-2"
            onChange={handleEmployeeChange}
            value={selectedEmployee}
            style={{background: "#9C254D"}}
          >
            <option value="">Select an Employee</option>
            {employeeData.empid.map((empid, index) => (
              <option key={empid} value={empid}>
                {`${employeeData.empname[index]} (${empid})`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-5 grid-rows-1 grid gap-y-5 gap-x-4 md:grid-cols-2 xl:grid-cols-2 ">
          <div className="bg-gray-200 p-1 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData1.options}
              series={chartData1.series}
              type="pie"
              width="100%"
              height="80%"
            />
            <p className="mt-2 text-black text-xl font-semibold text-center">Analytics of the Products provided By our Bank</p>
          </div>
          <div className="bg-gray-200 p-1 rounded-lg" style={chartStyle}>
            <Chart
              options={chartData3}
              series={chartData3.series}
              type="bar"
              width="100%"
              height="80%"
            />
            <p className="mt-2 text-xl text-black font-semibold text-center">RANDOM CHART</p>
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ height: "290px", backgroundColor: "#9C254D" }}>
          <Chart
            options={chartData2}
            series={chartData2.series}
            type="line"
            width="100%"
            height="100%"
          />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
