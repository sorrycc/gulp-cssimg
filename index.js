var through = require('through2');
var uniq = require('uniq');
var gutil = require('gulp-util');

module.exports = function(fn) {

  return through.obj(function(file, enc, callback) {
    var contents = file.contents.toString();
    var images = getImages(contents);
    fn(images, function(e, urls) {
      if (e) {
        return callback(new gutil.PluginError('cssimg', e));
      }

      var newContent = replaceContent(images, urls, contents);
      file.contents = new Buffer(newContent);
      callback(null, file);
    });
  });
};

function getImages(content) {
  var re = /url\((.*?(gif|png|jpg|jpeg).*?)\)/gi;
  var m;
  var images = [];

  while (m = re.exec(content)) {
    var src = m[1];
    src = src.trim();
    src = src.replace(/^["']|["']$/g, '');
    var isRelative = !/^https?:\/\//.test(src);
    if (isRelative) {
      images.push(src);
    }
  }

  return uniq(images);
}

function replaceContent(images, urls, content) {
  images.forEach(function(image, i) {
    var re = new RegExp(image, 'gi');
    content = content.replace(re, urls[i]);
  });
  return content;
}
