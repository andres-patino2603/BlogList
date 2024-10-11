const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id).then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body;

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
    });

    try {
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        next(error);
    }
});

  blogsRouter.delete('/:id', async (request, response, next) => {
    try {
      const result = await Blog.findByIdAndDelete(request.params.id);
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    } catch (error) {
      next(error);
    }
  });

  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body;
    const blog = {
        likes: body.likes,
    };
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
        if (updatedBlog) {
            response.json(updatedBlog);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});
  module.exports = blogsRouter