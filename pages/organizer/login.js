import $ from "jquery";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Form, Button, Col } from "react-bootstrap";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import Title from "../../components/utils/Title/Title";
import FromBottom from "../../components/utils/FromBottom";
import Sideimage from "../../components/utils/Sideimage";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";
import { ALERT_MESSAGE_INVALID_CREDENTIAL } from "../../constants";
import {
  signInOrganizer,
  signInWithGoogle,
  signUpWithGoogle,
} from "../../services/service";
import { useRouter } from "next/router";
import { ErrorMessage } from "@hookform/error-message";
import { useAuthData } from "../../context/auth";
import Image from "next/image";

import { useSession, signIn, signOut } from "next-auth/react";
import { customNotification } from "../../components/Notificationui";
import { from } from "form-data";

const Login = () => {
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
    setIsLoading(true);
    console.table(data);
    const res = await signInOrganizer(data);

    if (res.status === 200) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("result", JSON.stringify(res.result));
      if (res.result.location_address) {
        localStorage.setItem("location_address", res.result.location_address);
      }
      if (res.result.profileImage) {
        localStorage.setItem("profileImage", res.result.profileImage);
      }

      setAuthValues(res);
      // router.push("/event/dashboard");
      if (res.result.profile_setup_completed) {
        router.push("/event/dashboard");
      } else {
        router.push("/users/setup");
      }

      setIsLoading(false);
    } else if (res.message === "Invalid email or password") {
      alert.show(
        <div style={{ textTransform: "none" }}>
          {ALERT_MESSAGE_INVALID_CREDENTIAL}
        </div>,
        {
          type: "error",
        }
      );
      setIsLoading(false);
    } else {
      alert.show(res.message);
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
      router.replace("/users/setup");
    }

    // ------------------------------------------------------------------

    if (session) {
      console.log(JSON.stringify(session.user));
      const loginData = {
        email: session.user.email,
        role: "organizer",
      };

      const resSignInWithGoogle = await signInWithGoogle(loginData);

      if (resSignInWithGoogle.status === 200) {
        localStorage.setItem("token", resSignInWithGoogle.token);
        localStorage.setItem(
          "result",
          JSON.stringify(resSignInWithGoogle.result)
        );
        if (resSignInWithGoogle.result.location_address) {
          localStorage.setItem(
            "location_address",
            resSignInWithGoogle.result.location_address
          );
        }
        if (resSignInWithGoogle.result.profileImage) {
          localStorage.setItem(
            "profileImage",
            resSignInWithGoogle.result.profileImage
          );
        }

        setAuthValues(resSignInWithGoogle);

        if (resSignInWithGoogle.result.profile_setup_completed) {
          router.push("/event/dashboard");
        } else {
          router.push("/users/setup");
        }

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
          role: "organizer",
          last_visited_event: "",
        };
        const resSignUpWithGoogle = await signUpWithGoogle(signUpData);

        if (resSignUpWithGoogle.status === 200) {
          const loginData = {
            email: session.user.email,
            role: "organizer",
          };

          const resSignInWithGoogle = await signInWithGoogle(loginData);

          if (resSignInWithGoogle.status === 200) {
            localStorage.setItem("token", resSignInWithGoogle.token);
            localStorage.setItem(
              "result",
              JSON.stringify(resSignInWithGoogle.result)
            );
            if (resSignInWithGoogle.result.location_address) {
              localStorage.setItem(
                "location_address",
                resSignInWithGoogle.result.location_address
              );
            }
            if (resSignInWithGoogle.result.profileImage) {
              localStorage.setItem(
                "profileImage",
                resSignInWithGoogle.result.profileImage
              );
            }

            setAuthValues(resSignInWithGoogle);
            router.push("/event/dashboard");
            if (resSignInWithGoogle.result.profile_setup_completed) {
              router.push("/event/dashboard");
            } else {
              router.push("/users/setup");
            }

            if (isGoogleSSO) {
              signOut("google");
            } else {
              signOut("facebook");
            }

            setIsLoading(false);
          }
        }
      } else {
        alert.show(resSignInWithGoogle.message);
        setIsLoading(false);
        router.push("/organizer/registration");
      }
    }
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
        <title>Sign In</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <div className="mx-470">
            <h1 className="mb-5 text-dark">Sign In to EventBy</h1>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Form.Group className="mb-3">
                <Form.Label className="font-weight-500">Email*</Form.Label>
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
                    // defaultValue="newgenbabylon@gmail.com"
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

              <Form.Group className="mb-3">
                <Form.Label className="font-weight-500">Password*</Form.Label>
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
                    // defaultValue="Aa12345678@"
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

              <Link href="/organizer/forgetpassword">
                <a className="d-block text-gray-2 my-4 mt-3">
                  Forgot Password?
                </a>
              </Link>

              <Button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg w-100"
              >
                Sign In
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

            {/* {session && JSON.stringify(session)} */}

            {/* ------------------------------------------------------------------------------------ */}
            {/* {session && (
              <a href="#" onClick={handleSignout} className="btn-signin">
                Sign out
              </a>
            )}
            {!session && (
              <a href="#" onClick={handleSignin} className="btn-signin">
                Sign in
              </a>
            )} */}
            {!session && (
              <FromBottom
                label="Sign in with Google"
                img="/img/google.svg"
                onClick={() => {
                  signIn("google", {
                    callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/organizer/login/`,
                  });
                  setIsGoogleSSO(true);
                }}
              />
            )}

            {!session && (
              <FromBottom
                label="Sign in with Facebook"
                img="/img/facebook.svg"
                onClick={() => {
                  signIn("facebook", {
                    callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/organizer/login/`,
                  });
                  setIsFacebookSSO(true);
                }}
              />
            )}

            {/* ------------------------------------------------------------------------------------ */}
          </div>
        </div>
        <div className="col-md-6 text-end d-none d-lg-block">
          <Image
            src="/img/loginorganizer.png"
            alt="Login"
            height={600}
            width={446}
            className="center"
          />
        </div>
      </Row>
    </>
  );
};
Login.layout = "Login";
export default Login;
