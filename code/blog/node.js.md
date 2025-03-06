---
layout: layouts/base.njk
title: Introducción a Nunjucks (njk)
description: Una guía básica sobre Nunjucks, el motor de plantillas usado con Eleventy para generar contenido dinámico y reutilizable.
tags: ["blog", "nunjucks"]
date: 2024-10-15
---

# {{title}}

## ¿Qué es Nunjucks?

Nunjucks es un motor de plantillas flexible y poderoso desarrollado por Mozilla. Es similar a otros motores de plantillas como Jinja2 (Python) y Twig (PHP), y es compatible con el navegador y Node.js. Se utiliza ampliamente en el desarrollo web para generar contenido HTML dinámico, reutilizable y mantenible.

## Características principales

1. **Sintaxis sencilla y expresiva**: Nunjucks utiliza una sintaxis que es fácil de leer y escribir, permitiendo una mayor productividad.
2. **Herencia de plantillas**: Puedes crear una estructura base y extenderla en múltiples plantillas, reduciendo la duplicación de código.
3. **Filtros y macros**: Nunjucks ofrece filtros y macros que permiten manipular datos y reutilizar fragmentos de código de manera eficiente.
4. **Compatibilidad**: Funciona tanto en el lado del cliente como en el lado del servidor, lo que lo hace muy versátil.

## Configuración básica en Eleventy

Para utilizar Nunjucks con Eleventy, necesitas configurar tu entorno. Eleventy lo soporta de manera nativa, por lo que solo tienes que asegurarte de que los archivos `.njk` estén configurados correctamente.

### Ejemplo de configuración:

```javascript
// .eleventy.js
module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
```
