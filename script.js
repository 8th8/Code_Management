(function () {
  'use strict';

  const CONTACT_EMAIL = 'z2242505@std.kiis.ac.jp';

  /* ---------- Năm ở footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Intro: bấm để bỏ qua ---------- */
  const intro = document.getElementById('intro');
  if (intro) {
    intro.addEventListener('click', () => intro.classList.add('hide'));
  }

  /* ---------- Ảnh / video lỗi: ẩn đi để hiện nền dự phòng ---------- */
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
  document.querySelectorAll('video').forEach((video) => {
    video.addEventListener('error', () => { video.style.display = 'none'; }, true);
    // Tôn trọng người dùng tắt hiệu ứng chuyển động
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
  });

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }

  if (burger) {
    burger.addEventListener('click', () => {
      setMenu(!document.body.classList.contains('menu-open'));
    });
  }
  navLinks.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) setMenu(false); });

  /* ---------- Hiệu ứng xuất hiện khi cuộn ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Đánh dấu mục menu đang xem ---------- */
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function updateActive() {
    const y = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= y) current = s; });
    navLinks.forEach((a) => {
      a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ---------- Carousel dự án ---------- */
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.querySelector('.scroll-btn.prev');
  const nextBtn = document.querySelector('.scroll-btn.next');

  if (track && prevBtn && nextBtn) {
    const step = () => {
      const card = track.querySelector('.project');
      return card ? card.offsetWidth + 20 : 320;
    };

    const updateButtons = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= max;
    };

    prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  /* ---------- Link "#" chưa có địa chỉ: không nhảy lên đầu trang ---------- */
  document.querySelectorAll('a[href="#"]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  /* ---------- Form liên hệ ---------- */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  function setStatus(text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      let valid = true;
      [form.elements.name, form.elements.email, form.elements.message].forEach((field) => {
        const ok = field.value.trim() !== '' && field.checkValidity();
        field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        setStatus('Please fill in all fields correctly.', 'error');
        return;
      }

      const subject = encodeURIComponent('Contact from portfolio: ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      setStatus('Opening your email app…', 'ok');
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
    });

    form.addEventListener('input', (e) => {
      e.target.classList.remove('invalid');
      setStatus('', '');
    });
  }
})();