import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeExecutable = process.execPath;
const viteCli = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const backendDir = path.join(rootDir, "backend");
const backendEntry = path.join(rootDir, "backend", "index.js");

const children = [
  spawn(nodeExecutable, [backendEntry], {
    cwd: backendDir,
    stdio: "inherit",
    env: process.env,
  }),
  spawn(nodeExecutable, [viteCli, ...process.argv.slice(2)], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
  }),
];

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child.killed || !child.pid) continue;

    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      child.kill();
    }
  }

  setTimeout(() => process.exit(exitCode), 100);
}

for (const child of children) {
  child.on("error", (error) => {
    console.error("Não foi possível iniciar um dos servidores:", error.message);
    shutdown(1);
  });

  child.on("exit", (code) => {
    if (!shuttingDown && code !== 0) shutdown(code || 1);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Frontend: http://localhost:5173");
console.log("Backend:  http://localhost:3333");
