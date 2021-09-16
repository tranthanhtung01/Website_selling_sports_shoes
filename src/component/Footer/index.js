import { useContext } from 'react';
import { UserOutlined } from '@ant-design/icons';
// image
import cash from 'image/cash.jpg';
import installment from 'image/installment.jpg';
import internet_banking from 'image/internet_banking.jpg';
import jcb from 'image/jcb.jpg';
import mastercard from 'image/mastercard.jpg';
import visa from 'image/visa.jpg';
// Context
import { UserContext } from 'contexts/UserContext';
import './style.css';
export default function Footer() {
  const state = useContext(UserContext);
  const [UserOnline] = state.UserOnline;
  return (
    <>
      <div className="frames-group-footer">
        <div className="group-footer">
          <div className="footer">
            <div className="group-information-user">
              <h3>HỖ TRỢ KHÁCH HÀNG</h3>
              <ul>
                <li>Các câu hỏi thường gặp</li>
                <li>Gửi yêu cầu hỗ trợ</li>
                <li>Hướng dẫn đặt hàng</li>
                <li>Phương thức vận chuyển</li>
                <li>Chính sách đổi trả</li>
                <li>Hướng dẫn mua trả góp</li>
              </ul>
            </div>
            <div className="group-information-website">
              <h3>VỀ SHOP</h3>
              <ul>
                <li>Giới thiệu</li>
                <li>Tuyển Dụng</li>
                <li>Chính sách bảo mật thanh toán</li>
                <li>Chính sách bảo mật thông tin cá nhân</li>
                <li>Chính sách giải quyết khiếu nại</li>
                <li>Điều khoản sử dụng</li>
              </ul>
            </div>
            <div className="group-payment">
              <h3>PHƯƠNG THỨC THANH TOÁN</h3>
              <ul>
                <li><img src={cash} alt="cash" /></li>
                <li><img src={installment} alt="installment" /></li>
                <li><img src={internet_banking} alt="internet_banking" /></li>
                <li><img src={jcb} alt="jcb" /></li>
                <li><img src={mastercard} alt="mastercard" /></li>
                <li><img src={visa} alt="visa" /></li>
              </ul>
            </div>
            <div className="group-connect-us">
              <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
              <ul>
                <li>
                  <a href="https://www.facebook.com/totentung.chao" target="_blank" rel="noreferrer noopener"><i className="fa fa-facebook" /></a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer noopener"><i className="fa fa-linkedin" /></a>
                </li>
                <li>
                  <a href="https://github.com/tranthanhtung01" target="_blank" rel="noreferrer noopener"><i class="fa fa-github" /> </a>
                </li>
                <li>
                  <a href="http://kaitomovie.cf/" target="_blank" rel="noreferrer noopener"><i className="fa fa-external-link" /></a>
                </li>
              </ul>
              <div className="user-online">
                <p>Online   <UserOutlined /> {UserOnline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};