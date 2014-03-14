(function(){
    system.define('kinematic', ['position', 'velocity'], function () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    });

    system.define('privateRender', ['position', 'size', 'render'], function () {
        var context = this.render.context;
        context.fillStyle = this.render.color;
        context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }, {msPerUpdate : 16, strict : false});

    system.define('render', ['position', 'size', 'render', 'layer'], function (entity) {
       system('privateRender').run(entity);
    }, {msPerUpdate : 16, strict : false, disable : ['privateRender']});

    system.define("movement", ["position", "velocity"], function (){
        this.position.x += this.velocity.x*this._deltaTime;
        this.position.y += this.velocity.y*this._deltaTime;
    }, {msPerUpdate : 16, strict : true, extrapolation : true});

    component.define('position', function (id, data) {
        return {
            x : data.x || 0, y : data.y || 0
        };
    });

    component.define('velocity', function (id, data) {
        return {
            x : data.x || 0, y : data.y || 0
        };
    });

    component.define('size', function (id, data) {
        return {
            width : data.width || 0, height : data.height || 0
        };
    });

    component.define('render', function (id, data) {
        var render = {
            context : data.context || 0, color : data.color || 'black'
        };
        render.toJSON = function(){
          var self = this;
          return {
            color : self.color,
            layer : self.layer
          }
        }
        return render;
    });

    entity.define('box', {
       components : ['position', 'size', 'render', 'velocity', 'layer']
    });

    var canvas = document.getElementById('canvas');

    for(var i = 0; i < 100; i++){
        var box = entity('box').create({
            render : {
                context : canvas.getContext('2d'),
                color : 'blue'
            },
            layer : {
                layer : 1,
                systems : ['render']
            },
            size : {
                width : 50,
                height : 50
            },
            position : {
                x : 100,
                y : 100
            },
            velocity : {
                x : Math.random()-Math.random(),
                y : Math.random()-Math.random()
            }
        });
    
        component('watcher').add(box).watch('position.x', function (value, old) {
          //console.log('changed box x position from ' + value + ' to ' + old);
        });
    }

    var background = entity('box').create({
        render : {
            context : canvas.getContext('2d'),
            color : 'green'
        },
        size : {
            width : 800,
            height : 600
        }
    });

    component('watcher').add(background).watch('render.color', function (value, old) {
        //console.log('changed background color from ' + old + ' to ' + value);
    });

    // var serialized = entity.serialize(background);
    // var newEntity = entity.unSerialize(serialized);
    // console.log(serialized);
    // console.log(newEntity);
    // console.log(entity.serialize(newEntity));

    system.on('before:render', function() {
        //canvas.getContext('2d').clearRect(0,0,800,600);
    });

    system.on('after:render', function(){
        //console.log('after render');
    });
    function run(){
        system.run();
        requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
})(system, component, entity)
