import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [msg, setmsg] = useState("");
  const [terms, setTerms] = useState(false);

  async function onRegister(e) {
    e.preventDefault();
    if (terms === true) {
      if (pass === cpass) {
        const regdata = { name, phone, uname, pass };
        try {
          const resp = await axios.post(
            "http://localhost:9000/api/signup",
            regdata
          );
          setmsg(resp.data.msg);
          toast.success("Signup successfull");
        } catch (err) {
          setmsg(err.message);
          toast.error("Signup failed");
        }
      } else {
        toast.warn("Password and Confirm Password does not match");
      }
    } else {
      toast.warn("Please accept terms & conditions");
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Register</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="main-agileits">
          <div className="form-w3agile form1">
            <h3>Register</h3>
            <form name="form1" onSubmit={onRegister}>
              <div className="key">
                <i className="fa fa-user" aria-hidden="true"></i>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-phone" aria-hidden="true"></i>
                <input
                  type="tel"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-envelope" aria-hidden="true"></i>
                <input
                  type="email"
                  name="un"
                  onChange={(e) => setUname(e.target.value)}
                  placeholder="Email Address (Username)"
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="pass"
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Password"
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <div className="key">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  type="password"
                  name="cpass"
                  onChange={(e) => setCpass(e.target.value)}
                  placeholder="Confirm Password"
                  required=""
                />
                <div className="clearfix"></div>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="cbx1"
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <i></i>I accept the terms and conditions
              </label>
              <input type="submit" name="btn" value="Register" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
