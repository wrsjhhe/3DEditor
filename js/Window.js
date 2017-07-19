/**
 * Created by Administrator on 2017/7/7 0007.
 */
var CWindow = function (project) {

    var signals = project.signals;

    var $cuboidWindow = $("<div id='cuboidWindow'>" +
            "<label for='inputLength_Cuboid'>长</label>" +
            "<input id='inputLength_Cuboid' style='margin-left:20px'/>"+"<br/>"+
            "<label for='inputWidth_Cuboid'>宽</label>" +
            "<input id='inputWidth_Cuboid' style='margin-left:20px'/>"+"<br/>"+
            "<label for='inputHeight_Cuboid'>高</label>" +
            "<input id='inputHeight_Cuboid' style='margin-left:20px'/>"+
        "</div>");
    $('body').append($cuboidWindow);

    var $cylinderWindow = $("<div id='cylinderWindow'>" +
        "<label for='inputRadius_Cylinder'>底面半径</label>" +
        "<input id='inputRadius_Cylinder' style='margin-left:20px'/>"+"<br/>"+
        "<label for='inputHeight_Cylinder' style='margin-left:27px'>高</label>" +
        "<input id='inputHeight_Cylinder' style='margin-left:41px'/>"+
        "</div>");
    $('body').append($cylinderWindow);

    var $sphereWindow = $("<div id='sphereWindow'>" +
        "<label for='inputRadius_Sphere'>半径</label>" +
        "<input id='inputRadius_Sphere' style='margin-left:20px'/>"+
        "</div>");
    $('body').append($sphereWindow);

    var $coneWindow = $("<div id='coneWindow'>" +
        "<label for='inputRadius_Cone'>底面半径</label>" +
        "<input id='inputRadius_Cone' style='margin-left:20px'/>"+"<br/>"+
        "<label for='inputHeight_Cone' style='margin-left:27px'>高</label>" +
        "<input id='inputHeight_Cone' style='margin-left:41px'/>"+
        "</div>");
    $('body').append($coneWindow);




    signals.openWindow.add(function (ModelType) {

        switch (ModelType){

            case "cuboid":
                $cuboidWindow.kendoWindow({
                    position: {
                        top: 100, // or "100px"
                        left: 300
                    },
                    width: "300px",
                    title: "长方体",
                    visible: false,
                    actions: [
                        "Minimize",
                        "Maximize",
                        "Close"
                    ]
                }).data("kendoWindow").open();
                break;

            case "cylinder":
                $cylinderWindow.kendoWindow({
                    position: {
                        top: 100, // or "100px"
                        left: 300
                    },
                    width: "300px",
                    title: "圆柱体",
                    visible: false,
                    actions: [
                        "Minimize",
                        "Maximize",
                        "Close"
                    ]
                }).data("kendoWindow").open();
                break;

            case "sphere":
                $sphereWindow.kendoWindow({
                    position: {
                        top: 100, // or "100px"
                        left: 300
                    },
                    width: "300px",
                    title: "球体",
                    visible: false,
                    actions: [
                        "Minimize",
                        "Maximize",
                        "Close"
                    ]
                }).data("kendoWindow").open();
                break;

            case "cone":
                $coneWindow.kendoWindow({
                    position: {
                        top: 100, // or "100px"
                        left: 300
                    },
                    width: "300px",
                    title: "圆锥体",
                    visible: false,
                    actions: [
                        "Minimize",
                        "Maximize",
                        "Close"
                    ]
                }).data("kendoWindow").open();
                break;

        }



    });








};