function component(name) {
  if (name in component._definitions) {
    return component._definitions[name];
  }

  throw new Error();
}

component._definitions = Object.create(null);

component.define = function componentDefine(name, definition) {
  if (name in factory._definitions) {
    throw new Error();
  }

  var componentDefinition = new ComponentDefinition(name, definition);

  component._definitions[name] = componentDefinition;

  return componentDefinition;
};
