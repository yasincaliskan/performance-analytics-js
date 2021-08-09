function calculateTTFB(performanceResourceTiming) {
  return Math.round(
    performanceResourceTiming.responseStart -
      performanceResourceTiming.requestStart
  );
}

function calculateFCB(performance) {
  return (
    performance
      .getEntriesByType("paint")
      .find((entry) => entry.name === "first-contentful-paint")?.startTime || 0
  );
}

// PerformanceNavigationTiming should use instead of `performance.timing` because it is deprecated,
// But PerformanceNavigationTiming doesn't contain `navigationStart` property now.
function calculateDomLoad(performance) {
  return Math.round(
    performance.timing.domContentLoadedEventEnd -
      performance.timing.navigationStart
  );
}

function calculateWindowLoad(performance) {
  return Math.round(
    performance.timing.loadEventStart - performance.timing.navigationStart
  );
}

function sendPerformanceMetrics(url, data) {
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
}

function performanceAnalyzer({
  url = "http://localhost:3030/api/analytics/statistics/",
}) {
  const analytics = {
    TTFB: calculateTTFB(new window.PerformanceResourceTiming()),
    FCP: calculateFCB(window.performance),
    domLoad: calculateDomLoad(window.performance),
    windowLoad: calculateWindowLoad(window.performance),
  };

  sendPerformanceMetrics(url, analytics);
}

export {performanceAnalyzer};
