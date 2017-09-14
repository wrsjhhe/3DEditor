class Cutting
{
    constructor(vertices,faces1,faces2,uuid){
        this.vertices = vertices;
        this.faces1 = faces1;
        this.faces2 = faces2;
        this.uuid = uuid;
    }
    begin(){
        let f1 = [],f2 = [];
        this.faces1.forEach(function(e){
            f1.push(new THREE.Face3(e.a,e.b,e.c))
        });
        this.faces2.forEach(function(e){
            f2.push(new THREE.Face3(e.a,e.b,e.c))
        });
        let geom1 = new THREE.Geometry(),
            geom2 = new THREE.Geometry();
        geom1.vertices = geom2.vertices = this.vertices;
        let v1 = [],v2 = [];
        this.vertices.forEach(function(e){
            v1.push(new THREE.Vector3(e.x,e.y,e.z));
            v2.push(new THREE.Vector3(e.x,e.y,e.z));
        });
        geom1.vertices = v1;geom2.vertices = v2;
        geom1.faces = f1;geom2.faces = f2;
        geom1.mergeVertices();geom2.mergeVertices();
        let material1 = new PROJECT.GetObjectByUuid(objects,this.uuid).material.clone();
        let material2 = new PROJECT.GetObjectByUuid(objects,this.uuid).material.clone();
        let mesh1 = new THREE.Mesh(geom1,material1);
        let mesh2 = new THREE.Mesh(geom2,material2);
        new PROJECT.DeleteObject(null,true);
        scene.add(mesh1);
        scene.add(mesh2);console.log(mesh1);console.log(mesh2);
        new PROJECT.AddObject(mesh1,"cutted1",objects,dataArray,null);
        new PROJECT.AddObject(mesh2,"cutted2",objects,dataArray,null);


    }
}