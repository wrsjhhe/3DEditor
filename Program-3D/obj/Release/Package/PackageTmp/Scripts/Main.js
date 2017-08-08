let objects = PROJECT.objects;
let dataArray = PROJECT.dataArray;
let cameraControls = PROJECT.cameraControls;
let transformControls = PROJECT.transformControls;
let uuid = PROJECT.uuid;
let scene = PROJECT.scene;
let sceneHelpers = PROJECT.sceneHelpers;
let objectProperty = PROJECT.objectProperty;
let renderer = PROJECT.renderer;
let camera = PROJECT.camera;


{
    camera.position.set( 0, 500, 500);
    camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.autoClear = false;
    renderer.autoUpdateScene = false;
    renderer.setPixelRatio( window.devicePixelRatio );
    scene.background = new THREE.Color( 0xaaaaaa );
}


let viewport = new Viewport();
viewport.init();


let leftSideBar = new LeftSideBar();
leftSideBar.init();

let rightSideBar = new RightSideBar();
rightSideBar.init();

let topBar = new TopBar();
topBar.init();

let cWindow = new CreateObjectWindow();
cWindow.init();




/*
window.onbeforeunload = function () {
    for (let i in Project.dataArray) {

        if (Project.dataArray[i].uuid === Project.uuid) {

            Project.objects[i].position.x = Project.objects[i].matrixWorld.elements[12];
            Project.objects[i].position.y = Project.objects[i].matrixWorld.elements[13];
            Project.objects[i].position.z = Project.objects[i].matrixWorld.elements[14];

            Project.dataArray[i].position = JSON.stringify(Project.objects[i].position);
            Project.dataArray[i].scale = JSON.stringify(Project.objects[i].scale);
            Project.dataArray[i].rotation = JSON.stringify(Project.objects[i].rotation);

            Project.dataArray[i].materials.material = JSON.stringify(Project.objects[i].material.toJSON());

            INDEXDB.putData(myDB.db, myDB.ojstore.name, Project.dataArray);

        }
    }

};*/
