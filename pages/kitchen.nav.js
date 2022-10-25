import Link from 'next/link';
import React from 'react'
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "../styles/css/kitchen-styles/kitchennav.module.css"
export default function KitchenNav() {
    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle(styles.responsive_nav);
    }

        return (
            <div className={styles.all}>
            <div className={styles.Header}>
                {/* <div className={styles.sims}>
                <img src='/pictures/sims.png' className={styles.logo_png}/>
                <h1>SIMS</h1>
                </div> */}
                <div className={styles.navi} ref={navRef}>
                    <div className={styles.home}><Link href="/kitchen/kitchen.home"><a>ORDERS</a></Link></div>
                    <div className={styles.scholarship}><Link href="/kitchen/kitchen.serving"><a>SERVING</a></Link></div>
                    <div className={styles.scholarship_1}><Link href="/kitchen/kitchen.orderstatus"><a>ORDER STATUS</a></Link></div>
                    <div className={styles.login}><Link href="/"><a>Log Out</a></Link></div>

                    <button className={styles.nav_close_btn} onClick={showNavbar}>
                        <FaTimes></FaTimes>
                    </button>
                </div>

                    <button className={styles.nav_btn} onClick={showNavbar}>
                        <FaBars></FaBars>
                    </button>

            </div>
            </div>

            
          )
    }


