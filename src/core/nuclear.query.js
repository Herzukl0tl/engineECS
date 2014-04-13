'use strict';

var QueryExpression;

QueryExpression = require('./query-expression');

function nuclearQuery(expression, meta) {
  return new QueryExpression(expression, meta);
}

nuclearQuery.raw = function nuclearQueryRaw() {};

nuclearQuery.live = function nuclearQueryLive() {};

module.exports = nuclearQuery;
