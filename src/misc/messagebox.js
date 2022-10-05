import { Divider } from '@mui/material';
import React from 'react'
import styles from '../../styles/css/misc/messagebox.module.css'

export default function MessageBox(props) {
  const {message,setClose} = props;
  return (
    <div className={styles.container} >
       
        <div>
        <h3>{message}</h3>
        </div>
        <div>
          <button onClick={setClose} >Continue</button>
        </div>
    </div>
  )
}
