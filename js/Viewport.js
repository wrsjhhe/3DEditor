/**
 * Created by Administrator on 2017/6/21 0021.
 */
var Viewport = function (project) {

    var signals = project.signals;

    var container = document.createElement('div');
    container.id = "viewport";
    document.body.appendChild(container);

    var renderer = null;
    var scene = project.scene;
    var sceneHelpers = project.sceneHelpers;
    var camera = project.camera;
    project.height = container.clientHeight;
    project.width = container.clientWidth;

    var ambietLight =  new THREE.AmbientLight(0xffffff); //自然光
    scene.add(ambietLight);

    var spotLight1 = new THREE.SpotLight( 0xffffff ); //点光源
    spotLight1.position.set( -40, 5000, 50 );
    spotLight1.castShadow = true;
    scene.add( spotLight1 );

    var spotLight2 = new THREE.SpotLight( 0xffffff ); //点光源
    spotLight2.position.set( -40,-5000, 50 );
    spotLight2.castShadow = true;
    scene.add( spotLight2 );

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.autoClear = false;
    renderer.autoUpdateScene = false;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(document.getElementById("viewport").clientWidth,document.getElementById("viewport").clientHeight);
    container.appendChild( renderer.domElement );

    var planeGeometry = new THREE.PlaneGeometry( 6000, 6000 );
    var planeMaterial = new THREE.MeshBasicMaterial({color:0x2c2c2c,side:THREE.DoubleSide,transparent:true,opacity :0});
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.rotation.x = Math.PI/2;
    sceneHelpers.add( plane );

    var grid = new THREE.GridHelper( 6000, 60 );
   // grid.rotation.x = Math.PI/2;
    sceneHelpers.add( grid );

  /*  var c = new THREE.PlaneGeometry(400,200);
    var m = new THREE.MeshBasicMaterial({color:0x00ff00});
    var mm = new THREE.Mesh(c,m);
    scene.add(mm);
    var r = JSON.stringify(mm.rotation);
    var rr = JSON.parse(r);
    console.log(rr._y);
*/
    signals.windowResized.add( function () {

        //重置相机视角范围
        project.DEFAULT_CAMERA.aspect = document.getElementById("viewport").clientWidth/document.getElementById("viewport").clientHeight;
        project.DEFAULT_CAMERA.updateProjectionMatrix();

        camera.aspect = document.getElementById("viewport").clientWidth/document.getElementById("viewport").clientHeight;
        camera.updateProjectionMatrix();

        //重置渲染范围
        renderer.setSize( document.getElementById("viewport").clientWidth,document.getElementById("viewport").clientHeight);

        animate ();

    } );

   var controls = new THREE.EditorControls(camera,container); //调用视角移动
   project.controls = controls;



    //视角变换的时候重新渲染
    controls.addEventListener( 'change', function () {

        signals.cameraChanged.dispatch( camera );

    } );
    signals.cameraChanged.add(function (){render();});

    animate ();
    function animate (){

        requestAnimationFrame(animate);

        render();

    }

    function render (){

        renderer.render( scene, camera );
        renderer.render( sceneHelpers, camera );

    }

    return container;




};