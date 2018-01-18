import sqldb from './db/sqldb';
import kvdb from './db/kvdb';

class Data {
  constructor() {
  };

  async init(conf) {
    console.log('Init Database...');
    await sqldb.init(conf);
    await kvdb.init(conf);

    console.log('Init Database successfully.');

    this._curVers = await kvdb.getVersion();

    console.log('Current Data Version:', this._curVers);
  };

  getCurVersion() {
    return this._curVers;
  };

  async saveSnapshot(user, date, version, content) {
    let snapshot = await sqldb.getSnapshot(user, date);

    if (snapshot && snapshot.version > version) {
      return {
        err: { code: '001', version: snapshot.version }
      };
    }

    let newVersion = await this._increaseVersion();
    let id = null;
    if (snapshot) {
      id = snapshot.id;
      await sqldb.updateSnapshot(id, newVersion);
    } else {
      id = await sqldb.insertSnapshot(user, date, newVersion);
    }

    await kvdb.putSnapshot(id, newVersion, content);

    return { id, version: newVersion };
  };

  async _increaseVersion() {
    var version = ++this._curVers;
    await kvdb.putVersion(KEY_VERSION, version);
    return version;
  };
};

var data = new Data();
export default data; 
