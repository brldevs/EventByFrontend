import React from "react";

function NextButton({ formId, isDisableNextButton }) {
  return (
    <div className="flex-1 text-end">
      <button
        form={formId}
        type="submit"
        className="btn btn-primary"
        disabled={isDisableNextButton}
      >
        <span className="d-none d-md-inline font-weight-500 me-2">Next</span>
        <i className="ri-arrow-right-s-line" />
      </button>
    </div>
  );
}

export default NextButton;
