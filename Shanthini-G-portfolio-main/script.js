// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Theme toggle with persistence
const themeToggle = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
function updateThemeButton() {
  if (!themeToggle) return;
  const light = document.body.classList.contains('light');
  themeToggle.textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Toggle dark mode' : 'Toggle light mode');
}
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeButton();
});

// Smooth scrolling
 document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id && id.length > 1 && document.querySelector(id)) {
    e.preventDefault();
    document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', id);
  }
}));

// Portfolio projects: descriptions are limited to the project details currently available.
const projects = [
  {
    title: 'ESP32 Ultrasonic Anemometer',
    category: 'EMBEDDED · PCB DESIGN',
    desc: 'An ultrasonic wind measurement project focused on the electronics design and PCB workflow.',
    details: 'A 2D ultrasonic anemometer project using four ultrasonic transducers to support wind-speed and wind-direction measurement. The repository contains project files for the design workflow.',
    bullets: ['Four-transducer ultrasonic measurement concept', 'PCB schematic and layout workflow using KiCad', 'Repository includes design files; hardware validation should be confirmed separately'],
    tags: ['ESP32', 'Ultrasonic Sensors', 'KiCad', 'PCB Design'],
    img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85',
    link: 'https://github.com/ShanthiniGopi42/ESP32-Ultrasonic-Anemometer'
  },
  {
    title: 'Modulation Classification Using Deep Learning',
    category: 'DEEP LEARNING · SIGNAL PROCESSING',
    desc: 'A machine-learning project for classifying digital and analog modulation types from I/Q signal samples.',
    details: 'An Automatic Modulation Classification project using a convolutional neural network and the RadioML2016.10a dataset to classify modulation types from sampled I/Q signals.',
    bullets: ['Works with I/Q signal data', 'CNN-based classification workflow', 'Explores 11 modulation classes in RadioML2016.10a'],
    tags: ['Python', 'CNN', 'RadioML', 'Signal Processing'],
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    link: 'https://github.com/ShanthiniGopi42/ModulationClassification'
  },
  {
    title: 'Smart Water Management System',
    category: 'IOT · CLOUD LOGGING',
    desc: 'An ESP32-based water monitoring concept with sensor readings and cloud logging.',
    details: 'A smart water management project that reads water-level information and logs measurements to online services for monitoring and record keeping.',
    bullets: ['ESP32 and sensor-based monitoring', 'Cloud logging workflow with ThingSpeak and Google Sheets', 'Water-level status logic and data recording'],
    tags: ['ESP32', 'IoT', 'Sensors', 'Cloud Logging'],
    img: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=85',
    link: 'https://github.com/ShanthiniGopi42/Smart-Water-Management-System'
  }
];

const grid = document.getElementById('project-grid');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if (grid) {
  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <button class="project-open" type="button" data-index="${index}" aria-label="View details for ${esc(project.title)}">
        <div class="project-image-wrap"><img src="${project.img}" alt="" loading="lazy"><span class="project-arrow">↗</span></div>
        <div class="project-content"><p class="project-category">${esc(project.category)}</p><h3>${esc(project.title)}</h3><p class="project-description">${esc(project.desc)}</p><div class="tags">${project.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div></div>
      </button>
      <a class="repo-link" href="${project.link}" target="_blank" rel="noopener">View repository <span aria-hidden="true">↗</span></a>`;
    grid.appendChild(card);
  });
}

// Reveal sections
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('active'));

// Project details modal
const backdrop = document.getElementById('project-backdrop');
const modal = document.getElementById('project-modal');
const mImg = document.getElementById('modal-img');
const mTitle = document.getElementById('modal-title');
const mDesc = document.getElementById('modal-desc');
const mBullets = document.getElementById('modal-bullets');
const mTags = document.getElementById('modal-tags');
const mLink = document.getElementById('modal-link');
const mClose = document.getElementById('modal-close');
function openProject(index) {
  const project = projects[index]; if (!project) return;
  mImg.src = project.img; mImg.alt = project.title;
  mTitle.textContent = project.title; mDesc.textContent = project.details;
  mBullets.innerHTML = project.bullets.map(item => `<li>${esc(item)}</li>`).join('');
  mTags.innerHTML = project.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
  mLink.href = project.link;
  backdrop.hidden = false; modal.hidden = false; document.body.classList.add('modal-open'); mClose.focus();
}
function closeProject() { if (!modal) return; modal.hidden = true; backdrop.hidden = true; document.body.classList.remove('modal-open'); }
grid?.addEventListener('click', e => { const button = e.target.closest('[data-index]'); if (button) openProject(Number(button.dataset.index)); });
backdrop?.addEventListener('click', closeProject); mClose?.addEventListener('click', closeProject);
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeProject(); });

// Contact form opens a prefilled email draft; it does not send mail directly.
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = data.get('name'); const email = data.get('email'); const message = data.get('message');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  document.getElementById('form-msg').textContent = 'Your email app should open with the message filled in.';
  window.location.href = `mailto:shanthinig42@gmail.com?subject=${encodeURIComponent('Portfolio enquiry from ' + name)}&body=${body}`;
});
