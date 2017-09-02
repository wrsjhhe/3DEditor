window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

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
let request;
(function () {
    request  = window.indexedDB.open(myDB.name, myDB.version);
    request.onerror = function (e) {
        console.log(e.currentTarget.error.message);
    };
    request.onsuccess = function (e) {
        myDB.db = e.target.result;
        console.log('成功建立并打开数据库:' + myDB.name + 'version' + myDB.version);
    };
    request.onupgradeneeded = function (e) {

        let db = e.target.result, transaction = e.target.transaction, store;
        if (!db.objectStoreNames.contains(myDB.ojstore.name)) {
            //没有该对象空间时创建该对象空间
            store = db.createObjectStore(myDB.ojstore.name, {keyPath: myDB.ojstore.keypath});
            console.log('成功建立对象存储空间：' + myDB.ojstore.name);
        }
    };
})();



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



//初始化数据库
let INDEXDB = {
    request:window.indexedDB,

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

    getAllData:function (db,storename,callBack) {

        let store = db.transaction(storename,'readwrite').objectStore(storename);

        store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {

                if(cursor.value.geometry && cursor.value.geometry.type === "ExtrudeGeometry") {
                    getCustomizeData(cursor.value,result_Customize);
                    cursor.continue();
                }else {
                    getNormaldata(cursor.value,result_Normal);
                    cursor.continue();
                }
            }else {
                callBack();
                for(let i in result_Normal){
                    result_Normal[i] = [];
                    result_Customize[i] = [];
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

function getNormaldata(cursorValue,result) {

    result.position.push(cursorValue.position);
    result.scale.push(cursorValue.scale);
    result.rotation.push(cursorValue.rotation);

    result.materials.push({
        id:cursorValue.keyId,
        material: cursorValue.materials.material,
        textureSrc:cursorValue.materials.textureSrc
    });

    result.objects.push(cursorValue.obj);

    result.geometries.push(cursorValue.geometry);

    result.keyId.push(cursorValue.keyId);
    result.name.push(cursorValue.name);
    result.text.push(cursorValue.text);

}

function getCustomizeData(cursorValue,result) {

    getNormaldata.apply(this,arguments);

    result.geometries.push(cursorValue.geometry);

}

