class CWindow{

    constructor (){
        this.$cuboidWindow = $("<div id='cuboidWindow'>");
        this.$cylinderWindow = $("<div id='cylinderWindow'>");
        this.$sphereWindow = $("<div id='sphereWindow'>");
        this.$coneWindow = $("<div id='coneWindow'>");
    }

    init(){
        this.$cuboidWindow.append(`
            <label for='inputLength_Cuboid'>长</label>
            <input id='inputLength_Cuboid' style='margin-left:20px'/><br/>
            <label for='inputWidth_Cuboid'>宽</label>
            <input id='inputWidth_Cuboid' style='margin-left:20px'/><br/>
            <label for='inputHeight_Cuboid'>高</label>
            <input id='inputHeight_Cuboid' style='margin-left:20px'/>
        `);
        $('body').append(this.$cuboidWindow);

        this.$cylinderWindow.append(`
            <label for='inputRadius_Cylinder'>底面半径</label>
            <input id='inputRadius_Cylinder' style='margin-left:20px'/><br/>
            <label for='inputHeight_Cylinder' style='margin-left:27px'>高</label>
            <input id='inputHeight_Cylinder' style='margin-left:41px'/>
        `) ;
        $('body').append(this.$cylinderWindow);

        this.$sphereWindow.append(`
            <label for='inputRadius_Sphere'>半径</label>
            <input id='inputRadius_Sphere' style='margin-left:20px'/>
        `);
        $('body').append(this.$sphereWindow);

        this.$coneWindow.append(`
            <label for='inputRadius_Cone'>底面半径</label>
            <input id='inputRadius_Cone' style='margin-left:20px'/><br/>
            <label for='inputHeight_Cone' style='margin-left:27px'>高</label>
            <input id='inputHeight_Cone' style='margin-left:41px'/>
        `);
        $('body').append(this.$coneWindow);
    }
     openWindow(ModelType){

        switch (ModelType){

            case "cuboid":
                this.$cuboidWindow.kendoWindow({
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
                this.$cylinderWindow.kendoWindow({
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
                this.$sphereWindow.kendoWindow({
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
                this.$coneWindow.kendoWindow({
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
    }
}
