oFruit = Engine.Object.Create("oFruit");
oFruit.Create = function() {
    this.Size = {
        Width: 16,
        Height: 16
    }
}

oFruit.Render = function() {
    Engine.Render.Color("red");
    Engine.Render.Rectangle(this.x * this.Size.Width, this.y * this.Size.Height, (this.x * this.Size.Width) + this.Size.Width, (this.y * this.Size.Height) + this.Size.Height, false);
    Engine.Render.Color("black");
}