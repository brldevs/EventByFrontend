import React from "react";

function FinishButton({ formId, isLoading }) {
  return (
    <div className="flex-1 text-end">
      <button
        form={formId}
        disabled={isLoading}
        type="submit"
        className="btn btn-primary"
      >
        <span className="d-none d-md-inline">Finish</span>
        <i className="ri-arrow-right-s-line" />
      </button>
    </div>
  );
}

export default FinishButton;
