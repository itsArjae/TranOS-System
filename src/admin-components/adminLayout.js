import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Typography,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material";

import { useState, useRef, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { logoutUser, useAuth } from "../utility/firebase";

export default function AdminLayout({ children }) {
  const userss = "arjae";
  const currentUser = useAuth();
  const dateRef = useRef(null);
  const [dateNow, setDateNow] = useState("");
  function dateNtime() {
    var objToday = new Date(),
      weekday = new Array(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ),
      dayOfWeek = weekday[objToday.getDay()],
      dayOfMonth =
        today + (objToday.getDate() < 10)
          ? "0" + objToday.getDate()
          : objToday.getDate(),
      months = new Array(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ),
      curMonth = months[objToday.getMonth()],
      curYear = objToday.getFullYear(),
      curHour =
        objToday.getHours() > 12
          ? objToday.getHours() - 12
          : objToday.getHours() < 10
          ? "0" + objToday.getHours()
          : objToday.getHours(),
      curMinute =
        objToday.getMinutes() < 10
          ? "0" + objToday.getMinutes()
          : objToday.getMinutes(),
      curSeconds =
        objToday.getSeconds() < 10
          ? "0" + objToday.getSeconds()
          : objToday.getSeconds(),
      curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today =
      curHour +
      ":" +
      curMinute +
      ":" +
      curSeconds +
      " " +
      curMeridiem +
      " " +
      dayOfWeek +
      ", " +
      curMonth +
      " " +
      dayOfMonth +
      ", " +
      curYear;

    setDateNow(today);
  }

  useEffect(() => {
    const tableUpdate = setInterval(() => {
      dateNtime();
    }, 1000);
  }, []);

  const router = useRouter();
  const [open, setopen] = useState(false);

  const setDrawerOpen = () => {
    setopen(true);
  };
  const handleClose = () => {
    setopen(false);
  };
  const goDash = () => {
    setopen(false);
    router.push("/admin/Admin.Dashboard");
  };
  const goEmp = () => {
    setopen(false);
    router.push("/admin/admin.emp");
  };
  const goDrinks = () => {
    setopen(false);
    router.push("/admin/admin.beverages");
  };
  const goSales = () => {
    setopen(false);
    router.push("/admin/admin.sales");
  };
  const goTables = () => {
    setopen(false);
    router.push("/admin/admin.manage-tableredo");
  };
  const goMenu = () => {
    setopen(false);
    router.push("/admin/admin.menu");
  };
  const goMenuList = () => {
    setopen(false);
    router.push("/admin/admin.menu.list");
  };
  const goTransac = () => {
    setopen(false);
    router.push("/admin/admin.transactions");
  };
  const goRawGoods = () => {
    setopen(false);
    router.push("/admin/admin.raw-goods");
  };
  const goExpenses = () => {
    setopen(false);
    router.push("/admin/admin.expenses");
  };
  const goSignout = async () => {
    setopen(false);
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    }
    router.push("/sign-in");
  };

  return (
    // full screen
    <Box>
      <Head></Head>

      {/* APP BAR */}
      <AppBar
        sx={{
          padding: "5px",
          height: "70px",
          position: "fixed",
          background: "rgb(255,255,255)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 3%, rgba(0,212,255,1) 45%)",
        }}
      >
        <toolbar>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconButton onClick={setDrawerOpen}>
                <Image
                  src="/assets/admin-assets/svg/bar.svg"
                  alt="bars"
                  width={30}
                  height={30}
                />
              </IconButton>
              <Image
                src="/assets/admin-assets/pictures/logo.png"
                width={60}
                height={60}
                alt="Blue Restobar Logo"
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: "33px",
                  fontFamily: "Tiro Gurmukhi",
                  letterSpacing: "1.5px",
                  marginLeft: "5px",
                  webkitTextStroke: "0.5px black",
                  color: "#3AB0FF",
                  textShadow:
                    "1px 2px 0 #000,  -1px -1px 0 #000,   1px -1px 0 #000,  -1px 1px 0 #000, 1px 1px 0 #000",
                }}
              >
                TranOS: Blue Restobar
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "auto",
                marginRight: "20px",
                justifyContent: "center",
                alignItems: "left",
              }}
            >
              <Typography
                sx={{ fontSize: "25px", fontWeight: "bold", color: "black" }}
              >
                {dateNow}
              </Typography>
              <Box sx={{ marginLeft: "auto", color: "black" }}>
                Welcome {currentUser?.email}
              </Box>
            </Box>
          </Box>
        </toolbar>
      </AppBar>

      <Drawer anchor="left" open={open}>
        <Box
          sx={{ display: "flex", flexDirection: "column", minWidth: "200px" }}
        >
          <List>
            <ListItem
              button
              onClick={handleClose}
              sx={{ backgroundColor: "#3AB0FF" }}
            >
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/pictures/arrowleft.png"
                  alt="Back"
                  width={30}
                  height={30}
                />
              </ListItemIcon>
            </ListItem>
            <Divider sx={{ marginBottom: "30px" }}></Divider>

            <Box
              sx={{
                display: "flex",
                height: "150px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/admin-assets/pictures/logo.png"
                height={150}
                width={150}
                alt="Blue Restobar Logo"
              />
            </Box>

            <Divider></Divider>

            {/* BUTTONS */}
            <ListItem button onClick={goDash}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/dashboard.icon.svg"
                  alt="Dashboard Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Dashboard
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={goEmp}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/users.icon.svg"
                  alt="Users Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Employees
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goMenuList}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/admin.menulist.icon.svg"
                  alt="Menu Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Menu
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goTables}>
              <ListItemIcon>
                <Image
                  src="/assets/cashier-assets/svg/cashier.table.icon.svg"
                  alt="Table Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Tables
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goExpenses}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/admin.expenses.icon.svg"
                  alt="Raw Goods Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Expenses
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goSales}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/admin.sales.svg"
                  alt="Sales Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Sales
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goTransac}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/admin.transactions.svg"
                  alt="Transactions Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Transactions
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goSignout}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/logout.icon.svg"
                  alt="Sign out Icon"
                  width={25}
                  height={25}
                />
              </ListItemIcon>
              <ListItemText sx={{}}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Sign Out
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box>{children}</Box>
    </Box>
  );
}
