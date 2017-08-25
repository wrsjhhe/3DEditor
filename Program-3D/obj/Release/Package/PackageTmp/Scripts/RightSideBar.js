class RightSideBar {
    constructor(){

        this.$container = $("<div id='rightSideBar'></div>");
        $('body').append(this.$container);

    };

    init  () {
        this.$container.append(`
            <div class="fieldList">
                <ul class="fieldList">
                <li>
                    <div>
                        <label class="label" for="NameInput">Name</label>
                        <input id="NameInput">
                    </div> 
                </li>
                <li>
                    <div>
                        <label class="label" for="ColorInput">Color</label>
                        <input id="ColorInput">
                    </div>          
                </li>
                <li >
                    <div class="TextureInput">
                        <p style="margin-top:6px;font-size: 15px;">导入纹理</p> 
                        <input class="TextureInput" type="file">  
                    </div>                                                  
                </li>
                </ul>
                <div id="objDiv"></div>
            </div>      
                `)

    };

}

    $(document).ready(()=>{
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

                { field: "name", title: "name", width: "33%" },
                { field: "type", width: "67%" },

            ],
            selectable: "row",

        });

        $("#ColorInput").kendoColorPicker({
            value:"#171c21",
            buttons: false,
            select:(e)=>{ if(new PROJECT.GetObjectByUuid(objects,uuid)!==undefined)
                {
                   new PROJECT.GetObjectByUuid(objects,uuid).material.color.set(e.value);
                }
            }
        });

        $("input.TextureInput ").change(()=>{
            let loader = new Loader();
            loader.loadTexture($('input.TextureInput')[0].files[0],new PROJECT.GetObjectByUuid(objects,uuid));
            $('input.TextureInput')[0].value = null;
        });

        $("#objDiv").on("click","td",function (e) {

            let row = $("#objDiv").data("kendoGrid").select();
            let data = $("#objDiv").data("kendoGrid").dataItem(row);
            uuid = data.uuid;

            (function (obj) {

                $("#NameInput")[0].value = obj.hasOwnProperty("name")?obj.name:"object";

                $("#NameInput").unbind(); //必须先解除之前的绑定，否则会绑定多个物体

                let data = new PROJECT.GetObjectDataByUuid(dataArray,obj.uuid);

                $("#NameInput").bind("input",function () {

                    obj.name = $("#NameInput")[0].value;
                    INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                    data.name = $("#NameInput")[0].value;

                    $("#objDiv").data("kendoGrid").dataSource.read();

                });
                transformControls.attach(obj);
            })(PROJECT.GetObjectByUuid(objects,uuid))



        })

});





