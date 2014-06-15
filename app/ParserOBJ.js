/*
	Programado por: Anderson Meirelles Freitas e Rafael Will Macedo de Araujo.
	Disciplina: Computação Gráfica (MAC5744).
*/

"use strict";

/*
	Instruções:
		1 - Esta função só lê OBJs exportados com a opção "triangulate faces" do Blender, e com coordenadas de textura e normais.
		2 - Para setar os campos "itemSize" e "numItems" dos buffers, utilize o campo "length" dos arrays fornecidos, e divida pelo número de componentes.
			2.1: Número de componentes dos vértices de posição ".v": 3
			2.2: Número de componentes das coordenadas de textura ".t": 2
			2.3: Número de componentes das normais ".n": 3
			2.4: Número de componentes de índice ".indexes": 1
*/
function loadObj(fileName){
	var request = new XMLHttpRequest();
	request.open("GET", fileName, false);
	request.send(null);
	var text = request.responseText;
	var lines = text.split("\n");

	/* creates the variables */
	var vArr = []; // vertex array
	var nArr = []; // normal array
	var tArr = []; // texture
	var fArr = []; // face array
	var objectsMap = {};
	var objAttributes = {};
	objAttributes.v = [];
	objAttributes.n = [];
	objAttributes.t = [];
	objAttributes.hashIndexes = {};
	objAttributes.indexes = [];
	objAttributes.index = 0;	

	var lastObjName = "";
	for (var i = 0; i < lines.length; i++){
		var line = lines[i].split(" ");
		switch (line[0]){
			case "o":
				// do some processing with the "past" value of lastObjName, before setting lastObjName with the actual object name
				if (lastObjName != ""){
					/* this will be executed only if there are 2 or more objects in the file */
					objectsMap[lastObjName] = objAttributes;
				}
				/* resets the variables */
				vArr = [];
				nArr = [];
				tArr = [];
				objAttributes = {};
				objAttributes.v = [];
				objAttributes.n = [];
				objAttributes.t = [];
				objAttributes.hashIndexes = {};
				objAttributes.indexes = [];
				objAttributes.index = 0;	
				
				lastObjName = line[1];
				break;
			case "v":
				vArr.push(parseFloat(line[1]));
				vArr.push(parseFloat(line[2]));
				vArr.push(parseFloat(line[3]));
				break;
			case "vn":
				nArr.push(parseFloat(line[1]));
				nArr.push(parseFloat(line[2]));
				nArr.push(parseFloat(line[3]));
				break;
			case "vt":
				tArr.push(parseFloat(line[1]));
				tArr.push(parseFloat(line[2]));
				break;
			case "f":
				for(var j = 1; j < line.length; j++){
					/* reuses the repeated faces */
					if (line[j] in objAttributes.hashIndexes){
						objAttributes.indexes.push(parseInt(objAttributes.hashIndexes[line[j]]));
					}
					else{
						var vtn = line[j].split("/"); // splits the face coordinate, store as v/vt/vn
						/* position vertex */
						objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 0]);
						objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 1]);
						objAttributes.v.push(vArr[(parseInt(vtn[0])-1)*3 + 2]);
						
						/* texture vertex */
						objAttributes.t.push(tArr[(parseInt(vtn[1])-1)*2 + 0]);
						objAttributes.t.push(tArr[(parseInt(vtn[1])-1)*2 + 1]);
						
						/* normal vertex */
						objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 0]);
						objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 1]);
						objAttributes.n.push(nArr[(parseInt(vtn[2])-1)*3 + 2]);
						
						objAttributes.hashIndexes[line[j]] = objAttributes.index;
						objAttributes.indexes.push(objAttributes.index);
						objAttributes.index += 1;
					}
				}
				break;
		}
	}
	objectsMap[lastObjName] = objAttributes; // adds the last object in the file
	return objectsMap;
}