import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";

function Header() {
  const { udata, setudata } = useContext(userContext);
  const navigate = useNavigate();
  const [sterm, setsterm] = useState();
  function onlogout() {
    setudata(null);
    sessionStorage.clear();
    navigate("/homepage");
  }
  function gotocart() {
    navigate("/showcart");
  }
  function onsearch() {
    navigate("/searchresults?s=" + sterm);
  }
  return (
    <>
      <div className="header">
        <div className="header-top">
          <div className="container">
            <div className="top-left">
              {udata === null ? (
                <h4 className="welcome-guest">
                  <b>
                    <span>Welcome Guest</span>
                  </b>
                </h4>
              ) : (
                <h4 className="welcome-user">
                  <b>
                    <span>Welcome {udata.pname}</span>
                  </b>
                </h4>
              )}
            </div>
            <div className="top-right">
              {udata === null ? (
                <ul>
                  <li>
                    <Link to="/register">Create Account </Link>{" "}
                  </li>
                  <li>
                    <Link to="/login">Login </Link>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link to="/orderhistory">Your Orders </Link>{" "}
                  </li>
                  <li>
                    <Link to="/changepassword">Change Password </Link>{" "}
                  </li>
                  <li>
                    <button className="btn btn-primary" onClick={onlogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
        <div className="heder-bottom">
          <div className="container">
            <div className="logo-nav">
              <div className="logo-nav-left">
                <h1>
                  <Link to="/homepage">
                    Trend Haven <span>Elevate Your Style</span>
                  </Link>
                </h1>
              </div>
              <div className="logo-nav-left1">
                <nav className="navbar navbar-default">
                  <div className="navbar-header nav_2">
                    <button
                      type="button"
                      className="navbar-toggle collapsed navbar-toggle1"
                      data-toggle="collapse"
                      data-target="#bs-megadropdown-tabs"
                    >
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                  </div>
                  <div
                    className="collapse navbar-collapse"
                    id="bs-megadropdown-tabs"
                  >
                    <ul className="nav navbar-nav">
                      <li>
                        <Link to="/homepage">Home</Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35f90545c8023f6b49087">
                          Men
                        </Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35fa6545c8023f6b4908b">
                          Women
                        </Link>
                      </li>
                      <li>
                        <Link to="/subcategories?cid=67a35fba545c8023f6b4908e">
                          Kids
                        </Link>
                      </li>
                      <li>
                        <Link to="/contactus">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="header-right2">
                <input
                  type="search"
                  name="Search"
                  placeholder="Search for a Product"
                  onChange={(e) => setsterm(e.target.value)}
                  required=""
                />
                <button
                  type="submit"
                  className="btn btn-default search"
                  onClick={onsearch}
                >
                  <i className="fa fa-search" aria-hidden="true">
                    {" "}
                  </i>
                </button>
                <div className="clearfix"></div>
              </div>
              <div class="header-right2">
                <div class="cart box_1">
                  <Link to="/showcart">
                    <img src="images/bag1.png" alt="" height="30" />
                  </Link>
                  <div class="clearfix"> </div>
                </div>
              </div>
              <div class="clearfix"> </div>
              <div className="clearfix"> </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
