import Head from "next/head";
import React, { useEffect, useState } from "react";
import EventInfo from "../../../components/Event/Sidebar/EventInfo";
import Organizer from "../../../components/Event/Sidebar/Organizer";
import TeamInfo from "../../../components/Event/Sidebar/TeamInfo";
import CommentSection from "../../../components/Event/Singleevent/CommentSection";
import EventHeader from "../../../components/Event/Singleevent/EventHeader";
import MoreEventFromThisAuthor from "../../../components/Event/Singleevent/MoreEventFromThisAuthor";
import UpcomingEvent from "../../../components/Event/Upcomingevent";
import ShareEvent from "../../../components/utils/ShareEvent";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
const PREFIX_URL =
  "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

import { useAuthData } from "../../../context/auth";
import {
  getEventPreviewDataOPVById,
  getEventBannerByEventId,
  getAssetWithPath,
  getEventCoOrgSponsorSpeakerById,
  getAllEventsByOrganizerWithoutTokenByOrganizerId,
} from "../../../services/service";
import placeholderImg from "../../../public/img/placeholderImg.jpg";
import ImageSliderComponent from "../../../components/ImageSliderComponent";
import { Col } from "react-bootstrap";
import ReviewsByAttendees from "../../../components/Event/Sidebar/ReviewsByAttendees";
const SPONSOR = [
  { id: "1", img: "sponsor_4.png" },
  { id: "2", img: "sponsor_2.png" },
  { id: "3", img: "sponsor_3.png" },
  { id: "4", img: "sponsor_4.png" },
];

// check file type extension start
function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

function isImage(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "png":
    case "JPG":
    case "JPEG":
    case "GIF":
    case "BMP":
    case "PNG":
      //etc
      return true;
  }
  return false;
}

function isVideo(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
    case "M4V":
    case "AVI":
    case "MPG":
    case "MP4":
      // etc
      return true;
  }
  return false;
}
//check file type extension end

const mediaFiles = (event_assets, NEXT_PUBLIC_BASE_URL) => {
  // eventPreviewDataOPV.event_assets[0].path
  return (
    <>
      {event_assets &&
        event_assets.map((d, index) => {
          return (
            <div className="col" key={index}>
              {isImage(d.path) && (
                <Image
                  src={
                    d.path
                      ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/image`
                      : placeholderImg
                  }
                  layout="responsive"
                  className="border-radius-10 w-100"
                  width={500}
                  height={380}
                />
              )}

              {isVideo(d.path) && (
                <video
                  className="d-block w-100"
                  width={270}
                  height={130}
                  controls
                >
                  <source
                    src={
                      d.path
                        ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/video`
                        : placeholderImg
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          );
        })}
    </>
  );
};

const getCarouselItem = (event_assets, NEXT_PUBLIC_BASE_URL) => {
  console.log(
    "getCarouselItem(): " + JSON.stringify(event_assets),
    NEXT_PUBLIC_BASE_URL
  );

  return (
    <>
      {event_assets &&
        event_assets.map((d, index) => {
          return (
            <>
              {isImage(d.path) && (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  data-bs-interval={5000}
                  key={index}
                >
                  <img
                    width={270}
                    height={500}
                    className="d-block w-100 rounded"
                    // src={`${PREFIX_URL}7.jpg`}
                    src={
                      d.path
                        ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/image`
                        : placeholderImg
                    }
                  />
                  <div className="carousel-caption d-none d-md-block">
                    {/* <h5>slide {index} label</h5> */}
                    {/* <p>
                      Some representative placeholder content for the first
                      slide.
                    </p> */}
                  </div>
                </div>
              )}

              {isVideo(d.path) && (
                <div className="carousel-item">
                  <video
                    className="d-block w-100 rounded"
                    width={270}
                    height={500}
                    controls
                  >
                    <source
                      src={
                        d.path
                          ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/video`
                          : placeholderImg
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </>
          );
        })}
    </>
  );
};

const getCarouselIndicators = (event_assets, NEXT_PUBLIC_BASE_URL) => {
  console.log(
    "getCarouselIndicators(): " + JSON.stringify(event_assets),
    NEXT_PUBLIC_BASE_URL
  );

  return (
    <>
      {event_assets &&
        event_assets.map((d, index) => {
          return (
            <>
              {isImage(d.path) && (
                <div
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide-to={index}
                  className={`bg-body rounded ${index === 0 ? "active" : ""}`}
                  aria-current="true"
                  aria-label={`Slide ${index}`}
                >
                  <img
                    src={
                      d.path
                        ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/image`
                        : placeholderImg
                    }
                    className="rounded"
                  />
                </div>
              )}

              {isVideo(d.path) && (
                <div
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide-to={index}
                  aria-label={`Slide ${index}`}
                  className={`bg-body rounded ${index === 0 ? "active" : ""}`}
                >
                  <video className="d-block w-100" width={80} height={80}>
                    <source
                      src={
                        d.path
                          ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${d.path}/video`
                          : placeholderImg
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </>
          );
        })}
    </>
  );
};

const eventDetails = ({ dataServerSideProps }) => {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { data, setAuthValues, removeAuthValues } = useAuthData();
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [eventPreviewDataOPV, setEventPreviewDataOPV] = useState({});

  const [remainingTickets, setRemainingTickets] = useState(0);

  const [eventBannerImg, setEventBannerImg] = useState(null);

  const [mediaFilesArray, setMediaFilesArray] = useState([]);

  const [imageListData, setImageListData] = useState([]);

  const [coOrgSponsorSpeakerList, setCoOrgSponsorSpeakerList] = useState({});

  const [organizerProfileImg, setOrganizerProfileImg] = useState(null);

  const [organizerName, setOrganizerName] = useState(null);
  const [organizerEmail, setOrganizerEmail] = useState(null);
  const [organizerProfilePicture, setOrganizerProfilePicture] = useState(null);

  const [
    moreEventsFromOrganizerList,
    setMoreEventsFromOrganizerList,
  ] = useState([]);

  const getMediaFilesData = async (accessToken, event_assets) => {
    const imgPathArray = await event_assets.map((d, i) => d.path);

    console.log("=======" + typeof imgPathArray);
    console.log("======= imgPathArray" + imgPathArray);

    const mediaFilesData = event_assets.map(async (d, i) => {
      return await getAssetWithPath(accessToken, d.path);
    });
    console.log("mediaFilesData:   +++++" + mediaFilesData);

    const resultArray = [...mediaFilesData];

    return resultArray;
  };

  const [innerHTMLDescription, setInnerHTMLDescription] = useState();
  useEffect(async () => {
    if (id) {
      const eventId = id;
      setIsLoading(true);
      const accessToken = localStorage.getItem("token");
      const profileImage = localStorage.getItem("profileImage");

      if (!accessToken) {
        // localStorage.clear();
      }

      if (accessToken) {
        setToken(accessToken);
        setOrganizerProfileImg(profileImage);
      }

      if (eventId) {
        const res = await getEventPreviewDataOPVById(eventId);

        const resBannerImg = await getEventBannerByEventId(eventId);

        const resCoOrgSponsorSpeakerList = await getEventCoOrgSponsorSpeakerById(
          eventId
        );

        const resAllEventsByOrganizerWithoutTokenByOrganizerId = await getAllEventsByOrganizerWithoutTokenByOrganizerId(
          res.data.organizer
        );

        if (resAllEventsByOrganizerWithoutTokenByOrganizerId.status === 200) {
          setMoreEventsFromOrganizerList(
            resAllEventsByOrganizerWithoutTokenByOrganizerId.data
          );
        }

        const mediaFilesDa = getMediaFilesData(
          accessToken,
          res.data.event_assets
        );

        if (mediaFilesDa.length > 0) {
          console.log("mediaFilesDa : " + mediaFilesDa);
          setMediaFilesArray(mediaFilesDa);
        }

        if (resBannerImg) {
          setEventBannerImg(resBannerImg);
        }

        if (resCoOrgSponsorSpeakerList.data) {
          const name =
            resCoOrgSponsorSpeakerList.data.organizers[0].firstName +
            " " +
            resCoOrgSponsorSpeakerList.data.organizers[0].lastName;
          setCoOrgSponsorSpeakerList(resCoOrgSponsorSpeakerList.data);
          setOrganizerName(name);
          setOrganizerEmail(
            resCoOrgSponsorSpeakerList.data.organizers[0].email
          );
          setOrganizerProfilePicture(
            resCoOrgSponsorSpeakerList.data.organizers[0].profile_picture
          );
        }

        if (res.status === 200) {
          setEventPreviewDataOPV(res.data);
          setRemainingTickets(res.financialInfo.remaining);
          setInnerHTMLDescription(res.data.event_banner_description);

          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [id]);

  const lazyRoot = React.useRef(null);

  return (
    <>
      <Head>
        <title>{dataServerSideProps.data.name}</title>
        <meta property="og:title" content={dataServerSideProps.data.name} />
        <meta
          property="og:description"
          content={dataServerSideProps.data.event_banner_description}
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${dataServerSideProps.data.event_banner}/image`}
        />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta
          property="og:url"
          content={
            typeof window !== "undefined" && encodeURI(window.location.href)
          }
        />
        <meta property="og:site_name" content="EventBy" />

        <meta
          name="twitter:url"
          content={
            typeof window !== "undefined" && encodeURI(window.location.href)
          }
        />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${dataServerSideProps.data.event_banner}/image`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={dataServerSideProps.data.name} />
        <meta
          name="twitter:description"
          content={dataServerSideProps.data.event_banner_description}
        />
      </Head>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* <>
            <a
              href=""
              className="btn btn-primary px-3 me-4"
              data-bs-toggle="modal"
              data-bs-target="#checkout-modal-2"
            >
              Sign Checkout
            </a>
            <a
              href=""
              className="btn btn-primary px-3 me-4"
              data-bs-toggle="modal"
              data-bs-target="#checkout-modal"
            >
              Sign Register For Event
            </a>
            TEST COMMIT
            <a
              href=""
              className="btn btn-primary px-3 me-4"
              data-bs-toggle="modal"
              data-bs-target="#rsvp"
            >
              RSVP
            </a>
          </> */}

          <div className="event-preview">
            {eventPreviewDataOPV && (
              <EventHeader
                eventBannerImg={eventBannerImg}
                eventPreviewDataOPV={eventPreviewDataOPV}
                organizerProfilePicture={organizerProfilePicture}
                eventId={id}
                organizerName={organizerName}
                isRSVP={router.pathname.includes("rsvp") ? true : false}
              />
            )}

            <div className="main-content event-container mt-5">
              <div className="row">
                <div className="col-xl-8 left">
                  <div>
                    <h2 className="mb-4">{eventPreviewDataOPV.name}</h2>
                    {innerHTMLDescription && (
                      <div
                        className="text-gray-1"
                        dangerouslySetInnerHTML={{
                          __html: innerHTMLDescription,
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="position-relative photos-and-videos mt-80">
                    <h2 className="mb-4">Event Photos and Videos</h2>

                    <div
                      id="carouselExampleDark"
                      class="carousel slide z-depth-1-half"
                      data-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {getCarouselItem(
                          eventPreviewDataOPV.event_assets,
                          NEXT_PUBLIC_BASE_URL
                        )}
                      </div>
                      <button
                        className="carousel-control-prev "
                        type="button"
                        data-bs-target="#carouselExampleDark"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        />
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleDark"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        />
                        <span className="visually-hidden">Next</span>
                      </button>
                      <div className="carousel-indicators">
                        {getCarouselIndicators(
                          eventPreviewDataOPV.event_assets,
                          NEXT_PUBLIC_BASE_URL
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ***************************Event Speakers start*************************** */}
                  <div className="mt-80" style={{ height: "50px" }}></div>
                  <div className="event-speaker-R mt-80">
                    <h2 className="mb-4">Event Speakers</h2>

                    {/* <div class="d-flex justify-content-center">
                      <div
                        data-bs-target="#carouselExampleDark"
                        data-bs-slide-to={0}
                        className="active m-2"
                        aria-current="true"
                      >
                        <img src="https://www.eventby.xyz/backend/api/getAssetWithPath/1649231477131_sponsor1.jpg/image" />
                      </div>
                      <div
                        data-bs-target="#carouselExampleDark"
                        data-bs-slide-to={1}
                        className="active m-2"
                        aria-current="true"
                      >
                        <img src="https://www.eventby.xyz/backend/api/getAssetWithPath/1649231477131_sponsor1.jpg/image" />
                      </div>
                    </div> */}
                    {/* <ImageSliderComponent /> */}
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 text-center">
                      {eventPreviewDataOPV.speakers &&
                        eventPreviewDataOPV.speakers.map((data, index) => {
                          return (
                            <div className="col" key={index}>
                              <div className="d-flex bg-white border-radius-10 p-2 p-xxl-4 justify-content-center align-items-center flex-column">
                                {/* <img
                                  src={
                                    data.profilePath
                                      ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.profilePath}/image`
                                      : placeholderImg
                                  }
                                  className="rounded-circle"
                                /> */}

                                <img
                                  src="/img/avata.png"
                                  className="rounded-circle"
                                  height="80"
                                  width="80"
                                />

                                <div className="font-18">{data.name}</div>
                                <span className="font-12 text-gray-2">
                                  {data.email}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/* ***************************Event Speakers end*************************** */}
                  {/* ***************************Event Sponsors start*************************** */}
                  <div className="event-sponsor mt-80">
                    <h2 className="mb-4">Event Sponsors</h2>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 text-center">
                      {eventPreviewDataOPV.sponsors &&
                        eventPreviewDataOPV.sponsors.map((data, index) => {
                          return (
                            <div className="col" key={index}>
                              <div className="d-flex sponsor bg-white border-radius-10 p-2 p-xxl-4 justify-content-center align-items-center flex-column">
                                <a
                                  target="_blank"
                                  href={`${data.website}`}
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={
                                      data.profilePath
                                        ? `${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.profilePath}/image`
                                        : placeholderImg
                                    }
                                    className="w-75 d-block"
                                  />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/* ***************************Event Sponsors end*************************** */}
                  {/* Share Event */}
                  <div className="social-share my-5">
                    <div className="d-flex flex-wrap">
                      <span className="font-20 me-4">Share Event</span>
                      <ShareEvent
                        postUrl={
                          typeof window !== "undefined" &&
                          encodeURI(window.location.href)
                        }
                        postTitle={encodeURI(eventPreviewDataOPV.name)}
                        postImg={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${eventPreviewDataOPV.event_banner}/image`}
                      />
                    </div>
                  </div>
                  {/* CommentSection */}
                  <div className="event-discussion border-radius-10 bg-white p-4">
                    <h3>Event Discussion:</h3>

                    <CommentSection
                      eventId={id}
                      organizerProfilePicture={organizerProfilePicture}
                    />
                    {/*End Comment */}
                  </div>
                </div>
                <div className="col-xl-4 right mt-30 mt-xl-0 ">
                  <EventInfo
                    eventPreviewDataOPV={eventPreviewDataOPV}
                    organizerEmail={organizerEmail}
                    remainingTickets={remainingTickets}
                    eventBannerImg={eventBannerImg}
                  />
                  <div className="quinton-team mt-30 bg-white border-radius-10 p-4 mb-4">
                    <TeamInfo
                      // organizerProfileImg={organizerProfileImg}
                      organizerProfilePicture={organizerProfilePicture}
                      organizerName={organizerName}
                    />
                    {/* <ReviewsByAttendees /> */}
                    <Organizer
                      co_organizer={eventPreviewDataOPV.co_organizer}
                    />
                  </div>
                  <UpcomingEvent
                    organizerId={eventPreviewDataOPV.organizer[0]}
                    organizerName={organizerName}
                  />
                </div>
              </div>
              <MoreEventFromThisAuthor
                moreEventsFromOrganizerList={moreEventsFromOrganizerList}
                organizerName={organizerName}
                organizerProfileImg={organizerProfileImg}
                eventBannerImg={eventBannerImg}
              />
            </div>
          </div>

          <div
            className="modal fade checkout-modal"
            id="checkout-modal"
            tabIndex={-1}
            aria-labelledby="checkout-label"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content border-radius-10">
                <div>
                  <div className="row">
                    <div className="col p-30 px-50">
                      <div className="font-18 mb-4 font-weight-700">RSVP</div>
                      <form action method="post">
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label htmlFor className="font-14">
                                First Name*
                              </label>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="ri-user-line" />
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue="Mark"
                                  placeholder="First Name"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label htmlFor className="font-14">
                                Last Name*
                              </label>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="ri-user-line" />
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue="Adam"
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor className="font-14">
                            Email*
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="ri-mail-line" />
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Email ID"
                            />
                          </div>
                        </div>
                        <h6 className="font-18 mt-4">Payment Method</h6>
                        <div className="row payment-setting">
                          <div className="col">
                            <div className="checkbox">
                              <input type="checkbox" hidden id="paypal" />
                              <label
                                htmlFor="paypal"
                                className="d-flex align-items-center"
                              >
                                <span>
                                  <img src="/img/paypal.svg" />
                                </span>
                                <span className="tik-icon d-none">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="checkbox">
                              <input type="checkbox" hidden id="stripe" />
                              <label
                                htmlFor="stripe"
                                className="d-flex align-items-center"
                              >
                                <span>
                                  <img src="/img/stripe.svg" />
                                </span>
                                <span className="tik-icon d-none">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="col-12 mt-3">
                            <div className="p-20 card-payment border-radius-10">
                              <h6 className="font-18">Credit or Debit Card</h6>
                              <input
                                type="text"
                                className="form-control mb-3 form-control-sm"
                                placeholder="Card Number*"
                              />
                              <div className="row g-2">
                                <div className="col-6">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Expiration
                                                        Date*"
                                  />
                                </div>
                                <div className="col-3">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="CVV*"
                                  />
                                </div>
                                <div className="col-3">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Zip/Postal*"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 notification_panel my-4">
                          <div className="choice">
                            <input
                              id="n2"
                              type="checkbox"
                              className="me-2 form-check-input"
                            />
                            <label htmlFor="n2" style={{ lineHeight: "25px" }}>
                              I agree to the <a href>Terms</a> and
                              <a href>Privacy Policy</a>
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mb-3">
                          Place Order
                        </button>
                      </form>
                    </div>
                    <div className="col bg-light p-50 attendees">
                      <div className="upcoming-events">
                        <div className="col">
                          <div className="event">
                            <div className="image">
                              <img
                                src="/img/dashboard_event_photo_2.jpg"
                                className="border-radius-10 w-100"
                              />
                              <div className="time font-12">
                                36 Days <span>:</span> 12 Hours <span>:</span>{" "}
                                34 Minutes <span>:</span>
                                23 Seconds
                              </div>
                            </div>
                            <div className="event-content bg-white border-radius-10 p-30">
                              <div className="pt-30 d-flex justify-content-between">
                                <span>
                                  <i className="ri-calendar-check-line text-gray-2" />
                                  <span className="font-12 text-gray-1">
                                    July 23, 2021
                                  </span>
                                </span>
                              </div>
                              <h6 className="font-18 font-weight-700">
                                Global Leaders’ Conference ‘21
                              </h6>
                              <span className="text-gray-2 font-14">
                                By:{" "}
                                <span className="text-dark font-weight-700">
                                  Quinton,
                                </span>{" "}
                                <i className="ri-map-pin-line ms-2 " /> San
                                Francisco Area
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h6 className="font-18 mt-5 mb-4">Order Summary</h6>
                      <table>
                        <tbody>
                          <tr>
                            <td>1x Exclusive Workshop Admission</td>
                            <td>$9.00</td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr>
                            <td>Subtotal</td>
                            <td>$9.00</td>
                          </tr>
                          <tr>
                            <td>Fees</td>
                            <td>$3.59</td>
                          </tr>
                          <tr>
                            <td>Delivery</td>
                            <td>$0.00</td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr className="font-20">
                            <td>Total</td>
                            <td>$12.59</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Checkout Modal */}
          {/* Checkout 2 Modal */}
          <div
            className="modal fade checkout-modal"
            id="checkout-modal-2"
            tabIndex={-1}
            aria-labelledby="checkout-label"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content border-radius-10">
                <div>
                  <div className="row">
                    <div className="col p-30 px-50">
                      <div className="font-18 mb-4 font-weight-700">
                        Checkout
                      </div>
                      <form action method="post">
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label htmlFor className="font-14">
                                First Name*
                              </label>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="ri-user-line" />
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue="Mark"
                                  placeholder="First Name"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label htmlFor className="font-14">
                                Last Name*
                              </label>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="ri-user-line" />
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue="Adam"
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor className="font-14">
                            Email*
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="ri-mail-line" />
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email ID"
                            />
                          </div>
                        </div>
                        <div className="mb-3 notification_panel my-4">
                          <div className="choice">
                            <input
                              id="check2"
                              type="checkbox"
                              className="me-2 form-check-input"
                            />
                            <label
                              htmlFor="check2"
                              style={{ lineHeight: "25px" }}
                            >
                              I agree to the <a href>Terms</a> and
                              <a href>Privacy Policy</a>
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mb-3">
                          RSVIP
                        </button>
                      </form>
                    </div>
                    <div className="col bg-light p-50 attendees">
                      <div className="upcoming-events">
                        <div className="col">
                          <div className="event">
                            <div className="image">
                              <img
                                src="/img/dashboard_event_photo_2.jpg"
                                className="border-radius-10 w-100"
                              />
                              <div className="time font-12">
                                36 Days <span>:</span> 12 Hours <span>:</span>{" "}
                                34 Minutes <span>:</span>
                                23 Seconds
                              </div>
                            </div>
                            <div className="event-content bg-white border-radius-10 p-30">
                              <div className="pt-30 d-flex justify-content-between">
                                <span>
                                  <i className="ri-calendar-check-line text-gray-2" />
                                  <span className="font-12 text-gray-1">
                                    July 23, 2021
                                  </span>
                                </span>
                              </div>
                              <h6 className="font-18 font-weight-700">
                                Global Leaders’ Conference ‘21
                              </h6>
                              <span className="text-gray-2 font-14">
                                By:{" "}
                                <span className="text-dark font-weight-700">
                                  Quinton,
                                </span>{" "}
                                <i className="ri-map-pin-line ms-2 " /> San
                                Francisco Area
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Checkout 2 Modal */}
          {/* RSVIP Modal */}
          <div
            className="modal fade"
            id="rsvp"
            tabIndex={-1}
            aria-labelledby="register-for-event-label"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content border-radius-10">
                <div className="modal-body p-30">
                  <div className="font-18 mb-4 font-weight-700">RSVP</div>
                  <form action method="post">
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor className="font-14">
                            First Name*
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="ri-user-line" />
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Mark"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label htmlFor className="font-14">
                            Last Name*
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="ri-user-line" />
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Adam"
                              placeholder="Last Name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor className="font-14">
                        Email*
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="ri-mail-line" />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email ID"
                        />
                      </div>
                    </div>
                    <div className="mb-3 notification_panel">
                      <div className="choice">
                        <input
                          id="n3"
                          type="checkbox"
                          className="me-2 form-check-input"
                        />
                        <label htmlFor="n3" className="text-gray-1">
                          Create an account with EventBy
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor>Enter Password*</label>
                      <div className="input-group password">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="ri-lock-line" />
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter Password"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="ri-eye-off-line" />
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-2 font-13">
                        Use 8 or more characters with a mix of letters, numbers
                        &amp; symbols
                      </span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor>Confirm Password*</label>
                      <div className="input-group password">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="ri-lock-line" />
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="ri-eye-off-line" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                    >
                      Sign Up
                    </button>
                    <div className="mb-3 text-gray-2">
                      Already have an account on EventBy? Please{" "}
                      <a href>Log In</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// This gets called on every request
export async function getServerSideProps(context) {
  const eventId = context.params.id; // Get ID from slug `/book/1`
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);
  // const data = await res.json();
  //  await getEventPreviewDataOPVById(eventId);
  const res = await fetch(
    `https://www.eventby.xyz/backend/api/event/details/${eventId}`
  );
  const dataServerSideProps = await res.json();

  // Pass data to the page via props
  return { props: { dataServerSideProps } };
}

eventDetails.layout = "Eventpublic";
export default eventDetails;
