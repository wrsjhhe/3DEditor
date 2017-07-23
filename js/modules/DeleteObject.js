/**按下退格键删除单个物体**/
document.addEventListener("keydown",deleteObject,false);
function deleteObject(e,flag) {
    if( flag ===true || e.keyCode === 8 )
    {
        Project.scene.remove( Project.getObjectByUuid(Project.objects,Project.uuid));

        for(let i in Project.objects)
        {
            if( Project.objects[i].uuid === Project.uuid)
            {
                Project.objects.splice(i,1);
                if (Project.dataArray[i].uuid === Project.uuid){

                    INDEXDB.deleteData(myDB.db,myDB.ojstore.name,Project.dataArray[i].keyId);
                }
                Project.dataArray.splice(i,1);
            }
        }

        $("#objDiv").data("kendoGrid").dataSource.read();
    }
}
/**点击编辑-清空，删除所有**/
function clearAll() {

    let length = Project.scene.children.length;
    for(let i = length-1;i >= 0;i--) {
        if (Project.scene.children[i].type === "Mesh" ||Project.scene.children[i].type === "Line") {

            Project.scene.remove(Project.scene.children[i]);

        }
    }

    Project.objects = [];
    Project.dataArray = [];
    $("#objDiv").data("kendoGrid").dataSource.read();

    INDEXDB.clearData(myDB.db,myDB.ojstore.name);
}
