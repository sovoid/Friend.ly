module.exports = {
  apps: [
    {
      name: "openfuel",
      script: "./bin/www",
      instances: 2,
      mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ],
  deploy: {
    production: {
      user: "node",
      host: "openfuel.org",
      ref: "origin/master",
      repo: "git@github.com:repo.git"
    }
  }
};
