import Head from "next/head";
import Image from "next/image";
import EventMediaDetailsForm from "../../../components/Event/EventForm/EventMediaDetailsForm";
import EventDashboard from "../../../components/layout/EventDashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";
import ImagesGallery from "../../../components/utils/ImageGallery";
import VideoGallery from "../../../components/utils/VideoGallery";
import {
  eventBannerUpload,
  eventMediaFilesUpload,
  getEventPreviewDataOPVById,
  updateEventBanner,
  getEventBannerByEventId,
  deleteEventAssetByPath,
} from "../../../services/service";
import EventCard from "../../../components/Event/EventCard";
import ImageDropZone from "../../../components/utils/ImageDropZone";
import Editor from "../../../components/editor/Editor";
function addphotosvideos() {
  const router = useRouter();
  const { id } = router.query;
  console.log("EventID : " + id);

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

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [fileBanner, setFileBanner] = useState([]);
  const [fileView, setFileView] = useState(null);
  const [fileValidation, setFileValidation] = useState(false);
  const [galleryPhoto, setGalleryPhoto] = useState({ file: [] });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  const [mediaFilesForVideo, setMediaFilesForVideo] = useState([]);
  const [mediaFilesForImage, setMediaFilesForImage] = useState([]);

  const mediaFilesArray = [];

  const [currentEventData, setCurrentEventData] = useState({});

  const [defaultBannerImgPath, setDefaultBannerImgPath] = useState(null);

  const [token, setToken] = useState(null);
  const [currentEventID, setCurrentEventID] = useState(null);
  const [defaultBannerImg, setDefaultBannerImg] = useState(null);
  const [defaultGalleryImg, setDefaultGalleryImg] = useState([]);
  const [defaultGalleryVideo, setDefaultGalleryVideo] = useState([]);
  const [currentImagesData, setCurrentImagesData] = useState([]);
  useEffect(async () => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.js")
      : null;

    setEditorLoaded(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    if (!token) {
      router.replace("/");
    }

    if (id) {
      setCurrentEventID(id);
      const response = await getEventPreviewDataOPVById(id);
      const resBannerImg = await getEventBannerByEventId(id);

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
  }, [id]);

  const onSubmit = async (d) => {
    if (fileBanner[0] || defaultBannerImg) {
      // console.log(fileBanner);
      setFileValidation(false);
      const mediaFiles = [...mediaFilesForVideo, ...mediaFilesForImage];
      const data = {
        ...d,
        fileBanner,
        editorData,
        mediaFiles,
        isFileSelected: fileBanner[0] ? "yes" : defaultBannerImg ? "no" : "yes",
      };
      console.table(data);

      if (currentEventID) {
        // EVENT BANNER & MEDIA FILES UPLOAD START
        if (data.mediaFiles) {
          await eventMediaFilesUpload(data.mediaFiles, token, currentEventID);
        }

        const res = await updateEventBanner(data, token, currentEventID);
        if (res.status === 200) {
          alert.show("Data Updated Successfully", {
            type: "success",
          });
        } else {
          alert.show(res.message, { type: "error" });
        }
        // EVENT BANNER & MEDIA FILES UPLOAD END
      }
    } else {
      setFileValidation(true);
    }
  };

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

  const removeMediaImg = async (asset_path = null, index) => {
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
    }
  };

  const removeMediaVideo = async (asset_path = null, index) => {
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
      }
    }
  };

  return (
    <>
      <EventDashboard eventId={currentEventID}>
        <Head>
          <title>Add Media</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <EventCard eventId={currentEventID} />
        <div className="bg-white mt-4  border-radius-10">
          <form id="event-media-form">
            <div className="text-end px-50 py-50 pb-0">
              <button
                type="submit"
                className="btn mb-3 btn-secondary text-white"
                onClick={handleSubmit(onSubmit)}
              >
                Save Changes
              </button>
            </div>

            <div className="dashboard_event_container pb-5">
              <h2 className="text-center">Update Event Details</h2>
              <p className="text-gray-2 text-center mb-5">
                Tell us a bit about your event and quickly get started
              </p>
              <div className="pb-5">
                {/* EVENT MEDIA DETAILS COMPONENT START */}
                <Row>
                  <div className="col-md-10 mx-md-auto">
                    <span className="font-18">Insert An Event Banner</span>
                    <div className="text-gray-2 font-14">
                      This is the featured image that your guests will be able
                      to see
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
                    <span className="font-18">Add A Description</span>
                    <div className="text-gray-2 font-14 mb-2">
                      Tell your guests more about the event you are hosting
                    </div>
                    <Editor
                      editorData={editorData}
                      setEditorData={setEditorData}
                    />
                    {/* {JSON.stringify(editorData)} */}

                    <div>
                      <label className="font-18 m-0 mt-5">
                        Embed Video / Photo Gallery
                      </label>
                      <div className="font-14 mb-2 d-flex justify-content-between">
                        <span className="text-gray-2 ">(Optional)</span>
                      </div>

                      <div className="row row-cols-2 g-3 row-cols-sm-4"></div>
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
                  </div>
                </Row>
                {/* EVENT MEDIA DETAILS COMPONENT END */}
              </div>
            </div>
          </form>
        </div>
      </EventDashboard>
    </>
  );
}
// addphotosvideos.layout = "Empty";
addphotosvideos.layout = "Event";
export default addphotosvideos;
