// import React from "react";
// import "../node_modules/react-image-gallery/styles/css/image-gallery.css";
// import ImageGallery from "react-image-gallery";

// class ImageSliderComponent extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       showIndex: false,
//       showBullets: true,
//       infinite: true,
//       showThumbnails: true,
//       showFullscreenButton: true,
//       showGalleryFullscreenButton: true,
//       showPlayButton: true,
//       showGalleryPlayButton: true,
//       showNav: true,
//       isRTL: false,
//       slideDuration: 450,
//       slideInterval: 2000,
//       slideOnThumbnailOver: false,
//       thumbnailPosition: "bottom",
//       showVideo: {},
//       useWindowKeyDown: true,
//     };

//     this.images = [
//       {
//         thumbnail: `${PREFIX_URL}4v.jpg`,
//         original: `${PREFIX_URL}4v.jpg`,
//         embedUrl:
//           "https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0",
//         description: "Render custom slides (such as videos)",
//         renderItem: this._renderVideo.bind(this),
//       },
//       {
//         original: `${PREFIX_URL}1.jpg`,
//         thumbnail: `${PREFIX_URL}1t.jpg`,
//         originalClass: "featured-slide",
//         thumbnailClass: "featured-thumb",
//         description: "Custom class for slides & thumbnails",
//       },
//     ].concat(this._getStaticImages());
//   }

//   _onImageClick(event) {
//     console.debug(
//       "clicked on image",
//       event.target,
//       "at index",
//       this._imageGallery.getCurrentIndex()
//     );
//   }

//   _onImageLoad(event) {
//     console.debug("loaded image", event.target.src);
//   }

//   _onSlide(index) {
//     this._resetVideo();
//     console.debug("slid to index", index);
//   }

//   _onPause(index) {
//     console.debug("paused on index", index);
//   }

//   _onScreenChange(fullScreenElement) {
//     console.debug("isFullScreen?", !!fullScreenElement);
//   }

//   _onPlay(index) {
//     console.debug("playing from index", index);
//   }

//   _handleInputChange(state, event) {
//     if (event.target.value > 0) {
//       this.setState({ [state]: event.target.value });
//     }
//   }

//   _handleCheckboxChange(state, event) {
//     this.setState({ [state]: event.target.checked });
//   }

//   _handleThumbnailPositionChange(event) {
//     this.setState({ thumbnailPosition: event.target.value });
//   }

//   _getStaticImages() {
//     let images = [];
//     for (let i = 2; i < 12; i++) {
//       images.push({
//         original: `${PREFIX_URL}${i}.jpg`,
//         thumbnail: `${PREFIX_URL}${i}t.jpg`,
//       });
//     }

//     return images;
//   }

//   _resetVideo() {
//     this.setState({ showVideo: {} });

//     if (this.state.showPlayButton) {
//       this.setState({ showGalleryPlayButton: true });
//     }

//     if (this.state.showFullscreenButton) {
//       this.setState({ showGalleryFullscreenButton: true });
//     }
//   }

//   _toggleShowVideo(url) {
//     this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
//     this.setState({
//       showVideo: this.state.showVideo,
//     });

//     if (this.state.showVideo[url]) {
//       if (this.state.showPlayButton) {
//         this.setState({ showGalleryPlayButton: false });
//       }

//       if (this.state.showFullscreenButton) {
//         this.setState({ showGalleryFullscreenButton: false });
//       }
//     }
//   }

//   _renderVideo(item) {
//     return (
//       <div>
//         {this.state.showVideo[item.embedUrl] ? (
//           <div className="video-wrapper">
//             <a
//               className="close-video"
//               onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
//             ></a>
//             <video className="d-block w-100" width={270} height={400} controls>
//               <source
//                 src="https://www.eventby.xyz/backend/api/getAssetWithPath/1649231491660_movie.mp4/video"
//                 type="video/mp4"
//               />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         ) : (
//           <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
//             <div className="play-button"></div>
//             <img className="image-gallery-image" src={item.original} />
//             {item.description && (
//               <span
//                 className="image-gallery-description"
//                 style={{ right: "0", left: "initial" }}
//               >
//                 {item.description}
//               </span>
//             )}
//           </a>
//         )}
//       </div>
//     );
//   }

//   render() {
//     return (
//       <section className="app">
//         <ImageGallery items={this.images} />
//       </section>
//     );
//   }
// }
// export default ImageSliderComponent;
