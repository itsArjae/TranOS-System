import React, { useEffect, useState } from "react";
import styles from "../styles/css/login-pages/login.module.css";
import {
  app,
  loginUser,
  resetUserPassword,
  useAuth,
} from "../src/utility/firebase";
import { useRouter } from "next/router";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { TailSpin } from "react-loader-spinner";
import Head from "next/head";

export default function SignIn() {
  useEffect(() => {
    sessionStorage.removeItem("Position");
  }, []);

  const router = useRouter();
  const [pos, setPos] = useState("Admin");
  const currentUser = useAuth();
  const initialValues = {
    email: "",
    password: "",
  };
  const db = getFirestore(app);

  const [step, setStep] = useState(1);

  const resetPass = async (email) => {
    try {
      await resetUserPassword(EmpEmail.current.value);
      console.log("semt");
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (password) => {
    setIsLogging(true);
    if(userInfo.Status == false){
      handleErrorMessage("This Account is not Active");
      setIsLogging(false);
      return;
    }

    if (userInfo.Position == "Waiter") {
      handleErrorMessage("This is a waiter account");
      return;
    }
    try {
      await loginUser(userInfo.Email, password);
    } catch (err) {
      handleErrorMessage("Wrong Password");
      setIsLogging(false);
      return;
    }
    if (userInfo.Position == "Admin") {
      sessionStorage.setItem("Position", "Admin");
      router.push("/admin/Admin.Dashboard");
      return;
    }
    if (userInfo.Position == "Cashier") {
      sessionStorage.setItem("Position", "Cashier");
      router.push("/cashier/cashier.table");
      return;
    }
    if (userInfo.Position == "SuperAdmin") {
      sessionStorage.setItem("Position", "SuperAdmin");
      router.push("/super-admin/super.dashboard");
      return;
    }
    if (userInfo.Position == "Chef") {
      sessionStorage.setItem("Position", "Chef");
      router.push("/kitchen/kitchen.home");
      return;
    }
  };

  const [userInfo, setUserInfo] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(true);
  const [emailExist, setEmailExist] = useState(true);
  const [email, setEmail] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const getUserInfo = async (temp) => {
    setHasLoaded(false);
    console.log("try");
    setUserInfo([]);
    try {
      const saleRef = collection(db, "employees");
      console.log("read users");
      const q = query(saleRef, where("Email", "==", temp));
      onSnapshot(q, (snapshot) => {
        let sale = [];
        let uid = "";
        snapshot.docs.forEach((doc) => {
          sale.push({ ...doc.data(), id: doc.id });
          uid = doc.id;
        });
        if (!uid) {
          handleErrorMessage("Email Doesn't Exist");
          setHasLoaded(true);
          return;
        }
        sale.map(async (data) => {
          if (data.IsFirstLogin == true) {
            let pass = "";

            if (data.Position === "Admin") {
              pass = "TAdmin2022";
            }
            if (data.Position === "Cashier") {
              pass = "TCashier2022";
            }
            if (data.Position === "Chef") {
              pass = "TChef2022";
            }

            router.push(
              {
                pathname: "/reset-password",
                query: {
                  id: data.id,
                  email: data.Email,
                  password: data.Position,
                },
              },
              "/reset-password"
            );
            return;
          }

          setUserInfo({
            Email: data.Email,
            Position: data.Position,
            FirstLog: data.IsFirstLogin,
            id: data.id,
            Status: data.Status
          });
        });
        setHasLoaded(true);
      });
    } catch (err) {}
  };
  useEffect(() => {
    if (!userInfo.Email) {
      console.log("emaill", userInfo.Email);
    } else {
      console.log("the Email has changed", userInfo.Email);
      setStep(2);
      setHasError(false);
    }
  }, [userInfo]);

  const handleErrorMessage = (message) => {
    setErrorMes(message);
    setHasError(true);
  };

  const InputEmail = (props) => {
    const [temp, setTemp] = useState("");

    return hasLoaded ? (
      <div>
        <Head>
          <title>BROS | SIGN IN</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <div className={styles.Input__Box}>
          <input
            placeholder="Enter Email"
            onChange={(event) => {
              setTemp(event.target.value);
            }}
          />
        </div>
        <div className={styles.Button__Box}>
          <button
            className={styles.submit1}
            onClick={() => {
              if (!temp) {
                handleErrorMessage("Please input an email");
                return;
              }
              getUserInfo(temp);
            }}
          >
            Next
          </button>
        </div>
      </div>
    ) : (
      <Loading />
    );
  };

  const back = () => {
    setStep(1);
    setUserInfo([]);
  };

  const InputPassword = () => {
    const [temp, setTemp] = useState("");
    return hasLoaded ? (
      <div className={styles.Input_Pass__Box}>
        <div className={styles.Button__Box2}>
          <button className={styles.submit2} onClick={back}>
          ???
          </button>
        </div>
        <div className={styles.Input_Pass_Content}>
          <div className={styles.Input_Pass__Credentials}>
            <b>Log in as: </b>
            {userInfo.Email}
            <br />
            <b>Position: </b>
            {userInfo.Position}
          </div>
          <div className={styles.Input1__Pass}>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(event) => {
                setTemp(event.target.value);
              }}
            />
          </div>
          <div className={styles.Button__Box}>
            <button
              className={styles.submit1}
              onClick={() => {
                if (!temp) {
                  handleErrorMessage("Please Input a password");
                  return;
                }
                onSubmit(temp);
              }}
            >
              {isLogging ? "Logging In" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    ) : (
      <Loading />
    );
  };

  const Loading = () => {
    return (
      <div>
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BROS | SIGN IN</title>
        <link rel="icon" href="/logo.ico" />  
      </Head>
      <div className={styles.Login__Box}>
        <div className={styles.box} >
        <div className={styles.title__box} >
          <img src="/assets/misc/tranos-logo.png"  />
          <h2 className={styles.box__title} >BROS</h2></div>
        <div className={styles.Login__Form}>
        
          <h1>Login to your account</h1>
          <div className={styles.Form__Box}>
            {step == 1 && hasLoaded ? (
              <InputEmail />
            ) : step == 2 && hasLoaded ? (
              <InputPassword />
            ) : (
              <Loading />
            )}
          </div>
          {hasError ? <div style={{ color: "red" }}>{errorMes}</div> : null}
        </div>
        </div>
        <div className={styles.logo}>
          <img src="/assets/admin-assets/pictures/logo.png" alt="logo" />
          <div>
            <h4>
              Good Times, Chill Sounds, <br></br>
              Big Waves, GooZy Friends
            </h4>
          </div>
          <div className={styles.download}>
            
            <a href="/app/BROS_version1.1.2.apk" download>
              <button className={styles.download_btn} > <img
              src="/assets/admin-assets/svg/download.icon.svg"
              width={30}
              height={30}
            /><div>Download App Here</div></button>
            </a>
          </div>
          BROS v1.1.2
          <button className={styles.statusBtn} onClick={()=>{
            router.push('/kitchen/kitchen.orderstatus')
          }} ><u>Go to Order Status Window</u></button>
        </div>
      </div>
    </div>
  );
}
