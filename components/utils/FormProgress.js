import React from "react";
import NextButton from "./NextButton";
import FinishButton from "./FinishButton";
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";

function FormProgress({
  isDisableNextButton,
  currentStep,
  prevFormStep,
  totalStep,
  formId,
  isLoading,
}) {
  return (
    <div className="mt-5 d-flex justify-content-between ">
      {currentStep === 2 ||
      currentStep === 3 ||
      currentStep === 4 ||
      currentStep === 5 ? (
        <BackButton
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          isDisableBackButton={false}
        />
      ) : (
        <BackButton
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          isDisableBackButton={false}
        />
      )}

      <ProgressBar currentStep={currentStep} totalStep={totalStep} />

      {currentStep === totalStep - 1 ? (
        <FinishButton formId={formId} isLoading={isLoading} />
      ) : (
        <NextButton formId={formId} isDisableNextButton={isDisableNextButton} />
      )}
    </div>
  );
}

export default FormProgress;
