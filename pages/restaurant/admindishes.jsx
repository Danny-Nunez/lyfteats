import RestaurantInfo from "../../components/RestaurantInfo";
import RestaurantDishes from "../../components/RestaurantDishes";
import styles from "../../styles/Admin.module.css";

const Admindishes = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.admin_content}>
          {/* <RestaurantInfo /> */}
          <RestaurantDishes />
        </div>
      </div>
    </>
  );
};

export default Admindishes;
