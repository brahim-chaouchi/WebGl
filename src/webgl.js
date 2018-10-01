function render(gl,scene) {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(scene.program);
	gl.bindBuffer(gl.ARRAY_BUFFER, scene.object.vertexBuffer);
	gl.drawArrays(
		scene.object.primitiveType, 0,
		scene.object.vertexCount);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.useProgram(null);
	requestAnimationFrame(function() {
		render(gl,scene);
	});
}

function createProgram(gl, shaderSpecs) {
	var program = gl.createProgram();
	for ( var i = 0 ; i < shaderSpecs.length ; i++ ) {
	var spec = shaderSpecs[i];
	var shader = gl.createShader(spec.type);
	var source = document.getElementById(spec.container).text;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw gl.getShaderInfoLog(shader);
	}
	gl.attachShader(program, shader);
	gl.deleteShader(shader);
	}
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	throw gl.getProgramInfoLog(program);
	}
	return program;
}

export function init() {
  var surface = document.getElementById('rendering-surface');
  var gl = surface.getContext('webgl');
  gl.viewport(0,0,surface.width,surface.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var program = createProgram(
	gl,
	[{container: 'vertex-shader', type: gl.VERTEX_SHADER},
	 {container: 'fragment-shader', type: gl.FRAGMENT_SHADER}]
  );

  var squareVertices = [
	+0.75, +0.75,
	-0.75, +0.75,
	+0.75, -0.75,
	-0.75, -0.75
  ];

  gl.useProgram(program);

  var square = {
	vertexCount: 4,
	primitiveType: gl.TRIANGLE_STRIP
  };

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  program.positionAttribute = gl.getAttribLocation(program, 'pos');
  gl.enableVertexAttribArray(program.positionAttribute);
  gl.vertexAttribPointer(
	program.positionAttribute, 2, gl.FLOAT, false, 0, 0
  );
  gl.bufferData(
	gl.ARRAY_BUFFER,
	new Float32Array(squareVertices),
	gl.STATIC_DRAW
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.useProgram(null);
	
  square.vertexBuffer = vertexBuffer;

  var scene = {
	program: program,
	object: square,
  };

  requestAnimationFrame(function() {
	render(gl, scene);
  });
}
