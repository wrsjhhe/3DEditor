/**
 * Created by Administrator on 2017/7/4 0004.
 */
var TopBar = function (project) {

    var signals = project.signals;

    var $container = $("<div id='topBar'></div>");
    $('body').append($container);

      $container.append(
        "<ul id='menu'>" +
            "<li id='file'>文件" +
                "<ul>" +
                    "<li> 导入文件" +
                        "<input type='file' id='import' >"+
                    "</li>" +
                    "<li id='exportOBJ'>导出OBJ</li>" +
                    "<li id='exportSTL'>导出STL</li>"+
                "</ul>" +
            "</li>"+
            "<li id = 'edtor'>编辑" +
                "<ul>" +
                    "<li id='clear'>清空</li>"+
                "</ul>"+
            "</li>"+
        "</ul>");





















    $(document).ready(function () {
        $("#import").on('change',function () {
            signals.importObject.dispatch(this.files[0]);
        });

        $("#clear").click(function () {

            signals.clear.dispatch();
        });

        $("#exportOBJ").click(function () {

            var exporter = new THREE.OBJExporter();

            saveString( exporter.parse( project.getObjectByUuid(project.objects,project.uuid) ),  project.getObjectByUuid(project.objects,project.uuid).name+'.obj' );

        });

        $("#exportSTL").click(function () {
            var exporter = new THREE.STLExporter();

            saveString( exporter.parse( project.scene ),  project.getObjectByUuid(project.objects,project.uuid).name+'.stl' );

        });

    });



    $(document).ready(function() {
        $("#menu").kendoMenu();
    });



    var link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); // Firefox workaround, see #6594

    function save( blob, filename ) {

        link.href = URL.createObjectURL( blob );
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString( text, filename ) {

        save( new Blob( [ text ], { type: 'text/plain' } ), filename );

    }

    return $container;
};