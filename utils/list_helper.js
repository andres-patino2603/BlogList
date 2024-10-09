const dummy = (blogs) => {
    return 1;
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
  
    const favorite = blogs.reduce((favorite, blog) => {
      return (favorite.likes > blog.likes) ? favorite : blog;
    });
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    };
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
  
    const authorCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1;
      return counts;
    }, {});
  
    const mostBlogsAuthor = Object.keys(authorCounts).reduce((a, b) => {
      return authorCounts[a] > authorCounts[b] ? a : b;
    });
  
    return {
      author: mostBlogsAuthor,
      blogs: authorCounts[mostBlogsAuthor]
    };
  }
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
  
    const authorLikes = blogs.reduce((likes, blog) => {
      likes[blog.author] = (likes[blog.author] || 0) + blog.likes;
      return likes;
    }, {});
  
    const mostLikesAuthor = Object.keys(authorLikes).reduce((a, b) => {
      return authorLikes[a] > authorLikes[b] ? a : b;
    });
  
    return {
      author: mostLikesAuthor,
      likes: authorLikes[mostLikesAuthor]
    };
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }