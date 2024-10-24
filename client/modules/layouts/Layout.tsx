"use client";
import { connect } from "react-redux";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  authenticate: boolean;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ authenticate, children }) => {
  return (
    <>
      {authenticate && <Header />}
      {children}
      <Footer />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  authenticate: state.auth.authenticate,
});

export default connect(mapStateToProps)(Layout);
