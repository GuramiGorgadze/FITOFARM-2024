import React from 'react';
import Logo from '../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="top">
        <div className="column">
          <h2>Privacy Policy</h2>

          <div className="links">
            <div className="link">Terms of Use</div>
            <div className="link">Data Privacy</div>
            <div className="link">Cookie Managment</div>
            <div className="link">Sitemap</div>
          </div>
        </div>

        <div className="column">
          <h2>Follow Us</h2>

          <div className="links">
            <a className="link" href='https://www.facebook.com/' target='blank'>Facebook</a>
            <a className="link" href='https://www.linkedin.com/' target='blank'>Linked In</a>
            <a className="link" href='https://www.instagram.com/' target='blank'>Instagram</a>
            <a className="link" href='https://www.youtube.com/' target='blank'>Youtube</a>
          </div>
        </div>

        <div className="column">
          <h2>Contact Us</h2>

          <div className="links">
            <div className="link">Media</div>
          </div>
        </div>

        <div className="column">
          <h2>Contact Information</h2>

          <div className="links">
            <div className="link">საქართველო, თბილისი, წერეთლის 142ა.</div>
            <div className="link">საქართველო, ქალაქი ტყიბული, სოფ. დაბაძველი</div>
            <div className="link">ტელ.: 599 14 21 18</div>
          </div>
        </div>

        <div className="column">
          <div className="title">
            {' '}
            <img
              className="logo"
              src={Logo}
              alt=""
            />
            <div className="title-text">FitoFarm-2024</div>
          </div>

          <p className="slogan">A Natural Path to Well-Being</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="bottom">
        <p>© 2026 FitoFarm-2024. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
