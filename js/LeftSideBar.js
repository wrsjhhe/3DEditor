/**
 * Created by Administrator on 2017/6/21 0021.
 */
var LeftSideBar = function (project) {


    var signals = project.signals;
    var clickAddGraph = new ClickAddGraph(project);

    var container = document.createElement( 'div' );
    container.id = "leftSideBar";
    document.body.appendChild( container );

    var panelBar = document.createElement('ul');
    panelBar.id = "panelBar";

    //基本图形列表
    var basicGraph = document.createElement("li");
    basicGraph.innerHTML = "基本几何体";
    panelBar.appendChild(basicGraph);

    var first = document.createElement("ul");
    basicGraph.appendChild(first);

    var cuboid = document.createElement('li');
    cuboid.innerHTML = "长方体";
    first.appendChild(cuboid);
    cuboid.addEventListener("click",createCuboid ,false);
    function createCuboid() {
        clickAddGraph.threeClick("cuboid");
        signals.openWindow.dispatch("cuboid");
    }

    var cylinder = document.createElement('li');
    cylinder.innerHTML = "圆柱体";
    first.appendChild(cylinder);
    cylinder.addEventListener("click",createCylinder,false);
    function createCylinder() {
        clickAddGraph.threeClick("cylinder");
        signals.openWindow.dispatch("cylinder");
    }

    var sphere = document.createElement('li');
    sphere.innerHTML = "球体";
    first.appendChild(sphere);
    sphere .addEventListener("click",createSphere,false);
    function createSphere() {
        clickAddGraph.twoClick("sphere");
        signals.openWindow.dispatch("sphere");
    }

    var cone = document.createElement('li');
    cone.innerHTML = "圆锥体";
    first.appendChild(cone);
    cone.addEventListener("click",createCone,false);
    function createCone() {
        clickAddGraph.threeClick("cone");
        signals.openWindow.dispatch("cone");
    }


    //
    var expandGraph = document.createElement("li");
    expandGraph.innerHTML = "扩展几何体";
    panelBar.appendChild(expandGraph);

    $(document).ready(function() {
        $("#panelBar").kendoPanelBar({

        });
    });

    container.appendChild(panelBar);

    return container;

};