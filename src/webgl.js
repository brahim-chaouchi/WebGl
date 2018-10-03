export function init() {
	//initialise le canvas
	let surface = document.getElementById('rendering-surface');
	let gl = surface.getContext('webgl');
	gl.viewport(0,0,surface.width,surface.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	//initialise vertex shader
	let vertexText=document.getElementById('vertex-shader').text;
	let vertexShader=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexText);
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		throw "Erreur : Vertex compilation";
	}
	//initialise fragment shader
	let fragmentText=document.getElementById('fragment-shader').text;
	let fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentText);
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		throw "Erreur : Fragment compilation";
	}
	//attache les shaders
	let program=gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		throw "Erreur : link";
	}
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		throw "Erreur : validation";
	}
	//cree les formes
	//tableau de points
	let formeBrut=[
		//x, y, r, v, b
		0.0, 0.5, 1.0, 0.0, 0.0,
		-0.5,-0.5, 0.0, 1.0, 0.0,
		0.5, -0.5, 0.0, 0.0, 1.0,
	];
	let formeBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, formeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formeBrut), gl.STATIC_DRAW);
	//attrib dans vertex-shader
	//attribute pos
	let attribLocation1=gl.getAttribLocation(program, 'pos');
	gl.vertexAttribPointer(
		attribLocation1,//attribute location
		2,//elements per attribute
		gl.FLOAT,//type
		gl.FALSE,//is data normalised
		5*Float32Array.BYTES_PER_ELEMENT,//size of individual vertex
		0*Float32Array.BYTES_PER_ELEMENT //offset of attribute in vertex
	);
	gl.enableVertexAttribArray(attribLocation1);
	//attribute vertColor
	let attribLocation2=gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		attribLocation2,//attribute location
		3,//elements per attribute
		gl.FLOAT,//type
		gl.FALSE,//is data normalised
		5*Float32Array.BYTES_PER_ELEMENT,//size of individual vertex
		2*Float32Array.BYTES_PER_ELEMENT //offset of attribute in vertex
	);
	gl.enableVertexAttribArray(attribLocation2);
	//dessine
	gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
	gl.useProgram(program);
	gl.drawArrays(
		gl.TRIANGLES,
		0,//skip
		3//nb to use
	);
}
