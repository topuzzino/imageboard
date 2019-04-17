CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(1000),
    username VARCHAR(100),
    image_id REFERENCES images(id)
);
