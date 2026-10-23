const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toast = $('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Mobile navigation
const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

// Highlight the section currently in view.
const sections = $$('main section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

// Gentle entrance animations.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Like button toggles and updates its count.
const likeButton = $('.like-button');
likeButton.addEventListener('click', () => {
  const liked = likeButton.classList.toggle('liked');
  likeButton.setAttribute('aria-pressed', String(liked));
  $('.heart', likeButton).textContent = liked ? '♥' : '♡';
  $('.like-count', likeButton).textContent = liked ? '249' : '248';
  showToast(liked ? 'You liked Alex’s post.' : 'Like removed.');
});

// Expand comments and allow a local demo comment.
$('.comment-button').addEventListener('click', () => {
  const panel = $('.comments-panel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) $('.comment-form input').focus();
});
$('.comment-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('input', event.currentTarget);
  const feedback = $('.comment-feedback');
  if (!input.value.trim()) return;
  feedback.textContent = `Your comment “${input.value.trim()}” was added in this demo.`;
  input.value = '';
  showToast('Comment added to the demo.');
});

// Share uses the native share sheet where available, otherwise copies the page URL.
$('.share-button').addEventListener('click', async () => {
  const shareData = { title: 'Connectly', text: 'Little moments, big memories.', url: window.location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Page link copied to clipboard.');
    } else {
      showToast('Copy this page URL to share Connectly.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Sharing is not available in this browser.');
  }
});

// Dismiss the floating notification.
$('.notification-close').addEventListener('click', () => {
  $('.notification').style.display = 'none';
  showToast('Notification dismissed.');
});
$('.more').addEventListener('click', () => showToast('More post options coming soon.'));

// Join modal and demo form validation.
const joinDialog = $('.join-dialog');
$$('.join-trigger, .nav-button, a[href="#join"]').forEach(control => {
  control.addEventListener('click', event => {
    // Let keyboard and ordinary anchor navigation work; open the dialog for join actions.
    if (control.classList.contains('join-trigger') || control.classList.contains('nav-button')) {
      event.preventDefault();
      if (typeof joinDialog.showModal === 'function') joinDialog.showModal();
      else showToast('Your community sign-up is ready to build!');
    }
  });
});
$('.dialog-close').addEventListener('click', () => joinDialog.close());
joinDialog.addEventListener('click', event => {
  if (event.target === joinDialog) joinDialog.close();
});
$('.join-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#join-name').value.trim();
  const email = $('#join-email').value.trim();
  if (!name || !email) return;
  $('.form-feedback').textContent = `You're on the list, ${name.split(' ')[0]}! This is a front-end demo; no email was sent.`;
  showToast('Demo sign-up complete.');
});
