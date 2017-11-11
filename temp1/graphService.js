(function() {
    "use strict";
    angular.module('app.dmc').factory('GraphService', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {

            var self = this;

            var margin = {top: 20, right: 120, bottom: 20, left: 120},
                width = 1960 - margin.right - margin.left,
                height = 2600 - margin.top - margin.bottom;
                height = 900 - margin.top - margin.bottom;
            var tree, diagonal, i = 0, duration = 750, root, svg;

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

            function initialize(){
                root = {};
                tree = d3.layout.tree().size([height, width]);
                diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
                svg = d3.select("#erDiagram").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("unselectable", "on")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            function update(source) {
                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);
                // Normalize for fixed-depth.
                nodes.forEach(function(d) { d.y = d.depth * 180; });
                // Update the nodesâ€¦
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });
                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("unselectable", "on")
                    .attr("class", "node unselectable");
 //                   .on("click", click);
                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
                nodeEnter.append("text")
                    .attr("x", function(d) { return d.children || d._children ? -8 : 8; })
                    .attr("dy", ".35em")
                    .attr("unselectable", "on")
                    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .attr("class", "unselectable")
                    .text(function(d) { return d.name; })
                    .style("font-weight", "bold")
                    .style("fill-opacity", 1e-6)
                    .on("dblclick", function(nodeObj){
                        var el = $(d3.select(this)[0][0]);
                        $rootScope.$broadcast('hideTable', el, nodeObj.name);
                   })
                    .on("click", function(nodeObj){
                        var el = $(d3.select(this)[0][0]);
                        $rootScope.$broadcast('showTable', el, nodeObj);
                    })
                    .on({
                        "mouseover": function(nodeObj) {
                            var el = $(d3.select(this)[0][0]);
                            d3.select(this).style("cursor", "pointer");
                        },
                        "mouseout": function() {
                            d3.select(this).style("cursor", "default");
                        }
                    });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the linksâ€¦
                var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("unselectable", "on")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function buildGraph(erData, blnTranslate) {
                initialize();
                root = erData[0];
                root.x0 = height / 2;
                root.y0 = 0;
                function collapse(d) {
                    if (d.children) {
        /*
                        d._children = d.children;
                        d._children.forEach(collapse);
                        d.children = null;
        */
                    }
                }
                root.children.forEach(collapse);
                update(root);
                function setStatic(){
                    dashed.forEach(function(mem){
                        $(mem).css('display', 'none');
                    });
                    var left = 100;
                    nodes.forEach(function(mem){
                        var tr = 'translate(' + left + ',80)';
                        $(mem).attr('transform', tr);
                        left = left + 200;
                    });
                    $(nodes[nodes.length - 1]).css('display', 'none');
                    $('#erDiagram').css('visibility','visible').css('width', nodes.length * 300);
                    $('#erDiagram svg').attr('width', nodes.length * 300);
                    $('#erDiagram svg').css('width', nodes.length * 300);
                }
                if(blnTranslate){
                    $('#erDiagram').css('visibility','hidden');
                    $timeout(setStatic, 1000);
                }
            }

            return {
                buildGraph: buildGraph
            };

    }]);
})();
