/**
 * Add any library here which makes it instantly available for this project
 */
export default {
  deps: [
    'gsap',
    'lenis',
    //'three'
  ], // Root level Dependencies
  gsapPlugins: [
    'ScrollTrigger',
    'SplitText',
  ], // Plugins to register for GSAP
  instantiate: [
    'lenis'
  ] // These get `new` called automatically
}