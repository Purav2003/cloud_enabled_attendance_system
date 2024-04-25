import { LineChart } from '@mui/x-charts';
import React from 'react';
import CountHours from '@/Helpers/CountHours';
import { Select } from 'antd';
const { Option } = Select;

const InTime = ({ data, users, workingHoursUserId, setWorkingHoursUserId, setWorkingHoursMonth, setWorkingHoursYear, workingHoursMonth, workingHoursYear }) => {
  const { calculateDuration } = CountHours();

  // Data preperation for line chart of Intime
  const entryTimes = data?.length > 0 && data?.map((item) => item.entry)
  const present = data?.length > 0 && data?.filter((item) => item.attendance === true)
  const workingHours = present?.length > 0 && present?.map((item) => calculateDuration(item.entry, item.exit_time))
  console.log(workingHours)
  const date = data?.length > 0 && data?.map((item) => item.date)
  console.log(date)
  console.log(entryTimes)
  const uniqueEntryTimes = entryTimes && [...new Set(entryTimes)]
  const inTime = uniqueEntryTimes && uniqueEntryTimes?.map((entry) => {
    const present = data.filter((item) => item.entry === entry)
    return { entry, present: present.length }
  })
  const handleYearChange = (value) => {
    setWorkingHoursYear(value);
  };

  const handleMonthChange = (value) => {
    setWorkingHoursMonth(value);
  };

  const handleEmployeeChange = (value) => {
    setWorkingHoursUserId(value);
  };

  return (
    <div>

      <Select
        placeholder="Select Year"
        className="z-0"
        value={workingHoursYear}
        onChange={handleYearChange}
        style={{ width: 120, marginRight: 10 }}
      >
        <Option value="2023">2023</Option>
        <Option value="2024">2024</Option>
        {/* Add more years as needed */}
      </Select>
      {/* Dropdown for Month */}
      <Select
        placeholder="Select Month"
        value={workingHoursMonth}
        onChange={handleMonthChange}
        style={{ width: 120,marginRight:10 }}
      >
        <Option value="01">January</Option>
        <Option value="02">February</Option>
        <Option value="03">March</Option>
        <Option value="04">April</Option>
        <Option value="05">May</Option>
        <Option value="06">June</Option>
        <Option value="07">July</Option>
        <Option value="08">August</Option>
        <Option value="09">September</Option>
        <Option value="10">October</Option>
        <Option value="11">November</Option>
        <Option value="12">December</Option>
      </Select>
      <Select placeholder="Select Employee" value={workingHoursUserId === 0 ? "Select User" : workingHoursUserId} onChange={handleEmployeeChange} style={{ width: 120, marginRight: 10 }}>
        <Option value="0">All</Option>
        {users?.map((name) => {
          return <Option key={name.id} value={name.id}>{name.name}</Option>;
        })}
      </Select>
      <LineChart
        series={[
          {
            arcLabel: (item) => `${item.user}`,
            data: entryTimes.toString().split(",").map((item) => parseInt(item, 10))
          },
        ]}
        height={300}
        margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
        grid={{ vertical: true, horizontal: true }}
      />

    </div>
  );
}

export default InTime;