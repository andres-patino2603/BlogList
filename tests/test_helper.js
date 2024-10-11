const mongoose = require('mongoose');
const Blog = require('../models/blog'); // Asegúrate de que la ruta a tu modelo es correcta

const initialBlogs = [
    {
        title: 'First class tests',
        author: 'Author zero',
        url: 'http://example.com/0',
        likes: 52
    },
    {
        title: 'First Blog',
        author: 'Author One',
        url: 'http://example.com/1',
        likes: 5
    },
    {
        title: 'Second Blog',
        author: 'Author Two',
        url: 'http://example.com/2',
        likes: 65
    }
];

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' });
    await blog.save();
    await blog.remove();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const initializeBlogs = async () => {
    await Blog.deleteMany({});
    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    initializeBlogs
};