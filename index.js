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

//------------ MAIN ROUTE ------------

app.get("/home", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error in getImages: ", err);
        });
});

//------------ IMAGE UPLOAD ROUTE ------------

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
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

//------------ IMAGE MODAL ROUTE ------------

app.get("/images/:imageId", (req, res) => {
    db.showImage(req.params.imageId)
        .then(results => {
            console.log("results.rows[0]: ", results.rows[0]);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error in showImage", err);
        });
});

//------------ COMMENTS in MODAL ROUTE ------------

app.post("/images/:imageId", (req, res) => {
    db.addComment(req.body.username, req.body.comment, req.params.imageId)
        .then(results => {
            console.log("results of addComments: ", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("err in addComment: ", err);
        });
});

/*
app.listen(8080, () => {
    console.log("I am listening");
});
*/

// Port for Heroku
app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening");
});