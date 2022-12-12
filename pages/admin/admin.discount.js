import React, { useEffect, useState } from "react";
import AdminLayout from "../../src/admin-components/adminLayout";
import { deleteDiscount, saveDiscount } from "../../src/utility/admin-utils/discount.firebase";
import styles from "../../styles/css/misc/discount.module.css";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../src/utility/firebase";
export default function AdminDiscount() {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const db = getFirestore(app);
  const handleSave = () => {
    if (value == "" || name == "") {
      return;
    }

    saveDiscount(name, value);
    setValue("");
    setName("");
    getDiscount();
  };

  const [disc, setDisc] = useState([]);

  const getDiscount = async () => {
    const querySnapshot = await getDocs(collection(db, "discount"));
    let beverage = [];
    querySnapshot.forEach((doc) => {
      beverage.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    console.log(beverage);
    setDisc(beverage);
  };

  useEffect(() => {
    getDiscount();
  }, []);

  const handleDelete=(id)=>{
    deleteDiscount(id);
    getDiscount();
  }

  return (
    <div className={styles.container}>
      <div className={styles.discount_form}>
        <div className={styles.head}>
          <div>ADD DISCOUNT</div>
        </div>
        <div className={styles.form}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            placeholder="Value"
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button className={styles.addBtn} onClick={handleSave}>
            ADD
          </button>
        </div>

        <div className={styles.discbox}>
          {disc.map((data) => {
            return (
              <div className={styles.disc} key={data.id}>
                <div>{data.name}</div> - <div>{data.value}%</div>{" "}
                <button onClick={()=>{
                  handleDelete(data.id);
                }} > Delete</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

AdminDiscount.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
