// TODO
// write a better query.compile()
// define the * and components cmd

'use strict';

var rSpaces = /\s+/g,
  rTokens = /[^&|!()]+|[&|!()]/g,
  rEscapeRegExp = /([.*+?^=!:${}()|\[\]\/\\])/g;


function query(cmd, expression) {
  if (cmd in query._aliases) {
    var params = query._aliases[cmd];

    cmd = params.cmd;
    expression = params.expression;
  }

  if (cmd in query._definitions) {
    return invokeQuery(cmd, expression);
  }

  throw new Error();
}

function invokeQuery(cmd, expression) {
  return query._definitions[cmd](expression);
}

query._definitions = Object.create(null);
query._aliases = Object.create(null);
query._cache = Object.create(null);
query._tokens = Object.create(null);

query._tokens.and = ',';
query._tokens.or = 'OR';
query._tokens.not = '!';
query._tokens.open = '(';
query._tokens.close = ')';

query.tokens = function queryTokens(values) {
  if (arguments.length === 0) {
    return query._tokens;
  }

  var tokens = query._tokens,
    template = '';

  for (var property in tokens) {
    if (property in values) {
      tokens[property] = values[property];
    }

    template += tokens[property];
  }

  template = escapeRegExp(template);

  rTokens = new RegExp('[^' + template + ']+|[' + template + ']', 'g');
};

function escapeRegExp(string) {
  return string.replace(rEscapeRegExp, '\\$1');
}

query.define = function queryDefine(cmd, definition) {
  if (cmd in query._definitions) {
    throw new Error();
  }

  query._definitions[cmd] = definition;
};

query.alias = function queryAlias(alias, params) {
  if (alias in query._aliases) {
    throw new Error();
  }

  if (typeof params === 'object' && params !== null) {
    query._aliases[alias] = params;
  }

  throw new Error();
};

query.compile = function queryCompile(input) {
  var key = input.replace(rSpaces, ''),
    tokens, head, tail, expression, fragment;

  if (!(key in query._cache)) {
    tokens = query._tokens;

    head = 'return function queryExpression($predicate) {\n  return !!(';
    tail = ');\n}';

    expression = key.match(rTokens);

    for (var i = 0;
      (fragment = expression[i]); i += 1) {
      switch (fragment) {
      case tokens.and:
        expression[i] = '&&';
        break;

      case tokens.or:
        expression[i] = '||';
        break;

      case tokens.not:
        expression[i] = '!';
        break;

      case tokens.open:
        expression[i] = '(';
        break;

      case tokens.close:
        expression[i] = ')';
        break;

      default:
        expression[i] = '$predicate(' + JSON.stringify(fragment) + ')';
      }
    }

    try {
      expression = new Function(head + expression.join('') + tail)();
    } catch (oO) {
      throw new Error();
    }

    query._cache[key] = expression;
  }

  return query._cache[key];
};


module.exports = query;
