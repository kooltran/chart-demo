import React, { useEffect, useState, useCallback } from "react";
import {
  formatTime,
  tideData,
  convertPxToTime,
  getTimeMode,
  getQuadraticCurvePoint,
  convertDataToXY,
} from "../../helpers";
import { useWindowResize } from "./useWindowResize";
import sun from "../../assets/img/icons/sun.svg";

const WeatherChart = () => {
  const chartRef = React.createRef();
  const chartContainerRef = React.createRef();
  const sunRef = React.createRef();
  const chartWidth = useWindowResize();
  const [scrollNumb, setScroll] = useState(0);
  const [tmpPos, setPos] = useState(0.0);
  const [period, setPeriod] = useState(0);
  const [days, setDay] = useState(0);
  const canvasWidth = (tideData.length / 2) * chartWidth;
  const halfChartWidth = chartWidth / 2;
  const pxEachHr = chartWidth / 12;
  const timeFromPx = convertPxToTime(scrollNumb, chartWidth);
  const timeScroll = formatTime(timeFromPx);
  const mode = getTimeMode(timeFromPx).mode;

  const _fillChartBg = ({ start, end, chartHeight, ctx }) => {
    ctx.lineTo(end.x, chartHeight);
    ctx.lineTo(start.x, chartHeight);

    ctx.fillStyle = "#c1e5f7";
    ctx.strokeStyle = "#c1e5f7";
    ctx.fill();
  };

  const _fillText = (start, ctx, dataText) => {
    ctx.font = "14px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText(`${dataText.waterLevel} m`, start.x, start.y / 2 + 20 + 18);
    ctx.fillText(formatTime(dataText.time), start.x, start.y / 2 + 20 + 35);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(start.x - 28, start.y / 2 + 20, 60, 44);
  };

  //draw time chart
  const drawTimeChart = useCallback(
    (ctx, chartHeight) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff8514";

      for (let i = 0; i < tideData.length; i++) {
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
      ctx.beginPath();
      ctx.strokeStyle = "#94d6f7";

      const startPt = (i) => {
        return convertDataToXY(
          chartHeight,
          tideData[i].waterLevel.start,
          tideData[i].time.start,
          pxEachHr
        );
      };

      const endPt = (i) => {
        return convertDataToXY(
          chartHeight,
          tideData[i].waterLevel.end,
          tideData[i].time.end,
          pxEachHr
        );
      };

      const middlePtXFirst = (i) =>
        (endPt(i).x - startPt(i).x) / 2 + startPt(i).x;

      const middlePtYFirst = (i) =>
        (chartHeight - startPt(i).y - (chartHeight - endPt(i).y)) / 2 +
        startPt(i).y;
      const middlePt = (i) => ({
        x: middlePtXFirst(i),
        y: middlePtYFirst(i),
      });

      for (let i = 0; i < tideData.length; i++) {
        _fillText(startPt(i), ctx, {
          waterLevel: tideData[i].waterLevel.start,
          time: tideData[i].time.start,
        });

        if (i === 0) {
          ctx.moveTo(-middlePt(i).x, middlePt(i).y);
          ctx.quadraticCurveTo(
            startPt(i).x,
            startPt(i).y,
            middlePt(i).x,
            middlePt(i).y
          );
          // fill background color for tide chart
          _fillChartBg({ start: startPt(i), end: endPt(i), chartHeight, ctx });
        }

        if (i <= tideData.length - 2) {
          ctx.moveTo(middlePt(i).x, middlePt(i).y);
          ctx.quadraticCurveTo(
            startPt(i + 1).x,
            startPt(i + 1).y,
            middlePt(i + 1).x,
            middlePt(i + 1).y
          );

          // fill background color for tide chart
          _fillChartBg({
            start: middlePt(i),
            end: middlePt(i + 1),
            chartHeight,
            ctx,
          });
        }

        if (i === tideData.length - 1) {
          // fill info of tide chart
          _fillText(endPt(i), ctx, {
            waterLevel: tideData[i].waterLevel.end,
            time: tideData[i].time.end,
          });

          ctx.moveTo(middlePt(i).x, middlePt(i).y);
          ctx.quadraticCurveTo(
            endPt(i).x,
            endPt(i).y,
            endPt(i).x + (endPt(i).x - startPt(i).x),
            startPt(i).y
          );

          // fill background color for tide chart
          _fillChartBg({
            start: middlePt(i),
            end: endPt(i),
            chartHeight,
            ctx,
          });
        }
      }
      ctx.stroke();
    },
    [pxEachHr]
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
        setPos((scrollNumb / chartWidth) % 2);
      } else {
        setPos(scrollNumb / chartWidth);
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
    const chartHeight =
      chartContainerRef.current && chartContainerRef.current.offsetHeight - 20;
    const c = chartRef.current || {};
    const ctx = chartRef.current && chartRef.current.getContext("2d");

    c.width = canvasWidth;
    c.height = chartHeight;

    if (ctx) {
      drawTideChart(ctx, chartHeight);
      drawTimeChart(ctx, chartHeight);
      drawSun(ctx, chartHeight);
    }
  }, [
    canvasWidth,
    chartContainerRef,
    chartRef,
    drawSun,
    drawTideChart,
    drawTimeChart,
  ]);

  useEffect(() => {
    handleCanvas();
  }, [chartContainerRef, chartWidth, handleCanvas, scrollNumb]);

  return (
    <div
      className="chart-container"
      ref={chartContainerRef}
      onScroll={handleScroll}
    >
      <canvas className="chart-canvas" ref={chartRef} />
      <div className="chart-title">
        <span className="blue-title">Tide</span>
        <span className="orange-title">Sunrise & Sunset</span>
      </div>
      <img ref={sunRef} src={sun} className="img-sun" alt="sun" />
      {mode === "moon" && <div className="icon-moon"></div>}
      <span className="time-text">{timeScroll}</span>
      <div className="day-text">Day {days + 1}</div>
    </div>
  );
};

export default WeatherChart;
