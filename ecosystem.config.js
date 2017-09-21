module.exports = {
  apps: [
    {
      name: 'startd',
      script: './scripts/startd.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
