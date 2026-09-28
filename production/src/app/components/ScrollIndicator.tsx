import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator({ enabled = true }: { enabled?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [railLeft, setRailLeft] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const check = () => {
      const canScroll = document.documentElement.scrollHeight > window.innerHeight + 32;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 32;
      const anchor = document.querySelector<HTMLElement>('[data-scroll-anchor]');

      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const paddingLeft = Number.parseFloat(window.getComputedStyle(anchor).paddingLeft) || 0;
        setRailLeft(Math.max(0, Math.round(rect.left + paddingLeft - 32)));
      }

      setVisible(canScroll && !atBottom);
    };

    const scheduleCheck = () => {
      window.requestAnimationFrame(check);
    };

    check();
    scheduleCheck();
    const timers = [120, 400, 900].map((delay) => window.setTimeout(check, delay));
    const observer = new ResizeObserver(scheduleCheck);
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    window.addEventListener('load', check);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.removeEventListener('load', check);
    };
  }, [enabled]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: `${railLeft}px`,
        width: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {[0, 1].map((index) => (
        <motion.div
          key={index}
          animate={visible ? { y: [0, 5, 0] } : {}}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
          style={{ marginTop: index === 1 ? '-8px' : 0 }}
        >
          <ChevronDown size={20} strokeWidth={2.2} style={{ color: '#111', opacity: 0.82 }} />
        </motion.div>
      ))}
    </div>
  );
}
