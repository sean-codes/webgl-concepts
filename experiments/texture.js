var image = document.createElement('img')
image.src = './assets/pixelart_cat.png'
image.onload = function() {
   console.log('loaded')
   // init
   var gl = canvas.getContext('webgl')
   gl.enable(gl.BLEND)
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

   // shaders
   var sourceV = `
      attribute vec2 pos;

      varying vec2 texpos;

      void main() {
         texpos = pos;

         gl_Position = vec4(
            pos.x * 2.0 - 1.0,
            pos.y * -2.0 + 1.0,
            0,
            1
         );
      }
   `

   var sourceF = `
      precision mediump float;

      varying vec2 texpos;

      uniform sampler2D texture;

      void main() {
         gl_FragColor = texture2D(texture, texpos);
      }
   `

   var shaderV = gl.createShader(gl.VERTEX_SHADER)
   gl.shaderSource(shaderV, sourceV)
   gl.compileShader(shaderV)
   !gl.getShaderParameter(shaderV, gl.COMPILE_STATUS)
      && console.error(gl.getShaderInfoLog(shaderV))

   var shaderF = gl.createShader(gl.FRAGMENT_SHADER)
   gl.shaderSource(shaderF, sourceF)
   gl.compileShader(shaderF)
   !gl.getShaderParameter(shaderF, gl.COMPILE_STATUS)
      && console.error(gl.getShaderInfoLog(shaderF))

   // program
   var program = gl.createProgram()
   gl.attachShader(program, shaderV)
   gl.attachShader(program, shaderF)
   gl.linkProgram(program)
   gl.useProgram(program)

   // buffer data
   var verticesPos = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
   ])

   var bufferPos = gl.createBuffer()
   gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos)
   gl.bufferData(gl.ARRAY_BUFFER, verticesPos, gl.STATIC_DRAW)

   // texture
   var texture = gl.createTexture()
   gl.bindTexture(gl.TEXTURE_2D, texture)
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

   // setup attrib
   var locPos = gl.getAttribLocation(program, 'pos')
   gl.enableVertexAttribArray(locPos)
   gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0)

   // draw!
   gl.drawArrays(gl.TRIANGLES, 0, 6)
}
