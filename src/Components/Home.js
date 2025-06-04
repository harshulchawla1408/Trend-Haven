import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./style.css";

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "400px",
};
const slideImages = [
  {
    url: "images/b1.jpg",
    caption: "Slide 1",
  },
  {
    url: "images/b3.jpg",
    caption: "Slide 2",
  },
  {
    url: "images/b4.jpg",
    caption: "Slide 4",
  },
];
function Home() {
  const [prodsdata, setProdsdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

async function fetchlatestprods() {
  setIsLoading(true);
  setError(null);
  
  try {
    const resp = await axios.get(`http://localhost:9000/api/fetchnewprods`, {
      timeout: 10000
    });
    
    if (resp.data.statuscode === 1) {
      setProdsdata(resp.data.proddata || []);
    } else {
      setProdsdata([]);
      console.log('No products found or empty response');
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products. Please try again later.');
    setProdsdata([]);
  } finally {
    setIsLoading(false);
  }
}

// Call this in useEffect
useEffect(() => {
  fetchlatestprods();
}, []);
  return (
    <>
      <div className="login">
        <div className="container">
          <div className="slide-container">
            <Slide>
              {slideImages.map((slideImage, index) => (
                <div key={index}>
                  <div
                    style={{
                      ...divStyle,
                      backgroundImage: `url(${slideImage.url})`,
                    }}
                  ></div>
                </div>
              ))}
            </Slide>
          </div>

          <main className="main-content">
            <section className="hero-section">
              <h1 className="main-tagline">
                Trend Haven – Where Style Meets Elegance
              </h1>
            </section>
            <section className="products-section">
              <h2 className="section-heading">Latest Products</h2>
              {isLoading ? (
                <div className="loading">Loading products...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : prodsdata.length === 0 ? (
                <div className="no-products">No products found</div>
              ) : (
                <div className="products-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px',
                  padding: '20px 0'
                }}>
                  {prodsdata.map((item, index) => (
                    <div className="product-card" key={index} style={{
                      background: '#fff',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      position: 'relative'
                    }}>
                      {item.Discount > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: '#ff6b6b',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          zIndex: '1'
                        }}>
                          {item.Discount}% OFF
                        </div>
                      )}
                      <Link to={`/details?pid=${item._id}`} style={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}>
                        <div style={{
                          width: '100%',
                          height: '200px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          borderBottom: '1px solid #eee'
                        }}>
                          <img
                            src={`/uploads/${item.picture}`}
                            alt={item.pname}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        </div>
                        <div style={{ padding: '15px' }}>
                          <h3 style={{
                            margin: '0 0 10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#333',
                            minHeight: '40px',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.pname}
                          </h3>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '15px'
                          }}>
                            {item.Discount > 0 ? (
                              <>
                                <span style={{
                                  color: '#ff6b6b',
                                  fontSize: '18px',
                                  fontWeight: 'bold'
                                }}>
                                  ₹{Math.round(item.Rate - (item.Rate * item.Discount / 100))}
                                </span>
                                <span style={{
                                  color: '#999',
                                  textDecoration: 'line-through',
                                  fontSize: '14px'
                                }}>
                                  ₹{item.Rate}
                                </span>
                              </>
                            ) : (
                              <span style={{
                                color: '#333',
                                fontSize: '18px',
                                fontWeight: 'bold'
                              }}>
                                ₹{item.Rate}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div style={{
                        padding: '0 15px 15px',
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <Link 
                          to={`/details?pid=${item._id}`} 
                          className="view-details-btn"
                          style={{
                            flex: '1',
                            textAlign: 'center',
                            padding: '8px 0',
                            background: '#4CAF50',
                            color: 'white',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <i className="fa fa-eye"></i> View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
      <div className="accessories-w3l">
        <div className="container">
          <h3 className="tittle">20% Discount on</h3>
          <span>TRENDING DESIGNS</span>
          <div className="button">
            <Link to="/categories" className="button1">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
