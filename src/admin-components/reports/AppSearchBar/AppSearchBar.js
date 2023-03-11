import React, { useState } from "react";

import styles from "../AppContainer/AppContainer.module.css";
function AppSearchBar(Props) {
  const [search, setSearch] = useState("");

  return (
    <div className={styles.AppSearchBox} >
      <div className={styles.searchLabel} >{Props?.label}</div>
      <input
      autoComplete="off"
        onChange={(event) => {
          Props?.action(event.target.value);
        }}
        type={Props?.type}
        className={Props?.className}
      />
    </div>
  );
}

export default AppSearchBar;
