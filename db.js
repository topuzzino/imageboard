var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/tabasco-imageboard"
);

///////////////////////////// SELECTS /////////////////////////////

exports.getImages = function getImages() {
    let q = `SELECT * FROM images ORDER BY id DESC LIMIT 8`;
    return db.query(q);
};

exports.showImage = function showImage(id) {
    let q = `SELECT * FROM images WHERE id = $1`;
    return db.query(q, [id]);
};

exports.getComments = function getComments(image_id) {
    let q = `SELECT * FROM comments WHERE image_id = $1`;
    return db.query(q, [image_id]);
};

// tell us the smallest id from the database, $1 will be the current smallest id on the page, in the Vue's data object
exports.getMoreImages = function getMoreImages(image_id) {
    let q = `SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1)
        AS lowest_id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 8`; // when the user clicks on the "more" button, number 8 is the amount of pics showing
    return db.query(q, [image_id]);
};

///////////////////////////// INSERTS /////////////////////////////

exports.addImages = function addImages(url, username, description, title) {
    let q = `INSERT INTO images (url, username, description, title) VALUES
     ($1, $2, $3, $4) RETURNING *`;
    let params = [url, username, description, title];
    return db.query(q, params);
};

exports.addComment = function addComment(image_id, username, comment) {
    let q = `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`;
    let params = [image_id, username, comment];
    return db.query(q, params);
};
