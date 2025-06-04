import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

function ShowCart() {
  const [billamt, setBillAmt] = useState(0);
  const { udata } = useContext(userContext);
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total bill whenever cart items change
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.Rate * item.quantity);
    }, 0);
    setBillAmt(total);
  }, [cartItems]);

  const handleRemoveItem = (productId, productName) => {
    toast.info(
      <div>
        <p>Remove {productName || 'this item'} from cart?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => {
              toast.dismiss();
              removeFromCart(productId);
              toast.success(`${productName || 'Item'} removed from cart!`);
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Remove
          </button>
          <button 
            onClick={() => toast.dismiss()}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        style: { width: '300px' }
      }
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty! Add some items before checkout.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    sessionStorage.setItem("tbill", billamt);
    navigate("/checkout");
  };
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
          {cartItems.length > 0 ? (
            <>
              <h2>Your Shopping Cart ({cartItems.length} items)</h2>
              <br />
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img 
                          src={item.picture ? `uploads/${item.picture}` : '/placeholder.jpg'} 
                          alt={item.pname} 
                          height="75" 
                        />
                      </td>
                      <td>{item.pname || 'Product Name'}</td>
                      <td>₹{Number(item.Rate || 0).toFixed(2)}</td>
                      <td>{item.quantity || 1}</td>
                      <td>₹{((item.Rate || 0) * (item.quantity || 1)).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(item._id, item.pname || 'Item')}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <h5>
                {cartItems.length} item(s) available in your cart
                <br />
                <br />
                Rs. {billamt.toFixed(2)} is your total bill <br />
                <div className="text-right">
                  <h4>Grand Total: ₹{billamt.toFixed(2)}</h4>
                  <br />
                  <button
                    className="btn btn-success"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => clearCart()}
                  >
                    Clear Cart
                  </button>
                </div>
              </h5>
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
