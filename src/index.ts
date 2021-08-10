function calculateTTFB(performance: Performance) {
  return Math.round(performance.timing.responseStart - performance.timing.requestStart);
}

function calculateFCB(performance: Performance) {
  return performance.getEntriesByType("paint").find(entry => entry.name === "first-contentful-paint")?.startTime || 0;
}

// PerformanceNavigationTiming should use instead of `performance.timing` because it is deprecated,
// But PerformanceNavigationTiming doesn't contain `navigationStart` property now.
function calculateDomLoad(performance: Performance) {
  return Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart);
}

function calculateWindowLoad(performance: Performance) {
  return Math.round(performance.timing.loadEventStart - performance.timing.navigationStart)
}

function sendPerformanceMetrics(
  url: string,
  data: {
    ttfb: number,
    fcp: number,
    domLoad: number,
    windowLoad: number
  }) {
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
}

function performanceAnalyzer({
  url = "http://localhost:3001/analytics/create-statistics/"}
  : {url: string}) {
  window.onload = () => {
    const performance = window.performance;
    const analytics = {
      ttfb: calculateTTFB(performance),
      fcp: calculateFCB(performance),
      domLoad: calculateDomLoad(performance),
      windowLoad: calculateWindowLoad(performance)
    };

    sendPerformanceMetrics(url, analytics);
  };
}

export default performanceAnalyzer;