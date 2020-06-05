import React from "react";

const WeatherParams = () => {
  return (
    <div className="weatherParams-wrapper">
      <div className="weatherParams-item">
        <div className="title">PSI</div>
        <div className="content bg-numb">23</div>
        <div className="extra">Good</div>
      </div>
      <div className="weatherParams-item">
        <div className="title">RAIN</div>
        <div className="content normal-numb">0</div>
        <div className="extra">mm</div>
      </div>
      <div className="weatherParams-item">
        <div className="title">DENGUE</div>
        <div className="content circle-shape"></div>
        <div className="extra"></div>
      </div>
      <div className="weatherParams-item">
        <div className="add-icon"></div>
        <div className="add-text">Add</div>
      </div>
    </div>
  );
};

export default WeatherParams;
