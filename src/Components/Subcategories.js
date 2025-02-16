import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Subcategories() {
  const [params] = useSearchParams();
  const catid = params.get("cid");
  const [subcatdata, setsubcatdata] = useState([]);

  async function fetchsubcatbycat() {
    try {
      const resp = await axios.get(
        `http://localhost:9000/api/getallsubcat?cid=${catid}`
      );
      if (resp.status === 200) {
        if (resp.data.statuscode === 1) {
          setsubcatdata(resp.data.subcatdata);
        } else {
          setsubcatdata([]);
        }
      } else {
        alert("Some error occured");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (catid !== "") {
      fetchsubcatbycat();
    }
  }, [catid]);
  return (
    <>
      <div className="banner1">
        <div className="container">
          <h3>
            <Link to="/">Home</Link> / <span>Sub-Categories</span>
          </h3>
        </div>
      </div>
      <div className="login">
        <div className="container">
          {subcatdata.length > 0 ? (
            subcatdata.map((item, index) => (
              <div className="col-md-4 top_brand_left" key={index}>
                <div className="hover14 column">
                  <div className="agile_top_brand_left_grid">
                    <div className="agile_top_brand_left_grid1">
                      <figure>
                        <div className="snipcart-item block">
                          <div className="snipcart-thumb">
                            <Link to={`/products?sid=${item._id}`}>
                              <img
                                title=" "
                                alt=" "
                                src={`uploads/${item.subcatpic}`}
                                height="125"
                              />
                              <h3>{item.subcatname}</h3>
                            </Link>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No Subcategories found</h2>
          )}
        </div>
      </div>
    </>
  );
}
export default Subcategories;

//css
<style jsx>
  {`
    /* Container for the subcategory section */
    .login {
      padding: 20px 0;
      background-color: #fafafa;
    }

    .login .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: space-between;
    }

    .col-md-4 {
      flex: 1 1 calc(33.333% - 20px); /* Adjusts the card size to fit three items per row */
      max-width: calc(33.333% - 20px);
    }

    .top_brand_left {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .top_brand_left:hover {
      transform: translateY(-10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .agile_top_brand_left_grid {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .agile_top_brand_left_grid1 {
      width: 100%;
    }

    .snipcart-item {
      width: 100%;
    }

    .snipcart-thumb {
      margin-bottom: 10px;
      position: relative;
    }

    .snipcart-thumb img {
      width: 100%;
      height: 150px; /* Fixed height for images */
      object-fit: cover; /* Ensures aspect ratio is maintained and fills the container */
      border-radius: 8px;
      transition: opacity 0.3s;
    }

    .snipcart-thumb img:hover {
      opacity: 0.8;
    }

    .snipcart-thumb h3 {
      font-size: 14px;
      margin: 10px 0;
      color: #333;
      font-weight: bold;
    }

    .snipcart-thumb a {
      text-decoration: none;
      color: inherit;
    }

    @media (max-width: 768px) {
      .col-md-4 {
        flex: 1 1 100%;
        max-width: 100%;
      }
    }

    @media (max-width: 480px) {
      .snipcart-thumb h3 {
        font-size: 12px;
      }
    }
  `}
</style>;
