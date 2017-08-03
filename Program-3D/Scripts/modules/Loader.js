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

                    for ( let v of Project.dataArray) {

                        if(v.uuid === Project.uuid) {
                         v.materials.textureSrc = this.src;

                         INDEXDB.putData(myDB.db,myDB.ojstore.name,Project.dataArray);
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

                    console.log(objModel);
                    let o = JSON.stringify(objModel.toJSON());
                    let l = new THREE.ObjectLoader();
                    let ll = l.parse(JSON.parse(o));
                    console.log(ll)
                    Project.scene.add(ll);


                    Project.addObject(ll,"group");




                }, false );
                reader.readAsText( file );

                break;


        }

    }


};
