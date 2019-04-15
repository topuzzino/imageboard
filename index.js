const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use(express.static("./public"));
const db = require("./db");

app.get("/home", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            console.log(rows); // prints an anonymous array of objects of images
            res.json(rows);
        })
        .catch(err => {
            console.log("error in getImages: ", err);
        });
});

app.listen(8080, () => {
    console.log("I am listening");
});
