import React from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
const Layout = ({ children }) => {
  const location = useLocation();

  // Auth pages — no header, no footer, just full screen
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header className="p-6 border-b" />

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
