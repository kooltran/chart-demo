import React from "react";

const WeatherStatus = () => {
  return (
    <div className="weatherStatus-wrapper">
      <div className="weatherStatus-container">
        <div className="weatherStatus-icon"></div>
        <div className="weatherStatus-info">
          <div className="status-text">Cloudy</div>
          <div className="status-info">
            <span className="status-temperature">29.9 C</span>
            <span className="status-humidity">73%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherStatus;
