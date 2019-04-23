(function() {
    // register component "first-component" globally with method of the Vue constructor.
    Vue.component("image-modal", {
        // name of the component
        template: "#template",
        props: [
            "imageId",
            "id",
            "url",
            "username",
            "title",
            "description",
            "created_at"
        ],
        // data in vue.component must be a function that returns an object.
        data: function() {
            return {
                // value will come after ajax request
                //title: "",
                image: "",
                //url: "",
                //description: "",
                //username: "",
                //created_at: "",
                comments: [],
                commentform: {
                    username: "",
                    comment: ""
                }
            };
        },

        // a WATCHER is a function that runs whenever a PROP has changed
        /*
        watch: {
            imageId: function() {
                // this function runs whenever id in url changes
                console.log("imageId changed");

                var self = this;

                axios.get("/images/" + this.imageId).then(function(resp) {
                    console.log("resp: ", resp);
                    console.log("resp.data: ", resp.data);
                    self.images = resp.data;
                });
            }
        },
        */

        // TO DO: if a user outs somthing non-sensival into the browser address,
        // than close the modal and address reduces to just #.

        // the default value of imageId should be the id in the url IF THERE IS ONE!
        // if there isn't one  - just default to 0, like before
        //imageId: location.hash.slice(1) || 0, // for opening the modal on changing the id after # in the browser address
        // listener that listens to an event changing the id
        mounted: function() {
            console.log("mounted"); //
            var self = this;
            axios.get("/images/" + this.id).then(function(resp) {
                self.image = resp.data[0];
            });
        },
        methods: {
            closeModal: function() {
                this.$emit("close", this.imageId);
            },
            addComment: function(username, comment) {
                var self = this;
                var commentformData = new FormData();
                commentformData.append("username", username);
                commentformData.append("comment", comment);
                console.log("commentformData: ", commentformData);
                axios
                    .post("/images/" + this.id, {
                        image_id: this.id,
                        comment: this.commentform.comment,
                        username: this.commentform.username
                    })
                    .then(function(resp) {
                        console.log("resp in then of addComment: ", resp);
                        self.comments.unshift(resp.data[0]);
                    });
            }
        }
    });

    new Vue({
        el: "#main", // el property tells Vue what element your UI will appear in
        data: {
            images: [],
            imageId: "",
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

            // axios.get MAKES request to server
            axios
                .get("/home")
                // then RECEIVES the response from the server
                .then(function(resp) {
                    console.log("resp: ", resp); // shows response object
                    console.log("resp.data: ", resp.data); // shows array of 3 initial images
                    self.images = resp.data;
                });

            // event fires, when the hash address
            window.addEventListener("hashevent", function() {
                console.log("location: ", location); // object that represents url, property hash: hash: "#11"
                console.log("location.hash: ", location.hash);
                // we have to remove the hash symbol so we can receive the number
                location.hash.slice(1); // gives the number
                self.imageId = location.hash.slice(1); // self and not this, because this refers to the window object
            });
        },
        methods: {
            // every function that runs in response to an event is defined in "methods"
            handleFileChange: function(e) {
                console.log("handleFileChange running"); // funkt
                // e - event object with property target with a property file with a array-like object
                this.form.file = e.target.files[0];
                // this stores the file that was just selected in the "file" propery of the data object
            },
            uploadFile: function(e) {
                var self = this;
                console.log("uploadFile"); // funkt
                var formData = new FormData(); // formData is used to send files to server
                formData.append("file", this.form.file);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);
                formData.append("title", this.form.title);
                //console.log("formData: ", formData); // empty object

                axios.post("/upload", formData).then(function(res) {
                    console.log("then of POST /upload");
                    console.log("res.data: ", res.data);
                    self.images.unshift(res.data[0]);
                });
            },
            clickImage: function(id) {
                console.log("clicked");
                this.imageId = id;
                //this.$emit("change", this.imageId); // $emit used to fire an event
            },
            showImage: function(id) {
                this.imageId = id;
            },
            closeModal: function(evt) {
                this.imageId = evt;
            }
            /*
            showMoreImages: function() {
                var self = this;
                axios.get("/" + this.lastImage).then(function(resp) {
                    console.log("resp.data: ", resp.data);
                    for (var i = 0; i < resp.data.length; i++) {
                        this.images.push(resp.data[i]);
                    }
                    this.lastImage = this.images[this.images.length - 1].id;
                });
            }
            */
        }
    });
})();

/*
modal - will be a component. should show comments, if there are any.
we may choose more components

more component: render the comment, each comment could be a component,


currentImage is null, unless someone clicks on the image
component needs to know the id. ajax requerst to
component has a mounted function

table for comments

2 routes for the comments

button for modal for closing in the modal component itself, emit an event to ask the parent to close the child


axios.post('/comment', {
    comment: this.comment,
    username: this.username,
    id: this.id
})
 and then unshift the comment into the array of components

*/

/*


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
}

*/
