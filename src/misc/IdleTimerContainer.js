import { IdleTimerProvider, useIdleTimerContext } from "react-idle-timer";

import React, { useRef } from "react";
import IdleNotification from "../../pages/IdleNotification";
import styled from "@emotion/styled";
import { useState } from "react";

export default function IdleTimerContainer({ children }) {
  const timerRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
  const onIdle = () => {
    console.log("onIdle");
    setIsIdle(true);
  };

  const outIdle = () => {
    setIsIdle(false);
  };

  return (
    <IdleTimerProvider timeout={600 * 1000} onIdle={onIdle}>
      {isIdle ? (
        <OuterBox>
          <InnerBox>
            <IdleNotification outIdle={outIdle} />
          </InnerBox>{" "}
        </OuterBox>
      ) : (
        <div>{children}</div>
      )}
    </IdleTimerProvider>
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
