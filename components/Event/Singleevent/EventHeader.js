import $ from "jquery";
import Image from "next/image";
import TimeCounter from "../TimeCounter";
import { format, compareAsc } from "date-fns";
import { useAuthData } from "../../../context/auth";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useAlert } from "react-alert";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  signUpAttendee,
  addEventParticipant,
  checkoutFreeEvent,
  checkoutPaidEvent,
  joinEvent,
  stripeCheckoutSession,
  getDefaultCheckoutMethodByEvent,
} from "../../../services/service";
import Head from "next/head";
import { data } from "jquery";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Row } from "react-bootstrap";

function EventHeader({
  eventId,
  eventPreviewDataOPV,
  eventBannerImg,
  organizerProfilePicture,
  organizerName,
  isRSVP = false,
}) {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data, setAuthValues, removeAuthValues } = useAuthData();
  const {
    name,
    start_date,
    end_date,
    event_type,
    ticket,
  } = eventPreviewDataOPV;
  const {
    event_location,
    event_address_line1,
    event_address_line2,
    event_city_town,
    event_state,
    event_postal_code,
    event_country,
    event_lat,
    event_long,
  } = eventPreviewDataOPV.event_type_details;

  const alert = useAlert();
  const router = useRouter();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpWithoutEventBy, setIsSignUpWithoutEventBy] = useState(null);
  const [
    userAlreadyJoinedAndPaymentDoneMsg,
    setUserAlreadyJoinedAndPaymentDoneMsg,
  ] = useState(null);

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

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    criteriaMode: "all",
  });
  const onSubmitCheckoutFormPaid = async (data) => {
    const dataCheckOutMethod = {
      event_id: eventId,
    };
    const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
      dataCheckOutMethod
    );
    if (respCheckOutMethod.status === 200) {
      console.log(JSON.stringify(data));
      setIsLoading(true);
      console.table(data);

      localStorage.setItem(
        "data2",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          custom_ticket_id: selectedTicket._id,
          ticket_name: selectedTicket.name,
          ticket_amount: Number(selectedTicket.price),
          currency_type: selectedTicket.currency,
        })
      );

      localStorage.setItem(
        "data3",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          event_type: ticket.ticket_type,
        })
      );

      if (ticket.ticket_type === "free") {
        const data2 = {
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
        };
        const res = await checkoutFreeEvent(data2);
        if (res.status === 200) {
          const data3 = {
            participant_id: localStorage.getItem("participant_id"),
            event_id: eventId,
            event_type: ticket.ticket_type,
          };
          const resJoinFreeEvent = await joinEvent(data3);

          if (resJoinFreeEvent.status === 200) {
            // alert.show(resJoinFreeEvent.message);
            setIsLoading(false);
          } else {
            alert.show(res.message);
            setIsLoading(false);
          }
        } else {
          alert.show(res.message);
          setIsLoading(false);
        }
      } else {
        await createCheckOutSession();
      }
    } else if (
      respCheckOutMethod.status === 402 ||
      respCheckOutMethod.status === 403
    ) {
      alert.show(
        "Event not found! This event may be changed, modified or deleted by the event organizer. Please contact with your event organizer for details.",
        { type: "error" }
      );
    } else if (respCheckOutMethod.status === 404) {
      alert.show(
        "Invalid Ticket Payment Option! Please contact with your event organizer to provide a valid Ticket Payment Option!",
        { type: "error" }
      );
    } else {
      alert.show(respCheckOutMethod.message, { type: "error" });
    }
  };
  const onSubmitCheckoutFormPaidAttendeeLogin = async (data) => {
    const dataCheckOutMethod = {
      event_id: eventId,
    };
    const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
      dataCheckOutMethod
    );
    if (respCheckOutMethod.status === 200) {
      setIsLoading(true);
      console.table(data);

      localStorage.setItem(
        "data2",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          custom_ticket_id: selectedTicket._id,
          ticket_name: selectedTicket.name,
          ticket_amount: Number(selectedTicket.price),
          currency_type: selectedTicket.currency,
        })
      );

      localStorage.setItem(
        "data3",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          event_type: ticket.ticket_type,
        })
      );

      if (ticket.ticket_type === "free") {
        const data2 = {
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
        };
        const res = await checkoutFreeEvent(data2);
        if (res.status === 200) {
          const data3 = {
            participant_id: localStorage.getItem("participant_id"),
            event_id: eventId,
            event_type: ticket.ticket_type,
          };
          const resJoinFreeEvent = await joinEvent(data3);

          if (resJoinFreeEvent.status === 200) {
            // alert.show(resJoinFreeEvent.message);
            setIsLoading(false);
          } else {
            alert.show(res.message);
            setIsLoading(false);
          }
        } else {
          alert.show(res.message);
          setIsLoading(false);
        }
      } else {
        const result =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("result"))
            : null;
        const addEventParticipantData2 = {
          event_id: eventId,
          name: result.firstName + " " + result.lastName,
          email: result.email,
          isRSVP: false,
        };
        const res = await addEventParticipant(addEventParticipantData2);
        if (res.status === 200 || res.status === 203) {
          if (res.data.name && res.data.email && res.data._id) {
            localStorage.setItem("participant_name", res.data.name);
            localStorage.setItem("participant_email", res.data.email);
            localStorage.setItem("participant_id", res.data._id);
          }

          // router.push(`/attendees/singleevent/${eventId}`);
          alert.show(res.message);
          setIsLoading(false);
          // ========================================
          await createCheckOutSession();
        } else if (res.status === 201) {
          setUserAlreadyJoinedAndPaymentDoneMsg(res.message);

          alert.show(res.message);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } else if (
      respCheckOutMethod.status === 402 ||
      respCheckOutMethod.status === 403
    ) {
      alert.show(
        "Event not found! This event may be changed, modified or deleted by the event organizer. Please contact with your event organizer for details.",
        { type: "error" }
      );
    } else if (respCheckOutMethod.status === 404) {
      alert.show(
        "Invalid Ticket Payment Option! Please contact with your event organizer to provide a valid Ticket Payment Option!",
        { type: "error" }
      );
    } else {
      alert.show(respCheckOutMethod.message, { type: "error" });
    }
  };

  const {
    register: register3,
    formState: { errors: errors3 },
    handleSubmit: handleSubmit3,
  } = useForm({
    criteriaMode: "all",
  });

  const onSubmitCheckoutFormFree = async (data) => {
    console.log(JSON.stringify(data));
    setIsLoading(true);
    console.table(data);

    if (ticket.ticket_type === "free") {
      const data2 = {
        participant_id: localStorage.getItem("participant_id"),
        event_id: eventId,
      };
      const res = await checkoutFreeEvent(data2);
      if (res.status === 200) {
        const data3 = {
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          event_type: ticket.ticket_type,
        };
        const resJoinFreeEvent = await joinEvent(data3);

        if (resJoinFreeEvent.status === 200) {
          // alert.show(resJoinFreeEvent.message);
          setIsLoading(false);
          localStorage.setItem("isJoinSuccessful", true);
          localStorage.setItem("eventID", eventId);
          router.reload();
        } else {
          alert.show(res.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUserAlreadyJoinedAndPaymentDoneMsg(
          "You have already joined in this event"
        );
      }
    } else {
      localStorage.setItem(
        "data2",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          custom_ticket_id: selectedTicket._id,
          ticket_name: selectedTicket.name,
          ticket_amount: Number(selectedTicket.price),
          currency_type: selectedTicket.currency,
        })
      );

      localStorage.setItem(
        "data3",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          event_type: ticket.ticket_type,
        })
      );
      await createCheckOutSession();
    }
  };

  const onSubmitCheckoutFormFreeEventPage = async (data) => {
    console.log(JSON.stringify(data));
    setIsLoading(true);
    console.table(data);

    if (ticket.ticket_type === "free") {
      const dataEventParticipant = {
        event_id: eventId,
        name: firstName + " " + lastName,
        email: email,
        isRSVP: false,
      };
      const resAddEventParticipant = await addEventParticipant(
        dataEventParticipant
      );

      const data2 = {
        participant_id: resAddEventParticipant.data._id,
        event_id: eventId,
      };
      const res = await checkoutFreeEvent(data2);
      if (res.status === 200) {
        const data3 = {
          participant_id: resAddEventParticipant.data._id,
          event_id: eventId,
          event_type: ticket.ticket_type,
        };
        const resJoinFreeEvent = await joinEvent(data3);

        if (resJoinFreeEvent.status === 200) {
          // alert.show(resJoinFreeEvent.message);
          setIsLoading(false);
          localStorage.setItem("isJoinSuccessful", true);
          localStorage.setItem("eventID", eventId);
          router.reload();
        } else {
          alert.show(res.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUserAlreadyJoinedAndPaymentDoneMsg(
          "You have already joined in this event"
        );
      }
    } else {
      localStorage.setItem(
        "data2",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          custom_ticket_id: selectedTicket._id,
          ticket_name: selectedTicket.name,
          ticket_amount: Number(selectedTicket.price),
          currency_type: selectedTicket.currency,
        })
      );

      localStorage.setItem(
        "data3",
        JSON.stringify({
          participant_id: localStorage.getItem("participant_id"),
          event_id: eventId,
          event_type: ticket.ticket_type,
        })
      );
      await createCheckOutSession();
    }
  };
  // test stripe api start
  // const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  // const publishableKey = `${stripePublishableKey}`;
  // const stripePromise = loadStripe(publishableKey);
  // pk_test_51JqYRWDvuaShoGRhLUUBlr9BRgJITSeo71mvSuRvQkv2brJhcdoPciX1npXyGHvYwd1JtVD8KvfohDGDgcXSvgKa006s47wFPp
  const createCheckOutSession = async () => {
    setIsLoading(true);
    const dataCheckOutMethod = {
      event_id: eventId,
    };
    const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
      dataCheckOutMethod
    );
    if (respCheckOutMethod.status === 200) {
      const publishableKey = `${respCheckOutMethod.data.public_id}`;
      console.log("MY PUBLISHABLE KEY: " + publishableKey);
      const stripePromise = await loadStripe(publishableKey);

      const stripe = await stripePromise;
      const checkoutSession = await axios.post("/api/create-stripe-session", {
        item: {
          name: selectedTicket.name,
          description: name,
          image: `https://www.vapulus.com/en/wp-content/uploads/2018/12/online-payment-providers.png`,
          quantity: 1,
          price: selectedTicket.price,
          eventID: eventId,
          STRIPE_SECRET_KEY: respCheckOutMethod.data.secret_id,
          // ||"sk_test_51JqYRWDvuaShoGRhRbfb3Pb13XbyXiJ1r79NDLmhIJKTFgmdFOJQEg93XhnGlDceeaNooICQqOyrrQ85uIYoSvkK00JiBNJZ0z",
        },
      });

      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.session.id,
      });

      if (result.error) {
        alert.show(result.error.message);
      }
    }

    setIsLoading(false);
  };
  // test stripe api end

  const password = useRef({});
  password.current = watch("password", "");

  const isCreateAccountWithEventBy = useRef({});
  isCreateAccountWithEventBy.current = watch("isCreateAccountWithEventBy", "");

  const [signUpErrorMsg, setSignUpErrorMsg] = useState(null);

  const [isDisableNextPopUpWindow, setIsDisableNextPopUpWindow] = useState(
    true
  );

  const tempModal = "";
  const myButton = "myButton";

  const onSubmit = async (d) => {
    setIsLoading(true);
    console.table(d);
    const data = { ...data, ...d };
    setAuthValues(data);

    if (d.isCreateAccountWithEventBy) {
      localStorage.setItem("temp_email", d.email);

      const data2 = {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        password: d.password,
        last_visited_event: eventId,
      };
      const res = await signUpAttendee(data2);
      if (res.status === 200) {
        // alert.show(res.message);
        router.push("/attendees/verificationemail");
        setIsLoading(false);
      } else {
        alert.show(res.message);

        console.log("calling......");
        setSignUpErrorMsg(res.message);
        setIsLoading(false);
      }
    } else {
      const data2 = {
        event_id: eventId,
        name: d.firstName + " " + d.lastName,
        email: d.email,
        isRSVP: false,
      };
      const res = await addEventParticipant(data2);
      if (res.status === 200 || res.status === 203) {
        // // test code start
        // // data-bs-toggle={
        // //   isDisableNextPopUpWindow
        // //     ? ""
        // //     : isCreateAccountWithEventBy.current
        // //     ? ""
        // //     : "modal"
        // // }
        // // data-bs-target={
        // //   isDisableNextPopUpWindow
        // //     ? ""
        // //     : ticket?.ticket_type === "free"
        // //     ? "#checkout-modal-free"
        // //     : "#checkout-modal-paid"
        // // }
        // setIsDisableNextPopUpWindow(false);
        // const myElement = document.getElementById("submitButton");
        // console.log("Result: ");
        // console.log(myElement);
        // myElement.setAttribute("data-bs-toggle", "modal");
        // myElement.setAttribute("data-bs-target", "#checkout-modal-paid");
        // myElement.click();
        // // test code end
        setIsDisableNextPopUpWindow(false);
        if (res.data.name && res.data.email && res.data._id) {
          localStorage.setItem("isSignUpWithoutEventBy", true);
          localStorage.setItem("participant_name", res.data.name);
          localStorage.setItem("participant_email", res.data.email);
          localStorage.setItem("participant_id", res.data._id);
        }

        // router.push(`/attendees/singleevent/${eventId}`);
        // alert.show("My custom alert");
        const tempClicker = document.getElementById(myButton);
        tempClicker.click();
        //alert.show(res.message);
        alert.show("Success! Checking payment info...");
        setIsLoading(false);
      } else if (res.status === 201) {
        setUserAlreadyJoinedAndPaymentDoneMsg(res.message);
        setIsDisableNextPopUpWindow(true);
        alert.show(res.message);
        setIsLoading(false);
      } else {
        // alert.show(res.message);
        setIsDisableNextPopUpWindow(true);
        setSignUpErrorMsg(res.message);
        setIsLoading(false);
      }
    }
  };

  // show / hide password start
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };
  // show / hide password end

  // show / hide confirmPassword start
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown);
  };
  // show / hide confirmPassword end

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);

  const [isJoinSuccessful, setIsJoinSuccessful] = useState(false);

  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(false);

  useEffect(() => {
    if (data.token && data.result.role === "organizer") {
      setIsOrganizerLoggedIn(true);
    }
    if (new Date(start_date).getTime() < new Date().getTime()) {
      setIsButtonDisabled(true);
    }

    setIsSignUpWithoutEventBy(localStorage.getItem("isSignUpWithoutEventBy"));

    if (localStorage.getItem("eventID") === eventId) {
      setIsJoinSuccessful(localStorage.getItem("isJoinSuccessful"));
    }

    // if participant log in else user log in
    if (localStorage.getItem("isSignUpWithoutEventBy")) {
      const participant_name =
        typeof window !== "undefined"
          ? localStorage.getItem("participant_name")
          : null;
      const participant_email =
        typeof window !== "undefined"
          ? localStorage.getItem("participant_email")
          : null;

      console.log("participant_name: " + participant_name);

      const fullName = participant_name.split(" ");

      setFirstName(fullName[0]);
      setLastName(fullName[1]);
      setEmail(participant_email);
    }
    if (localStorage.getItem("result")) {
      const result =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("result"))
          : null;

      setFirstName(result.firstName);
      setLastName(result.lastName);
      setEmail(result.email);
    }
  }, []);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleTicketChange = (e) => {
    let x = JSON.parse(e.target.value);
    setSelectedTicket(x);
  };

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

  const redirectToGoogleMapsPage = () => {
    document.location.href = `http://maps.google.com?q=${event_lat},${event_long}`;
  };
  return (
    <>
      <div className="header">
        <div className="header-image position-relative">
          <div className="position-relative">
            <Image
              src={
                eventBannerImg
                  ? URL.createObjectURL(eventBannerImg)
                  : `/img/event_preview_banner_image.jpg`
              }
              alt="me"
              width={1300}
              height={500}
              className="w-100 d-block border-radius-10"
            />
            <div className="top-btn">
              {event_type === "online" && (
                <button className="btn rounded-pill btn-secondary text-white">
                  Online Event
                </button>
              )}
            </div>

            {event_type === "online" && (
              <div
                className="md-6 d-flex align-items-center time position-absolute border-radius-10 bg-dark"
                bg="dark"
              >
                <TimeCounter count={new Date(start_date) - Date.now()} />
              </div>
            )}
            {event_type === "hybrid" && (
              <div
                className="md-6 d-flex align-items-center time position-absolute border-radius-10 bg-dark"
                bg="dark"
              >
                <TimeCounter count={new Date(start_date) - Date.now()} />
              </div>
            )}
          </div>
          <span className="search position-absolute border-radius-10 text-white text-center d-flex align-items-center justify-content-center cursor-pointer">
            <img
              src={`${NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${organizerProfilePicture}/image`}
              className="border-radius-10"
              height="100"
              width="100"
            />
          </span>
        </div>
        <div className="header-content bg-white border-radius-10">
          <div className="event-container py-5">
            <Row>
              <div className="col-sm-9">
                <div className="mb-2">
                  <h1>{name}</h1>
                  <div className="text-gray-1 font-18 d-flex flex-column">
                    <div className="d-flex flex-wrap pt-3">
                      <span className="me-4 py-2">
                        <i className="ri-calendar-check-line  me-2" />
                        {format(new Date(start_date), "MMMM dd, yyyy")}
                      </span>
                      <span className="py-2">
                        <i className="ri-time-line me-2" />
                        {format(new Date(start_date), "p")} to{" "}
                        {format(new Date(end_date), "p")}
                      </span>
                    </div>
                    {event_type === "physical" && (
                      <span className="py-2">
                        <i className="ri-map-pin-line  me-2" />
                        {event_address_line1.trim() &&
                          `${event_address_line1},`}{" "}
                        {event_address_line2.trim() &&
                          `${event_address_line2},`}{" "}
                        {event_location.trim() && `${event_location},`}{" "}
                        {event_state.trim() && `${event_state},`}{" "}
                        {event_city_town.trim() && `${event_city_town},`}{" "}
                        {event_postal_code.trim() && `${event_postal_code},`}{" "}
                        {event_country.trim() && `${event_country}`}
                      </span>
                    )}
                    {event_type === "hybrid" && (
                      <span className="py-2">
                        <i className="ri-map-pin-line  me-2" />
                        {event_address_line1.trim() &&
                          `${event_address_line1},`}{" "}
                        {event_address_line2.trim() &&
                          `${event_address_line2},`}{" "}
                        {event_location.trim() && `${event_location},`}{" "}
                        {event_state.trim() && `${event_state},`}{" "}
                        {event_city_town.trim() && `${event_city_town},`}{" "}
                        {event_postal_code.trim() && `${event_postal_code},`}{" "}
                        {event_country.trim() && `${event_country}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* CONDITIONAL BUTTON START******************************************************************************* */}
              <div className="col-sm-3">
                {isJoinSuccessful ? (
                  <span
                    style={{
                      color: "#006a11",
                      backgroundColor: "#b9ffc9",
                      paddingRight: "0.6rem",
                      paddingLeft: "0.6rem",
                      borderRadius: "6.25rem",
                      display: "inline-block",
                      padding: ".25em .4em",
                      fontWeight: "700",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      verticalAlign: "baseline",
                      height: "30px",
                    }}
                  >
                    Payment Complete
                  </span>
                ) : (
                  <div className="d-flex flex-column">
                    {event_type === "online" && ticket?.ticket_type === "free" && (
                      <button
                        className="btn btn-primary mt-2"
                        data-bs-toggle="modal"
                        data-bs-target={
                          data.token && data.result.role === "attendee"
                            ? "#checkout-modal-free-event-page"
                            : "#signup-modal"
                        }
                        disabled={isButtonDisabled}
                      >
                        {/* Make A RSVP */}
                        <i className="ri-coupon-2-line" /> Join For Free
                      </button>
                    )}
                    {event_type === "physical" &&
                      ticket?.ticket_type === "free" && (
                        <button
                          className="btn btn-primary mt-2"
                          data-bs-toggle="modal"
                          data-bs-target={
                            data.token && data.result.role === "attendee"
                              ? "#checkout-modal-free-event-page"
                              : "#signup-modal"
                          }
                          disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line" /> Join For Free
                        </button>
                      )}
                    {event_type === "hybrid" && ticket?.ticket_type === "free" && (
                      <>
                        <button
                          className="btn btn-primary mt-2 font-weight-400"
                          data-bs-toggle="modal"
                          data-bs-target={
                            data.token && data.result.role === "attendee"
                              ? "#checkout-modal-free-event-page"
                              : "#signup-modal"
                          }
                          //disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line  me-2" /> Book For
                          Online Event
                        </button>
                        <button
                          className="btn btn-secondary text-white mt-2 font-weight-400"
                          data-bs-toggle="modal"
                          data-bs-target={
                            data.token && data.result.role === "attendee"
                              ? "#checkout-modal-2"
                              : "#signup-modal"
                          }
                          disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line me-2" /> Book For
                          Physical Event
                        </button>
                      </>
                    )}

                    {/*CONDITIONAL  PAID EVENT START */}

                    {event_type === "online" &&
                      ticket?.ticket_type === "paid" &&
                      !isOrganizerLoggedIn && (
                        <button
                          className="btn btn-primary mt-2"
                          data-bs-toggle="modal"
                          data-bs-target={
                            (data.token && data.result.role === "attendee") ||
                            isSignUpWithoutEventBy
                              ? "#checkout-modal-attendee-login-paid"
                              : "#signup-modal"
                          }
                          disabled={isButtonDisabled}
                        >
                          {/* Make A RSVP  */}
                          <i className="ri-coupon-2-line" /> Book A Ticket
                        </button>
                      )}
                    {event_type === "online" &&
                      ticket?.ticket_type === "paid" &&
                      isOrganizerLoggedIn && (
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() =>
                            router.push(`/organizer/eventattendees/${eventId}`)
                          }
                          disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line" /> Make a RSVP
                        </button>
                      )}
                    {event_type === "physical" &&
                      ticket?.ticket_type === "paid" &&
                      !isOrganizerLoggedIn && (
                        <button
                          className="btn btn-primary mt-2"
                          data-bs-toggle="modal"
                          data-bs-target={
                            data.token && data.result.role === "attendee"
                              ? "#checkout-modal-attendee-login-paid"
                              : "#signup-modal"
                          }
                          disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line" /> Book A Ticket
                        </button>
                      )}
                    {event_type === "physical" &&
                      ticket?.ticket_type === "paid" &&
                      isOrganizerLoggedIn && (
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() =>
                            router.push(`/organizer/eventattendees/${eventId}`)
                          }
                          disabled={isButtonDisabled}
                        >
                          <i className="ri-coupon-2-line" /> Make a RSVP
                        </button>
                      )}
                    {event_type === "hybrid" &&
                      ticket?.ticket_type === "paid" &&
                      !isOrganizerLoggedIn && (
                        <>
                          <button
                            className="btn btn-primary mt-2"
                            data-bs-toggle="modal"
                            data-bs-target={
                              data.token && data.result.role === "attendee"
                                ? "#checkout-modal-attendee-login-paid"
                                : "#signup-modal"
                            }
                            disabled={isButtonDisabled}
                          >
                            <i className="ri-coupon-2-line" /> Book for Online
                            Event
                          </button>
                          <button
                            className="btn btn-secondary text-white mt-2"
                            data-bs-toggle="modal"
                            data-bs-target={
                              data.token && data.result.role === "attendee"
                                ? "#checkout-modal-2"
                                : "#signup-modal"
                            }
                            disabled={isButtonDisabled}
                          >
                            <i className="ri-coupon-2-line" /> Book for Physical
                            Event
                          </button>
                        </>
                      )}
                    {event_type === "hybrid" &&
                      ticket?.ticket_type === "paid" &&
                      isOrganizerLoggedIn && (
                        <>
                          <button
                            className="btn btn-primary mt-2"
                            onClick={() =>
                              router.push(
                                `/organizer/eventattendees/${eventId}`
                              )
                            }
                            disabled={isButtonDisabled}
                          >
                            <i className="ri-coupon-2-line" /> Make a RSVP
                          </button>
                          <button
                            class="btn btn-outline-primary mt-2 light-btn"
                            // disabled={isButtonDisabled}
                            onClick={redirectToGoogleMapsPage}
                          >
                            <i class="ri-map-2-line me-2"></i>
                            View On Map
                          </button>
                        </>
                      )}
                    {event_type === "physical" && (
                      <button
                        class="btn btn-outline-primary mt-2 light-btn"
                        // disabled={isButtonDisabled}
                        onClick={redirectToGoogleMapsPage}
                      >
                        <i class="ri-map-2-line me-2"></i>
                        View On Map
                      </button>
                    )}
                  </div>
                )}

                {/*CONDITIONAL  PAID EVENT END */}
              </div>
              {/* CONDITIONAL BUTTON END******************************************************************************* */}
            </Row>
          </div>
        </div>

        {/* checkout-modal-free START*/}
        <div
          className="modal fade checkout-modal"
          id="checkout-modal-free"
          tabIndex={-1}
          aria-labelledby="checkout-label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-radius-10">
              <div>
                <div className="row">
                  <div className="col p-30 px-50">
                    <div className="font-18 mb-4 font-weight-700">Checkout</div>
                    <span style={{ color: "green", fontSize: "13px" }}>
                      {userAlreadyJoinedAndPaymentDoneMsg}
                    </span>
                    <br />
                    <form onSubmit={handleSubmit3(onSubmitCheckoutFormFree)}>
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

                              {data.firstName && (
                                <input
                                  type="text"
                                  {...register3("firstName", {
                                    // required: "This is required.",
                                  })}
                                  className="form-control"
                                  placeholder="First Name"
                                  defaultValue={data.firstName}
                                  readOnly
                                />
                              )}
                            </div>
                            <ErrorMessage
                              errors={errors3}
                              name="firstName"
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            />
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
                              {data.lastName && (
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register3("lastName", {
                                    // required: "This is required.",
                                  })}
                                  placeholder="Last Name"
                                  defaultValue={data.lastName}
                                  readOnly
                                />
                              )}
                            </div>
                            <ErrorMessage
                              errors={errors3}
                              name="lastName"
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            />
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
                          {data.email && (
                            <input
                              type="text"
                              {...register3("email", {
                                // required: "This is required.",
                                // pattern: {
                                //   value:
                                //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                //   message: "Please enter a valid email",
                                // },
                              })}
                              className="form-control"
                              placeholder="Enter Email ID"
                              defaultValue={data.email}
                              readOnly
                            />
                          )}
                        </div>
                        <ErrorMessage
                          errors={errors3}
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
                      </div>
                      <div className="mb-3 notification_panel my-4">
                        <div className="choice">
                          <input
                            id="n3"
                            type="checkbox"
                            className="me-2 form-check-input"
                            {...register3("iAgreeTerms&PrivacyPolicy", {
                              required: "This is required.",
                            })}
                          />
                          <label
                            htmlFor="check2"
                            style={{ lineHeight: "25px" }}
                          >
                            I agree to the <a href>Terms</a> and
                            <a> Privacy Policy</a>
                          </label>
                        </div>
                        <ErrorMessage
                          errors={errors3}
                          name="iAgreeTerms&PrivacyPolicy"
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
                      <button
                        type="submit"
                        className="btn btn-primary mb-3"
                        disabled={isLoading}
                      >
                        Place Order
                      </button>
                    </form>
                  </div>
                  <div className="col bg-light p-50 attendees">
                    <div className="upcoming-events">
                      <div className="col">
                        <div className="event">
                          <div className="image">
                            <Image
                              src={
                                eventBannerImg
                                  ? URL.createObjectURL(eventBannerImg)
                                  : `/img/event_preview_banner_image.jpg`
                              }
                              alt="me"
                              width={1300}
                              height={500}
                              className="border-radius-10 w-100"
                            />
                            {event_type !== "physical" && (
                              <div className="time-counter-br-tr">
                                <TimeCounter
                                  count={new Date(start_date) - Date.now()}
                                />
                              </div>
                            )}
                          </div>
                          <div className="event-content bg-white border-radius-10 p-30">
                            <div className="pt-30 d-flex justify-content-between">
                              <span>
                                <i className="ri-calendar-check-line text-gray-2" />
                                <span className="font-12 text-gray-1">
                                  {format(
                                    new Date(start_date),
                                    "MMMM dd, yyyy"
                                  )}
                                </span>
                              </span>
                            </div>
                            <h6 className="font-18 font-weight-700">{name}</h6>
                            <span className="text-gray-2 font-14">
                              By:{" "}
                              <span className="text-dark">{organizerName}</span>{" "}
                              {event_type !== "online" && (
                                <>
                                  <i className="ri-map-pin-line ms-2 " />{" "}
                                  {event_address_line1 &&
                                    `${event_address_line1},`}{" "}
                                  {event_address_line2 &&
                                    `${event_address_line2},`}{" "}
                                  {event_location && `${event_location},`}{" "}
                                  {event_state && `${event_state},`}{" "}
                                  {event_city_town && `${event_city_town},`}{" "}
                                  {event_postal_code && `${event_postal_code},`}{" "}
                                  {event_country && `${event_country}`}
                                </>
                              )}
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
        {/* checkout-modal-free END*/}
        {/* checkout-modal-free-event-page  start*/}
        <div
          className="modal fade checkout-modal"
          id="checkout-modal-free-event-page"
          tabIndex={-1}
          aria-labelledby="checkout-label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-radius-10">
              <div>
                <div className="row">
                  <div className="col p-30 px-50">
                    <div className="font-18 mb-4 font-weight-700">Checkout</div>
                    <span style={{ color: "green", fontSize: "13px" }}>
                      {userAlreadyJoinedAndPaymentDoneMsg}
                    </span>
                    <br />
                    <form
                      onSubmit={handleSubmit3(
                        onSubmitCheckoutFormFreeEventPage
                      )}
                    >
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

                              {firstName && (
                                <input
                                  type="text"
                                  {...register3("firstName", {
                                    // required: "This is required.",
                                  })}
                                  className="form-control"
                                  placeholder="First Name"
                                  defaultValue={firstName}
                                  readOnly
                                />
                              )}
                            </div>
                            <ErrorMessage
                              errors={errors3}
                              name="firstName"
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            />
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
                              {lastName && (
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register3("lastName", {
                                    // required: "This is required.",
                                  })}
                                  placeholder="Last Name"
                                  defaultValue={lastName}
                                  readOnly
                                />
                              )}
                            </div>
                            <ErrorMessage
                              errors={errors3}
                              name="lastName"
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            />
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
                          {email && (
                            <input
                              type="text"
                              {...register3("email", {
                                // required: "This is required.",
                                // pattern: {
                                //   value:
                                //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                //   message: "Please enter a valid email",
                                // },
                              })}
                              className="form-control"
                              placeholder="Enter Email ID"
                              defaultValue={email}
                              readOnly
                            />
                          )}
                        </div>
                        <ErrorMessage
                          errors={errors3}
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
                      </div>
                      <div className="mb-3 notification_panel my-4">
                        <div className="choice">
                          <input
                            id="n3"
                            type="checkbox"
                            className="me-2 form-check-input"
                            {...register3("iAgreeTerms&PrivacyPolicy", {
                              required: "This is required.",
                            })}
                          />
                          <label
                            htmlFor="check2"
                            style={{ lineHeight: "25px" }}
                          >
                            I agree to the <a href>Terms</a> and
                            <a> Privacy Policy</a>
                          </label>
                        </div>
                        <ErrorMessage
                          errors={errors3}
                          name="iAgreeTerms&PrivacyPolicy"
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
                      <button
                        type="submit"
                        className="btn btn-primary mb-3"
                        disabled={isLoading}
                      >
                        Place Order
                      </button>
                    </form>
                  </div>
                  <div className="col bg-light p-50 attendees">
                    <div className="upcoming-events">
                      <div className="col">
                        <div className="event">
                          <div className="image">
                            <Image
                              src={
                                eventBannerImg
                                  ? URL.createObjectURL(eventBannerImg)
                                  : `/img/event_preview_banner_image.jpg`
                              }
                              alt="me"
                              width={1300}
                              height={500}
                              className="border-radius-10 w-100"
                            />
                            {event_type !== "physical" && (
                              <div className="time-counter-br-tr">
                                <TimeCounter
                                  count={new Date(start_date) - Date.now()}
                                />
                              </div>
                            )}
                          </div>
                          <div className="event-content bg-white border-radius-10 p-30">
                            <div className="pt-30 d-flex justify-content-between">
                              <span>
                                <i className="ri-calendar-check-line text-gray-2" />
                                <span className="font-12 text-gray-1">
                                  {format(
                                    new Date(start_date),
                                    "MMMM dd, yyyy"
                                  )}
                                </span>
                              </span>
                            </div>
                            <h6 className="font-18 font-weight-700">{name}</h6>
                            <span className="text-gray-2 font-14">
                              By:{" "}
                              <span className="text-dark">{organizerName}</span>{" "}
                              {event_type !== "online" && (
                                <>
                                  <i className="ri-map-pin-line ms-2 " />{" "}
                                  {event_address_line1 &&
                                    `${event_address_line1},`}{" "}
                                  {event_address_line2 &&
                                    `${event_address_line2},`}{" "}
                                  {event_location && `${event_location},`}{" "}
                                  {event_state && `${event_state},`}{" "}
                                  {event_city_town && `${event_city_town},`}{" "}
                                  {event_postal_code && `${event_postal_code},`}{" "}
                                  {event_country && `${event_country}`}
                                </>
                              )}
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

        {/* checkout-modal-free-event-page  end*/}

        {/* Checkout Modal attendee login PAID START*/}
        <div
          className="modal fade checkout-modal"
          id="checkout-modal-attendee-login-paid"
          tabIndex={-1}
          aria-labelledby="checkout-label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-radius-10">
              <div className>
                <div className="row">
                  <div className="col p-30 px-50">
                    <div className="font-18 mb-4 font-weight-700">
                      <span style={{ color: "green", fontSize: "13px" }}>
                        {userAlreadyJoinedAndPaymentDoneMsg}
                      </span>
                      <br />
                      Checkout
                    </div>

                    <form
                      onSubmit={handleSubmit2(
                        onSubmitCheckoutFormPaidAttendeeLogin
                      )}
                    >
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
                              {firstName && (
                                <input
                                  type="text"
                                  {...register2("firstName", {
                                    // required: "This is required.",
                                  })}
                                  className="form-control"
                                  placeholder="First Name"
                                  defaultValue={firstName}
                                  readOnly
                                />
                              )}
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
                              {lastName && (
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register2("lastName", {
                                    // required: "This is required.",
                                  })}
                                  placeholder="Last Name"
                                  defaultValue={lastName}
                                  readOnly
                                />
                              )}
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
                          {email && (
                            <input
                              type="text"
                              {...register2("email", {
                                // required: "This is required.",
                                // pattern: {
                                //   value:
                                //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                //   message: "Please enter a valid email",
                                // },
                              })}
                              className="form-control"
                              placeholder="Enter Email ID"
                              defaultValue={email}
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                      <h6 className="font-18 mt-4">Event Tickets</h6>
                      <select
                        required
                        className="form-control form-select"
                        name="currency"
                        onChange={handleTicketChange}
                      >
                        <option value="" selected disabled>
                          Select Ticket
                        </option>
                        {ticket?.custom_ticket &&
                          ticket?.custom_ticket.map((item, index) => {
                            return (
                              <option value={JSON.stringify(item)} key={index}>
                                {item.name} [{item.price} {item.currency}]
                              </option>
                            );
                          })}
                      </select>
                      <div>
                        <h6 className="font-18 mt-4">Payment Method</h6>
                        <div className="row payment-setting">
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
                                <span className="tik-icon">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            {/* <div className="checkbox">
                              <input type="checkbox" hidden id="paypal" />
                              <label
                                htmlFor="paypal"
                                className="d-flex align-items-center"
                              >
                                <span>
                                  <img src="/img/paypal.svg" />
                                </span>
                                <span className="tik-icon">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 notification_panel my-4">
                        <div className="choice">
                          <input
                            id="n3"
                            type="checkbox"
                            className="me-2 form-check-input"
                            {...register2("iAgreeTerms&PrivacyPolicy", {
                              required: "This is required.",
                            })}
                          />
                          <label htmlFor="check2" className="text-gray-1">
                            I agree to the <a href="#">Terms</a> and
                            <a href="#"> Privacy Policy</a>
                          </label>
                        </div>
                        <ErrorMessage
                          errors={errors2}
                          name="iAgreeTerms&PrivacyPolicy"
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
                      <button
                        type="submit"
                        className="btn btn-primary mb-3"
                        disabled={isLoading}
                      >
                        Place Order
                      </button>
                    </form>
                  </div>
                  <div className="col bg-light p-50 attendees">
                    <div className="upcoming-events">
                      <div className="col">
                        <div className="event">
                          <div className="image">
                            <Image
                              src={
                                eventBannerImg
                                  ? URL.createObjectURL(eventBannerImg)
                                  : `/img/event_preview_banner_image.jpg`
                              }
                              alt="me"
                              width={1300}
                              height={500}
                              className="border-radius-10 w-100"
                            />
                            {event_type !== "physical" && (
                              <div className="time-counter-br-tr">
                                <TimeCounter
                                  count={new Date(start_date) - Date.now()}
                                />
                              </div>
                            )}
                          </div>
                          <div className="event-content bg-white border-radius-10 p-30">
                            <div className="pt-30 d-flex justify-content-between">
                              <span className>
                                <i className="ri-calendar-check-line text-gray-2" />
                                <span className="font-12 text-gray-1">
                                  {format(
                                    new Date(start_date),
                                    "MMMM dd, yyyy"
                                  )}
                                </span>
                              </span>
                            </div>
                            <h6 className="font-18 font-weight-700">{name}</h6>
                            <span className="text-gray-2 font-14">
                              By:{" "}
                              <span className="text-dark">{organizerName}</span>{" "}
                              {event_type !== "online" && (
                                <>
                                  <i className="ri-map-pin-line ms-2 " />{" "}
                                  {event_address_line1 &&
                                    `${event_address_line1},`}{" "}
                                  {event_address_line2 &&
                                    `${event_address_line2},`}{" "}
                                  {event_location && `${event_location},`}{" "}
                                  {event_state && `${event_state},`}{" "}
                                  {event_city_town && `${event_city_town},`}{" "}
                                  {event_postal_code && `${event_postal_code},`}{" "}
                                  {event_country && `${event_country}`}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-18 mt-5 mb-4">Order Summary</h6>
                      <table>
                        <tbody>
                          <tr>
                            <td>{selectedTicket && selectedTicket.name}</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr>
                            <td>Subtotal</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                          <tr>
                            <td>Fees</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] + "0.00"}
                            </td>
                          </tr>
                          <tr>
                            <td>Delivery</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] + "0.00"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr className="font-20">
                            <td>Total</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Checkout Modal attendee login PAID END*/}

        {/* SignUp Modal Start */}
        <div
          className="modal fade"
          id="signup-modal"
          tabIndex={-1}
          aria-labelledby="register-for-event-label"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content border-radius-10">
              <div className="modal-body p-30">
                <div className="font-18 mb-4 font-weight-700">
                  <span style={{ color: "green", fontSize: "13px" }}>
                    {userAlreadyJoinedAndPaymentDoneMsg}
                  </span>
                  <br />
                  {isRSVP ? "RSVP" : "Register For Event"}
                </div>
                <form>
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
                            {...register("firstName", {
                              required: "This is required.",
                            })}
                            className="form-control"
                            placeholder="First Name"
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
                            {...register("lastName", {
                              required: "This is required.",
                            })}
                            placeholder="Last Name"
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
                        {...register("email", {
                          required: "This is required.",
                          pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please enter a valid email",
                          },
                        })}
                        className="form-control"
                        placeholder="Enter Email ID"
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
                  </div>
                  <div className="mb-3 notification_panel">
                    <div className="choice">
                      <input
                        id="n3"
                        type="checkbox"
                        className="me-2 form-check-input"
                        {...register("isCreateAccountWithEventBy")}
                      />
                      <label htmlFor="n3" className="text-gray-1">
                        Create an account with EventBy
                      </label>
                    </div>
                  </div>
                  {isCreateAccountWithEventBy.current && (
                    <>
                      <div className="mb-3">
                        <label htmlFor>Enter Password*</label>
                        <div className="input-group password">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="ri-lock-line" />
                            </span>
                          </div>
                          <input
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
                                  v.length > 8 ||
                                  "Your password must be at least 8 characters.",
                              },
                            })}
                            className="form-control"
                            placeholder="Enter Password"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i
                                className={
                                  isPasswordShown
                                    ? "ri-eye-line"
                                    : "ri-eye-off-line"
                                }
                                onClick={togglePasswordVisibility}
                              />
                            </span>
                          </div>
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
                        <span className="text-gray-2 font-13">
                          Use 8 or more characters with a mix of letters,
                          numbers &amp; symbols
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
                            type={isConfirmPasswordShown ? "text" : "password"}
                            {...register("confirmPassword", {
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
                                isCurrentPasswordAndConfirmPasswordSame: (v) =>
                                  v === password.current ||
                                  "Password and Confirm password does not match",
                              },
                            })}
                            className="form-control"
                            placeholder="Confirm Password"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i
                                className={
                                  isConfirmPasswordShown
                                    ? "ri-eye-line"
                                    : "ri-eye-off-line"
                                }
                                onClick={toggleConfirmPasswordVisibility}
                              />
                            </span>
                          </div>
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name="confirmPassword"
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
                    </>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    className="btn btn-primary w-100 mb-3"
                    data-bs-toggle={
                      isDisableNextPopUpWindow
                        ? ""
                        : isCreateAccountWithEventBy.current
                        ? ""
                        : "modal"
                    }
                    data-bs-target={
                      isDisableNextPopUpWindow
                        ? ""
                        : ticket?.ticket_type === "free"
                        ? "#checkout-modal-free"
                        : "#checkout-modal-paid"
                    }
                  >
                    {isCreateAccountWithEventBy.current
                      ? "Sign-Up"
                      : "Join Event"}
                  </button>

                  <button
                    id={myButton}
                    type="button"
                    data-bs-toggle={
                      isDisableNextPopUpWindow
                        ? ""
                        : isCreateAccountWithEventBy.current
                        ? ""
                        : "modal"
                    }
                    data-bs-target={
                      isDisableNextPopUpWindow
                        ? ""
                        : ticket?.ticket_type === "free"
                        ? "#checkout-modal-free"
                        : "#checkout-modal-paid"
                    }
                    onClick={() => console.log("working")}
                    hidden
                  >
                    Click me
                  </button>

                  <div className="mb-3 text-gray-2">
                    Already have an account on EventBy? Please{" "}
                    <a href="/attendees/login">Log In</a>
                  </div>
                  <span
                    style={{
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    {signUpErrorMsg && signUpErrorMsg}
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* SignUp Modal End */}

        {/* NEW CODE FOR SIGNUP -> PAID EVENT START */}
        <div
          className="modal fade checkout-modal"
          id="checkout-modal-paid"
          tabIndex={-1}
          aria-labelledby="checkout-label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-radius-10">
              <div className>
                <div className="row">
                  <div className="col p-30 px-50">
                    <div className="font-18 mb-4 font-weight-700">Checkout</div>

                    <form onSubmit={handleSubmit2(onSubmitCheckoutFormPaid)}>
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
                              {data.firstName && (
                                <input
                                  type="text"
                                  {...register2("firstName", {
                                    // required: "This is required.",
                                  })}
                                  className="form-control"
                                  placeholder="First Name"
                                  defaultValue={data.firstName}
                                  readOnly
                                />
                              )}
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
                              {data.lastName && (
                                <input
                                  type="text"
                                  className="form-control"
                                  {...register2("lastName", {
                                    // required: "This is required.",
                                  })}
                                  placeholder="Last Name"
                                  defaultValue={data.lastName}
                                  readOnly
                                />
                              )}
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
                          {data.email && (
                            <input
                              type="text"
                              {...register2("email", {
                                // required: "This is required.",
                                // pattern: {
                                //   value:
                                //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                //   message: "Please enter a valid email",
                                // },
                              })}
                              className="form-control"
                              placeholder="Enter Email ID"
                              defaultValue={data.email}
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                      <h6 className="font-18 mt-4">Event Tickets</h6>
                      <select
                        required
                        className="form-control form-select"
                        name="currency"
                        onChange={handleTicketChange}
                      >
                        <option value="" selected disabled>
                          Select Ticket
                        </option>
                        {ticket?.custom_ticket &&
                          ticket?.custom_ticket.map((item, index) => {
                            return (
                              <option value={JSON.stringify(item)} key={index}>
                                {item.name} [{item.price} {item.currency}]
                              </option>
                            );
                          })}
                      </select>
                      <div>
                        <h6 className="font-18 mt-4">Payment Method</h6>
                        <div className="row payment-setting">
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
                                <span className="tik-icon">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            {/* <div className="checkbox">
                              <input type="checkbox" hidden id="paypal" />
                              <label
                                htmlFor="paypal"
                                className="d-flex align-items-center"
                              >
                                <span>
                                  <img src="/img/paypal.svg" />
                                </span>
                                <span className="tik-icon">
                                  <i className="ri-check-line" />
                                </span>
                              </label>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 notification_panel my-4">
                        <div className="choice">
                          <input
                            id="n3"
                            type="checkbox"
                            className="me-2 form-check-input"
                            {...register2("iAgreeTerms&PrivacyPolicy", {
                              required: "This is required.",
                            })}
                          />
                          <label htmlFor="check2" className="text-gray-1">
                            I agree to the <a href="#">Terms</a> and
                            <a href="#"> Privacy Policy</a>
                          </label>
                        </div>
                        <ErrorMessage
                          errors={errors2}
                          name="iAgreeTerms&PrivacyPolicy"
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
                      <button
                        type="submit"
                        className="btn btn-primary mb-3"
                        disabled={isLoading}
                      >
                        Place Order
                      </button>
                    </form>
                  </div>
                  <div className="col bg-light p-50 attendees">
                    <div className="upcoming-events">
                      <div className="col">
                        <div className="event">
                          <div className="image">
                            <Image
                              src={
                                eventBannerImg
                                  ? URL.createObjectURL(eventBannerImg)
                                  : `/img/event_preview_banner_image.jpg`
                              }
                              alt="me"
                              width={1300}
                              height={500}
                              className="border-radius-10 w-100"
                            />
                            {event_type !== "physical" && (
                              <div className="time-counter-br-tr">
                                <TimeCounter
                                  count={new Date(start_date) - Date.now()}
                                />
                              </div>
                            )}
                          </div>
                          <div className="event-content bg-white border-radius-10 p-30">
                            <div className="pt-30 d-flex justify-content-between">
                              <span className>
                                <i className="ri-calendar-check-line text-gray-2" />
                                <span className="font-12 text-gray-1">
                                  {format(
                                    new Date(start_date),
                                    "MMMM dd, yyyy"
                                  )}
                                </span>
                              </span>
                            </div>
                            <h6 className="font-18 font-weight-700">{name}</h6>
                            <span className="text-gray-2 font-14">
                              By:{" "}
                              <span className="text-dark">{organizerName}</span>{" "}
                              {event_type !== "online" && (
                                <>
                                  <i className="ri-map-pin-line ms-2 " />{" "}
                                  {event_address_line1 &&
                                    `${event_address_line1},`}{" "}
                                  {event_address_line2 &&
                                    `${event_address_line2},`}{" "}
                                  {event_location && `${event_location},`}{" "}
                                  {event_state && `${event_state},`}{" "}
                                  {event_city_town && `${event_city_town},`}{" "}
                                  {event_postal_code && `${event_postal_code},`}{" "}
                                  {event_country && `${event_country}`}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-18 mt-5 mb-4">Order Summary</h6>
                      <table>
                        <tbody>
                          <tr>
                            <td>{selectedTicket && selectedTicket.name}</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr>
                            <td>Subtotal</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                          <tr>
                            <td>Fees</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] + "0.00"}
                            </td>
                          </tr>
                          <tr>
                            <td>Delivery</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] + "0.00"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <hr />
                      <table>
                        <tbody>
                          <tr className="font-20">
                            <td>Total</td>
                            <td>
                              {selectedTicket &&
                                selectedTicket.currency[0] +
                                  selectedTicket.price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* NEW CODE FOR SIGNUP -> PAID EVENT END*/}
      </div>
    </>
  );
}

export default EventHeader;
