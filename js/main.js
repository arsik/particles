var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// create the particle variables
var particleCount = 100000,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1
    });

for( var i = 0; i < particleCount; i++ ){
  var randX = Math.random() * 10000 - 5000;
  var randY = Math.random() * 10000 - 5000;
  var randZ = Math.random() * 10000 - 5000;
  particle = new THREE.Vector3(randX, randY, randZ);
  particle.endpoint = new THREE.Vector3(0, 0, 0);
  particles.vertices.push(particle);
}

// create the particle system
var particleSystem = new THREE.Points(
    particles,
    pMaterial);

scene.add(particleSystem);


var gui = new dat.GUI();

camera.position.x = 0;
camera.position.y = 100;
camera.position.z = 2000;

gui.add(camera.position, 'x', -2000, 2000).listen();
gui.add(camera.position, 'y', -2000, 2000).listen();
gui.add(camera.position, 'z', -2000, 2000).listen();

//
// var light = new THREE.PointLight( 0xffffff, 3, 3000 );
// light.position.set( 10, 2000, 10 );
// scene.add( light );
//
// var light = new THREE.AmbientLight( 0x404040 );
// scene.add( light );

var speed = 1;
var maxSize = 20;

var animate = function () {
	requestAnimationFrame( animate );

  var pCount = particleCount;
  while (pCount--)
  {
    var particle = particles.vertices[pCount];

    if (particle.endpoint.x !== 0 && particle.endpoint.y !== 0 && particle.endpoint.z !== 0 ) {

      if(particle.x < particle.endpoint.x * maxSize) particle.x += particle.endpoint.x / speed;
      if(particle.y < particle.endpoint.y * maxSize) particle.y += particle.endpoint.y / speed;
      if(particle.z < particle.endpoint.z * maxSize) particle.z += particle.endpoint.z / speed;

      particleSystem.geometry.verticesNeedUpdate = true;
    }
  }

	renderer.render( scene, camera );
};

// // instantiate a loader
var loader = new THREE.OBJLoader();

loader.load( '/models/cube.obj', function ( object ) {

  object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh )
    {
      var randomPointPositions = THREE.GeometryUtils.randomPointsInBufferGeometry( child.geometry, particleCount  );
      for( var i = 0; i < randomPointPositions.length; i++ )
      {
        var particle = particles.vertices[i];
        particle.endpoint.x = randomPointPositions[i].x;
        particle.endpoint.y = randomPointPositions[i].y;
        particle.endpoint.z = randomPointPositions[i].z;
      }
    }

	});

},
function ( xhr ) {
	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded car' );
},
function ( error ) {
	console.log( 'An error happened' );
});



animate();
