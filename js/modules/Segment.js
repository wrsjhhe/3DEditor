class Segment
{
    constructor(){
        this.$segmentWindow = $("<div id='segmentWindow'>");
        this.$segment_colorWindow = $("<div id='segmentColorWindow'>");
    }

    init(){
        this.$segmentWindow.append(`
            <label for='inputStep'>分割段数</label>
            <input id='inputStep' style='margin-left:20px' pattern="[0-9]"/><br/>
            <button id="stepColorButton">选择每段颜色</button>
        `);
        $('body').append(this.$segmentWindow);
        $("#stepColorButton").click(()=>{this.openWindow()});

        this.$segmentWindow.kendoWindow({
            position: {
                top: 100,
                left: 300
            },
            width: "300px",
            title: "分割",
            visible: false,
        }).data("kendoWindow").open();


    }
    openWindow(){

        $('body').append(this.$segment_colorWindow);

        this.$segment_colorWindow .kendoWindow({
            position: {
                top: 200,
                left: 500
            },
            width: "300px",
            title: "选择颜色",
            visible: false,
        }).data("kendoWindow").open();

        let i = 0;
        let len = $("#inputStep")[0].value;
        let colors = [];
        let id = [];

        for(i;i<len;i++) {

            id[i] = "stepColorPanel"+i.toString();
            this.$segment_colorWindow.append(`
            <label for=${id[i]}>选择颜色</label>
            <input id=${id[i]} type="color"><br/>
            
            `);
        }
        this.$segment_colorWindow.append(`
            <button id="stepColorPanelCertain">确定</button>
            <button id="stepColorPanelCancel">取消</button>
        `);

        $("#stepColorPanelCertain").click(()=>{

            for(i = 0;i<len;i++) {
                colors.push(document.getElementById(id[i]).value);
            }

            if (colors.length > 0 && Project.uuid !== null) {
                this.beginSegment(colors.length,colors);
            }

            this.$segmentWindow.data("kendoWindow").destroy();
            this.$segment_colorWindow.data("kendoWindow").destroy();
        });

        $("#stepColorPanelCancel").click(()=>{
            this.$segmentWindow.data("kendoWindow").destroy();
            this.$segment_colorWindow.data("kendoWindow").destroy();
        });

    }

    beginSegment(num,colors) {

        let selected = Project.dataArray.find(n=>n.uuid === Project.uuid);

        let lineVertices = JSON.parse(selected.geometry.lineCurve);

        let lines = [];

        for (let i = 0;i<4;i++) {
            lines[i] = new THREE.LineCurve3(
                new THREE.Vector3(lineVertices[i].v1.x, lineVertices[i].v1.y, lineVertices[i].v1.z),
                new THREE.Vector3(lineVertices[i].v2.x, lineVertices[i].v2.y, lineVertices[i].v2.z)
            );
        }


        let Geom1 = Project.linestoFace(lines[0],lines[1],num);
        let Geom2 = Project.linestoFace(lines[0],lines[2],num);
        let Geom3 = Project.linestoFace(lines[1],lines[3],num);
        let Geom4 = Project.linestoFace(lines[2],lines[3],num);

        for (let i = 0; i < num; i++) {

            colors[i] = colors[i].replace(/^#/,"0x");
            Geom1.faces[2*i].color.setHex(colors[i]);
            Geom1.faces[2*i+1].color.setHex(colors[i]);
            Geom2.faces[2*i].color.setHex(colors[i]);
            Geom2.faces[2*i+1].color.setHex(colors[i]);
            Geom3.faces[2*i].color.setHex(colors[i]);
            Geom3.faces[2*i+1].color.setHex(colors[i]);
            Geom4.faces[2*i].color.setHex(colors[i]);
            Geom4.faces[2*i+1].color.setHex(colors[i]);
        }
        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors,
            side:THREE.DoubleSide
        });

        let mesh1 = new THREE.Mesh(Geom1,material);
        let mesh2 = new THREE.Mesh(Geom2,material);
        let mesh3 = new THREE.Mesh(Geom3,material);
        let mesh4 = new THREE.Mesh(Geom4,material);

        mesh1.geometry.mergeMesh(mesh2);
        mesh1.geometry.mergeMesh(mesh3);
        mesh1.geometry.mergeMesh(mesh4);

        Project.objectProperty = {lineCurve:lines};

        deleteObject(null,true);
        Project.addObject(mesh1,"roadWay");
        Project.scene.add(mesh1);

    }
}
