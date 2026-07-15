document.addEventListener('DOMContentLoaded', () => {
  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Mobile nav toggle ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active')));
  }

  // ── Typing animation ──
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const texts = ['UI/UX Designer', 'Frontend Developer', 'Mobile Developer', 'Data Analyst', 'Quality Assurance'];
    let textIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const current = texts[textIdx];
      typedEl.textContent = current.substring(0, charIdx);
      if (!deleting && charIdx < current.length) { charIdx++; setTimeout(type, 80); }
      else if (!deleting) { setTimeout(() => { deleting = true; type(); }, 1800); }
      else if (deleting && charIdx > 0) { charIdx--; setTimeout(type, 40); }
      else { deleting = false; textIdx = (textIdx + 1) % texts.length; setTimeout(type, 400); }
    }
    type();
  }

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Project filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) { card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => { card.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
        }
      });
    });
  });

  // ── Modal ──
  const overlay = document.getElementById('modal-overlay');
  const modalGalleryImg = document.getElementById('modal-gallery-img');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const dotsContainer = document.getElementById('gallery-dots');
  let currentImages = [], currentIdx = 0;

  function showImage(idx) {
    currentIdx = idx;
    modalGalleryImg.style.opacity = '0';
    setTimeout(() => { modalGalleryImg.src = currentImages[idx]; modalGalleryImg.style.opacity = '1'; }, 200);
    dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  const modalSteps = document.getElementById('modal-steps');
  const modalStepsWrapper = document.getElementById('modal-steps-wrapper');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const d = card.dataset;
      modalTitle.textContent = d.name;
      modalTagline.textContent = d.tagline;
      modalDesc.textContent = d.description;
      modalFeatures.innerHTML = d.features.split(',').map(f => `<span class="modal-feature">${f.trim()}</span>`).join('');
      modalTech.innerHTML = d.tech.split(',').map(t => `<span class="modal-tech-tag">${t.trim()}</span>`).join('');

      // Handle steps (for data analysis projects)
      if (d.steps) {
        try {
          const steps = JSON.parse(d.steps);
          modalSteps.innerHTML = steps.map((s, i) => 
            `<div class="step-item"><div class="step-number">${i + 1}</div><div class="step-content"><div class="step-title">${s.title}</div><div class="step-desc">${s.desc}</div></div></div>`
          ).join('');
          modalStepsWrapper.style.display = '';
        } catch(e) { modalStepsWrapper.style.display = 'none'; }
      } else {
        modalStepsWrapper.style.display = 'none';
      }

      currentImages = d.images.split(',');
      dotsContainer.innerHTML = currentImages.map((_, i) => `<button class="gallery-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`).join('');
      dotsContainer.querySelectorAll('.gallery-dot').forEach(dot => dot.addEventListener('click', () => showImage(parseInt(dot.dataset.idx))));
      showImage(0);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelector('.gallery-prev')?.addEventListener('click', (e) => { e.stopPropagation(); showImage((currentIdx - 1 + currentImages.length) % currentImages.length); });
  document.querySelector('.gallery-next')?.addEventListener('click', (e) => { e.stopPropagation(); showImage((currentIdx + 1) % currentImages.length); });

  function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showImage((currentIdx - 1 + currentImages.length) % currentImages.length);
    if (e.key === 'ArrowRight') showImage((currentIdx + 1) % currentImages.length);
  });

  // ── Active nav on scroll ──
  const sections = document.querySelectorAll('.section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop, height = sec.offsetHeight, id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
    });
  });
});
