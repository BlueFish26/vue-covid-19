export const CountryGraphData = {
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    lineTension: 1,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            padding: 50
          }
        }
      ]
    }
  }
};

export default CountryGraphData;
