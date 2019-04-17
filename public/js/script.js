(function() {
    // register component "first-component" globally with method of the Vue constructor.
    Vue.component("image-modal", {
        // name of the component
        template: "#template",
        props: ["img", "title", "url", "description", "username"],
        // data in vue.component must be a function that returns an object.
        data: function() {
            return {
                name: "Jenka",
                title: "", // value will come after ajax request
                url: "",
                description: "",
                username: "",
                images: ""
            };
        },
        mounted: function() {
            console.log("mounted"); //
            var self = this;
            axios.get("/images/:id").then(function(resp) {
                console.log("resp: ", resp);
                console.log("resp.data: ", resp.data);
                self.images = resp.data; // don't know, if it should be "self.images" or something else
            });
        },
        methods: {
            click: function() {
                this.currentImage = img.id;
                // this.currentImage??? or what?
                this.$emit("change", this.currentImage); // $emit used to fire an event
            },
            closeModal: function() {
                // this.currentImage??? or what?
                this.$emit("close", this.currentImage); // am not sure, if the method closeModal should be here or elsewhere, and
            }
        }
    });

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
            }),
                // should it be here or where?
                axios.post("/comment", {
                    comment: this.comment,
                    username: this.username,
                    id: this.id
                });
            //and then unshift the comment into the array of components
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
                console.log("uploadFile"); // funkt
                var formData = new FormData(); // formData is used to send files to server
                formData.append("file", this.form.file);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);
                formData.append("title", this.form.title);
                //console.log("formData: ", formData); // empty object

                var self = this;

                axios.post("/upload", formData).then(function(res) {
                    console.log("then of POST /upload");
                    console.log("res.data: ", res.data);
                    self.images.unshift(res.data[0]);
                });
            }
        }
    });
})();

/*
modal - will be a component. should show comments, if there are any.
we may choose more components

CSS - position: fix, modal should cover everything underneath (transparent could also be nice)
more component: render the comment, each comment could be a component,

image.id

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
