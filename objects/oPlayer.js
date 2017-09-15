oPlayer = Engine.Object.Create("oPlayer");
oPlayer.Create = function() {
    this.Tail = [];
    this.TailIndex = 0;
    this.Size = {
        Width: 16,
        Height: 16
    }
    this.Direction = {
        x: 1,
        y: 0
    }
    this.Previous = {
        x: this.x,
        y: this.y
    }
    this.Speed = 2;
}

oPlayer.Update = function() {
    // Input
    if (Engine.Input.Check(Engine.Input.Keys.LEFT) == true) {
        this.Direction.x = -1;
        this.Direction.y = 0;
    } else if (Engine.Input.Check(Engine.Input.Keys.RIGHT) == true) {
        this.Direction.x = 1;
        this.Direction.y = 0;
    } else if (Engine.Input.Check(Engine.Input.Keys.UP) == true) {
        this.Direction.x = 0;
        this.Direction.y = -1;
    } else if (Engine.Input.Check(Engine.Input.Keys.DOWN) == true) {
        this.Direction.x = 0;
        this.Direction.y = 1;
    }

    // Movement
    if (Engine.Core.EngineTimer % 5 == 0) {
        this.Previous.x = this.x;
        this.Previous.y = this.y;
        this.x += this.Direction.x;
        this.y += this.Direction.y;
        this.TailIndex = (this.TailIndex + 1) % this.Tail.length;
        // Move Tail
        if (this.Tail.length > 1) {
            var oTail = Engine.Instance.Find("oTail")[this.TailIndex];
            oTail.x = this.Previous.x;
            oTail.y = this.Previous.y;
        }
    }

    if (this.x < 0) {
        this.x = (Engine.Core.RenderProperties.Width / this.Size.Width) - 1;
    } else if (this.x > (Engine.Core.RenderProperties.Width / this.Size.Width) - 1) {
        this.x = 0;
    }

    if (this.y < 0) {
        this.y = (Engine.Core.RenderProperties.Height / this.Size.Height) - 1;
    } else if (this.y > (Engine.Core.RenderProperties.Height / this.Size.Height) - 1) {
        this.y = 0;
    }
    
    // Collision
    var oFruit = Engine.Instance.Find("oFruit")[0];
    if (this.x == oFruit.x && this.y == oFruit.y) {
        oFruit.x = Engine.Math.random_range(0, (Engine.Core.RenderProperties.Width / 16) - 1);
        oFruit.y = Engine.Math.random_range(0, (Engine.Core.RenderProperties.Height / 16) - 1);
        // Create fruit
        this.Tail.push(
            Engine.Instance.Create("oTail", this.Previous.x, this.Previous.y)
        );
    }
}

oPlayer.Render = function() {
    Engine.Render.Color("black");
    Engine.Render.Rectangle(this.x * this.Size.Width, this.y * this.Size.Height, (this.x * this.Size.Width) + this.Size.Width, (this.y * this.Size.Height) + this.Size.Height, false);
    Engine.Render.Text(32, 32, "oPlayer.x: " + this.x);
    Engine.Render.Text(32, 48, "oPlayer.y: " + this.y);
    Engine.Render.Text(32, 64, "oPlayer.TailIndex: " + this.TailIndex);
    Engine.Render.Color("black");
}