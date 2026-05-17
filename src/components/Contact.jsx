import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section-header">
        <motion.span className="section-label" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Visit Us
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Find Rajpal Cinema
        </motion.h2>
      </div>

      <div className="contact-grid">
        <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>New Grain Market, Malout Road<br />S.A.S. Nagar, Sri Muktsar Sahib<br />Punjab – 152026, India</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🕐</div>
            <div>
              <h4>Operating Hours</h4>
              <p>Daily: 9:00 AM – 11:00 PM<br />Box Office opens 30 min before first show</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p>Contact the cinema for enquiries<br />and group bookings</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🎬</div>
            <div>
              <h4>Screens</h4>
              <p>3 Screens – Dolby Atmos, Standard & Recliner<br />Total capacity: 600+ seats</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="contact-map" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789!2d74.5167!3d30.4767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919b5e5b5b5b5b5%3A0x1234567890abcdef!2sRajpal%20Cinema%2C%20Muktsar!5e0!3m2!1sen!2sin!4v1234567890"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rajpal Cinema Location"
          />
        </motion.div>
      </div>
    </section>
  );
}
