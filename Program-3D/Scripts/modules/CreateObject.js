/**
 * 点击生成的几何体的方法
 * twoClick为点击两次生成、threeClick为点击三次生成
 * */

function ClickAddGraph() {

    let startX, startZ, endX, endY, endZ; //声明起始点与结束点X,Y坐标
    let mouse = Project.mouse; //定义一个Vector2D对象存储鼠标屏幕坐标
    function showWindow(ModelType) {
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
                $("#cuboidWindow").data("kendoWindow").close();
                break;
            case "cylinder":
                $("#cylinderWindow").data("kendoWindow").close();
                break;
            case "cone":
                $("#coneWindow").data("kendoWindow").close();
                break;
            case "sphere":
                $("#sphereWindow").data("kendoWindow").close();
                break;

        }
    }

    //点击两次生成，包含二维图形与球体
    this.twoClick = function (ModelType) {

        $('#viewport')[0].addEventListener('mousedown', startComputeDistance, false);

        //鼠标按下开始绘图
        function startComputeDistance(event) {

            event.preventDefault();
            let intersect = Project.getSelected(mouse);

            if (intersect !== undefined) {
                Project.camera.enabled = false; //关闭视角移动
                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));
                //根据交点位置确地绘图起始点

                startX = intersect.point.x;
                startZ = intersect.point.z;

                $('#viewport')[0].removeEventListener('mousedown', startComputeDistance, false);
                $('#viewport')[0].addEventListener('mousemove', moving, false);

            }

        }

        //在鼠标按下过程中的移动事件
        function moving(event) {

            document.addEventListener("keydown", quit, false);
            function quit(e) {
                if (e.which === 27) {
                    $('#viewport')[0].removeEventListener('mousemove', moving, false);
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));
                    $('#viewport')[0].removeEventListener('mousedown', endComputeDistance, false);
                }
            }

            let intersect = Project.getSelected(mouse);
            if (intersect !== undefined) {
                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                //根据鼠标与基准面位置确定绘图最终坐标
                endX = intersect.point.x;
                endZ = intersect.point.z;

                showWindow(ModelType);

                if (endX === startX && endZ === startZ)return;
                switch (ModelType) {

                    case "sphere":
                    case "roadWay":
                        createModels3D(ModelType);  //生成新3D的物体
                        ( Project.scene.getObjectByName("TempMesh") !== undefined) && (Project.scene.getObjectByName("TempMesh").material.wireframe = true);
                        break;
                    case "line":
                    case "circle":
                    case "plane":
                        createModels2D(ModelType); //生成新2D的物体
                        break;
                }
            }
            $('#viewport')[0].addEventListener('mousedown', endComputeDistance, false);
        }

        //最后点击事件确定最后生成的物体
        function endComputeDistance(event) {

            Project.controls.enabled = true;  //开启视角移动

            $('#viewport')[0].removeEventListener('mousemove', moving, false);

            let intersect = Project.getSelected(mouse);
            if (intersect!==undefined) {

                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));

                endX = intersect.point.x;
                endZ = intersect.point.z;
            }

            if (endX === startX && endZ === startZ)return;
            switch (ModelType) {
                case "sphere":
                    createModels3D(ModelType);   //生成新3D的物体
                    break;
                case "roadWay":
                    Project.objectProperty = {
                        lineCurve: createModels3D(ModelType),
                    };
                    break;
                case "line":
                case "circle":
                case "plane":
                    createModels2D(ModelType);   //生成新2D的物体
                    break;

            }
            Project.addObject(Project.scene.getObjectByName("TempMesh"),ModelType);

            closeWindow(ModelType);

            $('#viewport')[0].removeEventListener('mousedown', endComputeDistance, false);   //移除鼠标事件
        }
    };

    //以三个点生成几何体，包含长方体、圆柱体、圆锥体等
    this.threeClick = function (ModelType) {

        $("#viewport")[0].addEventListener('mousedown', startComputeDistance, false);
        //鼠标按下开始绘图
        function startComputeDistance(event) {

            let intersect = Project.getSelected(mouse);

            if (intersect !== undefined) {
                Project.controls.enabled = false; //关闭视角移动
                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));
                //根据交点位置确地绘图起始点
                startX = intersect.point.x;
                startZ = intersect.point.z;
                $("#viewport")[0].removeEventListener('mousedown', startComputeDistance, false);
                $("#viewport")[0].addEventListener("mousemove", moving1, false);

            }
        }

        //鼠标移动生成底面
        function moving1() {
            document.addEventListener("keydown", quit, false);
            function quit(e) {
                if (e.which === 27) {
                    $("#viewport")[0].removeEventListener("mousemove", moving1, false);
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));
                    $("#viewport")[0].removeEventListener("mousedown", endComputeDistance, false);
                }
            }

            let intersect = Project.getSelected(mouse);
            if (intersect !== undefined) {
                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体
                //根据鼠标与基准面位置确定绘图最终坐标
                endX = intersect.point.x;
                endZ = intersect.point.z;

                if (endX === startX && endZ === startZ)return;
                showWindow(ModelType);
                drawFloor(ModelType);

                ( Project.scene.getObjectByName("TempMesh") !== undefined) && (Project.scene.getObjectByName("TempMesh").material.wireframe = true);

                $("#viewport")[0].addEventListener('mousedown', finishFloor, false);

            }
        }
        function drawFloor() {
            switch (ModelType) {
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
        }
        function finishFloor() {

            $("#viewport")[0].removeEventListener("mousemove", moving1, false);

            drawFloor(ModelType);

            $("#viewport")[0].addEventListener("mousemove", moving2, false);

        }


        //第二次点击移动生成完整几何体
        function moving2(event) {

            document.addEventListener("keydown", quit, false);

            function quit(e) {
                if (e.which === 27) {
                    $("#viewport")[0].removeEventListener("mousemove", moving2, false);
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));
                    $("#viewport")[0].removeEventListener("mousedown", endComputeDistance, false);
                }
            }

            $("#viewport")[0].removeEventListener('mousedown',finishFloor,false);

            let intersect = Project.getSelected(mouse);
            if (intersect !== undefined) {

                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                endY = (endZ - intersect.point.z + endX - intersect.point.x) / 2;       //根据鼠标与基准面位置确定绘图最终坐标

                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

                if (endX === startX && endZ === startZ)return;
                createModels3D(ModelType);  //生成新的物体

                ( Project.scene.getObjectByName("TempMesh") !== undefined) && (Project.scene.getObjectByName("TempMesh").material.wireframe = true);

                showWindow(ModelType);

                $("#viewport")[0].addEventListener('mousedown', endComputeDistance, false);

            }
        }

        //最后点击事件确定最后生成的物体
        function endComputeDistance(event) {

            Project.scene.remove(Project.scene.getObjectByName("TempMesh")); //删除上一个鼠标位置的物体

            Project.controls.enabled = true;  //开启视角移动

            document.getElementById("viewport").removeEventListener("mousemove", moving2, false); //取消mousemove事件

            let intersect = Project.getSelected(mouse);
            if (intersect!==undefined) {

                if (Project.scene.getObjectByName("TempMesh") !== undefined)
                    Project.scene.remove(Project.scene.getObjectByName("TempMesh"));

                endY = (endZ - intersect.point.z + endX - intersect.point.x) / 2;  //根据鼠标与基准面位置确定绘图最终坐标

            }

            if (endX === startX && endZ === startZ)return;
            createModels3D(ModelType); //生成最后的物体

            Project.addObject(Project.scene.getObjectByName("TempMesh"),ModelType);

            closeWindow(ModelType);

            $("#viewport")[0].removeEventListener("mousedown", endComputeDistance, false);

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

        let material = new THREE.LineBasicMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
        let mesh = new THREE.Line(geometry,material);
        mesh.name = "TempMesh";
        Project.scene.add(mesh);

    }

    //生成圆
    function createCircle() {

        let r;
        r = Math.sqrt((endX - startX) * (endX - startX) + (endZ - startZ) * (endZ - startZ));  //确定圆的半径

        let geometry = new THREE.CircleGeometry(r, 32);
        let matrix = new THREE.Matrix4(); //定义一个偏移矩阵 ，将圆心偏移，从而使鼠标点击的点为圆心
        matrix.set(
            1, 0, 0, startX,
            0, 2.220446049250313e-16, 1, 0,
            0, -1, 2.220446049250313e-16, startZ,
            0, 0, 0, 1
        );
        geometry.applyMatrix(matrix);
        let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
        let mesh = new THREE.Mesh(geometry, material);

        mesh.name = 'TempMesh';
        Project.scene.add(mesh);

    }

    //生成平面
    function createPlane() {

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
        let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'TempMesh';
        Project.scene.add(mesh);
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
        Project.scene.add(mesh);
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
        let material = new THREE.MeshPhongMaterial({color: document.getElementById("ColorInput").value || 0x171c21});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'TempMesh';
        Project.scene.add(mesh);
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
        Project.scene.add(mesh);

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
        Project.scene.add(mesh);

    }

    //巷道
    function createRoadway(num = 5) {

        let lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(startX,0,startZ),new THREE.Vector3(endX,0,startZ));
        let lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(startX,0,endZ),new THREE.Vector3(endX,0,endZ));
        let lineCurve3 = new THREE.LineCurve3(new THREE.Vector3(startX,100,startZ),new THREE.Vector3(endX,100,startZ));
        let lineCurve4 = new THREE.LineCurve3(new THREE.Vector3(startX,100,endZ),new THREE.Vector3(endX,100,endZ));

        let Geom1 = Project.linestoFace(lineCurve1,lineCurve2,num);
        let Geom2 = Project.linestoFace(lineCurve1,lineCurve3,num);
        let Geom3 = Project.linestoFace(lineCurve2,lineCurve4,num);
        let Geom4 = Project.linestoFace(lineCurve3,lineCurve4,num);

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
        Project.scene.add(mesh1);

        return [lineCurve1,lineCurve2,lineCurve3,lineCurve4 ];

    }
    }



