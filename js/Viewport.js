/**绘图窗口**/
class Viewport {

    constructor(){

        this.$container = $("<div id='viewport'></div>");

    }

     init (){
        $('body').append(this.$container);
        Project.renderer.setSize(this.$container.width(),this.$container.height());
        this.$container.append( Project.renderer.domElement );
        Project.viewportWidth = this.$container.width();
        Project.viewportHeight = this.$container.height();

        let planeGeometry = new THREE.PlaneGeometry( 6000, 6000 );
        let planeMaterial = new THREE.MeshBasicMaterial({color:0x2c2c2c,side:THREE.DoubleSide,transparent:true,opacity :0});
        let plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.rotation.x = Math.PI/2;
        Project.sceneHelpers.add( plane );

        let grid = new THREE.GridHelper( 6000, 60 );
        Project.sceneHelpers.add( grid );

        let ambietLight =  new THREE.AmbientLight(0xffffff); //自然光
        Project.scene.add(ambietLight);

        let spotLight1 = new THREE.SpotLight( 0xffffff ); //点光源
        spotLight1.position.set( -40, 5000, 50 );
        spotLight1.castShadow = true;
        Project.scene.add( spotLight1 );

        let spotLight2 = new THREE.SpotLight( 0xffffff ); //点光源
        spotLight2.position.set( -40,-5000, 50 );
        spotLight2.castShadow = true;
        Project.scene.add( spotLight2 );

        Project.controls =new THREE.EditorControls(Project.camera,this.$container[0]); //调用视角移动

        Project.transformControls = new THREE.TransformControls( Project.camera,$("#viewport")[0] );
        Project.sceneHelpers.add(Project.transformControls);

        Project.animate();

         let lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(100,0,0),new THREE.Vector3(200,0,0));
         let lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(100,0,100),new THREE.Vector3(200,0,100));

         let li1 = JSON.stringify(lineCurve1);
         let li2 = JSON.stringify(lineCurve2);

         let li = [li1,li2];

         let line1 = JSON.parse(li[0]);
         let line2 = JSON.parse(li[1]);

         let l1 = new THREE.LineCurve3(new THREE.Vector3(line1.v1.x,line1.v1.y,line1.v1.z),new THREE.Vector3(line1.v2.x,line1.v2.y,line1.v2.z));
         let l2 = new THREE.LineCurve3(new THREE.Vector3(line2.v1.x,line2.v1.y,line2.v1.z),new THREE.Vector3(line2.v2.x,line2.v2.y,line2.v2.z) );

         let Geom1 = Project.linestoFace(l1,l2,5);
         for (let i = 0; i < 5; i++) {
             let faceColor = Math.random() * 0xffffff;
             Geom1.faces[2*i].color.setHex(faceColor);
             Geom1.faces[2*i+1].color.setHex(faceColor);

         }
         let material = new THREE.MeshPhongMaterial({
             color: 0xffffff,
             vertexColors: THREE.FaceColors,
             side:THREE.DoubleSide
         });
         let mesh1 = new THREE.Mesh(Geom1,material);
         Project.scene.add(mesh1);















     }
}






