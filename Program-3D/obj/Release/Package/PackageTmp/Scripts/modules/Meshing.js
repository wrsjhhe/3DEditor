class Meshing
{
    constructor(vertices,faces,uuid){
        this.uuid = uuid;
        this.vertices = vertices;
        this.faces = faces;
    }
    begin(){
        let v = [],f = [];
        this.vertices.forEach(function(e){
            v.push(new THREE.Vector3(e.x,e.y,e.z));
        });
        this.faces.forEach(function(e){
            f.push(new THREE.Face3(e.a,e.b,e.c))
        });
        let geometry = new THREE.Geometry();
        geometry.vertices = v;
        geometry.faces = f;
/*        let colorArray = [];
        geometry.vertices.forEach(function (e) {
            colorArray.push({v:e,c:new THREE.Color(Math.random()*0xffffff) })
        });
        geometry.faces.forEach(function (e) {
            let a =  colorArray.find(f=>f.v===geometry.vertices[e.a]);
            let b =  colorArray.find(f=>f.v===geometry.vertices[e.b]);
            let c =  colorArray.find(f=>f.v===geometry.vertices[e.c]);

            e.vertexColors[0] = a.c;e.vertexColors[1] = b.c;e.vertexColors[2] = c.c;
        });

        new PROJECT.GetObjectByUuid(objects,this.uuid).geometry = geometry;
        new PROJECT.GetObjectByUuid(objects,this.uuid).material.side = 2;
        new PROJECT.GetObjectByUuid(objects,this.uuid).material.vertexColors = THREE.VertexColors;
        let material = new THREE.MeshBasicMaterial({
            side:THREE.DoubleSide,
            vertexColors: THREE.VertexColors
        });
        let mesh = new THREE.Mesh(geometry,material);*/


        new PROJECT.GetObjectByUuid(objects,this.uuid).geometry = geometry;
        new PROJECT.GetObjectByUuid(objects,this.uuid).material.wireframe = true;
        let mesh = new THREE.Mesh(geometry,new PROJECT.GetObjectByUuid(objects,this.uuid).material);

        for ( let v of dataArray) {
            if(v.uuid === this.uuid) {
                v.geometry.type = "Meshed";
                v.geometry.vertices = JSON.stringify(new PROJECT.GetObjectByUuid(objects,this.uuid).geometry.vertices);
                v.geometry.faces= JSON.stringify(new PROJECT.GetObjectByUuid(objects,this.uuid).geometry.faces);
                v.materials.material = JSON.stringify(new PROJECT.GetObjectByUuid(objects,this.uuid).material.toJSON());
                v.obj = JSON.stringify(mesh.toJSON());
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);
                break;
            }
        }
        alert("Finish Meshing")
    }
}