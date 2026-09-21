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

if (heroHeading) {
  revealText(heroHeading, 0, 22);
}


// Footer "LET'S TALK" scroll reveal (desktop only, every page except the
// dedicated Contact page, which already pins its footer a different way).
// Contact details + the LinkedIn icon are completely static — they never
// move. Once the user reaches the natural end of the page's content, the
// footer (contact details + icon) locks to the bottom of the viewport at
// its own natural height (no gap above or below it), and further
// scrolling slides ONLY the "LET'S TALK" wordmark up into view.
//
// This is done by toggling .contact__pin between normal flow and
// position:fixed at the exact scroll position where the footer's natural
// (in-flow) position would otherwise start scrolling past the viewport's
// bottom edge — NOT with position:sticky. Testing showed `position:sticky;
// bottom:0` simply doesn't engage in this browser (unlike `top:0`, which
// works fine and is what the header nav already relies on), so a manual
// fixed-position toggle is used instead for reliability.
(function () {
  const contact = document.querySelector('.contact');
  if (!contact || document.body.classList.contains('contact-page')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const mql = window.matchMedia('(min-width: 721px)');

  let pin = null;
  let wordmark = null;
  let active = false;
  let pinned = false;
  let revealDistance = 0;
  let pinBottomOffset = 0;
  let ticking = false;

  // pinBottomOffset is the distance from .contact's own top edge down to
  // .contact__pin's bottom edge (i.e. the footer's own natural height,
  // including .contact's top padding) — measured directly rather than
  // assumed. revealDistance is how much further scroll is needed after
  // locking for the wordmark to fully reveal, sized to the wordmark's own
  // rendered height so it feels like scrolling it into place at a natural
  // 1:1 rate. .contact only ever reserves pinBottomOffset + revealDistance
  // of document height — the footer's own height plus the wordmark's own
  // reveal distance, nothing extra — so there's no gap above or below the
  // footer once it's resting. Both are recomputed on setup and on resize.
  function updateRevealDistance() {
    const wasPinned = pin.classList.contains('contact__pin--fixed');
    if (wasPinned) pin.classList.remove('contact__pin--fixed');

    const wordmarkHeight = wordmark.getBoundingClientRect().height;
    revealDistance = Math.max(200, Math.round(wordmarkHeight));

    const contactRect = contact.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    pinBottomOffset = pinRect.bottom - contactRect.top;

    if (wasPinned) pin.classList.add('contact__pin--fixed');

    contact.style.setProperty('--reveal-min-height', `${pinBottomOffset + revealDistance}px`);
  }

  function update() {
    if (!active || !wordmark) return;
    const rect = contact.getBoundingClientRect();
    // Progress is 0 right up until the unpinned pin's own bottom edge
    // (rect.top + pinBottomOffset) would start scrolling past the
    // viewport's bottom edge — the exact instant a sticky element would
    // lock, so the switch to position:fixed is seamless, with no jump —
    // and reaches 1 exactly when .contact's bottom (rect.top +
    // pinBottomOffset + revealDistance) reaches the viewport bottom, which
    // is also the true end of the document, so scrolling can't go further.
    const raw = (window.innerHeight - pinBottomOffset - rect.top) / revealDistance;
    const progress = Math.min(1, Math.max(0, raw));

    const shouldPin = progress > 0;
    if (shouldPin !== pinned) {
      pin.classList.toggle('contact__pin--fixed', shouldPin);
      pinned = shouldPin;
    }

    wordmark.style.transform = `translateY(${(1 - progress) * 100}%)`;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  function onResize() {
    if (!active) return;
    updateRevealDistance();
    update();
  }

  function setup() {
    if (active) return;
    pin = document.createElement('div');
    pin.className = 'contact__pin';
    while (contact.firstChild) {
      pin.appendChild(contact.firstChild);
    }
    contact.appendChild(pin);
    wordmark = pin.querySelector('.footer-wordmark');
    contact.classList.add('contact--reveal');
    active = true;
    pinned = false;
    updateRevealDistance();
    update();
  }

  function teardown() {
    if (!active) return;
    pin.classList.remove('contact__pin--fixed');
    while (pin.firstChild) {
      contact.appendChild(pin.firstChild);
    }
    pin.remove();
    contact.classList.remove('contact--reveal');
    contact.style.removeProperty('--reveal-min-height');
    if (wordmark) wordmark.style.transform = '';
    pin = null;
    wordmark = null;
    active = false;
    pinned = false;
  }

  function applyForViewport(e) {
    if (e.matches) {
      setup();
    } else {
      teardown();
    }
  }

  applyForViewport(mql);
  mql.addEventListener('change', applyForViewport);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
})();
