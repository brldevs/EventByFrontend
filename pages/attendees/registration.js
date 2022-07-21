import $ from "jquery";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { Button, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import FromBottom from "../../components/utils/FromBottom";
import Sideimage from "../../components/utils/Sideimage";
import { useAuthData } from "../../context/auth";
import {
  signUpAttendee,
  signInWithGoogle,
  signUpWithGoogle,
} from "../../services/service";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

const Registration = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const alert = useAlert();

  const { setAuthValues, data } = useAuthData();
  const [isLoading, setIsLoading] = useState(false);

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
    localStorage.setItem("temp_email", data.email);
    setIsLoading(true);
    console.table(data);

    const data2 = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      last_visited_event: "NA",
    };
    localStorage.setItem("signUpData", JSON.stringify(data2));
    setAuthValues(data2);
    const res = await signUpAttendee(data2);
    if (res.status === 200) {
      // alert.show(res.message);
      router.push("/attendees/verificationemail");
      setIsLoading(false);
    } else {
      alert.show(res.message, {
        timeout: 2000, // custom timeout just for this one alert
        type: "success",
      });
      setIsLoading(false);
    }
  };

  // show / hide password start
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };
  // show / hide password end

  const [isGoogleSSO, setIsGoogleSSO] = useState(false);
  const [isFacebookSSO, setIsFacebookSSO] = useState(false);

  useEffect(async () => {
    console.log("calling.. google");
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      router.push("/attendees");
    } else {
      if (session) {
        console.log(JSON.stringify(session.user));
        const loginData = {
          email: session.user.email,
          role: "attendee",
        };

        const resSignInWithGoogle = await signInWithGoogle(loginData);

        if (resSignInWithGoogle.status === 200) {
          localStorage.setItem("token", resSignInWithGoogle.token);
          localStorage.setItem(
            "result",
            JSON.stringify(resSignInWithGoogle.result)
          );

          setAuthValues(resSignInWithGoogle);

          if (isGoogleSSO) {
            signOut("google");
          } else {
            signOut("facebook");
          }

          setIsLoading(false);
        } else if (resSignInWithGoogle.status === 401) {
          // alert.show(resSignInWithGoogle.message);
          // user not signup so call signup with google then sign in with google
          const name = session.user.name.split(" ");
          const signUpData = {
            googleId: "NA",
            firstName: name[0],
            lastName: name[1],
            email: session.user.email,
            role: "attendee",
            last_visited_event: "NA",
          };
          const resSignUpWithGoogle = await signUpWithGoogle(signUpData);

          if (resSignUpWithGoogle.status === 200) {
            const loginData = {
              email: session.user.email,
              role: "attendee",
            };

            const resSignInWithGoogle = await signInWithGoogle(loginData);

            if (resSignInWithGoogle.status === 200) {
              localStorage.setItem("token", resSignInWithGoogle.token);
              localStorage.setItem(
                "result",
                JSON.stringify(resSignInWithGoogle.result)
              );

              setAuthValues(resSignInWithGoogle);
              router.push("/attendees");

              if (isGoogleSSO) {
                signOut("google");
              } else {
                signOut("facebook");
              }
              setIsLoading(false);
            }
          }
        } else {
          alert.show(resSignInWithGoogle.message, { type: "error" });
          setIsLoading(false);
          router.push("/attendees/login");
        }
      }
    }

    // ------------------------------------------------------------------
  }, [session]);

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
        <title>Register</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <h1 className="mb-5">Sign Up For EventBy</h1>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label htmlFor>First Name*</label>
                  <div className="input-group">
                    <FromAppendPrepend icon="ri-user-line" />
                    <Form.Control
                      type="text"
                      {...register("firstName", {
                        required: "This is required.",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Invalid Name",
                        },
                      })}
                      className="form-control"
                      placeholder="First Name"
                      autoComplete="off"
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="firstName"
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p key={type} style={{ color: "red" }}>
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>
                <div className="col-sm-6 mb-3">
                  <label htmlFor>Last Name*</label>
                  <div className="input-group">
                    <FromAppendPrepend icon="ri-user-line" />
                    <Form.Control
                      type="text"
                      {...register("lastName", {
                        required: "This is required.",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Invalid Name",
                        },
                      })}
                      placeholder="Last Name"
                      autoComplete="off"
                    />
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="lastName"
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p key={type} style={{ color: "red" }}>
                          {message}
                        </p>
                      ))
                    }
                  />
                </div>
              </div>
            </div>
            <Form.Group className="mb-3">
              <label htmlFor>Email</label>
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
                  autoComplete="none"
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
            <Form.Group className="mb-1">
              <label htmlFor>Password</label>
              <div className="input-group password">
                <FromAppendPrepend icon="ri-lock-line" />
                <Form.Control
                  type={isPasswordShown ? "text" : "password"}
                  {...register("password", {
                    required: "This is required.",
                    validate: {
                      validatePassword: (v) =>
                        (v.search(/[a-zA-z]/) > -1 &&
                          v.match(/[0-9]/) > 0 &&
                          v.search(/[@$!%*#?&]/) > -1 &&
                          v.length > 7) ||
                        "Your password must contain at least one letter, one digit, one special character and password length must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter Your Password"
                  autoComplete="none"
                />
                <FromAppendPrepend
                  prepend="true"
                  icon={isPasswordShown ? "ri-eye-line" : "ri-eye-off-line"}
                  onClick={togglePasswordVisibility}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="password"
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
            <div className="text-gray-2 mb-3">
              Use 8 or more characters with a mix of letters, numbers &amp;
              symbols
            </div>
            <div className=" mb-3">
              <input
                id="agree"
                type="checkbox"
                {...register("agree", { required: "This is required." })}
                className="me-2 mt-0 form-check-input"
              />
              <label htmlFor="agree" style={{ lineHeight: "22px" }}>
                I agree to the <a href="">Terms</a> and{" "}
                <a href="">Privacy Policy</a>
              </label>
              <ErrorMessage
                errors={errors}
                name="agree"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p key={type} style={{ color: "red" }}>
                      {message}
                    </p>
                  ))
                }
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-100"
            >
              Get Started
            </Button>
            <div className="text-gray-2 my-4">
              Already have an account? Please
              <Link href="/attendees/login">
                <a> Log In</a>
              </Link>
            </div>
            <div className="hr-line mb-5">
              <span>or registration with</span>
            </div>
          </form>

          {!session && (
            <FromBottom
              label="Sign Up with Google"
              img="/img/google.svg"
              onClick={() => {
                signIn("google", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/attendees/registration/`,
                });
                setIsGoogleSSO(true);
              }}
            />
          )}

          <FromBottom
            label="Sign Up with Facebook"
            img="/img/facebook.svg"
            onClick={() => {
              signIn("facebook", {
                callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/attendees/registration/`,
              });
              setIsFacebookSSO(true);
            }}
          />
        </div>
        <Sideimage src="/img/signup2.svg" alt="registration" />
      </Row>
    </>
  );
};
Registration.layout = "Login";
export default Registration;
