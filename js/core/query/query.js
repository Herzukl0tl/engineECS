// TODO
// sanitize rTokens template
// write a better query.compile()
// implement query.filter()
// define standard queries
//   query('components', ...)
//   query('factories', ...)

var rSpaces = /\s+/g,
  rTokens = /[^&|!()]+|[&|!()]/g;

function query(name, expression) {
  if (name in query._definitions) {
    return query._definitions[name](expression);
  }

  throw new Error();
}

query._definitions = Object.create(null);

query._cache = Object.create(null);

query._tokens = Object.create(null);

query._tokens.and = '&';
query._tokens.or = '|';
query._tokens.not = '!';
query._tokens.open = '(';
query._tokens.close = ')';

query.tokens = function queryTokens(value) {
  if (arguments.length === 0) {
    return query._tokens;
  }

  var tokens = query._tokens,
    template = '';

  for (var property in tokens) {
    if (property in value) {
      tokens[property] = value[property];
    }

    template += tokens[property];
  }

  rTokens = new RegExp('[^' + template + ']+|[' + template + ']', 'g');
};

query.define = function queryDefine(name, definition) {
  if (name in query._definitions) {
    throw new Error();
  }

  query._definitions[name] = definition;
};

query.compile = function queryCompile(input) {
  var key = input.replace(rSpaces, ''),
    tokens, head, tail, expression, fragment;

  if (!(key in query._cache)) {
    tokens = query._tokens;

    head = 'return function queryExpression($predicate) {\n  return !!(';
    tail = ');\n}';

    expression = key.match(rTokens);

    for (var i = 0; fragment = expression[i]; i += 1) {
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
