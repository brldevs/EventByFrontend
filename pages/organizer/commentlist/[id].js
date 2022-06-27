import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { format, compareAsc } from "date-fns";
import BasicInfoForm from "../../../components/Event/EventForm/BasicInfoForm";
import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventCard from "../../../components/Event/EventCard";
import { SRLWrapper } from "simple-react-lightbox";
import ReactPaginate from "react-paginate";
import {
  getAllPendingComments,
  approveComment,
  deleteComment,
} from "../../../services/service";
import { useAlert } from "react-alert";
function commentlist() {
  const [eventId, setEventId] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);
  const alert = useAlert();

  const [token, setToken] = useState(null);

  const [commentList, setCommentList] = useState([]);

  const [isPaginationShow, setIsPaginationShow] = useState(false);
  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    setToken(token);

    if (!token) {
      router.replace("/");
    }

    if (id) {
      setEventId(id);
      const response = await getAllPendingComments(
        token,
        id,
        currentPage,
        limit
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          setIsPaginationShow(true);
        } else {
          setIsPaginationShow(false);
        }
        setCommentList(response.data);

        setTotalItem(response.total_pending_comments);
        setPageCount(Math.ceil(response.total_pending_comments / limit));
      }
    }
  }, [id]);

  const approveCommentByCommentId = async (commentId) => {
    const response = await approveComment(token, commentId);
    if (response.status === 200) {
      const resp = await getAllPendingComments(token, id, 0, 200);
      if (resp.status === 200) {
        setCommentList(resp.data);
        alert.show("Approved !", { type: "success" });
      } else {
        alert.show(resp.message, { type: "error" });
      }
    }
  };

  const deleteCommentByCommentId = async (commentId) => {
    const response = await deleteComment(token, commentId);
    if (response.status === 200) {
      const resp = await getAllPendingComments(token, id, 0, 200);
      if (resp.status === 200) {
        setCommentList(resp.data);
        alert.show("Declined !", { type: "error" });
      } else {
        alert.show(resp.message, { type: "error" });
      }
    }
  };

  const [isActiveFilterEntryPerPage, setActiveFilterEntryPerPage] = useState(
    false
  );
  const HandlerEntryPerPage = () => {
    setActiveFilterEntryPerPage(!isActiveFilterEntryPerPage);
    //alert(showResults);
  };

  const [entryPerPageSelectedValue, setEntryPerPageSelectedValue] = useState(
    null
  );

  const entryPerPageRadioHandler = (e) => {
    setActiveFilterEntryPerPage(false);
    setEntryPerPageSelectedValue(e.target.value);
    filterEventAttendeesByEntryPerPage(e.target.value);
  };

  // filtering by Entry Per Page
  const filterEventAttendeesByEntryPerPage = async (entryPerPage) => {
    setIsLoading(true);
    setLimit(entryPerPage);
    setPageCount(Math.ceil(totalItem / entryPerPage));

    const res = await getAllPendingComments(
      token,
      id,
      currentPage,
      entryPerPage
    );

    if (res.status === 200) {
      setCommentList(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // ////////////////////////////////////--PAGINATION CODE START
  const [totalItem, setTotalItem] = useState(0); //NEED TO CHANGE AFTER TURZO VAI GIVE TOTAL DATA COUNT
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const changePage = async ({ selected }) => {
    setIsLoading(true);
    setCurrentPage(selected);
    const res = await getAllPendingComments(token, id, selected, limit);

    if (res.status === 200) {
      setCommentList(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  // ////////////////////////////////////--PAGINATION CODE END
  return (
    <>
      <EventDashboard eventId={eventId}>
        <Head>
          <title>Comment List</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <EventCard eventId={eventId} />
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h2>Moderate Comments</h2>
          <div className="d-flex align-items-center justify-content-end">
            <span className="text-gray-2 me-2">Entry Per Page</span>
            <div
              className="input-group me-0 me-sm-2"
              style={{ overflow: "visible", width: "85px" }}
            >
              <div
                onClick={HandlerEntryPerPage}
                className={`wrapper-dropdown-4 ${
                  isActiveFilterEntryPerPage ? "active" : ""
                } form-select form-control form-control-sm`}
              >
                {entryPerPageSelectedValue ? entryPerPageSelectedValue : ""}
                <ul
                  className="dropdown ps-0 rounded-bottom"
                  style={{ width: "85px" }}
                >
                  <li>
                    <input
                      type="radio"
                      id="epp-1"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="25"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-1">25</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-2"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="50"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-2">50</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-3"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="100"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-3">100</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-4"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="500"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-4">500</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="epp-5"
                      onChange={(e) => {
                        entryPerPageRadioHandler(e);
                      }}
                      name="entryPerPage"
                      defaultValue="1000"
                      className="form-check-input"
                      hidden
                    />
                    <label htmlFor="epp-5">1000</label>
                  </li>
                </ul>
              </div>
            </div>
            {/* ENTRY PER PAGE END */}
          </div>
        </div>
        <div className="moderate-comment mt-4">
          <table cellSpacing={0}>
            <tbody>
              {commentList.map((item, index) => (
                <tr key={index}>
                  <td width={230}>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.commentor_profile_picture}/image`}
                        className="rounded-circle"
                        width={60}
                        height={60}
                      />
                      &nbsp;&nbsp;
                      <span className="font-16">{item.commentor_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="ri-calendar-check-line text-gray-2 me-2" />
                      <span className="font-12">
                        {" "}
                        {format(new Date(item.created_at), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="mt-2 font-14">
                      {item.detais} &nbsp;
                      {/* <a className="text-primary">Read More</a> */}
                      {/* <Link href="">
                        <a className="text-primary">Read More</a>
                      </Link> */}
                      <div className="comment-attachment">
                        <SRLWrapper>
                          <div className="d-flex flex-wrap mt-2">
                            {item.comment_assets &&
                              item.comment_assets.map((item, index) => {
                                return (
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.path}/image`}
                                  >
                                    <img
                                      key={index}
                                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.path}/image`}
                                      className="mt-2 me-2 d-block border-radius-10"
                                    />
                                  </a>
                                );
                              })}
                          </div>
                        </SRLWrapper>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="invite-badge rounded font-16">Reply</span>
                  </td>
                  <td>
                    <span
                      className={`rsvip-badge rounded-pill ${
                        item.status === "pending" ? "warning" : "success"
                      }`}
                    >
                      {item.status === "pending" ? "Pending" : "Published"}
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
                        <li onClick={() => approveCommentByCommentId(item._id)}>
                          <a className="dropdown-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Approve</span>
                              <img src="/img/tik_svg.svg" />
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={() => deleteCommentByCommentId(item._id)}
                          >
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

        {commentList && commentList.length > 0 && (
          <nav className="dashboard page mt-4">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={""}
              pageRangeDisplayed={5}
              marginPagesDisplayed={0}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </nav>
        )}
      </EventDashboard>
    </>
  );
}
// commentlist.layout = "Empty";
commentlist.layout = "Event";
export default commentlist;
