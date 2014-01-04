import 'ComponentDefinition.dart';

class Component{
  Map _definitions;
  
  Component(){
    this._definitions = new Map();
  }
  
  get(String name){
    return this._definitions[name];
  }
  
  define(String name, Function definition){
    ComponentDefinition componentDefinition = new ComponentDefinition(name, definition);

    this._definitions[name] = componentDefinition;

    return componentDefinition;
  }
}
