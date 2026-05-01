// Set your final installer file path here once your .exe is ready.
// Example: "./downloads/Studium-Setup-v1.0.0.exe"
const DOWNLOAD_FILE_PATH = "./downloads/Studium Setup 1.0.0.exe";

function wireDownloadLinks() {
  const links = document.querySelectorAll("[data-download-link]");
  links.forEach((link) => {
    link.setAttribute("href", DOWNLOAD_FILE_PATH);
    link.setAttribute("download", "");
    link.setAttribute("title", "Download Studium for Windows");
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (!year) return;
  year.textContent = String(new Date().getFullYear());
}

function startRevealAnimations() {
  const revealNodes = document.querySelectorAll(".reveal");
  if (revealNodes.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

window.addEventListener("DOMContentLoaded", () => {
  wireDownloadLinks();
  setYear();
  startRevealAnimations();
});
