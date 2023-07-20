import { useState } from "react";
import generalFormatter from "general-formatter";
import styles from "../styles/Card.module.css";
import useData from "../hooks/useData";
import Image from "next/image";
import { toast } from "react-toastify";

const CardDish = ({ dishData, restaurantData }) => {
  const [quantity, setQuantity] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addItem } = useData();

  const increase = () => setQuantity((prev) => prev + 1);

  const decrease = () => {
    if (quantity === 0) return;
    setQuantity((prev) => prev - 1);
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const onAdd = () => {
    if (quantity === 0) {
      return toast.info("Please add at least one item to the cart");
    }

    // Build new item data
    const newItem = {
      _id: dishData._id,
      restaurantId: dishData.restaurantId,
      name: dishData.name,
      description: dishData.description,
      price: dishData.price,
      quantity: quantity,
      total: quantity * dishData.price,
      image: dishData.image,
    };

    addItem(newItem, quantity);
    setQuantity(0);
    toast.success("Item(s) added to the cart");
  };

  const truncatedDescription = dishData.description.slice(0, 55);
  const fullDescription = dishData.description;

  return (
    <div className={styles.card}>
      <div className={styles.image_container}>
        {dishData?.image && (
          <Image
            src={dishData.image.replace("mitcapstone.", "")}
            width="150px"
            height="150px"
            loading="lazy"
            alt="Dish Image"
          />
        )}
      </div>
      <div className={styles.card_content}>
        <h2 className={styles.card_title}>{dishData.name}</h2>
        <p className={styles.card_description}>
          {showFullDescription ? fullDescription : truncatedDescription}
          {!showFullDescription ? (
            <span className={styles.card_description_dots} onClick={toggleDescription}>
              <button>...read more</button>
            </span>
          ) : (
            <span className={styles.card_description_dots} onClick={toggleDescription}>
              <button>...read less</button>
            </span>
          )}
        </p>
        <h4 className={styles.card_price}>
          {generalFormatter.convertToMoneyString(
            dishData?.price,
            "en-US",
            "currency",
            "USD"
          )}
        </h4>
        <div className={styles.card_actions}>
          <button className={styles.card_action_button} onClick={decrease}>
            -
          </button>
          <div>{quantity}</div>
          <button className={styles.card_action_button} onClick={increase}>
            +
          </button>
        </div>
        <button className={styles.card_button} onClick={onAdd}>
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default CardDish;

