"use strict";

// Funciones de retroalimentación
function mostrarError(campoId, mensaje) {

  const campo = document.querySelector(`#${campoId}`);
  const span  = document.querySelector(`#error-${campoId}`);

  campo.classList.add("invalido");
  campo.classList.remove("valido");

  span.textContent = mensaje;
  span.classList.add("visible");
}

function limpiarError(campoId) {

  const campo = document.querySelector(`#${campoId}`);
  const span  = document.querySelector(`#error-${campoId}`);

  campo.classList.remove("invalido");
  campo.classList.add("valido");

  span.textContent = "";
  span.classList.remove("visible");
}

function limpiarTodo() {
  ["nombre", "email", "password", "confirmar", "telefono"]
    .forEach(id => limpiarError(id));
}


// Validadores por campo
function validarNombre() {
  const campo = document.querySelector("#nombre");

  if (campo.validity.valueMissing) {
    mostrarError("nombre", "El nombre es obligatorio.");
    return false;
  }

  if (campo.validity.tooShort) {
    mostrarError(
      "nombre",
      `El nombre debe tener al menos ${campo.minLength} caracteres.`
    );
    return false;
  }

  limpiarError("nombre");
  return true;
}


function validarEmail() {
  const campo = document.querySelector("#email");

  if (campo.validity.valueMissing) {
    mostrarError("email", "El correo es obligatorio.");
    return false;
  }

  if (campo.validity.typeMismatch) {
    mostrarError("email", "El formato del correo no es válido.");
    return false;
  }

  limpiarError("email");
  return true;
}


function validarPassword() {
  const campo = document.querySelector("#password");

  if (campo.validity.valueMissing) {
    mostrarError("password", "La contraseña es obligatoria.");
    return false;
  }

  if (campo.validity.tooShort) {
    mostrarError("password", "Debe tener al menos 8 caracteres.");
    return false;
  }

  // Regex: mínimo 1 mayúscula y 1 número
  const regex = /^(?=.*[A-Z])(?=.*\d).+$/;

  if (!regex.test(campo.value)) {
    mostrarError(
      "password",
      "Debe incluir al menos una mayúscula y un número."
    );
    return false;
  }

  limpiarError("password");
  return true;
}


function validarConfirmar() {
    
    const campoConfirmar = document.querySelector("#confirmar");
    const password = document.querySelector("#password").value;

  if (campoConfirmar.validity.valueMissing) {
    mostrarError("confirmar", "La confirmación es obligatoria.");
    return false;
  }

  if (password !== campoConfirmar.value) {
    mostrarError("confirmar", "Las contraseñas no coinciden.");
    return false;
  }

  limpiarError("confirmar");
  return true;
}


function validarTelefono() {
  const campo = document.querySelector("#telefono");

  // opcional
  if (!campo.value.trim()) {
    limpiarError("telefono");
    return true;
  }

  if (campo.validity.patternMismatch) {
    mostrarError(
      "telefono",
      "Solo dígitos, entre 7 y 15 caracteres."
    );
    return false;
  }

  limpiarError("telefono");
  return true;
}


// Validación en tiempo real (blur por campo)
// Nombre
document.querySelector("#nombre")
  .addEventListener("blur", validarNombre);

// Email
document.querySelector("#email")
  .addEventListener("blur", validarEmail);

// Password
document.querySelector("#password")
  .addEventListener("blur", validarPassword);

// Confirmar contraseña
document.querySelector("#confirmar")
  .addEventListener("blur", validarConfirmar);

// Teléfono
document.querySelector("#telefono")
  .addEventListener("blur", validarTelefono);


// Limpiar error al comenzar a escribir
// Confirmar contraseña (caso especial)
document.querySelector("#confirmar")
  .addEventListener("input", () => {
    const campo = document.querySelector("#confirmar");

    if (campo.value.trim()) {
      limpiarError("confirmar");
    }
  });


// Manejo del submit
const form = document.querySelector("#form-registro");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Siempre prevenir envío por defecto

  // Ejecutar todas las validaciones
  const resultados = [
    validarNombre(),
    validarEmail(),
    validarPassword(),
    validarConfirmar(),
    validarTelefono()
  ];

  const todoValido = resultados.every(r => r === true);

  if (todoValido) {
  // Mostrar mensaje de éxito  
    const mensajeExito = document.querySelector("#mensaje-exito");
    mensajeExito.classList.remove("oculto");

    // Limpiar después de 2 segundos
    setTimeout(() => {
      form.reset();
      limpiarTodo();
      mensajeExito.classList.add("oculto");
    }, 2000);

  } else {
    // Enfocar primer campo inválido
    const primerInvalido = form.querySelector(".invalido");
    if (primerInvalido) primerInvalido.focus();
  }
});


// Indicador de fortaleza de contraseña
function evaluarFortaleza(valor) {
  let puntos = 0;

  if (valor.length >= 8) puntos++;
  if (/[A-Z]/.test(valor)) puntos++;
  if (/[0-9]/.test(valor)) puntos++;
  if (/[^A-Za-z0-9]/.test(valor)) puntos++;

  const niveles = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const colores = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  return {
    nivel: niveles[puntos],
    color: colores[puntos],
    puntos
  };
}

const campoPassword = document.querySelector("#password");

campoPassword.addEventListener("input", () => {
  const { nivel, color, puntos } = evaluarFortaleza(campoPassword.value);

  let indicador = document.querySelector("#fortaleza");

  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "fortaleza";
    indicador.style.fontSize = "0.8rem";
    indicador.style.marginTop = "4px";

    campoPassword.insertAdjacentElement("afterend", indicador);
  }

  indicador.textContent =
    puntos > 0 ? `Contraseña: ${nivel}` : "";

  indicador.style.color = color;
});