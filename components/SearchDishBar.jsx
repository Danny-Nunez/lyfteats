import { useState, useEffect } from "react";
import styles from "../styles/Forms.module.css";

const SearchDishBar = ({ onSearch, onClear, list, placeholder }) => {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    // Filter the options based on the search query
    const filteredOptions = list.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
  }, [search, list]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClear = () => {
    if (search === "") return;
    onClear();
    setSearch("");
    setFilteredOptions(list); // Reset filteredOptions to show all dishes
  };

  const handleSearch = () => {
    onSearch(search);
  };

  const options =
    filteredOptions.length > 0 ? (
      filteredOptions.map((item, index) => {
        return <option key={index} value={item.name} id={item._id} />;
      })
    ) : (
      <option value="-- Nothing Found --" />
    );

  return (
    <div className={styles.form_row_sm}>
      <input
        className={styles.form_input_sm}
        list="items"
        placeholder={placeholder}
        name="item"
        id="item"
        value={search}
        onChange={(e) => handleChange(e)}
        onSelect={(e) => handleChange(e)}
      />
      <datalist id="items">{options}</datalist>
      <div className={styles.form_button_container}>
        <button className={styles.form_button_sm} onClick={handleSearch}>
          Search
        </button>
        <button className={styles.form_button_sm_secondary} onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchDishBar;
