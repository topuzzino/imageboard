(function() {
    new Vue({
        el: "#main", // el property tells Vue what element your UI will appear in
        data: {
            images: []
        },
        mounted: function() {
            // rendered one time without being updated
            // ajax requests to get data
            console.log("mounted");
            var self = this;
            axios.get("/home").then(function({ data }) {
                console.log("resp: ", resp);
                console.log("data: ", data);
                console.log("resp.data: ", data);
                self.images = data;
            });
        }
    });
})();

/* spiced PG, pass right path
create db file,
make a route, database query SELECT * FROM images (reverse chronological order) ORDER BY id DESC, #
sends it back with json

db.getImages().then(
    ({rows}) => {
        res.json(rows)
    }
)

ajax.request

image to be these rows

image itseld and it's title

created: function() {
    console.log("created");
},
mounted: function() {
    // rendered one time without being updated
    // ajax requests to get data
    console.log("mounted");
    var self = this;
    axios.get("/").then(function() {
        console.log(resp);
        self.cities = resp.data;
    });
},
updated: function() {
    console.log("updated");
},

methods: {
    click: function() {
        this.cities.push({
            name: "funky",
            country: "USA"
        });
    }
}
*/
