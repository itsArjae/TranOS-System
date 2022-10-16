import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
  orderBy,
  limitToLast,
} from "firebase/firestore";
import { useEffect } from 'react';
import { useState } from 'react';

import {app} from '../utility/firebase'
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
export default function SuperTodaySales() {

  const [dailySales,setDailySales] = useState([]);
  const db = getFirestore(app);
  const getDailySales = () => {
    const saleRef = collection(db, "dailySales");
    console.log("read daily");
    const q = query(
      saleRef,
      orderBy("date"),
      limitToLast(30)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setDailySales(sale);

      
    });
  };

  useEffect(()=>{
    getDailySales();
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart width={300} height={100} data={dailySales}>
          <Line type="monotone" dataKey="totalSales" stroke="#F9F9F9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
  )
}
