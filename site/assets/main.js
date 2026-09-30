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
      window.location.href = "mailto:halo@mihan.web.id?subject=" +
        encodeURIComponent("Konsultasi dari website") + "&body=" + encodeURIComponent(body);
    });
  }
});
