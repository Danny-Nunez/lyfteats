import { useState } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import useAuth from "../hooks/useAuth";
import CardSection from "./CardSection";
import { toast } from "react-toastify";
import styles from "../styles/FocusedOrder.module.css";
import { useRouter } from "next/router";

const CheckOutForm = ({ total }) => {
  const [formErrors, setFormErrors] = useState({
    address: { error: "", isError: false },
    city: { error: "", isError: false },
    state: { error: "", isError: false },
  });
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
  });
  const stripe = useStripe();
  const elements = useElements();
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const { cart, setCart } = useData();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitOrder = async () => {
    // ... existing code ...
  };

  const handlePaymentSuccess = async () => {
    try {
      const cardElement = elements.getElement(CardElement);
      const stripeToken = await stripe.createToken(cardElement);

      const stripeCharge = await axiosPrivate.post("/api/stripe/charge", {
        user: currentUser,
        amount: total,
      });

      if (stripeCharge.status === 200) {
        const orderResponse = await axiosPrivate.post("/api/order", {
          restaurantId: cart[0].restaurantId,
          date: new Date(),
          total: total,
          dishes: cart,
          chargeToken: stripeToken,
        });

        setCart([]);
        toast.success(orderResponse.data.message);
        router.push("/user/myOrders");
      } else {
        toast.error("Unable to process payment");
      }
    } catch (error) {
      setError("Error Occurred");
      console.log(error);
    }
  };

  return (
    <div className="paper">
      <h5>Your information:</h5>
      <hr />
      <FormGroup className="form-row">
        <div className="form-group col-md-12">
          <Label>Address</Label>
          <Input name="address" onChange={handleChange} />
          {formErrors.address.isError && (
            <span className="error">{formErrors.address.error}</span>
          )}
        </div>
      </FormGroup>
      <FormGroup className="form-row">
        <div className="form-group col-md-6">
          <Label>City</Label>
          <Input name="city" onChange={handleChange} />
          {formErrors.city.isError && (
            <span className="error">{formErrors.city.error}</span>
          )}
        </div>
        <div className="form-group col-md-6">
          <Label>State</Label>
          <Input name="state" onChange={handleChange} />
          {formErrors.state.isError && (
            <span className="error">{formErrors.state.error}</span>
          )}
        </div>
      </FormGroup>

      <CardSection
        data={formData}
        stripeError={error}
        submitOrder={handlePaymentSuccess}
      />

      <style jsx global>
        
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            height: auto;
            width: 90%;
            padding: 10px;
            background: #fff;
            border-radius: 6px;
            margin: 20px 0;
          }

          .form-half {
            flex: 0.5;
          }

          .Checkout {
            margin: 0 auto;
            width: 70%;
            box-sizing: border-box;
            padding: 0 5px;
          }

          .error {
            color: var(--color-error);
          }

          label {
            color: #6b7c93;
            font-weight: 300;
            letter-spacing: 0.025em;
          }

          form {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 3px solid #e6ebf1;
          }

          input,
          .StripeElement {
            display: block;
            background-color: #f8f9fa !important;
            margin: 10px 0 20px 0;
            max-width: 500px;
            padding: 10px 14px;
            font-size: 1em;
            font-family: "Source Code Pro", monospace;
            box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
              rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
            border: 0;
            outline: 0;
            border-radius: 4px;
            background: white;
          }

          input:focus,
          .StripeElement--focus {
            box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
              rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
            -webkit-transition: all 150ms ease;
            transition: all 150ms ease;
          }

          .StripeElement.IdealBankElement,
          .StripeElement.PaymentRequestButton {
            padding: 0;
          }
        `}
      </style>
      <div className={styles.demo}>Please use the following credit card number for testing purposes: 4242 4242 4242 4242.</div>
    </div>
  );
};

export default CheckOutForm;
