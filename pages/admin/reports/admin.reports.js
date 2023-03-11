import React from "react";
import AdminLayout from "../../../src/admin-components/adminLayout";
import AppContainer from "../../../src/admin-components/reports/AppContainer/AppContainer";
import styles from "../../../styles/css/admin-styles/reports/reports.module.css";
function AdminReports() {
  return <div className={styles.Container}>
    <AppContainer />
  </div>;
}

export default AdminReports;

AdminReports.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
