const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');
const assert = require('assert');

describe('Associations', () => {
  let joe, blogpost, comment;

  beforeEach((done) => {
    joe = new User({name: 'Joe'});
    blogpost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is.' });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogpost);
    blogpost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogpost.save(), comment.save()])
      .then(() => done());
  });

  xit('saves a relation between a user and a blog post', function(done) {
    this.timeout(10000);
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      })
  });

  xit('saves a full relation graph', function(done) {
    this.timeout(10000);
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');
        done();
      })
  });

});
