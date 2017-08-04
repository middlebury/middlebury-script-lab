import scrollTo from 'scroll-to';
import Headroom from 'headroom.js';
import onscrolling from 'onscrolling';

// import getOuterHeight from './getOuterHeight';

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const addClass = (elem, className) => elem.classList.add(className);
const removeClass = (elem, className) => elem.classList.remove(className);
const forEach = (items, cb) => [].forEach.call(items, cb);

const header = $('.js-headroom');
const siteBrand = $('.js-site-brand');
const headerAppBtn = $('.js-header-app-btn');
const appBtn = $('.js-app-btn');

const sectionLinks = $$('.js-link');

const sections = {};

// sets the padding top of the body element
const setBodyTopPad = x => (document.body.paddingTop = x + 'px');

const getHeaderHeight = () => $('.js-headroom').offsetHeight;

const getScrollTop = () =>
  document.documentElement.scrollTop || document.body.scrollTop;

function offsetBody() {
  const header = $('.js-headroom');
  const x = getHeaderHeight();
  setBodyTopPad(x);
}

function initStickyHeader() {
  const siteBrandHeight = siteBrand.clientHeight;
  const headerHeight = getHeaderHeight();

  // set up sticky header
  const headroom = new Headroom(header, {
    offset: siteBrandHeight,
    onNotTop() {
      setBodyTopPad(headerHeight);
    },
    onTop() {
      setBodyTopPad(0);
    }
  });

  headroom.init();
}

function setSectionOffsets() {
  const sections = $$('.section');
  const headroom = $('.js-headroom');
  const headerHeight = getHeaderHeight();

  forEach(sections, elem => {
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

// shows the header apply button when the one in the body is scrolled by
function moveAppBtn(e) {
  const scrollPosition = getScrollTop();

  if (appBtn.offsetTop + appBtn.clientHeight <= scrollPosition) {
    addClass(headerAppBtn, 'is-visible');

    setSectionOffsets();

    const headerHeight = getHeaderHeight();

    setBodyTopPad(headerHeight);

    return;
  }

  removeClass(headerAppBtn, 'is-visible');
}

// scroll to the top of the target section minus the sticky header height
function handleSectionLinkClick(e) {
  e.preventDefault();

  const href = e.target.getAttribute('href');
  const target = $(href);

  const y = target.offsetTop - getHeaderHeight() - 16;

  const options = {
    ease: 'linear',
    duration: 300
  };

  scrollTo(0, y, options);
}

function addSectionLinkListeners() {
  forEach(sectionLinks, link => {
    link.addEventListener('click', handleSectionLinkClick);
  });
}

function handleScroll() {
  updateSections();
  moveAppBtn();
}

function main() {
  setSectionOffsets();

  initStickyHeader();

  addSectionLinkListeners();

  onscrolling(handleScroll);
}

main();
