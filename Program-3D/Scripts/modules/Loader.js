let Loader = function () {

    this.loadTexture = function (file,object) {

        let reader = new FileReader();

        if ( file.type === 'image/targa' ) {

            reader.addEventListener( 'load', function ( event ) {

                let canvas = new THREE.TGALoader().parse( event.target.result );

                let texture = new THREE.CanvasTexture( canvas);

                texture.sourceFile = file.name;


            }, false );
            reader.readAsArrayBuffer( file );

        }else {

            reader.addEventListener( 'load', function ( event ) {

                let image = document.createElement( 'img' );
                image.addEventListener( 'load', function ( event ) {

                    let texture = new THREE.Texture( this );
                    texture.sourceFile = file.name;
                    texture.needsUpdate = true;

                    object.material.map = texture;
                    object.material.needsUpdate = true;

                    for ( let v of dataArray) {

                        if(v.uuid === uuid) {
                         v.materials.textureSrc = this.src;
                         INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);
                         break;
                        }
                    }

                }, false );

                image.src = event.target.result;

            }, false );

            reader.readAsDataURL( file );

        }

    };
    this.importObject = function (file) {

        let filename = file.name;

        let extension = filename.split( '.' ).pop().toLowerCase();

        let reader = new FileReader();


        switch (extension){
            case 'obj':

                reader.addEventListener( 'load', function ( event ) {

                    let contents = event.target.result;

                    let objModel = new THREE.OBJLoader().parse( contents );
                    objModel.name = filename;

                    let o = JSON.stringify(objModel.toJSON());
                    let l = new THREE.ObjectLoader();
                    let ll = l.parse(JSON.parse(o));
                    scene.add(ll);


                    new PROJECT.AddObject(ll,"group",objects,dataArray,objectProperty);




                }, false );
                reader.readAsText( file );

                break;


        }

    }


};
