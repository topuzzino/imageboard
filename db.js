var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/tabasco-imageboard"
);

exports.getImages = function getImages() {
    let q = `SELECT * FROM images`; // later I will add ORDER BY id DESC
    return db.query(q, []);
};
