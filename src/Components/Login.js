import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-toastify";
function Login() {
  const [uname, setuname] = useState();
  const [pass, setpass] = useState();
  const [msg, setmsg] = useState();
  const navigate = useNavigate();
  const { udata, setudata } = useContext(userContext);

  async function onlogin(e) {
    e.preventDefault();
    const logindata = { uname, pass };
    try {
      const resp = await axios.post(
        "http://localhost:9000/api/login",
        logindata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 0) {
          toast.warn("Incorrect Username/Password");
        } else if (resp.data.statuscode === 1) {
          setudata(resp.data.pdata);
          sessionStorage.setItem("userdata", JSON.stringify(resp.data.pdata));
          navigate("/homepage");
          toast.success("Logged in successfully");
        }
      } else {
        toast.warn("Some error occured");
      }
    } catch (err) {}
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Login</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile">
            <h3>Login</h3>
            <form name="form1" onSubmit={onlogin}>
              <div className="key">
                <i className="fa fa-envelope" aria-hidden="true"></i>
                <input
                  type="text"
                  name="un"
                  placeholder="Email Address(Username)"
                  onChange={(e) => setuname(e.target.value)}
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="pass"
                  placeholder="Password"
                  required=" "
                  onChange={(e) => setpass(e.target.value)}
                />
                <div className="clearfix"></div>
              </div>
              <input type="submit" name="btn" value="Login" />
              {msg}
            </form>
          </div>
          <div className="forg">
            <Link to="/register">Create Account</Link>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
