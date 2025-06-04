import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { useCart } from "./CartContext";

function Products() {
  const [params] = useSearchParams();
  const subcatid = params.get("sid");
  const [prodsdata, setprodsdata] = useState([]);
  const navigate = useNavigate();
  const { udata } = useContext(userContext);
  const { addToCart } = useCart();
  
  const handleAddToCart = (product) => {
    if (!udata) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    const productToAdd = {
      _id: product._id,
      picture: product.picture || '',
      pname: product.pname || 'Product',
      Rate: product.Rate - (product.Rate * (product.Discount || 0) / 100),
      quantity: 1,
      Stock: product.Stock || 0
    };
    
    addToCart(productToAdd);
    toast.success("Product added to cart!");
  };
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
                    <div className="product-actions">
                      <div className="button-group">
                        <Link to={`/details?pid=${item._id}`} className="view-details-btn">
                          <i className="fa fa-eye"></i> View Details
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className={`add-to-cart-btn ${item.Stock <= 0 ? 'out-of-stock' : ''}`}
                          disabled={item.Stock <= 0}
                        >
                          <i className="fa fa-shopping-cart"></i>
                          {item.Stock > 0 ? ' Add to Cart' : ' Out of Stock'}
                        </button>
                      </div>
                    </div>
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
