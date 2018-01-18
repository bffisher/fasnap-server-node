import Koa from 'koa';
import Router from 'koa-router';
import basicAuth from 'koa-basic-auth';

export default function (conf) {
  console.log('Start Service...');

  const app = new Koa();
  const router = new Router();

  router.get('/snapshot-data-log/:version', (ctx, next) => {
    ctx.response.body = { version: 1 };
  });

  router.get('/snapshot-list/:date/:version', function (ctx, next) {
    ctx.response.body = ctx.params;
  });

  router.get('/snapshot/:date/:version', function (ctx, next) {
    ctx.response.body = ctx.params;
  });

  router.put('/snapshot/:date/:version', function (ctx, next) {
    ctx.response.body = ctx.params;
  });

  router.delete('/snapshot/:date/:version', function (ctx, next) {
    ctx.response.body = ctx.params;
  });

  // custom 401 handling 
  app.use(async function (ctx, next) {
    try {
      await next();
    } catch (err) {
      if (401 == err.status) {
        ctx.response.status = 401;
        ctx.response.set('WWW-Authenticate', 'Basic realm="[fasnap server] Login Required"');
      } else {
        throw err;
      }
    }
  });

  app.use(basicAuth({ name: 'admin', pass: 'admin' }));

  app.use(router.routes());

  app.listen(conf.port);

  console.log(`"fasnap-server" listening at port ${conf.port}`);
};