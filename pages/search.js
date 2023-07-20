import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import styles from "../styles/Home.module.css";


const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query; // Get the search query from the query parameters
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Fetch the list of restaurants
        const response = await fetch("/api/home/restaurants");
        const data = await response.json();

        // Search for the matching restaurant by name
        const matchingRestaurant = data.restaurants.find(
          (restaurant) => restaurant.name.toLowerCase() === query.toLowerCase()
        );

        if (matchingRestaurant) {
          setSearchResults([matchingRestaurant]);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className={styles.main}>
        <section className={styles.section}>
      <h1>Search Results for "{query}"</h1>
      {searchResults.length > 0 ? (
        <div className="card-container">
          {searchResults.map((result) => (
            <Card key={result._id} restaurantData={result} />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
      </section>
    </div>
  );
};

export default SearchPage;


