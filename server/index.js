const fs = require('fs');
const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const IlcSdk = require('ilc-server-sdk').default;

const config = require('../nuxt.config.js');

const app = express();

app.use(require('cors')());

config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  const clientManifest = config.dev
    ? nuxt.server.resources.clientManifest
    : require('../.nuxt/dist/server/client.manifest.json');

  const ilcSdk = new IlcSdk({ publicPath: clientManifest.publicPath });

  const appAssets = {
    spaBundle: 'app.js',
    cssBundle: null
  };

  if (config.dev) {
    app.get('/_spa/dev/assets-discovery', (req, res) =>
      ilcSdk.assetsDiscoveryHandler(req, res, appAssets)
    );
  }

  app.get('*', (req, res, next) => {
    res.setHeader(
      'x-head-title',
      Buffer.from('<title>Nuxt Sample</title>', 'utf8').toString('base64')
    );
    res.setHeader(
      'x-head-meta',
      Buffer.from(
        '<meta name="description" content="Nuxt Sample"><meta name="keywords" content="NUXT,SAMPLE">',
        'utf8'
      ).toString('base64')
    );
    res.setHeader(
      'Link',
      ilcSdk.getLinkHeader(appAssets, clientManifest.publicPath)
    );
    next();
  });

  app.use(nuxt.render);

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
