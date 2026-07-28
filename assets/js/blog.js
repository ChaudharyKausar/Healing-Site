/* ============================================================
   Healing Site — Blog Page JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     UTILITY HELPERS
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     NAVIGATION — Hamburger / Mobile Menu
     ============================================================ */
  function initNav() {
    const hamburger = $('.hamburger');
    const mobileMenu = $('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    const btn = $('.back-to-top');
    if (!btn) return;

    const toggle = () => btn.classList.toggle('visible', window.scrollY > 300);
    window.addEventListener('scroll', toggle, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     FADE-IN ANIMATIONS — Intersection Observer
     ============================================================ */
  function initFadeIn() {
    const items = $$('.fade-in');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ============================================================
     BLOG LIST — Category Filter + Search
     ============================================================ */
  function initBlogFilters() {
    const pills        = $$('.filter-pill');
    const cards        = $$('.blog-card');
    const noResults    = $('.no-results');
    const countEl      = $('.results-count strong');
    const mainSearch   = $('#main-search-input');
    const sideSearch   = $('#sidebar-search-input');

    if (!pills.length || !cards.length) return;

    let activeCategory = 'all';
    let searchQuery    = '';

    function normalize(str) {
      return str.toLowerCase().trim();
    }

    function filterCards() {
      let visible = 0;

      cards.forEach((card) => {
        const cat     = normalize(card.dataset.category || '');
        const title   = normalize(card.dataset.title   || '');
        const excerpt = normalize(card.dataset.excerpt || '');

        const categoryMatch =
          activeCategory === 'all' || cat === normalize(activeCategory);

        const searchMatch =
          !searchQuery ||
          title.includes(searchQuery) ||
          excerpt.includes(searchQuery) ||
          cat.includes(searchQuery);

        if (categoryMatch && searchMatch) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countEl) countEl.textContent = visible;
      if (noResults) noResults.classList.toggle('show', visible === 0);
    }

    // Category pills
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.category;
        filterCards();
      });
    });

    // Search — main hero search
    if (mainSearch) {
      mainSearch.addEventListener('input', () => {
        searchQuery = normalize(mainSearch.value);
        if (sideSearch) sideSearch.value = mainSearch.value;
        filterCards();
      });
    }

    // Search — sidebar
    if (sideSearch) {
      sideSearch.addEventListener('input', () => {
        searchQuery = normalize(sideSearch.value);
        if (mainSearch) mainSearch.value = sideSearch.value;
        filterCards();
      });
    }

    // Initial count
    if (countEl) countEl.textContent = cards.length;
  }

  /* ============================================================
     CLIENT-SIDE PAGINATION
     ============================================================ */
  function initPagination() {
    const grid       = $('.blog-grid');
    const pagination = $('.pagination');
    if (!grid || !pagination) return;

    const CARDS_PER_PAGE = 6;
    const cards          = $$('.blog-card', grid);
    let   currentPage    = 1;

    function getVisibleCards() {
      return cards.filter((c) => !c.classList.contains('hidden'));
    }

    function renderPage(page) {
      currentPage = page;
      const visible = getVisibleCards();
      const total   = Math.ceil(visible.length / CARDS_PER_PAGE);
      const start   = (page - 1) * CARDS_PER_PAGE;
      const end     = start + CARDS_PER_PAGE;

      visible.forEach((card, i) => {
        card.style.display = i >= start && i < end ? '' : 'none';
      });

      renderPagination(total);
    }

    function renderPagination(total) {
      if (total <= 1) {
        pagination.innerHTML = '';
        return;
      }

      let html = '';

      // Prev
      html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
                 <i class="fa-solid fa-chevron-left" style="font-size:0.75rem"></i>
               </button>`;

      for (let i = 1; i <= total; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>`;
      }

      // Next
      html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === total ? 'disabled' : ''} aria-label="Next page">
                 <i class="fa-solid fa-chevron-right" style="font-size:0.75rem"></i>
               </button>`;

      pagination.innerHTML = html;

      $$('.page-btn', pagination).forEach((btn) => {
        if (!btn.disabled) {
          btn.addEventListener('click', () => {
            const p = parseInt(btn.dataset.page);
            if (!isNaN(p)) {
              renderPage(p);
              grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      });
    }

    // Re-run pagination when filters change
    const observer = new MutationObserver(() => renderPage(1));
    cards.forEach((c) => observer.observe(c, { attributes: true, attributeFilter: ['class'] }));

    renderPage(1);
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  function initNewsletter() {
    $$('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input   = form.querySelector('input[type="email"]');
        const success = form.parentElement.querySelector('.newsletter-success');

        if (!input || !input.value.trim()) {
          input && input.focus();
          return;
        }

        if (!isValidEmail(input.value)) {
          input.style.border = '2px solid #e53e3e';
          input.focus();
          setTimeout(() => { input.style.border = ''; }, 2000);
          return;
        }

        // Simulate submit
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Subscribing…';
          btn.disabled = true;
        }

        setTimeout(() => {
          form.style.display = 'none';
          if (success) success.classList.add('show');
        }, 900);
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     READING PROGRESS BAR (Blog Post Page)
     ============================================================ */
  function initReadingProgress() {
    const bar     = $('.reading-progress-bar');
    const article = $('article .post-content');
    if (!bar || !article) return;

    function update() {
      const rect   = article.getBoundingClientRect();
      const total  = article.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct    = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     SIDEBAR CATEGORY FILTER (Blog Post Sidebar)
     ============================================================ */
  function initSidebarCategories() {
    $$('.category-item').forEach((item) => {
      item.addEventListener('click', () => {
        const cat = item.dataset.category;
        if (cat && window.location.pathname.includes('blog.html')) {
          window.location.href = `blog.html?category=${encodeURIComponent(cat)}`;
        } else if (cat) {
          window.location.href = `blog.html?category=${encodeURIComponent(cat)}`;
        }
      });
    });
  }

  /* ============================================================
     URL PARAMS — Pre-select category from URL
     ============================================================ */
  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat    = params.get('category');
    const q      = params.get('q');

    if (cat) {
      const pill = $(`.filter-pill[data-category="${cat}"]`);
      if (pill) {
        $$('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        pill.click();
      }
    }

    if (q) {
      const input = $('#main-search-input') || $('#sidebar-search-input');
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event('input'));
      }
    }
  }

  /* ============================================================
     POPULAR POSTS — Click to Navigate
     ============================================================ */
  function initPopularPosts() {
    $$('.popular-post-item').forEach((item) => {
      item.addEventListener('click', () => {
        window.location.href = item.dataset.href || 'blog-post.html';
      });
      item.style.cursor = 'pointer';
    });
  }

  /* ============================================================
     SHARE BUTTONS
     ============================================================ */
  function initShareButtons() {
    $$('.share-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.share;
        const url      = encodeURIComponent(window.location.href);
        const title    = encodeURIComponent(document.title);

        const urls = {
          facebook  : `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          twitter   : `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
          linkedin  : `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
          whatsapp  : `https://api.whatsapp.com/send?text=${title}%20${url}`,
          copy      : null,
        };

        if (platform === 'copy') {
          navigator.clipboard.writeText(window.location.href).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML  = '<i class="fa-solid fa-check"></i>';
            btn.style.background = 'var(--green-primary)';
            btn.style.color = 'white';
            setTimeout(() => {
              btn.innerHTML = original;
              btn.style.background = '';
              btn.style.color = '';
            }, 1800);
          });
          return;
        }

        if (urls[platform]) {
          window.open(urls[platform], '_blank', 'width=600,height=400,noopener');
        }
      });
    });
  }

  /* ============================================================
     SORT SELECT
     ============================================================ */
  function initSort() {
    const sortEl = $('.sort-select');
    const grid   = $('.blog-grid');
    if (!sortEl || !grid) return;

    sortEl.addEventListener('change', () => {
      const val   = sortEl.value;
      const cards = $$('.blog-card', grid);

      cards.sort((a, b) => {
        if (val === 'oldest') {
          return new Date(a.dataset.date) - new Date(b.dataset.date);
        } else {
          return new Date(b.dataset.date) - new Date(a.dataset.date);
        }
      });

      cards.forEach((c) => grid.appendChild(c));
    });
  }

  /* ============================================================
     STICKY NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  function initStickyNav() {
    const nav = $('.navbar');
    if (!nav) return;
    let lastY = 0;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 100 && y > lastY) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = '';
      }
      lastY = y;
    }, { passive: true });

    nav.style.transition = 'transform 0.35s ease';
  }

  /* ============================================================
     HERO SEARCH — Submit / Enter Key
     ============================================================ */
  function initHeroSearch() {
    const form  = $('.hero-search');
    if (!form) return;
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');

    function doSearch() {
      const q = input.value.trim();
      if (!q) return;

      // If on blog.html, filter inline
      const mainInput = $('#main-search-input');
      if (mainInput) {
        mainInput.value = q;
        mainInput.dispatchEvent(new Event('input'));
        document.querySelector('.blog-grid')?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (btn)   btn.addEventListener('click', doSearch);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
  }

  /* ============================================================
     TAGS FILTER
     ============================================================ */
  function initTags() {
    $$('.tag-pill').forEach((tag) => {
      tag.addEventListener('click', () => {
        const q = tag.textContent.trim();
        const mainInput = $('#main-search-input') || $('#sidebar-search-input');
        if (mainInput) {
          mainInput.value = q;
          mainInput.dispatchEvent(new Event('input'));
        }
      });
    });
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    // initNav();
    initBackToTop();
    initFadeIn();
    initBlogFilters();
    initPagination();
    initNewsletter();
    initReadingProgress();
    initSidebarCategories();
    initFromURL();
    initPopularPosts();
    initShareButtons();
    initSort();
    initStickyNav();
    initHeroSearch();
    initTags();
  });

})();
