function factory(name) {
  if (name in factory._definitions) {
    return factory._definitions[name];
  }

  throw new Error();
}

factory._definitions = Object.create(null);

factory.define = function factoryDefine(name, source) {
  if (name in factory._definitions) {
    throw new Error();
  }

  var factoryDefinition = new FactoryDefinition(name, source);

  factory._definitions[name] = factoryDefinition;

  return factoryDefinition;
};
