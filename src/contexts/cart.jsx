import React, { useEffect, useState } from "react";

export const CartContext = React.createContext();


export const CartProvider = (props) => {
  const [cart, setCart] = useState([])

  
  
  function addToCart(data, callback) {

    if (cart.some(e => e.id === data.id)) {

      callback("in cart")
      
    } else {
      setCart(prev => [...prev.filter(c => c.id !== data.id), data])
      callback()
    }




  }
  function removeCart(id) {
    setCart(prev => prev.filter((data) => data.id !== id))
  }
  useEffect(() => {
    var mycart = localStorage.getItem("cart")

    if (mycart) {
      console.log(JSON.parse(mycart), 'my cart----------');
      setCart(JSON.parse(mycart))
    };

  }, [])
  useEffect(() => {
    if (cart.length) {
      localStorage.setItem("cart", JSON.stringify(cart))
    } else {
      localStorage.removeItem('cart')
    }
  }, [cart])



  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeCart, setCart }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export default CartContext;
