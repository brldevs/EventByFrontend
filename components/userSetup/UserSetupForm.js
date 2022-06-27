import React from "react";
import Subtitle from "../../components/utils/Title/Subtitle";
import Title from "../../components/utils/Title/Title";

function UserSetupForm({ formHeading, formTitle, formComp }) {
  return (
    <>
      <div className="text-center mb-130">
        <Title> {formHeading}</Title>
        <Subtitle>{formTitle}</Subtitle>
        <div>{formComp}</div>
      </div>
    </>
  );
}

export default UserSetupForm;
