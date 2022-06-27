import React from "react";

function ProgressBar({ currentStep, totalStep }) {
  return (
    <div className="flex-1 text-center my-3">
      <div className="bg-gray-4 rounded-pill">
        <div
          style={{
            width: `${((currentStep + 1) / totalStep) * 100}%`,
            height: "4px",
          }}
          className="bg-secondary rounded-pill"
        />
      </div>
      <span className="text-gray-2 mt-2 font-14 d-inherit lh-1">
        Step {currentStep + 1} of {totalStep}
      </span>
    </div>
  );
}

export default ProgressBar;
