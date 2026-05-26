import { useLocation } from "react-router-dom";
import SharedNavbar from "./SharedNavbar";
import SharedFooter from "./SharedFooter";
import FloatingButtons from "./FloatingButtons";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="bg-[#020d1a] text-white overflow-x-hidden">
      <SharedNavbar />
      <main key={pathname} className="page-enter">
        {children}
      </main>
      <SharedFooter />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
