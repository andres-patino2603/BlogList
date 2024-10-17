const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({}).populate("user", { username: 1, name: 1 , id: 1})
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
  
    try {
      const user = request.user;
  
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
      });
  
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  });

  blogsRouter.delete('/:id', async (request, response, next) => {
    try {
      const user = request.user;
  
      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: 'blog no encontrado' });
      }
  
      if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'permiso denegado' });
      }
  
      await Blog.findByIdAndDelete(request.params.id);
      user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id);
      await user.save();
      response.status(204).end();
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