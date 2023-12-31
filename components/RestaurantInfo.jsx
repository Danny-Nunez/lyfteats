import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Image from "next/image";
import { useS3Upload } from "next-s3-upload";
import styles from "../styles/Admin.module.css";
import { toast } from "react-toastify";

const RestaurantInfo = () => {
  const [restaurantData, setRestaurantData] = useState({});
  const [error, setError] = useState({
    name: { error: "", isError: false },
    description: { error: "", isError: false },
    address: { error: "", isError: false },
  });
  const [imageURL, setImageURL] = useState("");
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const axiosPrivate = useAxiosPrivate();

  // Load restaurant information
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosPrivate.get(
          "/api/restaurant/restaurantData"
        );

        setRestaurantData(response.data.restaurant);
        setImageURL(response.data.restaurant.image);
      } catch (error) {
        console.log(error);
        return toast.error(error.response.data.message);
      }
    };

    getData();

    return () => {};
  }, []);

  // Handle change of restaurant information
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle restaurant information update
  const handleUpdate = async () => {
    const { name, description, address } = restaurantData;
    let errors = false;

    // Validate inputs
    // Name
    if (!name || name.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        name: { error: "Name cannot be empty", isError: true },
      }));
    } else {
      setError((prev) => ({ ...prev, name: { error: "", isError: false } }));
    }

    // Description
    if (!description || description.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        description: { error: "Description cannot be empty", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        description: { error: "", isError: false },
      }));
    }

    // Address
    if (!address || address.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        address: { error: "Address cannot be empty", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        address: { error: "", isError: false },
      }));
    }

    // Return if there are any errors
    if (errors) return;

    try {
      const response = await axiosPrivate.put("/api/restaurant/update", {
        name,
        description,
        address,
      });

      setRestaurantData(response.data.restaurant);
      return toast.success(response.data.message);
    } catch (error) {
      console.log("Error:", error.message);
      return toast.error(error.response.data.message);
    }
  };

  // Handle restaurant image update
  const handleFileChange = async (file) => {
    try {
      // Upload image to S3 bucket
      let s3Response = await uploadToS3(file);
      setImageURL(s3Response.url);

      // Delete previous image in S3
      const deleteRes = await axiosPrivate.delete(
        "/api/restaurant/deletePrevKey"
      );

      // If delete response is ok, then update the image URL and key in the database
      if (deleteRes.data.message === "OK") {
        const updateRes = await axiosPrivate.put("/api/restaurant/updateLogo", {
          url: s3Response.url,
          key: s3Response.key,
        });
        return toast.success(updateRes.data.message);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <>
      <div className={styles.form}>
        <section className={styles.section}>
          <h1>Welcome, {restaurantData?.name}!</h1>
          <button className={styles.button} onClick={handleUpdate}>
            Update Restaurant Info
          </button>
        </section>
        <div>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              className={styles.form_input}
              type="text"
              name="name"
              id="name"
              value={restaurantData?.name || ""}
              onChange={handleChange}
            />
            {error.name.isError && (
              <span className={styles.error}>{error.name.error}</span>
            )}
          </div>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <input
              className={styles.form_input}
              type="text"
              name="description"
              id="description"
              value={restaurantData?.description || ""}
              onChange={handleChange}
            />
            {error.description.isError && (
              <span className={styles.error}>{error.description.error}</span>
            )}
          </div>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="address">
              Address
            </label>
            <input
              className={styles.form_input}
              type="text"
              name="address"
              id="address"
              value={restaurantData?.address || ""}
              onChange={handleChange}
            />
            {error.address.isError && (
              <span className={styles.error}>{error.address.error}</span>
            )}
          </div>
        </div>
        <section className={styles.section}>
          <label className={styles.label} htmlFor="logo">
            Logo
          </label>
          <FileInput onChange={handleFileChange} />
          <button className={styles.button_sm} onClick={openFileDialog}>
            Update Logo
          </button>
          <div className={styles.imageContainer}>
          {imageURL && (
            <Image
              src={imageURL.replace("mitcapstone.", "")}
              width="300px"
              height="400px"
              alt="restaurant image"
              loading="lazy"
              layout="responsive"
            />
          )}
          </div>
        </section>
      </div>
    </>
  );
};

export default RestaurantInfo;

