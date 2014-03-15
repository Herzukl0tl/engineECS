'use strict';

module.exports = {
  js: ['dist/js/*', '!dist/js/.gitignore'],
  dart: ['dist/dart/*', '!dist/dart/.gitignore'],
  githooks: '.git/hooks/pre-commit'
};
