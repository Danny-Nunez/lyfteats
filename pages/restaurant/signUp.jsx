import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import generalFormatter from "general-formatter";
import styles from "../../styles/Forms.module.css";
import { toast } from "react-toastify";

const CONFIGURATION = {
  mapsApiKey: process.env.REACT_APP_GOOGLE, 
  capabilities: { addressAutocompleteControl: true },
};

function initMap(setFormData) {
  const autocompleteInput = document.getElementById("location-input");
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // Fill in the address input field
    fillInAddress(place);
  });

  function fillInAddress(place) {
    const addressNameFormat = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "long_name",
      postal_code: "short_name",
    };
    const getAddressComp = function (type) {
      for (const component of place.address_components) {
        if (component.types[0] === type) {
          return component[addressNameFormat[type]];
        }
      }
      return "";
    };

    const streetNumber = getAddressComp("street_number");
    const route = getAddressComp("route");
    const city = getAddressComp("locality");
    const state = getAddressComp("administrative_area_level_1");
    const postalCode = getAddressComp("postal_code");

    // Combine the address components including zip code
    const address = `${streetNumber} ${route}, ${city}, ${state} ${postalCode}`;

    autocompleteInput.value = address;
    
    // Update the formData state with the selected address
    setFormData((prev) => ({
      ...prev,
      address: address,
    }));
  }
}


const SignUp = () => {
  const [error, setError] = useState({
    name: { error: "", isError: false },
    description: { error: "", isError: false },
    address: { error: "", isError: false },
    email: { error: "", isError: false },
    password: { error: "", isError: false },
    confirmPassword: { error: "", isError: false },
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    const { name, description, address, email, password, confirmPassword } = formData;
    let errors = false;

    // Validate empty inputs
    // Name
    if (!name || name.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        name: { error: "Name is required", isError: true },
      }));
    } else {
      setError((prev) => ({ ...prev, name: { error: "", isError: false } }));
    }

    // Description
    if (!description || description.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        description: { error: "Description is required", isError: true },
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
        address: { error: "Address is required", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        address: { error: "", isError: false },
      }));
    }

    // Email
    if (!email || email.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        email: { error: "Email is required", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: { error: "", isError: false },
      }));
    }

    // Password
    if (!password || password.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        password: { error: "Password is required", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: { error: "", isError: false },
      }));
    }

    // Confirm Password
    if (!confirmPassword || confirmPassword.trim() === "") {
      errors = true;
      setError((prev) => ({
        ...prev,
        confirmPassword: {
          error: "Password confirmation is required",
          isError: true,
        },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: { error: "", isError: false },
      }));
    }

    // Verified valid email
    const isEmailValid = generalFormatter.validateEmailFormat(email);
    if (!isEmailValid) {
      errors = true;
      setError((prev) => ({
        ...prev,
        email: {
          error: "Please enter a valid email address",
          isError: true,
        },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: { error: "", isError: false },
      }));
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      errors = true;
      setError((prev) => ({
        ...prev,
        confirmPassword: { error: "Passwords don't match", isError: true },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: { error: "", isError: false },
      }));
    }

    // Return if there are any errors
    if (errors) return;

    try {
      const res = await axios.post("/api/restaurant/", {
        name,
        description,
        address,
        email,
        password,
      });

      toast.success(res.data.message);
      toast.info("Please sign in to your account");
      Router.push("/restaurant/signIn");
    } catch (error) {
      if (error.response.status === 500) console.log(error);
      return toast.error("Could not sign up :(. Server Error");
    }
  };

  useEffect(() => {
    // Call the initMap function when the component mounts
    initMap(setFormData);
  }, []);
  
  

  return (
    <div className={styles.form_upper_container}>
      <div className={styles.form_restaurant_signup_image}>
        
        <div className={styles.form_container}>
       
          <form className={styles.form}>
          <div className={styles.form_title_container}>
          <span className={styles.form_title}>Restaurant Sign Up</span>
        </div>
        <div>
              <p>
                Already have an account?{" "}
                <Link href="/restaurant/signIn">
                  <span className={styles.form_hightlight}>Sign In here</span>
                </Link>
              </p>
            </div>
            <div className={styles.form_row_md}>
              <div className={styles.form_row}>
                <label className={styles.form_label} htmlFor="name">
                  Restaurant Name
                </label>
                <input
                  className={styles.form_input}
                  type="text"
                  name="name"
                  placeholder="Restaurant Name..."
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                {error.name.isError && (
                  <span className={styles.error}>{error.name.error}</span>
                )}
              </div>
              <div className={styles.form_row}>
                <label className={styles.form_label} htmlFor="description">
                  Description
                </label>
                <textarea
                  className={styles.form_input}
                  name="description"
                  placeholder="Description..."
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
                {error.description.isError && (
                  <span className={styles.error}>
                    {error.description.error}
                  </span>
                )}
              </div>
            </div>
            

            <div className={styles.form_row}>
              <label className={styles.form_label} htmlFor="address">
                Address
              </label>
              <input
                id="location-input"
                className={styles.form_input}
                type="text"
                name="address"
                placeholder="Address..."
                required
                onChange={handleChange}
                value={formData.address}
              />
              {error.address.isError && (
                <span className={styles.error}>{error.address.error}</span>
              )}
            </div>

            <div className={styles.form_row}>
              <label className={styles.form_label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.form_input}
                type="email"
                name="email"
                placeholder="Email..."
                required
                onChange={handleChange}
                value={formData.email}
              />
              {error.email.isError && (
                <span className={styles.error}>{error.email.error}</span>
              )}
            </div>
            <div className={styles.form_row_md}>
              <div className={styles.form_row}>
                <label className={styles.form_label} htmlFor="password">
                  Password
                </label>
                <input
                  className={styles.form_input}
                  type="password"
                  name="password"
                  placeholder="Password..."
                  required
                  onChange={handleChange}
                  value={formData.password}
                />
                {error.password.isError && (
                  <span className={styles.error}>{error.password.error}</span>
                )}
              </div>
              <div className={styles.form_row}>
                <label className={styles.form_label} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className={styles.form_input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password..."
                  required
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
                {error.confirmPassword.isError && (
                  <span className={styles.error}>
                    {error.confirmPassword.error}
                  </span>
                )}
              </div>
            </div>
            <div>
            <span className={styles.form_crums}>By clicking "Submit", you agree to Lyft Eats Merchant Terms and
             Conditions.</span>
            </div>
            <div>
              <button
                className={styles.form_button}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            
          </form>
        </div>
        <div>
      </div>
      
      </div>
      <div className={styles.container}>
      <div><p><h1 className={styles.subtitle}>Get to where you want to grow with Lyft Eats for restaurants, grocery, convenience, and more</h1></p></div>
      {/* First column */}
      <div className={styles.item}><span className={styles.subtext_title}>Attract new customers</span>
      <p className={styles.subtext}>
      Reach people in your local area across Uber’s rides and delivery network.
      </p>
      </div>
      
      

      {/* Second column */}
      <div className={styles.item}><span className={styles.subtext_title}>Boost your sales</span>
      <p className={styles.subtext}>
      Stand out with marketing tools, including ads and offers, that help drive more orders.
      </p>
      </div>
      
      

      {/* Third column */}
      <div className={styles.item}><span className={styles.subtext_title}>Operate with ease</span>
      <p className={styles.subtext}>
      Manage orders with easy-to-use operational tools, customer insights, and analytics.
      </p>
      </div>
      
      
    </div>
      
    
    </div>

    
  );
};

export default SignUp;
