'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var cameraSpline = [];


var gui = new dat.GUI();

camera.position.x = 146;
camera.position.y = -12;
camera.position.z = 14;
// camera.lookAt(new THREE.Vector3(0,0,-10));

gui.add(camera.position, 'x', -2000, 2000).listen();
gui.add(camera.position, 'y', -2000, 2000).listen();
gui.add(camera.position, 'z', -2000, 2000).listen();

var intensity = 2.5;
var distance = 100;
var decay = 2.0;

var intensity = 3.5;
var distance = 300;
var decay = 2.0;
var c1 = 0xff0040;;
var sphere = new THREE.SphereBufferGeometry( 0.25, 16, 8 );
var light1 = new THREE.PointLight( c1, intensity, distance, decay );
light1.castShadow = true;
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
camera.add( light1 );

//Set up shadow properties for the light
light1.shadow.mapSize.width = 512;  // default
light1.shadow.mapSize.height = 512; // default
light1.shadow.camera.near = 0.5;       // default
light1.shadow.camera.far = 500      // default

scene.add(camera);

var cameraPosition = 0;
var cameraLerp = 0.5;

// lerp(0, 1, i * 0.5)

function lerp(a, b, n) {
	return (1 - n) * a + n * b;
}


var animate = function () {
	requestAnimationFrame( animate );
	if(cameraSpline.length > 0) {
		moveCamera();

		var current = [cameraSpline[cameraPosition].x, cameraSpline[cameraPosition].y, cameraSpline[cameraPosition].z];
		var next = [cameraSpline[cameraPosition + 1].x, cameraSpline[cameraPosition + 1].y, cameraSpline[cameraPosition + 1].z];

		var cameraPos = [lerp(current[0], next[0], cameraLerp), lerp(current[1], next[1], cameraLerp), lerp(current[2], next[2], cameraLerp)];
		var cameraLook = new THREE.Vector3(lerp(current[0], next[0], cameraLerp + 0.5), lerp(current[1], next[1], cameraLerp + 0.5), lerp(current[2], next[2], cameraLerp + 0.5));

		cameraLerp += 0.5;

		camera.position.x = cameraPos[0];
		camera.position.y = cameraPos[1];
		camera.position.z = cameraPos[2];

		camera.updateProjectionMatrix();

		camera.lookAt(cameraLook);

		if (cameraLerp >= 1) {
			cameraPosition++;
			cameraLerp = 0.5;
		}
		if(cameraPosition === cameraSpline.length - 1) {
			cameraPosition = 0;
			cameraLerp = 0.5;
		}

	}
	renderer.render( scene, camera );
};

// BTN MOVE
// document.getElementById('btn-move').onclick = function() {
//
// };


function moveCamera() {

	// if(!TweenMax.isTweening(camera.position)) {
	// 	if(cameraPosition >= cameraSpline.length) {
	// 		cameraPosition = 0;
	// 	}
	// 	TweenMax.to(camera.position, 0.5, {
	// 		x: cameraSpline[cameraPosition].x,
	// 		y: cameraSpline[cameraPosition].y,
	// 		z: cameraSpline[cameraPosition].z,
	// 		onUpdate:function () {
	//       camera.updateProjectionMatrix();
	//			 camera.lookAt(new THREE.Vector3(0,0,-10));
	//   	},
	// 		ease: false
	// 	});
	// 	cameraPosition++;
	// }

}

// load obj room
var loader = new THREE.OBJLoader();

loader.load( '/models/slender_room.obj', function ( object ) {
	scene.add(object);
}, function ( xhr ) {
	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded room' );
}, function ( error ) {
	console.log( 'An error happened' );
});

// load dae spline
var cLoader = new THREE.ColladaLoader();
cLoader.load( '/models/spline.dae', function ( collada ) {
	var dae = collada.scene;
  var material = new THREE.MeshBasicMaterial({color: '#cccccc', wireframe: true});
  scene.add(dae);

	var data = [];
	var posAr = new Float32Array(dae.children[0].geometry.attributes.position.array);

	for (let i = 0; i < posAr.length; ){
		var pos = new THREE.Vector3(posAr[i] * 6, posAr[i + 2], posAr[i + 1] * 6);
	 	data.push(pos);
		console.log(pos);
		i += 3;
	}
	dae.children[0].material = material;
	cameraSpline = data;

});

animate();
