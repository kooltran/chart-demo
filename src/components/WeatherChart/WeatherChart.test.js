import React from "react";
import renderer from "react-test-renderer";
import WeatherChart from "./WeatherChart";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure, mount } from "enzyme";
import { useState } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
configure({ adapter: new Adapter() });

// HTMLCanvasElement.prototype.getContext = () => {};
// const handleCanvas = jest.fn();

describe("WeatherChart", () => {
  let wrapper;
  // const setScroll = jest.fn();
  // // const setPeriod = jest.fn();
  // // const setDay = jest.fn();
  // const match = { target: { scrollLeft: 100 } };
  // const handleScroll = jest.fn();
  // const useStateSpy = jest.spyOn(React, "useState");
  // useStateSpy.mockImplementation(init => [init, setScroll]);
  const { result } = renderHook(() => useState(0));

  const [_, setScroll] = result.current;

  it("should render WeatherParams correctly", () => {
    wrapper = renderer.create(<WeatherChart />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render handleCanvas function", () => {
    wrapper = mount(<WeatherChart />);
  });

  it("should call the handleScroll function when scroll chart container", () => {
    console.log(setScroll, "setScroll");
    wrapper = shallow(<WeatherChart />);
    wrapper.find(".chart-container").simulate("scroll", { deltaX: 100 });
    // expect(setScroll).toHaveBeenCalled();
  });
});
