oTail = Engine.Object.Create("oTail");
oTail.Create = function() {
    this.Size = {
        Width: 16,
        Height: 16
    }
}

oTail.Render = function() {
    Engine.Render.Color("blue");
    Engine.Render.Rectangle(this.x * this.Size.Width, this.y * this.Size.Height, (this.x * this.Size.Width) + this.Size.Width, (this.y * this.Size.Height) + this.Size.Height, false);
    Engine.Render.Color("black");
}