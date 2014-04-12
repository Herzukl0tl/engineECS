(function(){
    nuclear.module('test', []);

    var t = nuclear.module('test1', []);

    t.component('position', function(entity, data){
      return {x : data.x, y : data.y}
    });

    var m = nuclear.module('test', ['test1']);

    m.component('position', function(entity, data){
      return {x : data.x, y : data.y}
    });

    m.system('move', ['position', 'position from test1 as pos'], function(components, entity){
      console.log(components);
      console.log(components.pos);
      components.position.x += 10;

      console.log(components.position.x);
    }, {});

    m.entity('mover', function(entity, data){
      nuclear.component('position').add(entity, data);
    });

    m.entity('moverBis', function(entity, data) {
      nuclear.entity('mover').enhance(entity, data);
      nuclear.component('position from test1').add(entity, data);
    });

    nuclear.import([t, m]);

    var entity = nuclear.entity('mover from test').create({x : 0, y : 5});
    var b = nuclear.entity.create();

    nuclear.component('position').share(entity, b);

    console.log('share', nuclear.component('position').of(b) === nuclear.component('position').of(entity));

    console.log(nuclear.component.all(entity));

    entity = nuclear.entity('moverBis from test').create({x : 20, y : 5});

    nuclear.component('position from test1').disable(entity);

    nuclear.system.run();
})(nuclear);
