import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Products() {
  const [params] = useSearchParams();
  const subcatid = params.get("sid");
  const [prodsdata, setprodsdata] = useState([]);
  useEffect(() => {
    if (subcatid !== "") {
      fetchprodsbysubcat();
    }
  }, [subcatid]);

  async function fetchprodsbysubcat() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/fetchprodsbysubcatid?sid=${subcatid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setprodsdata(resp.data.proddata);
        } else {
          setprodsdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Products</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {prodsdata.length > 0 ? (
            <div className="product-list">
              {prodsdata.map((item, index) => (
                <div className="product-list-item" key={index}>
                  <div className="product-list-item-image">
                    <Link to={`/details?pid=${item._id}`}>
                      <img
                        title={item.pname}
                        alt={item.pname}
                        src={`uploads/${item.picture}`}
                      />
                    </Link>
                  </div>
                  <div className="product-list-item-details">
                    <Link to={`/details?pid=${item._id}`}>
                      <h3>{item.pname}</h3>
                    </Link>
                    <div className="product-pricing">
                      {item.Discount && item.Discount > 0 ? (
                        <>
                          <span className="discounted-price">
                            ₹{Math.round(item.Rate - (item.Rate * item.Discount / 100))}
                          </span>
                          <span className="original-price">₹{item.Rate}</span>
                        </>
                      ) : (
                        <span className="current-price">₹{item.Rate}</span>
                      )}
                    </div>
                    {/* You can add more details here like short description etc. */}
                    <Link to={`/details?pid=${item._id}`} className="view-details-btn">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2>No products found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default Products;
