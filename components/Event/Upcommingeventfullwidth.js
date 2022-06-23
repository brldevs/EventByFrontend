import Image from "next/image";
import { format, compareAsc } from "date-fns";
import React, { useRef, useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Link from "next/link";
import {
  checkoutFreeEvent,
  checkoutPaidEvent,
  joinEvent,
  stripeCheckoutSession,
  addEventParticipant,
  getDefaultCheckoutMethodByEvent,
} from "../../services/service";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import TimeCounter from "./TimeCounter";

function UpcommingEventFullWidth({
  eventData,
  eventBannerImg,
  organizer,
  eventID,
  participantID,
}) {
  console.log("eventData: " + JSON.stringify(eventData));
  const { name, start_date, end_date, event_type, ticket } = eventData;
  const {
    event_location,
    event_address_line1,
    event_address_line2,
    event_city_town,
    event_state,
    event_postal_code,
    event_country,
  } = eventData.event_type_details;

  const alert = useAlert();
  const router = useRouter();
  const { session_id } = router.query;
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
    const dataCheckOutMethod = {
      event_id: eventID,
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
          participant_id: participantID,
          event_id: eventID,
          custom_ticket_id: selectedTicket._id,
          ticket_name: selectedTicket.name,
          ticket_amount: Number(selectedTicket.price),
          currency_type: selectedTicket.currency,
        })
      );

      localStorage.setItem(
        "data3",
        JSON.stringify({
          participant_id: participantID,
          event_id: eventID,
          event_type: ticket.ticket_type,
        })
      );

      if (ticket.ticket_type === "free") {
        const data2 = {
          participant_id: participantID,
          event_id: eventID,
        };
        const res = await checkoutFreeEvent(data2);
        if (res.status === 200) {
          const data3 = {
            participant_id: participantID,
            event_id: eventID,
            event_type: ticket.ticket_type,
          };
          const resJoinFreeEvent = await joinEvent(data3);

          if (resJoinFreeEvent.status === 200) {
            alert.show(resJoinFreeEvent.message);
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

  // test stripe api start
  // const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  // const stripePromise = loadStripe(publishableKey);

  const createCheckOutSession = async () => {
    setIsLoading(true);
    const dataCheckOutMethod = {
      event_id: eventID,
    };
    const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
      dataCheckOutMethod
    );
    if (respCheckOutMethod.status === 200) {
      const publishableKey = `${respCheckOutMethod.data.public_id}`;
      console.log("MY PUBLISHABLE KEY2: " + publishableKey);
      const stripePromise = await loadStripe(publishableKey);

      const stripe = await stripePromise;
      const checkoutSession = await axios.post("/api/create-stripe-session", {
        item: {
          name: selectedTicket.name,
          description: name,
          image: `https://www.vapulus.com/en/wp-content/uploads/2018/12/online-payment-providers.png`,
          quantity: 1,
          price: selectedTicket.price,
          eventID,
          STRIPE_SECRET_KEY: respCheckOutMethod.data.secret_id,
          // || "sk_test_51JqYRWDvuaShoGRhRbfb3Pb13XbyXiJ1r79NDLmhIJKTFgmdFOJQEg93XhnGlDceeaNooICQqOyrrQ85uIYoSvkK00JiBNJZ0z",
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

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);

  const [isJoinSuccessful, setIsJoinSuccessful] = useState(false);

  useEffect(async () => {
    // it is calling from http://localhost:3000/attendees/ page
    // IF LAST VISITED EVENT  EXISTS THEN IT IS COME FROM EVENT PAGE

    if (localStorage.getItem("result")) {
      const result =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("result"))
          : null;

      setFirstName(result.firstName);
      setLastName(result.lastName);
      setEmail(result.email);

      const data2 = {
        event_id: eventID,
        name: result.firstName + " " + result.lastName,
        email: result.email,
        isRSVP: false,
      };

      const resAddEventParticipant = await addEventParticipant(data2);

      if (
        (resAddEventParticipant.status === 203 ||
          resAddEventParticipant.status === 201) &&
        resAddEventParticipant.joined_event &&
        resAddEventParticipant.bought_ticket
      ) {
        setIsJoinSuccessful(resAddEventParticipant.joined_event);
        localStorage.setItem(
          "isJoinSuccessful",
          resAddEventParticipant.joined_event
        );
      }

      if (session_id && !isJoinSuccessful) {
        const dataCheckOutMethod = {
          event_id: eventID,
        };
        const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
          dataCheckOutMethod
        );
        const secret_id = `${respCheckOutMethod.data.secret_id}`;

        const res = await stripeCheckoutSession(session_id, secret_id);

        const payment_id = res.data.payment_intent;

        if (payment_id && !resAddEventParticipant.joined_event) {
          const data2 = JSON.parse(localStorage.getItem("data2"));

          const checkoutPaidEventData = {
            ...data2,
            payment_id,
            participant_id: resAddEventParticipant.data._id,
          };
          const res = await checkoutPaidEvent(checkoutPaidEventData);

          if (res.status === 203 || res.status === 201) {
            setIsJoinSuccessful(true);
            localStorage.setItem("isJoinSuccessful", true);
          }
          if (res.status === 200) {
            const data3 = JSON.parse(localStorage.getItem("data3"));

            const resJoinFreeEvent = await joinEvent({
              ...data3,
              participant_id: resAddEventParticipant.data._id,
            });

            if (resJoinFreeEvent.status === 200) {
              alert.show(resJoinFreeEvent.message);
              setIsJoinSuccessful(true);
              localStorage.setItem("isJoinSuccessful", true);
              setIsLoading(false);
            } else {
              alert.show(res.message);
              setIsLoading(false);
            }
          }
        }
      }
    } else {
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

      const data2 = {
        event_id: eventID,
        name: localStorage.getItem("participant_name"),
        email: localStorage.getItem("participant_email"),
        isRSVP: false,
      };

      const res = await addEventParticipant(data2);

      if (
        (res.status === 203 || res.status === 201) &&
        res.joined_event &&
        res.bought_ticket
      ) {
        setIsJoinSuccessful(res.joined_event);
        localStorage.setItem("isJoinSuccessful", res.joined_event);
      }

      if (session_id && !isJoinSuccessful) {
        const dataCheckOutMethod = {
          event_id: eventID,
        };
        const respCheckOutMethod = await getDefaultCheckoutMethodByEvent(
          dataCheckOutMethod
        );
        const secret_id = `${respCheckOutMethod.data.secret_id}`;
        const res = await stripeCheckoutSession(session_id, secret_id);

        const payment_id = res.data.payment_intent;

        if (payment_id) {
          const data2 = JSON.parse(localStorage.getItem("data2"));
          const checkoutPaidEventData = {
            ...data2,
            payment_id,
          };
          const res = await checkoutPaidEvent(checkoutPaidEventData);
          if (res.status === 200) {
            const data3 = JSON.parse(localStorage.getItem("data3"));

            const resJoinFreeEvent = await joinEvent(data3);

            if (resJoinFreeEvent.status === 200) {
              alert.show(resJoinFreeEvent.message);
              setIsJoinSuccessful(true);
              localStorage.setItem("isJoinSuccessful", true);
              setIsLoading(false);
            } else {
              alert.show(res.message);
              setIsLoading(false);
            }
          }
        }
      }
    }
  }, [session_id]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleTicketChange = (e) => {
    let x = JSON.parse(e.target.value);
    setSelectedTicket(x);
  };

  return (
    <>
      <div className="single-event bg-white p-20 border-radius-10">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex align-items-center flex-wrap">
              <div className="image">
                <Image
                  src={
                    eventBannerImg
                      ? URL.createObjectURL(eventBannerImg)
                      : `/img/event_preview_banner_image.jpg`
                  }
                  alt="event_preview_banner_image"
                  width={130}
                  height={130}
                  className="border-radius-10"
                />
                <span className="online-btn">{event_type}</span>
              </div>
              <div className="event-content mw-470">
                <span className="font-12">
                  <i className="ri-calendar-check-line text-gray-2 me-2" />{" "}
                  {format(new Date(start_date), "MMMM dd, yyyy")}
                </span>
                <h6 className="font-24 my-1">{name}</h6>
                <span className="text-gray-2">
                  By:{" "}
                  <span className="text-dark">
                    {organizer.firstName} {organizer.lastName}
                  </span>{" "}
                  {event_type !== "online" && (
                    <>
                      , {event_address_line1 && `${event_address_line1},`}{" "}
                      {event_address_line2 && `${event_address_line2},`}{" "}
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
          <div className="col-md-4">
            <div className="d-flex h-100 justify-content-between align-items-center">
              <div>
                {isJoinSuccessful ? (
                  <span
                    className="badge"
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Join Successful
                  </span>
                ) : (
                  <>
                    <span className="badge badge-danger">
                      Payment Incomplete
                    </span>
                    <span className="text-gray-2 font-14 d-block">
                      Complete payment to book your ticket
                    </span>
                  </>
                )}
              </div>
              <div className="dropdown custom">
                <i
                  className="ri-more-2-fill"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <Link href={`/event/${eventID}`}>
                      <a className="dropdown-item">
                        <span>View Event</span>
                        <span className="icon">
                          <i className="ri-check-line" />
                        </span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    {!isJoinSuccessful && (
                      <a
                        className="dropdown-item"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target={
                          ticket.ticket_type === "free"
                            ? "#checkout-modal-free"
                            : "#checkout-modal-paid"
                        }
                      >
                        <span>Checkout</span>
                        <span className="icon">
                          <i className="ri-check-line" />
                        </span>
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                                {...register("firstName", {
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
                            errors={errors}
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
                                {...register("lastName", {
                                  // required: "This is required.",
                                })}
                                placeholder="Last Name"
                                defaultValue={lastName}
                                readOnly
                              />
                            )}
                          </div>
                          <ErrorMessage
                            errors={errors}
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
                            {...register("email", {
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
                    <div className="mb-3 notification_panel my-4">
                      <div className="choice">
                        <input
                          id="n3"
                          type="checkbox"
                          className="me-2 form-check-input"
                          {...register("iAgreeTerms&PrivacyPolicy", {
                            required: "This is required.",
                          })}
                        />
                        <label htmlFor="check2" style={{ lineHeight: "25px" }}>
                          I agree to the <a href>Terms</a> and
                          <a href>Privacy Policy</a>
                        </label>
                      </div>
                      <ErrorMessage
                        errors={errors}
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
                            <TimeCounter
                              count={new Date(start_date) - Date.now()}
                            />
                          )}
                        </div>
                        <div className="event-content bg-white border-radius-10 p-30">
                          <div className="pt-30 d-flex justify-content-between">
                            <span className>
                              <i className="ri-calendar-check-line text-gray-2" />
                              <span className="font-12 text-gray-1">
                                {format(new Date(start_date), "MMMM dd, yyyy")}
                              </span>
                            </span>
                          </div>
                          <h6 className="font-18 font-weight-700">{name}</h6>
                          <span className="text-gray-2 font-14">
                            By:{" "}
                            <span className="text-dark font-weight-700">,</span>{" "}
                            <i className="ri-map-pin-line ms-2 " />{" "}
                            {event_address_line1 && `${event_address_line1},`}{" "}
                            {event_address_line2 && `${event_address_line2},`}{" "}
                            {event_location && `${event_location},`}{" "}
                            {event_state && `${event_state},`}{" "}
                            {event_city_town && `${event_city_town},`}{" "}
                            {event_postal_code && `${event_postal_code},`}{" "}
                            {event_country && `${event_country}`}
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

      {/* checkout-modal-paid START*/}
      <div
        className="modal fade checkout-modal"
        id="checkout-modal-paid"
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
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                                {...register("firstName", {
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
                            errors={errors}
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
                                {...register("lastName", {
                                  // required: "This is required.",
                                })}
                                placeholder="Last Name"
                                defaultValue={lastName}
                                readOnly
                              />
                            )}
                          </div>
                          <ErrorMessage
                            errors={errors}
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
                            {...register("email", {
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
                      {ticket.custom_ticket &&
                        ticket.custom_ticket.map((item, index) => {
                          return (
                            <option value={JSON.stringify(item)} key={index}>
                              {item.name} [{item.price}
                              {item.currency}]
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
                              <span className="tik-icon d-none">
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
                          {...register("iAgreeTerms&PrivacyPolicy", {
                            required: "This is required.",
                          })}
                        />
                        <label htmlFor="check2" style={{ lineHeight: "25px" }}>
                          I agree to the <a href="#">Terms</a> and
                          <a href="#">Privacy Policy</a>
                        </label>
                      </div>
                      <ErrorMessage
                        errors={errors}
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
                                {format(new Date(start_date), "MMMM dd, yyyy")}
                              </span>
                            </span>
                          </div>
                          <h6 className="font-18 font-weight-700">{name}</h6>
                          <span className="text-gray-2 font-14">
                            By:{" "}
                            <span className="text-dark font-weight-700">
                              {organizer.firstName} {organizer.lastName}
                            </span>{" "}
                            {event_type !== "online" && (
                              <>
                                , <i className="ri-map-pin-line ms-2 " />{" "}
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
                              selectedTicket.currency[0] + selectedTicket.price}
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
                              selectedTicket.currency[0] + selectedTicket.price}
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
                              selectedTicket.currency[0] + selectedTicket.price}
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
      {/* checkout-modal-paid END*/}
    </>
  );
}

export default UpcommingEventFullWidth;
