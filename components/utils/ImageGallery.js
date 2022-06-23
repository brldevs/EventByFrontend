function ImagesGallery({ images, defaultGalleryImg = null, removeMediaImg }) {
  return (
    <div className="row row-cols-2 g-3 row-cols-sm-5 mt-3">
      {defaultGalleryImg && defaultGalleryImg.length > 0 && (
        <>
          {defaultGalleryImg.map((item, index) => {
            return (
              <div className="col" key={index}>
                <div className="grid-image position-relative">
                  {item.path && (
                    <>
                      <img
                        src={
                          item.path
                            ? `${process.env.NEXT_PUBLIC_BASE_URL}/getAssetWithPath/${item.path}/image`
                            : "/img/photo_drag_background.svg"
                        }
                        className="d-block w-100"
                        width={200}
                        height={150}
                      />
                      <span
                        className="position-absolute"
                        onClick={() => removeMediaImg(item.path, index)}
                      >
                        <i className="ri-close-line" />
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {images && images.length > 0 && (
        <>
          {images.map((url, index) => {
            return (
              <div className="col" key={index}>
                <div className="grid-image position-relative">
                  <img
                    src={url}
                    className="d-block w-100"
                    width={200}
                    height={150}
                  />
                  <span
                    className="position-absolute"
                    onClick={() => removeMediaImg(null, index)}
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

export default ImagesGallery;
