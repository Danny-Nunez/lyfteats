import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";
import useData from "../hooks/useData";
import Burger from "./Burger";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";

const Navbar = () => {
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const { setAuth, currentUser, setCurrentUser } = useAuth();
  const router = useRouter();
  const { cart, setCart } = useData();
  const [user, setUser] = useState("");
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    setUser(currentUser);
    setAccountType(localStorage.getItem("accountType"));
  

    if (currentUser && currentUser.id) {
      console.log("User ID:", currentUser?.userId);

    }
  }, [currentUser]);

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

  const totalCartQuantity =
    cart.length === 0 ? 0 : cart.reduce((prev, curr) => prev + curr.quantity, 0);

  const signOutAction = async () => {
    const endpoint =
      accountType === "User"
        ? "/api/user/signOut"
        : "/api/restaurant/signOut";

    await axios.post(endpoint);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accountType");
    }
    setAuth({});
    setCurrentUser("");
    setCart([]);
    setTimeout(() => {
      router.push("/");
    }, 400);
    return toast.success("See you next time!");
  };

  return (
    <>
      <nav
        className={`${styles.navbar} ${
          isScrolledUp ? styles.scrolled : ""
        }`}
      >
        <div className={styles.navbar_branding}>
          <div className={styles.navbar_burger_icon}>
            <Burger />
          </div>
          <Image
            src={isScrolledUp ? "/lyfeatlogowht.png" : "/lyfeatlogo.png"}
            alt="brand_logo"
            width={150}
            height={45}
          />
        </div>
        <div className={styles.navbar_menus}>
          <ul className={styles.menus_list}>
            <li className={styles.navbar_menu}></li>
            <li className={styles.navbar_menu}></li>
            {user === "" ? (
              <>
                <li className={styles.navbar_menu}>
                  <Link href="/user/signUp">
                    <button
                      className={`${styles.navbar_button_login} ${
                        isScrolledUp ? styles.button_black : ""
                      }`}
                    >
                      <div className={styles.navbar_button_icon}>
                        <CreateIcon />
                        <a>Sign Up</a>
                      </div>
                    </button>
                  </Link>
                </li>
                <li className={styles.navbar_menu}>
                  <Link href="/user/signIn">
                    <button
                      className={`${styles.navbar_button_login} ${
                        isScrolledUp ? styles.button_black : ""
                      }`}
                    >
                      <div className={styles.navbar_button_icon}>
                        <PersonIcon />
                        <a>Log In</a>
                      </div>
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                

               
                {accountType !== "Restaurant" ? (
                  <li className={styles.navbar_menu}>
                    <Link href="/user/myCart">
                      <div className={styles.cart_container}>
                        <span title="Cart">
                          <AiOutlineShoppingCart
                            className={styles.navbar_icon}
                          />
                        </span>
                        <span className={styles.cart_quantity}>
                          {totalCartQuantity}
                        </span>
                      </div>
                    </Link>
                  </li>
                ) : (
                  <></>
                )}

                
              </>
            )}
          </ul>
        </div>
      </nav>
      <style jsx global>{`
        .${styles.scrolled} {
          transition: background-color 0.3s ease-in-out;
        }
        
        .${styles.button_black} .navbar_button_icon a {
          color: black;
        }
      `}</style>
    </>
  );
};

export default Navbar;




