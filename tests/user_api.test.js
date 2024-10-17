const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
});

describe('User creation', () => {
    test('succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukk',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert(result.body.error.includes('Username must be unique'));

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('fails with proper statuscode and message if username or password is too short', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'sa',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert(result.body.error.includes('Username and password must be at least 3 characters long'));

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

describe('Blog operations', () => {
    let token;

    beforeEach(async () => {
        const newUser = {
            username: 'testuser',
            password: 'testpassword'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const loginResponse = await api
            .post('/api/login')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        token = loginResponse.body.token;
    });

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5
        };

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, 1);

        const titles = blogsAtEnd.map(b => b.title);
        assert(titles.includes('async/await simplifies making async calls'));
    });

    test('blog addition fails with status code 401 if token is not provided', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, 0);
    });
});

after(async () => {
    await mongoose.connection.close();
});
