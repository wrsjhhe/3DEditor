Project.linestoFace = function (curve1,curve2,step) {

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


};


