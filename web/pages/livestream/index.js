import _ from 'lodash'
// import { decode } from 'base64-arraybuffer'
import soc from '~/plugins/socket.io.js'
// import Worker from '~/canvas.worker.js'

// const vertexShaderSource = `#version 300 es

// // an attribute is an input (in) to a vertex shader.
// // It will receive data from a buffer
// in vec2 a_position;
// in vec2 a_texCoord;

// // Used to pass in the resolution of the canvas
// uniform vec2 u_resolution;

// // Used to pass the texture coordinates to the fragment shader
// out vec2 v_texCoord;

// // all shaders have a main function
// void main() {

//   // convert the position from pixels to 0.0 to 1.0
//   vec2 zeroToOne = a_position / u_resolution;

//   // convert from 0->1 to 0->2
//   vec2 zeroToTwo = zeroToOne * 2.0;

//   // convert from 0->2 to -1->+1 (clipspace)
//   vec2 clipSpace = zeroToTwo - 1.0;

//   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

//   // pass the texCoord to the fragment shader
//   // The GPU will interpolate this value between points.
//   v_texCoord = a_texCoord;
// }
// `
// const fragmentShaderSource = `#version 300 es

// // fragment shaders don't have a default precision so we need
// // to pick one. highp is a good default. It means "high precision"
// precision highp float;

// // our texture
// uniform sampler2D u_image;

// // the texCoords passed in from the vertex shader.
// in vec2 v_texCoord;

// // we need to declare an output for the fragment shader
// out vec4 outColor;

// void main() {
//   outColor = texture(u_image, v_texCoord);
// }
// `
// function render(image, gl, webglUtils) {
//   // Get A WebGL context
//   /** @type {HTMLCanvasElement} */
//   if (!gl) {
//     return
//   }
//   // setup GLSL program
//   const program = webglUtils.createProgramFromSources(gl, [
//     vertexShaderSource,
//     fragmentShaderSource
//   ])
//   // look up where the vertex data needs to go.
//   const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
//   const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord')
//   // lookup uniforms
//   const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
//   const imageLocation = gl.getUniformLocation(program, 'u_image')
//   // Create a vertex array object (attribute state)
//   const vao = gl.createVertexArray()
//   // and make it the one we're currently working with
//   gl.bindVertexArray(vao)
//   // Create a buffer and put a single pixel space rectangle in
//   // it (2 triangles)
//   const positionBuffer = gl.createBuffer()
//   // Turn on the attribute
//   gl.enableVertexAttribArray(positionAttributeLocation)
//   // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
//   // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
//   let size = 2 // 2 components per iteration
//   let type = gl.FLOAT // the data is 32bit floats
//   let normalize = false // don't normalize the data
//   let stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
//   let offset = 0 // start at the beginning of the buffer
//   gl.vertexAttribPointer(
//     positionAttributeLocation,
//     size,
//     type,
//     normalize,
//     stride,
//     offset
//   )
//   // provide texture coordinates for the rectangle.
//   const texCoordBuffer = gl.createBuffer()
//   gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array([
//       0.0,
//       0.0,
//       1.0,
//       0.0,
//       0.0,
//       1.0,
//       0.0,
//       1.0,
//       1.0,
//       0.0,
//       1.0,
//       1.0
//     ]),
//     gl.STATIC_DRAW
//   )
//   // Turn on the attribute
//   gl.enableVertexAttribArray(texCoordAttributeLocation)
//   // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
//   size = 2 // 2 components per iteration
//   type = gl.FLOAT // the data is 32bit floats
//   normalize = false // don't normalize the data
//   stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
//   offset = 0 // start at the beginning of the buffer
//   gl.vertexAttribPointer(
//     texCoordAttributeLocation,
//     size,
//     type,
//     normalize,
//     stride,
//     offset
//   )
//   // Create a texture.
//   const texture = gl.createTexture()
//   // make unit 0 the active texture uint
//   // (ie, the unit all other texture commands will affect
//   gl.activeTexture(gl.TEXTURE0 + 0)
//   // Bind it to texture unit 0' 2D bind point
//   gl.bindTexture(gl.TEXTURE_2D, texture)
//   // Set the parameters so we don't need mips and so we're not filtering
//   // and we don't repeat at the edges
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
//   // Upload the image into the texture.
//   const mipLevel = 0 // the largest mip
//   const internalFormat = gl.RGBA // format we want in the texture
//   const srcFormat = gl.RGBA // format of data we are supplying
//   const srcType = gl.UNSIGNED_BYTE // type of data we are supplying
//   gl.texImage2D(
//     gl.TEXTURE_2D,
//     mipLevel,
//     internalFormat,
//     srcFormat,
//     srcType,
//     image
//   )
//   webglUtils.resizeCanvasToDisplaySize(gl.canvas)
//   // Tell WebGL how to convert from clip space to pixels
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
//   // Clear the canvas
//   gl.clearColor(0, 0, 0, 0)
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
//   // Tell it to use our program (pair of shaders)
//   gl.useProgram(program)
//   // Bind the attribute/buffer set we want.
//   gl.bindVertexArray(vao)
//   // Pass in the canvas resolution so we can convert from
//   // pixels to clipspace in the shader
//   gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
//   // Tell the shader to get the texture from texture unit 0
//   gl.uniform1i(imageLocation, 0)
//   // Bind the position buffer so gl.bufferData that will be called
//   // in setRectangle puts data in the position buffer
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
//   // Set a rectangle the same size as the image.
//   setRectangle(gl, 0, 0, image.width, image.height)
//   // Draw the rectangle.
//   const primitiveType = gl.TRIANGLES
//   offset = 0
//   const count = 6
//   gl.drawArrays(primitiveType, offset, count)
// }
// function setRectangle(gl, x, y, width, height) {
//   const x1 = x
//   const x2 = x + width
//   const y1 = y
//   const y2 = y + height
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
//     gl.STATIC_DRAW
//   )
// }

export default {
  async middleware({ store }) {
    await store.dispatch('live/getcams', { input: null })
  },
  data() {
    return {
      windowsinrow: 5,
      drawer: false,
      searchString: null,
      searchOverlay: false,
      canvas: {},
      ctx: {},
      image: {},
      ws: {},
      test: {
        queue: []
      },
      webglUtils: null
    }
  },
  computed: {
    windowwidth() {
      return 100 / this.windowsinrow
    },
    listcam() {
      const lscam = this.$store.state.live.listcam
      const sls = this.selectedcam.map((item) => {
        return item.id
      })
      return lscam.filter((item) => {
        if (!sls.includes(item.id)) return item
      })
    },
    selectedcam: {
      get() {
        return this.$store.state.live.selectedcam
      },
      async set(value) {
        await this.$store.dispatch('live/sortselect', value)
      }
    }
  },
  methods: {
    async handleSelectcam(item) {
      await this.$store.dispatch('live/selectcam', item)
    },
    handleh264() {},
    async handlePlay(cam) {
      const ws = await this.$axios.$get('live/play', {
        params: {
          id: cam.id
        }
      })
      const canvas = document.getElementById('canvas' + cam.id)
      const gl = canvas.getContext('2d', { alpha: false })
      // const glutils = this.webglUtils
      const image = new Image()
      const wsConsume = new WebSocket(ws)
      wsConsume.onmessage = function(r) {
        const message = r.data
        const receiveMsg = JSON.parse(message)
        const ackMsg = { messageId: receiveMsg.messageId }
        wsConsume.send(JSON.stringify(ackMsg))
        image.onload = function() {
          canvas.width = this.naturalWidth
          canvas.height = this.naturalHeight
          gl.drawImage(image, 0, 0)
        }
        image.src = 'data:image/jpg;base64, ' + receiveMsg.payload
      }
      // const worker = new Worker()
      // worker.postMessage({ ws })
      // worker.onmessage = function({ data }) {
      //   image.onload = function() {
      //     canvas.width = this.naturalWidth
      //     canvas.height = this.naturalHeight
      //     gl.drawImage(image, 0, 0)
      //     // render(image, gl, glutils)
      //   }
      //   image.src = 'data:image/jpg;base64, ' + data
      // }
    },
    async handleStop(cam) {
      await this.$axios.$get('live/stop', {
        params: {
          id: cam.id
        }
      })
    },
    async handleRemove(cam) {
      await this.handleStop(cam)
      await this.$store.dispatch('live/removecam', cam)
    },
    async sayt() {
      this.searchOverlay = true
      await this.$store.dispatch('live/getcams', { input: this.searchString })
      this.searchOverlay = false
    },
    throttlesearch: _.throttle(function(e) {
      this.sayt()
    }, 500),
    debouncesearch: _.debounce(function(e) {
      this.sayt()
    }, 500)
  },
  mounted() {
    this.webglUtils = window.webglUtils
    const self = this
    soc.socket.on('livestream', function(data) {
      if (self.test.buffer.updating || self.test.queue.length > 0) {
        self.test.queue.push(data.buffer)
      } else {
        self.test.buffer.appendBuffer(data.buffer)
      }
      // const canvas = self.canvas[data.id]
      // const ctx = self.ctx[data.id]
      // const image = self.image[data.id]
      // image.onload = function() {
      //   canvas.width = this.naturalWidth
      //   canvas.height = this.naturalHeight
      //   ctx.drawImage(image, 0, 0)
      // }
      // image.src = 'data:image/jpg;base64, ' + data.buffer
    })
    soc.socket.on('letbeat', function() {
      soc.socket.emit('clientbeat')
      setInterval(() => {
        soc.socket.emit('clientbeat')
      }, 4500)
    })
  }
}
