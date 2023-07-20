import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Forms.module.css";
import BackspaceIcon from '@mui/icons-material/Backspace';

const SearchBar = ({ onSearch, onClear, list, placeholder }) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClear = () => {
    if (search === "") return;
    onClear();
    setSearch("");
  };

  const handleSearch = () => {
    router.push(`/search?query=${search}`);
  };

  const options =
    list.length > 0 ? (
      list.map((item, index) => {
        return <option key={index} value={item.name} id={item._id} />;
      })
    ) : (
      <option value="-- Nothing Found --" />
    );

  return (
    <div className={styles.form_row_sm}>
      <div className={styles.form_wrapper}>
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
        <button
          className={styles.back_icon}
          onClick={handleClear}
        >
          <BackspaceIcon />
        </button>
      </div>
      <datalist id="items">{options}</datalist>
      <div className={styles.form_button_container}>
        <button className={styles.form_button_sm} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

