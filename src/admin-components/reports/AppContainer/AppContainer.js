import React, { useState } from "react";
import AppSearchBar from "../AppSearchBar/AppSearchBar";
import styles from "./AppContainer.module.css";
import "react-datepicker/dist/react-datepicker.css";
function AppContainer(Props) {
  const [searchTable, setSearchTable] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const handleSearchTable = (value) => {
    setSearchTable(value);
  };
  const handleSearchDate= (value) => {
    console.log(value)
    setSearchDate(value);
  };
  const handleClear = () => {
    setSearchDate("")
    setSearchTable("")
  }



  return (
    <div className={styles.Container}>
      <div className={styles.searchBox} >
      <AppSearchBar
        action={handleSearchTable}
        type={`number`}
        className={`styles.searchBar`}
        label={`Table Number: `}
        value={searchTable}
      />
      <AppSearchBar 
        action={handleSearchDate}
        type={`date`}
        className={`styles.searchBar`}
        label={`Date: `}
        valuee={searchDate}
      />   <button onClick={handleClear} >Clear</button>
      </div>
   
      {searchDate.toString()}
    </div>
  );
}

export default AppContainer;
