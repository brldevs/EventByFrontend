import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventCard from "../../../components/Event/EventCard";

const comments = [
  {
    id: 1,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 2,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 3,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 4,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 5,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 6,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 7,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 8,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 9,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
  {
    id: 10,
    name: "Name",
    img: "/img/organizer_2.png",
    comdate: "July 23, 2021, 8:50 AM",
    rating: 5,
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. All djfgh dsaf condimentum. Ullamcorper odio diam duis volutpate tortor dolar edrfa amcorper odio diam duis",
    status: true,
  },
];
function publishevent() {
  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    if (id) {
      setEventId(id);
    }
  }, [id]);
  return (
    <>
      <EventDashboard eventId={eventId}>
        <Head>
          <title>Feedback</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <EventCard eventId={eventId} />
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h2>Moderate Feedback</h2>
          <div className="d-flex align-items-center">
            <span className="text-gray-2 me-2">Entry Per Page</span>
            <input
              type="number"
              defaultValue={10}
              className="form-control"
              style={{ width: "85px" }}
            />
          </div>
        </div>
        <div className="moderate-comment mt-4">
          <table cellSpacing={0}>
            <tbody>
              {comments.map((comment) => (
                <tr>
                  <td width={230}>
                    <div className="d-flex align-items-center">
                      <Image
                        src={comment.img}
                        className="rounded-circle"
                        width={60}
                        height={60}
                      />
                      &nbsp;&nbsp;
                      <span className="font-16">{comment.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="ri-calendar-check-line text-gray-2 me-2" />
                      <span className="font-12">{comment.name}</span>
                    </div>
                    <div className="mt-2 font-14">
                      {comment.details} &nbsp;
                      <Link href="/{id}">
                        <a className="text-primary">Read More</a>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div className="star">
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                    </div>
                  </td>
                  <td>
                    <span className="invite-badge rounded font-16">Reply</span>
                  </td>
                  <td>
                    <span className="rsvip-badge rounded-pill success">
                      Published
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="dropdown dropdown-dashboard">
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
                          <a className="dropdown-item" href="">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Approve</span>
                              <img src="/img/tik_svg.svg" />
                            </div>
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Decline</span>
                              <img src="/img/cross_svg.svg" />
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="dashboard page mt-4">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="" aria-label="Previous">
                <i className="ri-arrow-left-s-line" />
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="">
                1
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="" aria-label="Next">
                <i className="ri-arrow-right-s-line" />
              </a>
            </li>
          </ul>
        </nav>
      </EventDashboard>
    </>
  );
}
// publishevent.layout = "Empty";
publishevent.layout = "Event";
export default publishevent;
