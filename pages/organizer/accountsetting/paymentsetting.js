import React, { useState, useEffect } from "react";
import {
  getUserCheckoutMethods,
  saveCheckoutMethod,
  updateCheckoutMethod,
  setDefaultCheckoutMethod,
  getDefaultCheckoutMethod,
} from "../../../services/service";
import { useAlert } from "react-alert";
import $ from "jquery";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import { Row, Form, Button, Col } from "react-bootstrap";
import {
  ALERT_MESSAGE_PAYMENT_INFORMATION_SAVE_SUCCESS,
  ALERT_MESSAGE_PAYMENT_METHOD_EXISTS,
  ALERT_MESSAGE_PAYMENT_NOT_SETUP,
} from "../../../constants";
function Paymentsetting() {
  const alert = useAlert();

  const [checkoutMethodData, setCheckoutMethodData] = useState([]);

  const [publicId, setPublicId] = useState(null);
  const [secretId, setSecretId] = useState(null);

  const [token, setToken] = useState(null);

  const [checkOutId, setCheckOutId] = useState(null);
  useEffect(async () => {
    setCheckOutId(null);
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

    setToken(token);

    const res = await getDefaultCheckoutMethod(token);

    if (res.status === 404) {
      alert.show(
        <div style={{ textTransform: "none" }}>
          {ALERT_MESSAGE_PAYMENT_NOT_SETUP}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      const response = await getUserCheckoutMethods(token);
      if (response.status === 200) {
        setCheckoutMethodData(response.data);
        if (response.data.length > 0) {
          setPublicId(res.data.public_id);
          setSecretId(res.data.secret_id);
          setCheckOutId(response.data[0]._id);
        }
      } else if (response.status === 404) {
        alert.show(
          <div style={{ textTransform: "none" }}>
            {ALERT_MESSAGE_PAYMENT_NOT_SETUP}
          </div>,
          {
            type: "error",
          }
        );
      } else {
        alert.show(response.message, { type: "error" });
      }
    }
  }, []);

  const savePaymentSetting = async () => {
    //before save check checkout id exist or not start
    const res = await getDefaultCheckoutMethod(token);

    if (res.status !== 404) {
      const response = await getUserCheckoutMethods(token);
      if (response.status === 200) {
        setCheckoutMethodData(response.data);
        if (response.data.length > 0) {
          setPublicId(res.data.public_id);
          setSecretId(res.data.secret_id);
          setCheckOutId(response.data[0]._id);
        }
      }
    }
    //before save check checkout id exist or not end

    if (publicId && secretId) {
      console.log("SUBMIT: " + publicId + " = " + secretId);

      if (checkOutId) {
        const data = {
          checkout_id: checkOutId,
          payment_type: "stripe",
          public_id: publicId,
          secret_id: secretId,
        };
        const response = await updateCheckoutMethod(data, token);
        if (response.status === 200) {
          alert.show("Updated Successfully!", { type: "success" });
        } else {
          alert.show(response.message, { type: "error" });
        }
      } else {
        const data = {
          payment_type: "stripe",
          public_id: publicId,
          secret_id: secretId,
        };
        const response = await saveCheckoutMethod(data, token);
        if (response.status === 200) {
          alert.show(
            <div style={{ textTransform: "none" }}>
              {ALERT_MESSAGE_PAYMENT_INFORMATION_SAVE_SUCCESS}
            </div>,
            {
              type: "success",
            }
          );

          const data = {
            checkout_id: response.data._id,
          };

          await setDefaultCheckoutMethod(data, token);
        } else {
          alert.show(response.message, { type: "error" });
        }
      }
    }
  };

  const onChangePublicIdHandler = (e) => {
    setPublicId(e.target.value);
  };
  const onChangeSecretIdHandler = (e) => {
    setSecretId(e.target.value);
  };

  // show / hide Client ID start
  const [isClientIdShown, setIsClientIdShown] = useState(false);

  const toggleClientIdVisibility = () => {
    setIsClientIdShown(!isClientIdShown);
  };
  // show / hide Client ID end

  // show / hide Client Secret start
  const [isClientSecretShown, setIsClientSecretShown] = useState(false);

  const toggleClientSecretVisibility = () => {
    setIsClientSecretShown(!isClientSecretShown);
  };
  // show / hide Client ID end
  return (
    <>
      <div className="bg-white border-radius-10">
        {/* <div className="text-end px-50 py-50 pb-0">
          <button
            className="btn btn-secondary text-white"
            onClick={savePaymentSetting}
          >
            Save Changes
          </button>
        </div> */}
        <div className="dashboard_event_container px-4 pb-5">
          <h2 className="text-center">Payment Settings</h2>
          <p className="text-gray-2 text-center mb-5">
            Connect your EventBy account to your preferred payment gateways
          </p>
          {/* <div className="payment-setting p-50 border border-radius-10">
            <h6 className="font-24">Add Credit/Debit Card Information</h6>
            <div className="text-gray-2">
              Add your card details and collect your payouts for events
            </div>
            <div className="row mt-4 gy-4">
              <div className="col-md-6">
                <label htmlFor>Card Type*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-bank-card-line" />
                    </span>
                  </div>
                  <select className="form-control form-select">
                    <option>Master Card</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor>Card Number*</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ri-bank-card-line" />
                    </span>
                  </div>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor>Expiration Date*</label>
                <div className="row">
                  <div className="col">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-bank-card-line" />
                        </span>
                      </div>
                      <select className="form-control form-select">
                        <option value>Month</option>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ri-bank-card-line" />
                        </span>
                      </div>
                      <select className="form-control form-select">
                        <option>Year</option>
                        <option>2021</option>
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor style={{ visibility: "hidden" }}>
                  CCV/CVV
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">CCV/CVV</span>
                  </div>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>
          </div> */}

          <div className="payment-setting p-50 mt-5 border border-radius-10">
            <h6 className="font-24">Ticket Payment Option</h6>
            <div className="text-gray-2">
              Or, select a payment gateway through which your event attendees
              can pay for tickets
            </div>
            <div className="row mt-4 row-cols-1 row-cols-md-3">
              <div className="col">
                <div className="checkbox">
                  <input type="checkbox" hidden id="stripe" />
                  <label htmlFor="stripe" className="d-flex align-items-center">
                    <span>
                      <img src="/img/stripe.svg" />
                    </span>
                    <span className="tik-icon">
                      <i className="ri-check-line text-white" />
                    </span>
                  </label>
                </div>
              </div>

              {/* <div className="col">
                <div className="checkbox">
                  <input type="checkbox" hidden id="paypal" />
                  <label htmlFor="paypal" className="d-flex align-items-center">
                    <span>
                      <img src="/img/paypal.svg" />
                    </span>
                    <span className="tik-icon d-none">
                      <i className="ri-check-line" />
                    </span>
                  </label>
                </div>
              </div> */}
              {/* <div className="col">
                <div className="checkbox">
                  <input type="checkbox" hidden id="stripe" />
                  <label htmlFor="stripe" className="d-flex align-items-center">
                    <span>
                      <img src="/img/stripe.svg" />
                    </span>
                    <span className="tik-icon d-none">
                      <i className="ri-check-line" />
                    </span>
                  </label>
                </div>
              </div> */}
              {/* <div className="col">
                <div className="checkbox">
                  <input type="checkbox" hidden id="offline" />
                  <label
                    htmlFor="offline"
                    className="d-flex align-items-center"
                  >
                    <span className="font-24 text">Offline Payment</span>
                    <span className="tik-icon d-none">
                      <i className="ri-check-line" />
                    </span>
                  </label>
                </div>
              </div> */}
            </div>
            <form action className="mt-3">
              <div className="row row-cols-1 row-cols-md-2">
                <div className="col">
                  <label htmlFor>Publishable key</label>
                  {/* <input
                    type="password"
                    className="form-control"
                    onChange={(e) => onChangePublicIdHandler(e)}
                    defaultValue={publicId || ""}
                  /> */}
                  <div className="input-group password">
                    <input
                      className="form-control ps-4"
                      type={isClientIdShown ? "text" : "password"}
                      onChange={(e) => onChangePublicIdHandler(e)}
                      defaultValue={publicId || ""}
                    />
                    <FromAppendPrepend
                      prepend="true"
                      icon={isClientIdShown ? "ri-eye-line" : "ri-eye-off-line"}
                      onClick={toggleClientIdVisibility}
                    />
                  </div>
                </div>

                <div className="col">
                  <label htmlFor>Secret key</label>
                  {/* <input
                    type="password"
                    className="form-control"
                    onChange={(e) => onChangeSecretIdHandler(e)}
                    defaultValue={secretId || ""}
                  /> */}
                  <div className="input-group password">
                    <input
                      className="form-control ps-4"
                      type={isClientSecretShown ? "text" : "password"}
                      onChange={(e) => onChangeSecretIdHandler(e)}
                      defaultValue={secretId || ""}
                    />
                    <FromAppendPrepend
                      prepend="true"
                      icon={
                        isClientSecretShown ? "ri-eye-line" : "ri-eye-off-line"
                      }
                      onClick={toggleClientSecretVisibility}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="text-end px-50 py-50 pb-50">
          <button
            className="btn btn-secondary text-white"
            onClick={savePaymentSetting}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
Paymentsetting.layout = "AccountSetting";
export default Paymentsetting;
