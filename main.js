import './style.css';
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

// Register Alpine plugins
Alpine.plugin(collapse);

// Start Alpine
window.Alpine = Alpine;
Alpine.start();

// ---- Active sidebar link on scroll ----
const navLinks = document.querySelectorAll('#sbNav a');
const sections = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function updateActiveLink() {
  if (!sections.length) return;
  let current = sections[0];
  const scrollPos = window.scrollY + 140;
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) current = sec;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal, .reveal-group');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---- Hero 3D accent (Three.js, lazy-loaded) ----
// A quiet rotating wireframe icosahedron in the accent teal, only shown
// on large screens (see #hero3d CSS). Three.js is dynamically imported so
// mobile and tablet visitors never download it — this is a bonus flourish,
// not something the layout depends on.
(function initHero3D() {
  const canvas = document.getElementById('hero3d');
  if (!canvas || window.innerWidth < 1500) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  import('three').then((THREE) => {
    const size = 200;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const geometry = new THREE.IcosahedronGeometry(1.35, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x0e7c6e, wireframe: true, transparent: true, opacity: 0.55 });
    const mesh = new THREE.Mesh(geometry, wireMat);
    scene.add(mesh);

    // A second, slightly larger, fainter shell rotating the opposite way for depth
    const shellGeo = new THREE.IcosahedronGeometry(1.7, 0);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x53574f, wireframe: true, transparent: true, opacity: 0.12 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    let frameId;
    function animate() {
      mesh.rotation.x += 0.0022;
      mesh.rotation.y += 0.0032;
      shell.rotation.x -= 0.0011;
      shell.rotation.y -= 0.0016;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    // Pause the loop when the tab isn't visible to save battery/CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        animate();
      }
    });
  });
})();
