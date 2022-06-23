import InputMainComment from "./InputMainComment";
import InputChildComment from "./InputChildComment";
import React, { useState, useEffect } from "react";
import { SRLWrapper } from "simple-react-lightbox";
import {
  eventGetAllComments,
  eventGetAllCommentsChild,
  eventReactToComment,
} from "../../../services/service";
import { format, compareAsc } from "date-fns";

function CommentSection({ eventId, organizerProfilePicture }) {
  const [totalComment, setTotalComment] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [isDisableReactBtn, setIsDisableReactBtn] = useState(false);
  useEffect(async () => {
    if (eventId) {
      const accessToken = localStorage.getItem("token");
      const result = JSON.parse(localStorage.getItem("result"));

      setToken(accessToken);
      const res = await eventGetAllComments(eventId);

      if (res.status === 200) {
        setComments(
          res.data.reverse().map((item) => {
            return {
              parentId: item._id,
              comment: item.detais,
              childComments: [],
              commenterName: item.commentor_name,
              commentDate: format(new Date(item.created_at), "MMMM dd, yyyy"),
              totalReacts: item.reacts,
              totalReply: item.replies,
              isReplyInputShow: false,
              isActiveReactIcon: item.reactors.length ? true : false,
              commentAssets: item.comment_assets,
              commentor_profile_picture: item.commentor_profile_picture,
            };
          })
        );

        setTotalComment(res.count);
      }
    }
  }, [isLoading]);

  const replyHandler = (index) => {
    const values = [...comments];
    values[index].isReplyInputShow = !values[index].isReplyInputShow;
    setComments(values);
  };

  const getChildComment = async (parentId, index) => {
    const res = await eventGetAllCommentsChild(eventId, parentId);
    if (res.status === 200) {
      const values = [...comments];
      (values[index].childComments = res.data.reverse().map((item) => {
        return {
          parentId: item._id,
          comment: item.detais,
          childComments: null,
          commenterName: item.commentor_name,
          commentDate: format(new Date(item.created_at), "MMMM dd, yyyy"),
          totalReacts: item.reacts,
          totalReply: item.replies,
          isReplyInputShow: false,
          commentAssets: item.comment_assets,
          commentor_profile_picture: item.commentor_profile_picture,
        };
      })),
        setComments(values);
    }
  };

  const hideIsReplyInputShow = async (index) => {
    const values = [...comments];
    values[index].isReplyInputShow = false;
    setComments(values);
  };

  const toggleReact = async (parentId) => {
    setIsDisableReactBtn(true);
    const res = await eventReactToComment(token, parentId);
    if (res.status === 200) {
      setIsLoading(!isLoading);
      setIsDisableReactBtn(false);
    }
  };
  return (
    <>
      <span className="text-gray-2 font-14">
        <i className="ri-chat-1-line me-2" /> {totalComment} Comments
      </span>
      {token && (
        <InputMainComment
          token={token}
          eventId={eventId}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      )}

      <hr />
      {/*Comment */}
      {/* {JSON.stringify(comments)} */}
      {comments.map((item, index) => {
        return (
          <div className="d-flex comment">
            {item.commentor_profile_picture ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.commentor_profile_picture}/image`}
                className="rounded-circle me-3"
              />
            ) : (
              <img src="/img/avata.png" className="rounded-circle me-3" />
            )}

            <div className="flex-fill">
              <div className="d-flex justify-content-between align-items-end flex-wrap">
                <div className="me-2">
                  <span className="font-16 font-weight-500 d-block">
                    {item.commenterName}
                  </span>
                  <span className="text-gray-2">{item.commentDate}</span>
                </div>
                <div className="mt-2">
                  <button
                    className="btn btn-reply mx-2"
                    onClick={() => toggleReact(item.parentId)}
                    disabled={isDisableReactBtn}
                  >
                    <i
                      className={`${
                        item.isActiveReactIcon ? "active" : ""
                      } ri-heart-line pe-1`}
                    />
                    {item.totalReacts}
                  </button>
                  <button
                    className="btn btn-reply"
                    onClick={() => {
                      replyHandler(index);
                      getChildComment(item.parentId, index);
                    }}
                  >
                    <i className="active ri-chat-1-line pe-1" />
                    {item.totalReply} Reply
                  </button>
                </div>
              </div>
              <p className="font-14 mt-2">{item.comment}</p>

              <div className="comment-attachment">
                <SRLWrapper>
                  <div className="d-flex flex-wrap mt-2">
                    {item.commentAssets &&
                      item.commentAssets.map((item, index) => {
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
              <hr />
              {item.isReplyInputShow && (
                <>
                  {item.childComments.map((item2, index) => {
                    return (
                      <div className="comment-reply" key={index}>
                        <SRLWrapper>
                          <div className="d-flex comment">
                            {item2.commentor_profile_picture ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item2.commentor_profile_picture}/image`}
                                className="rounded-circle me-3"
                              />
                            ) : (
                              <img
                                src="/img/avata.png"
                                className="rounded-circle me-3"
                              />
                            )}
                            <div className="flex-fill">
                              <div className="d-flex justify-content-between align-items-end flex-wrap">
                                <div className="me-2">
                                  <span className="font-16 font-weight-500 d-block">
                                    {item2.commenterName}
                                  </span>
                                  <span className="text-gray-2">
                                    {item2.commentDate}
                                  </span>
                                </div>
                              </div>
                              <p className="font-14 mt-2">{item2.comment}</p>
                              <div className="comment-attachment">
                                <div className="d-flex flex-wrap mt-2">
                                  {item2.commentAssets &&
                                    item2.commentAssets.map((data, index) => {
                                      return (
                                        <img
                                          key={index}
                                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${data.path}/image`}
                                          className="mt-2 me-2 d-block border-radius-10"
                                        />
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </SRLWrapper>
                      </div>
                    );
                  })}

                  {token && (
                    <InputChildComment
                      token={token}
                      eventId={eventId}
                      setIsLoading={setIsLoading}
                      parentId={item.parentId}
                      index={index}
                      hideIsReplyInputShow={hideIsReplyInputShow}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* DUMMY COMMENT BELOW */}
      {/* <div className="d-flex comment">
        <img src="/img/organizer_2.png" className="rounded-circle me-3" />
        <div className="flex-fill">
          <div className="d-flex justify-content-between align-items-end flex-wrap">
            <div className="me-2">
              <span className="font-16 font-weight-500 d-block">
                Willam Smith
              </span>
              <span className="text-gray-2">28 August 2021</span>
            </div>
            <div className="mt-2">
              <button className="btn btn-reply">
                <i className="ri-heart-line" /> 344
              </button>
              <button className="btn btn-reply">
                <i className="ri-chat-1-line" />
                Reply
              </button>
            </div>
          </div>
          <p className="font-14 mt-2">
            With the post-pandemic world slowly getting back on its track, it’s
            more important than ever before that entrepreneurs and leaders
            unleash breakthrough ideas and innovations to reach the epitome of
            success. Quinton Teams brings you the biggest Global Leaders
          </p>
        </div>
      </div>

      <div className="comment-reply">
        <div className="d-flex comment">
          <img src="/img/organizer_3.png" className="rounded-circle me-3" />
          <div className="flex-fill">
            <div className="d-flex justify-content-between align-items-end flex-wrap">
              <div className="me-2">
                <span className="font-16 font-weight-500 d-block">
                  Keny Sing
                </span>
                <span className="text-gray-2">28 August 2021</span>
              </div>
            </div>
            <p className="font-14 mt-2">
              With the post-pandemic world slowly getting back on its track,
              it’s more important than ever before that entrepreneurs and
              leaders unleash breakthrough ideas and innovations to reach the
              epitome of success. Quinton Teams brings you the biggest Global
              Leaders
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default CommentSection;
