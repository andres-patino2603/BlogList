const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
describe('most likes', () => {
    const listWithMultipleBlogs = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f0',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f1',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 0,
        __v: 0
      },
      {
        _id: '5a422b3a1b54a676234d17f2',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 2,
        __v: 0
      }
    ];
  
    test('returns the author with most likes', () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs);
      const expected = {
        author: 'Edsger W. Dijkstra',
        likes: 17
      };
      assert.deepStrictEqual(result, expected);
    });
  
    test('returns null for an empty list', () => {
      const result = listHelper.mostLikes([]);
      assert.strictEqual(result, null);
    });
  });