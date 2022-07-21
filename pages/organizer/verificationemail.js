import Link from "next/link";
import { useEffect, useState } from "react";
import Sideimage from "../../components/utils/Sideimage";
import { useAlert } from "react-alert";
import { useAuthData } from "../../context/auth";
import { signUpOrganizer } from "../../services/service";

const VerificationEmail = () => {
  const [counter, setCounter] = useState(0);

  const alert = useAlert();
  const { setAuthValues, data } = useAuthData();
  const [isLoading, setIsLoading] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  useEffect(async () => {
    const email = localStorage.getItem("temp_email");
    setTempEmail(email);
  }, []);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);

    if (counter <= 0) {
      // console.log("Times up!");
      setShowCounter(false);
      // setCounter(process.env.NEXT_PUBLIC_COUNT_DOWN_TIMER_VALUE_SECONDS);
    }
  }, [counter]);

  const [showCounter, setShowCounter] = useState(false);

  const requestForAnotherVerificationEmail = async () => {
    setCounter(process.env.NEXT_PUBLIC_COUNT_DOWN_TIMER_VALUE_SECONDS);
    setIsLoading(true);
    console.table(data);
    setShowCounter(true);

    const dataLocalStorage = localStorage.getItem("signUpData");
    const signUpData = JSON.parse(dataLocalStorage);

    const data2 = {
      email: signUpData.email,
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      last_visited_event: "NA",
      password: signUpData.password,
      role: "organizer",
    };
    setAuthValues(data2);
    const res = await signUpOrganizer(data2);
    if (res.status === 200) {
      alert.show(res.message);
      setIsLoading(false);
    } else {
      alert.show(res.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
        <h1 className="mb-4 h2">Your Account Is Almost Ready!</h1>
        <div className="text-gray-2 mb-4">
          Hey <span>👋</span> We sent you an email to{" "}
          <span className="text-gray-1">{tempEmail && tempEmail}</span>. So that
          you can verify your email address by clicking the link.
        </div>
        <div className="text-gray-2 my-4 mb-5">
          Didn’t get an email?
          {!showCounter ? (
            <a
              className="ps-1 cursor-pointer"
              onClick={requestForAnotherVerificationEmail}
            >
              Request for another verification email
            </a>
          ) : (
            <p>
              Please wait... <strong className="text-black"> {counter}</strong>
            </p>
          )}
        </div>
        <div className="text-gray-2 my-4 mt-5">
          Already have an account? Please
          <Link href="/organizer/login">
            <a className="font-weight-700"> Sign In</a>
          </Link>
        </div>
      </div>

      <Sideimage src="/img/email_verify.svg" alt="email_verify" />
    </div>
  );
};
VerificationEmail.layout = "Login";
export default VerificationEmail;
