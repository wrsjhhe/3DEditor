
class LeftSideBar{
    constructor(){
        this.$container = $("<div id='leftSideBar'></div>");
        $('body').append(this.$container);
    }
    init (){
        this.$container.append(`
            <ul id="panelBar">
                <li>基本形状
                    <ul id="basicShape">
                        <li class="basicShape" id="line">线段</li>
                        <li class="basicShape" id="plane">长方形</li>
                        <li class="basicShape" id="circle">圆形</li>
                        <li class="basicShape" id="triangle">三角形</li>
                    </ul>
                </li>
                <li>基本几何体
                    <ul id="basicGraph">
                        <li class="basicGraph" id="cuboid">长方体</li>
                        <li class="basicGraph" id="cylinder">圆柱体</li>
                        <li class="basicGraph" id="sphere">球体</li>
                        <li class="basicGraph" id="cone">圆锥体</li>
                    </ul>
                </li>
                <li>扩展几何体
                    <ul id="extendedGraph">
                        <li class="extendedGraph" id="roadWay">巷道</li>
                    </ul>
            
                </li>
            </ul>
            
        `);



        $('#line').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.twoClick("line",objects,dataArray,objectProperty);
        });

        $('#plane').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.twoClick("plane",objects,dataArray,objectProperty);
        });

        $('#circle').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.twoClick("circle",objects,dataArray,objectProperty);
        });

        $('#cuboid').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.threeClick("cuboid",objects,dataArray,objectProperty);
           // cWindow.openWindow("cuboid");
        });

        $('#cylinder').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.threeClick("cylinder",objects,dataArray,objectProperty);
          //  cWindow.openWindow("cylinder");
        });

        $('#sphere').click(()=>{
            new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"))
                .twoClick("sphere",objects,dataArray,objectProperty);
          //  cWindow.openWindow("sphere");
        });

        $('#cone').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.threeClick("cone",objects,dataArray,objectProperty);
          //  cWindow.openWindow("cone");
        });

        $('#roadWay').click(()=>{
            let clickAddGraph = new PROJECT.ClickAddGraph(scene,document.getElementById("viewport"));
            clickAddGraph.twoClick("roadWay",objects,dataArray,objectProperty);
        });

        $(document).ready(function() {
            $("#panelBar").kendoPanelBar({

            });
        });

    }


}
