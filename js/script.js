const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], header[id]');
const toast = document.querySelector('.toast');

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((section) => activeObserver.observe(section));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 4500);
}

const form = document.querySelector('#contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!String(values.get('name')).trim()) errors.name = 'Please enter your name.';
  if (!emailPattern.test(String(values.get('email')).trim())) errors.email = 'Please enter a valid email.';
  if (!String(values.get('message')).trim()) errors.message = 'Please enter a message.';
  document.querySelectorAll('.field-error').forEach((element) => { element.textContent = errors[element.dataset.errorFor] || ''; });
  document.querySelectorAll('#contact-form input, #contact-form textarea').forEach((field) => field.classList.toggle('invalid', Boolean(errors[field.name])));
  const status = form.querySelector('.form-status');
  if (Object.keys(errors).length) { status.textContent = 'Please check the highlighted fields.'; return; }
  status.textContent = 'Thanks. The demo form is valid, but no message was sent to a server.';
  form.reset();
});