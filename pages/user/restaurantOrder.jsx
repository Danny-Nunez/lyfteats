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
  try {
    const { restaurantId } = context.query;

    if (!restaurantId) {
      return {
        props: {
          restaurant: null,
          dishes: [],
          restaurantImage: null,
        },
      };
    }

    // Import database connection and models directly
    const connectDb = (await import("../../config/connectDb")).default;
    const Restaurant = (await import("../../models/restaurantModel")).default;
    const Dish = (await import("../../models/dishModel")).default;

    // Connect to database
    await connectDb();

    // Get restaurant
    const targetRestaurant = await Restaurant.findById(restaurantId).lean();

    if (!targetRestaurant) {
      return {
        props: {
          restaurant: null,
          dishes: [],
          restaurantImage: null,
        },
      };
    }

    // Get all restaurant dishes
    const dishes = await Dish.find({ restaurantId }).lean();

    // Prepare restaurant response
    const restaurant = {
      id: restaurantId,
      name: targetRestaurant.name,
      description: targetRestaurant.description,
      address: targetRestaurant.address || "",
    };

    const restaurantImage = targetRestaurant.image || null;

    return {
      props: {
        restaurant,
        dishes: dishes.map((dish) => ({
          ...dish,
          _id: dish._id ? dish._id.toString() : "",
        })),
        restaurantImage,
      },
    };
  } catch (error) {
    console.error("Error fetching restaurant order data:", error);
    return {
      props: {
        restaurant: null,
        dishes: [],
        restaurantImage: null,
      },
    };
  }
}


