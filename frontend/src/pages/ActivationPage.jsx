import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(
            `${server}/user/activation`,
            { activation_token },
            { withCredentials: true }
          )
          .then((res) => {
            console.log(res);
            // Wait for 3 seconds before reloading the page
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activation_token]);

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="m-20 flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white p-20  rounded-md shadow-md text-center">
          {error ? (
            <>
              <p className=" text-lg mb-10">Your token is expired!</p>
              <button
                className={`${styles.simpleButton}`}
                onClick={navigateHome}
              >
                Go to Home
              </button>
            </>
          ) : (
            <>
              <p className=" text-lg mb-10">
                Your account has been created successfully!
              </p>
              <button
                className={`${styles.simpleButton}`}
                onClick={navigateHome}
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ActivationPage;
