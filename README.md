# APEX/DEPMAN

**The zero-config, manifest-driven, battle-tested dependency manager for high-performance creative websites.**

Built by [Apex Shift Ltd](https://apexshift.co.uk) — the UK studio that ships flawless, 60 fps experiences for global brands and daring startups.

```bash
npm install @apex/depman
```

```javascript
import DependencyManager from '@apex/depman'

DependencyManager.getInstance({
  deps: ['gsap', 'lenis'],
  plugins: ['ScrollTrigger', 'SplitText', 'CustomBounce'],
  preload: true
}).init()
```
That’s it. No paths. No order bugs. No “it works on my machine”.

## Features
- 100% manifest-driven (cache-busting safe)
- Automatic dependency graph resolution (CustomBounce → pulls in CustomEase → gsap)
- Full event system (ready, dep:loaded, plugin:loaded)
- Singleton + immutable + fully encapsulated
- Works with any Vite project out of the box
- 100% test coverage from day one
- Built for agencies, by an agency

## Author
Aaron Smyth
Lead Developer and Founder – Apex Shift Ltd

## Status
**Phase 0 complete** – foundation locked
**v0.0.4** – Singleton + ViTest + Docs + 100% Green Tests
we're shipping **v1.0.0** in < 7 days.

## License
MIT © Apex Shift Ltd 2025
---
Made with obsession in the UK by Aaron Smyth who refuses to ship broken websites.