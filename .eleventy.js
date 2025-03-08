import { createInlineCss } from "google-fonts-inline";
import { promises as fs, promises } from "fs";
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
  // 📂 1️⃣ Archivos estáticos a copiar sin cambios
  eleventyConfig.addPassthroughCopy("code/css");
  eleventyConfig.addPassthroughCopy("code/app");
  eleventyConfig.addPassthroughCopy("code/ico");
  eleventyConfig.addPassthroughCopy("code/img");
  eleventyConfig.addPassthroughCopy("code/svg");

  // 🏷️ 2️⃣ Colección de etiquetas
  eleventyConfig.addCollection("tags", function (collectionApi) {
    let tagsObj = {};
    collectionApi.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags.forEach((tag) => {
        if (!tagsObj[tag]) tagsObj[tag] = [];
        tagsObj[tag].push(item);
      });
    });
    return tagsObj;
  });

  // 🎨 3️⃣ Shortcode para CSS de Google Fonts
  eleventyConfig.addShortcode("googleFontsInline", async function (url) {
    try {
      return await createInlineCss(url);
    } catch (error) {
      console.error("Error al generar el CSS en línea:", error);
      return "";
    }
  });

  // 🖼️ 4️⃣ Shortcode para iconos SVG individuales
  eleventyConfig.addNunjucksAsyncShortcode(
    "svgIcon",
    async (src, className = "", title = "", desc = "") => {
      try {
        const filePath = path.join(__dirname, "code/svg", src);
        let svgContent = await fs.readFile(filePath, "utf-8");

        // ID único basado en el nombre del archivo
        const idBase = src.replace(".svg", "").replace(/\W+/g, "-");

        // Agregar atributos SEO
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg class="${className}" role="img" aria-labelledby="${idBase}-title ${idBase}-desc" $1>`
        );

        // Insertar title y desc dentro del SVG
        return svgContent.replace(
          "</svg>",
          `
          <title id="${idBase}-title">${title}</title>
          <desc id="${idBase}-desc">${desc}</desc>
        </svg>`
        );
      } catch (error) {
        console.error(`Error leyendo el SVG ${src}:`, error);
        return "";
      }
    }
  );

  // 🖼️ 5️⃣ Shortcode para sprite SVG
  eleventyConfig.addNunjucksAsyncShortcode("svgSprite", async () => {
    try {
      const svgDir = path.join(__dirname, "code/svg");
      const files = await fs.readdir(svgDir);
      let spriteContent = `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">`;

      for (const file of files) {
        if (file.endsWith(".svg")) {
          let svg = await fs.readFile(path.join(svgDir, file), "utf-8");
          const id = file.replace(".svg", "").replace(/\W+/g, "-");

          // Extraer viewBox y limpiar etiquetas <svg>
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
          svg = svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

          spriteContent += `
            <symbol id="${id}" viewBox="${viewBox}" role="img" aria-labelledby="${id}-title ${id}-desc">
              <title id="${id}-title">Title for ${id}</title>
              <desc id="${id}-desc">Description for ${id}</desc>
              ${svg}
            </symbol>`;
        }
      }

      return spriteContent + `</svg>`;
    } catch (error) {
      console.error("Error generando sprite de SVG:", error);
      return "";
    }
  });
  eleventyConfig.on("eleventy.after", async () => {
    if (process.env.NODE_ENV === "production") {
      console.log("🔧 Minificando CSS y eliminando archivos innecesarios...");

      const cssFiles = [
        "docs/css/variables.css",
        "docs/css/reset.css",
        "docs/css/typography.css",
        "docs/css/utilities.css",
        "docs/css/layout.css",
        "docs/css/components.css",
        "docs/css/animations.css",
        "docs/css/responsive.css",
      ];

      let combinedCss = "";
      for (const file of cssFiles) {
        try {
          let content = await fs.readFile(file, "utf-8");
          combinedCss += content + "\n";
        } catch (error) {
          console.warn(`⚠ No se pudo leer ${file}:`, error);
        }
      }

      if (combinedCss) {
        await fs.writeFile(
          "docs/css/main.css",
          new CleanCSS({}).minify(combinedCss).styles
        );
        console.log("✅ CSS combinado y minificado en main.css");
      }

      // 📌 Eliminar los archivos CSS individuales en producción
      for (const file of cssFiles) {
        try {
          await fs.unlink(file);
          console.log(`🗑️ Eliminado: ${file}`);
        } catch (error) {
          console.warn(`⚠ No se pudo eliminar ${file}:`, error);
        }
      }

      // 📌 Minificar JS
      const jsFiles = ["docs/app/index.js"];
      for (const file of jsFiles) {
        try {
          let content = await fs.readFile(file, "utf-8");
          let minified = await minify(content, {
            module: true,
            compress: true,
            mangle: true,
          });
          await fs.writeFile(file, minified.code);
          console.log(`✅ Minificado: ${file}`);
        } catch (error) {
          console.error(`❌ Error minificando ${file}:`, error);
        }
      }
    }
  });
  // 📌 Minificación de HTML solo en producción
  eleventyConfig.addTransform("htmlmin", function (content) {
    if (
      process.env.NODE_ENV === "production" &&
      this.outputPath?.endsWith(".html")
    ) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  // 🔌 7️⃣ Plugins de Eleventy
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

  // 🔤 8️⃣ Filtro para crear slugs
  eleventyConfig.addFilter("slugify", function (str, maxLength = 50) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, maxLength)
      .replace(/-+$/, "");
  });

  // 📂 🔟 Configuración de directorios
  return {
    dir: {
      input: "code",
      output: "docs",
    },
  };
}
