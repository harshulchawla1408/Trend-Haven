import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
function OrderHistory() {
  const [ordersdata, setordersdata] = useState([]);
  const navigate = useNavigate();
  const { udata } = useContext(userContext);
  async function fetchorders() {
    try {
      const resp = await axios.get(
        "http://localhost:9000/api/getuserorders?un=" + udata.username
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setordersdata(resp.data.ordersdata);
        } else {
          setordersdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    if (udata !== null) {
      fetchorders();
    }
  }, [udata]);

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>List of Orders</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {ordersdata.length > 0 ? (
            <>
              <h2>List of Orders</h2>
              <br />
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Address</th>
                    <th>Bill Amount</th>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersdata.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link to={`/orderitems?oid=${item._id}`}>
                          {item._id}
                        </Link>
                      </td>
                      <td>{item.saddress}</td>
                      <td>{item.billamt}</td>
                      <td>{item.username}</td>
                      <td>{item.OrderDate}</td>
                      <td>{item.PayMode}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h3>Number of Orders : {ordersdata.length} </h3>
            </>
          ) : (
            <h2>No orders found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default OrderHistory;
