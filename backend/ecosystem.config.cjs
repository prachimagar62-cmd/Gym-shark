// PM2 Process Manager Configuration for Gymshark Backend
// Note: Must use .cjs extension because backend/package.json has "type": "module"

module.exports = {
  apps: [
    {
      name: "gymshark-backend",
      script: "index.js",
      cwd: "/var/www/app/backend",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      out_file: "/var/log/pm2/gymshark-out.log",
      error_file: "/var/log/pm2/gymshark-err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
