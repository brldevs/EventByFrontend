import NavMenu from "../nav/NavMenu";
import Footer from "./Footer";

export default function Login({ children }) {
  return (
    <>
      <NavMenu />
      <section id="content" className="p-2 py-4 py-sm-5 p-sm-5 m-md-5">
        <div className="content bg-white p-4 p-sm-5 p-xl-3">{children}</div>
      </section>
      <Footer />
    </>
  );
}
