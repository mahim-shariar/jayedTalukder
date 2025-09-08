import { useEffect, useState } from "react";
import LoadingSpinner from "../components/sections/LoadingSpinner";

const DelayedSpinner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100); // Show spinner only after 100ms delay
    return () => clearTimeout(timer);
  }, []);

  return show ? <LoadingSpinner /> : null;
};

export default DelayedSpinner;
