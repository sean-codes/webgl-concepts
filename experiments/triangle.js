// init
var gl = canvas.getContext('webgl')

// shaders
var sourceV = `
   attribute vec2 pos;

   void main() {
      gl_Position = vec4(pos, 0, 1);
   }
`

var sourceF = `
   precision mediump float;

   void main() {
      gl_FragColor = vec4(1.0, 0.1, 0.1, 1);
   }
`

var shaderV = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(shaderV, sourceV)
gl.compileShader(shaderV)
!gl.getShaderParameter(shaderV, gl.COMPILE_STATUS)
   && console.log(gl.getShaderInfoLog(shaderV))


var shaderF = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(shaderF, sourceF)
gl.compileShader(shaderF)
!gl.getShaderParameter(shaderF, gl.COMPILE_STATUS)
   && console.log(gl.getShaderInfoLog(shaderF))

// program
var program = gl.createProgram()
gl.attachShader(program, shaderV)
gl.attachShader(program, shaderF)
gl.linkProgram(program)
gl.useProgram(program)

// buffer pos
var verticesPos = new Float32Array([
   -0.5, 0.5,
   0.5, 0.5,
   0.5, -0.5,
])

var bufferPos = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos)
gl.bufferData(gl.ARRAY_BUFFER, verticesPos, gl.STATIC_DRAW)

// attrib
var locPos = gl.getAttribLocation(program, 'pos')
gl.enableVertexAttribArray(locPos)
// hint: loc, components, type, normalize, stride (0 = match), offset
gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0)

// draw
gl.drawArrays(gl.TRIANGLES, 0, 3)
