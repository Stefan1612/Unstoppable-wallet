import React, { useState, useEffect } from "react";

import "./App.css";
import { ethers } from "ethers";
// Unstoppable Domains
import UAuth from "@uauth/js";
// import button images
import defaultButton from "./images/default-button.png";
import pressedButton from "./images/hover-button.png";
import hoverButton from "./images/pressed-button.png";
import Header from "./Components/Header";
import theme from "./Components/theme/theme";
import Main from "./Components/Main";
import { Container, Box, ThemeProvider } from "@mui/material";
function App() {
  const [account, setAccount] = useState("");

  const [imageSrc, setImageSrc] = useState(defaultButton);
  function handleMouseEnter() {
    setImageSrc(hoverButton);
  }

  function handleMouseLeave() {
    setImageSrc(defaultButton);
  }

  const uauth = new UAuth({
    clientID: process.env.REACT_APP_CLIENT_ID_UD,

    // These are the scopes your app is requesting from the ud server.
    scope: "openid wallet",

    // This is the url that the auth server will redirect back to after every authorization attempt.
    redirectUri: "http://localhost:3000",
  });

  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState("This is the error message");

  const handleLoginButtonClick = (e) => {
    setErrorMessage(null);
    uauth.login().catch((error) => {
      console.error("login error:", error);
      setErrorMessage("User failed to login.");
    });

    setImageSrc(pressedButton);
  };
  // eslint-disable-next-line
  const [redirectTo, setRedirectTo] = useState();
  // eslint-disable-next-line
  const [user, setUser] = useState();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [redirectToLogOut, setRedirectToLogOut] = useState();
  // eslint-disable-next-line
  const [udLoginAddress, setUdLoginAddress] = useState("");
  const [udLoginDomain, setUdLoginDomain] = useState("");

  useEffect(() => {
    // Try to exchange authorization code for access and id tokens.
    uauth
      .loginCallback()
      // Successfully logged and cached user in `window.localStorage`
      .then((response) => {
        console.log("loginCallback ->", response);
        setRedirectTo("/profile");
        setUdLoginAddress(response.authorization.idToken.wallet_address);
        // console.log(udLoginAddress);

        setAccount(response.authorization.idToken.wallet_address);
        setUdLoginDomain(response.authorization.idToken.sub);
        localStorage.setItem(
          "account",
          JSON.stringify(response.authorization.idToken.wallet_address)
        );
        localStorage.setItem(
          "udLoginAddress",
          JSON.stringify(response.authorization.idToken.wallet_address)
        );
        localStorage.setItem(
          "UdLoginDomain",
          JSON.stringify(response.authorization.idToken.sub)
        );
      })

      // Failed to exchange authorization code for token.
      .catch((error) => {
        console.error("callback error:", error);
        setRedirectTo("/login?error=" + error.message);
      }); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    uauth
      .user()
      .then(setUser)
      .catch((error) => {
        console.error("profile error:", error);
        setRedirectToLogOut("/login?error=" + error.message);
      }); // eslint-disable-next-line
  }, []);
  // eslint-disable-next-line
  const handleLogoutButtonClick = (e) => {
    console.log("logging out!");
    setLoading(true);
    uauth.logout().catch((error) => {
      console.error("profile error:", error);
      setLoading(false);
    });

    setUdLoginAddress(undefined);
    /* setAreTokensFetched(false)
    setAreTokensGeckoInitialized(false) */
    window.location.reload();
  };
  let provider;

  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  const infuraProvider = new ethers.providers.InfuraProvider("kovan", {
    projectId: process.env.REACT_APP_PROJECT_ID,
    projectSecret: process.env.REACT_APP_PROJECT_SECRET,
  });
  async function getAccount() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert(
        "Please Install Metamask to fully utilize this website: https://metamask.io/"
      );
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      // Do any other work!
    }
  }

  // network e.g. 42 Kovan
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });

  // fetching and saving network
  useEffect(() => {
    async function setNetworkData() {
      if (provider) {
        const getNetwork = await provider.getNetwork();
        setNetwork(getNetwork);
      }
    }
    setNetworkData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    getAccount(); // user provider

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let gas_price = 0;

  const tx = {
    from: account,
    to: "0x711619FbaD6327Eb48902AB130CC9bBeb06331c6",
    value: ethers.utils.parseEther("0.01"),
    nonce: infuraProvider.getTransactionCount(
      "0x711619FbaD6327Eb48902AB130CC9bBeb06331c6",
      "latest"
    ),
    gasLimit: ethers.utils.hexlify(100000), // 100000
    gasPrice: infuraProvider.getGasPrice(),
    // data: "some Data",
  };
  async function startTx() {
    // get current gas price
    gas_price = await infuraProvider.getGasPrice();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .getSigner()
      .sendTransaction(tx)
      .then((transaction) => {
        console.dir(transaction);
        alert("Send finished!");
      });
  }

  if (udLoginAddress === "" && localStorage.getItem("UdLoginDomain") === null) {
    return (
      <div
        className="pages"
        style={{ height: "100vh", backgroundColor: "black" }}
      >
        <div
          className="text-center"
          style={{ paddingTop: "28vh", marginRight: "5vw" }}
        >
          {
            // eslint-disable-next-line
          }
          {/* <img src={logo}></img> */}
        </div>

        <div
          style={{
            paddingTop: "2vh",
            margin: "auto",
            textAlign: "center",
            marginTop: "10vh",
          }}
        >
          <img
            alt="UnstoppableLoginButton"
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
            src={imageSrc}
            className="pointer"
            onClick={() => handleLoginButtonClick()}
          ></img>
        </div>
      </div>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Header
        FirstLoad={getAccount}
        account={account}
        handleLogoutButtonClick={handleLogoutButtonClick}
        udLoginDomain={udLoginDomain}
        udLoginAddress={udLoginAddress}
      />
      {/* <NavbarTwo /> */}
      {/*  <BackgroundImage /> */}
      <Main network={network} account={account} getAccount={getAccount} />
      <Box
        id="background"
        marginTop={"58vh"}
        sx={{ backgroundColor: "#212121" }}
      >
        <Container>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <Box>
            <button onClick={(e) => startTx()}>send Tx</button>
          </Box>
          {/*   <Box id="faq">
            <FAQ></FAQ>
          </Box>
          <footer id="footer">
            <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
            <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp; </i>
            <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
            <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
            <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
          </footer> */}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
