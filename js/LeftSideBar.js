
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

        let clickAddGraph = new ClickAddGraph();

        $('#line').click(()=>{
            clickAddGraph.twoClick("line");
        });

        $('#plane').click(()=>{
           // clickAddGraph.twoClick("plane");
        });

        $('#circle').click(()=>{
            clickAddGraph.twoClick("circle");
        });

        $('#cuboid').click(()=>{
            clickAddGraph.threeClick("cuboid");
            cWindow.openWindow("cuboid");
        });

        $('#cylinder').click(()=>{
            clickAddGraph.threeClick("cylinder");
            cWindow.openWindow("cylinder");
        });

        $('#sphere').click(()=>{
            clickAddGraph.twoClick("sphere");
            cWindow.openWindow("sphere");
        });

        $('#cone').click(()=>{
            clickAddGraph.threeClick("cone");
            cWindow.openWindow("cone");
        });

        $('#roadWay').click(()=>{
            clickAddGraph.twoClick("roadWay");
        });




        $(document).ready(function() {
            $("#panelBar").kendoPanelBar({

            });
        });

    }
}
