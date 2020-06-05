import React from "react";
import Nav from "../Nav";
import WeatherStatus from "../WeatherStatus";
import WeatherParams from "../WeatherParams";
import WeatherChart from "../WeatherChart";

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="layout-uppper">
        <Nav />
        <WeatherStatus />
        <WeatherParams />
      </div>
      <WeatherChart />
    </div>
  );
};

export default Layout;
