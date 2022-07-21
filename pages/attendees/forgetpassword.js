import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { Button, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import { forgotPassword } from "../../services/service";
import { ErrorMessage } from "@hookform/error-message";
import $ from "jquery";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
const Forgetpassword = () => {
  const router = useRouter();
  const alert = useAlert();
  const {
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });
  const onSubmit = async (data) => {
    console.table(data);
    const res = await forgotPassword(data);

    if (res.status === 200) {
      alert.show(
        <div style={{ textTransform: "none" }}>
          Successfully Sent Email to Reset Password
        </div>,
        {
          type: "info",
        }
      );

      setIsLoading(false);
    }
  };

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
        <title>Forgot Password</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <h1 className="mb-4">Forgot Password</h1>
          <div className="mb-4 text-gray-2">
            Please enter your email address to search for your account
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <div className="input-group">
                <FromAppendPrepend icon="ri-mail-line" />
                <Form.Control
                  type="text"
                  {...register("email", {
                    required: "This is required.",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="Enter Your Email"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p key={type} style={{ color: "red" }}>
                      {message}
                    </p>
                  ))
                }
              />
            </Form.Group>
            <Button type="submit" className="btn btn-primary btn-lg w-100">
              Reset Password
            </Button>
          </form>
        </div>
        <div className="col-md-6 text-end d-none d-lg-block">
          <object
            className="w-75"
            data="../../img/password2.svg"
            type="image/svg+xml"
          />
        </div>
      </Row>
    </>
  );
};

Forgetpassword.layout = "Login";
export default Forgetpassword;
