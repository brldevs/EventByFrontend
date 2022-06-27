import Image from "next/image";
import React, { useEffect, useState, createRef } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
export default function ImageDropZone({
  setFileValidation,
  setFileBanner,
  fileBanner,
  defaultBannerImg = null,
}) {
  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  function Previews({ setFileBanner, fileBanner }) {
    const [files, setFiles] = useState([]);
    const {
      acceptedFiles,
      fileRejections,
      getRootProps,
      getInputProps,
    } = useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        setFileBanner(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
        setFileValidation(false);
        // setFiles(
        //   acceptedFiles.map((file) =>
        //     Object.assign(file, {
        //       preview: URL.createObjectURL(file),
        //     })
        //   )
        // );
      },
      maxFiles: 1,
    });

    const acceptedFileItems = acceptedFiles.map((file, index) => (
      <li key={index}>
        {file.path} - {file.size} bytes
      </li>
    ));
    const fileRejectionItems = fileRejections.map(({ file, errors }, index) => {
      return (
        <li key={index}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      );
    });
    const thumbs = fileBanner.map((file, index) => (
      <Image key={index} src={file.preview} width={800} height={350} />
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    const dropzoneRef = createRef();
    const openDialog = () => {
      // Note that the ref is set async,
      // so it might be null at some point
      if (dropzoneRef.current) {
        dropzoneRef.current.open();
      }
    };

    const removeBanner = () => {
      setFileBanner([]);
    };
    return (
      <>
        {!fileBanner[0] && (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <img
              src={
                defaultBannerImg
                  ? URL.createObjectURL(defaultBannerImg)
                  : "/img/photo_drag_background.svg"
              }
              class="d-block w-100 my-3"
              alt=""
            />
            <label className="btn btn-primary dropzone">
              <i className="ri-image-2-line me-2" /> Add Image
            </label>
          </div>
        )}

        {fileBanner[0] && (
          <>
            <div {...getRootProps({ className: "dropzone" })} className="mb-5">
              <input {...getInputProps()} />

              <aside style={thumbsContainer}>{thumbs}</aside>
            </div>
            <div className="mt-3">
              <button
                className="btn btn-outline-primary light-btn ms-3"
                onClick={removeBanner}
              >
                Remove
              </button>
            </div>
          </>
        )}

        {/* <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul> */}
      </>
    );
  }

  return <Previews setFileBanner={setFileBanner} fileBanner={fileBanner} />;
}
