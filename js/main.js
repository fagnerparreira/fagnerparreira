"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const setActiveLink = () => {
  const marker = window.scrollY + 140;
  let activeId = "";

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (marker >= top && marker < bottom) {
      activeId = `#${section.id}`;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === activeId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);

const hero = document.querySelector(".hero-copy");
if (hero) {
  hero.animate(
    [
      { opacity: 0, transform: "translateY(12px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 700, easing: "ease-out", fill: "forwards" }
  );
}

const canvas = document.getElementById("matrix-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas instanceof HTMLCanvasElement && !reduceMotion) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (ctx) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let columns = [];
    let fontSize = 14;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.ceil(canvas.width / fontSize);
      columns = Array.from({ length: count }, () => Math.random() * -200);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(3, 8, 5, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 102, 0.42)";
      ctx.font = `${fontSize}px Space Mono, monospace`;

      for (let i = 0; i < columns.length; i += 1) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height + Math.random() * 1000) {
          columns[i] = 0;
        }
        columns[i] += 0.85;
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(raf));
  }
}
