export const sampleDateWater = [
  {
    waterLevel: {
      start: 0.3,
      end: 2,
    },
  },
  {
    waterLevel: {
      start: 2,
      end: 0.3,
    },
  },
  {
    waterLevel: {
      start: 0.3,
      end: 2,
    },
  },
  {
    waterLevel: {
      start: 2,
      end: 0.3,
    },
  },
  {
    waterLevel: {
      start: 0.3,
      end: 2,
    },
  },
  {
    waterLevel: {
      start: 2,
      end: 0.3,
    },
  },
  {
    waterLevel: {
      start: 0.3,
      end: 2,
    },
  },
  {
    waterLevel: {
      start: 2,
      end: 0.3,
    },
  },
  {
    waterLevel: {
      start: 0.3,
      end: 2,
    },
  },
  {
    waterLevel: {
      start: 2,
      end: 0.3,
    },
  },
];

export const formatTime = (time) => {
  const fmTime = time % 24;
  const decimal = fmTime % 1;
  const hr = Math.floor(fmTime);
  const min = Math.floor(60 * decimal);
  if (hr > 12) {
    return `${hr - 12}:${min > 10 ? "" : "0"}${min} pm`;
  } else if (hr === 0) {
    return `${12}:${min > 10 ? "" : "0"}${min} pm`;
  }
  return `${hr}:${min > 10 ? "" : "0"}${min} am`;
};

export const getTimeMode = (time) => {
  const fmTime = time % 24;
  const hr = Math.floor(fmTime);
  if (hr >= 19 || hr < 6) {
    return { mode: "moon" };
  } else {
    return { mode: "sun" };
  }
};

export const generateTime = (n) => {
  let res = [];
  for (let i = 0; i < n; i++) {
    res.push(sampleDataTimeItem(i));
  }
  return res;
};

export const sampleDataTimeItem = (n) => {
  const TIDE_PERIOD = 6;
  return {
    time: {
      start: n * TIDE_PERIOD,
      end: (n + 1) * TIDE_PERIOD,
    },
  };
};

export const getQBezierValue = (t, p1, p2, p3) => {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
};

export const getQuadraticCurvePoint = (
  startX,
  startY,
  cpX,
  cpY,
  endX,
  endY,
  position
) => {
  return {
    x: getQBezierValue(position, startX, cpX, endX),
    y: getQBezierValue(position, startY, cpY, endY),
  };
};

export const convertDataToXY = (chartHeight, waterLevel, time, pxEachHr) => {
  return {
    x: time * pxEachHr,
    y: chartHeight - waterLevel * 100,
  };
};

export const convertPxToTime = (px, chartWidth) => {
  return (px / chartWidth) * 12 + 6;
};

const sampleDataTime = generateTime(sampleDateWater.length);

export const tideData = sampleDateWater.map((item, i) => ({
  ...item,
  ...sampleDataTime[i],
}));
