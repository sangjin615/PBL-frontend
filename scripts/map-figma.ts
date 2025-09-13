/*
  Map Figma nodes to design tokens.
  - Reads: figma-data/nodes.json, figma-data/styles.json
  - Writes: src/assets/generated-tokens.css, figma-data/summary.json
  Usage:
    tsx scripts/map-figma.ts
*/

import fs from 'node:fs';
import path from 'node:path';

type FigmaPaint = { type: string; color?: { r: number; g: number; b: number }; opacity?: number };

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  fills?: Array<FigmaPaint> | { error: boolean };
  strokes?: Array<FigmaPaint> | { error: boolean };
  children?: FigmaNode[];
};

type NodesResponse = {
  nodes: Record<string, { document: FigmaNode }>;
};

const ROOT = process.cwd();
const nodesPath = path.join(ROOT, 'figma-data', 'nodes.json');
const stylesPath = path.join(ROOT, 'figma-data', 'styles.json');
const outCssPath = path.join(ROOT, 'src', 'assets', 'generated-tokens.css');
const outSummaryPath = path.join(ROOT, 'figma-data', 'summary.json');

function readJson<T>(file: string): T {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing file: ${path.relative(ROOT, file)}. Run npm run figma:pull first.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
}

function rgbToCss(rgb: { r: number; g: number; b: number }, opacity?: number) {
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  const a = opacity ?? 1;
  return { rgb: `${r} ${g} ${b}`, rgba: `rgba(${r}, ${g}, ${b}, ${a})` };
}

function collectColors(node: FigmaNode, acc: Map<string, { count: number; sources: string[] }>) {
  const consider = (paints?: Array<FigmaPaint> | { error: boolean }) => {
    if (!paints || Array.isArray(paints) === false) return;
    for (const p of paints) {
      if (p && p.type === 'SOLID' && p.color) {
        const { rgb } = rgbToCss(p.color, p.opacity);
        const key = rgb;
        const prev = acc.get(key) ?? { count: 0, sources: [] };
        prev.count += 1;
        if (prev.sources.length < 5) prev.sources.push(node.name);
        acc.set(key, prev);
      }
    }
  };
  consider(node.fills);
  consider(node.strokes);
  if (node.children) node.children.forEach((c) => collectColors(c, acc));
}

function flattenLayers(node: FigmaNode, depth = 0, list: Array<{ id: string; name: string; type: string; depth: number }>) {
  list.push({ id: node.id, name: node.name, type: node.type, depth });
  if (node.children) node.children.forEach((c) => flattenLayers(c, depth + 1, list));
}

function main() {
  const nodes = readJson<NodesResponse>(nodesPath);
  const targetKey = Object.keys(nodes.nodes)[0];
  if (!targetKey) throw new Error('nodes.json has no nodes');
  const root = nodes.nodes[targetKey].document;

  const colorMap = new Map<string, { count: number; sources: string[] }>();
  collectColors(root, colorMap);

  // Sort by frequency desc
  const colors = [...colorMap.entries()].sort((a, b) => b[1].count - a[1].count);

  // Generate CSS variables
  const lines: string[] = [];
  lines.push(':root {');
  colors.slice(0, 24).forEach(([rgb], idx) => {
    const varName = `--figma-color-${idx + 1}`;
    lines.push(`  ${varName}: ${rgb};`);
  });
  lines.push('}');
  lines.push('');
  lines.push('@layer utilities {');
  colors.slice(0, 24).forEach(([,], idx) => {
    const varName = `--figma-color-${idx + 1}`;
    const className = `.bg-figma-${idx + 1}`;
    lines.push(`  ${className} { background-color: rgb(var(${varName})); }`);
  });
  lines.push('}');

  fs.mkdirSync(path.dirname(outCssPath), { recursive: true });
  fs.writeFileSync(outCssPath, lines.join('\n'), 'utf-8');

  // Layer summary
  const flat: Array<{ id: string; name: string; type: string; depth: number }> = [];
  flattenLayers(root, 0, flat);
  const summary = {
    totalLayers: flat.length,
    topLayers: flat.filter((l) => l.depth === 1).map((l) => ({ id: l.id, name: l.name, type: l.type })),
    sample: flat.slice(0, 50),
  };
  fs.mkdirSync(path.dirname(outSummaryPath), { recursive: true });
  fs.writeFileSync(outSummaryPath, JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`Wrote ${path.relative(ROOT, outCssPath)} and ${path.relative(ROOT, outSummaryPath)}`);
}

main();
