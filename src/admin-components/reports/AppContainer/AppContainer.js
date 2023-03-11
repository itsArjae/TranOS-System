import React, { useState } from "react";
import AppSearchBar from "../AppSearchBar/AppSearchBar";
import styles from "./AppContainer.module.css";

function AppContainer(Props) {
  const [search, setSearch] = useState("");

  const action = (value) => {
    setSearch(value);
  };

  return (
    <div className={styles.Container}>
      <div>
      <AppSearchBar
        action={action}
        type={`number`}
        className={`styles.searchBar`}
        label={`Table Number: `}
      />
      </div>
    </div>
  );
}

export default AppContainer;
