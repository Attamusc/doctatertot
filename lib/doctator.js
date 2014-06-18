/**
 * I am an JSDoc comment
 *
 * @param {Array} filesGlob - locations to search within for docblocks
 * @param {string} outputDir - directory where markdown files should be created
 */
var doctrine = require('doctrine');
var fs = require('fs');
var glob = require('glob');
var Q = require('q');
var Entry = require('./doctator/entry');
var walk = require('./doctator/walk');

function getName(node) {
  var name = node.name || (typeof node.value === 'string' && node.value);

  if (!name) {
    if (typeof node.key === 'object') {
      name = getName(node.key);
    }
    if (typeof node.id === 'object') {
      name = getName(node.id);
    }
    if (typeof node.property === 'object') {
      name = getName(node.property);
    }
    if (Array.isArray(node.declarations)) {
      // This will only be hit for a single var declaration sequence,
      // so we make the assumption that the comment above the declaration
      // applies to the first declarator.
      name = getName(node.declarations[0]);
    }
  }

  return name;
}

function isJSDocComment(commentNode) {
  return commentNode.type === 'Block' && commentNode.value.charAt(0) === '*';
}

function extractEntries(file) {
  var deferred = Q.defer();
  var entries = [];

  fs.readFile(file, function(err, contents) {
    if (err) deferred.reject(err);

    walk(contents.toString(), function(node) {
      if (node.leadingComments) {
        node.leadingComments.forEach(function(comment) {
          if (isJSDocComment(comment)) {
            entries.push({
              name: getName(node),
              docblock: doctrine.parse(comment.value, { unwrap: true }),
              lineNumber: comment.loc.start.line
            });
          }
        });
      }
    });

    deferred.resolve(entries);
  });

  return deferred.promise;
}

function filenameToModuleName(filename) {
  return filename.replace(/\.js$/, '');
}

/**
 * I am an JSDoc comment
 *
 * @param {Array} filesGlob - locations to search within for docblocks
 * @param {string} outputDir - directory where markdown files should be created
 */
module.exports = function(filesGlob, outputDir) {
  glob(filesGlob, function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
      var processedFile = {
        name: filenameToModuleName(file)
      }

      extractEntries(file)
      .then(function(entries) {
        processedFile = Entry.make(processedFile, entries);
      });
    });
  });
};
