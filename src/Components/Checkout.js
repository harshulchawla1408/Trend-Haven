import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-toastify";
function Checkout() {
  const [saddr, setsaddr] = useState();

  const [hname, sethname] = useState();
  const [ccno, setccno] = useState();
  const [exp, setexp] = useState();
  const [cvv, setcvv] = useState();

  const [flag, setflag] = useState(false);
  const [pmode, setpmode] = useState("");
  const [msg, setmsg] = useState();
  const navigate = useNavigate();

  const { udata } = useContext(userContext);

  async function oncheckout(e) {
    e.preventDefault();
    const carddetails = { hname, ccno, exp, cvv };
    const cartinfo = JSON.parse(sessionStorage.getItem("cartdata"));

    const checkoutdata = {
      saddr,
      tbill: sessionStorage.getItem("tbill"),
      uname: udata.username,
      pmode,
      carddetails,
      cartinfo,
    };
    try {
      const resp = await axios.post(
        "http://localhost:9000/api/saveorder",
        checkoutdata
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 0) {
          toast.error("Error while making the payment");
        } else if (resp.data.statuscode === 1) {
          updatestock();
        }
      } else {
        toast.error("Some error occured");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (pmode !== "") {
      if (pmode === "Debit Card / Credit Card") {
        setflag(true);
      } else if (pmode === "Cash on Delivery") {
        setflag(false);
      }
    } else {
      setflag(false);
    }
  }, [pmode]);
  async function updatestock() {
    const cartinfo = {
      cartinfo: JSON.parse(sessionStorage.getItem("cartdata")),
    };
    try {
      const resp = await axios.put(
        "http://localhost:9000/api/updatestock",
        cartinfo
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 0) {
          toast.error("Error while updating stock");
        } else if (resp.data.statuscode === 1) {
          emptycart();
        }
      } else {
        toast.error("Some error occured");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  async function emptycart() {
    try {
      const resp = await axios.delete(
        "http://localhost:9000/api/deletecart?un=" + udata.username
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 0) {
          toast.error("Error while deleting cart");
        } else if (resp.data.statuscode === 1) {
          sessionStorage.removeItem("cartdata");
          navigate("/ordersummary");
        }
      } else {
        toast.error("Some error occured");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Checkout</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          <h2>Checkout</h2>
          <br />
          <div
            className="login-form-grids animated wow slideInUp"
            data-wow-delay=".5s"
          >
            <form name="form1" onSubmit={oncheckout}>
              <textarea
                name="addr"
                required=" "
                onChange={(e) => setsaddr(e.target.value)}
                className="form-control"
                placeholder="Shipping Address"
              ></textarea>
              <br />
              <select
                name="pmode"
                className="form-control"
                required=" "
                onChange={(e) => setpmode(e.target.value)}
              >
                <option value="">Choose Payment Mode</option>
                <option>Cash on Delivery</option>
                <option>Debit Card / Credit Card</option>
              </select>
              <br />

              {flag === true ? (
                <>
                  <div className="key">
                    <input
                      type="text"
                      name="hname"
                      placeholder=" Card holder's Name"
                      onChange={(e) => sethname(e.target.value)}
                      required=""
                    />
                    <div className="clearfix"></div>
                  </div>
                  <div className="key">
                    <input
                      type="text"
                      name="cardno"
                      placeholder="Debit / Credit Card Number"
                      onChange={(e) => setccno(e.target.value)}
                      required=""
                    />
                    <div className="clearfix"></div>
                  </div>
                  <div className="key">
                    <input
                      type="text"
                      name="expdt"
                      placeholder="Expiry Date"
                      onChange={(e) => setexp(e.target.value)}
                      required=""
                    />
                    <div className="clearfix"></div>
                  </div>
                  <div className="key">
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      onChange={(e) => setcvv(e.target.value)}
                      required=""
                    />
                    <div className="clearfix"></div>
                  </div>
                </>
              ) : null}
              <input type="submit" name="btn" value="Make Payment" />
              <br />

              {msg}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Checkout;
