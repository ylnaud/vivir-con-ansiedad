import { createInlineCss } from "google-fonts-inline";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import htmlmin from "html-minifier-terser";
import CleanCSS from "clean-css";
import { minify } from "terser";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

// Obtener la ruta del directorio actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  // Archivos a copiar directamente
  eleventyConfig.addPassthroughCopy("code/css");

  eleventyConfig.addPassthroughCopy("code/app");
  eleventyConfig.addPassthroughCopy("code/img");
  eleventyConfig.addPassthroughCopy("code/svg");

  // Crear una colección de etiquetas
  eleventyConfig.addCollection("tags", function (collectionApi) {
    let tagsObj = {};
    collectionApi.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags.forEach((tag) => {
        if (!tagsObj[tag]) {
          tagsObj[tag] = [];
        }
        tagsObj[tag].push(item);
      });
    });
    return tagsObj;
  });

  // Crear un shortcode para generar CSS en línea de Google Fonts
  eleventyConfig.addShortcode("googleFontsInline", async function (url) {
    try {
      const css = await createInlineCss(url);
      return css;
    } catch (error) {
      console.error("Error al generar el CSS en línea:", error);
      return "";
    }
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "svgIcon",
    async (src, className = "", title = "", desc = "") => {
      try {
        const filePath = path.join(__dirname, "code/svg", src);
        let svgContent = await fs.readFile(filePath, "utf-8");

        // Generar ID único basado en el nombre del archivo
        const idBase = src.replace(".svg", "").replace(/\W+/g, "-");

        // Agregar atributos SEO
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg class="${className}" role="img" aria-labelledby="${idBase}-title ${idBase}-desc" $1>`
        );

        // Insertar title y desc dentro del SVG
        const seoMetadata = `
        <title id="${idBase}-title">${title}</title>
        <desc id="${idBase}-desc">${desc}</desc>
      `;
        svgContent = svgContent.replace("</svg>", `${seoMetadata}</svg>`);

        return svgContent;
      } catch (error) {
        console.error(`Error leyendo el SVG ${src}:`, error);
        return "";
      }
    }
  );

  eleventyConfig.addNunjucksAsyncShortcode("svgSprite", async () => {
    try {
      const svgDir = path.join(__dirname, "code/svg");
      const files = await fs.readdir(svgDir);
      let spriteContent = `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">`;

      for (const file of files) {
        if (file.endsWith(".svg")) {
          let svg = await fs.readFile(path.join(svgDir, file), "utf-8");
          const id = file.replace(".svg", "").replace(/\W+/g, "-");

          // Extraer viewBox y contenido sin <svg>
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
          svg = svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

          // Agregar title y desc para SEO
          const title = `Title for ${id}`; // Personaliza esto según tus necesidades
          const desc = `Description for ${id}`; // Personaliza esto según tus necesidades

          spriteContent += `
          <symbol id="${id}" viewBox="${viewBox}" role="img" aria-labelledby="${id}-title ${id}-desc">
            <title id="${id}-title">${title}</title>
            <desc id="${id}-desc">${desc}</desc>
            ${svg}
          </symbol>`;
        }
      }

      spriteContent += `</svg>`;
      return spriteContent;
    } catch (error) {
      console.error("Error generando sprite de SVG:", error);
      return "";
    }
  });

  // HTML minify
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });
      return minified;
    }
    return content;
  });

  // Plugins

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "avif"],
    widths: ["auto"],
    htmlOptions: {
      imgAttributes: {
        decoding: "async",
        loading: "lazy",
        width: "auto",
        height: "auto",
      },
      pictureAttributes: { class: "picture miguel" },
    },
  });

  eleventyConfig.addFilter("slugify", function (str, maxLength = 50) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, maxLength) // Limita la longitud
      .replace(/-+$/, ""); // Elimina guiones al final después de truncar
  });

  // Filtros para minificar CSS y JS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("jsmin", async function (code) {
    try {
      const minified = await minify(code);
      return minified.code;
    } catch (err) {
      console.error("Terser error: ", err);
      return code;
    }
  });

  return {
    dir: {
      input: "code",
      output: "docs",
    },
  };
}