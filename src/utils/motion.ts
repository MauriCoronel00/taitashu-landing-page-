import { Variants } from 'motion/react';

// Easing curves for Motion Frame
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

// Fast micro-interactions: 150 - 250ms
export const MICRO_DURATION = 0.2;
// Standard component transitions: 300 - 450ms
export const COMPONENT_DURATION = 0.35;
// Hero & storytelling transitions: 600 - 800ms
export const STORY_DURATION = 0.7;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: COMPONENT_DURATION, ease: EASE_SMOOTH },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: COMPONENT_DURATION, ease: EASE_EXPO },
  },
};

export const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: STORY_DURATION, ease: EASE_EXPO },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: COMPONENT_DURATION, ease: EASE_EXPO },
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const cardHoverMotion = {
  rest: { y: 0, transition: { duration: 0.25, ease: EASE_SMOOTH } },
  hover: { y: -6, transition: { duration: 0.25, ease: EASE_EXPO } },
};

export const buttonTapMotion = {
  scale: 0.96,
  transition: { duration: 0.12, ease: 'easeOut' },
};

export const buttonHoverMotion = {
  scale: 1.02,
  transition: { duration: 0.18, ease: 'easeOut' },
};
