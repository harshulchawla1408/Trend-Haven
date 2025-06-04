import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footer-w3l">
        <div className="container">
          <div className="footer-grids">
            <div className="col-md-3 footer-grid">
              <h4>About </h4>
              <p>
                Discover the latest in fashion and lifestyle at Trend Haven. Our
                curated collection brings you the best in style and quality.
                Shop with us and elevate your trend game. Follow us on social
                media for exclusive updates.
                <br />
                Trend Haven – where style meets elegance.
              </p>
              <div className="social-icon">
                <a href="https://www.facebook.com">
                  <i className="icon"></i>
                </a>
                <a href="https://www.twitter.com">
                  <i className="icon1"></i>
                </a>
                <a href="https://www.google.com">
                  <i className="icon2"></i>
                </a>
                <a href="https://www.linkedin.com">
                  <i className="icon3"></i>
                </a>
              </div>
            </div>
            <div className="col-md-3 footer-grid">
              <h4>My Account</h4>
              <ul>
                <li>
                  <Link to="/showcart">My Cart</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Create Account </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 footer-grid">
              <h4>Information</h4>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/categories">Categories</Link>
                </li>
                <li>
                  <Link to="/contactus">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 footer-grid foot">
              <h4>Contacts</h4>
              <ul>
                <li>
                  <i
                    className="glyphicon glyphicon-map-marker"
                    aria-hidden="true"
                  ></i>
                  <a href="#">
                    123 Main St, Mumbai, Maharashtra, 400001, India
                  </a>
                </li>
                <li>
                  <i
                    className="glyphicon glyphicon-earphone"
                    aria-hidden="true"
                  ></i>
                  <a href="#">1800-2110-1408</a>
                </li>
                <li>
                  <i
                    className="glyphicon glyphicon-envelope"
                    aria-hidden="true"
                  ></i>
                  <a href="mailto:info@trendhaven.com"> info@trendhaven.com</a>
                </li>
              </ul>
            </div>
            <div className="clearfix"> </div>
          </div>
        </div>
      </div>
      <div class="copy-section">
        <div class="container">
          <div class="copy-left">
            <p>
              &copy; 2025 TREND HAVEN . All rights reserved |
            </p>
          </div>
          <div class="copy-right">
            <img src="images/card.png" alt="" />
          </div>
          <div class="clearfix"></div>
        </div>
      </div> 
    </>
  );
}
export default Footer;
