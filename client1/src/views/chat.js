import React, { useState } from "react";
import Chart from "react-apexcharts";
import "../index.css";
// import Sidebar from "../components/sidebar";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import { Sidebar } from "react-custom-sidebar";
import { Link } from 'react-router-dom';

const themeColors = {
  light: {
    bgColor: "#e4e4e6",
    textColor: "#0f0f1f",
    highlights: "#cfcfcf",
  },
  dark: {
    bgColor: "#0f0f1f",
    textColor: "#ffffff",
    highlights: "#21213d",
  },
};


export function Chat() {
  const [userQuery, setUserQuery] = useState("");
  const [responses, setResponses] = useState([]);
  // const examples = [
  //   "Who is the best Employee?",
  //   "How Many emplyee works under me?",
  //   "What is this months Sales?",
  //   "How to improve my Employees?",
  // ]

  const [isMenuOpen, setIsMenuOpened] = useState(false);

  // menu list
  const menuItems = [
    {
      title: "Home",
      link: "/",
      // icon: <FontAwesomeIcon icon={faHome} />,
    },
    {
      title: "Mails",
      link: "/mails",
      // icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
    {
      title: "Services",
      link: "/services",
      // icon: <FontAwesomeIcon icon={faList} />,
    },
    {
      title: "Contacts",
      link: "/contacts",
      // icon: <FontAwesomeIcon icon={faContactCard} />,
    },
  ];

  const handleLogout = () => {
    console.log("logout clicked");
  };


  const chartData = [
    {
      name: "Series 1",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  const chartOptions = {
    chart: {
      id: "line-chart",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  };

  const sendQueryToAPI = async () => {
    try {
      const response = await fetch("/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponses([...responses, { userQuery, answer: data.answer }]);
        setUserQuery(""); // Clear user input
      } else {
        console.error("Failed to fetch data from API");
      }
    } catch (error) {
      console.error("Error sending query to API:", error);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex bg-[#050509]">
      {/* <Sidebar
          menuItems={menuItems}
          theme="light"
          logoUrl="add logo url here"
          logoSmallUrl="add small logo url here which will be visible in closed state"
          // themeColors={defaultThemeColors}
          showLogout={true}
          handleLogout={handleLogout}
          userDetails={{
            name: "User name",
            description: "designation",
            avatar: "add user avatart url here",
          }}
          closeOnLinkClick={false}
          closeOnOutsideClick={false}
          isSidebarOpened={isMenuOpen}
          handleSidebarToggle={setIsMenuOpened}
          showToggleButton={true}
        >
          // main content here
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="mails" element={<Mails />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="services" element={<Services />} />
          </Routes>
        </Sidebar> */}
        <Sidebar backgroundColor="#d42765" width="18vw">
          <Menu>
            <MenuItem component={<Link to="/home" />}> Dashboard </MenuItem>
            <MenuItem component={<Link to='/chat' />}> BuzzBot </MenuItem>
            <MenuItem> Recommendations </MenuItem>
          </Menu>
        </Sidebar>
        ;


        <div className="w-[80%]">
          <div className="h-[80%] flex flex-col justify-center items-center text-white">
            <div className="text-4xl font-bold mb-8">STAT GPT</div>
            <div className="h-[100%] w-[80%] overflow-y-auto">
              <div className="chat-container w-[100%]">
                {responses.map((item, index) => (
                  <div key={index} className="mb-5">
                    <div className="bg-blue-500 text-white ml-auto rounded-lg p-2 mr-5 max-w-[20%] mb-5">
                      {item.userQuery}
                    </div>
                    <div className="bg-gray-300 text-black rounded-lg p-2 ml-5 max-w-max">
                      {/* <Chart
                        options={chartOptions}
                        series={chartData}
                        type="line"
                        height={250}
                        width={500}
                      /> */}
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className='flex flex-wrap justify-around max-w-[900px] '>
              {
                examples.map((item, index) => (
                  <div className='text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] Ohover:bg-slate-800'>
                    {item}</div>))
              }
            </div> */}
          </div>
          <div className="h-[20%]">
            <div className="flex flex-col items-center justify-center w-full h-full text-white">
              <div className="w-[60%] flex justify-center relative">
                <input
                  type="text"
                  className=" w-full rounded-lg p-4 pr-16 bg-slate-800 text-white"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Type your message here..."
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer"
                  onClick={sendQueryToAPI}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-send"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14l11 -11" />
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
