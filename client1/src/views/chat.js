import React, { useState } from "react";
import Chart from "react-apexcharts";
import "../index.css";

export function Chat() {
  const [userQuery, setUserQuery] = useState("");
  const [responses, setResponses] = useState([]);
  // const examples = [
  //   "Who is the best Employee?",
  //   "How Many emplyee works under me?",
  //   "What is this months Sales?",
  //   "How to improve my Employees?",
  // ]

  const chartData = [
    {
      name: 'Series 1',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  const chartOptions = {
    chart: {
      id: 'line-chart',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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
        <div className="w-[20%] h-screen bg-[#0c0c15] text-white p-4">
          <div className="h-[5%]">
            <button className="w-full h-[50px] border rounded hover:bg-slate-600 cursor-pointer">
              + New Chat
            </button>
          </div>
          <div className="h-[80%] mt-4 overflow-scroll shadow-lg hide-scroll-bar mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 1].map((item, index) => {
              return (
                <div className="py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-message"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M8 9h8"></path>
                      <path d="M8 13h6"></path>
                      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                    </svg>
                  </span>
                  <div className="ml-2">My Chat history</div>
                </div>
              );
            })}
          </div>
          <div className="overflow-scroll shadow-lg hide-scroll-bar h-[10%] border-t">
            {[1].map((item, index) => {
              return (
                <div className="py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-settings"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    </svg>
                  </span>
                  Settings
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[80%]">
          <div className="h-[80%] flex flex-col justify-center items-center text-white">
            <div className='text-4xl font-bold mb-8'>STAT GPT</div>
            <div className="h-[100%] w-[80%] overflow-y-auto">
              <div className="chat-container w-[100%]">
                {responses.map((item, index) => (
                  <div
                    key={index}
                    className="mb-5"
                  >
                    <div
                      className="bg-blue-500 text-white ml-auto rounded-lg p-2 mr-5 max-w-[20%] mb-5"

                    >
                      {item.userQuery}
                    </div>
                    <div
                      className="bg-gray-300 text-black rounded-lg p-2 ml-5 max-w-max"
                    >
                      <Chart
                        options={chartOptions}
                        series={chartData}
                        type="line"
                        height={250}
                        width={500}
                      />
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
          <div className='h-[20%]'>
            <div className='flex flex-col items-center justify-center w-full h-full text-white'>
              <div className='w-[60%] flex justify-center relative'>
                <input type='text'
                  className=" w-full rounded-lg p-4 pr-16 bg-slate-800 text-white"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder='Type your message here...'
                />
                <span className='absolute right-4 top-4 cursor-pointer' onClick={sendQueryToAPI}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
