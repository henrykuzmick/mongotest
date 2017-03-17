const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const blogPost = require('../src/blogPost');

describe('Middleware', () => {
  let joe, blogpost;
  beforeEach((done) => {
    joe = new User({name: 'Joe'});
    blogpost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is.' });

    joe.blogPosts.push(blogpost);

    Promise.all([joe.save(), blogpost.save()])
      .then(() => done());
  });

  xit('users clean up dangling blogposts on remove', (done) => {
    joe.remove()
      .then(() => blogPost.count())
      .then((count) => {
        assert(count === 0);
        done();
      });
  });
});
