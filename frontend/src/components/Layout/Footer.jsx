import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../../Assets/TshirtGalaxy.png";
import visa from "../../Assets/v.png";
import mastercard from "../../Assets/m.png";
import upi from "../../Assets/u.png";
import cod from "../../Assets/d.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-6">
      <div className="container mx-auto py-12 px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="text-center">
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="TshirtGalaxy"
                className="w-32 mx-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p className="text-gray-400">
              Discover the latest trends in Tshirt fashion and express yourself
              with our premium collection.
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4">
              <a href="https://www.facebook.com">
                <AiFillFacebook size={25} className="hover:text-teal-400" />
              </a>
              <a href="https://www.twitter.com">
                <AiOutlineTwitter size={25} className="hover:text-teal-400" />
              </a>
              <a href="https://www.instagram.com">
                <AiFillInstagram size={25} className="hover:text-teal-400 " />
              </a>
              <a href="https://www.youtube.com">
                <AiFillYoutube size={25} className="hover:text-teal-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-teal-400 ">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 ">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 ">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">We Accept</h2>
            <div className="flex justify-center items-center space-x-4">
              <img src={visa} alt="Visa" className="h-8" />
              <img src={mastercard} alt="Mastercard" className="h-8" />
              <img src={upi} alt="UPI" className="h-8" />
              <img src={cod} alt="Cash on Delivery" className="h-8" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <p className="text-gray-400">© 2024 Tshirt Galaxy</p>
          <div className="space-x-4">
            <Link to="/terms" className="hover:text-teal-400">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-teal-400 ">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
