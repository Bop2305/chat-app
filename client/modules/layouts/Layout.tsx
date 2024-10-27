"use client";
import { connect } from "react-redux";
import Footer from "./Footer";
import Header from "./Header";
import { setAuthenticate } from "@/store/auth.duck";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LayoutProps = {
  authenticate: boolean;
  setAuthenticate: (authenticate: boolean) => void;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  authenticate,
  setAuthenticate,
  children,
}) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticate(true);
    }
  }, [setAuthenticate]);

  // useEffect(() => {
  //   if (!authenticate) router.push("/login");
  // }, [authenticate]);

  return (
    <>
      {authenticate && <Header />}
      {children}
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  authenticate: state.auth.authenticate,
});

const mapDispatchToProps = (dispatch: any) => ({
  setAuthenticate: (authenticate: boolean) =>
    dispatch(setAuthenticate(authenticate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
