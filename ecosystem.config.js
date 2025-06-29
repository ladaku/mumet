module.exports = {
  apps: [
    {
      name: 'Ajeng febriana',
      script: 'node build/bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
}
