module.exports = {
  apps: [
    {
      name: 'ajeng febriana',
      script: 'node build/bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
}
