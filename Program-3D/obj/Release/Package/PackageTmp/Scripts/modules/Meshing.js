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
        new PROJECT.GetObjectByUuid(objects,this.uuid).geometry = geometry;
        new PROJECT.GetObjectByUuid(objects,this.uuid).material.wireframe = true;
        let mesh = new THREE.Mesh(geometry,new PROJECT.GetObjectByUuid(objects,this.uuid).material);

        for ( let v of dataArray) {
            if(v.uuid === this.uuid) {
                v.geometry.type = "Meshed";
                v.materials.material = JSON.stringify(new PROJECT.GetObjectByUuid(objects,this.uuid).material.toJSON());
                v.obj = JSON.stringify(mesh.toJSON());
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);
                break;
            }
        }
        alert("Finish Meshing")
    }
}