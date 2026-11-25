// Collapse the navigation on small screens when JavaScript is available.
const menu = document.querySelector('#menu');
const navigation = document.querySelector('#navigation');
const smallScreen = window.matchMedia('(max-width: 42rem)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.hidden = smallScreen.matches && !open;
}

function syncNavigation() {
  menu.hidden = !smallScreen.matches;
  setMenu(!smallScreen.matches);
}

menu.addEventListener('click', () => {
  setMenu(menu.getAttribute('aria-expanded') === 'false');
});

navigation.addEventListener('click', (event) => {
  if (smallScreen.matches && event.target.closest('a')) {
    const section = document.querySelector(event.target.closest('a').hash);
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && smallScreen.matches && !navigation.hidden) {
    setMenu(false);
    menu.focus();
  }
});

smallScreen.addEventListener('change', syncNavigation);
syncNavigation();

// Build filter buttons from the categories on the project cards.
const filters = document.querySelector('#filters');
const projects = [...document.querySelectorAll('#project-list article')];
const status = document.querySelector('#project-status');
const categories = [...new Set(projects.map((project) => project.dataset.category).filter(Boolean))];

if (categories.length > 1) {
  const options = [null, ...categories];
  for (const category of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category ?? 'All';
    button.setAttribute('aria-pressed', String(category === null));
    button.addEventListener('click', () => {
      for (const filter of filters.children) {
        filter.setAttribute('aria-pressed', String(filter === button));
      }
      for (const project of projects) {
        project.hidden = category !== null && project.dataset.category !== category;
      }
      const count = projects.filter((project) => !project.hidden).length;
      status.textContent = count === 1 ? '1 project shown.' : count + ' projects shown.';
    });
    filters.append(button);
  }
  filters.hidden = false;
}
