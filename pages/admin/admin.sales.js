import React from "react";
import { useState } from "react";
import AdminLayout from "../../src/admin-components/adminLayout";
import LineChart from "../../src/admin-components/linechart";
import styles from "../../styles/css/admin-styles/admin.sales.module.css";
import { useEffect } from "react";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import SuperTodaySales from "../../src/super-admin-components/supertodaysales";
import SuperMonthlySales from "../../src/super-admin-components/supermonthlysales";
import SuperYearlySales from "../../src/super-admin-components/superyearsales";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
  orderBy,
  limitToLast,
} from "firebase/firestore";
import {app} from '../../src/utility/firebase'

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
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    };

    getDailySales();
    getMonthlySales();
    getYearlySales();
  }, []);


  const [dailySales, setDailySales] = useState([]);
  const db = getFirestore(app);
  const [dsize,setDsize] = useState(0);

  const getDailySales = () => {
    const saleRef = collection(db, "dailySales");
    console.log("read daily");
    const q = query(saleRef, orderBy("date"), limitToLast(30));
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      console.log(sale);
      setDailySales(sale);
    });
  };

  const getDsales = (temp) => {

    let sum = 0;
    dailySales.map((sale)=>{
        sum = sum + Number(sale.totalSales)
    });

    
    let saleStats = 0;
    let currentStats
    let size = dailySales.length - 2;
    if(dailySales.length > 1){
      saleStats = (dailySales[size + 1].totalSales /  dailySales[size]?.totalSales) * 100;
      currentStats = (dailySales[size + 1].totalSales);
    }
    else{
      saleStats = 100;
      currentStats = sum;
    }
    let sign = "";
    if(saleStats >= 100){
      sign = "↑"
    }
    else{
      sign = "↓"
    }
   if(temp == 1){
    return `Php. ${Number(sum / dailySales.length).toFixed(2)} `;
   }
   if(temp == 2){
    return `Php. ${Number(currentStats).toFixed(2)} (${Number(saleStats).toFixed(0)}%) ${sign}`;
   }

  }

  const [monthlySales,setMonthlySales] = useState([]);
  const getMonthlySales = () => {
    const saleRef = collection(db, "monthlySales");
    console.log("read monthly");
    const q = query(
      saleRef,
      orderBy("date"),
      limitToLast(12)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setMonthlySales(sale);

      
    });
  };

  const getMsales = (temp) => {

    let sum = 0;
    monthlySales.map((sale)=>{
        sum = sum + Number(sale.totalSales)
    });
    let saleStats = 0;
    let currentStats
    let size = monthlySales.length - 2;
    if(monthlySales.length > 1){
      saleStats = (monthlySales[size + 1].totalSales /  monthlySales[size]?.totalSales) * 100;
      currentStats = (monthlySales[size + 1].totalSales);
    }
    else{
      saleStats = 100;
      currentStats = sum;
    }
    

    let sign = "";
    if(saleStats >= 100){
      sign = "↑"
    }
    else{
      sign = "↓"
    }
   if(temp == 1){
    return `Php. ${Number(sum / monthlySales.length).toFixed(2)} `;
   }
   if(temp == 2){
    return `Php. ${Number(currentStats).toFixed(2)} (${Number(saleStats).toFixed(0)}%) ${sign}`;
   }

  }


  const [yearlySales,setYearlySales] = useState([]);

  const getYearlySales = () => {
    const saleRef = collection(db, "yearlySales");
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

      setYearlySales(sale);

      
    });
  };
  

  const getYsales = (temp) => {

    let sum = 0;
    yearlySales.map((sale)=>{
        sum = sum + Number(sale.totalSales)
    });
    let saleStats = 0;
    let currentStats
    let size = yearlySales.length - 2;
    if(yearlySales.length > 1){
      saleStats = (yearlySales[size + 1].totalSales /  yearlySales[size]?.totalSales) * 100;
      currentStats = (yearlySales[size + 1].totalSales);
    }
    else{
      saleStats = 100;
      currentStats = sum;
    }
    

    let sign = "";
    if(saleStats >= 100){
      sign = "↑"
    }
    else{
      sign = "↓"
    }
   if(temp == 1){
    return `Php. ${Number(sum / yearlySales.length).toFixed(2)} `;
   }
   if(temp == 2){
    return `Php. ${Number(currentStats).toFixed(2)} (${Number(saleStats).toFixed(0)}%) ${sign}`;
   }

  }
  


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
        <div className={styles.Container}>
          <div className={styles.Ave__Box}>
            <div className={styles.Daily__Box}>
             <div className={styles.average_box} >
             <h2>Ave. Daily Sales: {dailySales.length > 0? getDsales(1) : 'Loading'}</h2>         
             </div>
             <div className={styles.sales__box} >
               This Day Sales: {dailySales.length > 0? getDsales(2) : 'Loading'}
             </div> 
            </div>

            <div className={styles.Daily__Box}>
             <div className={styles.average_box} >
             <h2>Ave. Monthly Sales: {monthlySales.length > 0? getMsales(1) : 'Loading'}</h2>         
             </div>
             <div className={styles.sales__box} >
                This Months Sales: {monthlySales.length > 0? getMsales(2) : 'Loading'}
             </div> 
            </div>


            <div className={styles.Daily__Box}>
             <div className={styles.average_box} >
             <h2>Ave. Yearly Sales: {yearlySales.length > 0? getYsales(1) : 'Loading'}</h2>         
             </div>
             <div className={styles.sales__box} >
                This Years Sales: {yearlySales.length > 0? getYsales(2) : 'Loading'}
             </div> 
            </div>
          </div>
          <div className={styles.Inner}>
            <p>Daily Sales Chart</p>
            <div className={styles.Sales__Daily_Chart}>
              <SuperTodaySales />
            </div>
            <p>Monthly Sales Chart</p>
            <div className={styles.Sales__Daily_Chart}>
              <SuperMonthlySales />
            </div>
            <p>Yearly Sales Chart</p>
            <div className={styles.Sales__Daily_Chart}>
              <SuperYearlySales />
            </div>
          </div>
        </div>
      </div>
    </IdleTimerContainer>
  );
}

AdminSales.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
