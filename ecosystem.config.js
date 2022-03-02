module.exports = {
  apps: [{
    name: "Sandulich",
    // exec_mode: 'fork', // enables clustering
    exec_mode: 'cluster', // enables clustering
    instances: 'max', // or an integer
    cwd: './',
    script: './node_modules/nuxt-start/bin/nuxt-start.js',
    node_args: "",
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    // error_file: "/data/log/web/Sandulich.err.log",
    // out_file: "/data/log/web/Sandulich.out.log",
    env: {
      HOST: "0.0.0.0",
      PORT: 6001,
      SESSION_EXPIRES: process.env.SESSION_EXPIRES
    },
  }, ],

};
