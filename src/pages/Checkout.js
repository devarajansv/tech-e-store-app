import React from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/user";
import { CartContext } from "../context/cart";
import EmptyCart from "../components/Cart/EmptyCart";

//react stripe element
import {
  CardElement,
  StripeProvider,
  Elements,
  injectStripe,
} from "react-stripe-elements";
import submitOrder from "../strapi/submitOrder";

function Checkout(props) {
  const { cart, total, clearCart } = React.useContext(CartContext);
  const { user, showAlert, hideAlert, alert } = React.useContext(UserContext);
  const history = useHistory();

  //state values
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");

  const isEmpty = !name || alert.show;

  async function handleSubmit(e) {
    showAlert({ msg: "submitting the order... please wait" });
    e.preventDefault();
    const response = await props.stripe
      .createToken()
      .catch((error) => console.log(error));
    const { token } = response;

    if (token) {
      setError("");
      const { id } = token;
      let order = await submitOrder({
        name: name,
        total: total,
        items: cart,
        stripeTokenId: id,
        userToken: user.token,
      });
      console.log(order);

      if (order) {
        showAlert({ msg: "your order is complete" });
        clearCart();
        history.push("/");
        return;
      } else {
        showAlert({
          msg: "there was an error with your order. please try again!",
          type: "danger",
        });
      }
    } else {
      hideAlert();
      showAlert({ msg: response.error.message });
      setError(response.error.message);
    }
  }

  if (cart.length < 1) {
    return <EmptyCart />;
  }

  return (
    <section className="section form">
      <h2 className="section-title">checkout</h2>
      <form className="checkout-form">
        <h3>
          order totlal:<span>${total}</span>
        </h3>
        {/* single input name */}
        <div className="form-control">
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        {/* card element */}
        <div className="stripe-input">
          <label htmlFor="card-element">credit or debit card</label>
          <p className="stripe-info">
            Test Using This Credit Card : <span>4242 4242 4242 4242</span>
            <br />
            Enter any 5 digits for the zip code
            <br />
            Enter any 3 digits for the CVV
          </p>
        </div>
        {/* stripe element */}
        <CardElement className="card-element"></CardElement>
        {/* stripe error */}
        {error && <p className="form-empty">{error}</p>}
        {/* empty input */}
        {isEmpty ? (
          <p className="form-empty">please fill out the name field</p>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
          >
            submit
          </button>
        )}
      </form>
    </section>
  );
}

const CardForm = injectStripe(Checkout);

const StripeWrapper = () => {
  return (
    <StripeProvider
      apiKey="	
pk_test_51HP5DqJiCh1JKg1TM1QVmHGI0ZOkqRBiKqVacgq1CruiOyVae7SMACvg1ZNuwHsTQ6Qp0hkq4x7aDx8jdj2IKbHP00Le6zJ0pa"
    >
      <Elements>
        <CardForm></CardForm>
      </Elements>
    </StripeProvider>
  );
};

export default StripeWrapper;
