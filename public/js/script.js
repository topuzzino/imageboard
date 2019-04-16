(function() {
    new Vue({
        el: "#main", // el property tells Vue what element your UI will appear in
        data: {
            images: [],
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            // rendered one time without being updated
            // ajax requests to get data
            console.log("mounted"); // funkt

            var self = this; // this refers to vue instance, but in the function(resp){} it would refer to the window object

            axios.get("/home").then(function(resp) {
                console.log("resp: ", resp); // shows response object
                console.log("resp.data: ", resp.data); // shows array of 3 initial images
                self.images = resp.data;
            });
        },
        methods: {
            // every function that runs in response to an event is defined in "methods"
            handleFileChange: function(e) {
                console.log("handleFileChange running"); // funkt
                //console.log("e: ", e); // e - event object, with property target with a property file with a array-like object
                //console.log("e.target.files[0]: ", e.target.files[0]);
                this.form.file = e.target.files[0]; // this stores the file that was just selected in the "file" propery of the data object
            },
            uploadFile: function(e) {
                console.log("uploadFile"); // funkt
                var formData = new FormData(); // formData is used to send files to server
                formData.append("file", this.form.file);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);
                formData.append("title", this.form.title);
                //console.log("formData: ", formData); // empty object

                axios.post("/upload", formData).then(function() {
                    console.log("then of POST /upload");
                    console.log("res.data: ", res.data);
                    this.images.unshift(res.data);
                });
            }
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
