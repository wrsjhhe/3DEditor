/**
 * Created by Administrator on 2017/6/27 0027.
 */
var RightSideBar = function (project) {

    var signals = project.signals;
    var scene = project.scene;
    var height = project.height;
    var width = project.width;
    var camera = project.camera;
    var sceneHelpers = project.sceneHelpers;

    var container = document.createElement( 'div' );
    container.id = "rightSideBar";
    document.body.appendChild( container );

    var fieldList = document.createElement('ul');
    fieldList.id = "fieldList";

    var ObjectName = document.createElement("li");
    var NameLabel = document.createElement("label");
    NameLabel.innerHTML = "Name";
    NameLabel.for = "NameInput";
    var NameInput = document.createElement("input");
    NameInput.id = "NameInput";
    ObjectName.appendChild(NameLabel);
    ObjectName.appendChild(NameInput);
    fieldList.appendChild(ObjectName);


    var ObjectColor = document.createElement("li");
    var ColorLabel = document.createElement("label");
    ColorLabel.innerHTML = "Color";
    ColorLabel.for = "ColorInput";
    var ColorInput = document.createElement("input");
    ColorInput.id = "ColorInput";
    function selectColor(e) {
        if(project.getObjectByUuid(project.objects,project.uuid)!==undefined)
        {
            project.getObjectByUuid(project.objects,project.uuid).material.color.set(e.value);
        }
    }
    signals.colorPanel.add(function (color) {
        $(document).ready(function() {
            $("#ColorInput").kendoColorPicker({
                value:color||"#171c21",
                buttons: false,
                select:selectColor
            });
        });
    });
    signals.colorPanel.dispatch();

    ObjectColor.appendChild(ColorLabel);
    ObjectColor.appendChild(ColorInput);
    fieldList.appendChild(ObjectColor);

    var textureLoad = document.createElement('input');
    textureLoad.type = "file";
    fieldList.appendChild(textureLoad);
    textureLoad.addEventListener("change",function () {
        signals.loadTexture.dispatch(textureLoad.files[0],project.getObjectByUuid(project.objects,project.uuid));
        textureLoad.value = null;
    },false);



    var objDiv = document.createElement("div");
    objDiv.id = "objDiv";
    signals.grid.add(function () {
        $(document).ready(function() {
            $("#objDiv").kendoGrid({
                dataSource: {
                    data: dataArray,
                    schema: {
                        model: {
                            fields: {
                                name: { type: "string" },
                                type: { type: "string" }
                            }
                        }
                    },
                    pageSize: 100000
                },
                transport:{
                    read:dataArray
                },
                height: 350,
                scrollable: true,
                sortable: true,
                filterable: true,
                pageable: {
                    input: false,
                    numeric: false
                },
                columns: [
                    "id",
                    { field: "name", title: "name", width: "120px" },
                    { field: "type", width: "100px" }
                ]
            });
        });
    });
    signals.grid.dispatch();
    container.appendChild(objDiv);


    container.appendChild(fieldList);


/************************************************************************************************************/
    var transformControls = new THREE.TransformControls( camera,document.getElementById("viewport") );
    sceneHelpers.add( transformControls );

    document.addEventListener("keydown",changeTransformControlsMode,false);
    function changeTransformControlsMode(e) {
        switch(e.keyCode)
        {
            case 87:
                transformControls.setMode('translate');
                break;
            case 69:
                transformControls.setMode('scale');
                break;
            case 82:
                transformControls.setMode('rotate');
                break;
        }
    }

    var mouse = new THREE.Vector2(); //定义一个Vector2D对象存储鼠标屏幕坐标

    document.getElementById("viewport").addEventListener('click',selectObject,false);

    function selectObject() {
        event.preventDefault();
        if(event.button !== 0) return; //如果不是鼠标左键点击return
        //确定鼠标按下时的屏幕坐标
        mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
        mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

        var raycaster = new THREE.Raycaster(); //定义一条射线
        raycaster.setFromCamera( mouse, camera ); //射线从相机到鼠标位置
        var intersects = raycaster.intersectObjects(project.objects,true);//定义射线可以相交的物体，设定为true可以判断是否与objects的子对象相交

        if ( intersects.length > 0 ){

            NameInput.value = intersects[ 0 ].object.name;
            project.uuid = intersects[0].object.uuid;

            console.log( project.getObjectByUuid(project.objects,project.uuid));

            $("#NameInput").unbind(); //必须先解除之前的绑定，否则会绑定多个物体

            $("#NameInput").bind("input",function () {
                intersects[ 0 ].object.name = NameInput.value;
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);
                for(var i in dataArray)
                {
                    if( dataArray[i].uuid !==undefined && dataArray[i].uuid === intersects[ 0 ].object.uuid)
                    {
                        dataArray[i].name = NameInput.value;
                        signals.grid.dispatch();
                    }
                }

            });

            transformControls.attach(intersects[ 0 ].object);

        }
        else {

            for(var i in dataArray)
            {
                if(dataArray[i].uuid ===project.uuid)
                {
                    project.objects[i].position.x = project.objects[i].matrixWorld.elements[12];
                    project.objects[i].position.y = project.objects[i].matrixWorld.elements[13];
                    project.objects[i].position.z = project.objects[i].matrixWorld.elements[14];

                    dataArray[i].position = JSON.stringify(project.objects[i].position);
                    dataArray[i].scale = JSON.stringify(project.objects[i].scale);
                    dataArray[i].rotation = JSON.stringify(project.objects[i].rotation);

                    INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);
                }
            }

            $("#NameInput").unbind();
            project.uuid = null;
            NameInput.value = null;
            transformControls.detach();
        }

    }

    document.addEventListener("keydown",deleteObject,false);
    function deleteObject(e) {
        if(e.keyCode === 8)
        {console.log(scene.children);
            scene.remove( project.getObjectByUuid(project.objects,project.uuid));
            while (scene.getObjectByName("TempMesh"))
            {
                scene.remove( scene.getObjectByName("TempMesh"));
            }
            console.log(scene.children);
            for(var i in project.objects)
            {
                if( project.objects[i].uuid === project.uuid)
                {
                    project.objects.splice(i,1);
                    if (dataArray[i].uuid === project.uuid){

                        INDEXDB.deleteData(myDB.db,myDB.ojstore.name,dataArray[i].keyId);
                    }
                    dataArray.splice(i,1);
                }
            }

            signals.grid.dispatch();
        }

    }


    return container;
};

