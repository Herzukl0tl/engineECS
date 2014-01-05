function entity(query) {
  if (typeof query === "Number") {
    if(entity._objectEntities[query]) return entity._objectEntities[query];
  }

  throw new Error();
}

entity._nextEntityId = 1;
entity._arrayEntities = [];
entity._objectEntities = {};