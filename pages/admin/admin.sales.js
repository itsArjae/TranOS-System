import React from "react";
import { useState } from "react";
import AdminLayout from "../../src/admin-components/adminLayout";
import LineChart from "../../src/admin-components/linechart";
import styles from "../../styles/css/admin-styles/admin.sales.module.css";
import { useEffect } from "react";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";

const SampleData = [
  {
    id: 0,
    year: 2017,
    sales: 60000,
  },
  {
    id: 1,
    year: 2018,
    sales: 70000,
  },
  {
    id: 2,
    year: 2019,
    sales: 90000,
  },
  {
    id: 3,
    year: 2000,
    sales: 120000,
  },
  {
    id: 4,
    year: 2021,
    sales: 200000,
  },
  {
    id: 5,
    year: 2022,
    sales: 70000,
  },
  {
    id: 6,
    year: 2023,
    sales: 150000,
  },
];

export default function AdminSales() {
  const router = useRouter();



  const [dataSet, setDataSet] = useState({
    labels: SampleData.map((data) => data.year),
    datasets: [
      {
        label: "YearlySales",
        data: SampleData.map((data) => data.sales),
        backgroundColor: ["#00D7FF", "#F8F9D7", "#A0D995"],
        borderColor: "blue",
        borderWidth: 2,
      },
    ],
  });
  return (
    <IdleTimerContainer>
      <div className={styles.Sales__Container}>
        <div className={styles.Ave__Box}>
          <div className={styles.Daily__Box}></div>
          <div className={styles.Monthly__Box}></div>
          <div className={styles.Yearly__Box}></div>
        </div>
        <div className={styles.Sales__Daily_Chart}>
          <LineChart chartData={dataSet} />
        </div>
      </div>
    </IdleTimerContainer>
  );
}

AdminSales.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
