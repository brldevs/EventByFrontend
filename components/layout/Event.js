import NavMenu from "../nav/NavMenu";
import Footer from "./Footer";

export default function Empty({ children }) {
  return (
    <>
      <NavMenu />
      {children}
      <Footer />
    </>
  );
}
