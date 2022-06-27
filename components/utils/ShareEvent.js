function ShareEvent({ postUrl, postTitle, postImg }) {
  return (
    <div className="d-flex">
      <a
        href={`https://www.facebook.com/sharer.php?u=${postUrl}`}
        target="_blank"
        className="icon facebook rounded-circle d-flex justify-content-center align-items-center"
      >
        <i className="ri-facebook-fill" />
      </a>
      <a
        href={`https://pinterest.com/pin/create/bookmarklet/?media=${postImg}&url=${postUrl}&description=${postTitle}`}
        className="icon pinterest rounded-circle d-flex justify-content-center align-items-center"
        target="_blank"
      >
        <i className="ri-pinterest-fill" />
      </a>
      <a
        href={`https://twitter.com/share?url=${postUrl}&text=${postTitle}`}
        className="icon twitter rounded-circle d-flex justify-content-center align-items-center"
        target="_blank"
      >
        <i className="ri-twitter-fill" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`}
        className="icon linkedin rounded-circle d-flex justify-content-center align-items-center"
        target="_blank"
      >
        <i className="ri-linkedin-fill" />
      </a>
      <a
        href={`https://wa.me/?text=${postTitle} ${postUrl}`}
        className="icon whatsapp rounded-circle d-flex justify-content-center align-items-center"
        target="_blank"
      >
        <i className="ri-whatsapp-fill" />
      </a>
    </div>
  );
}

export default ShareEvent;
