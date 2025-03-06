document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita el envío automático del formulario

    const myForm = event.target;
    
    // Expresiones regulares para validación
    const namePattern = /^[a-zA-Z\s]{1,50}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const messagePattern = /^.{1,250}$/;

    const name = myForm.querySelector('input[name="name"]').value;
    const email = myForm.querySelector('input[name="email"]').value;
    const message = myForm.querySelector('textarea[name="message"]').value;

    // Validaciones
    if (!namePattern.test(name)) {
      alert("Please enter a valid name (letters and spaces only, up to 50 characters).");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!messagePattern.test(message)) {
      alert("Your message should be between 1 and 250 characters.");
      return;
    }

    // Enviar formulario si las validaciones son correctas
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        console.log("Form successfully submitted");
        alert("Form successfully submitted");
      })
      .catch((error) => alert(error));
  };

  document.querySelector("form").addEventListener("submit", handleSubmit);
});
