// Menu mobile, smooth scroll (Lenis), animasi scroll, form kontak, dan galeri portofolio
document.addEventListener("DOMContentLoaded", function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".header");
  var headerH = function () { return header ? header.offsetHeight : 0; };

  // Smooth scroll dengan Lenis (dimuat dari CDN; jika gagal, scroll biasa tetap jalan)
  var lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  var lockScroll = function (on) {
    if (lenis) on ? lenis.stop() : lenis.start();
    else document.documentElement.style.overflow = on ? "hidden" : "";
  };
  var scrollToEl = function (el, instant) {
    if (lenis) lenis.scrollTo(el, { offset: -headerH(), immediate: !!instant });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH(), behavior: instant || reduced ? "auto" : "smooth" });
  };

  // Link anchor di halaman yang sama
  document.querySelectorAll('a[href*="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      var target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToEl(target);
    });
  });
  // Datang dari halaman lain dengan hash (mis. portofolio.html#kekkon)
  if (location.hash) {
    var initial = document.querySelector(location.hash);
    if (initial) setTimeout(function () { scrollToEl(initial, true); }, 60);
  }

  // Header: garis bawah saat halaman di-scroll
  var onScroll = function () { if (header) header.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    var setMenu = function (open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    };
    toggle.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
    links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 720) setMenu(false); });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Form kontak: sementara membuka aplikasi email (belum ada backend)
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = "Nama: " + d.get("nama") + "\nEmail: " + d.get("email") +
        "\nLayanan: " + d.get("layanan") + "\n\n" + d.get("pesan");
      // Ganti alamat email di bawah dengan email perusahaan
      window.location.href = "mailto:info@mihan.web.id?subject=" +
        encodeURIComponent("Konsultasi dari website") + "&body=" + encodeURIComponent(body);
    });
  }

  // Portofolio: tab screenshot, auto-ganti, dan lightbox
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var open = function (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; lockScroll(true); };
    var close = function () { if (lb.hidden) return; lb.hidden = true; lbImg.src = ""; lockScroll(false); };
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    document.querySelectorAll(".pf-stage").forEach(function (stage) {
      var imgs = stage.querySelectorAll(".browser-screen img");
      var tabs = stage.querySelectorAll(".pf-tabs button");
      var cur = 0, timer;
      var show = function (i) {
        cur = i;
        imgs.forEach(function (im, j) { im.classList.toggle("active", j === i); });
        tabs.forEach(function (t, j) {
          t.classList.toggle("active", j === i);
          t.setAttribute("aria-selected", j === i);
        });
      };
      var auto = function () {
        clearInterval(timer);
        if (imgs.length > 1 && !reduced) timer = setInterval(function () { show((cur + 1) % imgs.length); }, 5000);
      };
      tabs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); auto(); }); });
      stage.querySelector(".browser-screen").addEventListener("click", function () { open(imgs[cur]); });
      var phone = stage.querySelector(".phone img");
      if (phone) phone.parentNode.addEventListener("click", function () { open(phone); });
      stage.addEventListener("mouseenter", function () { clearInterval(timer); });
      stage.addEventListener("mouseleave", auto);
      auto();
    });
  }

  // Animasi muncul saat di-scroll. Anak dari [data-reveal-group] mendapat jeda bertahap.
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var step = parseFloat(group.getAttribute("data-reveal-group")) || 0.1;
    group.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", (i * step).toFixed(2) + "s");
    });
  });
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Tampilkan juga elemen yang sudah terlewat (scroll cepat / lompat ke anchor)
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Parallax ringan: data-parallax="0.08" (positif = bergerak lebih lambat dari scroll)
  var px = document.querySelectorAll("[data-parallax]");
  if (px.length && !reduced) {
    var ticking = false;
    var update = function () {
      ticking = false;
      if (window.innerWidth <= 720) { px.forEach(function (el) { el.style.transform = ""; }); return; }
      var vh = window.innerHeight;
      px.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute("data-parallax"));
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
    };
    var request = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    if (lenis) lenis.on("scroll", request); else window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }
});
