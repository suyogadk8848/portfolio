/* Premium interaction layer — intentionally small and dependency-free */

const html = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const revealElements = [...document.querySelectorAll(".reveal")];
const tiltCard = document.querySelector("[data-tilt] .hero-card");

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme) {
  html.dataset.theme = savedTheme;
} else if (prefersDark) {
  html.dataset.theme = "dark";
}

window.addEventListener("load", () => {
  setTimeout(() => body.classList.add("is-loaded"), 300);
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 28);

  const current = [...document.querySelectorAll("main section[id]")]
    .reverse()
    .find((section) => window.scrollY >= section.offsetTop - 180);

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      current && link.getAttribute("href") === `#${current.id}`
    );
  });
}, { passive: true });

if (tiltCard && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((0.5 - y / rect.height)) * 10;

    tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.18}px) translateY(-3px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});
