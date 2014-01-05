function system(name) {
  if (name in system._definitions) {
    return system._definitions[name];
  }

  throw new Error();
}

system._definitions = Object.create(null);
system._list = new Array();
system._listLength = 0;

system.define = function systemDefine(name, definition, components, context) {
  if (name in system._definitions) {
    throw new Error();
  }

  var systemDefinition = new SystemDefinition(name, definition, components, context);

  system._definitions[name] = systemDefinition;
  system._list.push(name);
  system._listLength++;

  return systemDefinition;
};

system.order = function systemOrder(newList){
    if(Array.isArray(newList)) system._list = newList;

    system._listLength = system._list.length;

    return system._list;
}

system.runByEntity = function systemRunByEntity(entities){
    var length = entities.length;
    for (var i = 0; i < length; i++){
        var componentPack = entities[i].components();
        for(var x = 0; x < system._listLength; x++){
            system._list[x].run(componentPack);
        }
    }
}

system.runBySystems = function systemRunBySystems(entities){
    for (var x = 0; x < system._listLength; x++){
        var length = entities.length;
        for(var i = 0; i < length; i++){
            var componentPack = entities[i].components();
            system._list[x].run(componentPack);
        }
    }
}

system.refresh = function systemRefresh(entity){
    for (var x = 0; x < system._listLength; x++){
        var componentPack = entity.components();
        if(system._list[i].check(componentPack)) system._list[i].add(entity, componentPack);
        else system._list[i].remove(entity);
    }
}