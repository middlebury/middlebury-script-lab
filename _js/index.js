import Headroom from 'headroom.js';
import onscrolling from 'onscrolling';

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const addClass = (elem, className) => elem.classList.add(className);
const removeClass = (elem, className) => elem.classList.remove(className);
const forEach = (items, cb) => [].forEach.call(items, cb);

const getHeader = () => $('.js-nav');

const header = getHeader();
const siteBrand = $('.js-site-brand');
const headerAppBtn = $('.js-header-app-btn');

const sectionLinks = $$('.js-link');

const sections = {};
const isBtnStuck = false;

// sets the padding top of the body element
const setBodyTopPad = x => (document.body.style.paddingTop = x + 'px');

const getHeaderHeight = () => getHeader().offsetHeight;

const getScrollTop = () =>
  document.documentElement.scrollTop || document.body.scrollTop;

const isMediaMin = width =>
  window.matchMedia(`(min-width: ${width}px)`).matches;

function padBody() {
  const x = getHeaderHeight();
  setBodyTopPad(x);
}

function initStickyHeader() {
  const siteBrandHeight = siteBrand.offsetHeight;

  // set up sticky header
  const headroom = new Headroom(header, {
    offset: siteBrandHeight,
    onNotTop() {
      padBody();
    },
    onTop() {
      setBodyTopPad(0);
    }
  });

  headroom.init();
}

function setSectionOffsets() {
  const sectionElems = $$('.section');
  const headroom = $('.js-headroom');
  const headerHeight = getHeaderHeight();

  forEach(sectionElems, elem => {
    sections[elem.id] = elem.offsetTop - headerHeight;
  });
}

function updateSections() {
  const scrollPosition = getScrollTop();

  for (let i in sections) {
    if (sections[i] <= scrollPosition) {
      const activeLink = $('.active');
      const targetLink = $(`a[href*=${i}]`);

      if (activeLink) {
        removeClass(activeLink, 'active');
      }

      if (targetLink && !targetLink.classList.contains('active')) {
        addClass(targetLink, 'active');
      }
    }
  }
}

// scroll to the top of the target section minus the sticky header height
function handleSectionLinkClick(e) {
  e.preventDefault();

  const href = e.target.getAttribute('href');
  const target = $(href);

  const y = target.offsetTop - getHeaderHeight();

  if (!('scrollBehavior' in document.documentElement.style)) {
    // fallback for ie
    return window.scrollTo(0, y);
  }

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

function addSectionLinkListeners() {
  forEach(sectionLinks, link => {
    link.addEventListener('click', handleSectionLinkClick);
  });
}

function handleScroll() {
  updateSections();
}

function initAppBtn() {
  const btn = $('.js-app-btn');
  const headerBtn = $('.js-header-app-btn');
  const headerHeight = getHeaderHeight();

  const hrBtn = new Headroom(btn, {
    offset: btn.offsetTop - headerHeight,
    onNotTop() {
      addClass(headerBtn, 'is-visible');
      setSectionOffsets();
      // padBody();
    },
    onTop() {
      removeClass(headerBtn, 'is-visible');
      // padBody();
    }
  });

  hrBtn.init();
}

function main() {
  initStickyHeader();

  if (isMediaMin(600)) {
    setSectionOffsets();
    initAppBtn();
    addSectionLinkListeners();
    onscrolling(handleScroll);
  }
}

main();
