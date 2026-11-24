module.exports = {
  apps: [
    {
      name: "gymshark-backend",
      script: "index.js",
      cwd: "/var/www/app/backend",
      interpreter: "node",
      node_args: "--env-file=/var/www/app/backend/.env",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};