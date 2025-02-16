import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import "./style.css";

function Details() {
  const [params] = useSearchParams();
  const prodid = params.get("pid");

  const [proddata, setproddata] = useState({});
  const [remcost, setremcost] = useState(0);
  const [qty, setqty] = useState(1);
  const [tc, settc] = useState(0);
  const [stock, setstock] = useState([]);
  const navigate = useNavigate();

  const { udata } = useContext(userContext);

  useEffect(() => {
    fetchproddetails();
  }, [prodid]);

  useEffect(() => {
    if (proddata.Rate && proddata.Discount) {
      const discountedPrice =
        proddata.Rate - (proddata.Discount * proddata.Rate) / 100;
      setremcost(discountedPrice);
    }

    const stockArr = [];
    const stockLimit = proddata.Stock > 10 ? 10 : proddata.Stock;
    for (let x = 1; x <= stockLimit; x++) {
      stockArr.push(x);
    }
    setstock(stockArr);
  }, [proddata]);

  useEffect(() => {
    settc(remcost * qty);
  }, [qty, remcost]);

  async function fetchproddetails() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/getproddetails?pid=${prodid}`
      );
      if (resp.status === 200 && resp.data.statuscode === 1) {
        setproddata(resp.data.proddata);
      } else {
        setproddata({});
      }
    } catch (err) {
      toast.error("Error fetching product details: " + err.message);
    }
  }

  async function addtocart() {
    if (udata === null) {
      toast.info("Please login to add to cart");
      navigate("/login");
    } else {
      const cartdata = {
        pid: prodid,
        picture: proddata.picture,
        pname: proddata.pname,
        rate: remcost,
        qty: qty,
        tc: tc,
        username: udata.username,
      };

      try {
        const resp = await axios.post(
          "http://localhost:9000/api/savetocart",
          cartdata
        );
        if (resp.status === 200 && resp.data.statuscode === 1) {
          navigate("/showcart");
        } else {
          toast.warning("Problem while adding to cart, try again");
        }
      } catch (err) {
        toast.warning("Error: " + err.message);
      }
    }
  }

  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Product Details</span>
          </h3>
        </div>
      </div>
      <div className="products">
        <div className="container">
          <div className="product-details">
            <div className="product-image">
              <img
                src={`uploads/${proddata.picture}`}
                alt={proddata.pname}
                className="img-responsive"
              />
            </div>
            <div className="product-info">
              <h2>{proddata.pname}</h2>
              <div className="product-description">
                <h4>Description:</h4>
                <p>{proddata.Description}</p>
              </div>
              <br />
              <div className="product-pricing">
                <h4>
                  Price: ₹{remcost}{" "}
                  <span className="original-price">₹{proddata.Rate}</span>
                </h4>
              </div>
              {proddata.Stock > 0 ? (
                <div className="add-to-cart">
                  <form>
                    <fieldset>
                      <label htmlFor="quantity">Quantity:</label>
                      <select
                        id="quantity"
                        className="form-control"
                        onChange={(e) => setqty(e.target.value)}
                      >
                        <option value="">Choose Quantity</option>
                        {stock.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <br />
                      <input
                        type="button"
                        value="Add to cart"
                        onClick={addtocart}
                        className="button"
                      />
                    </fieldset>
                  </form>
                </div>
              ) : (
                <b>Out of Stock</b>
              )}
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
