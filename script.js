(() => {
  const progress = document.getElementById('progress-bar');
  const backToTop = document.getElementById('back-to-top');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];

  // Keep the scroll indicator and back-to-top control in sync.
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    backToTop.classList.toggle('visible', window.scrollY > 520);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  // Mobile navigation opens and closes from the menu or a selected link.
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navLinks.classList.toggle('open', !isOpen);
  });
  navAnchors.forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('open');
  }));

  if ('IntersectionObserver' in window) {
    // Highlight the navigation item for the section nearest the top of view.
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));

    // Reveal content as it enters the viewport.
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // A compact neon cursor for mouse users; touch devices keep their native input.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const customCursor = document.createElement('span');
    customCursor.className = 'custom-cursor';
    customCursor.setAttribute('aria-hidden', 'true');
    document.body.append(customCursor);
    let pointerX = -20;
    let pointerY = -20;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let cursorFrame = 0;
    const moveCursor = () => {
      cursorX += (pointerX - cursorX) * 0.24;
      cursorY += (pointerY - cursorY) * 0.24;
      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
      if (Math.abs(pointerX - cursorX) + Math.abs(pointerY - cursorY) > 0.3) {
        cursorFrame = requestAnimationFrame(moveCursor);
      } else {
        cursorFrame = 0;
      }
    };
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      customCursor.classList.add('is-visible');
      if (!cursorFrame) cursorFrame = requestAnimationFrame(moveCursor);
    }, { passive: true });
    document.addEventListener('pointerover', event => {
      if (event.target.closest('a, button, input, textarea')) customCursor.classList.add('is-hovering');
    });
    document.addEventListener('pointerout', event => {
      if (event.target.closest('a, button, input, textarea')) customCursor.classList.remove('is-hovering');
    });
    document.addEventListener('pointerleave', () => customCursor.classList.remove('is-visible'));
    document.addEventListener('pointerenter', () => customCursor.classList.add('is-visible'));
  }

  // Type the hero descriptor once, then leave it in place.
  const tagline = document.getElementById('typed-tagline');
  const fullTagline = 'CSE AIML Student | Creative Thinker | Aspiring AI Developer';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    tagline.textContent = fullTagline;
  } else {
    tagline.textContent = '';
    let position = 0;
    const typeNext = () => {
      tagline.textContent = fullTagline.slice(0, position++);
      if (position <= fullTagline.length) window.setTimeout(typeNext, 35);
    };
    window.setTimeout(typeNext, 350);
  }

  // A local HTML file cannot send email itself; prepare a mailto draft instead.
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`);
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    formNote.textContent = 'Opening your email app with your message ready to send…';
    window.location.href = `mailto:parthsri0603@gmail.com?subject=${subject}&body=${body}`;
  });
})();
