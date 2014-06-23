var cssimg = require('../');
var gulp = require('gulp');
var through = require('through2');

describe('cssimg', function() {

  it('normal', function(done) {
    gulp
      .src('./test/fixtures/a.css')
      .pipe(cssimg(webp))
      .pipe(through.obj(function(file) {
        file.contents.toString().should.be.eql('a{background:url(a.webp.jpg) no-repeat;}\n');
        done();
      }));
  });
});

function webp(imgs, cb) {
  setTimeout(function() {
    cb(null, imgs.map(function(img) {
      return img.replace(/\.(jpg|png|gif|jpeg)$/, '.webp.$1');
    }));
  }, 100);
}

