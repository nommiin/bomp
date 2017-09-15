/*
    bomp! - the html5 game engine by nommiin, 2017
*/

Engine = {
    Core: {
        EngineSpeed: 60, EngineTimer: 0,
        EngineFrame: Date.now(), EngineFrameCount: 0, 
        EngineDelta: 0, EngineDeltaTime: Date.now(),
        RenderTarget: null, RenderContext: null, RenderProperties: {Width: -1, Height: -1},
        Initiate: function(target, speed) {
            // Render
            Engine.Core.RenderTarget = document.getElementById(target);
            if (Engine.Core.RenderTarget !== null) {
                Engine.Core.RenderContext = Engine.Core.RenderTarget.getContext("2d");
                Engine.Core.RenderContext.imageSmoothingEnabled = false;
                Engine.Core.RenderProperties.Width = Engine.Core.RenderTarget.width;
                Engine.Core.RenderProperties.Height = Engine.Core.RenderTarget.height;
            }

            // Update
            Engine.Core.EngineSpeed = speed || 60;
            setInterval(Engine.Core.Loop, 1000 / Engine.Core.EngineSpeed);
            document.onkeyup = Engine.Input.Up;
            document.onkeydown = Engine.Input.Down;
        },
        Loop: function() {
            // Pre-Update
            Engine.Instance.Container.forEach(function (instance, index) {
                instance.Previous.x = instance.x;
                instance.Previous.y = instance.y;
                if (instance.PreUpdate !== null) {
                    instance.PreUpdate();
                }
            });

            // Update
            Engine.Instance.Container.forEach(function (instance, index) {
                if (instance.Update !== null) {
                    instance.Update();
                }
            });

            // Post-Update
            Engine.Instance.Container.forEach(function (instance, index) {
                if (instance.PostUpdate !== null) {
                    instance.PostUpdate();
                }
            });

            // Render
            Engine.Core.RenderContext.clearRect(0, 0, Engine.Core.RenderProperties.Width, Engine.Core.RenderProperties.Height);
            Engine.Instance.Container.forEach(function (instance, index) {
                if (instance.Render !== null) {
                    instance.Render(Engine.Core.RenderContext);
                }
            });

            // Tick
            Engine.Core.EngineTimer++;

            // Frame Counter
            Engine.Core.EngineFrameCounter++;
            if (Date.now() - Engine.Core.EngineFrame > 999) {
                Engine.Core.EngineFrameCount = Engine.Core.EngineFrameCounter;
                Engine.Core.EngineFrameCounter = 0;
                Engine.Core.EngineFrame = Date.now();
            }
        }
    },
    Object: {
        Container: [],
        Create: function(name) {
            Engine.Object.Container.push({
                Name: name,
                Index: 0,
                Create: null,
                PreUpdate: null,
                Update: null,
                PostUpdate: null,
                Render: null
            });
            return Engine.Object.Container[Engine.Object.Container.length - 1];
        },
        Destroy: function(name) {
            var Result = false;
            Engine.Object.Container.forEach(function(object, index) {
                if (object.Name == name) {
                    Engine.Object.Container.splice(index, 1);
                    Result = true;
                    return;
                }
            });
            return Result;
        },
        Get: function(name) {
            var ObjectRef = null;
            Engine.Object.Container.forEach(function(object, index) {
                if (object.Name == name) {
                    ObjectRef = object;
                    return;
                }
            });
            return ObjectRef;
        }
    },
    Instance: {
        Container: [],
        Create: function(name, x, y) {
            var ObjectRef = (typeof name == "string") ? Engine.Object.Get(name) : name;
            if (ObjectRef != null) {
                Engine.Instance.Container.push({
                    Name: ObjectRef.Name,
                    Index: ObjectRef.Index++,
                    Create: ObjectRef.Create,
                    PreUpdate: ObjectRef.PreUpdate,
                    Update: ObjectRef.Update,
                    PostUpdate: ObjectRef.PostUpdate,
                    Render: ObjectRef.Render,
                    x: x || 0,
                    y: y || 0,
                    Previous: {
                        x: x,
                        y: y
                    }
                });
                if (ObjectRef.Create != null) {
                    Engine.Instance.Container[Engine.Instance.Container.length - 1].Create();
                }
                return Engine.Instance.Container[Engine.Instance.Container.length - 1];
            }
            return -1;
        },
        Destroy: function(name, index) {
            var Result = false;
            Engine.Instance.Container.forEach(function(instance, i) {
                if (instance.Name == name && instance.Index == index) {
                    Engine.Instance.Container.splice(i, 1);
                    Result = true;
                    return;
                }
            });
            return Result;
        },
        Find: function(name) {
            var Result = [];
            Engine.Instance.Container.forEach(function(instance, i) {
                if (instance.Name == name) {
                    Result.push(instance);
                }
            });
            return Result;
        },
        Count: function(name) {
            var Result = 0;
            Engine.Instance.Container.forEach(function(instance, i) {
                if (instance.Name == name) {
                    Result++;
                }
            });
            return Result;
        },
        Collision: function(x, y, name) {
            var Result = false;
            Engine.Instance.Container.forEach(function(instance, i) {
                if (instance.Name == name) {
                    if (instance.x == x && instance.y == y) {
                        Result = true;
                        return;
                    }
                }
            });
            return Result;
        },
        CollisionList: function(x, y, name) {
            var Result = [];
            Engine.Instance.Container.forEach(function(instance, i) {
                if (instance.Name == name) {
                    if (instance.x == x && instance.y == y) {
                        Result.push(instance);
                        return;
                    }
                }
            });
            return Result;
        }
    },
    Input: {
        Container: [],
        Keys: {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        },
        Down: function(e) {
            for(var i = 0; i < Engine.Input.Container.length; i++) {
                if (Engine.Input.Container[i].Type == 0) {
                    if (Engine.Input.Container[i].Code == e.keyCode) {
                        return;
                    }
                } else {
                    Engine.Input.Container.splice(i);
                }
            }
            Engine.Input.Container.push({Type: 0, Code: e.keyCode, Checked: false});
        },
        Up: function(e) {
            for(var i = 0; i < Engine.Input.Container.length; i++) {
                if (Engine.Input.Container[i].Type == 0) {
                    if (Engine.Input.Container[i].Code == e.keyCode) {
                        Engine.Input.Container[i].Type = 1;
                        Engine.Input.Container[i].Checked = false;
                        return;
                    }
                }
            }
        },
        Check: function(input) {
            for(var i = 0; i < Engine.Input.Container.length; i++) {
                if (Engine.Input.Container[i].Type == 0) { 
                    if (Engine.Input.Container[i].Code == input) {
                        return true;
                    }
                }
            }
            return false;
        },
        CheckPressed: function(input) {
            for(var i = 0; i < Engine.Input.Container.length; i++) {
                if (Engine.Input.Container[i].Type == 0) {
                    if (Engine.Input.Container[i].Code == input) {
                        if (Engine.Input.Container[i].Checked == false) {
                            Engine.Input.Container[i].Checked = true;
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        CheckReleased: function(input) {
            for(var i = 0; i < Engine.Input.Container.length; i++) {
                if (Engine.Input.Container[i].Type == 1) {
                    if (Engine.Input.Container[i].Code == input) {
                        if (Engine.Input.Container[i].Checked == false) {
                            Engine.Input.Container[i].Checked = true;
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
    Math: {
        dsin: function(x) {
            return Math.sin(x * Math.PI / 180);
        },
        dcos: function(x) {
            return Math.cos(x * Math.PI / 180);
        },
        lengthdir_x: function(d, l) {
            return Engine.Math.dsin(d) * l;
        },
        lengthdir_y: function(d, l) {
            return (Engine.Math.dcos(d) * l) * -1;
        },
        RandomRange: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    Render: {
        GlobalColor: "white", GlobalAlpha: 1, Steps: 16,
        Text: function(x, y, string) {
            if (Engine.Core.RenderContext !== null) {
                Engine.Core.RenderContext.fillText(string, x, y);
            }
        },
        Line: function(x1, y1, x2, y2) {
            Engine.Core.RenderContext.beginPath();
            Engine.Core.RenderContext.moveTo(x1, y1);
            Engine.Core.RenderContext.lineTo(x2, y2);
            Engine.Core.RenderContext.stroke();
        },
        Rectangle: function(x1, y1, x2, y2, outline) {
            if (Engine.Core.RenderContext !== null) {
                Engine.Core.RenderContext.fillRect(x1, y1, x2 - x1, y2 - y1);
                //outline == true ? Engine.Core.RenderContext.stroke() :  Engine.Core.RenderContext.fill();
            }
        },
        Circle: function(x, y, radius, outline) {
            Engine.Core.RenderContext.beginPath();
            for(var i = 0; i <= 360; i += 360 / Engine.Render.Steps) {
                Engine.Core.RenderContext.lineTo(x + Engine.Math.lengthdir_x(i, radius), y + Engine.Math.lengthdir_y(i, radius));
            }
            outline == true ? Engine.Core.RenderContext.stroke() :  Engine.Core.RenderContext.fill();
        },
        Alpha: function(a) {
            Engine.Render.GlobalAlpha = a;
            Engine.Core.RenderContext.globalAlpha = a;
        },
        Color: function(c) {
            Engine.Render.GlobalColor = c;
            Engine.Core.RenderContext.fillStyle = c;
            Engine.Core.RenderContext.strokeStyle = c;
        }
    }
}