import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  formatTime,
  tideData,
  convertPxToTime,
  getTimeMode,
  getQuadraticCurvePoint,
  convertDataToXY,
} from "../../helpers";
import sun from "../../assets/img/icons/sun.svg";

const PERIOD = 5;

const WeatherChart = () => {
  const { innerWidth } = window;
  const chartRef = React.createRef();
  const chartContainerRef = React.createRef();
  const sunRef = React.createRef();
  const [chartWidth, setChartWidth] = useState(innerWidth);
  const [scrollNumb, setScroll] = useState(0);
  const [tmpPos, setPos] = useState(0.0);
  const [period, setPeriod] = useState(0);
  const [days, setDay] = useState(0);
  const canvasWidth = PERIOD * chartWidth;
  const halfChartWidth = chartWidth / 2;
  const pxEachHr = chartWidth / 12;
  const timeFromPx = convertPxToTime(scrollNumb, chartWidth);
  const timeScroll = formatTime(timeFromPx);
  const mode = getTimeMode(timeFromPx).mode;

  const _fillChartBg = ({ start, end, chartHeight, ctx, options = {} }) => {
    ctx.lineTo(end.x, chartHeight - 20);
    ctx.lineTo(start.x, chartHeight - 20);
    ctx.lineTo(start.x, start.y);

    ctx.fillStyle = options.fillStyle || "#c1e5f7";
    ctx.strokeStyle = "#c1e5f7";
    ctx.fill();
  };

  const _fillText = (start, ctx, dataText) => {
    ctx.font = "14px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText(`${dataText.waterLevel} m`, start.x, start.y - 27);
    ctx.fillText(formatTime(dataText.time), start.x, start.y - 9);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(start.x - 28, start.y - 44, 55, 44);
  };

  //draw time chart
  const drawTimeChart = useCallback(
    (ctx, chartHeight) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff8514";

      for (let i = 0; i < PERIOD; i++) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        if (i === 0) {
          ctx.fillRect(0, 0, halfChartWidth, chartHeight);
        }

        ctx.moveTo(i * chartWidth + halfChartWidth, chartHeight);
        if (!(i % 2)) {
          ctx.quadraticCurveTo(
            chartWidth * (i + 1),
            -chartHeight + 150,
            chartWidth * (i + 1) + halfChartWidth,
            chartHeight
          );
        } else {
          // fill color for night times
          ctx.fillRect(
            halfChartWidth + chartWidth * i,
            0,
            chartWidth,
            chartHeight
          );
        }
      }

      ctx.stroke();
    },
    [chartWidth, halfChartWidth]
  );

  //draw tide chart
  const drawTideChart = useCallback(
    (ctx, chartHeight) => {
      const chartContainerHeight = chartContainerRef.current.getBoundingClientRect()
        .height;
      ctx.beginPath();
      ctx.strokeStyle = "#94d6f7";
      for (let i = 0; i < tideData.length; i++) {
        const startPt = convertDataToXY(
          chartHeight,
          tideData[i].waterLevel.start,
          tideData[i].time.start,
          pxEachHr
        );
        const endPt = convertDataToXY(
          chartHeight,
          tideData[i].waterLevel.end,
          tideData[i].time.end,
          pxEachHr
        );

        // draw info tide and time of TideChart
        _fillText(startPt, ctx, {
          waterLevel: tideData[i].waterLevel.start,
          time: tideData[i].time.start,
        });
        _fillText(endPt, ctx, {
          waterLevel: tideData[i].waterLevel.end,
          time: tideData[i].time.end,
        });

        const middlePtY =
          (chartHeight - startPt.y - (chartHeight - endPt.y)) / 2 + startPt.y;
        const middlePtX = (endPt.x - startPt.x) / 2 + startPt.x;
        const middlePt = { x: middlePtX, y: middlePtY };

        if (!(i % 2)) {
          ctx.moveTo(startPt.x, startPt.y);
          ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

          _fillChartBg({
            start: startPt,
            end: middlePt,
            chartHeight: chartContainerHeight,
            ctx,
          });

          ctx.moveTo(middlePtX, middlePtY);
          ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);

          // fill background color for the TideChart
          _fillChartBg({
            start: middlePt,
            end: endPt,
            chartHeight: chartContainerHeight,
            ctx,
          });
        } else {
          ctx.moveTo(startPt.x, startPt.y);
          ctx.quadraticCurveTo(middlePtX, startPt.y, middlePtX, middlePtY);

          // fill background color for the TideChart
          _fillChartBg({
            start: startPt,
            end: middlePt,
            chartHeight: chartContainerHeight,
            ctx,
          });

          ctx.moveTo(middlePtX, middlePtY);
          ctx.quadraticCurveTo(middlePtX, endPt.y, endPt.x, endPt.y);

          // fill background color for the TideChart
          _fillChartBg({
            start: middlePt,
            end: endPt,
            chartHeight: chartContainerHeight,
            ctx,
          });
        }
      }

      ctx.stroke();
    },
    [chartContainerRef, pxEachHr]
  );

  const drawSun = useCallback(
    (ctx, chartHeight) => {
      //get position of sun base on the TimeChart
      const ps = getQuadraticCurvePoint(
        period * chartWidth + halfChartWidth,
        chartHeight,
        chartWidth * (period + 1),
        -chartHeight + 150,
        (period + 1) * chartWidth + halfChartWidth,
        chartHeight,
        tmpPos
      );

      if (period > 0) {
        setPos(() => (scrollNumb / chartWidth) % 2);
      } else {
        setPos(() => scrollNumb / chartWidth);
      }

      //draw sun icon
      ctx.drawImage(sunRef.current, ps.x - 10, ps.y - 10, 20, 20);
    },
    [chartWidth, period, halfChartWidth, scrollNumb, sunRef, tmpPos]
  );

  const handleScroll = ({ target }) => {
    const period = Math.floor(scrollNumb / chartWidth);
    setScroll(target.scrollLeft);
    setPeriod(period);
    setDay(Math.floor(timeFromPx / 24));
  };

  const handleCanvas = useCallback(() => {
    const chartHeight = chartContainerRef.current.offsetHeight - 20;
    const c = chartRef.current;
    const ctx = chartRef.current.getContext("2d");

    c.width = canvasWidth;
    c.height = chartHeight;

    drawTideChart(ctx, chartHeight);
    drawTimeChart(ctx, chartHeight);
    drawSun(ctx, chartHeight);
  }, [
    canvasWidth,
    chartContainerRef,
    chartRef,
    drawSun,
    drawTideChart,
    drawTimeChart,
  ]);

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
    handleCanvas();
  }, [chartContainerRef, chartWidth, handleCanvas, scrollNumb]);
  console.log(chartWidth, "chartWidth");
  console.log(chartContainerRef, "chartContainerRef");
  return (
    <div
      className="chart-container"
      ref={chartContainerRef}
      onScroll={handleScroll}
    >
      <div className="chart-title">
        <span className="blue-title">Tide</span>
        <span className="orange-title">Sunrise & Sunset</span>
      </div>
      <canvas className="chart-canvas" ref={chartRef} />
      <img ref={sunRef} src={sun} className="img-sun" alt="sun" />
      {mode === "moon" && <div className="icon-moon"></div>}
      <span className="time-text">{timeScroll}</span>
      <div className="day-text">Day {days + 1}</div>
    </div>
  );
};

export default WeatherChart;
