const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
    await Blog.deleteMany({});
    console.log("Database cleared");

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    await Promise.all(blogObjects.map(blog => blog.save()));

    const blogsInDb = await helper.blogsInDb();
});


test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    assert(titles.includes('First class tests'));
});

test("unique identifier property of blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert(blog.id !== undefined);
    assert(blog._id === undefined);
});

test("a valid blog can be added", async () => {
    const newBlog = {
        title: "async/await simplifies making async calls",
        author: "John Doe",
        url: "http://example.com",
        likes: 5,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes("async/await simplifies making async calls"));
});
test("Blog deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(!titles.includes(blogToDelete.title));
})
test("blog without title and url is not added", async () => {
    const newBlog = {
        author: "John Doe",
        likes: 5,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});
test("blog likes default to 0", async () => {
    const newBlog = {
        title: "New Blog Post",
        author: "Jane Doe",
        url: "http://example.com/new",
    };
    await api.post("/api/blogs").send(newBlog).expect(201);
    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.map((b) => b.likes);
    assert(likes.includes(0));
})
test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("a new blog post is created with a POST request", async () => {
    const newBlog = {
        title: "New Blog Post",
        author: "Jane Doe",
        url: "http://example.com/new",
        likes: 10,
    };

    const initialResponse = await api.get("/api/blogs");
    const initialLength = initialResponse.body.length;

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const finalResponse = await api.get("/api/blogs");
    const finalLength = finalResponse.body.length;


    assert.strictEqual(finalLength, initialLength + 1);

    const titles = finalResponse.body.map((r) => r.title);
    assert(titles.includes(newBlog.title));
});

after(async () => {
    console.log('Closing mongoose connection...');
    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
});