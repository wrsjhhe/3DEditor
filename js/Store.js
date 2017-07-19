/**
 * Created by Administrator on 2017/7/3 0003.
 */


var NUMBER_PRECISION = 6;

function parseNumber( key, value ) {

    return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

}


var number = 1;

var result1 = {

    objects:[],
    name:[],
    geometries:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[]

};

var result2 = {

    objects:[],
    name:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[]

};

var dataArray = [];
var objData = function (obj) {
    this.keyId = Math.random()*100000000000000000;
    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.uuid = obj.uuid;

    this.geometry = {
        type:obj.geometry.type,
        faces:JSON.stringify(obj.geometry.faces),
        vertices:JSON.stringify(obj.geometry.vertices)
    };

    this.position = JSON.stringify(obj.position);
    this.scale = JSON.stringify(obj.scale);
    this.rotation = JSON.stringify(obj.rotation);


    try {
        var _obj = JSON.stringify(obj, parseNumber, '\t');
        _obj = _obj.replace( /[\n\t]+([\d\e\-\[\]]+)/g, '$1' );
    }catch (e){
        try {
            _obj = JSON.stringify(obj);
        }
        catch (e){
            console.warn("This type of object can't be parsed:"+e);
        }
    }
    this.obj = _obj;

};



var myDB={
    name:'3D-project',
    version:1,
    db:null,
    ojstore:{
        name:'objects',//存储空间表的名字
        keypath:'keyId'//主键
    }
};
var INDEXDB = {
    indexedDB: window.indexedDB || window.webkitindexedDB,
    IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange,//键范围
    openDB: function (dbname, dbversion, callback) {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        var self = this;
        var version = dbversion || 1;
        var request = self.indexedDB.open(dbname, version);
        request.onerror = function (e) {
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess = function (e) {
            myDB.db = e.target.result;
            console.log('成功建立并打开数据库:' + myDB.name + ' version' + dbversion);
        };
        request.onupgradeneeded = function (e) {
            var db = e.target.result, transaction = e.target.transaction, store;
            if (!db.objectStoreNames.contains(myDB.ojstore.name)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(myDB.ojstore.name, {keyPath: myDB.ojstore.keypath});
                console.log('成功建立对象存储空间：' + myDB.ojstore.name);
            }
        }

    },
    addData:function(db,storename,data){
        //添加数据，重复添加会报错
        var store = store = db.transaction(storename,'readwrite').objectStore(storename),request;
        for(var i = 0 ; i < data.length;i++){
            request = store.add(data[i]);
            request.onerror = function(){
                console.error('add添加数据库中已有该数据')
            };
            request.onsuccess = function(){
                console.log('add添加数据已存入数据库')
            };
        }

    },
    putData:function(db,storename,data){
        //添加数据，重复添加会更新原有数据
        var store = store = db.transaction(storename,'readwrite').objectStore(storename),request;
        for(var i = 0 ; i < data.length;i++){
            request = store.put(data[i]);
            request.onerror = function(){
                console.error('put添加数据库中已有该数据')
            };
            request.onsuccess = function(){
                console.log('put添加数据已存入数据库')
            };
        }
    },
    getDataByKey:function(db,storename,key){
        //根据存储空间的键找到对应数据
        var store = db.transaction(storename,'readwrite').objectStore(storename);
        var request = store.get(key);
        request.onerror = function(){
            console.error('getDataByKey error');
        };
        request.onsuccess = function(e){

            var result = e.target.result;
            console.log('查找数据成功');
            console.log(result);

        };
    },

    getAllData:function (db,storename) {

        var store = db.transaction(storename,'readwrite').objectStore(storename);
        store.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {

                if(cursor.value.geometry.type === "ExtrudeGeometry") {

                    result1.position.push(cursor.value.position);
                    result1.scale.push(cursor.value.scale);
                    result1.rotation.push(cursor.value.rotation);

                    result1.geometries.push(cursor.value.geometry);

                    result1.keyId.push(cursor.value.keyId);
                    result1.name.push(cursor.value.name);

                    cursor.continue();
                }else {

                    result2.position.push(cursor.value.position);
                    result2.scale.push(cursor.value.scale);
                    result2.rotation.push(cursor.value.rotation);

                    result2.objects.push(cursor.value.obj);

                    result2.keyId.push(cursor.value.keyId);
                    result2.name.push(cursor.value.name);

                    cursor.continue();
                }

            }
          /*  else {
                //console.log("No more entries!");
            }*/
        }

    },

    deleteData:function(db,storename,key){
        //删除某一条记录
        var store = db.transaction(storename,'readwrite').objectStore(storename);
        store.delete(key);
        console.log('已删除存储空间'+storename+'中'+key+'记录');
    },
    clearData:function (db,storename) {
        var store  = db.transaction(storename,'readwrite').objectStore(storename);
        store.clear();
    }
};

INDEXDB.openDB(myDB.name,myDB.version);

setTimeout(function(){
    console.log('****************添加数据****************************');
    INDEXDB.addData(myDB.db,myDB.ojstore.name,dataArray);
    // console.log('******************add重复添加**************************');
    // INDEXDB.addData(myDB.db,myDB.ojstore.name,students);
    // console.log('*******************put重复添加*************************');
    // INDEXDB.putData(myDB.db,myDB.ojstore.name,students);
    // console.log('*******************获取数据1001*************************');
    // INDEXDB.getDataByKey(myDB.db,myDB.ojstore.name,1001);
    // console.log('******************删除数据1001************');
    // INDEXDB.deleteData(myDB.db,myDB.ojstore.name,1001);
    // console.log('******************删除全部数据************');
    // INDEXDB.clearData(myDB.db,myDB.ojstore.name);
    // console.log('******************关闭数据库************');
    // INDEXDB.closeDB(myDB.db);
    // console.log('******************删除数据库************');
    // INDEXDB.deletedb(myDB.name);
},800);

setTimeout(function(){
    INDEXDB.getAllData(myDB.db,myDB.ojstore.name);
    setTimeout(function () {
        if (result1.position !== 0) {
            for (var i in result1.position) {
                var faces = JSON.parse(result1.geometries[i].faces);
                var vertices = JSON.parse(result1.geometries[i].vertices);
                var geometry = new THREE.Geometry();
                geometry.faces = faces;
                geometry.vertices = vertices;

                var material = new THREE.MeshPhongMaterial({color: 0x171c21});

                var mesh = new THREE.Mesh(geometry, material);

                mesh.geometry.type = "ExtrudeGeometry";

                var position = JSON.parse(result1.position[i]);
                var scale = JSON.parse(result1.scale[i]);
                console.log(result1.rotation[i]);
                var rotation = JSON.parse(result1.rotation[i]);

                mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
                mesh.scale.x = scale.x;mesh.scale.y = scale.y;mesh.scale.z = scale.z;
                mesh.rotation.x = rotation._x;mesh.rotation.y = rotation._y;mesh.rotation.z = rotation._z;

                mesh.name = result1.name[i];

                project.objects.push(mesh);

                project.scene.add(mesh);

                var newData = new objData(mesh);
                newData.keyId = result1.keyId[i];

                dataArray.push(newData);

                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                project.signals.grid.dispatch();

            }
        }

        if(result2.position!==0){

            for(var i in result2.position)
            {
                var data = JSON.parse(result2.objects[i]);

                if (data.metadata === undefined) { // 2.0

                    data.metadata = {type: 'Geometry'};

                }

                if (data.metadata.type === undefined) { // 3.0

                    data.metadata.type = 'Geometry';

                }

                var loader = new THREE.ObjectLoader();
                loader.setTexturePath('');

                var mesh = loader.parse(data);

                var position = JSON.parse(result2.position[i]);
                var scale = JSON.parse(result2.scale[i]);
                var rotation = JSON.parse(result2.rotation[i]);

                mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
                mesh.scale.x = scale.x;mesh.scale.y = scale.y;mesh.scale.z = scale.z;
                mesh.rotation.x = rotation._x;mesh.rotation.y = rotation._y;mesh.rotation.z = rotation._z;

                mesh.name = result2.name[i];

                project.objects.push(mesh);

                project.scene.add(mesh);

                var newData = new objData(mesh);
                newData.keyId = result2.keyId[i];

                dataArray.push(newData);
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                project.signals.grid.dispatch();

            }
        }



    },200);


},800);

