
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
import styled from "@emotion/styled";

 const hutOrder = "/assets/cashier-assets/svg/hut.icon.svg";
 const tableOrder = "/assets/cashier-assets/svg/table.icon.svg";
 const table1 = "/assets/cashier-assets/svg/table1.icon.svg";
 const hut = "/assets/cashier-assets/svg/hut1.icon.svg";
 const door = "/assets/cashier-assets/svg/door.svg";
//  /assets/cashier-assets/svg/table.icon.svg
// /assets/cashier-assets/svg/hut.icon.svg
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
    let temp = data.y - getOffsetTop() - 153;
    setNewPosition({x:data.x - 100 ,y:temp});
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


  const tryy = () => {
    console.log(containerRef.current.offsetTop)
  }


  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }
  return (
    <Draggable
    defaultPosition={{x:table?.x  ,y:table?.y}}
    onStop={onStop}
    position={position}
    onMouseDown={()=>{setPosition(null)}}
    handle="#handle"
    >  
    <div className={styles.Table} style={{position:'absolute'}} ref={nodeRef}>
    <div className={styles.table__title} ref={containerRef} >{table?.id}</div>
      <div ref={tableRef}  className={styles.Table_Handle} id="handle" onClick={()=>{console.log(tableRef.current.offsetLeft)}}  >
        *
      </div>
      <div className={styles.Table__Button_Box} >
      <button className={styles.Table__Button} onClick={handleSavePosition} >✔</button>
      <button className={styles.Table__Button}  onClick={setEditDataVisible} >✘</button>
      
      </div>
      {
        table?.Category == "Door" ? <img src={`${door}`} className={styles.table__icon} /> :
        table?.Category == "Table"  && table?.Status == true ? <img src={`${table1}`} className={styles.table__icon} /> :
        table?.Category == "Table"  && table?.Status == false ? <img src={`${tableOrder}`} className={styles.table__icon} /> :
        table?.Category == "Hut"  && table?.Status == true ? <img src={`${hut}`} className={styles.table__icon} /> :
        <img src={`${hutOrder}`} className={styles.table__icon} />
      }
       {visible === true && (
        <OuterBox>
          <InnerBox>
            <Confirmation
              setEditDataVisible={setEditDataVisible}
             
              handleDelete={handleDelete}
            />
          </InnerBox>
        </OuterBox>
      )}
      
   </div>
   
</Draggable>
  )
}

const Confirmation = (props) => {
  const {setEditDataVisible,handleDelete} = props;
  return(
    <div className={styles.confirm} >
      <h3>Are you sure you want to delete this item?</h3>
      <div className={styles.btn_choices} > 
      <button onClick={setEditDataVisible} >No</button>
      <button onClick={handleDelete} >Yes</button>
       </div>
    </div>
  )
}
const OuterBox = styled.div`
  width: 500px;
  height: 200px;
  position: absolute;
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;