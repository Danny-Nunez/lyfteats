import { useState, useEffect } from "react";
import CardDish from "../../components/CardDish";
import SearchBar from "../../components/SearchBar";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";

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
    console.log("Restaurant Image Source:", restaurantImage);
  }, [restaurantImage]);

  return (
    <>
      <div className={styles.main}>
      <div className={styles.logo_wrapper}>
        <div className={styles.logo_image}>
          {restaurantImage && (
            <img src={restaurantImage.replace("mitcapstone.", "")} alt="Restaurant Image" />
          )}
        </div>
        <div className={styles.titles}>
        <h1>Welcome to {restaurant.name}!</h1>
        <p>{restaurant.description}</p>
        </div>
        </div>
        <h2>Our delicious dishes!</h2>
        
        {dishes.length > 0 ? (
          <SearchBar
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
      : "https://lyfteats.vercel.app";

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


