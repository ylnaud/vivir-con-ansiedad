---
layout: /layouts/base.njk
title: Introducción a JavaScript y Node.js
description: Una guía introductoria al lenguaje de programación JavaScript y su uso en Node.js, cubriendo conceptos básicos y aplicaciones fundamentales.
date: 2024-10-17
tags: ["blog", "node.js"]
---

# {{title}}

## ¿Qué es JavaScript?

JavaScript es un lenguaje de programación interpretado, ligero y orientado a objetos. Es ampliamente utilizado para el desarrollo web, permitiendo la creación de contenido dinámico e interactivo en las páginas web.

## Historia de JavaScript

JavaScript fue desarrollado en 1995 por Brendan Eich mientras trabajaba en Netscape Communications. Originalmente fue llamado Mocha, luego LiveScript, y finalmente renombrado a JavaScript para aprovechar el éxito de Java.

## Características principales

1. **Interactividad**: Permite que las páginas web respondan a las acciones del usuario.
2. **Programación del lado del cliente**: La mayoría del código JavaScript se ejecuta en el navegador web, lo que reduce la carga en los servidores web.
3. **Flexibilidad**: Soporta programación funcional, imperativa y basada en eventos.
4. **Compatibilidad**: Funciona en todos los navegadores web modernos.

## Introducción a Node.js

### ¿Qué es Node.js?

Node.js es un entorno de ejecución para JavaScript que permite ejecutar código JavaScript en el lado del servidor. Esto abre un mundo de posibilidades, permitiendo a los desarrolladores utilizar JavaScript para todo, desde el desarrollo del frontend hasta la programación del backend.

### Características de Node.js

1. **Asincronía**: Node.js utiliza un modelo de E/S no bloqueante, lo que permite manejar múltiples conexiones simultáneamente sin bloquear el hilo de ejecución principal.
2. **NPM (Node Package Manager)**: Node.js cuenta con un ecosistema masivo de bibliotecas y módulos que los desarrolladores pueden utilizar para acelerar su desarrollo.
3. **Rendimiento**: Gracias al motor V8 de Google, Node.js ofrece un rendimiento elevado para aplicaciones escalables.
4. **Ecosistema unificado**: Permite usar JavaScript para todo el stack de una aplicación, tanto en el frontend como en el backend.

## Ejemplo básico con Node.js

Aquí tienes un ejemplo de un servidor HTTP básico creado con Node.js:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("¡Hola, Mundo desde Node.js!\n");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Servidor ejecutándose en http://127.0.0.1:3000/");
});
```
