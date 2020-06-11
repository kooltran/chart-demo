import { useState, useLayoutEffect } from "react";

export const useWindowResize = () => {
  const { innerWidth } = window;
  const [chartWidth, setChartWidth] = useState(innerWidth);
  useLayoutEffect(() => {
    const updateChartWidth = (e) => {
      const resizedChartWidth = e && e.currentTarget.innerWidth;
      if (resizedChartWidth) {
        setChartWidth(resizedChartWidth);
      }
    };
    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, [chartWidth]);

  return chartWidth;
};
