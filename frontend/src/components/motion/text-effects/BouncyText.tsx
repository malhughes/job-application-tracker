import { motion } from 'motion/react';

const BOUNCE_DURATION = 0.22;
const GAP = 0.025;
const INITIAL_REST = 0.05;
const PAUSE = 0.2;

export const BouncyText = ({ text }: { text: string }) => {
  const chars = text.split('');
  const totalDuration = INITIAL_REST + (chars.length - 1) * GAP + BOUNCE_DURATION + PAUSE;

  return (
    <motion.div style={{ display: 'flex' }}>
      {chars.map((char, index) => {
        const t1 = (INITIAL_REST + index * GAP) / totalDuration;
        const t2 = (INITIAL_REST + index * GAP + BOUNCE_DURATION / 2) / totalDuration;
        const t3 = (INITIAL_REST + index * GAP + BOUNCE_DURATION) / totalDuration;

        return (
          <motion.span
            key={index}
            animate={{ y: [0, 0, -10, 0, 0] }}
            transition={{
              duration: totalDuration,
              repeat: Infinity,
              times: [0, t1, t2, t3, 1],
              ease: ['linear', 'easeOut', 'easeIn', 'linear'],
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
