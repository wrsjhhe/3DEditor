class TopBar {
    constructor() {
        // Project.scope = this;
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
                let obj = Project.getObjectByUuid(Project.objects, Project.uuid);

                Project.saveString(exporter.parse(obj), obj.name + '.obj');

            });

            $("#exportSTL").click(function () {
                let exporter = new THREE.STLExporter();
                let obj = Project.getObjectByUuid(Project.objects, Project.uuid);
                Project.saveString(exporter.parse(Project.scene), obj.name + '.stl');

            });

            $("#clear").click(function () {
                clearAll();
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
                SOI.init(Project.getObjectDataByUuid(Project.dataArray, Project.uuid).text || "");
                SOI.openWindow();
            });

            $('#file').find("li")[0].addEventListener("click", function () {


                //Project.dataArray[0]

                Project.dataArray.forEach(function (e) {
                    var param = {
                
                        Attr: JSON.stringify(e)
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
                });

            }, false);

            $("#menu").kendoMenu();

        });

    }
}




