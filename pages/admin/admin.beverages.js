import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.beverages.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app } from "../../src/utility/firebase";
import * as Yup from "yup";
import Image from "next/image";
import AdminTablesBeverages from "../../src/admin-components/admin.tables.beverages";
import {
  saveMiddleware2,
  saveNotifData,
  updateBeverageStatus,
} from "../../src/utility/admin-utils/beverages.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAuth } from "../../src/utility/firebase";

export default function AdminBeverages() {
  const currentUser = useAuth();
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    }
  }, []);

  const notify = (name) =>
    toast.success(`${name} successfully added!`, {
      icon: "✔️",
      //icon: "❌",
    });

  const notifyUD = (name) =>
    toast.success(`${name} status successfully changed!`, {
      icon: "✔️",
      //icon: "❌",
    });

  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [beverageData, setBeverageData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [stat, setStatus] = useState("Available");
  const [bevSize, setSize] = useState("");
  const [bucket, setBucket] = useState("");

  function Loading() {
    setLoading(!isLoading);
  }

  const updateData = () => {
    let needRender = true;
    const interval = setInterval(() => {
      if (needRender === true) {
        console.log("update");
        needRender = false;
        getBeverageData();
        setLoading(true);
      }
    }, 3000);
  };

  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };
  //backend

  const bucketData = () => {
    if (bucket == "bucket") {
      return true;
    } else if (bucket == "solo") {
      return false;
    }
  };

  const onSubmit = (data, { resetForm }) => {
    let needRender = true;
    setLoading(null);
    saveMiddleware2(
      data,
      beverageData.length,
      bevSize,
      picItem,
      date,
      bucketData(),
      currentUser.email
    );
    resetForm();
    imageRef.current.value = "";
    setPicItem(null);
    setBucket("");
    setSize("");
    const { id, BeverageName, Price, Quantity, Size, Image } = data;

    const interval = setInterval(() => {
      if (needRender === true) {
        notify(data.BeverageName);
        renderEmp();
        needRender = false;
      }
    }, 5000);
  };

  const id = () => {
    if (beverageData.length === 0) {
      return 1;
    } else {
      return beverageData.length + 1;
    }
  };

  const getBeverageData = async () => {
    const querySnapshot = await getDocs(collection(db, "beverages"));
    let beverage = [];
    querySnapshot.forEach((doc) => {
      beverage.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");

    setBeverageData(beverage);
    setLoading(true);
  };
  //

  const renderEmp = async () => {
    const querySnapshot = await getDocs(collection(db, "beverages"));
    let emp = [];
    querySnapshot.forEach((doc) => {
      emp.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setBeverageData(emp);
    setLoading(true);
  };

  useEffect(() => {
    try {
      getBeverageData();
    } catch (err) {}
  }, []);

  var dt = new Date();
  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let monthFixed = () => {
    if (month.toString.length === 1) {
      return `0${month}`;
    } else {
      return month;
    }
  };
  let year = dt.getFullYear();
  let date = `${month}/${day}/${year}`;

  const initialValues = {
    BeverageName: "",
    Price: "",
    Quantity: "",
    Size: "",
    Status: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    BeverageName: Yup.string().required("Incomplete Details!"),
    Price: Yup.string().required("Incomplete Details!"),
    Quantity: Yup.string().required("Incomplete Details!"),
  });

  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Beverages__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.Beverages__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD BEVERAGES</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/admin-assets/svg/beverage.logo.svg"
                    height={30}
                    width={30}
                    alt="beverages Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="BeverageName"
                    placeholder=" Beverage Name"
                    required={true}
                  />
                </div>

                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Price"
                    placeholder="Price per piece"
                    type="number"
                    required={true}
                  />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Quantity"
                    placeholder="Quantity per piece"
                    type="number"
                    required={true}
                  />
                </div>

                <div className={styles.Form__Input_Box}>
                  <select
                    name="Weight"
                    id="Weight"
                    required={true}
                    onChange={(e) => setBucket(e.target.value)}
                  >
                    <option selected disabled hidden value="">
                      Select Category
                    </option>
                    <option value="bucket">Bucket</option>
                    <option value="solo">Solo</option>
                  </select>
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Size"
                    placeholder="Size"
                    type="number"
                  />
                </div>

                <div className={styles.Form__Input_Box}>
                  <select
                    name="Weight"
                    id="Weight"
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="ml">millimeter</option>
                    <option value="L">liter</option>
                  </select>
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Image: </label>
                  <input
                    className={styles.Form__Input_File}
                    name="Image"
                    type="file"
                    id="imageFile"
                    onChange={imageHandler}
                    ref={imageRef}
                  />
                </div>
              </div>
              <div className={styles.Form__Btn_Container}>
                <button
                  className={styles.Form__Clear_Btn}
                  type="reset"
                  onClick={() => {}}
                >
                  Clear
                </button>
                <button type="submit" className={styles.Form__Submit_Btn}>
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className={styles.Table__Container}>
          <AdminTablesBeverages
            beverageData={beverageData}
            updateData={updateData}
            Loading={Loading}
            notifyUD={notifyUD}
            setEditDataVisible={setEditDataVisible}
          />
        </div>

        {visible === true && (
          <OuterBox>
            <InnerBox>
              <PrintBox
                setEditDataVisible={setEditDataVisible}
                printItems={beverageData}
                date={date}
              />
            </InnerBox>
          </OuterBox>
        )}

        <ToastContainer />
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      {" "}
      <InnerBox>
        <LoadingScreen />
      </InnerBox>{" "}
    </OuterBox>
  );
}
const OuterBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color:white;
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;

const PrintBox = (props) => {
  const { setEditDataVisible, printItems } = props;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
  var globalTime = today.getHours()
  var time = (today.getHours() % 12 || 12)+ ":" + `${today.getMinutes() >= 10 ? today.getMinutes() : '0'+today.getMinutes()}` + ` ${globalTime > 12 ? 'pm' :'am'}`


  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });

  return (
    <div className={styles.print_cont}>
      <div className={styles.btn}>
        <button onClick={setEditDataVisible} className={styles.print__btn}>
          BACK
        </button>
        <button onClick={handlePrint} className={styles.print__btn}>
          PRINT
        </button>
      </div>
      <div className={styles.print_box} ref={componentRef}>
        <div>Printed: {date} {time}</div>
        <div className={styles.headers}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              marginRight: "50px",
            }}
          >
            <b>
              <div style={{ fontSize: "30px" }}>TRANOS </div>
              <div style={{ fontSize: "20px" }}>Beverages Summary Report</div>
            </b>
          </div>
          <img src="/assets/admin-assets/pictures/logo.png" />
        </div>

        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>Beverage Name</b>
                </TableCell>
                <TableCell>
                  <b>Quantity</b>
                </TableCell>
                <TableCell>
                  {" "}
                  <b>Price</b>{" "}
                </TableCell>
              </TableRow>
              {printItems.map((data) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                      {data.BeverageName} &nbsp;{" "}
                      {data.Size ? (
                        <div>
                          {data.Size}
                          {data.Details}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell> {data.Quantity} </TableCell>
                    <TableCell>
                      {" "}
                      Php.
                      {Number(data.Price)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    </TableCell>
                    <TableCell> {data.dateCreated} </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

AdminBeverages.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
