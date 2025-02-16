import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./style.css";
function OrderSummary() {
  const { udata, setudata } = useContext(userContext);
  const [orderinfo, setorderinfo] = useState({});

  async function fetchorderid() {
    try {
      const resp = await axios.get(
        "http://localhost:9000/api/getorderid?un=" + udata.username
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setorderinfo(resp.data.orderdata);
        } else {
          toast.error("Error while fetching details");
        }
      } else {
        toast.error("Some error occurred");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (udata !== null) {
      fetchorderid();
    }
  }, [udata]);

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Order Summary</span>
          </h3>
        </div>
      </div>
      <div className="order-summary">
        <div className="container">
          <div className="order-summary-header">
            <h1>Thank you for shopping with us, {udata?.pname}!</h1>
            <h3>
              Your order has been placed successfully. Below are your order
              details:
            </h3>
          </div>
          <div className="order-details">
            <h2>Order Information :</h2>
            <br />
            <br />
            <h4>
              <strong>Order ID:</strong> {orderinfo._id}
            </h4>
            <h4>
              <strong>Date:</strong> {orderinfo.OrderDate}
            </h4>
            <h4>
              <strong>Total Amount:</strong> ₹{orderinfo.billamt}
            </h4>
            <h4>
              <strong>Payment Mode:</strong> {orderinfo.PayMode}
            </h4>
          </div>
          <div className="order-actions">
            <Link to="/categories" className="button">
              Continue Shopping
            </Link>
            <Link to="/orderhistory" className="button">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
