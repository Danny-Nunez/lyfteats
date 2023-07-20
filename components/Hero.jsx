import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Hero.module.css";
import SearchBar from "../components/SearchBar";

const Hero = ({ title, subtitle, buttonText, restaurants }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    if (searchQuery === "" || !searchQuery) {
      setSearchResult(null);
      return;
    }

    const restaurant = restaurants.find((res) => res.name === searchQuery);
    setSearchResult(restaurant);
  };

  return (
    <div className={styles.hero_container}>
      <div className={styles.hero_image}>
        <div className={styles.hero_content}>
          <h1 className={styles.hero_title}>{title}</h1>
          <div className={styles.hero_search}>
            <SearchBar
              onSearch={handleSearch}
              onClear={() => setSearchQuery("")}
              list={restaurants}
              placeholder="Search for a restaurant..."
            />
          </div>
          <p className={styles.hero_subtitle}>{subtitle}</p>
          <div className={styles.hero_button_container}>
            {/* <button className={styles.hero_button}>
              <Link href={"/about"}>
                <span className={styles.hero_button_text}>{buttonText}</span>
              </Link>
            </button> */}
          </div>
          {searchResult && (
            <div className={styles.hero_search_result}>
              <p>Search Result: {searchResult.name}</p>
              {/* Render additional details or actions for the search result */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

