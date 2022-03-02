# Sandulich

> Sandulich project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

#HOW TO DEPLOY Sandulich (NGINX + PM2 + NuxtJs)
## PREPARATION:
- nginx: https://www.nginx.com/
- pm2: https://pm2.keymetrics.io/
- nodejs: https://nodejs.org/en/
- nuxt-start: https://www.npmjs.com/package/nuxt-start
- create folder to deploy on server: sudo mkdir /data/www/sandulich/

## Build for Node App
1. Step 1: get latest code from bkv_build_old branch: https://gitlab.xtel.vn/bkav/san_du_lich/web_enduser
2. Step 2: Synchronize code build to server:
    - make sure you are at root project
    - install dependencies: npm i
    - build bundle code: npm run build
    - rsync code to server: rsync -aurvh --include='.nuxt/***' --include='.env' --include='package.json' --include='ecosystem.config.js' --include='assets/***' --include='static/***' --exclude='*' ./ username@host:/data/www/sandulich/
    
3. Step 3:
   - access to server deploy
   - make sure you are currently in /data/www/sandulich/ path.
   - pm2 start ecosystem.config.js (for the first starting)
   - or only need restart for the next time: pm2 restart all

4. Tail log
    - view logs: pm2 logs
    - monitor app: pm2 monit

## Build for Static App
1. Step 1: get latest code from bkv_build_old branch: https://gitlab.xtel.vn/bkav/san_du_lich/web_enduser
2. Step 2: Synchronize code build to server:
    - make sure you are at root project
    - install dependencies: npm i
    - build bundle code: npm run generate
3. Step 3: Copy dist/ folder to root dir of web server for deploy.

