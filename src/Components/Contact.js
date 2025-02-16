import React from "react";
import { Link } from "react-router-dom";

function ContactUs() {
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Contact Us</span>
          </h3>
        </div>
      </div>

      <div className="contact-info">
        <div className="container">
          <h3>
            We value your feedback and are here to assist you with any inquiries
            or concerns. <br />
            Feel free to reach out to us through the following contact details:
          </h3>
          <br />
          <div className="contact-details">
            <div className="contact-item">
              <h3>Phone</h3>
              <p>1800-2110-1408</p>
            </div>
            <div className="contact-item">
              <h3>Email</h3>
              <p>info@trendhaven.com</p>
            </div>
            <div className="contact-item">
              <h3>Address</h3>
              <p>123 Main St, Mumbai, Maharashtra, 400001, India</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-us {
          font-family: Arial, sans-serif;
        }
        .contact-info {
          padding: 40px 0;
        }
        .contact-info h2 {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }
        .contact-details {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .contact-item {
          flex: 1;
          max-width: 300px;
          text-align: center;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #1565c0;
          color: white;
        }
        .contact-item h3 {
          margin-bottom: 20px;
        }
        .contact-item p {
          margin: 0;
          font-size: 18px;
        }
      `}</style>
    </>
  );
}

export default ContactUs;
