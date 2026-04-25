import { motion } from 'framer-motion';

const ANIMALS = [
  { emoji: '🐄', x: '5%', delay: 0, duration: 18 },
  { emoji: '🐓', x: '20%', delay: 2, duration: 14 },
  { emoji: '🐑', x: '40%', delay: 1, duration: 20 },
  { emoji: '🐐', x: '60%', delay: 3, duration: 16 },
  { emoji: '🦆', x: '80%', delay: 0.5, duration: 12 },
];

export default function AnimatedAnimals() {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', overflow: 'hidden', pointerEvents: 'none' }}>
      {ANIMALS.map((a, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', bottom: '20px', left: a.x, fontSize: '2.5rem' }}
          animate={{ y: [0, -15, 0], x: [0, 10, -10, 0] }}
          transition={{ duration: a.duration / 4, repeat: Infinity, delay: a.delay, ease: 'easeInOut' }}
        >
          {a.emoji}
        </motion.div>
      ))}
    </div>
  );
}
