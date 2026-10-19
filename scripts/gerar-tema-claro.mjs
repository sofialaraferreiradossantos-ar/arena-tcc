/*
 * Gera o tema claro a partir dos estilos do modo escuro.
 *
 * O modo escuro é a fonte da verdade: cada regra com cor nos arquivos de
 * estilo ganha uma versão "tema claro" com exatamente os mesmos seletores,
 * estados (:hover, :focus, ativos), media queries e transparências (alpha),
 * trocando apenas as cores neutras pela paleta clara. Cores de destaque
 * (laranja, verde, vermelho...) são mantidas como estão.
 *
 * Uso:  node scripts/gerar-tema-claro.mjs
 * Rode de novo sempre que alterar cores do modo escuro.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STYLES_DIR = path.join(ROOT, "src", "styles");
const INDEX_CSS = path.join(ROOT, "src", "index.css");

const START = "/* ==== TEMA CLARO (gerado por scripts/gerar-tema-claro.mjs — não edite à mão) ==== */";
const END = "/* ==== FIM DO TEMA CLARO GERADO ==== */";

// Tom azulado da paleta clara (#d5dce5, #e3e8ee, #f2f5f8, #f7f9fb).
const LIGHT_HUE = 212;
const LIGHT_SAT = 0.25;

/* ---------------------------------------------------------------- cores */

const NAMED = {
  white: [255, 255, 255, 1],
  black: [0, 0, 0, 1],
  orange: [255, 165, 0, 1],
};

const COLOR_RE =
  /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)|\b(?:white|black|orange)\b/g;

function parseColor(str) {
  const s = str.toLowerCase();
  if (NAMED[s]) return [...NAMED[s]];
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const parts = s
    .replace(/rgba?\(|\)/g, "")
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((p, idx) => {
      if (!p.endsWith("%")) return parseFloat(p);
      return idx === 3 ? parseFloat(p) / 100 : (parseFloat(p) / 100) * 255;
    });
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb([h, s, l]) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

function format([r, g, b], alpha) {
  if (alpha >= 1) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  return `rgba(${r}, ${g}, ${b}, ${+alpha.toFixed(3)})`;
}

const isAccent = ([h, s, l]) => s >= 0.45 && l >= 0.25 && l <= 0.85;
const isNeutral = ([, s]) => s < 0.12;

// Contraste mínimo de textos de destaque sobre o branco (WCAG ~ 4.5:1, com
// folga para os textos que ficam direto sobre a foto de fundo).
const MIN_TEXT_CONTRAST = 5;

function contrastOnWhite([r, g, b]) {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  return 1.05 / (lum + 0.05);
}

// Escurece o tom só o necessário para o texto ficar legível no fundo claro.
function readableLightness(h, s, l) {
  let nl = l;
  while (nl > 0.05 && contrastOnWhite(hslToRgb([h, s, nl])) < MIN_TEXT_CONTRAST) nl -= 0.01;
  return nl;
}

/**
 * Converte uma cor do modo escuro para o modo claro.
 * kind: "text" | "background" | "border" | "shadow"
 */
function mapColor(str, kind) {
  const rgba = parseColor(str);
  const alpha = rgba[3];
  const hsl = rgbToHsl(rgba);
  const [h, s, l] = hsl;

  if (isAccent(hsl)) {
    // Textos de destaque (laranja, verde...) sumiriam sobre o branco: usam o
    // mesmo tom, escurecido até ficar legível. Fundos e bordas ficam iguais.
    if (kind === "text") {
      const nl = readableLightness(h, s, l);
      if (nl < l) return format(hslToRgb([h, s, nl]), alpha);
    }
    return str;
  }

  if (kind === "shadow") {
    // Sombras continuam escuras, só mais suaves sobre o fundo claro.
    if (l <= 0.5) return format(rgba.slice(0, 3), +(alpha * 0.4).toFixed(3));
    return format(hslToRgb([h, s, 1 - l]), alpha);
  }

  if (kind === "text") {
    // Texto escuro no modo escuro só aparece sobre botões claros/laranja:
    // continua igual. Texto claro vira texto escuro.
    if (l < 0.5) return str;
    return format(hslToRgb([h, s, 1 - l]), alpha);
  }

  // Fundos claros e opacos (selos, botões brancos) continuam iguais.
  if (kind === "background" && l > 0.5 && alpha >= 0.5) return str;

  let nl;
  if (l > 0.5) nl = 1 - l; // véus brancos translúcidos viram véus escuros
  else if (kind === "background") nl = 1 - l * 0.4; // superfícies escuras → quase brancas
  else nl = 1 - l * 0.7; // bordas escuras → bordas claras visíveis

  const neutral = isNeutral(hsl);
  const out = hslToRgb([neutral ? LIGHT_HUE : h, neutral ? (l > 0.5 ? 0 : LIGHT_SAT) : s, nl]);
  return format(out, alpha);
}

function kindOf(prop) {
  if (prop.startsWith("--")) return /text/.test(prop) ? "text" : "background";
  if (/^(color|-webkit-text-fill-color|caret-color|text-decoration-color|fill)$/.test(prop)) return "text";
  if (/shadow|^filter$/.test(prop)) return "shadow";
  if (/^background/.test(prop)) return "background";
  return "border";
}

function mapValue(prop, value, keepText) {
  if (/url\(/.test(value) && !/gradient/.test(value)) return value;
  const kind = kindOf(prop);
  if (kind === "text" && keepText) return value;
  return value.replace(COLOR_RE, (c) => mapColor(c, kind));
}

/* -------------------------------------------------------------- parser */

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

// Divide o CSS em nós: { type: "rule", selector, decls } e { type: "at", prelude, children }
function parse(css) {
  let i = 0;
  function parseBlock() {
    const nodes = [];
    let buf = "";
    while (i < css.length) {
      const c = css[i];
      if (c === "{") {
        i++;
        const head = buf.trim();
        buf = "";
        if (/^@(media|supports|container|layer)\b/.test(head)) {
          nodes.push({ type: "at", prelude: head, children: parseBlock() });
        } else if (head.startsWith("@")) {
          skipBlock();
        } else {
          nodes.push({ type: "rule", selector: head, decls: readDecls() });
        }
      } else if (c === "}") {
        i++;
        return nodes;
      } else if (c === ";" && buf.trim().startsWith("@")) {
        i++;
        buf = "";
      } else {
        buf += c;
        i++;
      }
    }
    return nodes;
  }
  function skipBlock() {
    let depth = 1;
    while (i < css.length && depth) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
  }
  function readDecls() {
    let body = "";
    let depth = 0;
    while (i < css.length) {
      const c = css[i++];
      if (c === "(") depth++;
      if (c === ")") depth--;
      if (c === "}" && depth <= 0) break;
      body += c;
    }
    const decls = [];
    let cur = "";
    depth = 0;
    for (const c of body) {
      if (c === "(") depth++;
      if (c === ")") depth--;
      if (c === ";" && depth === 0) {
        decls.push(cur);
        cur = "";
      } else cur += c;
    }
    decls.push(cur);
    return decls
      .map((d) => d.trim())
      .filter((d) => d.includes(":"))
      .map((d) => {
        const idx = d.indexOf(":");
        let value = d.slice(idx + 1).trim();
        const important = /!important\s*$/i.test(value);
        value = value.replace(/\s*!important\s*$/i, "");
        return { prop: d.slice(0, idx).trim().toLowerCase(), value, important };
      });
  }
  return parseBlock();
}

/* ------------------------------------------------------------ seletores */

function splitSelectors(sel) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const c of sel) {
    if (c === "(" || c === "[") depth++;
    if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}

function prefixSelector(sel, isModule) {
  const theme = 'html[data-theme="light"]';
  const g = (s) => (isModule ? `:global(${s})` : s);
  if (isModule) {
    if (/^:global\(html\)/.test(sel)) return sel.replace(/^:global\(html\)/, g(theme));
    if (/^:root\b/.test(sel)) return sel.replace(/^:root/, g(theme));
    return `${g(theme)} ${sel}`;
  }
  if (/^html\b/.test(sel)) return sel.replace(/^html/, theme);
  if (/^:root\b/.test(sel)) return sel.replace(/^:root/, theme);
  return `${theme} ${sel}`;
}

/* -------------------------------------------------------------- geração */

const COLOR_PROPS =
  /^(--|color$|background|border|outline|box-shadow$|text-shadow$|filter$|fill$|stroke$|caret-color$|column-rule|text-decoration-color$|-webkit-text-fill-color$|scrollbar-color$)/;

const CASCADE_PROPS =
  /^(color|background|background-color|background-image|border|border-(top|right|bottom|left|block|inline)|border-(top-|right-|bottom-|left-)?color|outline|outline-color|box-shadow|text-shadow|fill|stroke|-webkit-text-fill-color)$/;

function hasAccentBackground(decls) {
  return decls.some((d) => {
    if (!/^background/.test(d.prop)) return false;
    const colors = d.value.match(COLOR_RE) || [];
    // Só fundos de destaque sólidos (botões laranja); véus coloridos
    // translúcidos deixam o fundo da superfície aparecer.
    return colors.length > 0 && colors.every((c) => {
      const rgba = parseColor(c);
      return rgba[3] >= 0.5 && isAccent(rgbToHsl(rgba));
    });
  });
}

function generate(nodes, isModule, indent = "") {
  let out = "";
  for (const node of nodes) {
    if (node.type === "at") {
      const inner = generate(node.children, isModule, indent + "  ");
      if (inner.trim()) out += `${indent}${node.prelude} {\n${inner}${indent}}\n\n`;
      continue;
    }
    // Regras que já tratam o tema explicitamente não são espelhadas.
    if (/light-mode|data-theme/.test(node.selector)) continue;
    // As variáveis do tema claro são definidas à mão em index.css.
    if (!isModule && node.selector === ":root") continue;
    const keepText = hasAccentBackground(node.decls);
    const decls = [];
    for (const d of node.decls) {
      if (!COLOR_PROPS.test(d.prop) || d.prop === "-webkit-tap-highlight-color") continue;
      const value = mapValue(d.prop, d.value, keepText);
      const changed = value !== d.value;
      // Declarações de cor que não mudam também são repetidas: como o prefixo
      // do tema aumenta a especificidade, isso preserva a mesma ordem de
      // prioridade entre as regras que existe no modo escuro (ex.: botão
      // primário declarado depois do botão comum).
      if (changed || CASCADE_PROPS.test(d.prop)) {
        decls.push(`${indent}  ${d.prop}: ${value}${d.important ? " !important" : ""};`);
      }
    }
    if (!decls.length) continue;
    const selectors = splitSelectors(node.selector).map((s) => prefixSelector(s, isModule));
    out += `${indent}${selectors.join(`,\n${indent}`)} {\n${decls.join("\n")}\n${indent}}\n\n`;
  }
  return out;
}

function processFile(file, isModule) {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  let css = raw.replace(/\r\n/g, "\n");
  const start = css.indexOf(START);
  if (start !== -1) {
    const end = css.indexOf(END, start);
    css = css.slice(0, start).trimEnd() + "\n" + (end !== -1 ? css.slice(end + END.length) : "");
  }
  const source = css.trimEnd();
  const generated = generate(parse(stripComments(source)), isModule).trimEnd();
  let result = source + "\n";
  if (generated) result += `\n${START}\n\n${generated}\n\n${END}\n`;
  if (result.replace(/\n/g, eol) !== raw) {
    fs.writeFileSync(file, result.replace(/\n/g, eol));
    console.log("atualizado:", path.relative(ROOT, file));
  }
}

for (const name of fs.readdirSync(STYLES_DIR).sort()) {
  if (name.endsWith(".module.css")) processFile(path.join(STYLES_DIR, name), true);
}
processFile(INDEX_CSS, false);
