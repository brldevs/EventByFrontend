import { useState, useEffect } from "react";
import $ from "jquery";
import Head from "next/head";
import Link from "next/link";
import { Row, Form, Button, Col } from "react-bootstrap";
import FromAppendPrepend from "../../components/utils/FromAppendPrepend";
import Title from "../../components/utils/Title/Title";
import FromBottom from "../../components/utils/FromBottom";
import Sideimage from "../../components/utils/Sideimage";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import {
  signInAttendee,
  signInWithGoogle,
  signUpWithGoogle,
} from "../../services/service";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { ErrorMessage } from "@hookform/error-message";
import { useAuthData } from "../../context/auth";
import { useSession, signIn, signOut } from "next-auth/react";

function attendLogin() {
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
    const res = await signInAttendee(data);

    if (res.status === 200) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("result", JSON.stringify(res.result));

      setAuthValues(res);
      router.push("/attendees");

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
      router.push("/attendees");
    } else {
      if (session) {
        console.log(JSON.stringify(session.user));
        const loginData = {
          email: session.user.email,
          role: "attendee",
        };

        const resSignInWithGoogle = await signInWithGoogle(loginData);
        console.log(JSON.stringify(resSignInWithGoogle));

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
          alert.show(resSignInWithGoogle.message);
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
        <title> Login</title>
      </Head>
      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <h1 className="mb-5">Log In to EventBy</h1>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Form.Group className="mb-3">
              <Form.Label>Email*</Form.Label>
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
                  // defaultValue="shafaet@newgen-bd.com"
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
              <Form.Label>Password*</Form.Label>
              <div className="input-group password">
                <FromAppendPrepend icon="ri-lock-line" />
                <Form.Control
                  type={isPasswordShown ? "text" : "password"}
                  {...register("password", {
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
                        v.length > 7 ||
                        "Your password must be at least 8 characters.",
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

            <Link href="/attendees/forgetpassword">
              <a className="d-block text-gray2 mt-3 mb-4">Forgot Password?</a>
            </Link>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-100"
            >
              Log In
            </Button>
          </form>
          <div className="text-gray-2 my-4">
            Not Registered Yet? Please
            <Link href="/attendees/registration">
              <a> Sign Up</a>
            </Link>
          </div>
          <div className="hr-line mb-5">
            <span>or continue with</span>
          </div>

          {/* {session && JSON.stringify(session)} */}

          {/* ------------------------------------------------------------------------------------ */}

          {!session && (
            <FromBottom
              label="Sign in with Google"
              img="/img/google.svg"
              onClick={() => {
                signIn("google", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/attendees/login/`,
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
                  callbackUrl: `${process.env.NEXT_PUBLIC_SSO_BASE_URL}/attendees/login/`,
                });
                setIsFacebookSSO(true);
              }}
            />
          )}

          {/* ------------------------------------------------------------------------------------ */}
        </div>

        <Sideimage src="/img/login2.svg" alt="Login" />
      </Row>
    </>
  );
}

attendLogin.layout = "Login";
export default attendLogin;
