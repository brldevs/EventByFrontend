import $ from "jquery";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { Button, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import { forgotPassword } from "../../services/service";
import { ErrorMessage } from "@hookform/error-message";
import Head from "next/head";
import Link from "next/link";
import FromBottom from "../../components/utils/FromBottom";
import Image from "next/image";
import React, { useEffect } from "react";
const ForgetPassword = () => {
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
          <div className="mx-470">
            <h1 className="mb-4 text-dark">Forgot Password</h1>
            <div className="mb-4 text-gray-2">
              Please enter your email address to search for your account
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label className="font-weight-500">Email *</Form.Label>
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
            <div className="text-gray-2 my-4">
              Not Registered Yet? Please
              <Link href="/organizer/registration">
                <a className="font-weight-700"> Sign Up</a>
              </Link>
            </div>
            <div className="hr-line mb-5">
              <span>or continue with</span>
            </div>

            <FromBottom label="Sign in with Google" img="/img/google.svg" />
            <FromBottom label="Sign in with Facebook" img="/img/facebook.svg" />
          </div>
        </div>
        <div class="col-md-6 text-end d-none d-lg-block">
          <Image
            src="/img/forgotpassword.svg"
            alt="Reset password"
            height={600}
            width={446}
            className="center"
          />
        </div>
      </Row>
    </>
  );
};

ForgetPassword.layout = "Login";
export default ForgetPassword;
