import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartComponent = ({ chartType, chartData }) => {
  const options = {
    chart: {
      id: 'example-chart',
    },
    xaxis: {
      categories: chartData.categories,
    },
  };

  return (
    <div className="chart">
      <ReactApexChart
        options={options}
        series={chartData.series}
        type={chartType}
        height={300}
      />
    </div>
  );
};

export default ChartComponent;
