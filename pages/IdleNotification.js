import React from "react";
import Image from "next/image";
import styles from "../styles/css/admin-styles/components-css/IdleNotification.module.css";
import { Divider } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IdleNotification(props) {
  const { outIdle } = props;
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600);

  var interval;
  useEffect(() => {
    interval = setInterval(() => {
      let temp = timeLeft - 1;

      if (temp == 0) {
        router.push("../sign-in");
        return;
      } else {
        setTimeLeft(temp);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className={styles.container}>
      <div>
        <Image
          src="/assets/misc/sessiontime.png"
          alt="idle logo"
          width={200}
          height={200}
        />
      </div>
      <div>
        <h2>Are you still there?</h2>
        <Divider />
        <div>
          Your session will expire in <b>{timeLeft}</b> Seconds
        </div>
        <div>
          <button onClick={outIdle}>Continue</button>
        </div>
      </div>
    </div>
  );
}
