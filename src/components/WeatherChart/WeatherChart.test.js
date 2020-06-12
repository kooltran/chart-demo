import React from "react";
import renderer from "react-test-renderer";
import WeatherChart from "./WeatherChart";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, configure } from "enzyme";

configure({ adapter: new Adapter() });

describe("WeatherChart", () => {
  let wrapper;

  it("should render WeatherParams correctly", () => {
    wrapper = renderer.create(<WeatherChart />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render handleCanvas function", () => {
    wrapper = mount(<WeatherChart />);
  });

  it("should render right time when scroll the chart", () => {
    const mEvent = {
      target: { scrollLeft: 50 },
    };
    wrapper = shallow(<WeatherChart />);
    wrapper.find(".chart-container").simulate("scroll", mEvent);
    expect(wrapper.find(".time-text").text()).toEqual("6:35 am");
  });
});
