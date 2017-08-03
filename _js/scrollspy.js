import { headerOffset } from './header';

// lightweight scrollspy implementation
const section = document.querySelectorAll('.section');
const sections = {};
let i = 0;

[].forEach.call(section, function(e) {
  sections[e.id] = e.offsetTop - headerOffset;
});

const updateSections = function() {
  const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

  for (i in sections) {
    if (sections[i] <= scrollPosition) {
      const activeLink = document.querySelector('.active');
      const targetLink = document.querySelector(`a[href*=${i}]`);

      if(activeLink) {
        activeLink.classList.remove('active');
      }

      if(targetLink && !targetLink.classList.contains('active')) {
        targetLink.classList.add('active');
      }
    }
  }
};

let ticking = false;

const update = function() {
  updateSections();
  ticking = false;
};

const requestTick = function() {
  if (!ticking) {
    window.requestAnimationFrame(update);
    ticking = true;
  }
};

window.addEventListener('scroll', requestTick);
