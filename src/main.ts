/**
 * Entry point for APEX/DEPMAN development demo.
 * Initializes the dependency manager and runs a simple GSAP animation demo on ready.
 */
import DependencyManager from '@/utils/DependencyManager';
const manager = DependencyManager.getInstance();

// Full demo override – uncomment for complete feature showcase
manager.init({
  core: ['lenis', 'gsap'],
  gsap_plugins: ['ScrollTrigger', 'SplitText'],
});

// Basic init (uses config)
// manager.init()

manager.on('ready', () => {
  if (!window.Apex?.deps) return;

  const { gsap, ScrollTrigger } = window.Apex.deps;

  if (gsap && ScrollTrigger) {
    const instances = document.querySelectorAll('.spacer');
    if (!instances.length) return;

    instances.forEach((instance) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: instance,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      tl.to(instance, { backgroundColor: 'red' });
    });
  }
});
