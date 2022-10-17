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
import EditData from "../../../src/admin-components/admin.edit-rawGood";
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
const DefaultPic = "/assets/admin-assets/pictures/rawGoods.png";

export default function AdminRawGoodsData() {
  const router = useRouter();
  const db = getFirestore(app);
  const id = router.query.RawGoodsID;
  const [rawGoodsData, setRawGoodsData] = useState([]);
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getRawGoodsData = () => {
    const rawGoodsRef = collection(db, "rawGoods");

    console.log(id);

    const q = query(rawGoodsRef, where("__name__", "==", id));

    onSnapshot(q, (snapshot) => {
      let rawGoods = [];
      snapshot.docs.forEach((doc) => {
        rawGoods.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      setRawGoodsData(rawGoods);
    });
  };
  useEffect(() => {
    getRawGoodsData();
  }, []);

  const goBack = () => {
    router.push("../admin.raw-goods");
  };
  const viewResume = (link) => {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  };

  return (
    <div className={styles.Data__Container}>
      {rawGoodsData.map((data) => {
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
                    Update
                  </button>
                  &nbsp;
                  <button className={styles.Delete__Btn}>Delete</button>
                </div>
              </div>
            </div>
            <div className={styles.Data__Box2}>
              <div className={styles.Box2__Container}>
                <div className={styles.Data__Box2_Info1}>
                  <div>
                    <h1>{`${data.rawGoodsName}`}</h1>
                    <Divider />
                    <p>
                      Details: <b>{data.Details + data.Unit}</b>
                    </p>
                    <p>
                      Raw Goods ID: <b>{data.id}</b>
                    </p>
                    <p>
                      Recorded on: <b>{data.Date}</b>
                    </p>
                    <h3>Updated Details on:</h3>
                    <p>
                      Date: <b>{data.UpdatedDate}</b>
                    </p>
                    <p>
                      Time: <b>{data.Time}</b>
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
              rawGoodsData={rawGoodsData}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
}

AdminRawGoodsData.getLayout = function getLayout(page) {
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
