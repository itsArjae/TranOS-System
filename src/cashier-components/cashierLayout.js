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

export default function CashierLayout({ children }) {
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
  const goTables = () => {
    setopen(false);
    router.push("/cashier/cashier.table");
  };
  const goMenu = () => {
    setopen(false);
    router.push("/cashier/cashier.meals");
  };
  const goBeverage = () => {
    setopen(false);
    router.push("/cashier/cashier.beverages");
  };
  const goSignout = () => {
    setopen(false);
    localStorage.removeItem("accessToken");
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
                flexDirection: "row",
                marginLeft: "auto",
                marginRight: "20px",
              }}
            >
              <Typography
                sx={{ fontSize: "25px", fontWeight: "bold", color: "black" }}
              >
                {dateNow}
              </Typography>
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

            <ListItem button onClick={goBeverage}>
              <ListItemIcon>
                <Image
                  src="/assets/admin-assets/svg/beverage.logo.svg"
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
                  Beverages
                </Typography>
              </ListItemText>
            </ListItem>

            <ListItem button onClick={goMenu}>
              <ListItemIcon>
                <Image
                  src="/assets/cashier-assets/svg/cashier.menu.icon.svg"
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
                  Meals
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
