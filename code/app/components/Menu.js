export function Menu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const menuMobile = document.querySelector(".menu-mobile");

  if (!menuToggle || !menuMobile || !hamburgerIcon) return;

  // Toggle para menú móvil
  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    hamburgerIcon.classList.toggle("open");
    menuMobile.classList.toggle("active");
  });

  // Cerrar el menú al hacer clic fuera
  document.addEventListener("click", function (event) {
    if (
      !menuMobile.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      hamburgerIcon.classList.remove("open");
      menuMobile.classList.remove("active");
    }
  });
}
