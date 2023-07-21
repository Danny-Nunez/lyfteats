import { AiOutlineGithub, AiFillLinkedin, AiFillCode } from "react-icons/ai";
import styles from "../styles/Footer.module.css";

const Footer = () => {
const currentYear = new Date().getFullYear();

return (
<footer className={styles.footer}>
<div className={styles.footer_section}>
<div className={styles.footer_subsection}>
<span>© {currentYear} - Lyfteats</span>
</div>
</div>
</footer>
);
};

export default Footer;
