import { useRouter } from "next/router";
import Link from "next/link";

const ProfileProgressBar = ({
  children,
  currentStep,
  prevFormStep,
  nextFormStep,
  totalStep,
}) => {
  return (
    <>
      {children}
      {/* <div className="d-flex justify-content-between align-items-end">
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

        <div className="flex-1 text-center">
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
              type="button"
              className="btn btn-primary"
              onClick={nextFormStep}
            >
              <span className="d-none d-md-inline">Next</span>{" "}
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        )}
      </div> */}
    </>
  );
};

export default ProfileProgressBar;
