import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { useCart } from "./CartContext";
import "./style.css";

function Details() {
  const [params] = useSearchParams();
  const prodid = params.get("pid");

  const [proddata, setproddata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remcost, setremcost] = useState(0);
  const [qty, setqty] = useState(1);
  const [tc, settc] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [stock, setstock] = useState([]);
  const navigate = useNavigate();

  const { udata } = useContext(userContext);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchproddetails();
  }, [prodid]);

  useEffect(() => {
    if (!proddata) return;
    
    if (proddata.Rate !== undefined && proddata.Discount !== undefined) {
      const discountedPrice =
        proddata.Rate - (proddata.Discount * proddata.Rate) / 100;
      const roundedPrice = parseFloat(discountedPrice.toFixed(2));
      setremcost(roundedPrice);
      setDiscountedPrice(roundedPrice);
    } else {
      setremcost(proddata.Rate || 0);
    }

    const stockArr = [];
    const stockLimit = proddata.Stock > 10 ? 10 : (proddata.Stock || 0);
    for (let x = 1; x <= stockLimit; x++) {
      stockArr.push(x);
    }
    setstock(stockArr);
  }, [proddata]);

  useEffect(() => {
    const total = parseFloat((remcost * qty).toFixed(2));
    settc(total);
  }, [qty, remcost]);

  async function fetchproddetails() {
    console.log('Fetching product details for ID:', prodid);
    if (!prodid) {
      console.error('No product ID provided');
      toast.error('Invalid product ID');
      setproddata(null);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await axios.get(
        `http://localhost:9000/api/getproddetails?pid=${prodid}`
      );
      
      console.log('Full API Response:', {
        status: resp.status,
        statusText: resp.statusText,
        data: resp.data,
        headers: resp.headers
      });
      
      if (resp.status === 200) {
        // Check different possible response formats
        let productData = null;
        
        // Case 1: Direct product data
        if (resp.data && (resp.data._id || resp.data.pname)) {
          productData = resp.data;
        } 
        // Case 2: Nested in data property
        else if (resp.data && resp.data.data && (resp.data.data._id || resp.data.data.pname)) {
          productData = resp.data.data;
        }
        // Case 3: With statuscode and product property
        else if (resp.data && resp.data.statuscode === 1 && resp.data.product) {
          productData = resp.data.product;
        }
        // Case 4: With statuscode and proddata property (legacy)
        else if (resp.data && resp.data.statuscode === 1 && resp.data.proddata) {
          productData = resp.data.proddata;
        }

        if (productData) {
          console.log('Parsed product data:', productData);
          setproddata(productData);
          return;
        } else {
          console.error('Unexpected response format:', resp.data);
          toast.error('Unexpected product data format');
        }
      } else {
        console.error('Unexpected status code:', resp.status);
        toast.error(`Server returned status: ${resp.status}`);
      }
      
      setproddata(null);
    } catch (err) {
      console.error('Error fetching product:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          params: err.config?.params
        }
      });
      toast.error("Error: " + (err.response?.data?.message || err.message));
      setproddata(null);
    } finally {
      setIsLoading(false);
    }
  }

  function addtocart() {
    if (!proddata) return;
    
    if (udata === null) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    const productToAdd = {
      _id: prodid,
      picture: proddata.picture || '',
      pname: proddata.pname || 'Product',
      Rate: remcost,
      quantity: parseInt(qty) || 1,
      Stock: proddata.Stock || 0
    };
    
    addToCart(productToAdd);
    toast.success("Product added to cart!");
    
    // Optional: Navigate to cart after adding
    // navigate("/showcart");
  }

  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!proddata) {
    return <div className="error">Product not found</div>;
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
              {proddata.picture && (
                <img
                  src={`uploads/${proddata.picture}`}
                  alt={proddata.pname || 'Product image'}
                  className="img-responsive"
                />
              )}
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
                  Price: ₹{remcost.toFixed(2)}{" "}
                  {proddata.Discount > 0 && (
                    <span className="original-price">₹{parseFloat(proddata.Rate).toFixed(2)}</span>
                  )}
                </h4>
                {proddata.Discount > 0 && (
                  <div className="discount-badge">
                    {proddata.Discount}% OFF
                  </div>
                )}
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
