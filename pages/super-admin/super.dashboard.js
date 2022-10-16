import React from 'react'
import SuperTodaySales from '../../src/super-admin-components/supertodaysales'
import styles from '../../styles/css/super-admin/super-dashboard.module.css'

export default function SuperDashboard() {
  return (
    <div>
      <div className={styles.dash__today} >
      <SuperTodaySales/>
      </div>
    
    </div>
  )
}
