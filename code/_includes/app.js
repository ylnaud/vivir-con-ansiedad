document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const menuMobile = document.querySelector(".menu-mobile");
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  // Toggle para menú móvil
  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation(); // Evita que el clic se propague y cierre el menú inmediatamente
    hamburgerIcon.classList.toggle("open");
    menuMobile.classList.toggle("active");
  });

  // Cerrar el menú móvil al hacer clic fuera
  document.addEventListener("click", function (event) {
    if (
      !menuMobile.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      hamburgerIcon.classList.remove("open");
      menuMobile.classList.remove("active");
    }
  });

  // Cargar la preferencia del modo oscuro al iniciar
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    darkModeToggle.textContent = "☀️"; // Sol para modo oscuro
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    darkModeToggle.textContent = "🌕"; // Luna para modo claro
  }

  // Cambiar el modo y guardar la preferencia
  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled"); // Guardar preferencia
      darkModeToggle.textContent = "☀️"; // Sol para modo oscuro
    } else {
      localStorage.setItem("dark-mode", "disabled"); // Guardar preferencia
      darkModeToggle.textContent = "🌕"; // Luna para modo claro
    }
  });

  // Detectar dispositivo móvil y añadir clase
  function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.classList.add("mobile-device");
    } else {
      document.body.classList.remove("mobile-device");
    }
  }

  detectDevice();
});
