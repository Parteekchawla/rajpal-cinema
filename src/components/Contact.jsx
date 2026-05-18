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
              <p>
                <strong>Rajpal Cinema</strong> (Rajpal Cineplex / SRS Cinemas)<br />
                Malout Road, S.A.S. Nagar<br />
                Sri Muktsar Sahib, Punjab – 152026
              </p>
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
            src="https://maps.google.com/maps?q=Rajpal%20Cinema,%20Malout%20Road,%20Sri%20Muktsar%20Sahib&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
