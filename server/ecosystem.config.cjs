module.exports = {
  apps: [
    {
      name: "gymshark-store",
      cwd: "/var/www/gymshark",
      script: "server/index.js",
      node_args: "--env-file=/var/www/gymshark/.env",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};