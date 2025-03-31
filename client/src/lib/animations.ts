export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 1,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay
    }
  })
};

export const cardFlip = {
  hidden: { scale: 1, rotateY: 0 },
  visible: { 
    scale: [1, 1.1, 1.15, 1.1, 1],
    rotateY: 0,
    transition: {
      duration: 2.0, 
      times: [0, 0.25, 0.5, 0.75, 1],
      ease: "easeInOut"
    }
  },
  flipped: { 
    rotateY: 180,
    transition: {
      duration: 0.6
    }
  }
};

export const modalFade = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};
