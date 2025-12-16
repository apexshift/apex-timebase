import DependencyManager from '@/utils/DependencyManager'

const manager = DependencyManager.getInstance()
manager.on('plugin:registered', ({ name }) => console.log(`${name} auto-registered!`))
manager.on('ready', () => {
  if(!window.Apex?.deps) return
  const {gsap, ScrollTrigger, lenis} = window.Apex.deps
  if(gsap) {
    const instances = document.querySelectorAll('.spacer');
    if(!instances.length) return;

    instances.forEach(instance => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: instance,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
      tl.to(instance, {
        backgroundColor: 'red'
      })
    })
  }
})
manager.on('preferred-scroller-resolved', ({preferred, enabled, disabled}) => {
  console.debug(`Loaded Scroller: ${preferred}`)
})
manager.init()