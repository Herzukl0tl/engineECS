class ComponentDefinition{
  final String name;
  final Function definition;
  
  Map _instances;
  
  ComponentDefinition(this.name, this.definition){
    this._instances = new Map();
  }
  
  of(int entity, [Map options]){
    Object component = this._instances[entity];
    
    if(options != null){
      if(component == null){
        if (options["required"]) throw new Error();
        else if(options["add"]) component = this.add(entity);
      }
    }
  }
  
  bool within(int entity){
    if(this._instances[entity] != null) return true;
    
    return false;
  }
  
  Map add(int entity, [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9]){
    if (this.within(entity)) throw new Error();
    
    List arguments = new List();
    
    if(arg1!=null) arguments.add(arg1);
    if(arg2!=null) arguments.add(arg2);
    if(arg3!=null) arguments.add(arg3);
    if(arg4!=null) arguments.add(arg4);
    if(arg5!=null) arguments.add(arg5);
    if(arg6!=null) arguments.add(arg6);
    if(arg7!=null) arguments.add(arg7);
    if(arg8!=null) arguments.add(arg8);
    if(arg9!=null) arguments.add(arg9);
    
    Map component = Function.apply(this.definition, arguments);
    
    this._instances[entity] = component;
    
    return component;
  }
  
  bool remove(int entity){
    if (!this.within(entity)) return false;

    this._instances[entity].remove(entity);
    
    return true;
  }
  
  share(int entity, List dest){
    if (!this.within(entity)) return null;
    
    Map component = this.of(entity);
    
    if (dest != null) {
      for (int i = dest.length - 1; i >= 0; i -= 1) {
        this._instances[dest[i]] = component;
      }
    } else {
      this._instances[dest] = component;
    }
    
    return component;
  }
}