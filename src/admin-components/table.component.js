
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.managetables.module.css";
import { ref, getDatabase, get, child } from "firebase/database";
import {app} from '../utility/firebase'
import Draggable from "react-draggable";
import { style } from "@mui/system";
import { changeTablePos, changeTablePos2, deleteTables, deleteTables2 } from "../utility/admin-utils/manage-table.firebase";
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

export default function TableComponent(props) {
  
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const {table,getOffsetLeft,getOffsetTop} = props;
  const [error,setError] = useState(false);
  const [position,setPosition] = useState(null);
  const [enable,setEnable] = useState(true);
  const [newPosition,setNewPosition] = useState([]);
  const onStop = (data) => {
    setError(false);
   /* if(data.x - (tableRef.current.offsetLeft + tableRef.current.clientWidth / 2) < coordinates.x ){
      console.log("error x");
      setPosition({x:table?.x + coordinates?.x,y:table?.y + coordinates?.y})
      setError(true);
    }*/
    setEnable(false);
    let temp = data.y - getOffsetTop() - 85;
    setNewPosition({x:data.x - 45 ,y:temp});
  }
  const onDrag = () => {
setPosition(null);
  }
  const onReset = () => {
    setPosition({x:table?.x,y:table?.y});
    setEnable(false);
  }

  const handleSavePosition = () => {
    if(!newPosition.y){
      return;
    }
    changeTablePos(table.id,newPosition.x,newPosition.y,table.Color,table.Category,table.Status);
   // changeTablePos2(table.id,newPosition.x,newPosition.y,table.Color,table.Category,table.Status);
  }

  const handleDelete = () => {
    deleteTables(table.id);
    window.location.reload(false);
  }





  return (
    <Draggable
    defaultPosition={{x:table?.x  ,y:table?.y}}
    onStop={onStop}
    position={position}
    onMouseDown={()=>{setPosition(null)}}
    handle="#handle"
    >  
    <div className={styles.Table} style={{backgroundColor:table?.Color,position:'absolute'}} ref={nodeRef}>
      {table?.Category}
      <div ref={tableRef}  className={styles.Table_Handle} id="handle" onClick={()=>{console.log(tableRef.current.offsetLeft)}}  >
        {table?.id}
      </div>
      <div className={styles.Table__Button_Box} >
      <button className={styles.Table__Button} onClick={handleSavePosition} >✔</button>
      <button className={styles.Table__Button}  onClick={handleDelete} >✘</button>
      </div>
   </div>
</Draggable>
  )
}
