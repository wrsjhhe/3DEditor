let NUMBER_PRECISION = 6;

function parseNumber( key, value ) {

    return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

}


let number = 1;
let _obj;

//result1储存不能被内置加载器加载的模型
let result1 = {
    objects:[],
    materials:[],
    name:[],
    geometries:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[]

};
//result2储存可以直接被加载器加载的模型
let result2 = {
    objects:[],
    materials:[],
    name:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[]

};

//objData定义一个结构储存模型的部分关键信息
let objData = function (obj,textureSrc,lineCurve) {
    this.keyId = Math.random()*100000000000000000;
    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.uuid = obj.uuid;

    this.materials = {

        id:this.keyId,
        material:JSON.stringify(obj.material.toJSON()),
        textureSrc:textureSrc
    };

    this.geometry = {
        type:obj.geometry.type,
        faces:JSON.stringify(obj.geometry.faces),
        vertices:JSON.stringify(obj.geometry.vertices),
        lineCurve:JSON.stringify(lineCurve)
    };

    this.position = JSON.stringify(obj.position);
    this.scale = JSON.stringify(obj.scale);
    this.rotation = JSON.stringify(obj.rotation);


    try {
         _obj = JSON.stringify(obj.toJSON(), parseNumber, '\t');
        _obj = _obj.replace( /[\n\t]+([\d\e\-\[\]]+)/g, '$1' );
    }catch (e){
        try {
            _obj = JSON.stringify(obj.toJSON());
        }
        catch (e){
            console.warn("This type of object can't be parsed:"+e);
        }
    }
    this.obj = _obj;

};


//定义数据库参数
let myDB={
    name:'3D-project',
    version:1,
    db:null,
    ojstore:{
        name:'objects',//存储空间表的名字
        keypath:'keyId'//主键
    }
};
//初始化数据库
let INDEXDB = {
    indexedDB: window.indexedDB || window.webkitindexedDB,
    IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange,//键范围
    openDB: function (dbname, dbversion, callback) {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        let self = this;
        let version = dbversion || 1;
        let request = self.indexedDB.open(dbname, version);
        request.onerror = function (e) {
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess = function (e) {
            myDB.db = e.target.result;
            console.log('成功建立并打开数据库:' + myDB.name + ' version' + dbversion);
        };
        request.onupgradeneeded = function (e) {
            let db = e.target.result, transaction = e.target.transaction, store;
            if (!db.objectStoreNames.contains(myDB.ojstore.name)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(myDB.ojstore.name, {keyPath: myDB.ojstore.keypath});
                console.log('成功建立对象存储空间：' + myDB.ojstore.name);
            }
        }

    },
    addData:function(db,storename,data){
        //添加数据，重复添加会报错
        let store = db.transaction(storename,'readwrite').objectStore(storename),request;
        for(let i = 0 ; i < data.length;i++){
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
        let store = db.transaction(storename,'readwrite').objectStore(storename),request;
        for(let i = 0 ; i < data.length;i++){
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
        let store = db.transaction(storename,'readwrite').objectStore(storename);
        let request = store.get(key);
        request.onerror = function(){
            console.error('getDataByKey error');
        };
        request.onsuccess = function(e){

            let result = e.target.result;
            console.log('查找数据成功');
            console.log(result);

        };
    },

    getAllData:function (db,storename) {

        let store = db.transaction(storename,'readwrite').objectStore(storename);
        store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {

                if(cursor.value.geometry.type === "ExtrudeGeometry") {

                    result1.position.push(cursor.value.position);
                    result1.scale.push(cursor.value.scale);
                    result1.rotation.push(cursor.value.rotation);

                    result1.materials.push({
                        id:cursor.value.keyId,
                        material: cursor.value.materials.material,
                        textureSrc:cursor.value.materials.textureSrc
                    });

                    result1.objects.push(cursor.value.obj);
                    result1.geometries.push(cursor.value.geometry);

                    result1.keyId.push(cursor.value.keyId);
                    result1.name.push(cursor.value.name);

                    cursor.continue();
                }else {

                    result2.position.push(cursor.value.position);
                    result2.scale.push(cursor.value.scale);
                    result2.rotation.push(cursor.value.rotation);

                    result2.materials.push({
                        id:cursor.value.keyId,
                        material: cursor.value.materials.material,
                        textureSrc:cursor.value.materials.textureSrc
                    });

                    result2.objects.push(cursor.value.obj);

                    result2.keyId.push(cursor.value.keyId);
                    result2.name.push(cursor.value.name);

                    cursor.continue();
                }
            }
        }
    },

    deleteData:function(db,storename,key){
        //删除某一条记录
        let store = db.transaction(storename,'readwrite').objectStore(storename);
        store.delete(key);
        console.log('已删除存储空间'+storename+'中'+key+'记录');
    },

    clearData:function (db,storename) {
        let store  = db.transaction(storename,'readwrite').objectStore(storename);
        store.clear();
    }
};

//页面加载是打开数据库
INDEXDB.openDB(myDB.name,myDB.version);

setTimeout(function(){
    console.log('****************添加数据****************************');
    INDEXDB.addData(myDB.db,myDB.ojstore.name,Project.dataArray);

},800);

setTimeout(function(){
    INDEXDB.getAllData(myDB.db,myDB.ojstore.name);
    setTimeout(function () {
        if (result1.position.length !== 0) {
            for (let i in result1.position) {
                let faces = JSON.parse(result1.geometries[i].faces);
                let vertices = JSON.parse(result1.geometries[i].vertices);
                let geometry = new THREE.Geometry();
                geometry.faces = faces;
                geometry.vertices = vertices;

                //设置每个面的纹理UV坐标
                let face1 = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
                let face2 = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
                let face3 = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
                let face4 = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
                let face5 = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
                let face6 = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

                //将纹理UV坐标映射到物体几何表面
                geometry.faceVertexUvs[0] = [];
                geometry.faceVertexUvs[0][0] = [face1[3], face1[0], face1[1]];
                geometry.faceVertexUvs[0][1] = [face1[1], face1[2], face1[3]];

                geometry.faceVertexUvs[0][2] = [face2[3], face2[0], face2[1]];
                geometry.faceVertexUvs[0][3] = [face2[1], face2[2], face2[3]];

                geometry.faceVertexUvs[0][4] = [face3[0], face3[1], face3[3]];
                geometry.faceVertexUvs[0][5] = [face3[1], face3[2], face3[3]];

                geometry.faceVertexUvs[0][6] = [face4[0], face4[1], face4[3]];
                geometry.faceVertexUvs[0][7] = [face4[1], face4[2], face4[3]];

                geometry.faceVertexUvs[0][8] = [face5[0], face5[1], face5[3]];
                geometry.faceVertexUvs[0][9] = [face5[1], face5[2], face5[3]];

                geometry.faceVertexUvs[0][10] = [face6[0], face6[1], face6[3]];
                geometry.faceVertexUvs[0][11] = [face6[1], face6[2], face6[3]];


                let materialLoader = new THREE.MaterialLoader();
                let material =  materialLoader.parse(JSON.parse(result1.materials[i].material));
                material.map = null;

                if(result1.materials[i].textureSrc !== undefined){
                    let im = new Image();
                    im.src = result1.materials[i].textureSrc;
                    let texture = new THREE.Texture(im);
                    texture.minFilter = THREE.NearestFilter;
                    texture.needsUpdate = true;
                    material.map = texture;
                    material.needsUpdate = true;
                }

                let mesh = new THREE.Mesh(geometry, material);
                console.log(mesh.material);
                mesh.geometry.type = "ExtrudeGeometry";

                let position = JSON.parse(result1.position[i]);
                let scale = JSON.parse(result1.scale[i]);
                let rotation = JSON.parse(result1.rotation[i]);

                mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
                mesh.scale.x = scale.x;mesh.scale.y = scale.y;mesh.scale.z = scale.z;
                mesh.rotation.x = rotation._x;mesh.rotation.y = rotation._y;mesh.rotation.z = rotation._z;

                mesh.name = result1.name[i];

                Project.objects.push(mesh);

                Project.scene.add(mesh);

                let newData = new objData(mesh,result1.materials[i].textureSrc);
                newData.keyId = result1.keyId[i];

                Project.dataArray.push(newData);

                INDEXDB.putData(myDB.db,myDB.ojstore.name,Project.dataArray);

                $("#objDiv").data("kendoGrid").dataSource.read();

            }
        }

        if(result2.position.length !==0){

            for(let i in result2.position)
            {
                let data = JSON.parse(result2.objects[i]);

                if (data.metadata === undefined) { // 2.0

                    data.metadata = {type: 'Geometry'};

                }
                if (data.metadata.type === undefined) { // 3.0

                    data.metadata.type = 'Geometry';

                }
                let loader = new THREE.ObjectLoader();
                loader.setTexturePath('');

                let mesh = loader.parse(data);

                let position = JSON.parse(result2.position[i]);
                let scale = JSON.parse(result2.scale[i]);
                let rotation = JSON.parse(result2.rotation[i]);

                mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
                mesh.scale.x = scale.x;mesh.scale.y = scale.y;mesh.scale.z = scale.z;
                mesh.rotation.x = rotation._x;mesh.rotation.y = rotation._y;mesh.rotation.z = rotation._z;

                mesh.name = result2.name[i];

                let materialLoader = new THREE.MaterialLoader();
                let material =  materialLoader.parse(JSON.parse(result2.materials[i].material));
                mesh.material = material;

                if(result2.materials[i].textureSrc !== undefined){
                    let im = new Image();
                    im.src = result2.materials[i].textureSrc;
                    let texture = new THREE.Texture(im);
                    texture.minFilter = THREE.NearestFilter;
                    texture.needsUpdate = true;
                    material.map = texture;
                    material.needsUpdate = true;
                }

                Project.objects.push(mesh);
                Project.scene.add(mesh);
                let newData = new objData(mesh,result2.materials[i].textureSrc);
                newData.keyId = result2.keyId[i];

                Project.dataArray.push(newData);
                INDEXDB.putData(myDB.db,myDB.ojstore.name,Project.dataArray);

                $("#objDiv").data("kendoGrid").dataSource.read();

            }

        }

    },200);

},800);


