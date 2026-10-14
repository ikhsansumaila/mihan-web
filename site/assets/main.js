// Menu mobile + tahun otomatis di footer
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
  }
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Form kontak: sementara membuka WhatsApp/email (belum ada backend)
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
    var open = function (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; };
    var close = function () { lb.hidden = true; lbImg.src = ""; };
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    document.querySelectorAll(".pf-stage").forEach(function (stage) {
      var imgs = stage.querySelectorAll(".browser-screen img");
      var tabs = stage.querySelectorAll(".pf-tabs button");
      var cur = 0, timer;
      var show = function (i) {
        cur = i;
        imgs.forEach(function (im, j) { im.classList.toggle("active", j === i); });
        tabs.forEach(function (t, j) { t.classList.toggle("active", j === i); });
      };
      var auto = function () {
        clearInterval(timer);
        timer = setInterval(function () { show((cur + 1) % imgs.length); }, 5000);
      };
      tabs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); auto(); }); });
      stage.querySelector(".browser-screen").addEventListener("click", function () { open(imgs[cur]); });
      var phone = stage.querySelector(".phone img");
      if (phone) phone.parentNode.addEventListener("click", function () { open(phone); });
      stage.addEventListener("mouseenter", function () { clearInterval(timer); });
      stage.addEventListener("mouseleave", auto);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) auto();
    });
  }

  // Animasi muncul saat di-scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
});
