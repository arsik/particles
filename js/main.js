var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// create the particle variables
var particleCount = 1000,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1
    });

// create the particle system
var particleSystem = new THREE.Points(
    particles,
    pMaterial);


var gui = new dat.GUI();

camera.position.x = 0;
camera.position.y = 100;
camera.position.z = 2000;

gui.add(camera.position, 'x', -2000, 2000).listen();
gui.add(camera.position, 'y', -2000, 2000).listen();
gui.add(camera.position, 'z', -2000, 2000).listen();

var cube;
//
// var light = new THREE.PointLight( 0xffffff, 3, 3000 );
// light.position.set( 10, 2000, 10 );
// scene.add( light );
//
// var light = new THREE.AmbientLight( 0x404040 );
// scene.add( light );

var animate = function () {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
};

// // instantiate a loader
var loader = new THREE.OBJLoader();

loader.load( '/models/cube.obj', function ( object ) {
	object.position.y = 440;
	object.position.z = -200; 
	object.position.x = 610;
  object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh ) {

      // console.log (child.geometry);

      var randomPointPositions = THREE.GeometryUtils.randomPointsInBufferGeometry( child.geometry, particleCount  );

      for( var i = 0; i < randomPointPositions.length; i++ ){
				particle = new THREE.Vector3(randomPointPositions[i].x, randomPointPositions[i].y, randomPointPositions[i].z);
			  particles.vertices.push(particle);
      }

			console.log(particleSystem);
			scene.add(particleSystem);
    }
	});
	// cube = object;
	// scene.add( cube );
},
function ( xhr ) {
	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded car' );
},
function ( error ) {
	console.log( 'An error happened' );
});



animate();
