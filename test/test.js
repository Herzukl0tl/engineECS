(function(){
    var canvas;

    //Defining a system, with its components dependencies, its running function,
    //and its scheduler configuration.  
    //The system is called privateRender becaus it will never run alone.  
    //It's a subsystem which will be launched by an other.
    system.define('privateRender', ['position', 'size', 'render'], function (entity, scene) {
        var context = scene.context;
        context.fillStyle = this.render.color;
        context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }, {msPerUpdate : 16, strict : false});

    //The render system is the only render system to run.  
    //It launch all the other privates render systems;  
    //Defining it disable the existing 'privateRender' system, in the config.  
    system.define('render', ['position', 'size', 'render', 'layer'], function (entity) {
       system('privateRender').run(entity);
    }, {msPerUpdate : 16, strict : false, disable : ['privateRender']});


    //This system enable the scheduler extrapolation.  
    //It means it needs the 'this._deltaTime' to extrapolate its computing.
    system.define("movement", ["position", "velocity"], function (){
        this.position.x += this.velocity.x*this._deltaTime;
        this.position.y += this.velocity.y*this._deltaTime;
    }, {msPerUpdate : 16, strict : true, extrapolation : true});

    //Defining a basic component.
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

    //The component render has no 'context' key because the drawing context depends on the scene.
    component.define('render', function (id, data) {
        return {
            color : data.color || 'black'
        };
    });

    //Defining a basic entity owning 4 components
    entity.define('box', {
       components : ['position', 'size', 'velocity', 'layer']
    });

    //Defining a scene
    scene.define('background', function(){
        //Creating an entity from 'box' factory.
        var background = entity('box').create({
            size : {
                width : 800,
                height : 600
            }
        });

        component('render').add(background, {
            color : 'green'
        });

        //Adding a core component : the watcher-component.  
        //It has a particular API.  
        //It can observe one or several components keys of the attached entity and call the 
        //associated callback.
        component('watcher').add(background).watch('render.color', function (value, old) {
            console.log('changed background color from ' + old + ' to ' + value);
        });
    });

    scene.define('test', function(){
        var box = entity('box').create({
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
        component('render').add(box, {
            color : 'blue'
        });
        for(var i = 0; i < 100; i++){
            var next = entity('box').create({
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
            component('render').share(box, next);
        }
        //Instanciating the 'background' scene with the same context as the 'test' scene.
        scene('background').instanciate(this);

        //Listening a particular system running events (before and after).
        system.on('before:render', function() {
            console.log('before render');
        });

        system.on('after:render', function(){
            console.log('after render');
        });
    });

    //Defining the launch scene.  
    //It instanciates the 'test' scene twice with the same context object.  
    scene.define('launch', function(){
        canvas = document.getElementById('canvas');
        var context = {
            context : canvas.getContext('2d')
        };
        scene('test').instanciate(context);
        scene('test').instanciate(context);
    });

    scene('launch').instanciate();
    function run(){
        //Running all the defined systems
        system.run();
        requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
})(system, component, entity)
