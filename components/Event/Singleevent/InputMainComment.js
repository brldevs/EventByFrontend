import { eventPostNewComment } from "../../../services/service";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
function InputMainComment({ token, eventId, setIsLoading, isLoading }) {
  const [commentDetails, setCommentDetails] = useState(null);
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
  const [mediaFiles, setMediaFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [isDisableSubmitCommentBtn, setIsDisableSubmitCommentBtn] = useState(
    false
  );
  const onSubmit = async () => {
    if (commentDetails) {
      const result = JSON.parse(localStorage.getItem("result"));

      const data = {
        event_id: eventId,
        commentor_name: result.firstName + " " + result.lastName,
        commentor_id: result.id,
        detais: commentDetails,
      };
      setCommentDetails("");
      setImages([]);
      setMediaFiles([]);
      setIsDisableSubmitCommentBtn(true);

      const res = await eventPostNewComment(data, token, mediaFiles);
      if (res.status === 200) {
        setIsDisableSubmitCommentBtn(false);
        setIsLoading(!isLoading);
      }
    }
  };

  const handleMultipleImages = (e) => {
    const selectedMediaFiles = [];
    const targetMediaFiles = e.target.files;
    const targetMediaFilesObject = [...targetMediaFiles];
    targetMediaFilesObject.map((file) => {
      return selectedMediaFiles.push(file);
    });
    setMediaFiles([...mediaFiles, ...selectedMediaFiles]);

    const selectedFIles = [];
    const targetFiles = e.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) => {
      return selectedFIles.push(URL.createObjectURL(file));
    });
    setImages([...images, ...selectedFIles]);
  };
  return (
    <>
      <div className="ps-3 ps-md-5 ms-3 mt-4 mt-md-5 mb-5">
        <div className="d-flex justify-content-between font-14 mb-2  flex-wrap">
          <span className="text-gray-1 me-3">Write A Comment</span>
          <a
            data-placement="top"
            className="text-primary show-tooltip"
            data-bs-html="true"
            data-bs-toggle="tooltip"
            title="-Do <br>
                                Describe the event experience and the activity. Say
                                what you liked best & least
                                <br><br>
                                -Don't <br>
                                Use profanity, threats, or personal insults Include
                                e-mail addresses, websites or phone numbers, Report
                                someone else's experience"
          >
            Tips for writing great review
          </a>
        </div>

        <textarea
          value={commentDetails}
          onChange={(e) => setCommentDetails(e.target.value)}
          className="form-control"
          placeholder="Add a little detail and tell your guests what the event is about"
        />
        <div className="comment-attachment">
          <div className="d-flex flex-wrap mt-2">
            {images.map((url) => {
              return (
                <img src={url} className="mt-2 me-2 d-block border-radius-10" />
              );
            })}
            <div>
              <label htmlFor="commentPicsId">
                <img
                  src="/img/comment_photo_upload.jpg"
                  className="mt-2  d-block cursor-pointer border-radius-10"
                />
              </label>
              <input
                type="file"
                id="commentPicsId"
                onChange={handleMultipleImages}
                multiple
                hidden
              />
            </div>
          </div>
        </div>
        <button
          className="btn mt-1 btn-primary font-weight-500"
          onClick={onSubmit}
          disabled={isDisableSubmitCommentBtn}
        >
          Submit Comment
        </button>
      </div>
    </>
  );
}

export default InputMainComment;
