import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = ["Cart", "Address", "Payment", "Success"];
  const stepWidth = `${100 / steps.length}%`;

  return (
    <div className="w-full flex justify-center py-4">
      <div className="flex justify-between w-full max-w-xl">
        {steps.map((step, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index < steps.length - 1 ? "mr-2" : ""
              }`}
              style={{ width: stepWidth }}
            >
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${
                  active >= index + 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 border-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-center text-xs">{step}</span>
              {index < steps.length && (
                <div
                  className={`w-full h-0.5 ${
                    active > index ? "bg-green-600" : "bg-gray-600"
                  } mt-1`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
