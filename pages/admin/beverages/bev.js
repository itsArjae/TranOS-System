import React from "react";
import AdminLayout from "../../../src/admin-components/adminLayout";
import styles from "../../../styles/css/admin-styles/components-css/beverages.data.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { app } from "../../../src/utility/firebase";
import {
  getDatabase,
  ref,
  get,
  equalTo,
  orderByChild,
} from "firebase/database";
import { Divider } from "@mui/material";
import EditData from "../../../src/admin-components/admin.edit-beverage";
import styled from "@emotion/styled";
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
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Drinks.png";
import { deleteData } from "../../../src/utility/admin-utils/beverages.firebase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminBeverageData() {
  const notify = () =>
    toast.success("Data updated successfully!", {
      icon: "✔️",
      //icon: "❌",
    });

  const notifyDel = () =>
    toast.success("Data deleted successfully!", {
      icon: "✔️",
      //icon: "❌",
    });

  const router = useRouter();
  const db = getFirestore(app);
  const id = router.query.BevID;
  const [beverageData, setBeverageData] = useState([]);
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getBevData = () => {
    const bevRef = collection(db, "beverages");

    console.log(id);

    const q = query(bevRef, where("__name__", "==", id));

    onSnapshot(q, (snapshot) => {
      let bev = [];
      snapshot.docs.forEach((doc) => {
        bev.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      setBeverageData(bev);
    });
  };
  useEffect(() => {
    getBevData();
  }, []);

  const goBack = () => {
    router.push("../admin.beverages");
  };
  const viewResume = (link) => {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  };

  const deleteBev = () => {
    let needRender = true;
    deleteData(id);
    notifyDel();
    const interval = setInterval(() => {
      if (needRender == true) {
        router.push("/admin/admin.beverages");
        needRender = false;
      }
    }, 3000);
  };

  return (
    <div className={styles.Data__Container}>
      {beverageData.map((data) => {
        return (
          <div className={styles.Data__Box} key={data.id}>
            <div className={styles.Data__Box1}>
              <div className={styles.Btn__Box}>
                <button className={styles.Exit__Button} onClick={goBack}>
                  ❌
                </button>
              </div>
              <div className={styles.Data__First}>
                <div className={styles.Data__Picture}>
                  <img src={data.ImageUrl ? data.ImageUrl : DefaultPic} />
                </div>
                <div>
                  <button
                    className={styles.Edit__Btn}
                    onClick={() => {
                      setVisible(!visible);
                    }}
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button className={styles.Delete__Btn} onClick={deleteBev}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.Data__Box2}>
              <div className={styles.Box2__Container}>
                <div className={styles.Data__Box2_Info1}>
                  <div>
                    <h1>{`${data.BeverageName}`}</h1>
                    <Divider />
                    <p>
                      Details:
                      <b>
                        {data.Size ? data.Size : "N/A"}
                        {data.Details ? data.Details : ""}
                      </b>
                    </p>
                    <p>
                      ID: <b>{data.id}</b>
                    </p>
                    <p>
                      Status:&nbsp;
                      <b>
                        {data.Status == true ? "Available" : "Not Available"}
                      </b>
                    </p>
                    <p>
                      Price: <b>{Number(data.Price).toFixed(2)}</b>
                    </p>
                    <p>
                      Stocks: <b>{data.Quantity}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {visible === true && (
        <OuterBox>
          <InnerBox>
            <EditData
              setEditDataVisible={setEditDataVisible}
              id={id}
              beverageData={beverageData}
              notify={notify}
            />
          </InnerBox>
        </OuterBox>
      )}
      <ToastContainer />
    </div>
  );
}

AdminBeverageData.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

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
