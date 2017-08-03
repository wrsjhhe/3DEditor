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

     }
}





