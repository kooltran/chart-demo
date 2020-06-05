import React, { useEffect, useState, useLayoutEffect } from "react";
// import Chart from "chart.js";

const NUMB_DAYS = 10;

// var data = {
//   labels: ["1", "2"],
//   datasets: [
//     {
//       label: "My Second dataset",
//       fillColor: "rgba(151,187,205,0.2)",
//       strokeColor: "rgba(151,187,205,1)",
//       pointColor: "rgba(151,187,205,1)",
//       pointStrokeColor: "#fff",
//       pointHighlightFill: "#fff",
//       pointHighlightStroke: "rgba(151,187,205,1)",
//       data: [2.5, 0.5],
//     },
//   ],
// };

const tideData = [
  {
    waterLevel: {
      start: 2,
      end: 0.5,
    },
    time: {
      start: 7,
      end: 15,
    },
  },
  {
    waterLevel: {
      start: 0.5,
      end: 2.5,
    },
    time: {
      start: 15,
      end: 15 + 10,
    },
  },
  {
    waterLevel: {
      start: 2.5,
      end: 1,
    },
    time: {
      start: 15 + 10,
      end: 15 + 10 + 7,
    },
  },
  {
    waterLevel: {
      start: 1,
      end: 2.3,
    },
    time: {
      start: 15 + 10 + 7,
      end: 15 + 10 + 7 + 6,
    },
  },
  {
    waterLevel: {
      start: 2.3,
      end: 1.5,
    },
    time: {
      start: 15 + 10 + 7 + 6,
      end: 15 + 10 + 7 + 6 + 5,
    },
  },
  {
    waterLevel: {
      start: 1.5,
      end: 2.5,
    },
    time: {
      start: 15 + 10 + 7 + 6 + 5,
      end: 15 + 10 + 7 + 6 + 5 + 9,
    },
  },
];

const sampleData = [
  {
    waterLevel: {
      startLv: 2,
      endLv: 0.5,
    },
    time: {
      startT: 7,
      endT: 15,
    },
  },
];

const WeatherChart = () => {
  const { innerWidth } = window;
  const chartRef = React.createRef();
  const chartContainerRef = React.createRef();
  const chartWrapperRef = React.createRef();
  const [chartWidth, setChartWidth] = useState(innerWidth);
  const halfInnerWidth = chartWidth / 2;
  const pxEachHr = chartWidth / 12;

  const generateData = (data, nextWaterLv, nextTime) => {
    for (let i = 0; i < 5; i++) {
      return data.map((item) => {
        const waterLevel = item.waterLevel;
        const time = item.time;
        return {
          ...item,
          ...waterLevel,
          startLv: waterLevel.start,
          endLv: nextWaterLv,
          ...time,
          startT: time.start,
          endT: time.start + nextTime,
        };
      });
    }
  };

  const convertDataToXY = (beginPt, waterLevel, time) => {
    return {
      x: (time - 7) * pxEachHr,
      y: beginPt - waterLevel * 100,
    };
  };

  const drawSunChart = (beginPt, ctx) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff8514";

    for (let i = 0; i < NUMB_DAYS; i++) {
      ctx.moveTo(i * chartWidth, beginPt);
      if (i % 2) {
        ctx.quadraticCurveTo(
          chartWidth * i + halfInnerWidth,
          beginPt * 2,
          chartWidth * (i + 1),
          beginPt
        );
      } else {
        ctx.quadraticCurveTo(
          chartWidth * i + halfInnerWidth,
          -beginPt + 150,
          chartWidth * (i + 1),
          beginPt
        );
      }
    }

    ctx.stroke();
  };

  const drawTideChart = (beginPt, ctx) => {
    ctx.beginPath();
    ctx.strokeStyle = "#94d6f7";
    ctx.fillStyle = "blue";
    ctx.fill();

    for (let i = 0; i < tideData.length; i++) {
      const startPt = convertDataToXY(
        beginPt,
        tideData[i].waterLevel.start,
        tideData[i].time.start
      );
      const endPt = convertDataToXY(
        beginPt,
        tideData[i].waterLevel.end,
        tideData[i].time.end
      );

      const middlePtY =
        (beginPt - startPt.y - (beginPt - endPt.y)) / 2 + startPt.y;

      const middlePtX = (endPt.x - startPt.x) / 2 + startPt.x;

      if (!i % 2) {
        ctx.moveTo(startPt.x, startPt.y);
        ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

        ctx.moveTo(middlePtX, middlePtY);
        ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);
      } else {
        ctx.moveTo(startPt.x, startPt.y);
        ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

        ctx.moveTo(middlePtX, middlePtY);
        ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);
      }
    }

    ctx.stroke();
  };

  const handleCanvas = () => {
    const chartContainerHeight = chartContainerRef.current.offsetHeight;
    const beginPt = chartContainerHeight;
    const c = chartRef.current;
    const ctx = c.getContext("2d");

    c.width = NUMB_DAYS * chartWidth;
    c.height = beginPt * 2;

    drawSunChart(beginPt, ctx);

    drawTideChart(beginPt, ctx);
  };

  // const handleChart = () => {
  //   const ctx = chartRef.current.getContext("2d");

  //   new Chart(ctx, {
  //     type: "line",
  //     responsive: true,
  //     data: data,
  //   });
  // };

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

  useEffect(() => {
    // const chartContainerHeight = chartContainerRef.current.offsetHeight;
    // console.log(chartContainerHeight, "chartContainerHeight");
    handleCanvas();
    // chartWrapperRef.current.style.width = `${chartWidth}px`;
    // chartContainerRef.current.style.width = `1200px`;
    // handleChart(chartRef);
  }, [chartWidth]);

  return (
    // <div className="chart-wrapper" ref={chartWrapperRef}>
    <div className="chart-container" ref={chartContainerRef}>
      <div className="chart-title">
        <span className="blue-title">Tide</span>
        <span className="orange-title">Sunrise & Sunset</span>
      </div>
      <canvas className="chart-canvas" ref={chartRef} />
    </div>
    // </div>
  );
};

export default WeatherChart;
