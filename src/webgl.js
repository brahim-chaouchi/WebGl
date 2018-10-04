function CercleMap(formeBrut, pointProj1, pointProj2, pointProj3, ligne12, ligne23, ligne31, depth){
	if(depth){
		let point12=[(pointProj1[0]+pointProj2[0])/2, (pointProj1[1]+pointProj2[1])/2];
		let pointNorme12=Math.sqrt(Math.pow(point12[0] ,2)+Math.pow(point12[1] ,2));
		let pointProj12=[point12[0]/pointNorme12, point12[1]/pointNorme12];
		if(!ligne12){
			pointProj12=point12;
		}
		let point23=[(pointProj2[0]+pointProj3[0])/2, (pointProj2[1]+pointProj3[1])/2];
		let pointNorme23=Math.sqrt(Math.pow(point23[0] ,2)+Math.pow(point23[1] ,2));
		let pointProj23=[point23[0]/pointNorme23, point23[1]/pointNorme23];
		if(!ligne23){
			pointProj23=point23;
		}
		let point31=[(pointProj3[0]+pointProj1[0])/2, (pointProj3[1]+pointProj1[1])/2];
		let pointNorme31=Math.sqrt(Math.pow(point31[0] ,2)+Math.pow(point31[1] ,2));
		let pointProj31=[point31[0]/pointNorme31, point31[1]/pointNorme31];
		if(!ligne31){
			pointProj31=point31;
		}
		CercleMap(formeBrut, pointProj1, pointProj12, pointProj31, ligne12, false, ligne31, depth-1);
		CercleMap(formeBrut, pointProj12, pointProj2, pointProj23, ligne12, ligne23, false, depth-1);
		CercleMap(formeBrut, pointProj31, pointProj23, pointProj3, false, ligne23, ligne31, depth-1);
	}
	else{
		formeBrut.push(pointProj1[0], pointProj1[1], 1.0, 1.0, 1.0);
		formeBrut.push(pointProj2[0], pointProj2[1], 1.0, 1.0, 1.0);
		formeBrut.push(pointProj3[0], pointProj3[1], 1.0, 1.0, 1.0);
	}
}
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
	//let point1=[0.0, 0.5];
	let point1=[Math.cos(Math.PI/2), Math.sin(Math.PI/2)];
	let pointNorme1=Math.sqrt(Math.pow(point1[0] ,2)+Math.pow(point1[1] ,2));
	let pointProj1=[point1[0]/pointNorme1, point1[1]/pointNorme1];
	//let point2=[-0.5, -0.5];
	let point2=[Math.cos((Math.PI*2/3)+(Math.PI/2)), Math.sin((Math.PI*2/3)+(Math.PI/2))];
	let pointNorme2=Math.sqrt(Math.pow(point2[0] ,2)+Math.pow(point2[1] ,2));
	let pointProj2=[point2[0]/pointNorme2, point2[1]/pointNorme2];
	//let point3=[0.5, -0.5];
	let point3=[Math.cos((Math.PI*4/3)+(Math.PI/2)), Math.sin((Math.PI*4/3)+(Math.PI/2))];
	let pointNorme3=Math.sqrt(Math.pow(point3[0] ,2)+Math.pow(point3[1] ,2));
	let pointProj3=[point3[0]/pointNorme3, point3[1]/pointNorme3];
	let formeBrut=[];
	CercleMap(formeBrut, pointProj1, pointProj2, pointProj3, true, true, true, 5);
	/*let formeBrut=[
		//x, y, r, v, b
		pointProj1[0], pointProj1[1], 1.0, 0.0, 0.0,
		pointProj2[0], pointProj2[1], 0.0, 1.0, 0.0,
		pointProj3[0], pointProj3[1], 0.0, 0.0, 1.0,
		0.0, 0.0, 0.0, 0.0, 0.0,
		0.5, 0.5, 1.0, 1.0, 1.0,
	];*/
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
	//active le programme (ici, et pas apres, ni avant)
	gl.useProgram(program);
	//matrices
	let worldLoc=gl.getUniformLocation(program, 'world');
	let worldMat=new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	]);
	gl.uniformMatrix4fv(
		worldLoc,
		gl.FALSE,//transposee
		worldMat
	);
	let viewLoc=gl.getUniformLocation(program, 'view');
	let viewMat=new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	]);
	gl.uniformMatrix4fv(
		viewLoc,
		gl.FALSE,//transposee
		viewMat
	);
	let projLoc=gl.getUniformLocation(program, 'proj');
	let projMat=new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	]);
	gl.uniformMatrix4fv(
		projLoc,
		gl.FALSE,//transposee
		projMat
	);
	//dessine
	gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(
		gl.TRIANGLES,//TRIANGLES,LINES,POINTS...
		0,//skip
		formeBrut.length/5//nb to use
	);
	/*gl.drawArrays(
		gl.LINES,
		3,//skip
		2//nb to use
	);
	gl.drawArrays(
		gl.POINTS,
		0,//skip
		5//nb to use
	);*/
}
