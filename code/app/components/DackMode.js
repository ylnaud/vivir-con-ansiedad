export function DarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  if (!darkModeToggle) return;

  // Cargar preferencia guardada
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    darkModeToggle.textContent = "☀️";
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    darkModeToggle.textContent = "🌕";
  }

  // Alternar modo oscuro/claro
  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
      darkModeToggle.textContent = "☀️";
    } else {
      localStorage.setItem("dark-mode", "disabled");
      darkModeToggle.textContent = "🌕";
    }
  });
}
