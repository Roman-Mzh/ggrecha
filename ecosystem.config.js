module.exports = {
  apps : [{
    name: 'ggrecha',
    script: 'dist/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'da',
      host : '178.62.200.15',
      ref  : 'origin/master',
      repo : 'git@github.com:Roman-Mzh/ggrecha.git',
      path : '/home/da/apps/ggrecha',
      "post-deploy-local": "echo 123",
      "post-deploy" : "cp ~/.env .env && export NODE_ENV=production && pm2 startOrRestart ecosystem.config.js --env production",
      env  : {
        NODE_ENV  : 'production'
      }
    }
  }
};
