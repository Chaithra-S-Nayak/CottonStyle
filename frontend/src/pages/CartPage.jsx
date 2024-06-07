import React from 'react'
import Header from '../components/Layout/Header'
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Cart from "../components/cart/Cart.jsx";
import Footer from '../components/Layout/Footer';

const CartPage = () => {
  return (
    <div>
        <Header />
        <br />
        <br />
        <CheckoutSteps active={1} />
        <Cart />
        <br />
        <br />
        <Footer />
    </div>
  )
}

export default CartPage