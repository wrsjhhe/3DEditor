function selectObject() {

    for(let i in Project.dataArray)
    {
        if( Project.dataArray[i].uuid === Project.uuid)
        {

            Project.objects[i].position.x = Project.objects[i].matrixWorld.elements[12];
            Project.objects[i].position.y = Project.objects[i].matrixWorld.elements[13];
            Project.objects[i].position.z = Project.objects[i].matrixWorld.elements[14];

            Project.dataArray[i].position = JSON.stringify(Project.objects[i].position);
            Project.dataArray[i].scale = JSON.stringify(Project.objects[i].scale);
            Project.dataArray[i].rotation = JSON.stringify(Project.objects[i].rotation);

            Project.dataArray[i].materials.material = JSON.stringify(Project.objects[i].material.toJSON());

            INDEXDB.putData(myDB.db,myDB.ojstore.name,Project.dataArray);

        }
    }
    Project.uuid = null;
    event.preventDefault();
    if(event.button !== 0) return; //如果不是鼠标左键点击return
    //确定鼠标按下时的屏幕坐标
    Project.mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(document.getElementById("viewport").clientWidth/window.innerWidth);
    Project.mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(document.getElementById("viewport").clientHeight/window.innerHeight);

    let raycaster = new THREE.Raycaster(); //定义一条射线
    raycaster.setFromCamera( Project.mouse, Project.camera ); //射线从相机到鼠标位置
    let intersects = raycaster.intersectObjects(Project.objects,true);//定义射线可以相交的物体，设定为true可以判断是否与objects的子对象相交

    if ( intersects.length > 0 ){

        Project.uuid = intersects[0].object.uuid;
        Project.ifSelected();

    }
    else {

            $("#NameInput").unbind();
            $("#NameInput")[0].value = null;
            Project.transformControls.detach();

    }
}

Project.ifSelected = function(){

    let obj = Project.getObjectByUuid(Project.objects,Project.uuid);
    console.log(Project.getObjectByUuid(Project.objects,Project.uuid));
    $("#NameInput")[0].value = obj.name;

    $("#NameInput").unbind(); //必须先解除之前的绑定，否则会绑定多个物体

    $("#NameInput").bind("input",function () {
        obj.name = $("#NameInput")[0].value;
        INDEXDB.putData(myDB.db,myDB.ojstore.name,Project.dataArray);
        for(let i in Project.dataArray)
        {
            if( Project.dataArray[i].uuid !==undefined && Project.dataArray[i].uuid === obj.uuid)
            {
                Project.dataArray[i].name = $("#NameInput")[0].value;

                $("#objDiv").data("kendoGrid").dataSource.read();
            }
        }
    });
    Project.transformControls.attach(obj);

};

