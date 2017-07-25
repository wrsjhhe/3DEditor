class TopBar {
    constructor(){
        // Project.scope = this;
        this.$container = $("<div id='topBar'></div>");
        $('body').append(this.$container);
    };

    init (){
        this.$container.append(`
            <ul id='menu'> 
                <li id='file'>文件 
                    <ul> 
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
                    </ul>
                </li>
            </ul>`);

        let loader = new Loader();

        $(document).ready(function () {
            $("#import").on('change',function () {
                loader.importObject(this.files[0]);
            });

            $("#exportOBJ").click(function () {

                let exporter = new THREE.OBJExporter();

                saveString( exporter.parse( getObjectByUuid(Project.objects,project.uuid) ),  getObjectByUuid(Project.objects,Project.uuid).name+'.obj' );

            });

            $("#exportSTL").click(function () {
                let exporter = new THREE.STLExporter();

                saveString( exporter.parse( Project.scene ), getObjectByUuid(Project.objects,Project.uuid).name+'.stl' );

            });

            $("#clear").click(function () {
                clearAll();
            });

            $("#segment").click(function () {
                let segment = new Segment();
                segment.init();
            });

            $("#menu").kendoMenu();

        });

    }
}




