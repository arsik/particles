'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// create the particle variables
var particleCount = 0,
    maxParticlesInMesh = 3000,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1
    });


// create the particle system
var particleSystem = undefined;


var gui = new dat.GUI();

camera.position.x = 0;
camera.position.y = 500;
camera.position.z = 500;
camera.lookAt(new THREE.Vector3(0,0,-10));

gui.add(camera.position, 'x', -2000, 2000).listen();
gui.add(camera.position, 'y', -2000, 2000).listen();
gui.add(camera.position, 'z', -2000, 2000).listen();


var animate = function () {
	requestAnimationFrame( animate );

  if(particleSystem !== undefined) {

    particleSystem.rotation.x = -90;
    particleSystem.rotation.z += 0.01;

    particleSystem.geometry.verticesNeedUpdate = true;
  }

	renderer.render( scene, camera );
};

// BTN MOVE
document.getElementById('btn-move').onclick = function() {

  for(var pCount = 0; pCount < particleCount; pCount++) {

    var particle = particles.vertices[pCount];
    if (particle.endpoint.x !== 0 && particle.endpoint.y !== 0 && particle.endpoint.z !== 0 ) {

      var scale = 10;
      var endX = particle.endpoint.x * scale;
      var endY = particle.endpoint.y * scale;
      var endZ = particle.endpoint.z * scale;

      TweenMax.to(particle, 2.0, {x: endX, y: endY, z: endZ, ease: Expo.easeInOut});
    }

  }

};

// // instantiate a loader
var loader = new THREE.OBJLoader();

loader.load( '/models/cars/Audi_A4.obj', function ( object ) {

  object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh )
    {
      console.log('mesh');

      var randomPointPositions = THREE.GeometryUtils.randomPointsInBufferGeometry( child.geometry, maxParticlesInMesh );
      for( var i = 0; i < randomPointPositions.length; i++ )
      {
        var randX = Math.random() * 10000 - 5000;
        var randY = Math.random() * 10000 - 5000;
        var randZ = Math.random() * 10000 - 5000;
        var particle = new THREE.Vector3(randX, randY, randZ);
        particle.endpoint = new THREE.Vector3(randomPointPositions[i].x, randomPointPositions[i].y, randomPointPositions[i].z);
        particles.vertices.push(particle);

        particleCount++;
      }
    }

	});

  console.log('particles: ' + particleCount);

  particleSystem = new THREE.Points(particles, pMaterial);
  scene.add(particleSystem);

},
function ( xhr ) {
	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded car' );
},
function ( error ) {
	console.log( 'An error happened' );
});



animate();
