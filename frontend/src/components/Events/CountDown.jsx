import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

function calculateTimeLeft(finishDate) {
  const difference = +new Date(finishDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(data.Finish_Date));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(data.Finish_Date));
    }, 1000);

    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, data._id, data.Finish_Date]);

  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span key={interval} className="text-[22px] text-[#475ad2]">
        {timeLeft[interval]} {interval}
        {index < Object.keys(timeLeft).length - 1 && " "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[22px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
