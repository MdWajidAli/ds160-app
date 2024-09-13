import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import AWS from "aws-sdk";
import "./styles.css";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

function Cta({ formRef }) {
  const [aadharImage, setAadharImage] = useState(null);
  const [passportImage, setPassportImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    aadharNumber: "",
    passportNumber: "",
    dob: "",
  });

  // Process image using Tesseract
  const processImage = (imageFile, isAadhar) => {
    Tesseract.recognize(imageFile, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            ...(isAadhar
              ? { aadharNumber: extractAadharNumber(text) }
              : {
                  passportNumber: extractPassportNumber(text),
                  dob: extractDOB(text),
                }),
          };
          return updatedData;
        });
      })
      .catch((err) => console.error(err));
  };

  // Extract Aadhaar number
  const extractAadharNumber = (text) => {
    const aadharMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
    return aadharMatch ? aadharMatch[0] : "Aadhaar number not found";
  };

  // Extract Passport number
  const extractPassportNumber = (text) => {
    const passportMatch = text.match(/\b[A-Z]\d{7}\b/);
    return passportMatch ? passportMatch[0] : "Passport number not found";
  };

  // Extract Date of Birth
  const extractDOB = (text) => {
    const dobMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    return dobMatch ? dobMatch[0] : "Date of birth not found";
  };

  // Handle Aadhaar upload
  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    setAadharImage(file);
    processImage(file, true); // Process Aadhaar image
  };

  // Handle Passport upload
  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    setPassportImage(file);
    processImage(file, false); // Process Passport image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData);
    const uploadParams = {
      Bucket: "ds160data",
      Key: `formData-${Date.now()}.json`,
      Body: jsonData,
      ContentType: "application/json",
    };
    try {
      const result = await s3.upload(uploadParams).promise();
      console.log("Successfully uploaded data: ", result);
      alert("Data submitted successfully!");
    } catch (err) {
      console.error("Error uploading data: ", err);
    }
  };

  return (
    <section className="section-cta" id="cta" ref={formRef}>
      <div className="container">
        <div className="cta">
          <div className="cta-text-box">
            <h2 className="heading-secondary">Get your DS-160 filled now!!!</h2>
            <form className="cta-form" name="sign-up" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="aadhar-upload">Upload Aadhaar Image</label>
                <input
                  type="file"
                  id="aadhar-upload"
                  accept="image/*"
                  onChange={handleAadharUpload}
                />
              </div>

              <div>
                <label htmlFor="passport-upload">Upload Passport Image</label>
                <input
                  type="file"
                  id="passport-upload"
                  accept="image/*"
                  onChange={handlePassportUpload}
                />
              </div>

              <h2 className="form-title">DS-160 Form</h2>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="aadharNumber">Aadhar Number:</label>
                <input
                  type="text"
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, aadharNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="passportNumber">Passport Number:</label>
                <input
                  type="text"
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passportNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="dob">Date of Birth:</label>
                <input
                  type="text"
                  id="dob"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit" className="btn btn--form">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
