/**绘图窗口**/
class Viewport {

    constructor(){

        this.$container = $("<div id='viewport'></div>");

    }

     init (){
         let render = new PROJECT.Render();

         $('body').append(this.$container);
         renderer.setSize(this.$container.width(),this.$container.height());
         this.$container.append( renderer.domElement );

         let planeGeometry = new THREE.PlaneGeometry( 6000, 6000 );
         let planeMaterial = new THREE.MeshBasicMaterial({color:0x2c2c2c,side:THREE.DoubleSide,transparent:true,opacity :0});
         let plane = new THREE.Mesh( planeGeometry, planeMaterial );
         plane.rotation.x = Math.PI/2;
         sceneHelpers.add( plane );

         let grid = new THREE.GridHelper( 6000, 60 );
         sceneHelpers.add( grid );

         let ambietLight =  new THREE.AmbientLight(0xffffff); //自然光
         scene.add(ambietLight);

         let spotLight1 = new THREE.SpotLight( 0xffffff ); //点光源
         spotLight1.position.set( -40, 5000, 50 );
         spotLight1.castShadow = true;
         scene.add( spotLight1 );

         let spotLight2 = new THREE.SpotLight( 0xffffff ); //点光源
         spotLight2.position.set( -40,-5000, 50 );
         spotLight2.castShadow = true;
         scene.add( spotLight2 );

         cameraControls =new THREE.EditorControls(camera,this.$container[0]);
         transformControls = new THREE.TransformControls( camera,this.$container[0] );
         cameraControls.addEventListener('change', () => {
             render(renderer,camera,scene,sceneHelpers)
         });

         (function () {
             document.addEventListener("keydown", function (e) {
                 switch(e.keyCode)
                 {
                     case 87:
                         transformControls.setMode('translate');
                         break;
                     case 69:
                         transformControls.setMode('scale');
                         break;
                     case 82:
                         transformControls.setMode('rotate');
                         break;
                 }
             }, false);
         })();

         sceneHelpers.add(transformControls);

         function animate() {
             requestAnimationFrame(animate);
             render(renderer,camera,scene,sceneHelpers);
         }
         animate();

         window.addEventListener('resize', () => {
             new PROJECT.WindowResized(renderer,render(renderer,camera,scene,sceneHelpers),camera,document.getElementById("viewport"));
         }, false);
         new PROJECT.WindowResized(renderer,render(renderer,camera,scene,sceneHelpers),camera,document.getElementById("viewport"));
 

         selectObjectControls= new PROJECT.SelectObject($("#viewport"),ifSelected,cancelSelected);
         selectObjectControls.active();

         document.addEventListener("keydown",deleteObject,false);
         function deleteObject(e) {
             new PROJECT.DeleteObject(e,null,ifDeleted)
         }

         function ifDeleted() {
             transformControls.detach();
         }

         function ifSelected (obj){
             uuid = obj.uuid;

             $("#NameInput")[0].value = obj.hasOwnProperty("name")?obj.name:"object";

             $("#NameInput").unbind(); //必须先解除之前的绑定，否则会绑定多个物体

             let data = new PROJECT.GetObjectDataByUuid(dataArray,obj.uuid);

             $("#NameInput").bind("input",function () {

                 obj.name = $("#NameInput")[0].value;
                 INDEXDB.putData(myDB.db,myDB.ojstore.name,dataArray);

                 data.name = $("#NameInput")[0].value;

                 $("#objDiv").data("kendoGrid").dataSource.read();

             });
                 transformControls.attach(obj);

         }

         function cancelSelected() {

             $("#NameInput").unbind();
             $("#NameInput")[0].value = null;

             transformControls.detach();

         }

     };

}

