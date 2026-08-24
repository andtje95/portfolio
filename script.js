// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');

let lockedScrollY = 0;

const lockScroll = () => {
  lockedScrollY = window.scrollY;
  document.documentElement.classList.add('nav-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
};

const unlockScroll = () => {
  document.documentElement.classList.remove('nav-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, lockedScrollY);
};

const setMenuOpen = (open) => {
  links.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    nav.classList.remove('nav--hidden');
    lockScroll();
  } else {
    unlockScroll();
  }
};

if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = !links.classList.contains('is-open');
    setMenuOpen(isOpen);
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Hide nav on scroll down, show on scroll up, always visible at top
const nav = document.querySelector('.nav');
if (nav) {
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNav = () => {
    if (links && links.classList.contains('is-open')) {
      ticking = false;
      return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      nav.classList.remove('nav--hidden');
    } else if (currentScrollY > lastScrollY) {
      nav.classList.add('nav--hidden');
    } else if (currentScrollY < lastScrollY) {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
}

// Accordion toggles (AWARE Solution items)
document.querySelectorAll('.accordion__toggle').forEach((btn) => {
  const panel = btn.previousElementSibling;
  if (!panel) return;

  const openPanel = () => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  };

  if (btn.getAttribute('aria-expanded') === 'true') {
    openPanel();
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      panel.style.maxHeight = '0px';
    } else {
      openPanel();
    }
  });

  window.addEventListener('resize', () => {
    if (btn.getAttribute('aria-expanded') === 'true') {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// Soft letter-by-letter reveal for the hero text (homepage)
function revealText(el, startDelay, charDelay) {
  if (!el) return 0;
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';

  const wrapper = document.createElement('span');
  wrapper.setAttribute('aria-hidden', 'true');

  const words = text.split(' ');
  const chars = [];

  words.forEach((word, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'reveal-word';

    [...word].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'reveal-char';
      span.textContent = ch;
      wordSpan.appendChild(span);
      chars.push(span);
    });

    wrapper.appendChild(wordSpan);

    if (wi < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'reveal-char';
      spaceSpan.textContent = ' ';
      wrapper.appendChild(spaceSpan);
      chars.push(spaceSpan);
    }
  });

  el.appendChild(wrapper);

  chars.forEach((span, i) => {
    setTimeout(() => {
      span.classList.add('is-visible');
    }, startDelay + i * charDelay);
  });

  return startDelay + chars.length * charDelay;
}

const heroHeading = document.querySelector('.hero h1');
const heroSubtitle = document.querySelector('.hero p');

if (heroHeading || heroSubtitle) {
  const headingDone = revealText(heroHeading, 0, 22);
  revealText(heroSubtitle, headingDone + 150, 14);
}