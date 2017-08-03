
//result_Customize储存不能被内置加载器加载的模型
let result_Customize = {
    objects:[],
    materials:[],
    name:[],
    geometries:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[],
    text:[]
};

//result_Normal储存可以直接被加载器加载的模型
let result_Normal = {
    objects:[],
    materials:[],
    name:[],
    geometries:[],
    position:[],
    keyId:[],
    scale:[],
    rotation:[],
    text:[]
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
            console.log('成功建立并打开数据库:' + myDB.name + 'version' + dbversion);
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
                     cursor.continue();
            }else{
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

function getNormaldata(cursor,result) {

    result.position.push(cursor.value.position);
    result.scale.push(cursor.value.scale);
    result.rotation.push(cursor.value.rotation);

    result.materials.push({
        id:cursor.value.keyId,
        material: cursor.value.materials.material,
        textureSrc:cursor.value.materials.textureSrc
    });

    result.objects.push(cursor.value.obj);

    result.geometries.push(cursor.value.geometry);

    result.keyId.push(cursor.value.keyId);
    result.name.push(cursor.value.name);
    result.text.push(cursor.value.text);

}

function getCustomizeData(cursor,result) {

    getNormaldata.apply(this,arguments);

    result.geometries.push(cursor.value.geometry);

}


