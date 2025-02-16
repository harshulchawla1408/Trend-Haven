import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
function ShowCart() {
  const [cartdata, setcartdata] = useState([]);
  const [billamt, setbillamt] = useState();
  const { udata } = useContext(userContext);
  const navigate = useNavigate();
  async function fetchcart() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/getcart?un=${udata.username}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setcartdata(resp.data.cartinfo);
          sessionStorage.setItem(
            "cartdata",
            JSON.stringify(resp.data.cartinfo)
          );
        } else {
          setcartdata([]);
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
      fetchcart();
    }
  }, [udata]);

  useEffect(() => {
    var gtotal = 0;
    for (var x = 0; x < cartdata.length; x++) {
      gtotal = gtotal + cartdata[x].TotalCost;
    }
    setbillamt(gtotal);
  }, [cartdata]);

  async function oncartdel(id) {
    var userresp = window.confirm("Are you sure to delete");
    if (userresp === true) {
      const resp = await axios.delete(
        `http://localhost:9000/api/delcartitem/${id}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          alert("Item  removed from cart");

          fetchcart();
        } else if (resp.data.statuscode === 0) {
          alert("Error while removing");
        }
      } else {
        alert("Some error occured");
      }
    }
  }

  function oncheckout() {
    sessionStorage.setItem("tbill", billamt);
    navigate("/checkout");
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Your Cart</span>
          </h3>
        </div>
      </div>

      <div className="login">
        <div className="container">
          {cartdata.length > 0 ? (
            <>
              <h2>Your shopping cart</h2>
              <br />
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cartdata.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={`uploads/${item.picture}`} height="75" />
                      </td>
                      <td>{item.ProdName}</td>
                      <td>{item.Rate}</td>
                      <td>{item.Qty}</td>
                      <td>{item.TotalCost}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => oncartdel(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h5>
                {cartdata.length} item(s) available in your cart
                <br />
                <br />
                Rs.{billamt}/- is your total bill <br />
                <br />
              </h5>
              <button
                name="btn"
                className="btn btn-primary"
                onClick={oncheckout}
              >
                Checkout
              </button>
            </>
          ) : (
            <h2>No products added yet in cart</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default ShowCart;
