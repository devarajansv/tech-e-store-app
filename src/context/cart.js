// cart context
import React from "react";
//import localCart from "../utils/localCart";

function getCartFromLocalStorage() {
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
}

export const CartContext = React.createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = React.useState(getCartFromLocalStorage);
  const [total, setTotal] = React.useState(0);
  const [cartItem, setCartItem] = React.useState(0);

  // remove item
  const removeItem = (id) => {
    // const removedItem = cart.filter((item) => item.id !== id);
    // setCart(removedItem);
    setCart([...cart].filter((item) => item.id !== id));
  };
  // increase amount
  const increaseAmount = (id) => {
    let newCart = [...cart].map((item) => {
      return item.id === id
        ? { ...item, amount: item.amount + 1 }
        : { ...item };
    });
    setCart(newCart);
  };
  // decrease amount
  const decreaseAmount = (id, amount) => {
    if (amount === 1) {
      removeItem(id);
      return;
    } else {
      let newCart = [...cart].map((item) => {
        return item.id === id
          ? { ...item, amount: item.amount - 1 }
          : { ...item };
      });
      setCart(newCart);
    }
  };
  
  // add to cart
  const addToCart = (product) => {
    const { id, image, title, price } = product;
    const item = [...cart].find((item) => item.id === id);
    if (item) {
      increaseAmount(id);
      return;
    } else {
      const newItem = { id, image, title, price, amount: 1 };
      const newCart = [...cart, newItem];
      setCart(newCart);
    }
  };
  // clear cart
  const clearCart = () => {
    setCart([]);
  };

  React.useEffect(() => {
    // local storage
    localStorage.setItem("cart", JSON.stringify(cart));
    // cart items
    let newCartItems = cart.reduce((total, cartItem) => {
      return (total += cartItem.amount);
    }, 0);
    setCartItem(newCartItems);
    // cart total
    let newTotal = cart.reduce((total, cartItem) => {
      return (total += cartItem.amount * cartItem.price);
    }, 0);
    newTotal = parseFloat(newTotal.toFixed());
    setTotal(newTotal);
  }, [cart]);
  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        cartItem,
        removeItem,
        increaseAmount,
        decreaseAmount,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
