// Studium Showcase Page JavaScript
// Handles theme toggle, animations, download links, and interactive features

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    downloadUrl: "https://github.com/Basavaraj8143/studium/releases/download/studium-v1.0.1/Studium.Setup.1.0.1.exe",
    downloadFilename: "Studium.Setup.1.0.1.exe",
    sha256: null, // Set when available
  };

  // Theme management
  const THEME_KEY = 'studium-theme';
  const THEME_ATTR = 'data-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return 'light'; // Default to light mode
  }

  function setTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggle(theme);
  }

  function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Theme toggle button
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute(THEME_ATTR);
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });

    // Keyboard support
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }

  // Download link wiring
  function wireDownloadLinks() {
    const links = document.querySelectorAll('[data-download-link]');
    links.forEach((link) => {
      link.setAttribute('href', CONFIG.downloadUrl);
      link.setAttribute('download', CONFIG.downloadFilename);
      link.setAttribute('title', 'Download Studium for Windows');
      link.setAttribute('rel', 'noopener noreferrer');

      // Add click tracking
      link.addEventListener('click', () => {
        // Could add analytics here if needed
        console.log('Download initiated:', CONFIG.downloadFilename);
      });
    });
  }

  // Year in footer
  function setYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  // SHA256 display
  function setSha256() {
    const shaEl = document.getElementById('sha256');
    if (shaEl && CONFIG.sha256) {
      shaEl.textContent = CONFIG.sha256;
    }
  }

  // Reveal animations using IntersectionObserver
  function startRevealAnimations() {
    const revealNodes = document.querySelectorAll('.reveal');
    if (revealNodes.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealNodes.forEach((node) => node.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  }

  // Hero typing animation (optional, can be disabled)
  function startTyping() {
    const h1 = document.querySelector('.hero-copy h1');
    if (!h1) return;

    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const text = h1.textContent;
    if (text.length > 100) return; // Don't type very long text

    h1.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        h1.textContent += text.charAt(i);
        i++;
        setTimeout(type, 35);
      }
    };
    // Small delay before starting
    setTimeout(type, 400);
  }

  // Smooth scroll enhancement for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Focus target for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Keyboard navigation for feature cards
  function initFeatureCardKeyboard() {
    const cards = document.querySelectorAll('.feature-card[tabindex="0"]');
    cards.forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.add('keyboard-focus');
          // Simulate hover for keyboard users
          setTimeout(() => card.classList.remove('keyboard-focus'), 300);
        }
      });
    });
  }

  // Lazy loading fallback for images
  function initLazyLoadingFallback() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      return;
    }

    // Fallback for browsers without native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => observer.observe(img));
  }

  // Error handling for images
  function initImageErrorHandling() {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
      });
    });
  }

  // Copy to clipboard helper
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(text);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.background = 'var(--success)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  }

  // Performance: Preload critical assets
  function preloadCriticalAssets() {
    // Preload hero image
    const heroImg = document.querySelector('.hero-visual img');
    if (heroImg && heroImg.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImg.src;
      document.head.appendChild(link);
    }

    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = 'https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2';
    document.head.appendChild(fontLink);
  }

  // Initialize everything when DOM is ready
  function init() {
    // Core features
    wireDownloadLinks();
    setYear();
    setSha256();

    // Theme
    initTheme();
    initThemeToggle();

    // Animations & interactions
    startRevealAnimations();
    startTyping();
    initSmoothScroll();
    initFeatureCardKeyboard();

    // Fallbacks & error handling
    initLazyLoadingFallback();
    initImageErrorHandling();
    initCopyButtons();

    // Performance
    preloadCriticalAssets();

    // Add loaded class for CSS transitions
    document.documentElement.classList.add('js-loaded');
  }

  // Run init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.StudiumShowcase = {
    setTheme,
    CONFIG
  };
})();