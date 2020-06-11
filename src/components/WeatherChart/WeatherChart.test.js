import React from "react";
import renderer from "react-test-renderer";
import WeatherChart from "./WeatherChart";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, configure } from "enzyme";

import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";

configure({ adapter: new Adapter() });

describe("WeatherChart", () => {
  let wrapper;
  // const setScroll = jest.fn();
  // const setPeriod = jest.fn();
  // const setDay = jest.fn();
  // const match = { target: { scrollLeft: 100 } };
  // const handleScroll = jest.fn({ target: { scrollLeft: 100 } });
  // const useStateSpy = jest.spyOn(React, "useState");
  // useStateSpy.mockImplementation((init) => [init, setScroll]);

  const { scrollNumb } = renderHook(() => useState(0));
  it("should render WeatherParams correctly", () => {
    wrapper = renderer.create(<WeatherChart />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render handleCanvas function", () => {
    wrapper = mount(<WeatherChart />);
  });

  it("should call the setScroll function when scroll chart container", () => {
    wrapper = shallow(<WeatherChart />);
    wrapper.find(".chart-container").simulate("scroll", { deltaX: 100 });
    // console.log(wrapper.state());
    // expect(scrollNumb).toEqual(0);
  });
});
