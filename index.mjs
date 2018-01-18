import appConf from './app.conf.json';
import data from './data';
import startService from './startService';

(async function () {
  await data.init(appConf.db);
  startService(appConf.server);
})();