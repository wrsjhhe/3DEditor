//页面加载时打开数据库

let getAllData =  setInterval(function () {
    if (myDB.db!==null){
        INDEXDB.getAllData(myDB.db, myDB.ojstore.name,initModels);
        clearInterval(getAllData);
       /* let v = [
            new THREE.Vector3(-100,30,10),
            new THREE.Vector3(-100,30,-10),
            new THREE.Vector3(-100,-10,10),
            new THREE.Vector3(-100,-10,-10),
            new THREE.Vector3(-110,30,-10),
            new THREE.Vector3(-110,30,10),
            new THREE.Vector3(-110,-10,-10),
            new THREE.Vector3(-110,-10,10)
        ];
        let f = [
            new THREE.Face3(0,2,1),
            new THREE.Face3(2,3,1),
            new THREE.Face3(4,6,5),
            new THREE.Face3(6,7,5),
            new THREE.Face3(4,5,1),
            new THREE.Face3(5,0,1),
            new THREE.Face3(7,6,2),
            new THREE.Face3(6,3,2),
            new THREE.Face3(5,7,0),
            new THREE.Face3(7,2,0),
            new THREE.Face3(1,3,4),
            new THREE.Face3(3,6,4)
        ];
        let g = new THREE.Geometry();
        g.mergeVertices();
        g.vertices = v;g.faces = f;
        g.computeBoundingBox();
        let centroid = new THREE.Vector3();
        centroid.addVectors(g.boundingBox.min, g.boundingBox.max).divideScalar(2);
        g.center();

        let m = new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide});
        let mm = new THREE.Mesh(g,m);mm.position.copy(centroid);
        scene.add(mm);
        new PROJECT.AddObject(mm,"q",objects,dataArray,null);*/
    }
});

function initModels() {
    if (result_Customize.position.length !== 0) {
        for (let i in result_Customize.position) {
            let faces = JSON.parse(result_Customize.geometries[i].faces);
            let vertices = JSON.parse(result_Customize.geometries[i].vertices);
            let geometry = new THREE.Geometry();
            geometry.faces = faces;
            geometry.vertices = vertices;

            //设置每个面的纹理UV坐标
            let face1 = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
            let face2 = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
            let face3 = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
            let face4 = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
            let face5 = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
            let face6 = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

            //将纹理UV坐标映射到物体几何表面
            geometry.faceVertexUvs[0] = [];
            geometry.faceVertexUvs[0][0] = [face1[3], face1[0], face1[1]];
            geometry.faceVertexUvs[0][1] = [face1[1], face1[2], face1[3]];

            geometry.faceVertexUvs[0][2] = [face2[3], face2[0], face2[1]];
            geometry.faceVertexUvs[0][3] = [face2[1], face2[2], face2[3]];

            geometry.faceVertexUvs[0][4] = [face3[0], face3[1], face3[3]];
            geometry.faceVertexUvs[0][5] = [face3[1], face3[2], face3[3]];

            geometry.faceVertexUvs[0][6] = [face4[0], face4[1], face4[3]];
            geometry.faceVertexUvs[0][7] = [face4[1], face4[2], face4[3]];

            geometry.faceVertexUvs[0][8] = [face5[0], face5[1], face5[3]];
            geometry.faceVertexUvs[0][9] = [face5[1], face5[2], face5[3]];

            geometry.faceVertexUvs[0][10] = [face6[0], face6[1], face6[3]];
            geometry.faceVertexUvs[0][11] = [face6[1], face6[2], face6[3]];


            let materialLoader = new THREE.MaterialLoader();
            let material = materialLoader.parse(JSON.parse(result_Customize.materials[i].material));
            material.map = null;

            if (result_Customize.materials[i].textureSrc !== undefined) {
                let im = new Image();
                im.src = result_Customize.materials[i].textureSrc;
                let texture = new THREE.Texture(im);
                texture.minFilter = THREE.NearestFilter;
                texture.needsUpdate = true;
                material.map = texture;
                material.needsUpdate = true;
            }

            let mesh = new THREE.Mesh(geometry, material);
            mesh.geometry.type = "ExtrudeGeometry";

            let position = JSON.parse(result_Customize.position[i]);
            let scale = JSON.parse(result_Customize.scale[i]);
            let rotation = JSON.parse(result_Customize.rotation[i]);

            mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
            mesh.scale.x = scale.x; mesh.scale.y = scale.y; mesh.scale.z = scale.z;
            mesh.rotation.x = rotation._x; mesh.rotation.y = rotation._y; mesh.rotation.z = rotation._z;

            mesh.name = result_Customize.name[i];

            objects.push(mesh);

            scene.add(mesh);

            let newData = new objData(1, mesh, result_Customize.materials[i].textureSrc);
            newData.keyId = result_Customize.keyId[i];
            newData.text = result_Customize.text[i];

            dataArray.push(newData);

            INDEXDB.putData(myDB.db, myDB.ojstore.name, dataArray);

            $("#objDiv").data("kendoGrid").dataSource.read();

        }
    }

    if (result_Normal.position.length !== 0) {

        for (let i in result_Normal.position) {
            let data = JSON.parse(result_Normal.objects[i]);

            if (data.metadata === undefined) { // 2.0

                data.metadata = { type: 'Geometry' };

            }
            if (data.metadata.type === undefined) { // 3.0

                data.metadata.type = 'Geometry';

            }
            let loader = new THREE.ObjectLoader();
            loader.setTexturePath('');

            let mesh = loader.parse(data);

            let position = JSON.parse(result_Normal.position[i]);
            let scale = JSON.parse(result_Normal.scale[i]);
            let rotation = JSON.parse(result_Normal.rotation[i]);

            mesh.position.x = position.x; mesh.position.y = position.y; mesh.position.z = position.z;
            mesh.scale.x = scale.x; mesh.scale.y = scale.y; mesh.scale.z = scale.z;
            mesh.rotation.x = rotation._x; mesh.rotation.y = rotation._y; mesh.rotation.z = rotation._z;

            mesh.name = result_Normal.name[i];

            let materialLoader = new THREE.MaterialLoader();
            let material = materialLoader.parse(JSON.parse(result_Normal.materials[i].material));
            mesh.material = material;

            if (result_Normal.materials[i].textureSrc !== undefined) {
                let im = new Image();
                im.src = result_Normal.materials[i].textureSrc;
                let texture = new THREE.Texture(im);
                texture.minFilter = THREE.NearestFilter;
                texture.needsUpdate = true;
                material.map = texture;
                material.needsUpdate = true;
            }

            let objectProperty;
            try {
                objectProperty = {
                    lineCurve: JSON.parse(result_Normal.geometries[i].lineCurve),
                };
            } catch (e) {
                objectProperty = undefined;
            }

            objects.push(mesh);
            scene.add(mesh);
            let newData = new objData(0, mesh, result_Normal.materials[i].textureSrc, objectProperty);
            newData.keyId = result_Normal.keyId[i];
            newData.text = result_Normal.text[i];

            dataArray.push(newData);
            INDEXDB.putData(myDB.db, myDB.ojstore.name,dataArray);

            $("#objDiv").data("kendoGrid").dataSource.read();

        }

    }
}




