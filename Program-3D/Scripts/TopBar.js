class TopBar {
    constructor() {

        this.$container = $("<div id='topBar'></div>");
        $('body').append(this.$container);
    };

    init() {
        this.$container.append(`
            <ul id='menu'>
                <li id='file'>文件
                    <ul>
                        <li id="save"> 保存 </li>
                        <li> 导入文件
                            <input type='file' id='import' >
                        </li>
                            <li id='exportOBJ'>导出OBJ</li>
                            <li id='exportSTL'>导出STL</li>
                        </ul>
                    </li>
                <li id = 'edtor'>编辑
                    <ul>
                        <li id='clear'>清空</li>
                        <li id='segment'>分割</li>
                        <li id='remarks'>备注</li>
                    </ul>
                </li>
            </ul>`);

        let loader = new Loader();

        $(document).ready(function () {
            $("#import").on('change', function () {
                loader.importObject(this.files[0]);
            });

            $("#exportOBJ").click(function () {

                let exporter = new THREE.OBJExporter();
                let obj = new PROJECT.GetObjectByUuid(objects, uuid);

                new PROJECT.SaveString(exporter.parse(obj), obj.name + '.obj');

            });

            $("#exportSTL").click(function () {
                let exporter = new THREE.STLExporter();
                let obj = new PROJECT.GetObjectByUuid(objects, uuid);
                new PROJECT.SaveString(exporter.parse(scene), obj.name + '.stl');

            });

            $("#clear").click((e) => {
                let length = scene.children.length;
                for(let i = length-1;i >= 0;i--) {
                    if (scene.children[i].type === "Mesh" ||scene.children[i].type === "Line") {

                        scene.remove(scene.children[i]);
                    }
                }
                objects = [];
                dataArray = [];
                console.log(dataArray)

                INDEXDB.clearData(myDB.db,myDB.ojstore.name);
                $("#objDiv").data("kendoGrid").dataSource.read();
            });

            $("#segment").click(function () {
                let segment = new Segment();
                segment.init();
            });

            $("#remarks").click(function () {
                if ($("body").find("#objectInformationWindow").length !== 0) {
                    $("#objectInformationWindow").data("kendoWindow").destroy();
                }
                let SOI = new showObjectInformation();
                SOI.init(new PROJECT.GetObjectDataByUuid(dataArray, uuid).text || "");
                SOI.openWindow();
            });


            $('#file').find("li")[0].addEventListener("click", function () {

                let ToJs = function () {
                    let attr = [];
                      for (let item in dataArray)
                       {
                           attr[item] = JSON.stringify(dataArray[item]);
                        }
                       console.log(attr)
                     return attr;

                  }
                console.log(ToJs());

                    let param = {
                        Key:"123",
                        Attr: ToJs()
                        
                     //   Attr: [JSON.stringify({ a: 10, b: 20 }), JSON.stringify({ a: 100, b: 200 })]
                    };

                    $.ajax({
                        type: 'post',
                        url: '../Home/ReceiveJson',
                        data: param,
                        success: function (resule) {
                            alert('success');
                        },
                        error: function (message) {
                            alert('error!');
                        }

                    });


            }, false);

            $("#menu").kendoMenu();

        });
    }
}




