/**按下退格键删除单个物体**/
document.addEventListener("keydown",deleteObject,false);
function deleteObject(e,flag) {

    if( flag ===true || (e.keyCode === 68&&e.ctrlKey ) )
    {
        flag!==true&&e.preventDefault();

        scene.remove( new PROJECT.GetObjectByUuid(objects,uuid));

        for(let i in objects)
        {
            if( objects[i].uuid === uuid)
            {
                objects.splice(i,1);
                if (dataArray[i].uuid === uuid){

                    INDEXDB.deleteData(myDB.db,myDB.ojstore.name,dataArray[i].keyId);
                }
                dataArray.splice(i,1);
            }
        }

        $("#objDiv").data("kendoGrid").dataSource.read();
    }
}
/**点击编辑-清空，删除所有**/
function clearAll() {

    let length = scene.children.length;
    for(let i = length-1;i >= 0;i--) {
        if (scene.children[i].type === "Mesh" ||scene.children[i].type === "Line") {

            scene.remove(scene.children[i]);

        }
    }

    objects = [];
    dataArray = [];
    $("#objDiv").data("kendoGrid").dataSource.read();

    INDEXDB.clearData(myDB.db,myDB.ojstore.name);
}
