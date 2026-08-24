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

// Hero button: black dot bounces in from the right, then expands into the
// full button. Finishes well before the text reveal above completes.
const heroBtn = document.querySelector('.hero .btn--intro');

if (heroBtn) {
  const label = heroBtn.querySelector('.btn__label');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    heroBtn.classList.remove('btn--intro');
  } else {
    // Measure the button's natural expanded size via an invisible clone,
    // so the animation works regardless of the label text/font used.
    const clone = heroBtn.cloneNode(true);
    clone.classList.remove('btn--intro');
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);
    const naturalWidth = clone.offsetWidth;
    const naturalHeight = clone.offsetHeight;
    document.body.removeChild(clone);

    const bounceIn = heroBtn.animate(
      [
        { transform: 'translateX(300px)' },
        { transform: 'translateX(-18px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 550, easing: 'ease-out', fill: 'forwards' }
    );

    bounceIn.onfinish = () => {
      const expand = heroBtn.animate(
        [
          {
            width: '20px',
            height: '20px',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
          },
          {
            width: naturalWidth + 'px',
            height: naturalHeight + 'px',
            paddingLeft: '32px',
            paddingRight: '32px',
            paddingTop: '20px',
            paddingBottom: '20px',
          },
        ],
        { duration: 400, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
      );

      expand.onfinish = () => {
        heroBtn.classList.remove('btn--intro');
        heroBtn.style.width = '';
        heroBtn.style.height = '';
        heroBtn.style.padding = '';
        heroBtn.style.overflow = '';
        heroBtn.style.transform = '';
        if (label) {
          label.style.transition = 'opacity 0.25s ease';
          label.style.opacity = '1';
        }
      };
    };
  }
}
