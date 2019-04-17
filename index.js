const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use(express.static("./public"));
const db = require("./db");
const config = require("./config");
//------------
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//------------

app.get("/home", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            console.log("rows: ", rows); // prints an anonymous array of objects of images
            res.json(rows);
        })
        .catch(err => {
            console.log("error in getImages: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;

    // If nothing went wrong the file is already in the uploads directory
    console.log("req.file: ", req.file); // shows the uploaded file
    console.log("req.body: ", req.body); // { username: 'topuzzino', description: 'my cat', title: 'Kota' }

    if (req.file) {
        db.addImages(
            url,
            req.body.username,
            req.body.description,
            req.body.title
        )
            .then(data => {
                res.json(data.rows);
            })
            .catch(err => {
                console.log("error in addImages: ", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

// route for showing the modal window
app.get("/images/:id", (req, res) => {
    console.log(req.params.id);
    db.showImage(req.params.id)
        .then(results => {
            console.log("results.rows: ", results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error in showImage", err);
        });
});

// here will be the route for getting comments
app.get("/images/:comments", (req, res) => {
    // either db.showImage again or write another db query only for comments
});

app.listen(8080, () => {
    console.log("I am listening");
});
