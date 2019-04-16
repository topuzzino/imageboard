var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/tabasco-imageboard"
);

exports.getImages = function getImages() {
    let q = `SELECT * FROM images ORDER BY id DESC`;
    return db.query(q, []);
};

exports.addImages = function addImages(url, username, description, title) {
    let q = `INSERT INTO images (url, username, description, title) VALUES
    WHERE $1, $2, $3, $4 RETURNING id`;
    let params = [url, username, description, title];
    return db.query[(q, params)];
};
