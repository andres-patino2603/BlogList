const User = require('../models/user');
const Blog = require('../models/blog');

const initialBlogs = [
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
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

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb,
};