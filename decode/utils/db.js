//  eslint-disable-next-line no-undef
BigInt.prototype.toJSON = function () {
    return this > Number.MIN_SAFE_INTEGER && this < Number.MAX_SAFE_INTEGER
        ? Number(this)
        : this.toString();
};

const fs = require("fs-extra");
const path = require("path");
const Database = require("better-sqlite3");
const { rightNum, DB_DIR, DIST_DIR_TEMP } = require("../../config");

function conn(DB_FILE) {
    const db = new Database(DB_FILE, { readonly: true });
    db.defaultSafeIntegers(true);

    db.jsonPromise = function (table) {
        return new Promise((resolve, reject) => {
            const res = db.prepare(`SELECT * FROM ${table}`).all();
            // cover BigInt in /index.js  slow is ok
            resolve(JSON.parse(JSON.stringify(res)));
        });
    };

    return db;
}

const mainDB = conn(path.join(DB_DIR, rightNum + ".db"));
const slowDB = conn(path.join(DB_DIR, "slowtable_" + rightNum + ".db"));

async function exportTable(db, f) {
    const out = path.join(DIST_DIR_TEMP, "table");
    fs.mkdirpSync(out);
    const json = await db();
    fs.writeFileSync(
        path.join(out, `./${f}.json`),
        JSON.stringify(json, null, 4)
    );
}

module.exports = {
    mainDB,
    slowDB,
    exportTable,
};
