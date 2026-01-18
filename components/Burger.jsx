import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../context/AuthProvider';
import styles from '../styles/Burger.module.css';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Link from 'next/link';
import Image from "next/image";

const Burger = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [accountType, setAccountType] = useState('');
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    setAccountType(localStorage.getItem('accountType'));
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsScrolledUp(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSignOut = () => {
    setCurrentUser(''); // Clear the current user
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <div className={styles.burger_MobileMenu}>
          {!currentUser && (
            <>
              <List>
                <ListItemButton>
                  <Link href="/user/signIn" className={styles.burger_link_button_login}>
                    <span>Login</span>
                  </Link>
                </ListItemButton>
                <ListItemButton>
                  <Link href="/user/signUp" className={styles.burger_link_button}>
                    <span>Signup</span>
                  </Link>
                </ListItemButton>
              </List>
            </>
          )}
        </div>

        {currentUser && (
          <ListItemButton>
            <span className={styles.burger_user}>{`Welcome, ${currentUser}`}</span>
          </ListItemButton>
        )}
        <ListItemButton>
          <Link href="/" className={styles.burger_link}>
            <div className={styles.burger_link}>
              <HomeIcon />
              <span>Home</span>
            </div>
          </Link>
        </ListItemButton>
        <ListItemButton>
          <Link href="/about" className={styles.burger_link}>
            <div className={styles.burger_link}>
              <InfoIcon />
              <span>About</span>
            </div>
          </Link>
        </ListItemButton>
        {currentUser && accountType === 'User' && (
          <ListItemButton>
            <Link href="/user/myOrders" className={styles.burger_link}>
              <div className={styles.burger_link}>
                <ReceiptLongIcon />
                <span>My Orders</span>
              </div>
            </Link>
          </ListItemButton>
        )}
      </List>
      <Divider />
      {!currentUser && (
        <>
          <span className={styles.burger_restMenu}>Restaurant Menu Options</span>
          <List>
            <ListItemButton>
              <Link href="/restaurant/signIn" className={styles.burger_link}>
                <div className={styles.burger_link}>
                  <PersonIcon />
                  <span>Business Login</span>
                </div>
              </Link>
            </ListItemButton>
            <ListItemButton>
              <Link href="/restaurant/signUp" className={styles.burger_link}>
                <div className={styles.burger_link}>
                  <AddHomeIcon />
                  <span>Restaurant Signup</span>
                </div>
              </Link>
            </ListItemButton>
          </List>
        </>
      )}
      <List>
        {currentUser && accountType === 'Restaurant' && (
          <ListItemButton>
            <Link href="/restaurant/admin">
              <a>
                <div className={styles.burger_link}>
                  <DashboardIcon />
                  <span>Profile</span>
                </div>
              </a>
            </Link>
          </ListItemButton>
        )}
        {currentUser && accountType === 'Restaurant' && (
          <ListItemButton>
            <Link href="/restaurant/admindishes" className={styles.burger_link}>
              <div className={styles.burger_link}>
                <FastfoodIcon />
                <span>Dishes</span>
              </div>
            </Link>
          </ListItemButton>
        )}
        {currentUser && accountType === 'Restaurant' && (
          <ListItemButton>
            <Link href="/restaurant/storeOrders" className={styles.burger_link}>
              <div className={styles.burger_link}>
                <ReceiptLongIcon />
                <span>Orders</span>
              </div>
            </Link>
          </ListItemButton>
        )}

        {currentUser ? (
          <ListItemButton onClick={handleSignOut}>
            <Link href="/" className={styles.burger_link}>
              <div className={styles.burger_link}>
                <LogoutIcon />
                <span>Log Out</span>
              </div>
            </Link>
          </ListItemButton>
        ) : null}
      </List>
    </Box>
  );

  return (
    <div className={styles.burger_wrap}>
      <Button
        className={styles.burger_button_style}
        onClick={toggleDrawer('left', true)}
      >
    <Image
            width={25}
            height={25}
            src={isScrolledUp ? "/hamburgerwhite.svg" : "/hamburger.svg"} alt="Restaurant Image" />
      </Button>
      <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}>
        {list('left')}
      </Drawer>
    </div>
  );
};

export default Burger;

