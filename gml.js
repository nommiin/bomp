/*
    gml.js - GML Alias Functions for bomp!
*/

// Object
function object_create(name) { return Engine.Object.Create(name) }
function object_destroy(name) { return Engine.Object.Destroy(name) }

// Instance
function instance_create(x, y, object) { return Engine.Instance.Create(name, x, y) }
function instance_destroy() { return Engine.Instance.Destroy(this.Name, this.Index) }

// Input
function keyboard_check(key) { return Engine.Input.Check(key) }
function keyboard_check_direct(key) { return Engine.Input.Check(key) }
function keyboard_check_pressed(key) { return Engine.Input.CheckPressed(key) }
function keyboard_check_released(key) { return Engine.Input.CheckReleased(key) }

// Rendering
function draw_line(x1, y1, x2, y2) { return Engine.Render.Line(x1, y1, x2, y2) }
function draw_rectangle(x1, y1, x2, y2, outline) { return Engine.Render.Line(x1, y1, x2, y2, outline) }
function draw_circle(x1, y1, radius, outline) { return Engine.Render.Line(x1, y1, radius, outline) }
function draw_text(x, y, text) { return Engine.Render.Text(x, y, text) }
function draw_set_color(color) { return Engine.Render.Color(color) }
function draw_set_colour(color) { return Engine.Render.Color(color) }
function draw_set_alpha(alpha) { return Engine.Render.Alpha(alpha) }