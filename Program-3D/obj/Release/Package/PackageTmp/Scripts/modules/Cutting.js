class Cutting
{
    constructor(uuid){
        this.$cuttingWindow = $("<div id='cuttingWindow'>");
        this.vertices = null;
        this.faces1 = null;
        this.faces2 = null;
        this.uuid = uuid;
    }
    init(){

        this.$cuttingWindow.append(`
            <table class="cutting-table">
                 <tr style="font-size: 20px">
                     <td>平移:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
                     <td><a href="#" class="cutting-table">+</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a href="#" class="cutting-table">-</a></td>
                 </tr>
                 <tr style="font-size: 20px">
                     <td>X-旋转:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
                     <td><a href="#" class="cutting-table">+</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a href="#" class="cutting-table">-</a></td>
                 </tr>
                 <tr style="font-size: 20px">
                    <td>Y-旋转:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
                    <td><a href="#" class="cutting-table">+</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a href="#" class="cutting-table">-</a></td>
                 </tr><tr style="font-size: 20px">
                    <td>Z-旋转:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
                    <td><a href="#" class="cutting-table">+</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a href="#" class="cutting-table">-</a></td>
                 </tr>
            </table>
            <button id="cutting-button">切割</button>
        `);
        $('body').append(this.$cuttingWindow);

        this.$cuttingWindow.kendoWindow({
            position: {
                top: 100,
                left: 300
            },
            width: "200px",
            title: "切割",
            visible: false,
        }).data("kendoWindow").open();
        let obj = new PROJECT.GetObjectByUuid(objects,this.uuid);
        obj.geometry.computeBoundingBox();
        let minV = obj.geometry.boundingBox.min,maxV = obj.geometry.boundingBox.max;
        let size = Math.sqrt((maxV.x-minV.x)**2+(maxV.y-minV.y)**2+(maxV.z-minV.z)**2);
        let geometry = new THREE.PlaneGeometry(size,size);
        let material = new THREE.MeshBasicMaterial({color:0xff0000,opacity:0.2,transparent:true,side:2});
        let mesh = new THREE.Mesh(geometry,material);
        mesh.position.x = obj.position.x;
        mesh.position.y = obj.position.y;
        mesh.position.z = obj.position.z;
        sceneHelpers.add(mesh);
        this.helper = mesh;

        $(".cutting-table a")[0].addEventListener("click",e=>{
            mesh.position.x+=20;
        },false);
        $(".cutting-table a")[1].addEventListener("click",e=>{
            mesh.position.x-=20;
        },false);
        $(".cutting-table a")[2].addEventListener("click",e=>{
            mesh.rotation.x+=Math.PI/18;
        },false);
        $(".cutting-table a")[3].addEventListener("click",e=>{
            mesh.rotation.x-=Math.PI/18;
        },false);
        $(".cutting-table a")[4].addEventListener("click",e=>{
            mesh.rotation.y+=Math.PI/18;
        },false);
        $(".cutting-table a")[5].addEventListener("click",e=>{
            mesh.rotation.y-=Math.PI/18;
        },false);
        $(".cutting-table a")[6].addEventListener("click",e=>{
            mesh.rotation.z+=Math.PI/18;
        },false);
        $(".cutting-table a")[7].addEventListener("click",e=>{
            mesh.rotation.z-=Math.PI/18;
        },false);

        $("#cutting-button")[0].addEventListener("click",e=>{
            this.helperVertices = new PROJECT.GetCurrentVertices(mesh);
            this.helperVertices.pop();
            let hvArray = [
                this.helperVertices[0].x,this.helperVertices[0].y,this.helperVertices[0].z,
                this.helperVertices[1].x,this.helperVertices[1].y,this.helperVertices[1].z,
                this.helperVertices[2].x,this.helperVertices[2].y,this.helperVertices[2].z,
            ];
            this.sendData(hvArray);
        },false);

    }

    sendData(helperVertices){
        let scope = this;
        let object = new PROJECT.GetObjectByUuid(objects,this.uuid);
        let faces = new PROJECT.GetObjectDataByUuid(dataArray, this.uuid).geometry.faces;
        let vertices = JSON.stringify(new PROJECT.GetCurrentVertices(object));
        $.ajax({
            type: 'post',
            url: '../Work/Cutting',
            dataType: 'json',
            data: {
                vertices: vertices,
                faces: faces,
                helperVertices:helperVertices
            },
            success: function (result) {
                scope.vertices = result.ResultV;
                scope.faces1 = result.ResultF1;
                scope.faces2 = result.ResultF2;
                scope.reconstruction();

            },
            error: function (message) {
                alert('error!');
            }

        });
    }

    reconstruction(){
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
        material1.side = 2;material2.side = 2;
        let mesh1 = new THREE.Mesh(geom1,material1);
        let mesh2 = new THREE.Mesh(geom2,material2);
        new PROJECT.DeleteObject(null,true,undefined,this.uuid);
        scene.add(mesh1);
        scene.add(mesh2);console.log(mesh1);console.log(mesh2);
        new PROJECT.AddObject(mesh1,"cutted1",objects,dataArray,null);
        new PROJECT.AddObject(mesh2,"cutted2",objects,dataArray,null);

        this.$cuttingWindow.data("kendoWindow").destroy();

        (this.helper.material.map)&&(this.helper.material.map.dispose());
        this.helper.geometry.dispose();
        this.helper.material.dispose();
        sceneHelpers.remove(this.helper);

        alert("Finish Cutting");
    }
}