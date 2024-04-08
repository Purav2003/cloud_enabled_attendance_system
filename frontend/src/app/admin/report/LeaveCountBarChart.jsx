import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Select } from 'antd';

const { Option } = Select;

const LeaveCountBarChart = ({ data, setSelectedYear, selectedYear, users, setLeaveUserId, leaveUserId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartInstance.current) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const datasets = {};
    data?.forEach(entry => {
      const monthName = Object.keys(entry)[0];
      const leaveData = entry[monthName];

      for (const employee in leaveData) {
        if (!datasets[employee]) {
          datasets[employee] = {
            label: employee,
            data: new Array(months.length).fill(0),
            backgroundColor: [],
          };
        }

        const monthIndex = months.indexOf(monthName);
        datasets[employee].data[monthIndex] = leaveData[employee];
      }
    });

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#00ff80', '#0080ff'];
    let colorIndex = 0;
    for (const employee in datasets) {
      datasets[employee].backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }

    chartInstance.current.data.labels = months;
    chartInstance.current.data.datasets = Object.values(datasets);
    chartInstance.current.update();

  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleEmployeeChange = (value) => {
    setLeaveUserId(value);
  };

  return (
    <div>
      <div className="flex mb-4">
        <Select placeholder="Select Year" value={selectedYear} onChange={handleYearChange} style={{ width: 120, marginRight: 10 }}>
          <Option value="2023">2023</Option>
          <Option value="2024">2024</Option>
          {/* Add more years as needed */}
        </Select>
        <Select placeholder="Select Employee" value={leaveUserId === 0 ? "All" : leaveUserId} onChange={handleEmployeeChange} style={{ width: 120, marginRight: 10 }}>
          <Option value="0">All</Option>
          {users?.map((name) => {
            return <Option key={name.id} value={name.id}>{name.name}</Option>;
          })}
        </Select>
      </div>
      <div className='w-[400px]'>
        <canvas ref={chartRef} height={200} />
      </div>
    </div>
  );
};

export default LeaveCountBarChart;
