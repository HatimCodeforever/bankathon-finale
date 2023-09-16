import React from "react";
import "../output.css"; // Import your Tailwind CSS file

function Sidebar() {
  return (
    <div className="bg-red-900 text-white h-screen w-60 fixed top-0 left-0 overflow-y-auto">
      <div className="py-4 px-2">
        <div>
        <h1 className="text-3xl font-mono text-center">Welcome!</h1>
        </div>
        <ul className="mt-9">
          <li className="py-2 transform transition-transform hover:scale-110">
            <a href="#" className="text-white text-xl font-medium hover:text-white block text-center">
              Home
            </a>
          </li>
          <li className="py-2 transform transition-transform hover:scale-110">
            <a href="#" className="text-white text-xl font-medium hover:text-white block text-center">
              StatBot
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
