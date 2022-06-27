import Head from "next/head";
import $ from "jquery";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { Button, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import Sideimage from "../../../components/utils/Sideimage";
import { resetPassword } from "../../../services/service";
const Resetpassword = () => {
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
  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  const { id } = router.query;

  const onSubmit = async (data) => {
    console.table(data);
    const res = await resetPassword(data, id);
    if (res.status === 200) {
      alert.show(res.message);
      router.push("/attendees/login");
    } else {
      alert.show(res.message);
    }
  };

  // show / hide password start
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };
  // show / hide password end

  // show / hide confirm password start
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown);
  };
  // show / hide confirm password end

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
        <title>Reset Password</title>
        <meta property="og:title" content="" key="title" />
      </Head>
      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <h1 className="mb-4">Reset Password</h1>
          <div className="mb-4 text-gray-2">Please enter your new password</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Form.Group className="mb-1">
                <label htmlFor>Password*</label>
                <div className="input-group password">
                  <FromAppendPrepend icon="ri-lock-line" />
                  <Form.Control
                    type={isPasswordShown ? "text" : "password"}
                    {...register("newPassword", {
                      required: "This is required.",
                      validate: {
                        isAtLeastOneLetter: (v) =>
                          v.search(/[a-zA-z]/) > -1 ||
                          "Your password must contain at least one letter.",

                        isAtLeastOneDigit: (v) =>
                          v.match(/[0-9]/) > 0 ||
                          "Your password must contain at least one digit.",

                        isAtLeastOneSpecialCharacter: (v) =>
                          v.search(/[@$!%*#?&]/) > -1 ||
                          "Your password must contain at least one special character.",

                        isLengthLessThanEight: (v) =>
                          v.length > 8 ||
                          "Your password must be at least 8 characters.",
                      },
                    })}
                    placeholder="Enter Your Password"
                  />
                  <FromAppendPrepend
                    prepend="true"
                    icon={isPasswordShown ? "ri-lock-line" : "ri-eye-off-line"}
                    onClick={togglePasswordVisibility}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="newPassword"
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
            </div>
            <div className="mb-3">
              <Form.Group className="mb-1">
                <label htmlFor>Confirm New Password*</label>
                <div className="input-group password">
                  <FromAppendPrepend icon="ri-lock-line" />
                  <Form.Control
                    type={isConfirmPasswordShown ? "text" : "password"}
                    {...register("repeatPassword", {
                      required: "This is required.",
                      validate: {
                        isAtLeastOneLetter: (v) =>
                          v.search(/[a-zA-z]/) > -1 ||
                          "Your password must contain at least one letter.",

                        isAtLeastOneDigit: (v) =>
                          v.match(/[0-9]/) > 0 ||
                          "Your password must contain at least one digit.",

                        isAtLeastOneSpecialCharacter: (v) =>
                          v.search(/[@$!%*#?&]/) > -1 ||
                          "Your password must contain at least one special character.",

                        isLengthLessThanEight: (v) =>
                          v.length > 8 ||
                          "Your password must be at least 8 characters.",

                        isPasswordAndConfirmPasswordSame: (v) =>
                          v === newPassword.current ||
                          "Password and Confirm password does not match",
                      },
                    })}
                    placeholder="Enter Your Password"
                  />
                  <FromAppendPrepend
                    prepend="true"
                    icon={
                      isConfirmPasswordShown
                        ? "ri-lock-line"
                        : "ri-eye-off-line"
                    }
                    onClick={toggleConfirmPasswordVisibility}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="repeatPassword"
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
            </div>
            <Button type="submit" className="btn btn-primary btn-lg w-100">
              Reset Password
            </Button>
          </form>
        </div>
        <Sideimage src="/img/password2.svg" alt="reset_password" />
      </Row>
    </>
  );
};

Resetpassword.layout = "Login";
export default Resetpassword;
