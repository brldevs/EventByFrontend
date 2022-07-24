import $ from "jquery";
import React, { useState, useEffect } from "react";
import { format, compareAsc } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import axios from "axios";
import {
  getAllPackage,
  subscribeUser,
  checkUserSubscription,
  changeSubscription,
  stripeCheckoutSession,
} from "../../../services/service";
import { useAlert } from "react-alert";
import { ALERT_MESSAGE_AT_LEAST_ONE_PACKAGE_SUBSCRIPTION } from "../../../constants";
function Subscription() {
  const [isPackageUpdated, setIsPackageUpdated] = useState(false);
  const alert = useAlert();

  const [packages, setPackages] = useState([]);

  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({});

  const [subscriptionErrorMessage, setSubscriptionErrorMessage] =
    useState(null);
  const [packageValidity, setPackageValidity] = useState(null);
  const [packageStatus, setPackageStatus] = useState(null);
  const router = useRouter();
  const { session_id } = router.query;
  useEffect(async () => {
    console.log("router.query");
    console.log(router.query);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const PackageId =
      typeof window !== "undefined" ? localStorage.getItem("PackageId") : null;

    const subscriptionErrorMessage =
      typeof window !== "undefined"
        ? localStorage.getItem("SubscriptionErrorMessage")
        : null;

    if (PackageId) {
      const data = {
        package_id: PackageId,
      };
      if (session_id) {
        console.log("session_id :" + session_id);
        const res = await stripeCheckoutSession(
          session_id,
          `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
        );
        const payment_id = res.data.payment_intent;
        if (payment_id) {
          // PAYMENT SUCCESS
          console.log("payment_id :" + payment_id);
          if (subscriptionErrorMessage) {
            // CREATE
            const response = await subscribeUser(data, token);
            if (response.status === 200) {
              setIsPackageUpdated(true);
              alert.show(response.message, { type: "success" });
            } else {
              alert.show(response.message, { type: "error" });
            }
          } else {
            // UPDATE
            const response = await changeSubscription(data, token);
            if (response.status === 200) {
              setIsPackageUpdated(true);
              alert.show(response.message, { type: "success" });
            } else {
              alert.show(response.message, { type: "error" });
            }
          }
          router.push("/organizer/accountsetting/subscription");
        }
      }
    }
  }, [session_id]);
  useEffect(async () => {
    setIsPackageUpdated(false);
    setSubscriptionErrorMessage(null);
    localStorage.removeItem("SubscriptionErrorMessage");
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

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const PackageId =
      typeof window !== "undefined" ? localStorage.getItem("PackageId") : null;

    const responseUserSubscription = await checkUserSubscription(token);

    if (responseUserSubscription.status === 200) {
      setCurrentSubscriptionPlan(responseUserSubscription.data);
      setPackageValidity(responseUserSubscription.package_validity);
      setPackageStatus(responseUserSubscription.package_status);
    } else if (responseUserSubscription.status === 202) {
      alert.show(responseUserSubscription.message, { type: "error" });
      setSubscriptionErrorMessage(responseUserSubscription.message);
      localStorage.setItem(
        "SubscriptionErrorMessage",
        responseUserSubscription.message
      );
      // if (!PackageId) {
      //   alert.show(responseUserSubscription.message, { type: "error" });
      //   setSubscriptionErrorMessage(responseUserSubscription.message);
      //   localStorage.setItem(
      //     "SubscriptionErrorMessage",
      //     responseUserSubscription.message
      //   );
      // }
    } else {
      alert.show(responseUserSubscription.message, { type: "error" });
    }

    const res = await getAllPackage();
    if (res.status === 200) {
      setPackages(res.data);
    } else {
      alert.show(res.message, { type: "error" });
    }
  }, [isPackageUpdated]);

  const updatePackageHandler = async (packageId, packageName, packagePrice) => {
    console.log("Package Id: " + packageId);
    localStorage.setItem("PackageId", packageId);

    await createCheckOutSession(packageId, packageName, packagePrice);
  };

  // test stripe api start
  // const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  // const publishableKey = `${stripePublishableKey}`;
  // const stripePromise = loadStripe(publishableKey);
  // pk_test_51JqYRWDvuaShoGRhLUUBlr9BRgJITSeo71mvSuRvQkv2brJhcdoPciX1npXyGHvYwd1JtVD8KvfohDGDgcXSvgKa006s47wFPp
  const createCheckOutSession = async (
    packageId,
    packageName,
    packagePrice
  ) => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    console.log("MY PUBLISHABLE KEY: " + publishableKey);
    console.log("MY SECRET KEY: " + process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
    const stripePromise = await loadStripe(publishableKey);

    const stripe = await stripePromise;
    const checkoutSession = await axios.post(
      "/api/create-stripe-session-subscription",
      {
        // item: {
        //   name: currentSubscriptionPlan.package_name,
        //   image: `https://www.vapulus.com/en/wp-content/uploads/2018/12/online-payment-providers.png`,
        //   price: currentSubscriptionPlan.package_price,
        //   STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        // },
        item: {
          name: packageName,
          image: `https://www.vapulus.com/en/wp-content/uploads/2018/12/online-payment-providers.png`,
          price: packagePrice,
          STRIPE_SECRET_KEY: `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`,
        },
      }
    );

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.session.id,
    });

    if (result.error) {
      alert.show(result.error.message);
    }
  };
  // test stripe api end

  return (
    <>
      <div className="bg-white border-radius-10">
        <div className="text-end px-50 py-50 pb-0">
          {/* <button className="btn btn-secondary text-white">Save Changes</button> */}
        </div>
        <div className="dashboard_event_container pb-5">
          <h2 className="text-center">Organizer Subscriptions</h2>
          <p className="text-gray-2 text-center mb-5">
            View Your EventBy Subscription Plans At A Quick Glance
          </p>
          <div className="subscription_plan ">
            {!subscriptionErrorMessage && (
              <div className="border border-radius-10  p-50">
                <h5 className="font-24">Your Current Subscription Plan</h5>
                <div className="plan ">
                  <table className="table m-0">
                    <tbody>
                      <tr>
                        <th>Subscription Plan</th>
                        <th>Status</th>
                        <th>Bill</th>
                        <th>Renewal Date</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <td>
                          {currentSubscriptionPlan.package_name &&
                            currentSubscriptionPlan.package_name}
                        </td>
                        <td>{packageStatus && packageStatus}</td>
                        <td>
                          {currentSubscriptionPlan.package_price &&
                            `$ ${currentSubscriptionPlan.package_price}`}
                        </td>
                        <td>
                          {packageValidity &&
                            format(new Date(packageValidity), "MMMM dd, yyyy")}
                        </td>
                        <td>
                          <a className="text-primary">Cancel</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subscriptionErrorMessage && (
              <div className="single-event bg-warning p-4 border-radius-10">
                {subscriptionErrorMessage && (
                  <span>{ALERT_MESSAGE_AT_LEAST_ONE_PACKAGE_SUBSCRIPTION}</span>
                )}
              </div>
            )}

            <div className="border border-radius-10 mt-5 p-50">
              <h5 className="font-24">Upgrade Plans</h5>
              <span className="text-gray-2">
                Want to upgrade to EventBy Subscription Plans?{" "}
                <a>Learn how to do them from here!</a>
              </span>
              <div className="package">
                <div className="row row-cols-1 row-cols-md-2 gx-4 mt-3">
                  {packages.length > 0 &&
                    packages.map((item, index) => {
                      return (
                        <div className="col" key={index}>
                          <div className="package-item p-30 border-radius-10">
                            <div className="title font-20">
                              {item.package_name}
                            </div>
                            <div className="details font-14 text-gray-1">
                              <span className="me-5">Billed Monthly</span>
                              <span>
                                $
                                <span className="font-24 font-weight-700">
                                  {item.package_price}
                                </span>
                                /monthly
                              </span>
                            </div>
                            <a
                              className="btn btn-primary font-weight-500 mt-3"
                              onClick={() =>
                                updatePackageHandler(
                                  item._id,
                                  item.package_name,
                                  item.package_price
                                )
                              }
                            >
                              Upgrade
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Subscription.layout = "AccountSetting";
export default Subscription;
