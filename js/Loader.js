/**
 * Created by Administrator on 2017/7/4 0004.
 */
var Loader = function (project) {

    var signals = project.signals;

    signals.loadTexture.add(function (file,object) {

        var reader = new FileReader();

        if ( file.type === 'image/targa' ) {

            reader.addEventListener( 'load', function ( event ) {

                var canvas = new THREE.TGALoader().parse( event.target.result );

                var texture = new THREE.CanvasTexture( canvas);

                texture.sourceFile = file.name;


            }, false );
            reader.readAsArrayBuffer( file );

        }else {

            reader.addEventListener( 'load', function ( event ) {

                var image = document.createElement( 'img' );
                image.addEventListener( 'load', function( event ) {

                    var texture = new THREE.Texture( this);
                    texture.sourceFile = file.name;
                    texture.needsUpdate = true;

                    object.material.map = texture;

                    object.material.needsUpdate = true;

                }, false );

                image.src = event.target.result;

            }, false );

            reader.readAsDataURL( file );

        }


    });

    
    signals.importObject.add(function (file) {

        var filename = file.name;

        var extension = filename.split( '.' ).pop().toLowerCase();

        var reader = new FileReader();


        switch (extension){
            case 'obj':

                reader.addEventListener( 'load', function ( event ) {

                    var contents = event.target.result;

                    var object = new THREE.OBJLoader().parse( contents );
                    object.name = filename;

                    object.children.forEach(function (e) {
                        project.scene.add(e);
                        project.objects.push(e);
                        dataArray.push(new objData(e));
                    });
                    signals.grid.dispatch();

                }, false );
                reader.readAsText( file );

                break;


        }


    });

};