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
  const panel = btn.nextElementSibling;
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
