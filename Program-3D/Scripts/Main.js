let viewport = new Viewport();
viewport.init();
Project.controls.addEventListener('change', () => {
    Project.render();
});

let rightSideBar = new RightSideBar();
rightSideBar.init();
document.addEventListener("keydown", rightSideBar.changeTransformControlsMode, false);
$("#viewport").click(() => {
    selectObject();
});

let leftSideBar = new LeftSideBar();
leftSideBar.init();

let topBar = new TopBar();
topBar.init();

let cWindow = new CreateObjectWindow();
cWindow.init();

window.addEventListener('resize', () => {
    Project.windowResized();
}, false);
Project.windowResized();

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

}