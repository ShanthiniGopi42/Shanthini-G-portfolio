// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle with persistence
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    }
  });
});

// ------- Projects (data) -------
const projects = [
  {
    title: "Industrial Safety Alert System (3rd Prize)",
    desc: "An ESP32-based IoT safety system built for the Naan Mudhalvan Hackathon. It monitors voltage, current, temperature, and gas levels using sensors and alerts workers in unsafe conditions.",
    details: "We used ESP32 and common sensors to monitor unsafe conditions with alerts and a simple dashboard.",
    bullets: [
      "Real-time voltage, current, temperature and gas monitoring",
      "ESP32 + Wi-Fi + simple dashboard",
      "Buzzer and visual alerts on threshold breach",
      "Team project • Won 3rd prize"
    ],
    img: "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=1200&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1581091215367-59ab6dcef9b3?q=80&w=1200&auto=format&fit=crop",
    tags: ["IoT", "ESP32", "Sensors", "Team Project"],
    link: "#" // put the PDF in the same folder or change this
  },
  {
    title: "Automatic Night Light Using LDR",
    desc: "A simple electronic project using LDR and a transistor relay to automatically turn on the light when ambient light decreases.",
    details: "Designed a simple LDR + transistor/relay circuit and tuned the threshold.",
    bullets: ["LDR threshold tuning", "Transistor/relay drive", "Beginner friendly"],
    img: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1200&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
    tags: ["LDR", "Electronics", "Beginner"],
    link: "#"
  },
  {
    title: "Portfolio Website",
    desc: "This site built with semantic HTML, CSS Grid/Flexbox, and vanilla JS.",
    details: "Responsive personal portfolio with dark/light theme and project modal.",
    bullets: ["Vanilla HTML/CSS/JS", "Responsive grid", "Accessible and lightweight"],
    img: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#"
  },
  {
    title: "Project Coming Soon",
    desc: "New ESP32/IoT demo in progress.",
    details: "Prototyping a small ESP32 device that streams sensor data.",
    bullets: ["ESP32", "Simple dashboard", "Learning project"],
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    tags: ["IoT", "ESP32", "Learning"],
    link: "#"
  }
];

// ------- Render project cards -------
const grid = document.getElementById("project-grid");
grid.innerHTML = "";

projects.forEach((p, i) => {
  const el = document.createElement("a");
  el.className = "card project-card";
  el.href = "#";                   // we will open a modal instead of navigating
  el.dataset.index = String(i);    // store the index for the modal
  el.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
  `;
  const img = el.querySelector("img");
  img.onerror = () => { if (p.fallback && img.src !== p.fallback) img.src = p.fallback; };
  grid.appendChild(el);
});

// ------- Reveal on scroll -------
const reveals = document.querySelectorAll(".reveal");
const onScrollReveal = () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) el.classList.add("active");
  });
};
window.addEventListener("scroll", onScrollReveal);
onScrollReveal();

// ------- Modal logic -------
const backdrop   = document.getElementById("project-backdrop");
const modal      = document.getElementById("project-modal");
const mImg       = document.getElementById("modal-img");
const mTitle     = document.getElementById("modal-title");
const mDesc      = document.getElementById("modal-desc");
const mBullets   = document.getElementById("modal-bullets");
const mTags      = document.getElementById("modal-tags");
const mLink      = document.getElementById("modal-link");
const mClose     = document.getElementById("modal-close");

function openProjectModal(index){
  const p = projects[index];
  if (!p) return;

  mImg.src = p.img; mImg.alt = p.title;
  mTitle.textContent = p.title;
  mDesc.textContent  = p.details || p.desc || "";
  mBullets.innerHTML = (p.bullets||[]).map(b=>`<li>${b}</li>`).join("");
  mTags.innerHTML    = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("");
  mLink.href = p.link || "#";
  mLink.style.display = (!p.link || p.link === "#") ? "none" : "inline-block";

  backdrop.hidden = false;
  modal.hidden = false;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProjectModal(){
  modal.classList.remove("open");
  backdrop.hidden = true;
  modal.hidden = true;
  document.body.style.overflow = "";
}

// Close actions
backdrop.addEventListener("click", closeProjectModal);
mClose.addEventListener("click", closeProjectModal);
window.addEventListener("keydown", e => { if (e.key === "Escape") closeProjectModal(); });

// Open via event delegation on the grid
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card || !grid.contains(card)) return;
  e.preventDefault(); // stop "#" navigation
  const i = Number(card.dataset.index);
  openProjectModal(i);
});

// ------- Contact form -> mailto -------
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:shanthinig42@gmail.com?subject=Portfolio%20Contact&body=${body}`;
  document.getElementById("form-msg").textContent = "Opening your email app…";
  e.target.reset();
});
