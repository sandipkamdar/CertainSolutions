/**
 * Certain Solutions — Main Script
 * Mobile navigation, scroll effects, active links, and form validation
 */

(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const contactForm = document.getElementById("contact-form");
  const currentYear = document.getElementById("current-year");
  const sections = document.querySelectorAll("section[id]");

  /* Footer year */
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* Header scroll effect */
  function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  /* Mobile navigation */
  function openNav() {
    if (!navToggle || !siteNav) return;

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    siteNav.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  function closeNav() {
    if (!navToggle || !siteNav) return;

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function toggleNav() {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", toggleNav);

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          closeNav();
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeNav();
      }
    });
  }

  /* Smooth scroll with fixed header offset */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      history.pushState(null, "", targetId);
    });
  });

  /* Active navigation link */
  function setActiveNavLink() {
    const offset = header ? header.offsetHeight + 80 : 120;
    const scrollPosition = window.scrollY + offset;

    let activeSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + activeSection);
    });
  }

  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  window.addEventListener("resize", setActiveNavLink);
  setActiveNavLink();

  /* Contact form validation */
  const validators = {
    firstName(value) {
      if (!value.trim()) return "First name is required.";
      if (value.trim().length < 2) return "Please enter at least 2 characters.";
      return "";
    },

    lastName(value) {
      if (!value.trim()) return "Last name is required.";
      if (value.trim().length < 2) return "Please enter at least 2 characters.";
      return "";
    },

    email(value) {
      if (!value.trim()) return "Email is required.";

      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(value.trim())) return "Please enter a valid email address.";

      return "";
    },

    company(value) {
      if (!value.trim()) return "Company name is required.";
      return "";
    },

    message(value) {
      if (!value.trim()) return "Please tell us how we can help.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
      return "";
    }
  };

  const fieldConfig = {
    "first-name": "firstName",
    "last-name": "lastName",
    email: "email",
    company: "company",
    message: "message"
  };

  function showFieldError(elementId, message) {
    const field = document.getElementById(elementId);
    const errorElement = document.getElementById(elementId + "-error");

    if (field) {
      field.classList.toggle("is-invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function validateField(elementId) {
    const validatorKey = fieldConfig[elementId];
    const field = document.getElementById(elementId);

    if (!validatorKey || !field || !validators[validatorKey]) {
      return true;
    }

    const error = validators[validatorKey](field.value);
    showFieldError(elementId, error);

    return !error;
  }

  if (contactForm) {
    const requiredFields = Object.keys(fieldConfig);

    requiredFields.forEach(function (elementId) {
      const field = document.getElementById(elementId);

      if (!field) return;

      field.addEventListener("blur", function () {
        validateField(elementId);
      });

      field.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) {
          validateField(elementId);
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formSuccess = document.getElementById("form-success");

      if (formSuccess) {
        formSuccess.hidden = true;
      }

      let isValid = true;

      requiredFields.forEach(function (elementId) {
        if (!validateField(elementId)) {
          isValid = false;
        }
      });

      if (!isValid) {
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /*
        Static website behavior:
        This validates the form and shows success, but it does not send email yet.
        Connect this form to Formspree, Netlify Forms, EmailJS, or backend service.
      */

      contactForm.reset();

      requiredFields.forEach(function (elementId) {
        showFieldError(elementId, "");
      });

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.focus();
      }
    });
  }
})();