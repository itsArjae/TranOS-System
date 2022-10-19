import React from "react";
import AdminLayout from "../../../src/admin-components/adminLayout";
import styles from "../../../styles/css/admin-styles/components-css/employees.data.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { app } from "../../../src/utility/firebase";
import { Divider } from "@mui/material";
import { statusChange } from "../../../src/utility/admin-utils/employees.firebase";
import EditData from "../../../src/admin-components/admin.edit-employee-admin";
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
import { Field } from "formik";
const DefaultPic = "/assets/admin-assets/pictures/default-profile.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminEmployeeData() {
  const notify = () =>
    toast.success("Data updated successfully!", {
      icon: "✔️",
      //icon: "❌",
    });

  const db = getFirestore(app);
  const router = useRouter();
  const id = router.query.EmpID;

  const [empData, setEmpData] = useState([]);
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getEmpData = () => {
    const empRef = collection(db, "employees");

    if (!id) {
      router.push("../admin.emp");
      return;
    }
    const q = query(empRef, where("__name__", "==", id));
    onSnapshot(q, (snapshot) => {
      let emp = [];
      snapshot.docs.forEach((doc) => {
        emp.push({ ...doc.data(), id: doc.id });
      });
      setEmpData(emp);
    });
  };
  useEffect(() => {
    getEmpData();
  }, []);

  const goBack = () => {
    router.push("../admin.emp");
  };
  const viewResume = (link) => {
    if (!link) {
      return;
    }
    window.open(link, "_blank");
  };

  const handleStatusChange = (Status) => {
    console.log("clicked");
    if (Status == true) {
      statusChange(id, false);
    } else {
      statusChange(id, true);
    }
  };

  return (
    <div className={styles.Data__Container}>
      {empData.map((data) => {
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
                <Divider />
                <div>
                  <p>
                    EmpID: <b>{data.id.substring(1, 10)}...</b>
                  </p>
                  <p>
                    Position: <b>{data.Position}</b>
                  </p>
                  <p>
                    Status: <b>{data.Status == true ? "Active" : "Inactive"}</b>
                  </p>
                  <button
                    className={styles.Resume__Btn}
                    onClick={() => {
                      viewResume(data.ResumeUrl);
                    }}
                  >
                    {data.ResumeUrl ? "View Resume" : "No Resume"}
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.Data__Box2}>
              <div className={styles.Box2__Container}>
                <div className={styles.Data__Box2_Info1}>
                  <div>
                    <h1>
                      {`${data.Surname}, ${data.FirstName} ${data.MiddleName}`}
                    </h1>
                    <p>
                      Age: <b>{data.Age}</b>
                    </p>
                    <p>
                      Gender: <b>{data.Gender}</b>
                    </p>
                    <p>
                      Address: <b>{data.Address}</b>
                    </p>
                  </div>
                </div>
                <Divider />
                <div className={styles.Data__Box2_Info2}>
                  <h3>Contacts</h3>
                  <p>
                    Username: <b>{data.Username ? data.Username : "Chef"}</b>
                  </p>
                  <p>
                    Email: <b>{data.Email} </b>
                  </p>
                  <p>
                    Mobile No: <b>{data.Number} </b>
                  </p>
                </div>
              </div>
              <div className={styles.Btn__Control}>
                <button
                  onClick={() => {
                    handleStatusChange(data.Status);
                  }}
                >
                  set as {data.Status == true ? "Inactive" : "Active"}
                </button>
                <button
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  Edit
                </button>
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
              empData={empData}
              notify={notify}
            />
          </InnerBox>
        </OuterBox>
      )}
      <ToastContainer />
    </div>
  );
}

AdminEmployeeData.getLayout = function getLayout(page) {
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
