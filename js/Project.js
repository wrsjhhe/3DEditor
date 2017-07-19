/**
 * Created by Administrator on 2017/6/21 0021.
 */
var Project = function (){

    //相机基本参数
    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000000 );
    this.DEFAULT_CAMERA.name = 'Camera';
    this.DEFAULT_CAMERA.position.set( 0, 300, 300);
    this.DEFAULT_CAMERA.lookAt( new THREE.Vector3(0,0,0) );

    var Signal = signals.Signal; //这个对象保存各个事件声明

    //各种事件声明
    this.signals = {

        windowResized:new Signal(), //窗口重置

        cameraChanged:new Signal(), //视角变换

        createGraph:new Signal(), //生成图形

        grid:new Signal(), //生成表单
        colorPanel:new Signal(), //生成调色板

        importObject:new Signal(), //导入模型对象

        loadTexture:new Signal(), //导入纹理

        ClickAddGraph:new Signal(), //点击建立对象

        openWindow:new Signal(), //建立对象过程中弹出框
        closeWindow:new Signal(),//关闭弹出框

        init:new Signal(), //初始化场景，从数据库中读取信息

        clear:new Signal() //清空所有数据


    };

    this.objects = []; //对象数组

    this.scene = new THREE.Scene(); //绘制对象的场景

    this.sceneHelpers = new THREE.Scene(); //辅助对象的场景

    this.scene.background = new THREE.Color( 0xaaaaaa );

    this.camera = this.DEFAULT_CAMERA.clone();//相机

    this.controls = null;

    this.height = null;
    this.width = null;

    this.id = null;
    this.uuid = null;

    this.getObjectByUuid = function (objects,uuid) {
        for(var i in objects)
        {
            if (objects[i].uuid === uuid)
                return objects[i];
        }
    };

    this.signals.clear.add(function () {
        var length = project.scene.children.length;
        for(var i = length-1;i >= 0;i--) {
            if (project.scene.children[i].type === "Mesh") {

                project.scene.remove(project.scene.children[i]);

            }
        }

        project.objects = [];
        dataArray = [];
        project.signals.grid.dispatch();

        INDEXDB.clearData(myDB.db,myDB.ojstore.name);

    })

};
