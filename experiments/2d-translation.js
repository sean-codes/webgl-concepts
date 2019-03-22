var gl = canvas.getContext('webgl')

// shaders
var sourceV = `
   attribute vec2 a_pos;

   uniform vec2 u_size;
   uniform vec2 u_pos;

   void main() {
      gl_Position = vec4(
         (u_pos.x + a_pos.x * u_size.x) * 2.0 - 1.0,
         (u_pos.y + a_pos.y * u_size.y) * -2.0 + 1.0,
         0,
         1
      );
   }
`

var sourceF = `
   precision mediump float;

   void main() {
      gl_FragColor = vec4(0.7, 0.2, 0.2, 1);
   }
`

var shaderV = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(shaderV, sourceV)
gl.compileShader(shaderV)
if (!gl.getShaderParameter(shaderV, gl.COMPILE_STATUS))
   console.log(gl.getShaderInfoLog(shaderV))

var shaderF = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(shaderF, sourceF)
gl.compileShader(shaderF)
if (!gl.getShaderParameter(shaderF, gl.COMPILE_STATUS))
   console.log(gl.getShaderInfoLog(shaderF))

// program
var program = gl.createProgram()
gl.attachShader(program, shaderV)
gl.attachShader(program, shaderF)
gl.linkProgram(program)
if (!gl.getProgramParameter(program, gl.LINK_STATUS))
   console.log(gl.getProgramInfoLog(program))

gl.useProgram(program)

// vertices
var verticesRectangle = new Float32Array([
   0.0, 0.0,
   1.0, 0.0,
   1.0, 1.0,
   1.0, 1.0,
   0.0, 1.0,
   0.0, 0.0
])

// buffer
var bufferRectangle = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferRectangle)
gl.bufferData(gl.ARRAY_BUFFER, verticesRectangle, gl.STATIC_DRAW)

// attributes / uniforms
var locAPos = gl.getAttribLocation(program, 'a_pos')
var locUPos = gl.getUniformLocation(program, 'u_pos')
var locUSize = gl.getUniformLocation(program, 'u_size')

gl.enableVertexAttribArray(locAPos)
gl.vertexAttribPointer(locAPos, 2, gl.FLOAT, false, 0, 0)

// draw
function fillRect(x, y, width, height) {
   gl.uniform2f(locUPos, x / canvas.width, y / canvas.height);
   gl.uniform2f(locUSize, width / canvas.width, height / canvas.height);

   gl.drawArrays(gl.TRIANGLES, 0, 6)
}


var settings = new Settings()
settings.add({ name: 'x', min: 0, max: 500, value: 0 })
settings.add({ name: 'y', min: 0, max: 225, value: 0 })
settings.add({ name: 'width', min: 10, max: 200, value: 100 })
settings.add({ name: 'height', min: 10, max: 200, value: 100 })
settings.onChange = function(setting, settings) {
   fillRect(
      Number(settings.x.value),
      Number(settings.y.value),
      Number(settings.width.value),
      Number(settings.height.value)
   )
}

fillRect(0, 0, 100, 100)
