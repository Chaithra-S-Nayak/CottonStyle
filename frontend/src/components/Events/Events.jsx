import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // Check if allEvents is empty or undefined
  const hasEvents = allEvents && allEvents.length > 0;

  // Return null if isLoading or no events
  if (isLoading || !hasEvents) {
    return null;
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <div className="mt-5">Popular Events</div>
      </div>
      <div className="w-full grid">
        {allEvents.map((event) => (
          <EventCard key={event._id} data={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
