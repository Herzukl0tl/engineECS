(function(){
    nuclear.module('test', []);
    var m = nuclear.module('test', []);
    m.component('position', function(entity, data){
      return {x : data.x, y : data.y}
    });
    m.system('move', ['position'], function(entity){
      this.position.x += 10;
      console.log(this.position.x);
    }, {});
    m.entity('mover', function(entity, data){
      nuclear.component('position').add(entity, data);
    });
    m.entity('moverBis', function(entity, data){
      nuclear.entity('mover').enhance(entity, data);
    });
    nuclear.registry.import(m);
    var entity = nuclear.entity('mover from test').create({x : 0, y : 5});
    console.log(nuclear.component.all(entity));
    entity = nuclear.entity('moverBis from test').create({x : 20, y : 5});
    nuclear.system.run();
})(nuclear);
