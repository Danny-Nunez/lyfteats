import { useState, useEffect } from "react";
import CardDish from "../../components/CardDish";
import SearchDishBar from "../../components/SearchDishBar";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";
import Image from "next/image";

const RestaurantOrder = ({ restaurant, dishes, restaurantImage }) => {
  const [search, setSearch] = useState(null);

  const dishList =
    dishes.length === 0 ? (
      <p>No dishes have been added yet</p>
    ) : !search ? (
      dishes.map((dish, index) => {
        return <CardDish dishData={dish} key={index} />;
      })
    ) : (
      <CardDish dishData={search} />
    );

  const onSearch = (target) => {
    if (target === "" || !target) {
      return toast.info("Please type or select a dish");
    }

    const dish = dishes.filter((dis) => dis.name === target);
    if (dish.length === 0) return toast.info("Dish does not exist");

    setSearch(dish[0]);
  };

  const onClearSearch = () => setSearch(null);

  useEffect(() => {
   
  }, [restaurantImage]);

  return (
    <>
      <div className={styles.main}>
      <div className={styles.logo_wrapper}>
        <div className={styles.logo_image}>
          {restaurantImage && (
            <Image 
            width="180px"
            height="180px"
            src={restaurantImage.replace("mitcapstone.", "")} alt="Restaurant Image" />
          )}
        </div>
        <div className={styles.titles}>
        <h1>Welcome to {restaurant.name}!</h1>
        <div className={styles.logo_imageMobile}>
          {restaurantImage && (
            <Image 
            width="180px"
            height="180px"
            src={restaurantImage.replace("mitcapstone.", "")} alt="Restaurant Image" />
          )}
        </div>
        <p>{restaurant.description}</p>
        <p>{restaurant.address}</p>
        </div>
        </div>
        <h2>Our delicious dishes!</h2>
        
        {dishes.length > 0 ? (
          <SearchDishBar
            onSearch={onSearch}
            onClear={onClearSearch}
            list={dishes}
            placeholder="Dishes..."
          />
        ) : (
          <></>
        )}
        <div className={styles.list}>{dishList}</div>
      </div>
    </>
  );
};

export default RestaurantOrder;

export async function getServerSideProps(context) {
  const { restaurantId } = context.query;
  const api =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://danny-nunezfullstackrestaurantapplication.vercel.app/";

  const restaurantResponse = await fetch(
    `${api}/api/home/restaurant?restaurantId=${restaurantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const restaurantData = await restaurantResponse.json();
  const restaurant = restaurantData.restaurant;
  const dishes = restaurantData.dishes;

  const imageResponse = await fetch(`${api}/api/home/restaurants`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const imageData = await imageResponse.json();
  const matchingRestaurant = imageData.restaurants.find(
    (r) => r._id === restaurantId
  );
  const restaurantImage = matchingRestaurant ? matchingRestaurant.image : null;

  return {
    props: {
      restaurant,
      dishes,
      restaurantImage,
    },
  };
}


