import React, { useEffect, useState } from "react";
import Meta from "./Meta";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      if (scrollPosition === 0) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Meta />
      <Navbar isScrolledUp={isScrolledUp} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

