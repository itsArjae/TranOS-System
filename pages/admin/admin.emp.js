import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.employees.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  addUser,
  app,
  secondaryLogin,
  useAuth,
} from "../../src/utility/firebase";
import * as Yup from "yup";
import Image from "next/image";
import AdminTables from "../../src/admin-components/admin.tables";
import { saveMiddleware } from "../../src/utility/admin-utils/employees.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import MessageBox from "../../src/misc/messagebox";
import { UserDocument } from "../../src/misc/userdata";
import AdminTablesEmp from "../../src/admin-components/admin.tables-emp";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminEmployees() {
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    }
  }, []);

  const notify = (name) =>
    toast.success(`${name} successfully created!`, {
      icon: "✔️",
      //icon: "❌",
    });

  const notifyError = (name) =>
    toast.error(`${name}`, {
      // icon: "✔️",
      icon: "❌",
    });

  const currentUser = useAuth();
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");
  const handleMessageVisible = (temp, message) => {
    setMessage(message);
    setMessageVisible(temp);
  };

  const router = useRouter();
  const db = getFirestore(app);
  let count = 0;
  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  // data container
  const [picItem, setPicItem] = useState(); // for image
  const [resItem, setResItem] = useState(); // for resume
  const imageRef = useRef(null);
  const resumeRef = useRef(null);
  const [pos, setPos] = useState("");
  const [gen, setGen] = useState("");
  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };

  //sign in validation

  const resetData = () => {
    setPos("");
    setGen("");
  };

  //backend
  const onSubmit = async (data, { resetForm }) => {
    if (data.Number.length != 11) {
      notifyError("Invalid Number! It must be 11 digits long.");
      return;
    }
    console.log(data.Number);

    let needRender = true;
    let password = null;
    let username = null;
    let dpassword = null;
    if (pos === "Cashier") {
      password = `TCashier2022`;
      username = `TCashier`;
      dpassword = `TCashier2022`;
    }
    if (pos === "Admin") {
      password = `TAdmin2022`;
      username = `TAdmin`;
      dpassword = `TAdmin2022`;
    }
    if (pos === "Chef") {
      password = null;
      username = null;
      dpassword = null;
    }
    if (pos === "Cashier") {
      password = `TCashier2022`;
      username = `TCashier`;
      dpassword = `TCashier2022`;
    }
    if (pos === "Waiter") {
      password = `TWaiter2022`;
      username = `TWaiter`;
      dpassword = `TWaiter2022`;
    }

    try {
      await addUser(data.Email, password, pos);
    } catch (err) {
      console.log(err);
      setMessage("Email is already taken");
      setMessageVisible(true);
      return;
    }

    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let email = `${data.Surname}${year}${month}${day}.${username}`;
    const hashedPassword = bcrypt.hashSync(password, 10);
    saveMiddleware(
      data,
      empData.length,
      resItem,
      picItem,
      hashedPassword,
      email,
      dpassword,
      pos,
      gen
    );
    resetForm();
    imageRef.current.value = "";
    resumeRef.current.value = "";
    setPos("");
    setGen("");
    setPicItem(null);
    setResItem(null);
    notify(data.Email);
    const interval = setInterval(() => {
      if (needRender === true) {
        renderEmp();
        needRender = false;
      }
    }, 5000);
  };

  const id = () => {
    if (empData.length === 0) {
      return 1;
    } else {
      return empData.length + 1;
    }
  };

  const [empData, setEmpData] = useState([]);
  const [empActive, setActiveData] = useState([]);
  const [empInactive, setInactiveData] = useState([]);

  const getEmpData = async () => {
    const saleRef = collection(db, "employees");
    console.log("read");
    const q = query(
      saleRef,
      where("Position", "not-in", ["SuperAdmin", "Admin"])
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setEmpData(sale);
    });
    setLoading(true);
  };

  const getActiveEmpData = async () => {
    const saleRef = collection(db, "employees");
    console.log("read active");
    const q = query(
      saleRef,
      where("Position", "not-in", ["SuperAdmin", "Admin"])
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      console.log(sale);

      sale.map((data) => {
        if (data.Status === false) {
          setInactiveData([...empInactive, data]);
        } else {
          setActiveData([...empActive, data]);
        }
      });
      setActiveData(sale);
    });
    setLoading(true);
  };

  const getInactiveEmpData = async () => {
    const saleRef = collection(db, "employees");
    console.log("read inactive");
    const q = query(
      saleRef,
      where("Status", "==", false),
      where("Position", "not-in", ["SuperAdmin", "Admin"])
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setInactiveData(sale);
    });
    setLoading(true);
  };

  const renderEmp = async () => {
    const saleRef = collection(db, "employees");
    const q = query(
      saleRef,
      where("Position", "not-in", ["SuperAdmin", "Admin"])
    );
    console.log("read");
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setEmpData(sale);
    });
    setLoading(true);
  };

  useEffect(() => {
    try {
      getActiveEmpData();
      // getInactiveEmpData();
      getEmpData();
    } catch (err) {}
  }, []);
  //

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
    Surname: "",
    FirstName: "",
    MiddleName: "",
    Age: "",
    Position: "",
    Gender: "",
    Email: "",
    Active: true,
    Address: "",
    Image: "",
    Resume: "",
    id: id(),
    Number: "",
  };

  const validationSchema = Yup.object().shape({
    Surname: Yup.string().required("Invalid"),
    FirstName: Yup.string().required("Invalid"),
    MiddleName: Yup.string().required("Invalid"),
    Age: Yup.number().required("Invalid"),
    Email: Yup.string().required("Invalid"),
    Address: Yup.string().required("Invalid"),
    Number: Yup.string().required("Invalid"),
  });

  //
  const timerRef = useRef(null);

  const onIdle = () => {
    console.log("onIdle");
  };

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Employees__Container1}>
        <div className={styles.Ave__Box}>
          <div className={styles.Sales__Container1}>
            <div className={styles.Sales}>
              <div className={styles.TxtSales}>
                <h2 className={styles.Sales_Text}>Total Users</h2>
              </div>

              <div className={styles.TxtSales_Price}>
                <h1 className={styles.Price_Text}>{empData.length}</h1>
              </div>
            </div>
            <div className={styles.MSales__Container}>
              <img
                src="/assets/admin-assets/svg/usersemp.icon.svg"
                width={50}
                height={50}
                alt="Users Icon"
              />
            </div>
          </div>

          <div className={styles.Sales__Container2}>
            <div className={styles.Sales}>
              <div className={styles.TxtSales}>
                <h2 className={styles.Sales_Text}>Active Users</h2>
              </div>

              <div className={styles.TxtSales_Price}>
                <h1 className={styles.Price_Text}>
                  {empActive.length - empInactive.length}
                </h1>
              </div>
            </div>
            <div className={styles.MSales__Container}>
              <img
                src="/assets/admin-assets/svg/activeusers.icon.svg"
                width={50}
                height={50}
                alt="Active Users Icon"
              />
            </div>
          </div>

          <div className={styles.Sales__Container3}>
            <div className={styles.Sales}>
              <div className={styles.TxtSales}>
                <h2 className={styles.Sales_Text}>Inactive Users</h2>
              </div>

              <div className={styles.TxtSales_Price}>
                <h1 className={styles.Price_Text}>{empInactive.length}</h1>
              </div>
            </div>
            <div className={styles.MSales__Container}>
              <img
                src="/assets/admin-assets/svg/inactiveusers.icon.svg"
                width={50}
                height={50}
                alt="Inactive Users Icon"
              />
            </div>
          </div>
        </div>
        <div className={styles.users}>
          <div className={styles.Form__Container}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form autoComplete="off" className={styles.Employees__Form}>
                <div className={styles.Form__Header}>
                  <div className={styles.Header__Top1}>ADD USERS</div>
                  <div className={styles.Header__Top2}>
                    <Image
                      src="/assets/admin-assets/svg/user.icon.svg"
                      height={30}
                      width={30}
                      alt="User Icon"
                    />
                  </div>
                  <div className={styles.Header__Top3}>{date}</div>
                </div>
                <div className={styles.Form__Input_Container}>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input}
                      name="Surname"
                      placeholder="Surname"
                      required={true}
                    />
                  </div>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input}
                      name="FirstName"
                      placeholder="FirstName"
                      required={true}
                    />
                  </div>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input}
                      name="MiddleName"
                      placeholder="MiddleName"
                      required={true}
                    />
                  </div>
                </div>
                <div className={styles.Form__Input_Container}>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input}
                      name="Age"
                      placeholder="Age"
                      type="number"
                      required={true}
                    />
                  </div>
                  <div className={styles.Form__Input_Box}>
                    <select
                      name="Gender"
                      id="Gender"
                      required={true}
                      value={gen}
                      onChange={(event) => {
                        setGen(event.target.value);
                      }}
                    >
                      <option selected disabled hidden value="">
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className={styles.Form__Input_Box}>
                    <select
                      name="Position"
                      id="Position"
                      required={true}
                      value={pos}
                      onChange={(event) => {
                        setPos(event.target.value);
                      }}
                    >
                      <option selected disabled hidden value="">
                        Select Position
                      </option>
                      <option value="Cashier">Cashier</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Chef">Chef</option>
                    </select>
                  </div>
                </div>
                <div className={styles.Form__Input_Container}>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input_Email}
                      name="Email"
                      placeholder="Email"
                      type="email"
                      required={true}
                    />
                    <Field
                      className={styles.Form__Input_Email}
                      name="Number"
                      placeholder="Contact No.(ex. 0912 345 6789)"
                      required={true}
                    />
                  </div>
                </div>
                <div className={styles.Form__Input_Container}>
                  <div className={styles.Form__Input_Box}>
                    <Field
                      className={styles.Form__Input_Add}
                      name="Address"
                      placeholder="Address"
                      type="Address"
                      required={true}
                    />
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
                  <div className={styles.Form__Input_Box_File}>
                    <label htmlFor="imageFile">Resume: </label>
                    <input
                      className={styles.Form__Input_File}
                      name="Resume"
                      type="file"
                      id="resumeFile"
                      onChange={resumeHandler}
                      ref={resumeRef}
                    />
                  </div>
                </div>
                <div className={styles.Form__Btn_Container}>
                  <button
                    className={styles.Form__Clear_Btn}
                    type="reset"
                    onClick={() => {
                      resetData();
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
            <AdminTablesEmp empData={empData} />
          </div>
        </div>
        {messageVisible == true && (
          <OuterBox>
            <InnerBox>
              <MessageBox message={message} setClose={handleMessageVisible} />
            </InnerBox>
          </OuterBox>
        )}
        <ToastContainer />
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      <InnerBox>
        <LoadingScreen />
      </InnerBox>
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

AdminEmployees.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
