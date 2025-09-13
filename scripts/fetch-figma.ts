/*
  Fetch Figma nodes/styles for a target frame and store JSON under figma-data.
  Usage:
    FIGMA_TOKEN=xxxx tsx scripts/fetch-figma.ts
*/

import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = path.resolve(process.cwd(), 'figma.config.json');

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Missing figma.config.json at project root`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const cfg = JSON.parse(raw) as { fileKey: string; nodeId: string };
  if (!cfg.fileKey || !cfg.nodeId) {
    throw new Error(`Invalid figma.config.json: require fileKey and nodeId`);
  }
  return cfg;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env ${name}. Set it before running the script.`);
  }
  return value;
}

async function fetchJson(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      'X-FIGMA-TOKEN': token,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

async function main() {
  const { fileKey, nodeId } = readConfig();
  const token = requireEnv('FIGMA_TOKEN');

  const outDir = path.resolve(process.cwd(), 'figma-data');
  fs.mkdirSync(outDir, { recursive: true });

  const nodesUrl = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(nodeId)}&geometry=paths&version=current`;
  const stylesUrl = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/styles`;

  console.log('Fetching nodes...');
  const nodes = await fetchJson(nodesUrl, token);
  console.log('Fetching styles...');
  const styles = await fetchJson(stylesUrl, token);

  const nodesPath = path.join(outDir, 'nodes.json');
  const stylesPath = path.join(outDir, 'styles.json');

  fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2), 'utf-8');
  fs.writeFileSync(stylesPath, JSON.stringify(styles, null, 2), 'utf-8');

  const countNodes = Object.keys(nodes?.nodes ?? {}).length;
  const countStyles = (styles?.meta?.styles ?? []).length ?? 0;

  console.log(`Saved: ${path.relative(process.cwd(), nodesPath)} (nodes: ${countNodes})`);
  console.log(`Saved: ${path.relative(process.cwd(), stylesPath)} (styles: ${countStyles})`);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
