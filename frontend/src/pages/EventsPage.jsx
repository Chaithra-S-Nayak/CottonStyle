import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header activeHeading={4} />
          <div className={`flex-grow ${styles.section}`}>
            <br />
            <br />
            {allEvents && allEvents.length > 0 ? (
              <div className="space-y-4 mb-12">
                {allEvents.map((event, index) => (
                  <EventCard key={index} active={true} data={event} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p>No events available at the moment!</p>
              </div>
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
