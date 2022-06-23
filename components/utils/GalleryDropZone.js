import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
export default function GalleryDropZone() {
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

  function Previews(props) {
    const [files, setFiles] = useState([]);
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
      useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        },
        maxFiles: 10,
      });

    const acceptedFileItems = acceptedFiles.map((file) => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      );
    });
    const thumbs = files.map((file) => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} />
        </div>
      </div>
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
      <>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <img
            src="/img/photo_drag_background.svg"
            class="d-block w-100 my-3"
            alt=""
          />
        </div>
        <aside style={thumbsContainer}>{thumbs}</aside>
        {/* <aside>
          <h4>Accepted files</h4>
          <ul>{acceptedFileItems}</ul>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
        </aside> */}
      </>
    );
  }

  return <Previews />;
}
