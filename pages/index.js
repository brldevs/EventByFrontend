import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Row } from "react-bootstrap";

const Login = () => {
  const Router = useRouter();

  useEffect(async () => {
    const accessToken = localStorage.getItem("token");
    const result = JSON.parse(localStorage.getItem("result"));

    if (!accessToken) {
      Router.replace("/");
    } else if (accessToken && result.role === "attendee") {
      Router.replace("/attendees");
    } else if (
      accessToken &&
      result.role === "organizer" &&
      result.profile_setup_completed
    ) {
      Router.replace("/event/dashboard");
    } else {
      Router.push("/users/setup");
    }
  }, []);
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      </Head>
      <Row>
        <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
          <div className="mx-470">
            <h1 className="mb-5 text-dark">Landing Page</h1>

            <Link href="/organizer/registration">
              <a className="font-weight-700"> Sign Up as Organizer</a>
            </Link>
            <br />
            <Link href="/attendees/registration">
              <a className="font-weight-700"> Sign Up as Attendee</a>
            </Link>
          </div>
        </div>
        <div class="col-md-6 text-end d-none d-lg-block text-center">
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
