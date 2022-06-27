function VideoGallery({
  videos,
  defaultGalleryVideo = null,
  removeMediaVideo,
}) {
  return (
    <div className="row row-cols-2 g-3 row-cols-sm-5 mt-3">
      {defaultGalleryVideo && defaultGalleryVideo.length > 0 && (
        <>
          {defaultGalleryVideo.map((item, index) => {
            return (
              <div className="col" key={index}>
                <div className="grid-image position-relative">
                  <video
                    className="d-block w-100"
                    width={270}
                    height={130}
                    controls
                  >
                    <source
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.path}/video`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>

                  <span
                    className="position-absolute"
                    onClick={() => removeMediaVideo(item.path, index)}
                  >
                    <i className="ri-close-line" />
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {videos && videos.length > 0 && (
        <>
          {videos.map((url, index) => {
            return (
              <div className="col" key={index}>
                <div className="grid-image position-relative">
                  <video
                    className="d-block w-100"
                    width={270}
                    height={130}
                    controls
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <span
                    className="position-absolute"
                    onClick={() => removeMediaVideo(null, index)}
                  >
                    <i className="ri-close-line" />
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default VideoGallery;
