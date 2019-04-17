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
     ($1, $2, $3, $4) RETURNING *`;
    let params = [url, username, description, title];
    return db.query(q, params);
};

exports.showImage = function showImage(id) {
    let q = `SELECT images.id, images.title, images.description, images.username,
    comments.comment, comment.username
    FROM images JOIN comments
    ON images.id = comments.image_id
    WHERE images.id = $1`;
    return db.query(q, [id]); // put JOIN just for now
};

exports.addComment = function addComment(image_id, username, comment) {
    let q = `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`;
    let params = [image_id, username, comment];
    return db.query(q, params);
};
