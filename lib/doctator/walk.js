var esprima = require('esprima');

module.exports = function walk(src, fn) {
  var returnedNodes = [];
  var ast = esprima.parse(src, {
    comment: true,
    loc: true,
    attachComment: true
  });

  (function doWalk(node, parent) {
    Object.keys(node).forEach(function(key) {
      if (key === 'parent') return;
      var child = node[key];
      var ret;

      if (Array.isArray(child)) {
        child.forEach(function(c) {
          if (c && typeof c.type === 'string') {
            doWalk(c, node);
          }
        });
      }
      else if (child && typeof child.type === 'string') {
        doWalk(child, node);
      }
    });

    ret = fn(node);
    if (ret) {
      returnedNodes.push(ret);
    }
  })(ast, undefined);

  return returnedNodes;
};
