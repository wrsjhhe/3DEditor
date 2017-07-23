/**Project定义主要公共与全局参数**/

let Project ={

    mouse:new THREE.Vector2(),
    scope:null,
    objects : [],
    dataArray:[],
    controls : null,
    transformControls:null,
    uuid : null,
    scene:null,
    sceneHelpers:null,
    linesGroup:[]

};

Project.camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000000 );
Project.camera.position.set( 0, 500, 500);
Project.camera.lookAt(new THREE.Vector3(0,0,0));

Project.renderer = new THREE.WebGLRenderer({antialias:true});
Project.renderer.autoClear = false;
Project.renderer.autoUpdateScene = false;
Project.renderer.setPixelRatio( window.devicePixelRatio );

Project.scene = new THREE.Scene();
Project.scene.background = new THREE.Color( 0xaaaaaa );

Project.sceneHelpers = new THREE.Scene(); //辅助对象的场景

Project.getObjectByUuid  = function(objects,uuid){
    for(let i in objects)
    {
        if (objects[i].uuid === uuid)
            return objects[i];
    }
};

Project.save = function ( blob, filename ) {

    let link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); // Firefox workaround, see #6594

    link.href = URL.createObjectURL( blob );
    link.download = filename || 'data.json';
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...

};

Project.saveString = function( text, filename ) {

    Project.save( new Blob( [ text ], { type: 'text/plain' } ), filename );

};

Project.render = function() {
    Project.renderer.render(Project.scene,Project.camera);
    Project.renderer.render(Project.sceneHelpers,Project.camera);
};
Project.animate = function() {
    requestAnimationFrame(Project.animate);
    Project.render();
};

Project.windowResized = function() {

    //重置相机视角范围
    Project.camera.aspect = document.getElementById("viewport").clientWidth/document.getElementById("viewport").clientHeight;
    Project.camera.updateProjectionMatrix();

    //重置渲染范围
    Project.renderer.setSize( document.getElementById("viewport").clientWidth,document.getElementById("viewport").clientHeight);

    Project.render();
};

Project.getSelected = function (mouse) {
    event.preventDefault();
    if (event.button !== 0) return; //如果不是鼠标左键点击return
    //确定鼠标按下时的屏幕坐标
    mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1) / (document.getElementById("viewport").clientWidth / window.innerWidth);
    mouse.y = (-( event.clientY / window.innerHeight ) * 2 + 1) / (document.getElementById("viewport").clientHeight / window.innerHeight);

    let raycaster = new THREE.Raycaster(); //定义一条射线
    raycaster.setFromCamera(mouse, Project.camera); //射线从相机到鼠标位置
    let intersects = raycaster.intersectObjects([Project.sceneHelpers.children[0]]); //射线与基准面相交确定交点
    return intersects[0];
};

Project.addObject = function (obj,ModelType) {

     obj.geometry.computeBoundingSphere();
     obj.position.set(
         obj.geometry.boundingSphere.center.x,
         obj.geometry.boundingSphere.center.y,
         obj.geometry.boundingSphere.center.z
     );
     let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
     matrix.set(
     1, 0, 0, -obj.geometry.boundingSphere.center.x,
     0, 1, 0, -obj.geometry.boundingSphere.center.y,
     0, 0, 1, -obj.geometry.boundingSphere.center.z,
     0, 0, 0, 1
     );
     obj.geometry.applyMatrix(matrix);

     Project.uuid = obj.uuid;
     obj.name = ModelType;

     Project.objects.push(obj);
     Project.dataArray.push(new objData(obj));
     INDEXDB.putData(myDB.db, myDB.ojstore.name, Project.dataArray);

    $("#objDiv").data("kendoGrid").dataSource.read();

    console.log(Project.scene.getObjectByName("Object" + Project.objects.length.toString()));
};
