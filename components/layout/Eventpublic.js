import NavMenu from "../nav/NavMenu";
import Footer from "./Footer";
export default function Eventpublic({ children }) {
  return (
    <>
      <NavMenu />
      <section htmlFor={"content"} className="p-2 py-4 py-sm-5 p-sm-5 m-md-5 ">
        <div className="event-preview">{children}</div>
      </section>
      <Footer />
    </>
  );
}
