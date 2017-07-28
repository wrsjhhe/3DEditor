class RightSideBar {
    constructor(){

        this.$container = $("<div id='rightSideBar'></div>");
        $('body').append(this.$container);

    };

    init  () {
        this.$container.append(`
                <ul id="fieldList">
                   <li>
                       <label class="label" for="NameInput">Name</label>
                       <input id="NameInput">
                   </li>
                   <li>
                       <label class="label" for="ColorInput">Color</label>
                       <input id="ColorInput">
                   </li>
                   <li >
                       <span class="TextureInput">导入纹理 
                            <input class="TextureInput" type="file"> 
                        </span>                                                      
                   </li>
                </ul>
                <div id="objDiv"></div>
                `)

    };

    changeTransformControlsMode (e) {
        switch(e.keyCode)
        {
            case 87:
                Project.transformControls.setMode('translate');
                break;
            case 69:
                Project.transformControls.setMode('scale');
                break;
            case 82:
                Project.transformControls.setMode('rotate');
                break;
        }
    };
}

    $(document).ready(()=>{
       $("#objDiv").kendoGrid({
            dataSource: {
                data: Project.dataArray,
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
                read:Project.dataArray
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

                { field: "name", title: "name", width: "33%" },
                { field: "type", width: "67%" },

            ],
            selectable: "row",


        });

        $("#ColorInput").kendoColorPicker({
            value:"#171c21",
            buttons: false,
            select:(e)=>{ if(Project.getObjectByUuid(Project.objects,Project.uuid)!==undefined)
                {
                    Project.getObjectByUuid(Project.objects,Project.uuid).material.color.set(e.value);
                }
            }
        });

        $("input.TextureInput ").change(()=>{
            let loader = new Loader();
            loader.loadTexture($('input.TextureInput')[0].files[0],Project.getObjectByUuid(Project.objects,Project.uuid));
            $('input.TextureInput')[0].value = null;
        });

        $("#objDiv").on("click","td",function (e) {

            let row = $("#objDiv").data("kendoGrid").select();
            let data = $("#objDiv").data("kendoGrid").dataItem(row);
            Project.uuid = data.uuid;
            Project.ifSelected(Project.getObjectByUuid(Project.objects,Project.uuid));

        })

});





