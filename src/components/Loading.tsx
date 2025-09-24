'use client';

import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Carregando...' }: LoadingProps) {
  const circles = [0, 1, 2];

  return (
    <motion.div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white text-black"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex space-x-3">
        {circles.map((i) => (
          <motion.div
            key={i}
            className="h-4 w-4 rounded-full bg-black"
            animate={{ y: [0, -12, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.p
        className="mt-6 text-lg font-semibold"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
