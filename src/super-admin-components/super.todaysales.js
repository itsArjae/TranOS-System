import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function SuperTodaySales(props) {
  const {dailySales} = props;
  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={200}
          height={60}
          data={dailySales}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <Area type="monotone" dataKey="totalSales" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
  )
}
