import Link from "next/link";
import $ from "jquery";
import { useEffect, useState } from "react";
import Sideimage from "../../components/utils/Sideimage";
import { useAuthData } from "../../context/auth";
import { useAlert } from "react-alert";
import { signUpAttendee } from "../../services/service";

const VerificationEmail = () => {
  const alert = useAlert();
  const { setAuthValues, data } = useAuthData();
  const [tempEmail, setTempEmail] = useState("");
  useEffect(async () => {
    const email = localStorage.getItem("temp_email");
    setTempEmail(email);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const requestForAnotherVerificationEmail = async () => {
    setIsLoading(true);
    console.table(data);

    const dataLocalStorage = localStorage.getItem("signUpData");
    const signUpData = JSON.parse(dataLocalStorage);

    const data2 = {
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      email: signUpData.email,
      password: signUpData.password,
      last_visited_event: "NA",
    };
    const res = await signUpAttendee(data2);
    if (res.status === 200) {
      alert.show(res.message);
      setIsLoading(false);
    } else {
      alert.show(res.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    $(".modal-backdrop").remove();
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
          <a
            className="ps-1 cursor-pointer"
            onClick={requestForAnotherVerificationEmail}
          >
            Request for another verification email
          </a>
        </div>
        <div className="text-gray-2 my-4 mt-5">
          Already have an account? Please
          <Link href="/">
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
