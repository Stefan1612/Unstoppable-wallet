import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

/* import { ReactComponent as MenuIcon } from "./assets/menu.svg"; */
/* import LogoSimpleBlock from "./assets/LogoMakr-9qZ27k.png"; */

function Header({
  FirstLoad,
  account,
  handleLogoutButtonClick,
  udLoginAddress,
  udLoginDomain,
}) {
  const pages = [
    /* "Management", "personal account", "faq" */
  ];

  function handleCloseAndLogout() {
    // handleClose();
    handleLogoutButtonClick();
    localStorage.clear();
  }
  function handleStorageUdLoginDomain() {
    console.log("handleSotrageUdLoginDomain got triggered");
    if (localStorage.getItem("UdLoginDomain") !== null) {
      return localStorage
        .getItem("UdLoginDomain")
        .slice(1, localStorage.getItem("UdLoginDomain").length - 1);
    }
  }
  function handleStorageUdLoginAddress() {
    console.log("handleSotrageUdLoginDomain got triggered");
    if (localStorage.getItem("udLoginAddress") !== null) {
      return localStorage
        .getItem("udLoginAddress")
        .slice(1, localStorage.getItem("udLoginAddress").length - 1);
    }
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{
        boxShadow: 0,
        color: "white",
      }}
      marginleft={20}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          size="large"
          aria-label="time travellers dao logo"
          href="/"
          sx={{ p: 0, borderRadius: 1 }}
          color="inherit"
          s
        >
          <img
            alt="SimpleBlock's Logo"
            /*     src={LogoSimpleBlock} */
            style={{ height: "5vh" }}
          />
        </IconButton>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            value="closed"
            size="large"
            aria-label="open menu"
            onClick={openMenu}
            color="inherit"
            aria-controls={open ? "basic-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            {/*      <MenuIcon width="40px" height="40px" /> */}
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={closeMenu}
        >
          {pages.map((page) => (
            <MenuItem
              key={page}
              to={`#${page}`}
              /* component={HashLink} */
              smooth
              onClick={closeMenu}
            >
              {page}
            </MenuItem>
          ))}
        </Menu>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            columnGap: 3,
            display: { xs: "none", md: "flex" },
          }}
          component="nav"
        >
          {pages.map((page) => (
            <Button
              key={page}
              size="medium"
              variant="text"
              to={`#${page}`}
              /*    component={HashLink} */
              smooth
              color="inherit"
            >
              <Typography variant="h2" component="span" sx={{ m: 0 }}>
                {page}
              </Typography>
            </Button>
          ))}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box>
              Unstoppable Address:{" "}
              {udLoginAddress !== ""
                ? udLoginAddress
                : handleStorageUdLoginAddress()}
              &nbsp;
            </Box>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box className="UDLogOut">
              {udLoginDomain !== ""
                ? udLoginDomain
                : handleStorageUdLoginDomain()}
            </Box>
          </Box>

          {/*--------------------------------------------------------------------------*/}
          <Button
            onClick={(e) => handleCloseAndLogout()}
            size="medium"
            to="/"
            /*   component={HashLink} */
            smooth
            variant="contained"
            sx={{ fontWeight: 700, backgroundColor: "#4c47f7" }}
          >
            Logout
          </Button>

          {/*--------------------------------------------------------------------------*/}
        </Box>
      </Toolbar>
      <Box sx={{ marginLeft: "25vw" }} marginTop={34}>
        <Button variant="contained">
          <a href="#sendTx">Transfer Tokens</a>
        </Button>
        {/*   <Button
          variant="outlined"
          sx={{ marginLeft: "5px" }}
          onClick={(e) => FirstLoad()}
        >
          Metamask
        </Button> */}
      </Box>
    </AppBar>
  );
}

export default Header;
