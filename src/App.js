import React, { useRef } from "react";
import HeroSection from "./Herosection";
import Cta from "./Cta";
import "./styles.css";

function App() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <HeroSection scrollToForm={scrollToForm} />
      <Cta formRef={formRef} />
    </div>
  );
}

export default App;
