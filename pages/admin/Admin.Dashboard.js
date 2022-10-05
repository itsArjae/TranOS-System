import styles from "../../styles/css/admin-styles/admin.dashboard.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LineChart from "../../src/admin-components/linechart";
import { app } from "../../src/utility/firebase";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  equalTo,
  orderByChild,
} from "firebase/database";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import {
  query,
  where,
  orderBy,
  limit,
  getFirestore,
  collection,
  onSnapshot,
  FieldPath,
  Firestore,
} from "firebase/firestore";

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

const Dashboard = () => {
  const [dataSet, setDataSet] = useState({
    labels: SampleData.map((data) => data.year),
    datasets: [
      {
        label: "Yearly Sales",
        data: SampleData.map((data) => data.sales),
        backgroundColor: ["#00D7FF", "#F8F9D7", "#A0D995"],
        borderColor: "blue",
        borderWidth: 2,
      },
    ],
  });

  const [value, onChange] = useState(new Date());

  const router = useRouter();
  const [open, setopen] = useState(false);

  const goDash = () => {
    setopen(false);
    router.push("/admin/Admin.Dashboard");
  };
  const goEmp = () => {
    setopen(false);
    router.push("/admin/admin.employees");
  };
  const goDrinks = () => {
    setopen(false);
    router.push("/admin/admin.beverages");
  };
  const goSales = () => {
    setopen(false);
    router.push("/admin/admin.sales");
  };
  const goTables = () => {
    setopen(false);
    router.push("/admin/admin.manage-tableredo");
  };
  const goMenu = () => {
    setopen(false);
    router.push("/admin/admin.menu");
  };
  const goTransac = () => {
    setopen(false);
    //router.push("/admin/admin.transactions");
  };
  const goRawGoods = () => {
    setopen(false);
    router.push("/admin/admin.raw-goods");
  };
  const goSignout = () => {
    setopen(false);
    localStorage.removeItem("accessToken");
    router.push("/sign-in");
  };
  {
    /*
  const [notifData, setNotif] = useState([]);
  const [notif, setNotification] = useState();

  const getNotifData = (field, fieldData) => {
    try {
      const db = getDatabase(app);
      const notifRef = query(ref(db, "notifications"), orderByChild("id"));
      get(notifRef).then((snapshot) => {
        var notification = [];

        snapshot.forEach((childSnapshot) => {
          notification.push(childSnapshot.val());
        });
        setNotif(notification);
      });
      console.log(notification);
    } catch (err) {}
  };

  useEffect(() => {
    try {
      getNotifData("id", "");
    } catch (err) {}
  }, []);

  useEffect(() => {
    {
      notifData.map((data) => {
        setNotification(data.Details);
      });
    }
  }, []);*/
  }
  var dt = new Date();
  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let year = dt.getFullYear();

  const [dsalesData, setDSalesData] = useState([]);
  const [msalesData, setMSalesData] = useState([]);

  const db = getFirestore(app);

  const getDSalesData = () => {
    const saleRef = collection(db, "transactions");

    const q = query(
      saleRef,
      where("day", "==", day),
      where("month", "==", month),
      where("year", "==", year)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      setDSalesData(sale);
    });
  };
  useEffect(() => {
    getDSalesData();
  }, []);

  const getMSalesData = () => {
    const saleRef = collection(db, "transactions");

    const q = query(
      saleRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      setMSalesData(sale);
    });
  };
  useEffect(() => {
    getMSalesData();
  }, []);

  const getDTotal = () => {
    let sum = 0;
    dsalesData.map((data) => {
      sum = sum + data.totalAmount;
    });
    return sum;
  };

  const getMTotal = () => {
    let sum = 0;
    msalesData.map((data) => {
      sum = sum + data.totalAmount;
    });
    return sum;
  };

  return (
    <IdleTimerContainer>
      <div className={styles.DashBoard__Container}>
        <div className={styles.Icons__Container}>
          <div className={styles.Others__Container}>
            <div className={styles.Sales__Container}>
              <div className={styles.Sales__Container2}>
                <div className={styles.MSales__Container}>
                  <Image
                    src="/assets/admin-assets/svg/peso.icons.svg"
                    width={80}
                    height={80}
                    alt="Daily sales icon"
                  />
                </div>
                <div className={styles.Sales}>
                  <div className={styles.TxtSales}>
                    <h2 className={styles.Sales_Text}>Daily Sales</h2>
                  </div>

                  <div className={styles.TxtSales_Price}>
                    <h1 className={styles.Price_Text}>
                      {getDTotal()
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </h1>
                  </div>
                </div>
              </div>

              <div className={styles.Sales__Container1}>
                <div className={styles.MSales__Container}>
                  <Image
                    src="/assets/admin-assets/svg/montlySales.icons.svg"
                    width={80}
                    height={80}
                    alt="monthly sales icon"
                  />
                </div>

                <div className={styles.Sales}>
                  <div className={styles.TxtSales}>
                    <h2 className={styles.Sales_Text}>Monthly Sales</h2>
                  </div>

                  <div className={styles.TxtSales_Price}>
                    <h1 className={styles.Price_Text}>
                      {getMTotal()
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.Graph__Container}>
              <LineChart chartData={dataSet} />
            </div>
          </div>

          <div className={styles.Icons__Container2}>
            <div className={styles.Icons__Container2_1}>
              <button
                className={styles.btnDashboard}
                style={{ marginBottom: "10px" }}
                onClick={goRawGoods}
              >
                <Image
                  src="/assets/admin-assets/svg/db.rawgoods.icon.svg"
                  width={50}
                  height={50}
                  alt="raw goods icon"
                />
                <p className={styles.Icons__Text}>RAW GOODS</p>
              </button>

              <button className={styles.btnEmployees} onClick={goEmp}>
                <Image
                  src="/assets/admin-assets/svg/db.users.icon.svg"
                  width={50}
                  height={50}
                  alt="users icon"
                />
                <p className={styles.Icons__Text}>EMPLOYEES</p>
              </button>
            </div>
            <div className={styles.Icons__Container2_1}>
              <button
                className={styles.btnBeverages}
                style={{ marginBottom: "10px" }}
                onClick={goDrinks}
              >
                <Image
                  src="/assets/admin-assets/svg/db.beverages.icon.svg"
                  width={50}
                  height={50}
                  alt="beverages icon"
                />
                <p className={styles.Icons__Text}>BEVERAGES</p>
              </button>

              <button className={styles.btnTables} onClick={goTables}>
                <Image
                  src="/assets/admin-assets/svg/db.tables.svg"
                  width={50}
                  height={50}
                  alt="tables icon"
                />
                <p className={styles.Icons__Text}>TABLES</p>
              </button>
            </div>

            <div className={styles.Icons__Container2_1}>
              <button
                className={styles.btnSales}
                style={{ marginBottom: "10px" }}
                onClick={goSales}
              >
                <Image
                  src="/assets/admin-assets/svg/db.sales.icon.svg"
                  width={50}
                  height={50}
                  alt="sales icon"
                />
                <p className={styles.Icons__Text}>SALES</p>
              </button>

              <button className={styles.btnTransactions}>
                <Image
                  src="/assets/admin-assets/svg/db.transaction.icon.svg"
                  width={50}
                  height={50}
                  alt="transactions icon"
                />
                <p className={styles.Icons__Text}>TRANSACTIONS</p>
              </button>
            </div>

            <div className={styles.Icons__Container2_1}>
              <button
                className={styles.btnMenu}
                style={{ marginBottom: "10px" }}
                onClick={goMenu}
              >
                <Image
                  src="/assets/admin-assets/svg/db.menu.icon.svg"
                  width={50}
                  height={50}
                  alt="menu icon"
                />
                <p className={styles.Icons__Text}>MEALS</p>
              </button>

              <button className={styles.btnSignOut}>
                <Image
                  src="/assets/admin-assets/svg/db.logout.icon.svg"
                  width={50}
                  height={50}
                  alt="logout icon"
                />
                <p className={styles.Icons__Text} onClick={goSignout}>
                  SIGN OUT
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.DashBoard__Container2}>
          <div className={styles.Notifications__Container}>
            <div className={styles.Notifications__Header}>
              <h4>Notifications</h4>
            </div>
            {/**  <div className={styles.Notifications}>
             {notifData.map((data) => {
                return (
                  <div key={data.id} className={styles.Notifications__Content}>
                    <div style={{ display: "flex" }}>
                      <p>{data.Details}</p>
                      <button className={styles.btnClose_Notif}>❌</button>
                    </div>
                  </div>
                );
              })}
            </div>*/}
          </div>

          <div className={styles.Calendar__Container}>
            <Calendar
              className={styles.Calendar}
              onChange={onChange}
              value={value}
            />
          </div>
        </div>
      </div>
    </IdleTimerContainer>
  );
};

export default Dashboard;
Dashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
