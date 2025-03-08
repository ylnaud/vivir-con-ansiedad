export function DetectDevice() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    document.body.classList.add("mobile-device");
  } else {
    document.body.classList.remove("mobile-device");
  }
}
