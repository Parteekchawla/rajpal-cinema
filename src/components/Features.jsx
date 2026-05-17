import { motion } from 'framer-motion';

const features = [
  { icon: '🔊', title: 'Dolby Atmos Sound', desc: 'Immersive 3D audio that puts you inside the movie with crystal-clear, multi-dimensional surround sound.' },
  { icon: '💺', title: 'Recliner Seats', desc: 'Premium leather recliners with adjustable positions for maximum comfort throughout your movie experience.' },
  { icon: '🍿', title: 'Gourmet Snack Bar', desc: 'Fresh popcorn, nachos, burgers, cold drinks and more. Pre-order from your seat for instant delivery.' },
  { icon: '🅿️', title: 'Free Parking', desc: 'Ample parking space available for cars and two-wheelers right at the cinema premises.' },
  { icon: '♿', title: 'Wheelchair Access', desc: 'Fully accessible venue with ramps, elevators, and dedicated wheelchair-friendly seating areas.' },
  { icon: '📱', title: 'Online Booking', desc: 'Book tickets instantly via our website or app. Skip the queue with e-tickets on your phone.' },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="section-header">
        <motion.span className="section-label" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          The Experience
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Why Rajpal Cinema?
        </motion.h2>
        <motion.p className="section-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Muktsar's finest cinema experience with world-class amenities and state-of-the-art technology.
        </motion.p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
