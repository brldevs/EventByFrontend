import { useRouter } from "next/router";
import { useEffect } from "react";
import Sideimage from "../../../components/utils/Sideimage";
import { verifyEmailByToken } from "../../../services/service";

const verification = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    if (id) {
      await verifyEmailByToken(id);
    }
  }, [id]);

  return (
    <div className="row">
      <div className="col-md-8 mx-md-auto mx-lg-0 col-lg-6">
        <h1 className="mb-4 h2">Your Account Is Verified!</h1>

        <button
          className="btn btn-primary btn-lg w-100"
          onClick={() => {
            router.push("/organizer/login");
          }}
        >
          Log In
        </button>
      </div>

      <Sideimage src="/img/email_verify.svg" alt="email_verify" />
    </div>
  );
};
verification.layout = "Login";
export default verification;
