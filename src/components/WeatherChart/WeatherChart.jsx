import React, { useEffect, useState, useLayoutEffect } from "react";
// import Chart from "chart.js";

const NUMB_DAYS = 3;

const formatTime = time => {
  const fmTime = time % 24;
  if (fmTime > 12) {
    return `${fmTime - 12} pm`;
  }
  return `${fmTime} am`;
};

const generateTime = n => {
  let res = [];
  for (let i = 1; i <= n; i++) {
    res.push(sampleDataTimeItem(i));
  }
  return res;
};

const sampleDataTimeItem = n => {
  const TIDE_PERIOD = 7;
  return {
    time: {
      start: n * TIDE_PERIOD,
      end: (n + 1) * TIDE_PERIOD
    }
  };
};

const sampleDateWater = [
  {
    waterLevel: {
      start: 2,
      end: 0.5
    }
  },
  {
    waterLevel: {
      start: 0.5,
      end: 2
    }
  },
  {
    waterLevel: {
      start: 2,
      end: 0.5
    }
  },
  {
    waterLevel: {
      start: 0.5,
      end: 2
    }
  },
  {
    waterLevel: {
      start: 2,
      end: 0.5
    }
  },
  {
    waterLevel: {
      start: 0.5,
      end: 2
    }
  }
];

const sampleDataTime = generateTime(sampleDateWater.length);

const tideData = sampleDateWater.map((item, i) => ({
  ...item,
  ...sampleDataTime[i]
}));

const WeatherChart = () => {
  const { innerWidth, innerHeight } = window;
  const chartRef = React.createRef();
  const chartContainerRef = React.createRef();
  const chartWrapperRef = React.createRef();
  const [chartWidth, setChartWidth] = useState(innerWidth);
  const halfInnerWidth = chartWidth / 2;
  const pxEachHr = chartWidth / 12;

  const convertDataToXY = (beginPt, waterLevel, time) => {
    return {
      x: (time - 7) * pxEachHr,
      y: beginPt - waterLevel * 100
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

  const _fillChart = ({ start, end, chartHeight, ctx, options = {} }) => {
    ctx.lineTo(end.x, chartHeight);
    ctx.lineTo(start.x, chartHeight);
    ctx.lineTo(start.x, start.y);

    ctx.fillStyle = options.fillStyle || "#c1e5f7";
    ctx.strokeStyle = "#c1e5f7";
    ctx.fill();
  };

  const _fillText = (start, ctx, dataText) => {
    ctx.font = "14px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(`${dataText.waterLevel} m`, start.x, start.y - 27);
    ctx.fillText(formatTime(dataText.time), start.x, start.y - 9);

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(start.x - 28, start.y - 44, 55, 44);
  };

  const drawTideChart = (beginPt, ctx) => {
    const chartContainerHeight = chartContainerRef.current.getBoundingClientRect()
      .height;
    ctx.beginPath();
    ctx.strokeStyle = "#94d6f7";

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

      _fillText(startPt, ctx, {
        waterLevel: tideData[i].waterLevel.start,
        time: tideData[i].time.start
      });
      _fillText(endPt, ctx, {
        waterLevel: tideData[i].waterLevel.end,
        time: tideData[i].time.end
      });

      const middlePtY =
        (beginPt - startPt.y - (beginPt - endPt.y)) / 2 + startPt.y;

      const middlePtX = (endPt.x - startPt.x) / 2 + startPt.x;
      const middlePt = { x: middlePtX, y: middlePtY };

      if (!i % 2) {
        ctx.moveTo(startPt.x, startPt.y);
        ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

        _fillChart({
          start: startPt,
          end: middlePt,
          chartHeight: chartContainerHeight,
          ctx
        });

        ctx.moveTo(middlePtX, middlePtY);
        ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);

        _fillChart({
          start: middlePt,
          end: endPt,
          chartHeight: chartContainerHeight,
          ctx
        });
      } else {
        ctx.moveTo(startPt.x, startPt.y);
        ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

        _fillChart({
          start: startPt,
          end: middlePt,
          chartHeight: chartContainerHeight,
          ctx
        });

        ctx.moveTo(middlePtX, middlePtY);
        ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);

        _fillChart({
          start: middlePt,
          end: endPt,
          chartHeight: chartContainerHeight,
          ctx
        });
      }
    }

    ctx.fillStyle = "blue";

    ctx.stroke();
  };

  const handleCanvas = () => {
    const chartContainerHeight = chartContainerRef.current.offsetHeight;
    const beginPt = chartContainerHeight;
    const c = chartRef.current;
    const ctx = c.getContext("2d");

    c.width = NUMB_DAYS * chartWidth;
    c.height = beginPt * 2;

    drawTideChart(beginPt, ctx);
    drawSunChart(beginPt, ctx);
  };

  useLayoutEffect(() => {
    const updateChartWidth = e => {
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
    handleCanvas();
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
