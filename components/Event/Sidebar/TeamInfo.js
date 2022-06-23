import { useAuthData } from "../../../context/auth";
import Image from "next/image";

function TeamInfo({
  organizerProfileImg,
  organizerName,
  organizerProfilePicture,
}) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  console.log(organizerProfileImg);
  const { data, setAuthValues, removeAuthValues } = useAuthData();
  return (
    <div className="d-flex ">
      <span className="q me-3 d-flex justify-content-center align-items-center bg-secondary text-white border-radius-10 cursor-pointer">
        <img
          src={`${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${organizerProfilePicture}/image`}
          height="60"
          width="60"
          className="border-radius-10"
        />
      </span>
      <div>
        <h5 className="font-20">{organizerName}</h5>
        {/* <button className="btn mt-1 btn-primary font-12 font-weight-500">
          <i className="ri-add-line me-1" />
          Follow
        </button>
        <button className="btn mt-1 btn-outline-secondary font-12 font-weight-500 ms-2">
          <i className="ri-add-line me-1" />
          Connect
        </button>
        <div className="text-gray-2 font-14 mt-2">
          2 Upcoming Events <br />
          3.6k Followers
        </div> */}
      </div>
    </div>
  );
}

export default TeamInfo;
