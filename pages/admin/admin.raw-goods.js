import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.raw-goods.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app } from "../../src/utility/firebase";
import * as Yup from "yup";
import Image from "next/image";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import AdminRawGoodsMenu from "../../src/admin-components/admin.tables.raw-goods";
import { saveMiddleware2 } from "../../src/utility/admin-utils/raw-goods.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function AdminRawGoods() {
  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rawGoodsData, setRawGoodsData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [weight, setWeight] = useState("kg");

  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };

  //backend
  const id = () => {
    if (rawGoodsData.length === 0) {
      return 1;
    } else {
      return rawGoodsData.length + 1;
    }
  };

  const getRawGoodsData = async () => {
    const querySnapshot = await getDocs(collection(db, "rawGoods"));
    let rawGood = [];
    querySnapshot.forEach((doc) => {
      rawGood.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setRawGoodsData(rawGood);
    setLoading(true);
  };
  useEffect(() => {
    try {
      getRawGoodsData("id", "");
    } catch (err) {}
  }, [ignored]);
  //

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  let time = formatAMPM(new Date());

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
    rawGoodsName: "",
    Details: "",
    Status: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    rawGoodsName: Yup.string().required("Incomplete Details!"),
    Details: Yup.string().required("Incomplete Details!"),
  });

  const onSubmit = (data, { resetForm }) => {
    setLoading(null);
    try {
      saveMiddleware2(data, rawGoodsData.length, date, time, weight, picItem);
      resetForm();
      imageRef.current.value = "";
      setPicItem(null);
      const { id, rawGoodsName, Details, Image } = data;
      let needRender = true;
      const interval = setInterval(() => {
        if (needRender === true) {
          console.log("update");
          needRender = false;
          forceUpdate();
          setLoading(true);
        }
      }, 5000);
    } catch (err) {}
  };

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.rawGoods__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.rawGoods__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD RAW GOODS</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/admin-assets/svg/rawgoods.icon.svg"
                    height={30}
                    width={30}
                    alt="Raw Goods Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="rawGoodsName"
                    placeholder=" Raw Goods Name"
                  />
                  <ErrorMessage name="rawGoodsName" />
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Details"
                    placeholder="Details (eg. weight, count)"
                    type="number"
                  />
                  <ErrorMessage name="Details" />
                </div>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="Weight"
                    id="Weight"
                    onChange={(e) => setWeight(e.target.value)}
                  >
                    <option value="kg">kilogram</option>
                    <option value="g">gram</option>
                    <option value="ml">millimeter</option>
                    <option value="L">liter</option>
                    <option value="can/s">can/s</option>
                    <option value="pack/s">pack/s</option>
                    <option value="pcs">piece/s</option>
                  </select>
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Image: </label> <br></br>
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
                  type="button"
                  onClick={() => {
                    console.log(initialValues);
                  }}
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
          <AdminRawGoodsMenu rawGoodsData={rawGoodsData} />
        </div>
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
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;

AdminRawGoods.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
