import Sqlite3 from 'sqlite3';
import Path from 'path';

const SQLS = {
  CREATE_SNAPSHOT: 'CREATE TABLE IF NOT EXISTS snapshot (id INTEGER PRIMARY KEY, user TEXT, date TEXT, version INTEGER, UNIQUE(user, date))',
  SELECT_SNAPSHOT: 'SELECT * FROM snapshot WHERE user = $user and date = $date',
  UPDATE_SNAPSHOT: 'UPDATE snapshot SET version = $version WHERE id=$id',
  INSERT_SNAPSHOT: 'INSERT INTO snapshot (user, date, version) VALUES($user, $date, $version)'
};

const wrapPromise = function (context, func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve({ row, lastID: this.lastID });
        }
      });

      func.apply(context, args);
    });
  }
};

class SQLDB {
  constructor() {
  };

  async init({ rootPath }) {
    this._db = new Sqlite3.Database(Path.join(rootPath, 'db.sqlite3'));
    this._run = wrapPromise(this._db, this._db.run);
    this._get = wrapPromise(this._db, this._db.get);

    return this._run(SQLS.CREATE_SNAPSHOT);
  };

  async getSnapshot(user, date) {
    return this._get(SQLS.SELECT_SNAPSHOT, { $user: user, $date: date }, (rs) => {
      if (rs.row) {
        resolve(Object.assign({}, rs.row));
      } else {
        resolve();
      }
    });
  };

  async insertSnapshot(user, date, version) {
    return this._run(SQLS.INSERT_SNAPSHOT, { $user: user, $date: date, $version: version }).then(rs => rs.lastID);
  };

  async updateSnapshot(id, version) {
    return this._run(SQLS.UPDATE_SNAPSHOT, { $id: rs.id, $version: version });
  };

};

var sqldb = new SQLDB();
export default sqldb; 