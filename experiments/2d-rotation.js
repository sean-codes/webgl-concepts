// settings
var settings = new Settings()
settings.add({ name: 'x', min: 0, max: 500, value: 0 })
settings.add({ name: 'y', min: 0, max: 225, value: 0 })
settings.add({ name: 'rotation', min: 0, max: 360, value: 0 })
settings.onChange = function(setting, settings) {
   render()
}


// code
var gl = canvas.getContext('webgl')

// setup shaders
var sourceV = `
  attribute vec2 a_pos;

  uniform vec2 u_resolution;
  uniform vec2 u_translation;
  uniform vec2 u_rotation;

  void main() {
    // cs-sc
    vec2 rotated_pos = vec2(
      u_rotation.x * a_pos.x - u_rotation.y * a_pos.y,
      u_rotation.y * a_pos.x + u_rotation.x * a_pos.y
    );

    vec2 translated_pos = rotated_pos + u_translation;
    vec2 zeroToOne = translated_pos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`

var sourceF = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(0.3, 0.1, 1, 1);
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
gl.useProgram(program)

// vertices (from webglfundamentals.org)
var verticesAPos = new Float32Array([
    // left column
    0, 0,
    30, 0,
    0, 150,
    0, 150,
    30, 0,
    30, 150,

    // top rung
    30, 0,
    100, 0,
    30, 30,
    30, 30,
    100, 0,
    100, 30,

    // middle rung
    30, 60,
    67, 60,
    30, 90,
    30, 90,
    67, 60,
    67, 90,
])

// buffer
var bufferAPos = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferAPos)
gl.bufferData(gl.ARRAY_BUFFER, verticesAPos, gl.STATIC_DRAW)

// attrib
var locAPos = gl.getAttribLocation(program, 'a_pos')
gl.enableVertexAttribArray(locAPos)
gl.vertexAttribPointer(locAPos, 2, gl.FLOAT, false, 0, 0)

// uniform
var locUResolution = gl.getUniformLocation(program, 'u_resolution')
var locUTranslation = gl.getUniformLocation(program, 'u_translation')
var locURotation = gl.getUniformLocation(program, 'u_rotation')
gl.uniform2f(locUResolution, gl.canvas.width, gl.canvas.height)

render()

function render() {
  var x = settings.getValue('x')
  var y = settings.getValue('y')
  var rotation = settings.getValue('rotation')

  var rx = Math.cos(rotation * Math.PI / 180)
  var ry = Math.sin(rotation * Math.PI / 180)

  gl.uniform2f(locUTranslation, x, y)
  gl.uniform2f(locURotation, rx, ry)

  gl.drawArrays(gl.TRIANGLES, 0, verticesAPos.length/2)
}
