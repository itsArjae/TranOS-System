import styled from '@emotion/styled';
import React from 'react'

import { RotatingSquare } from  'react-loader-spinner'

export default function LoadingScreen() {
  return (
    
      <LoadingBlur>
      <RotatingSquare
  height="200"
  width="200"
  color="#00D7FF"
  ariaLabel="rotating-square-loading"
  strokeWidth="4"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>
      </LoadingBlur>
  )
}

const LoadingBlur = styled.div`
display:flex;
alignItems:center;
justifyContent:center;
margin:auto;
backdrop-filter: blur(10px);
`;

