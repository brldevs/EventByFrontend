import { ErrorMessage } from "@hookform/error-message";
import $ from "jquery";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "react-alert";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FromAppendPrepend from "../../../components/utils/FromAppendPrepend";
import { useAuthData } from "../../../context/auth";
import { changePassword, logOut } from "../../../services/service";
import {
  ALERT_MESSAGE_CAN_NOT_USE_PREVIOUS_PASSWORD,
  ALERT_MESSAGE_UPDATE_PASSWORD_SUCCESS,
  ALERT_MESSAGE_INCORRECT_CURRENT_PASSWORD,
} from "../../../constants";
function PasswordChange() {
  const router = useRouter();
  const alert = useAlert();
  const { data, setAuthValues, removeAuthValues } = useAuthData();

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

  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  const onSubmit = async (data) => {
    console.table(data);

    const res = await changePassword(data, token);
    if (res.status === 200) {
      alert.show(
        <div style={{ textTransform: "none" }}>
          {ALERT_MESSAGE_UPDATE_PASSWORD_SUCCESS}
        </div>,
        {
          type: "success",
        }
      );

      // logOut();
      // removeAuthValues();
      // router.push("/attendees/login");
    } else if (res.status === 205) {
      alert.show(
        <div style={{ textTransform: "none" }}>
          {ALERT_MESSAGE_CAN_NOT_USE_PREVIOUS_PASSWORD}
        </div>,
        {
          type: "error",
        }
      );
    } else if (
      res.status === 401 &&
      res.message === "Check current password. Password doesn't match!"
    ) {
      alert.show(
        <div style={{ textTransform: "none" }}>
          {ALERT_MESSAGE_INCORRECT_CURRENT_PASSWORD}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      alert.show(res.message);
    }
  };

  const [token, setToken] = useState("");

  useEffect(async () => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      router.replace("/attendees/login");
    }
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  // show / hide current password start
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown);
  };
  // show / hide current password end

  // show / hide change password start
  const [isChangePasswordShown, setIsChangePasswordShown] = useState(false);

  const toggleChangePasswordVisibility = () => {
    setIsChangePasswordShown(!isChangePasswordShown);
  };
  // show / hide change password end

  // show / hide confirm password start
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown);
  };
  // show / hide confirm password end

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

  return (
    <>
      <div className="content_area flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white border-radius-10">
            <div className="dashboard_event_container mw-470 pb-5">
              <h2 className="text-center">Passwords</h2>
              <p className="text-gray-2 text-center mb-5">
                Set up or change your EventBy profile password here with ease
              </p>
              <div className="row mt-4 row-cols-1">
                <div className="col">
                  <div className="mb-3">
                    <Form.Group className="mb-1">
                      <label htmlFor>Current Password*</label>
                      <div className="input-group password">
                        <FromAppendPrepend icon="ri-lock-line" />
                        <Form.Control
                          type={isCurrentPasswordShown ? "text" : "password"}
                          {...register("currentPassword", {
                            required: "This is required.",
                            validate: {
                              validatePassword: (v) =>
                                (v.search(/[a-zA-z]/) > -1 &&
                                  v.match(/[0-9]/) > 0 &&
                                  v.search(/[@$!%*#?&]/) > -1 &&
                                  v.length > 7) ||
                                "Your password must contain at least one letter, one digit, one special character and password length must be at least 8 characters",
                            },
                          })}
                          placeholder="Current Password"
                        />
                        <FromAppendPrepend
                          prepend="true"
                          icon={
                            isCurrentPasswordShown
                              ? "ri-eye-line"
                              : "ri-eye-off-line"
                          }
                          onClick={toggleCurrentPasswordVisibility}
                        />
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="currentPassword"
                        render={({ messages }) =>
                          messages &&
                          Object.entries(messages).map(([type, message]) => (
                            <p key={type} style={{ color: "red" }}>
                              {message}
                            </p>
                          ))
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <Form.Group className="mb-1">
                      <label htmlFor>Change Password*</label>
                      <div className="input-group password">
                        <FromAppendPrepend icon="ri-lock-line" />
                        <Form.Control
                          type={isChangePasswordShown ? "text" : "password"}
                          {...register("newPassword", {
                            required: "This is required.",
                            validate: {
                              validatePassword: (v) =>
                                (v.search(/[a-zA-z]/) > -1 &&
                                  v.match(/[0-9]/) > 0 &&
                                  v.search(/[@$!%*#?&]/) > -1 &&
                                  v.length > 7) ||
                                "Your password must contain at least one letter, one digit, one special character and password length must be at least 8 characters",
                            },
                          })}
                          placeholder="Change Password"
                        />
                        <FromAppendPrepend
                          prepend="true"
                          icon={
                            isChangePasswordShown
                              ? "ri-eye-line"
                              : "ri-eye-off-line"
                          }
                          onClick={toggleChangePasswordVisibility}
                        />
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="newPassword"
                        render={({ messages }) =>
                          messages &&
                          Object.entries(messages).map(([type, message]) => (
                            <p key={type} style={{ color: "red" }}>
                              {message}
                            </p>
                          ))
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <Form.Group className="mb-1">
                      <label htmlFor>Confirm Password*</label>
                      <div className="input-group password">
                        <FromAppendPrepend icon="ri-lock-line" />
                        <Form.Control
                          type={isConfirmPasswordShown ? "text" : "password"}
                          {...register("repeatPassword", {
                            required: "This is required.",
                            validate: {
                              validatePassword: (v) =>
                                (v.search(/[a-zA-z]/) > -1 &&
                                  v.match(/[0-9]/) > 0 &&
                                  v.search(/[@$!%*#?&]/) > -1 &&
                                  v.length > 7 &&
                                  v === newPassword.current) ||
                                "Your password must contain at least one letter, one digit, one special character and password length must be at least 8 characters and Change Password and Confirm password should be same",
                            },
                          })}
                          placeholder="Confirm Password"
                        />
                        <FromAppendPrepend
                          prepend="true"
                          icon={
                            isConfirmPasswordShown
                              ? "ri-eye-line"
                              : "ri-eye-off-line"
                          }
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="repeatPassword"
                        render={({ messages }) =>
                          messages &&
                          Object.entries(messages).map(([type, message]) => (
                            <p key={type} style={{ color: "red" }}>
                              {message}
                            </p>
                          ))
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-end px-50 py-50 pb-50">
              <button type="submit" className="btn btn-secondary text-white">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
PasswordChange.layout = "AttendeesDashboard";
export default PasswordChange;
