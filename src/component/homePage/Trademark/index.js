import adidas from 'image/adidas.png';
import converse from 'image/converse.jpg';
import newBalance from 'image/newBalance.jpg';
import nike from 'image/nike.jpg';
import puma from 'image/puma.jpg';
import { Link } from 'react-router-dom';
import vans from 'image/vans.jpg';
import './style.css';
export default function Trademark() {
  return (
    <div className="group-trademark">
      <h3>THƯƠNG HIỆU</h3>
      <div className="container-trademark">
        <ul>
          <li>
            <Link
              to="/product/adidas"
            >
              <img src={adidas} alt="adidas" />
            </Link>
          </li>
          <li>
            <Link
              to="/product/converse"
            >
              <img src={converse} alt="converse" />
            </Link>
          </li>
          <li>
            <Link
              to="/product/newBalance"
            >
              <img src={newBalance} alt="newBalance" />
            </Link>
          </li>
          <li>
            <Link
              to="/product/nike"
            >
              <img src={nike} alt="nike" />
            </Link>
          </li>
          <li>
            <Link
              to="/product/puma"
            >
              <img src={puma} alt="puma" />
            </Link>
          </li>
          <li>
            <Link
              to="/product/vans"
            >
              <img src={vans} alt="vans" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
};