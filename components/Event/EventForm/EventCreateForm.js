import $ from "jquery";
import React, { useEffect } from "react";
import Head from "next/head";
import Title from "../../../components/utils/Title/Title";
import { Row, Col } from "react-bootstrap";
import FormProgress from "../../utils/FormProgress";

function EventCreateForm({ formHeading, formTitle, formComp }) {
  useEffect(() => {
    $(".input-group .form-control").on("focus", function () {
      $(this).parent().css({
        "border-color": "#2DC774",
        color: "#2DC774",
      });
    });
    $(".input-group .form-control").on("focusout", function () {
      $(this).parent().css({
        "border-color": "#E9ECF0",
        color: "#A5ADC1",
      });
    });
  });

  return (
    <>
      <Head>
        <title>Creat Event</title>
        <meta property="og:title" content="" key="title" />
      </Head>

      <Title>{formHeading}</Title>

      <div className="text-gray-2 text-center mb-5">{formTitle}</div>
      {formComp}
    </>
  );
}

export default EventCreateForm;
