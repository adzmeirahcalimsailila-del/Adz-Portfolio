(function () {
  // ============================================================
  //  PAGE / SLIDE NAVIGATION
  //  Bawat nav link ay may data-page, at may section na id="page-xxx"
  // ============================================================

  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageDots = document.querySelectorAll('.dot');
  const navLogo = document.querySelector('.nav-logo');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  // ---- Function para lumipat ng page ----
  function goToPage(pageName) {
    // Hide all pages
    pages.forEach((page) => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) {
      targetPage.classList.add('active');
      // Reset scroll ng target page
      targetPage.scrollTop = 0;
    }

    // Update nav links active state
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageName) {
        link.classList.add('active');
      }
    });

    // Update dots active state
    pageDots.forEach((dot) => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-page') === pageName) {
        dot.classList.add('active');
      }
    });

    // Update URL hash (optional, para pwede i-bookmark)
    history.replaceState(null, '', '#' + pageName);

    // Close mobile menu if open
    if (navLinksContainer.classList.contains('open')) {
      navLinksContainer.classList.remove('open');
      const icon = navToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }

    // Replay skill bar animation kapag skills page
    if (pageName === 'skills') {
      replaySkillBars();
    }
  }

  // ---- Nav links click ----
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const pageName = this.getAttribute('data-page');
      if (pageName) goToPage(pageName);
    });
  });

  // ---- Logo click → home ----
  if (navLogo) {
    navLogo.addEventListener('click', function (e) {
      e.preventDefault();
      goToPage('home');
    });
  }

  // ---- Dots click ----
  pageDots.forEach((dot) => {
    dot.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName) goToPage(pageName);
    });
  });

  // ---- Home buttons (About Me / Contact) ----
  const homeButtons = document.querySelectorAll('[data-page].btn-primary, [data-page].btn-outline');
  homeButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const pageName = this.getAttribute('data-page');
      if (pageName) goToPage(pageName);
    });
  });

  // ============================================================
  //  MOBILE NAV TOGGLE
  // ============================================================
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navLinksContainer.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (navLinksContainer.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // ============================================================
  //  SKILL BAR ANIMATION
  // ============================================================
  const skillFills = document.querySelectorAll('.skill-bar-fill');

  // Save original widths + reset to 0
  skillFills.forEach((bar) => {
    const width = bar.style.width;
    bar.setAttribute('data-width', width);
    bar.style.width = '0%';
  });

  // Animate on load (kapag nasa skills page)
  function replaySkillBars() {
    skillFills.forEach((bar) => {
      bar.style.width = '0%';
    });

    // Force reflow
    void document.body.offsetWidth;

    setTimeout(() => {
      skillFills.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
          bar.style.width = targetWidth;
        }
      });
    }, 100);
  }

  // ============================================================
  //  KEYBOARD NAVIGATION (arrow keys + number keys)
  // ============================================================
  const pageOrder = ['home', 'about', 'education', 'skills', 'experience', 'contact'];

  document.addEventListener('keydown', function (e) {
    // Get current active page
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    const currentId = currentPage.id.replace('page-', '');
    const currentIndex = pageOrder.indexOf(currentId);

    let newIndex = currentIndex;

    // Arrow right / down = next page
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % pageOrder.length;
    }
    // Arrow left / up = previous page
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
    }
    // Number keys 1-6 = jump to page
    else if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      newIndex = parseInt(e.key) - 1;
    }

    if (newIndex !== currentIndex) {
      goToPage(pageOrder[newIndex]);
    }
  });

  // ============================================================
  //  INITIAL LOAD — check URL hash kung may naka-set
  // ============================================================
  window.addEventListener('load', function () {
    const hash = window.location.hash.replace('#', '');
    if (hash && pageOrder.includes(hash)) {
      goToPage(hash);
    } else {
      goToPage('home');
    }
  });

})();
