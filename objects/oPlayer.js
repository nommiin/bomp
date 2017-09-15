oPlayer = Engine.Object.Create("oPlayer");
oPlayer.Create = function() {
    this.Score = 0;
    this.Tail = [];
    this.InputPrevious = -1;
    this.Size = {
        Width: 16,
        Height: 16
    }
    this.Direction = {
        x: 1,
        y: 0
    }
}

oPlayer.Update = function() {
    // Input
    if (Engine.Input.Check(Engine.Input.Keys.LEFT) == true && this.InputPrevious != Engine.Input.Keys.RIGHT) {
        this.Direction.x = -1;
        this.Direction.y = 0;
        this.InputPrevious = Engine.Input.Keys.LEFT;
    } else if (Engine.Input.Check(Engine.Input.Keys.RIGHT) == true && this.InputPrevious != Engine.Input.Keys.LEFT) {
        this.Direction.x = 1;
        this.Direction.y = 0;
        this.InputPrevious = Engine.Input.Keys.RIGHT;
    } else if (Engine.Input.Check(Engine.Input.Keys.UP) == true && this.InputPrevious != Engine.Input.Keys.DOWN) {
        this.Direction.x = 0;
        this.Direction.y = -1;
        this.InputPrevious = Engine.Input.Keys.UP;
    } else if (Engine.Input.Check(Engine.Input.Keys.DOWN) == true && this.InputPrevious != Engine.Input.Keys.UP) {
        this.Direction.x = 0;
        this.Direction.y = 1;
        this.InputPrevious = Engine.Input.Keys.DOWN;
    }

    // Movement
    if (Engine.Core.EngineTimer % 5 == 0) {
        this.x += this.Direction.x;
        this.y += this.Direction.y;
        for(var i = 0; i < this.Tail.length; i++) {
            var toFollow = (i > 0) ? this.Tail[i - 1] : this;
            this.Tail[i].x = toFollow.Previous.x;
            this.Tail[i].y = toFollow.Previous.y;
        }

        // Wrapping
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
            this.Score++;
            oFruit.x = Engine.Math.RandomRange(0, (Engine.Core.RenderProperties.Width / 16) - 1);
            oFruit.y = Engine.Math.RandomRange(0, (Engine.Core.RenderProperties.Height / 16) - 1);
            this.Tail.push(
                Engine.Instance.Create("oTail", this.Previous.x, this.Previous.y)
            );
        }

        for(var i = 0; i < this.Tail.length; i++) {
            var oTail = this.Tail[i];
            if (this.x == oTail.x && this.y == oTail.y) {
                alert("You have died!\nYour score was " + this.Score + " point" + "s".repeat(this.Score > 1) + "!");
                location.reload();
            }
        }
    }
}

oPlayer.Render = function() {
    Engine.Render.Color("black");
    Engine.Render.Rectangle(this.x * this.Size.Width, this.y * this.Size.Height, (this.x * this.Size.Width) + this.Size.Width, (this.y * this.Size.Height) + this.Size.Height, false);
    Engine.Render.Text(4, 12, "Score: " + this.Score);
}