import { motion } from 'motion/react';

// One unit: text + 2 spaces at the end
const UNIT = 'Work In Progress  ';
// Fill 600px with repeated units, duplicated for seamless loop
const half = Array(12).fill(UNIT).join('');

export function WipBanner() {
  return (
    <div
      className="pointer-events-none z-10 overflow-hidden"
      style={{ position: 'fixed', top: '-160px', left: '-160px', width: '420px', height: '420px' }}
    >
      <div
        style={{
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-14px',
          marginLeft: '-250px',
          width: '500px',
          height: '28px',
          background: 'rgba(255, 220, 0, 0.28)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '100%',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            fontWeight: 300,
            color: 'rgba(0,0,0,1)',
            fontFamily: 'Inter, sans-serif',
          }}
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
        >
          {/* Two identical halves — animate -50% = seamless loop */}
          <span>{half}</span>
          <span>{half}</span>
        </motion.div>
      </div>
    </div>
  );
}
