import { useState } from "react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";

export default function Home({ restaurants }) {
  const [search, setSearch] = useState(null);

  const restaurantList =
    restaurants.length === 0 ? (
      <p>No restaurants have registered yet :( </p>
    ) : !search ? (
      restaurants.map((rest, index) => {
        return <Card key={index} restaurantData={rest} />;
      })
    ) : (
      <Card restaurantData={search} />
    );

  const onSearch = (target) => {
    if (target === "" || !target) {
      return toast.info("Please type or select a restaurant");
    }

    const restaurant = restaurants.filter((res) => res.name === target);
    if (restaurant.length === 0) return toast.info("Restaurant does not exist");

    setSearch(restaurant[0]);
  };

  const onClearSearch = () => setSearch(null);

  return (
    <>
     <Hero
  title={"Order food to your door"}
  subtitle={"Sign In to order."}
  buttonText={"Learn More"}
  restaurants={restaurants} // Pass the restaurants prop here
/>

      <div className={styles.main}>
        <div>
          <h1>Available Restaurants</h1>
          <div>
            {/* {restaurants.length > 0 ? (
              <SearchBar
                onSearch={onSearch}
                onClear={onClearSearch}
                list={restaurants}
                placeholder="Restaurants..."
              />
            ) : (
              <></>
            )} */}
          </div>
          <div className={styles.list}>{restaurantList}</div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    // Import database connection and model directly
    const connectDb = (await import("../config/connectDb")).default;
    const Restaurant = (await import("../models/restaurantModel")).default;

    // Connect to database
    await connectDb();

    // Get restaurants directly from database
    const restaurants = await Restaurant.find().lean();

    const filteredRestaurants =
      restaurants.length > 0
        ? restaurants.map((res) => {
            return {
              _id: res._id ? res._id.toString() : "",
              name: res.name,
              description: res.description,
              address: res.address || "",
              image: res.image || "",
            };
          })
        : [];

    return {
      props: {
        restaurants: filteredRestaurants,
      },
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      props: {
        restaurants: [],
      },
    };
  }
}
