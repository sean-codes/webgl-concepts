var image = document.createElement('img')
image.src = './assets/pixelart_cat.png'
image.onload = function() {
   var {
      gl,
      program,
      loc,
      texture
   } = setup()

   var cats = []
   for ( var i = 0; i < 20; i++) {
      cats.push({
         texture: texture.cat,
         x: gl.canvas.width/2,
         y: gl.canvas.height/2,
         xSpeed: Math.random() * 3 - 1.5,
         ySpeed: Math.random() * 3 - 1.5,
         scale: Math.random() * 5 + 1
      })
   }

   render()

   function render() {
      requestAnimationFrame(render)

      for (var cat of cats) {
         drawImage(
            cat.texture,
            cat.x,
            cat.y,
            cat.scale
         )

         cat.x += cat.xSpeed
         cat.y += cat.ySpeed

         if (cat.x + cat.texture.image.width * cat.scale > gl.canvas.width || cat.x < 0) cat.xSpeed *= -1
         if (cat.y + cat.texture.image.height * cat.scale > gl.canvas.height || cat.y < 0) cat.ySpeed *= -1
      }
   }

   function drawImage(texture, x, y, scale) {
      gl.bindTexture(gl.TEXTURE_2D, texture.id)

      var scaleWidth = texture.width / gl.canvas.width * scale
      var scaleHeight = texture.height / gl.canvas.height * scale
      var startX = 1/gl.canvas.width * x
      var startY = 1/gl.canvas.height * y

      gl.uniform4f(loc.u_texscale, startX, startY, scaleWidth, scaleHeight)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
   }

   function setup() {
      // init
      var gl = canvas.getContext('webgl')
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      // shaders
      var sourceV = `
         attribute vec2 a_pos;

         varying vec2 v_texpos;

         uniform vec4 u_texscale;

         void main() {
            v_texpos = a_pos;
            gl_Position = vec4(
               (u_texscale[0] + a_pos.x * u_texscale[2]) * 2.0 - 1.0,
               (u_texscale[1] + a_pos.y * u_texscale[3]) * -2.0 + 1.0,
               0,
               1
            );
         }
      `

      var sourceF = `
         precision mediump float;

         varying vec2 v_texpos;

         uniform sampler2D texture;

         void main() {
            gl_FragColor = texture2D(texture, v_texpos);
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

      // attribs
      var locAPos = gl.getAttribLocation(program, 'a_pos')
      var locTexScale = gl.getUniformLocation(program, 'u_texscale')

      gl.enableVertexAttribArray(locAPos)

      var bufferAPos = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferAPos)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         0.0, 0.0,
         1.0, 0.0,
         1.0, 1.0,
         1.0, 1.0,
         0.0, 1.0,
         0.0, 0.0,
      ]), gl.STATIC_DRAW)

      gl.vertexAttribPointer(locAPos, 2, gl.FLOAT, false, 0, 0)

      // textures
      var textureCat = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, textureCat)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

      return {
         gl: gl,
         program: program,
         texture: {
            cat: {
               id: textureCat,
               image: image,
               width: image.width,
               height: image.height
            }
         },
         buffer: {
            a_pos: bufferAPos
         },
         loc: {
            a_pos: locAPos,
            u_texscale: locTexScale,
         }
      }
   }
}
