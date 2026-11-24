import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();
console.log("\x1b[1m\x1b[37m==========================================================\x1b[0m");
console.log("\x1b[1m\x1b[36m   🦈  GYMSHARK MERN STACK APPLICATION STARTING...   \x1b[0m");
console.log("\x1b[1m\x1b[37m==========================================================\x1b[0m");
console.log("\x1b[32m✔ Backend:  Express API on http://localhost:5000\x1b[0m");
console.log("\x1b[34m✔ Frontend: React + Vite on http://localhost:5173\x1b[0m");
console.log("\x1b[33m✔ Database: MongoDB on mongodb://127.0.0.1:27017/gymshark\x1b[0m");
console.log("\x1b[90mPress Ctrl+C at any time to stop all servers.\x1b[0m\n");

// Spawn Backend
const backend = spawn("node", ["backend/index.js"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

// Spawn Frontend
const frontend = spawn("npm", ["--prefix", "frontend", "run", "dev"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

const cleanup = () => {
  console.log("\n\x1b[31mShutting down Gymshark servers...\x1b[0m");
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
