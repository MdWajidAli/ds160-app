import React from "react";

function HeroSection({ scrollToForm }) {
  return (
    <section className="section-hero">
      <div className="hero">
        <div className="hero-text-box">
          <h1 className="heading-primary">
            Scan, Autofill, and Upload: Simplify Your DS-160 with Ease!
          </h1>
          <p className="hero-description">
            Effortlessly streamline your DS-160 application with our app. Simply
            scan Aadhaar and passport images, auto-fill the form, and securely
            upload everything to AWS S3, ensuring a smooth and efficient
            process.
          </p>
          <a
            href="#cta"
            className="btn btn--full margin-right-sm"
            onClick={scrollToForm}
          >
            Get Started
          </a>
        </div>
        <div className="hero-img-box">
          <picture>
            <source srcSet="2.webp" type="image/webp" />
            <source srcSet="2.webp" type="image/png" />
            <img
              src="./2"
              className="hero-img"
              alt="Woman enjoying food, meals in storage container, and food bowls on a table"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
