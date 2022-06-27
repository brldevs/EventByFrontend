import React from "react";

function ProgressBarChangeBtn({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  return (
    <>
      <div className="mt-5 d-flex justify-content-between align-items-end">
        {currentStep > 0 ? (
          <div className="flex-1">
            <button
              type="button"
              className="btn light-btn btn-outline-primary"
              onClick={prevFormStep}
            >
              <i className="ri-arrow-left-s-line" />
              <span className="d-none d-md-inline">Back</span>
            </button>
          </div>
        ) : (
          <div className="flex-1"></div>
        )}

        {currentStep === totalStep - 1 ? (
          <div className="flex-1 text-end">
            <button
              type="button"
              className="btn btn-primary"
              // onClick={nextFormStep} will submit form
            >
              <span className="d-none d-md-inline">Finish</span>{" "}
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        ) : (
          <div className="flex-1 text-end">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={nextFormStep}
            >
              <span className="d-none d-md-inline ">Next</span>
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProgressBarChangeBtn;
