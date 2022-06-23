import React from "react";

function BackButton({ currentStep, prevFormStep, isDisableBackButton }) {
  return (
    <>
      {currentStep > 0 ? (
        <div className="flex-1 text-left">
          <button
            type="button"
            className="btn light-btn btn-outline-primary "
            onClick={prevFormStep}
            style={{ float: "left" }}
            disabled={isDisableBackButton}
          >
            <i className="ri-arrow-left-s-line" />
            <span className="d-none d-md-inline font-weight-500 ms-2">
              Back
            </span>
          </button>
        </div>
      ) : (
        <div className="flex-1"></div>
      )}
    </>
  );
}

export default BackButton;
