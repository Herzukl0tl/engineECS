'use strict';

var resolver, rValidPath;

module.exports = resolver = {};
rValidPath = /^([^\s]+)((?:\s+from\s+([^\s]+))?(?:\s+as\s+([^\s]+))?)$/;

resolver.validate = function resolverValidate(path) {
  if (!rValidPath.test(path)) {
    throw new Error();
  }
};

resolver.name = function resolverName(path, value) {
  this.validate(path);

  if (arguments.length === 1) {
    return RegExp.$1 || path;
  }

  return RegExp.$2 && value + RegExp.$2 || value;
};

resolver.alias = function resolverAlias(path, value) {
  this.validate(path);

  if (arguments.length === 1) {
    return RegExp.$4 || '';
  }

  return RegExp.$1 + (RegExp.$3 ? ' from ' + RegExp.$3 : '') + ' as ' + value;
};

resolver.module = function resolverModule(path, value) {
  this.validate(path);

  if (arguments.length === 1) {
    return RegExp.$3 || '';
  }

  return RegExp.$1 + ' from ' + value + (RegExp.$4 ? ' as ' + RegExp.$4 : '');
};

resolver.identity = function resolverIdentity(path) {
  this.validate(path);

  if (RegExp.$1 && RegExp.$3) {
    return RegExp.$1 + ' from ' + RegExp.$3;
  }

  throw new Error();
};
