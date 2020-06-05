import React from "react";

const Nav = () => {
  return (
    <div className="nav-container">
      <div className="nav-burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="nav-location">
        <div className="nav-location-name">myENV</div>
        <div className="nav-location-dropdown">
          <span>Current Location</span>
          <span className="icon-arrow"></span>
        </div>
      </div>
      <div className="nav-notification"></div>
    </div>
  );
};

export default Nav;
