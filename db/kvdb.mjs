import levelup from 'levelup';
import leveldown from 'leveldown';
// import encode from 'encoding-down';
import Path from 'path';

const KEY_PREFIXS = {
  'SYSTEM': '0',
  'SNAPSHOT': '1'
};

const KEY_VERSION = KEY_PREFIXS.SYSTEM + '_data_version';

const generateSnapshotKey = function (snapshotId, version) {
  return `${KEY_PREFIXS.SNAPSHOT}_${snapshotId.toString(32)}_${version.toString(32)}`;
};

class KVDB {
  constructor() {
  };

  async init({ rootPath }) {
    // this._kvdb = levelup(encode(leveldown('./mydb'), { valueEncoding: 'json' }));
    this._db = levelup(leveldown(Path.join(rootPath, 'kvdb')));
    return Promise.resolve();
  };

  async getVersion() {
    return this._db.get(KEY_VERSION)
      .then((value) => {
        return value;
      })
      .catch((err) => {
        if (err.notFound) {
          // handle a 'NotFoundError' here
          return 0;
        } else {
          throw err;
        }
      });
  };

  async putVersion(version) {
    return this._db.put(KEY_VERSION, version);
  };

  async putSnapshot(id, version, content) {
    var key = generateSnapshotKey(id, version);
    return this._db.put(key, content);
  }
};

var kvdb = new KVDB();
export default kvdb; 