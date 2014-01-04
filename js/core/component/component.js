function component(name) {
  return component._definitions[name] || null;
}

component._definitions = Object.create(null);

component.define = function componentDefine(name, definition) {
  var componentDefinition = new ComponentDefinition(name, definition);

  component._definitions = componentDefinition;

  return componentDefinition;
};
