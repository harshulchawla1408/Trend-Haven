import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
function OrderItems() {
  const [orderitems, setorderitems] = useState([]);

  const [params] = useSearchParams();
  const orderid = params.get("oid");

  async function fetchorderproducts() {
    try {
      const resp = await axios.get(
        "http://localhost:9000/api/getorderproducts?orderno=" + orderid
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setorderitems(resp.data.items);
        } else {
          setorderitems([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    fetchorderproducts();
  }, []);

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Order Items</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {orderitems.length > 0 ? (
            <>
              <h2>Order Products</h2>
              <br />
              <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                {orderitems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img src={`uploads/${item.picture}`} height="75" />
                    </td>
                    <td>{item.ProdName}</td>
                    <td>{item.Rate}</td>
                    <td>{item.Qty}</td>
                    <td>{item.TotalCost}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              <br />
            </>
          ) : (
            <h2>No items found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default OrderItems;
