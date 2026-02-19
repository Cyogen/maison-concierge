/* ============================================================
   MAISON CONCIERGE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // NAV: Scroll behavior — transparent → scrolled
  // ============================================================
  const navbar = document.getElementById('navbar');

  if (navbar) {
    const handleNavScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('nav--scrolled');
        navbar.classList.remove('nav--transparent');
      } else {
        navbar.classList.remove('nav--scrolled');
        navbar.classList.add('nav--transparent');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run on load
  }


  // ============================================================
  // MOBILE MENU
  // ============================================================
  const hamburger     = document.getElementById('hamburger');
  const mobileNav     = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const openMenu = () => {
    mobileNav?.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileOverlay?.addEventListener('click', closeMenu);

  // Close menu on link click
  document.querySelectorAll('.mobile-nav__links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ============================================================
  // FADE-IN ON SCROLL (Intersection Observer)
  // ============================================================
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger sibling elements slightly
            const siblings = Array.from(entry.target.parentElement?.children || []);
            const siblingIndex = siblings.indexOf(entry.target);
            const delay = siblingIndex * 80;

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(el => observer.observe(el));
  }


  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-item__icon').textContent = '+';
        }
      });

      // Toggle current item
      item.classList.toggle('open', !isOpen);
      const icon = item.querySelector('.faq-item__icon');
      if (icon) icon.textContent = isOpen ? '+' : '×';
    });
  });


  // ============================================================
  // CONTACT FORM — Basic Validation & Submission
  // ============================================================
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = contactForm.querySelectorAll('[required]');
    let valid = true;

    // Clear previous errors
    contactForm.querySelectorAll('.field-error').forEach(el => el.remove());
    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.style.borderColor = '';
    });

    requiredFields.forEach(field => {
      const isEmpty = (field.type === 'checkbox') ? !field.checked : !field.value.trim();

      if (isEmpty) {
        valid = false;
        field.style.borderColor = '#c0392b';

        if (field.type !== 'checkbox') {
          const error = document.createElement('p');
          error.className = 'field-error';
          error.style.cssText = 'color: #c0392b; font-size: 0.72rem; margin-top: 4px;';
          error.textContent = 'This field is required.';
          field.parentElement.appendChild(error);
        }
      }
    });

    // Basic email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = '#c0392b';
      const error = document.createElement('p');
      error.className = 'field-error';
      error.style.cssText = 'color: #c0392b; font-size: 0.72rem; margin-top: 4px;';
      error.textContent = 'Please enter a valid email address.';
      emailField.parentElement.appendChild(error);
    }

    if (!valid) return;

    // Simulate submission success
    // In production: replace with fetch() to your form handler / CRM / email service
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      window.scrollTo({ top: formSuccess?.offsetTop - 100 || 0, behavior: 'smooth' });
    }, 1200);
  });


  // ============================================================
  // SMOOTH SCROLL — Anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ============================================================
  // ACTIVE NAV LINK — highlight based on current page
  // ============================================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

});
