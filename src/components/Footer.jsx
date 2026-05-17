export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div className="nav-logo-icon">RC</div>
            <div className="nav-logo-text">Rajpal <span>Cinema</span></div>
          </div>
          <p>
            Muktsar's premier movie destination since decades. Experience the magic of cinema
            with cutting-edge technology and unmatched comfort.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#now-showing">Now Showing</a>
          <a href="#coming-soon">Coming Soon</a>
          <a href="#features">Experience</a>
          <a href="#contact">Contact Us</a>
        </div>

        <div className="footer-col">
          <h4>Cinema Info</h4>
          <a href="#">Pricing</a>
          <a href="#">Group Bookings</a>
          <a href="#">Private Screenings</a>
          <a href="#">Advertise With Us</a>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
          <a href="#">Accessibility</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rajpal Cinema, Muktsar. All rights reserved.</span>
        <div className="footer-social">
          <a href="#" title="Facebook">📘</a>
          <a href="#" title="Instagram">📸</a>
          <a href="#" title="YouTube">▶️</a>
          <a href="#" title="WhatsApp">💬</a>
        </div>
      </div>
    </footer>
  );
}
