document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. Number Count-Up Engine
     ======================================================================== */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const initCounter = (card, index) => {
    const valueEl = card.querySelector(".stat-value");
    if (!valueEl) return;

    const target = parseFloat(card.dataset.target);
    const suffix = card.dataset.suffix || "";
    const decimals = parseInt(card.dataset.decimals || "0", 10);

    const duration = 1500 + index * 80;
    const startDelay = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        const current = easedProgress * target;
        valueEl.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          valueEl.textContent = target.toFixed(decimals) + suffix;
        }
      };

      requestAnimationFrame(step);
    }, startDelay);
  };

  const statCards = document.querySelectorAll(".stat-card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statCards.forEach((card, i) => initCounter(card, i));
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const footer = document.querySelector(".stats-footer");
    if (footer) observer.observe(footer);
  } else {
    statCards.forEach((card, i) => initCounter(card, i));
  }

  /* ========================================================================
     2. Mobile Drawer Navigation
     ======================================================================== */
  const burgerBtn = document.querySelector(".burger-btn");
  const mobileOverlay = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-signin");

  const openMenu = () => {
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileOverlay.removeAttribute("hidden");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileOverlay.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    const isOpen = burgerBtn.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  };

  if (burgerBtn && mobileOverlay) {
    burgerBtn.addEventListener("click", toggleMenu);

    // Close when clicking on backdrop outside the white sheet
    mobileOverlay.addEventListener("click", (e) => {
      if (e.target === mobileOverlay) {
        closeMenu();
      }
    });

    // Close on navigation link selection
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close on Escape key press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burgerBtn.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });

    // Auto-close if screen expands above mobile breakpoint
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720 && burgerBtn.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });
  }
});
