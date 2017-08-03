import scrollTo from 'scroll-to';
import Headroom from 'headroom.js';
import getOuterHeight from './getOuterHeight';

const siteBrand = document.querySelector('.js-site-brand');
const header = document.querySelector('.js-headroom');

export const headerOffset = siteBrand.clientHeight;
const padTop = getOuterHeight(header);

// set up sticky header
const headroom = new Headroom(header, {
  offset: headerOffset,
  onNotTop: function() {
    document.body.style.paddingTop = padTop + 'px';
  },
  onTop: function() {
    document.body.style.paddingTop = 0;
  }
});

headroom.init();


// section links
const links = document.querySelectorAll('.js-link');

// scroll the body to the top of the target section minus the sitebrand height
function handleSectionLinkClick(e) {
  e.preventDefault();
  const href = e.target.getAttribute('href');
  const target = document.querySelector(href);

  const y = target.offsetTop - headerOffset;
  scrollTo(0, y, {
    ease: 'linear',
    duration: 300
  });
}

// add the event listeners
[].forEach.call(links, link => {
  link.addEventListener('click', handleSectionLinkClick);
});
