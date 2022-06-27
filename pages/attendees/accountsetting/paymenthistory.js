import { useEffect } from "react";
import $ from "jquery";
function PaymentHistory() {
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
    <div className="content_area flex-1 p-30">
      <div className="bg-white pt-5 border-radius-10">
        <div className="dashboard_event_container pb-5">
          <h2 className="text-center">Payment History</h2>
          <p className="text-gray-2 text-center mb-5">
            View transaction details for event tickets you have paid for
          </p>
          <div className="payment-history">
            <table>
              <tbody>
                <tr>
                  <th>Date</th>
                  <th>Event Name</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
                <tr>
                  <td>29 July 2021</td>
                  <td>2021 Leadership Summit</td>
                  <td>
                    <span className="badge badge-secondary">Paid</span>
                  </td>
                  <td className="invoice">
                    <a href="">Download Invoice</a> <br />
                    <a href="">Request Refund</a>
                  </td>
                </tr>
                <tr>
                  <td>29 July 2021</td>
                  <td>2021 Leadership Summit</td>
                  <td>
                    <span className="badge badge-secondary">Paid</span>
                  </td>
                  <td className="invoice">
                    <a href="">Download Invoice</a> <br />
                    <a href="">Request Refund</a>
                  </td>
                </tr>
                <tr>
                  <td>29 July 2021</td>
                  <td>2021 Leadership Summit</td>
                  <td>
                    <span className="badge badge-warning">Pending</span>
                  </td>
                  <td className="invoice">
                    <a href="">Download Invoice</a> <br />
                    <a href="">Request Refund</a>
                  </td>
                </tr>
                <tr>
                  <td>29 July 2021</td>
                  <td>2021 Leadership Summit</td>
                  <td>
                    <span className="badge badge-danger">Refunded</span>
                  </td>
                  <td className="invoice">
                    <a href="">Download Invoice</a> <br />
                    <a href="">Request Refund</a>
                  </td>
                </tr>
                <tr>
                  <td>29 July 2021</td>
                  <td>2021 Leadership Summit</td>
                  <td>
                    <span className="badge badge-secondary">Paid</span>
                  </td>
                  <td className="invoice">
                    <a href="">Download Invoice</a> <br />
                    <a href="">Request Refund</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
PaymentHistory.layout = "AttendeesDashboard";
export default PaymentHistory;
