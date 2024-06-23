import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../../Assets/CottonStyle.png";
import visa from "../../Assets/v.png";
import mastercard from "../../Assets/m.png";
import upi from "../../Assets/u.png";
import cod from "../../Assets/d.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white ">
      <div className="container mx-auto py-12 px-4 ">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 ">
          <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col ">
            <Link to="/" className="mb-4">
              <img
                src={logo}
                alt="CottonStyle"
                className="w-24"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p>
              Discover the latest trends in t-shirt fashion and express yourself
              with our premium collection.
            </p>
            <div className="flex items-center mt-4">
              <AiFillFacebook size={25} className="cursor-pointer" />
              <AiOutlineTwitter size={25} className="ml-4 cursor-pointer" />
              <AiFillInstagram size={25} className="ml-4 cursor-pointer" />
              <AiFillYoutube size={25} className="ml-4 cursor-pointer" />
            </div>
          </div>

          <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">
              Subscribe for Updates
            </h2>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email..."
                className="mr-2 py-2.5 px-3 w-full bg-gray-800 text-white focus:outline-none rounded"
              />
              <button className="bg-teal-500 hover:bg-[#56d879] duration-300 px-5 py-2.5 rounded-md text-white">
                Submit
              </button>
            </form>
          </div>

          <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4 mx-10">Quick Links</h2>
            <ul>
              <li className="mb-2 mx-10">
                <Link to="/products" className="hover:text-teal-400">
                  Products
                </Link>
              </li>
              <li className="mb-2 mx-10">
                <Link to="/about" className="hover:text-teal-400">
                  About Us
                </Link>
              </li>
              <li className="mb-2 mx-10">
                <Link to="/contact" className="hover:text-teal-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0">
            <p className="mb-4">© 2024 CottonStyle. All rights reserved.</p>
            <p>
              <Link to="/terms" className="hover:text-teal-400">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-teal-400">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="md:w-1/2 flex flex-col md:flex-row items-center justify-center md:justify-end">
            <div className="flex items-center">
              <img src={visa} alt="Visa" className="h-10 mx-2" />
              <img src={mastercard} alt="Mastercard" className="h-10 mx-2" />
              <img src={upi} alt="UPI" className="h-10 mx-2" />
              <img src={cod} alt="Cash on Delivery" className="h-10 mx-2" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
