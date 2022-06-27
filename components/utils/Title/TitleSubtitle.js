function TitleSubtitle(props) {
  const { title, subtitle, righttext } = props;
  return (
    <>
      {title && <span className="font-18 mt-5 d-block">{title}</span>}
      <div className="font-14 mb-2 d-flex justify-content-between">
        {subtitle && <span className="text-gray-2 ">{subtitle}</span>}
        {righttext && (
          <span className="text-primary cursor-pointer">{righttext}</span>
        )}
      </div>
    </>
  );
}
// <TitleSubtitle title="B" subtitle="A" righttext="C" />

export default TitleSubtitle;
