import React, { useEffect } from "react";
import $ from "jquery";

function BillingDetails() {
  useEffect(async () => {
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
  }, []);
  return (
    <>
      <div className="bg-white mt-4  border-radius-10">
        <div className="text-end px-50 py-50 pb-0">
          <button className="btn btn-secondary text-white">Save Changes</button>
        </div>
        <div className="dashboard_event_container pb-5">
          <h2 className="text-center">Billing Details</h2>
          <p className="text-gray-2 text-center mb-5">
            Keep a track of your billing details - everything from credit card
            details to dues
          </p>
          <div className="subscription_plan">
            <div className="border border-radius-10  p-50">
              <h5 className="font-24">Credit/Debit Card Details</h5>
              <div className="row row-cols-1 row-cols-md-2 gy-2">
                <div className="col">
                  <label htmlFor>Account Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mark Adam"
                  />
                </div>
                <div className="col">
                  <label htmlFor>Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="*******************3254"
                  />
                </div>
              </div>
            </div>
            <div className="border border-radius-10 mt-4 p-50">
              <h5 className="font-24">Your Billing Address Details</h5>
              <div className="row row-cols-1 row-cols-md-2 gy-2">
                <div className="col">
                  <label htmlFor>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                  />
                </div>
                <div className="col">
                  <label htmlFor>City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                  />
                </div>
                <div className="col">
                  <label htmlFor>State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State"
                  />
                </div>
                <div className="col">
                  <label htmlFor>Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Zip Code"
                  />
                </div>
                <div className="col">
                  <label htmlFor>Country</label>
                  <select className="form-select form-control">
                    <option>UK</option>
                  </select>
                </div>
              </div>
            </div>
            <table className="table mt-4">
              <tbody>
                <tr>
                  <th>Billing Amount</th>
                  <th>Amount Due</th>
                  <th>Renewal Date</th>
                </tr>
                <tr>
                  <td>$499/Monthly</td>
                  <td>N/A</td>
                  <td>30 Jan 2022</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
BillingDetails.layout = "AccountSetting";
export default BillingDetails;
