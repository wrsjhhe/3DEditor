

function ClickAddGraph(project) {

        var signals = project.signals;
        var sceneHelpers = project.sceneHelpers;
        var controls = project.controls;
        var scene = project.scene;
        var camera = project.camera;
        var height = project.height;
        var width = project.width;
        var startX,startZ,endX,endY,endZ; //声明起始点与结束点X,Y坐标
        var mouse = new THREE.Vector2(); //定义一个Vector2D对象存储鼠标屏幕坐标


    this.twoClick = function(ModelType) {

            document.getElementById("viewport").addEventListener('mousedown',startComputeDistance,false);

            //鼠标按下开始绘图
            function startComputeDistance (event){

                event.preventDefault();
                if(event.button !== 0) return; //如果不是鼠标左键点击return
                //确定鼠标按下时的屏幕坐标
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster(); //定义一条射线
                raycaster.setFromCamera( mouse, camera ); //射线从相机到鼠标位置
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]] ); //射线与基准面相交确定交点
                var intersect = intersects[ 0 ];

                if ( intersects.length > 0 ){
                    controls.enabled = false; //关闭视角移动
                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));
                    //根据交点位置确地绘图起始点
                    startX = intersect.point.x;
                    startZ = intersect.point.z;
                    document.getElementById("viewport").removeEventListener('mousedown',startComputeDistance,false);
                    document.getElementById("viewport").addEventListener("mousemove",moving,false);

                }

            }

            //在鼠标按下过程中的移动事件
            function moving(event){
                if(event.button !== 0) return;
                event.preventDefault();
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]]);
                var intersect = intersects[ 0 ];
                if ( intersects.length > 0 ){
                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                    //根据鼠标与基准面位置确定绘图最终坐标
                    endX = intersect.point.x;
                    endZ = intersect.point.z;

                    switch (ModelType){
                        case "sphere":
                            $("#inputRadius_Sphere")[0].value = Math.sqrt((endX-startX)*(endX-startX)+(endZ-startZ)*(endZ-startZ)) ;
                    }
                }
                document.addEventListener("keydown",quit,false);

                createModels3D(ModelType);  //生成新的物体
                ( scene.getObjectByName("TempMesh")!==undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);

                document.getElementById("viewport").addEventListener('mousedown',endComputeDistance,false);

                function quit(e) {
                    if(e.which ===27)
                    {
                        document.getElementById("viewport").removeEventListener("mousemove",moving,false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        document.getElementById("viewport").removeEventListener("mousedown",endComputeDistance,false);
                    }
                }
            }

            //最后moveup事件确定最后生成的物体
            function endComputeDistance (event) {

                controls.enabled = true;  //开启视角移动
                if(event.button !== 0) return;
                document.getElementById("viewport").removeEventListener("mousemove",moving,false); //取消mousemove事件
                event.preventDefault();
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]] );
                var intersect = intersects[ 0 ];
                if ( intersects.length > 0 ){
                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));
                    endX = intersect.point.x;
                    endZ = intersect.point.z;
                }

                if(endX ===startX && endZ ===startZ)return;
                createModels3D(ModelType); //生成最后的物体

                project.objects.push(scene.getObjectByName("TempMesh"));

                scene.getObjectByName("TempMesh").geometry.computeBoundingSphere();
                scene.getObjectByName("TempMesh").position.set(scene.getObjectByName("TempMesh").geometry.boundingSphere.center.x,scene.getObjectByName("TempMesh").geometry.boundingSphere.center.y,scene.getObjectByName("TempMesh").geometry.boundingSphere.center.z);
                var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
                matrix.set(
                    1,0,0,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.x,
                    0,1,0,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.y,
                    0,0,1,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.z,
                    0,0,0,1
                );
                scene.getObjectByName("TempMesh").geometry.applyMatrix(matrix);
                scene.getObjectByName("TempMesh").name = "Object"+ number.toString();
                dataArray.push(new objData(scene.getObjectByName("Object"+ number.toString())));
                console.log(scene.getObjectByName("Object"+project.objects.length.toString()));
                document.getElementById("viewport").removeEventListener("mousedown",endComputeDistance,false);
                number+=1;
                signals.grid.dispatch();
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                switch (ModelType)
                {
                    case "sphere":
                        $("#sphereWindow").data("kendoWindow").close();
                        break;

                }

            }
        };

        this.threeClick = function (ModelType) {

            document.getElementById("viewport").addEventListener('mousedown',startComputeDistance,false);
            //鼠标按下开始绘图
            function startComputeDistance (event){

                event.preventDefault();
                if(event.button !== 0) return; //如果不是鼠标左键点击return
                //确定鼠标按下时的屏幕坐标
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster(); //定义一条射线
                raycaster.setFromCamera( mouse, camera ); //射线从相机到鼠标位置
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]] ); //射线与基准面相交确定交点
                var intersect = intersects[ 0 ];

                if ( intersects.length > 0 ){
                    controls.enabled = false; //关闭视角移动
                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));
                    //根据交点位置确地绘图起始点
                    startX = intersect.point.x;
                    startZ = intersect.point.z;
                    document.getElementById("viewport").removeEventListener('mousedown',startComputeDistance,false);
                    document.getElementById("viewport").addEventListener("mousemove",moving1,false);

                }
            }

            function moving1() {

                if(event.button !== 0) return;
                event.preventDefault();
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]]);
                var intersect = intersects[ 0 ];
                if ( intersects.length > 0 ){
                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                    //根据鼠标与基准面位置确定绘图最终坐标
                    endX = intersect.point.x;
                    endZ = intersect.point.z;

                    switch (ModelType) {

                        case "cuboid":
                            $("#inputLength_Cuboid")[0].value = Math.abs(endX - startX) ;
                            $("#inputWidth_Cuboid")[0].value = Math.abs(endZ - startZ);
                            break;

                        case "cylinder":
                            $("#inputRadius_Cylinder")[0].value = Math.abs(endX - startX) ;
                            break;

                        case "cone":
                            $("#inputRadius_Cone")[0].value = Math.abs(endX - startX) ;
                            break;

                    }


                }
                document.addEventListener("keydown",quit,false);
                function quit(e) {
                    if(e.which ===27)
                    {
                        document.getElementById("viewport").removeEventListener("mousemove",moving1,false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        document.getElementById("viewport").removeEventListener("mousedown",endComputeDistance,false);
                    }
                }

                switch (ModelType)
                {
                    case "cuboid":
                        createModels2D("plane");         //生成底板
                        break;
                    case "cylinder":
                        createModels2D("circle");
                        break;
                    case "cone":
                        createModels2D("circle");
                        break;

                }

                ( scene.getObjectByName("TempMesh")!==undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);

                document.getElementById("viewport").addEventListener('mousedown',finishFloor,false);

            }

            function finishFloor() {

                document.getElementById("viewport").removeEventListener("mousemove",moving1,false);
                switch (ModelType)
                {
                    case "cuboid":
                        createModels2D("plane");         //生成底板
                        break;
                    case "cylinder":
                        createModels2D("circle");
                        break;
                    case "cone":
                        createModels2D("circle");
                        break;

                }
                document.getElementById("viewport").addEventListener("mousemove",moving2,false);

            }

            //在鼠标按下过程中的移动事件
            function moving2(event){
                console.log(finishFloor())
                document.getElementById("viewport").removeEventListener('mousedown',finishFloor,false);
                if(event.button !== 0) return;
                event.preventDefault();
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]]);
                var intersect = intersects[ 0 ];
                if ( intersects.length > 0 ){

                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                    endY = (endZ - intersect.point.z +endX - intersect.point.x)/2;       //根据鼠标与基准面位置确定绘图最终坐标
                    switch (ModelType){
                        case "cuboid":
                            $("#inputHeight_Cuboid")[0].value = endY;
                            break;

                        case "cylinder":
                            $("#inputHeight_Cylinder")[0].value = endY;
                            break;

                        case "cone":
                            $("#inputHeight_Cone")[0].value = endY;
                            break;

                    }

                }


                document.addEventListener("keydown",quit,false);
                function quit(e) {
                    if(e.which ===27)
                    {
                        document.getElementById("viewport").removeEventListener("mousemove",moving2,false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        document.getElementById("viewport").removeEventListener("mousedown",endComputeDistance,false);
                    }
                }

                if(endX ===startX && endZ ===startZ )return;
                if(scene.getObjectByName("TempMesh")!==undefined)
                    scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                createModels3D(ModelType);  //生成新的物体

                ( scene.getObjectByName("TempMesh")!==undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);

                document.getElementById("viewport").addEventListener('mousedown',endComputeDistance,false);

            }

            //最后moveup事件确定最后生成的物体
            function endComputeDistance (event) {

                scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                controls.enabled = true;  //开启视角移动
                if(event.button !== 0) return;
                document.getElementById("viewport").removeEventListener("mousemove",moving2,false); //取消mousemove事件
                event.preventDefault();
                mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(width/window.innerWidth);
                mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(height/window.innerHeight);

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( [sceneHelpers.children[0]] );
                var intersect = intersects[ 0 ];
                if ( intersects.length > 0 ){

                    if(scene.getObjectByName("TempMesh")!==undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));

                   endY = (endZ - intersect.point.z +endX - intersect.point.x)/2 ;  //根据鼠标与基准面位置确定绘图最终坐标

                }

                if(endX ===startX && endZ ===startZ )return;
                createModels3D(ModelType); //生成最后的物体
                project.objects.push(scene.getObjectByName("TempMesh"));

                scene.getObjectByName("TempMesh").geometry.computeBoundingSphere();
                scene.getObjectByName("TempMesh").position.set(scene.getObjectByName("TempMesh").geometry.boundingSphere.center.x,scene.getObjectByName("TempMesh").geometry.boundingSphere.center.y,scene.getObjectByName("TempMesh").geometry.boundingSphere.center.z);
                var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
                matrix.set(
                    1,0,0,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.x,
                    0,1,0,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.y,
                    0,0,1,-scene.getObjectByName("TempMesh").geometry.boundingSphere.center.z,
                    0,0,0,1
                );
                scene.getObjectByName("TempMesh").geometry.applyMatrix(matrix);
                scene.getObjectByName("TempMesh").name = "Object"+ number.toString();
                dataArray.push(new objData(scene.getObjectByName("Object"+ number.toString())));
                console.log(scene.getObjectByName("Object"+project.objects.length.toString()));
                document.getElementById("viewport").removeEventListener("mousedown",endComputeDistance,false);
                number+=1;
                signals.grid.dispatch();
                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                switch (ModelType)
                {
                    case "cuboid":
                        $("#cuboidWindow").data("kendoWindow").close();
                        break;
                    case "cylinder":
                        $("#cylinderWindow").data("kendoWindow").close();
                        break;
                    case "cone":
                        $("#coneWindow").data("kendoWindow").close();
                        break;
                }

            }

        };

         //确定生成物体类别
        function createModels2D(model) {

            switch (model)
            {
                case "plane":
                    createPlane();
                    break;
                case "circle":
                    createCircle();
                    break;
            }

        }

        function createModels3D(model){

            switch (model)
            {
                case "cuboid":
                    createCuboid();
                    break;
                case "sphere":
                    createSphere();
                    break;
                case "cylinder":
                    createCylinder();
                    break;
                case "cone":
                    createCone();
                    break;
            }

        }



        //生成圆
        function createCircle() {

            var r;
            r = Math.sqrt((endX-startX)*(endX-startX)+(endZ-startZ)*(endZ-startZ));  //确定圆的半径
            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }
            var geometry = new THREE.CircleGeometry(r,32);
            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,startX,
                0,2.220446049250313e-16,-1,0,
                0,1,2.220446049250313e-16,startZ,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);
            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 } );
            var mesh = new THREE.Mesh(geometry,material);

            mesh.name = 'TempMesh';
            scene.add( mesh );

        }

        //生成平面
        function createPlane() {

            var shape = new THREE.Shape();
            shape.moveTo( startX,startZ ); //起始点
            shape.lineTo( endX , startZ ); //移动到的第一点，下面类推
            shape.lineTo( endX ,endZ );
            shape.lineTo( startX, endZ );
            shape.lineTo( startX,startZ);

            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }

            var geometry = new THREE.ShapeGeometry(shape);
            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,0,
                0,2.220446049250313e-16,-1,0,
                0,1,2.220446049250313e-16,0,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);
            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 } );
            var mesh = new THREE.Mesh( geometry, material ) ;
            mesh.name = 'TempMesh';
            scene.add( mesh );
        }

        //生成长方体
        function createCuboid (){
            //定义Shape的路径
            var shape = new THREE.Shape();
            shape.moveTo( startX,startZ ); //起始点
            shape.lineTo( endX , startZ ); //移动到的第一点，下面类推
            shape.lineTo( endX ,endZ );
            shape.lineTo( startX, endZ );
            shape.lineTo( startX,startZ);


            //设置Z轴拉伸设置
            var extrudeSettings = {
                steps: 1, //拉伸次数（精度？）
                amount:endY, //拉伸距离
                bevelEnabled: false //是否启用倒角
                /*    bevelThickness: 1,
                 bevelSize: 1,
                 bevelSegments: 1*/
            };


            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }
            var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,0,
                0,2.220446049250313e-16,1,0,
                0,1,2.220446049250313e-16,0,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);

            //设置每个面的纹理UV坐标
            var face1 = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
            var face2 = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
            var face3 = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
            var face4 = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
            var face5 = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
            var face6 = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

            //将纹理UV坐标映射到物体几何表面
            geometry.faceVertexUvs[0] = [];
            geometry.faceVertexUvs[0][0] = [ face1[3], face1[0], face1[1] ];
            geometry.faceVertexUvs[0][1] = [ face1[1], face1[2], face1[3] ];

            geometry.faceVertexUvs[0][2] = [ face2[3], face2[0], face2[1] ];
            geometry.faceVertexUvs[0][3] = [ face2[1], face2[2], face2[3] ];

            geometry.faceVertexUvs[0][4] = [ face3[0], face3[1], face3[3] ];
            geometry.faceVertexUvs[0][5] = [ face3[1], face3[2], face3[3] ];

            geometry.faceVertexUvs[0][6] = [ face4[0], face4[1], face4[3] ];
            geometry.faceVertexUvs[0][7] = [ face4[1], face4[2], face4[3] ];

            geometry.faceVertexUvs[0][8] = [ face5[0], face5[1], face5[3] ];
            geometry.faceVertexUvs[0][9] = [ face5[1], face5[2], face5[3] ];

            geometry.faceVertexUvs[0][10] = [ face6[0], face6[1], face6[3] ];
            geometry.faceVertexUvs[0][11] = [ face6[1], face6[2], face6[3] ];

            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 ,side:THREE.DoubleSide} );
            var mesh = new THREE.Mesh( geometry, material ) ;
            mesh.name = 'TempMesh';
            scene.add( mesh );
        }

    //生成球体
        function createSphere (){
            var r;
            r = Math.sqrt((endX-startX)*(endX-startX)+(endZ-startZ)*(endZ-startZ));  //确定圆的半径
            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }
            var geometry = new THREE.SphereGeometry(r,32,32);
            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,startX,
                0,1,0,0,
                0,0,1,startZ,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);
            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 } );
            var mesh = new THREE.Mesh(geometry,material);
            mesh.name = 'TempMesh';
            scene.add(mesh);
        }

        //生成圆柱
        function createCylinder() {

            var r;
            r = Math.sqrt((endX-startX)*(endX-startX)+(endZ-startZ)*(endZ-startZ));  //确定圆的半径
            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }
            var geometry = new THREE.CylinderGeometry(r,r,endY,32);

            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,startX,
                0,1,0,endY/2,
                0,0,1,startZ,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);

            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 } );
            var mesh = new THREE.Mesh(geometry ,material);
            mesh.name = 'TempMesh';
            scene.add(mesh);

        }

        //圆锥
        function createCone() {

            var r;
            r = Math.sqrt((endX-startX)*(endX-startX)+(endZ-startZ)*(endZ-startZ));
            if(endX ===startX && endZ ===startZ) //如果鼠标没有移动return
            {
                return;
            }
            var geometry = new THREE.ConeBufferGeometry( r, endY, 32 );
            var matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1,0,0,startX,
                0,1,0,endY/2,
                0,0,1,startZ,
                0,0,0,1
            );
            geometry.applyMatrix(matrix);

            var material = new THREE.MeshPhongMaterial( { color: document.getElementById("ColorInput").value || 0x171c21 } );
            var mesh = new THREE.Mesh(geometry ,material);

            mesh.name = 'TempMesh';
            scene.add(mesh);





        }




























}


