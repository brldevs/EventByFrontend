import Image from "next/image";
import $ from "jquery";
import React, { useEffect, useState, useCallback } from "react";
import { useAlert } from "react-alert";
import { Col, Row } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { useFormData } from "../../../context";
import FormProgress from "../../utils/FormProgress";
import ImagesGallery from "../../utils/ImageGallery";
import {
  updateEventBanner,
  eventMediaFilesUpload,
  getEventPreviewDataOPVById,
  getEventBannerByEventId,
  getAssetWithPath2,
  deleteEventAssetByPath,
} from "../../../services/service";
import VideoGallery from "../../utils/VideoGallery";
import Editor from "../../editor/Editor";
import ImageDropZone from "../../utils/ImageDropZone";
import GalleryDropZone from "../../utils/GalleryDropZone";

const MIDEA = [
  { id: 1, img: "../img/grid_photo.svg", alt: "name" },
  { id: 2, img: "../img/grid_photo.svg", alt: " " },
  { id: 3, img: "../img/grid_photo.svg", alt: " " },
  { id: 4, img: "../img/grid_photo.svg", alt: " " },
  { id: 5, img: "../img/grid_photo.svg", alt: " " },
  { id: 6, img: "../img/grid_photo.svg", alt: " " },
  { id: 7, img: "../img/grid_photo.svg", alt: " " },
];

function EventMediaDetailsForm({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  const { setFormValues, data } = useFormData();

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

  const alert = useAlert();
  const [media, setmedia] = useState(MIDEA);

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorData, setEditorData] = useState(null);
  const [fileBanner, setFileBanner] = useState([]);
  const [fileView, setFileView] = useState(null);
  const [fileValidation, setFileValidation] = useState(false);
  const [galleryPhoto, setGalleryPhoto] = useState({ file: [] });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  // const [mediaFiles, setMediaFiles] = useState([]);

  const [mediaFilesForVideo, setMediaFilesForVideo] = useState([]);
  const [mediaFilesForImage, setMediaFilesForImage] = useState([]);

  const mediaFilesArray = [];

  const [token, setToken] = useState(null);
  const [currentEventID, setCurrentEventID] = useState(null);
  const [defaultBannerImg, setDefaultBannerImg] = useState(null);
  const [defaultGalleryImg, setDefaultGalleryImg] = useState([]);
  const [defaultGalleryVideo, setDefaultGalleryVideo] = useState([]);
  const [currentImagesData, setCurrentImagesData] = useState([]);
  useEffect(async () => {
    setEditorLoaded(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const current_event_id =
      typeof window !== "undefined"
        ? localStorage.getItem("currentEventID")
        : null;
    setCurrentEventID(current_event_id);

    if (current_event_id) {
      const response = await getEventPreviewDataOPVById(current_event_id);
      const resBannerImg = await getEventBannerByEventId(current_event_id);

      if (response.status === 200) {
        setEditorData(response.data.event_banner_description);
        if (response.data.event_assets.length > 0) {
          setDefaultGalleryImg(
            response.data.event_assets.filter(
              (item) => isImage(item.path) == true
            )
          );

          setDefaultGalleryVideo(
            response.data.event_assets.filter(
              (item) => isVideo(item.path) == true
            )
          );
        }
      }
      if (resBannerImg) {
        setDefaultBannerImg(resBannerImg);
      }
    }
  }, []);
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    // return nextFormStep(); //temporary blocked below code
    setIsDisableNextButton(true);
    if (fileBanner[0] || defaultBannerImg) {
      // console.log(fileBanner);
      setFileValidation(false);
      const mediaFiles = [...mediaFilesForVideo, ...mediaFilesForImage];
      data = {
        ...data,
        ...d,
        fileBanner,
        editorData,
        mediaFiles,
        isFileSelected: fileBanner[0] ? "yes" : defaultBannerImg ? "no" : "yes",
      };
      console.table(data);
      setFormValues(data);

      if (currentEventID) {
        // EVENT BANNER & MEDIA FILES UPLOAD START
        if (data.mediaFiles) {
          await eventMediaFilesUpload(data.mediaFiles, token, currentEventID);
        }

        const res = await updateEventBanner(data, token, currentEventID);
        if (res.status === 200) {
          setIsDisableNextButton(false);
          alert.show("Data Updated Successfully", {
            type: "success",
          });
          nextFormStep();
        } else {
          setIsDisableNextButton(false);
          alert.show(res.message, { type: "error" });
        }
        // EVENT BANNER & MEDIA FILES UPLOAD END
      }
    } else {
      setFileValidation(true);
    }
  };

  const removeMediaImg = async (asset_path = null, index) => {
    setIsDisableNextButton(true);
    // remove by api calling
    if (asset_path && currentEventID) {
      const dataMedia = {
        event_id: currentEventID,
        asset_path: asset_path,
      };
      const response = await deleteEventAssetByPath(dataMedia, token);
      if (response.status === 200) {
        setIsDisableNextButton(false);
        alert.show("Data Deleted Successfully", {
          type: "success",
        });
      }

      // // remove local
      const values = [...defaultGalleryImg];
      values.splice(index, 1);
      setDefaultGalleryImg(values);
    } else {
      //remove local
      const values = [...images];
      values.splice(index, 1);
      setImages(values);

      const values2 = [...mediaFilesForImage];
      console.log("TYPE: ");
      console.log(values2[index].name);
      values2.splice(index, 1);
      setMediaFilesForImage(values2);
      alert.show("Data Deleted Successfully", {
        type: "success",
      });
      setIsDisableNextButton(false);
      // if (isImage(values2[index].name)) {
      // }
    }
  };

  const removeMediaVideo = async (asset_path = null, index) => {
    setIsDisableNextButton(true);
    // remove by api calling
    if (asset_path && currentEventID) {
      const dataMedia = {
        event_id: currentEventID,
        asset_path: asset_path,
      };
      const response = await deleteEventAssetByPath(dataMedia, token);
      if (response.status === 200) {
        alert.show("Data Deleted Successfully", {
          type: "success",
        });
        setIsDisableNextButton(false);
      }

      // // remove local
      const values = [...defaultGalleryVideo];
      values.splice(index, 1);
      setDefaultGalleryVideo(values);
    } else {
      //remove local
      const values = [...videos];
      values.splice(index, 1);
      setVideos(values);

      const values2 = [...mediaFilesForVideo];
      console.log("TYPE: ");
      console.log(values2[index].name);
      if (isVideo(values2[index].name)) {
        values2.splice(index, 1);
        setMediaFilesForVideo(values2);
        alert.show("Data Deleted Successfully", {
          type: "success",
        });
        setIsDisableNextButton(false);
      }
    }
  };

  const handleChangeBanner = (event) => {
    setFileBanner(event.target.files[0]);
    setFileView(URL.createObjectURL(event.target.files[0]));
    setFileValidation(false);
  };

  const cancelBannerImg = () => {
    setFileBanner(null);
    setFileView(null);
  };

  const handleChangeGalleryPhoto = (event) => {
    setGalleryPhoto({ file: event.target.files });
  };

  // console.log(typeof galleryPhoto.file);
  if (galleryPhoto.file) {
    for (let i = 0; i < galleryPhoto.file.length; i++) {
      console.log(galleryPhoto.file[i]);
    }
  }
  const [imgGalleryErrorMsg, setImgGalleryErrorMsg] = useState(null);
  const handleMultipleImages = (evnt) => {
    if (
      evnt.target.files.length > 5 ||
      mediaFilesForImage.length > 5 ||
      defaultGalleryImg.length > 5
    ) {
      setImgGalleryErrorMsg("Maximum 5 Image can be selected!");
    } else {
      setImgGalleryErrorMsg(null);
      const selectedMediaFiles = [];
      const targetMediaFiles = evnt.target.files;
      const targetMediaFilesObject = [...targetMediaFiles];
      targetMediaFilesObject.map((file) => {
        return selectedMediaFiles.push(file);
      });
      // console.log(typeof selectedMediaFiles);
      // setMediaFiles([...mediaFiles, ...selectedMediaFiles]);
      setMediaFilesForImage([...mediaFilesForImage, ...selectedMediaFiles]);

      const selectedFIles = [];
      const targetFiles = evnt.target.files;
      const targetFilesObject = [...targetFiles];
      targetFilesObject.map((file) => {
        return selectedFIles.push(URL.createObjectURL(file));
      });
      setImages(selectedFIles);
    }
  };
  const [videoGalleryErrorMsg, setVideoGalleryErrorMsg] = useState(null);
  const handleMultipleVideos = (evnt) => {
    if (
      evnt.target.files.length > 5 ||
      mediaFilesForVideo.length > 5 ||
      defaultGalleryVideo.length > 5
    ) {
      setVideoGalleryErrorMsg("Maximum 5 Video can be selected!");
    } else {
      setVideoGalleryErrorMsg(null);
      const selectedMediaFiles = [];
      const targetMediaFiles = evnt.target.files;
      const targetMediaFilesObject = [...targetMediaFiles];
      targetMediaFilesObject.map((file) => {
        return selectedMediaFiles.push(file);
      });
      // console.log(typeof selectedMediaFiles);
      // setMediaFiles([...mediaFiles, ...selectedMediaFiles]);
      setMediaFilesForVideo([...mediaFilesForVideo, ...selectedMediaFiles]);

      const selectedFIles = [];
      const targetFiles = evnt.target.files;
      const targetFilesObject = [...targetFiles];
      targetFilesObject.map((file) => {
        return selectedFIles.push(URL.createObjectURL(file));
      });
      setVideos(selectedFIles);
    }
  };

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

  const [isSkipNow, setIsSkipNow] = useState(false);
  // check file type extension start
  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }

  function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "png":
      case "JPG":
      case "JPEG":
      case "GIF":
      case "BMP":
      case "PNG":
        //etc
        return true;
    }
    return false;
  }

  function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case "m4v":
      case "avi":
      case "mpg":
      case "mp4":
      case "M4V":
      case "AVI":
      case "MPG":
      case "MP4":
        // etc
        return true;
    }
    return false;
  }
  //check file type extension end

  // {
  //   "event_id": "629c4eaaef4a1e6bf307d0f4",
  //   "asset_path": "1654762128242_Screen Shot 2022-06-09 at 1.27.29 PM.png"
  // }

  return (
    <Row>
      <form onSubmit={handleSubmit(onSubmit)} id="event-media-form">
        <div className="mw-770">
          <label className="font-18 m-0">Insert An Event Banner</label>
          <div className="text-gray-2 font-14">
            This is the featured image that your guests will be able to see
          </div>
          <ImageDropZone
            setFileBanner={setFileBanner}
            fileBanner={fileBanner}
            setFileValidation={setFileValidation}
            defaultBannerImg={defaultBannerImg}
          />

          {fileValidation && (
            <p style={{ color: "red" }}>This field is required!</p>
          )}

          <label className="font-18 m-0 mt-5">Add A Description</label>
          <div className="text-gray-2 font-14 mb-2">
            Tell your guests more about the event you are hosting
          </div>
          <Editor editorData={editorData} setEditorData={setEditorData} />
          {/* {JSON.stringify(editorData)} */}

          {!isSkipNow && (
            <div>
              <label className="font-18 m-0 mt-5">
                Embed Video / Photo Gallery
              </label>
              <div className="font-14 mb-2 d-flex justify-content-between">
                <span className="text-gray-2 ">(Optional)</span>
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => setIsSkipNow(true)}
                >
                  Skip Now
                </span>
              </div>

              <div className="row row-cols-2 g-3 row-cols-sm-4">
                {/* {media.map((media, index) => (
              <Col key={index}>
                <div className="grid-image position-relative">
                  <img
                    src="/img/grid_photo.svg"
                    className="d-block w-100"
                    src={media.img}
                  />
                  <span
                    className="position-absolute"
                    onClick={() => removeMideiea(media.id)}
                  >
                    <i className="ri-close-line" />
                  </span>
                </div>
              </Col>
            ))} */}
              </div>

              <ImagesGallery
                images={images}
                defaultGalleryImg={defaultGalleryImg}
                removeMediaImg={removeMediaImg}
              />
              <VideoGallery
                videos={videos}
                defaultGalleryVideo={defaultGalleryVideo}
                removeMediaVideo={removeMediaVideo}
              />

              <div className="mt-4">
                <input
                  accept="image/*"
                  type="file"
                  id="galleryphot"
                  onChange={handleMultipleImages}
                  multiple
                  hidden
                />

                <label for="galleryphot" className="btn btn-primary">
                  <i className="ri-image-2-line me-2" />
                  Add Image
                </label>

                <input
                  accept="video/*"
                  type="file"
                  id="galleryVideos"
                  onChange={handleMultipleVideos}
                  multiple
                  hidden
                />

                <label
                  for="galleryVideos"
                  className="btn btn-secondary text-white ms-3"
                >
                  <i className="ri-video-line" />
                  Add Video
                </label>
              </div>
              {imgGalleryErrorMsg && (
                <p style={{ color: "red" }}>{imgGalleryErrorMsg}</p>
              )}

              {videoGalleryErrorMsg && (
                <p style={{ color: "red" }}>{videoGalleryErrorMsg}</p>
              )}
            </div>
          )}
        </div>

        <FormProgress
          isDisableNextButton={isDisableNextButton}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          formId={"event-media-form"}
        />
      </form>
    </Row>
  );
}

export default EventMediaDetailsForm;
