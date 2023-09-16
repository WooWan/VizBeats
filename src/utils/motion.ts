import { Variants } from 'framer-motion';
import { Direction } from '@/types/Axis';

export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 140
    }
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.25
    }
  }
};

export const slideIn = (direction: Direction, type: string, delay: number, duration: number): Variants => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut'
    }
  }
});

export const staggerContainer = (staggerChildren: number, delayChildren: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const textVariant = (delay: number): Variants => ({
  hidden: {
    y: 50,
    opacity: 0
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1.25,
      delay
    }
  }
});

export const textContainer: Variants = {
  hidden: {
    opacity: 0
  },
  show: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1 }
  })
};

export const textVariant2: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: 'easeIn'
    }
  }
};

export const fadeIn = (direction: Direction, type: string, delay: number, duration: number): Variants => ({
  hidden: {
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut'
    }
  }
});

export const planetVariants = (direction: Direction): Variants => ({
  hidden: {
    x: direction === 'left' ? '-100%' : '100%',
    rotate: 120,
    opacity: 0
  },
  show: {
    x: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1.8,
      delay: 0.5
    }
  }
});

export const footerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 140
    }
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.5
    }
  }
};
