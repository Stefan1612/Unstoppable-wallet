import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import rings from "vanta/dist/vanta.rings.min";

/* import Calendar from "./Calendar"; */
/* import Header from "./Header";
import Footer from "./Footer"; */
/* import Propose from "./Propose"; */
/* import Title from "./Title"; */
/* import Faq from "./Faq"; */
/* import Roadmap from "./Roadmap"; */

function Main({ account, network, getAccount }) {
  const [vantaEffect, setVantaEffect] = useState(0);

  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        rings({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <Box
      sx={{
        minHeight: "100%",
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        position: "absolute",
      }}
      ref={myRef}
    />
  );
}

export default Main;
