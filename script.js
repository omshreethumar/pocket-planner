// Mock data for chart
const ctx = document.getElementById('myChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Cash Flow (₹)',
      data: [25000, 27000, 22000, 29000, 31000, 28000, 34500],
      borderColor: '#00c896',
      backgroundColor: 'rgba(0, 200, 150, 0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});
