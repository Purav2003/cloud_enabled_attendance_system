import { LineChart } from '@mui/x-charts';
import React from 'react';
import CountHours from '@/Helpers/CountHours';

const InTime = ({ data }) => {
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

  console.log(inTime)

  return (
    <div>
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