import "component/component.dart";
import 'component/ComponentDefinition.dart';

void main() {  
  component.define("myFirstComponent", (myArg){
    print(myArg);
    return new Map();
  });
  ComponentDefinition lel = component.get("myFirstComponent");
  lel.add(0, "yolo");
}