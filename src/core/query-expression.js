'use strict';

var ComponentSelector, AndOperator, OrOperator;

ComponentSelector = require('./query-component-selector');
AndOperator = require('./query-and-operator');
OrOperator = require('./query-or-operator');

function QueryExpression(source, meta) {
  this.tree = null;
  this.entities = [];

  this._source = '';
  this._listeners = [this._onTreeStateChanged.bind(this)];

  if (arguments.length > 0) {
    this.source(source, meta);
  }
}

QueryExpression.tokenize = function QueryExpressionTokenize(source) {
  var tokens, i, chunk, matches;

  tokens = [];
  i = 0;

  while (i < source.length) {
    chunk = source.slice(i);

    if ((matches = chunk.match(/^\b[^\s]+\b(?:\s+from\s+[^\s]+\b)?/))) {
      tokens.push(['COMPONENT_SELECTOR', matches[0]]);
      i += matches[0].length;
    } else if ((matches = chunk.match(/^\s+/))) {
      tokens.push(['AND_OPERATOR', matches[0]]);
      i += matches[0].length;
    } else if ((matches = chunk.match(/^,\s+/))) {
      tokens.push(['OR_OPERATOR', matches[0]]);
      i += matches[0].length;
    } else {
      tokens.push([chunk[0], chunk[0]]);
      i += 1;
    }
  }

  return tokens;
};

QueryExpression.parse = function QueryExpressionParse(tokens) {
  var parsedTokens, length, i, token, lookahead, currentOperator;

  parsedTokens = [];
  length = tokens.length - 1;

  for (i = 0; i < length; i += 1) {
    token = tokens[i];

    switch (token[0]) {
    case 'COMPONENT_SELECTOR':
      break;

    case 'AND_OPERATOR':
    case 'OR_OPERATOR':
      lookahead = tokens[i + 1];

      if (lookahead[0] === 'COMPONENT_SELECTOR') {
        currentOperator = token[0];

        tokens[i + 1] = token;
        tokens[i] = token = lookahead;
      } else if (lookahead[0] === currentOperator) {
        continue;
      } else {
        currentOperator = lookahead[0];
      }
      break;

    default:
      throw new Error('ERR_INVALID_TOKEN ' + token);
    }

    parsedTokens.push(token);
  }

  parsedTokens.push(tokens[length]);

  if (parsedTokens.length === 1) {
    parsedTokens.push(['AND_OPERATOR', ' ']);
  }

  return parsedTokens;
};

QueryExpression.compile = function QueryExpressionCompile(tokens, meta) {
  var stack, i, token, node;

  stack = [];

  for (i = 0; (token = tokens[i]); i += 1) {
    switch (token[0]) {
    case 'COMPONENT_SELECTOR':
      stack.push(new ComponentSelector(token[1], meta));
      break;

    case 'AND_OPERATOR':
      if (node) stack.push(node);
      node = new AndOperator(stack);
      stack.length = 0;
      break;

    case 'OR_OPERATOR':
      if (node) stack.push(node);
      node = new OrOperator(stack);
      stack.length = 0;
      break;
    }
  }

  return node;
};

QueryExpression.prototype._onTreeStateChanged = function _queryExpressionOnTreeStateChanged(entity, state) {
  if (state) this.entities.push(entity);
  else this.entities.splice(this.entities.indexOf(entity));
};

QueryExpression.prototype.source = function queryExpressionSource(source, meta) {
  if (arguments.length === 0) {
    return this._source;
  }

  if (source !== this._source) {
    this._source = source;

    this.tree = this.compile(meta);

    while (this._listeners.length > 0) {
      this.tree.listen(this._listeners.pop());
    }
  }

  return this;
};

QueryExpression.prototype.tokenize = function queryExpressionTokenize() {
  return QueryExpression.tokenize(this._source);
};

QueryExpression.prototype.parse = function queryExpressionParse() {
  return QueryExpression.parse(this.tokenize());
};

QueryExpression.prototype.compile = function queryExpressionCompile(meta) {
  return QueryExpression.compile(this.parse(), meta);
};

QueryExpression.prototype.listen = function queryExpressionListen(listener) {
  if (this.tree) this.tree.listen(listener);
  else this._listeners.push(listener);

  return this;
};

module.exports = QueryExpression;
