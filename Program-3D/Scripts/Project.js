
(function (global,factory) {
    factory((global.PROJECT = global.PROJECT || {}));
})(this,(function (exports) {

    function GetObjectByUuid(objects,uuid){
        for(let i in objects)
        {
            if (objects[i].uuid === uuid)
                return objects[i];
        }
    };

    function GetObjectDataByUuid(data,uuid) {
        for(let i in data)
        {
            if( data[i].uuid !==undefined && data[i].uuid === uuid)
            {
                return data[i]
            }
        }
    }

    function Render() {
        return function (renderer,camera,scene,sceneHelpers) {
            renderer.render(scene,camera);
            renderer.render(sceneHelpers,camera);
        }
    }

    function WindowResized(renderer,render,camera,container) {

        //重置相机视角范围
        camera.aspect = container.clientWidth/container.clientHeight;
        camera.updateProjectionMatrix();

        //重置渲染范围
        renderer.setSize( container.clientWidth,container.clientHeight);

        render;
    }

    function GetSelected(event,mouse,container) {
        event.preventDefault();
        if (event.button !== 0) return; //如果不是鼠标左键点击return
        //确定鼠标按下时的屏幕坐标
        mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1) / (container.clientWidth / window.innerWidth);
        mouse.y = (-( event.clientY / window.innerHeight ) * 2 + 1) / (container.clientHeight / window.innerHeight);

        let raycaster = new THREE.Raycaster(); //定义一条射线
        raycaster.setFromCamera(mouse, camera); //射线从相机到鼠标位置
        let intersects = raycaster.intersectObjects([sceneHelpers.children[0]]); //射线与基准面相交确定交点
        return intersects[0];
    }

    function AddObject(obj,ModelType,objects,dataArray,objectProperty) {

        if( !(obj instanceof THREE.Group)) {
            obj.geometry.computeBoundingSphere();
            obj.position.set(
                obj.geometry.boundingSphere.center.x,
                obj.geometry.boundingSphere.center.y,
                obj.geometry.boundingSphere.center.z
            );
            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1, 0, 0, -obj.geometry.boundingSphere.center.x,
                0, 1, 0, -obj.geometry.boundingSphere.center.y,
                0, 0, 1, -obj.geometry.boundingSphere.center.z,
                0, 0, 0, 1
            );
            obj.geometry.applyMatrix(matrix);
        }


        obj.name = ModelType;

        objects.push(obj);
        switch (ModelType)
        {
            case "cuboid":
                dataArray.push(new objData(1,obj,undefined,objectProperty));
                break;
            case "group":
                dataArray.push(new objData(2,obj,undefined,objectProperty));
                break;
            default :
                dataArray.push(new objData(0,obj,undefined,objectProperty));
        }


        INDEXDB.putData(myDB.db, myDB.ojstore.name, dataArray);

         $("#objDiv").data("kendoGrid").dataSource.read();

    }

    function ClickAddGraph(scene,container) {

        let startX, startZ, endX, endY, endZ; //声明起始点与结束点X,Y坐标
        let mouse = new THREE.Vector2(); //定义一个Vector2D对象存储鼠标屏幕坐标
      /*  function showWindow(ModelType) {
            switch (ModelType) {

                case "cuboid":
                    $("#inputLength_Cuboid")[0].value = Math.abs(endX - startX);
                    $("#inputWidth_Cuboid")[0].value = Math.abs(endZ - startZ);
                    $("#inputHeight_Cuboid")[0].value = endY || 0;
                    break;

                case "cylinder":
                    $("#inputRadius_Cylinder")[0].value = Math.abs(endX - startX);
                    $("#inputHeight_Cylinder")[0].value = endY || 0;
                    break;

                case "cone":
                    $("#inputRadius_Cone")[0].value = Math.abs(endX - startX);
                    $("#inputHeight_Cone")[0].value = endY || 0;
                    break;
                case "sphere":
                    $("#inputRadius_Sphere")[0].value = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));
                    break;
                case "roadWay":
                    break;
                case "line":
                case "circle":
                case "plane":
                    break;

            }
        }

        function closeWindow(ModelType) {
            switch (ModelType) {

                case "cuboid":
                    $("#cuboidWindow").data("kendoWindow").destroy();
                    break;
                case "cylinder":
                    $("#cylinderWindow").data("kendoWindow").destroy();
                    break;
                case "cone":
                    $("#coneWindow").data("kendoWindow").destroy();
                    break;
                case "sphere":
                    $("#sphereWindow").data("kendoWindow").destroy();
                    break;

            }
        }*/

        //点击两次生成，包含二维图形与球体
        this.twoClick = function (ModelType,objects,dataArray,objectProperty) {

            container.addEventListener('mousedown', startComputeDistance, false);

            //鼠标按下开始绘图
            function startComputeDistance(event) {

                event.preventDefault();
                let intersect = GetSelected(event,mouse,container);

                if (intersect !== undefined) {
                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));
                    //根据交点位置确地绘图起始点

                    startX = intersect.point.x;
                    startZ = intersect.point.z;

                    container.removeEventListener('mousedown', startComputeDistance, false);
                    container.addEventListener('mousemove', moving, false);

                }

            }

            //在鼠标按下过程中的移动事件
            function moving(event) {

                document.addEventListener("keydown", quit, false);
                function quit(e) {
                    if (e.which === 27) {
                        container.removeEventListener('mousemove', moving, false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        container.removeEventListener('mousedown', endComputeDistance, false);
                    }
                }

                let intersect = GetSelected(event,mouse,container);
                if (intersect !== undefined) {
                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                    //根据鼠标与基准面位置确定绘图最终坐标
                    endX = intersect.point.x;
                    endZ = intersect.point.z;

                 //   showWindow(ModelType);

                    if (endX === startX && endZ === startZ)return;
                    switch (ModelType) {

                        case "sphere":
                        case "roadWay":
                            createModels3D(ModelType);  //生成新3D的物体
                            ( scene.getObjectByName("TempMesh") !== undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);
                            break;
                        case "line":
                        case "circle":
                        case "plane":
                            createModels2D(ModelType); //生成新2D的物体
                            break;
                    }
                }
                container.addEventListener('mousedown', endComputeDistance, false);
            }

            //最后点击事件确定最后生成的物体
            function endComputeDistance(event) {
                if (event.button !== 0) return; //如果不是鼠标左键点击return

                container.removeEventListener('mousemove', moving, false);

                let intersect = GetSelected(event,mouse,container);
                if (intersect!==undefined) {

                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));

                    endX = intersect.point.x;
                    endZ = intersect.point.z;
                }

                if (endX === startX && endZ === startZ)return;
                switch (ModelType) {
                    case "sphere":
                        createModels3D(ModelType);   //生成新3D的物体
                        break;
                    case "roadWay":
                        objectProperty = {
                            lineCurve: createModels3D(ModelType),
                        };
                        break;
                    case "line":
                    case "circle":
                    case "plane":
                        createModels2D(ModelType);   //生成新2D的物体
                        break;

                }
                AddObject(scene.getObjectByName("TempMesh"),ModelType,objects,dataArray,objectProperty);

            //    closeWindow(ModelType);

                container.removeEventListener('mousedown', endComputeDistance, false);   //移除鼠标事件

                removeAllEvent();
            }

            function removeAllEvent() {
                container.removeEventListener('mousedown', endComputeDistance, false);
                container.removeEventListener('mousemove', moving, false);
                container.removeEventListener('mousedown', startComputeDistance, false);
            }
        };

        //以三个点生成几何体，包含长方体、圆柱体、圆锥体等
        this.threeClick = function (ModelType,objects,dataArray,objectProperty) {

            container.addEventListener('mousedown', startComputeDistance, false);
            //鼠标按下开始绘图
            function startComputeDistance(event) {
                if (event.button !== 0) return; //如果不是鼠标左键点击return
                let intersect = GetSelected(event,mouse,container);

                if (intersect !== undefined) {
                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));
                    //根据交点位置确地绘图起始点
                    startX = intersect.point.x;
                    startZ = intersect.point.z;
                    container.removeEventListener('mousedown', startComputeDistance, false);
                    container.addEventListener("mousemove", moving1, false);

                }
            }

            //鼠标移动生成底面
            function moving1() {
                if (event.button !== 0) return; //如果不是鼠标左键点击return
                document.addEventListener("keydown", quit, false);
                function quit(e) {
                    if (e.which === 27) {
                        container.removeEventListener("mousemove", moving1, false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        container.removeEventListener("mousedown", endComputeDistance, false);
                    }
                }

                let intersect = GetSelected(event,mouse,container);
                if (intersect !== undefined) {
                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                    //根据鼠标与基准面位置确定绘图最终坐标
                    endX = intersect.point.x;
                    endZ = intersect.point.z;

                    if (endX === startX && endZ === startZ)return;
                   // showWindow(ModelType);
                    drawFloor(ModelType);

                    ( scene.getObjectByName("TempMesh") !== undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);

                    container.addEventListener('mousedown', finishFloor, false);

                }
            }
            function drawFloor() {
                switch (ModelType) {
                    case "cuboid":
                        createModels2D("shape");         //生成底板
                        break;
                    case "cylinder":
                        createModels2D("circle");
                        break;
                    case "cone":
                        createModels2D("circle");
                        break;
                }
            }
            function finishFloor() {

                container.removeEventListener("mousemove", moving1, false);

                drawFloor(ModelType);

                container.addEventListener("mousemove", moving2, false);

            }


            //第二次点击移动生成完整几何体
            function moving2(event) {
                if (event.button !== 0) return; //如果不是鼠标左键点击return
                document.addEventListener("keydown", quit, false);
                function quit(e) {
                    if (e.which === 27) {
                        container.removeEventListener("mousemove", moving2, false);
                        scene.remove(scene.getObjectByName("TempMesh"));
                        container.removeEventListener("mousedown", endComputeDistance, false);
                    }
                }

                container.removeEventListener('mousedown',finishFloor,false);

                let intersect = GetSelected(event,mouse,container);
                if (intersect !== undefined) {

                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                    endY = (endZ - intersect.point.z + endX - intersect.point.x) / 2;       //根据鼠标与基准面位置确定绘图最终坐标

                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                    if (endX === startX && endZ === startZ)return;
                    createModels3D(ModelType);  //生成新的物体

                    ( scene.getObjectByName("TempMesh") !== undefined) && (scene.getObjectByName("TempMesh").material.wireframe = true);

                  //  showWindow(ModelType);

                    container.addEventListener('mousedown', endComputeDistance, false);

                }
            }

            //最后点击事件确定最后生成的物体
            function endComputeDistance(event) {
                if (event.button !== 0) return; //如果不是鼠标左键点击return
                scene.remove(scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                document.getElementById("viewport").removeEventListener("mousemove", moving2, false); //取消mousemove事件

                let intersect = GetSelected(event,mouse,container);
                if (intersect!==undefined) {

                    if (scene.getObjectByName("TempMesh") !== undefined)
                        scene.remove(scene.getObjectByName("TempMesh"));

                    endY = (endZ - intersect.point.z + endX - intersect.point.x) / 2;  //根据鼠标与基准面位置确定绘图最终坐标

                }

                if (endX === startX && endZ === startZ)return;
                createModels3D(ModelType); //生成最后的物体

                AddObject(scene.getObjectByName("TempMesh"),ModelType,objects,dataArray,objectProperty);

              //  closeWindow(ModelType);

                container.removeEventListener("mousedown", endComputeDistance, false);

            }

        };

        /******************* 下面是生成物体方法***************/

        //确定生成物体类别
        function createModels2D(modelType) {

            switch (modelType) {
                case "line":
                    createLine();
                    break;
                case "plane":
                    createPlane();
                    break;
                case "circle":
                    createCircle();
                    break;
                case "shape":
                    createShape();
                    break;
            }
        }

        function createModels3D(modelType) {

            switch (modelType) {
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
                case "roadWay":
                    return createRoadway();
                    break;
            }

        }

        //生成线段
        function createLine() {

            let vector1 = new THREE.Vector3(startX,0,startZ);
            let vector2 =  new THREE.Vector3(endX,0,endZ);

            let geometry = new THREE.Geometry();
            geometry.vertices[0] = vector1;
            geometry.vertices[1] = vector2;

            let material = new THREE.LineBasicMaterial({color:  0x171c21});
            let mesh = new THREE.Line(geometry,material);
            mesh.name = "TempMesh";
            scene.add(mesh);

        }

        //生成圆
        function createCircle() {

            let r;
            r = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));  //确定圆的半径

            let geometry = new THREE.CircleGeometry(r, 32);
            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1, 0, 0, startX,
                0, 1, 0, 0,
                0, 0, 1, startZ,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);
            let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
            let mesh = new THREE.Mesh(geometry, material);

            mesh.name = 'TempMesh';
            scene.add(mesh);

        }

        function createPlane() {
            let length,width;
            length = endX - startX;width = endZ - startZ;

            let geometry = new THREE.PlaneGeometry(length,width);
            let matrix = new THREE.Matrix4();
            matrix.set(
                1, 0, 0, startX+length/2,
                0, 1, 0, 0,
                0, 0, 1,startZ+width/2,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);
            let material = new THREE.MeshPhongMaterial({
                color: document.getElementById("ColorInput").value || 0x171c21,
                side:THREE.DoubleSide
            });

            let mesh = new THREE.Mesh(geometry, material);

            mesh.name = 'TempMesh';
            Project.scene.add(mesh);


        }
        //生成平面
        function createShape() {

            let shape = new THREE.Shape();
            shape.moveTo(startX, startZ); //起始点
            shape.lineTo(endX, startZ); //移动到的第一点，下面类推
            shape.lineTo(endX, endZ);
            shape.lineTo(startX, endZ);
            shape.lineTo(startX, startZ);

            let geometry = new THREE.ShapeGeometry(shape);
            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵
            matrix.set(
                1, 0, 0, 0,
                0, -2.220446049250313e-16, 1, 0,
                0, 1, 2.220446049250313e-16, 0,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);
            let material = new THREE.MeshPhongMaterial(
                {color: document.getElementById("ColorInput").value || 0x171c21,
                    side:THREE.DoubleSide
                }
            );
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'TempMesh';
            scene.add(mesh);
        }

        //生成长方体
        function createCuboid() {
            //定义Shape的路径
            let shape = new THREE.Shape();
            shape.moveTo(startX, startZ); //起始点
            shape.lineTo(endX, startZ); //移动到的第一点，下面类推
            shape.lineTo(endX, endZ);
            shape.lineTo(startX, endZ);
            shape.lineTo(startX, startZ);


            //设置Z轴拉伸设置
            let extrudeSettings = {
                steps: 1, //拉伸次数（精度？）
                amount: endY, //拉伸距离
                bevelEnabled: false //是否启用倒角
                /*    bevelThickness: 1,
                 bevelSize: 1,
                 bevelSegments: 1*/
            };

            let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵
            matrix.set(
                1, 0, 0, 0,
                0, 2.220446049250313e-16, 1, 0,
                0, 1, 2.220446049250313e-16, 0,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);

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

            let material = new THREE.MeshPhongMaterial({
                color: document.getElementById("ColorInput").value || 0x171c21,
                side: THREE.DoubleSide
            });
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'TempMesh';
            scene.add(mesh);
        }

        //生成球体
        function createSphere() {
            let r;
            r = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));  //确定圆的半径

            let geometry = new THREE.SphereGeometry(r, 32, 32);
            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1, 0, 0, startX,
                0, 1, 0, 0,
                0, 0, 1, startZ,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);
            let material = new THREE.MeshPhongMaterial({color:  0x171c21});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'TempMesh';
            scene.add(mesh);

        }

        //生成圆柱
        function createCylinder() {

            let r;
            r = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));  //确定圆的半径

            let geometry = new THREE.CylinderGeometry(r, r, endY, 32);

            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1, 0, 0, startX,
                0, 1, 0, endY / 2,
                0, 0, 1, startZ,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);

            let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'TempMesh';
            scene.add(mesh);

        }

        //圆锥
        function createCone() {

            let r;
            r = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));

            let geometry = new THREE.ConeBufferGeometry(r, endY, 32);
            let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
            matrix.set(
                1, 0, 0, startX,
                0, 1, 0, endY / 2,
                0, 0, 1, startZ,
                0, 0, 0, 1
            );
            geometry.applyMatrix(matrix);

            let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
            let mesh = new THREE.Mesh(geometry, material);

            mesh.name = 'TempMesh';
            scene.add(mesh);

        }

        //巷道
        function createRoadway(num = 5) {

            let lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(startX,0,startZ),new THREE.Vector3(endX,0,startZ));
            let lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(startX,0,endZ),new THREE.Vector3(endX,0,endZ));
            let lineCurve3 = new THREE.LineCurve3(new THREE.Vector3(startX,100,startZ),new THREE.Vector3(endX,100,startZ));
            let lineCurve4 = new THREE.LineCurve3(new THREE.Vector3(startX,100,endZ),new THREE.Vector3(endX,100,endZ));

            let Geom1 = LinesToFace(lineCurve1,lineCurve2,num);
            let Geom2 = LinesToFace(lineCurve1,lineCurve3,num);
            let Geom3 = LinesToFace(lineCurve2,lineCurve4,num);
            let Geom4 = LinesToFace(lineCurve3,lineCurve4,num);

            let colors = [];
            for(let i = 0;i < num+1;i++)
            {
                let faceColor = Math.random() * 0xffffff;
                colors[i] = new THREE.Color(faceColor);
            }

            for (let i = 0; i < num; i++) {

                Geom1.faces[2*i].vertexColors[0] =
                    Geom1.faces[2*i].vertexColors[2] =
                        Geom1.faces[2*i+1].vertexColors[0] = colors[i];
                Geom1.faces[2*i].vertexColors[1] =
                    Geom1.faces[2*i+1].vertexColors[1] =
                        Geom1.faces[2*i+1].vertexColors[2] = colors[i+1];

                Geom2.faces[2*i].vertexColors[0] =
                    Geom2.faces[2*i].vertexColors[2] =
                        Geom2.faces[2*i+1].vertexColors[0] = colors[i];
                Geom2.faces[2*i].vertexColors[1] =
                    Geom2.faces[2*i+1].vertexColors[1] =
                        Geom2.faces[2*i+1].vertexColors[2] = colors[i+1];

                Geom3.faces[2*i].vertexColors[0] =
                    Geom3.faces[2*i].vertexColors[2] =
                        Geom3.faces[2*i+1].vertexColors[0] = colors[i];
                Geom3.faces[2*i].vertexColors[1] =
                    Geom3.faces[2*i+1].vertexColors[1] =
                        Geom3.faces[2*i+1].vertexColors[2] = colors[i+1];

                Geom4.faces[2*i].vertexColors[0] =
                    Geom4.faces[2*i].vertexColors[2] =
                        Geom4.faces[2*i+1].vertexColors[0] = colors[i];
                Geom4.faces[2*i].vertexColors[1] =
                    Geom4.faces[2*i+1].vertexColors[1] =
                        Geom4.faces[2*i+1].vertexColors[2] = colors[i+1];

            }
            let material = new THREE.MeshBasicMaterial({
                side:THREE.DoubleSide,
                vertexColors: THREE.VertexColors
            });

            let mesh1 = new THREE.Mesh(Geom1,material);
            let mesh2 = new THREE.Mesh(Geom2,material);
            let mesh3 = new THREE.Mesh(Geom3,material);
            let mesh4 = new THREE.Mesh(Geom4,material);

            mesh1.geometry.mergeMesh(mesh2);
            mesh1.geometry.mergeMesh(mesh3);
            mesh1.geometry.mergeMesh(mesh4);

            mesh1.name = 'TempMesh';
            scene.add(mesh1);

            return [lineCurve1,lineCurve2,lineCurve3,lineCurve4 ];

        }
    }

    function LinesToFace(curve1,curve2,step) {

        let vertices1 = curve1.getPoints(step), vertices2 = curve2.getPoints(step); //从曲线中提取num个点
        vertices1 = vertices1.concat(vertices2); //将所有点合并到一个数组

        let x = [],y = [] , z = [];
        for (let i = 0; i < (step+1)*2; i++) {
            x[i] = vertices1[i].x;
            y[i] = vertices1[i].y;
            z[i] = vertices1[i].z;
            vertices1[i] = new THREE.Vector3(x[i], y[i], z[i]);
        }

        let faces = [];
        for (let i = 0; i < step; i++) {
            faces[2 * i] = new THREE.Face3(i+step+1, i + 1, i);
            faces[2 * i + 1] = new THREE.Face3(i + step+1, i + step+2, i + 1);
        }

        let geometry = new THREE.Geometry();
        geometry.vertices = vertices1;
        geometry.faces = faces;

        return geometry;
    }

    function SelectObject(event,uuid,ifSelected,cancelSelected) {

        for(let i in dataArray)
        {
            if( dataArray[i].uuid === uuid)
            {

                objects[i].position.x = objects[i].matrixWorld.elements[12];
                objects[i].position.y = objects[i].matrixWorld.elements[13];
                objects[i].position.z = objects[i].matrixWorld.elements[14];

                dataArray[i].position = JSON.stringify(objects[i].position);
                dataArray[i].scale = JSON.stringify(objects[i].scale);
                dataArray[i].rotation = JSON.stringify(objects[i].rotation);

                if(dataArray[i].type!=="Group")
                    dataArray[i].materials.material = JSON.stringify(objects[i].material.toJSON());

                INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

            }
        }
        uuid = null;
        event.preventDefault();
        if(event.button !== 0) return; //如果不是鼠标左键点击return
        let mouse = new THREE.Vector2();
        //确定鼠标按下时的屏幕坐标
        mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)/(document.getElementById("viewport").clientWidth/window.innerWidth);
        mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)/(document.getElementById("viewport").clientHeight/window.innerHeight);

        let raycaster = new THREE.Raycaster(); //定义一条射线
        raycaster.setFromCamera( mouse, camera ); //射线从相机到鼠标位置
        let intersects = raycaster.intersectObjects(objects,true);//定义射线可以相交的物体，设定为true可以判断是否与objects的子对象相交

        if ( intersects.length > 0 ){

            let selected = intersects[ 0 ].object.parent instanceof THREE.Scene?intersects[ 0 ].object:intersects[ 0 ].object.parent;

            console.log(selected);
            ifSelected(selected );

        }
        else {
            cancelSelected();
        }
    }

    function DeleteObject(e,flag) {
        if( flag ===true || (e.keyCode === 68&&e.ctrlKey ) )
        {
            flag!==true&&e.preventDefault();

            scene.remove( new PROJECT.GetObjectByUuid(objects,uuid));

            for(let i in objects)
            {
                if( objects[i].uuid === uuid)
                {
                    objects.splice(i,1);
                    if (dataArray[i].uuid === uuid){

                        INDEXDB.deleteData(myDB.db,myDB.ojstore.name,dataArray[i].keyId);
                    }
                    dataArray.splice(i,1);
                }
            }

            $("#objDiv").data("kendoGrid").dataSource.read();
        }
    }

    function ClearAll() {

        let length = scene.children.length;
        for(let i = length-1;i >= 0;i--) {
            if (scene.children[i].type === "Mesh" ||scene.children[i].type === "Line") {

                scene.remove(scene.children[i]);
            }
        }
        objects = [];
        dataArray = [];

        INDEXDB.clearData(myDB.db,myDB.ojstore.name);
        $("#objDiv").data("kendoGrid").dataSource.read();

    }

    exports.ClearAll = ClearAll;
    exports.DeleteObject = DeleteObject;
    exports.GetObjectByUuid = GetObjectByUuid;
    exports.GetObjectDataByUuid = GetObjectDataByUuid;
    exports.Render = Render;
    exports.WindowResized = WindowResized;
    exports.GetSelected = GetSelected;
    exports.AddObject = AddObject;
    exports.ClickAddGraph = ClickAddGraph;
    exports.LinesToFace = LinesToFace;
    exports.SelectObject = SelectObject;

    exports.camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000000 );
    exports.renderer = new THREE.WebGLRenderer({antialias:true});
    exports.objects =[];
    exports.dataArray=[];
    exports.cameraControls = null;
    exports.transformControls=null;
    exports.uuid = null;
    exports.scene=new THREE.Scene();
    exports.sceneHelpers=new THREE.Scene();
    exports.objectProperty={};


}));


