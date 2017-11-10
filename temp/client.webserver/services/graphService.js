(function() {
    "use strict";
    angular.module('app.dmc').factory('GraphService', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {

            var w = 1800,
                h = 1900,
                i = 0,
                duration = 500,
                root, tree, diagonal, zoomListener, vis, svgGroup;

            function zoom() {
                svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function toggleBackground(el, tblName) {
                var blnAdd = false;
                el.css('fill') === 'rgb(176, 196, 222)'? el.css('fill','rgb(144, 238, 144)') : el.css('fill','rgb(176, 196, 222)');
                if(el.css('fill') === 'rgb(144, 238, 144)'){
                    blnAdd = true;
                }
                $rootScope.$broadcast('setAnchors', tblName, blnAdd);
            }

            function initialize(){
                root = {};
                tree = d3.layout.tree().size([h, w - 160]);
                diagonal = d3.svg.diagonal()
                    .source(function (d) {
                        return {
                            "x": d.source.x + d.source.height / 2,
                            "y": d.source.y + 150
                        };
                    })
                    .target(function (d) {
                        return {
                            "x": d.target.x + d.target.height / 2,
                            "y": d.target.y + 100
                        };
                    })
                    .projection(function (d) {
                        return [d.x + 15, d.y - 30];
                    });

                // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
                zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

                vis = d3.select('#erDiagram').append("svg:svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("transform", "translate(0,0)")
                    .call(zoomListener);

                svgGroup = vis.append("g");
            }

            function update(source) {
                var nodes = tree.nodes(root).reverse();

                var node = svgGroup.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function () {
                        return "translate(" + source.x0 + "," + source.y0 + ")";
                    });

                nodeEnter.append("svg:rect")
                    .attr("width", 150)
                    .attr("height", 500)
                    .attr('y', -1)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '3px')
                    .attr("id", function (d) {
                        return d._children;
                    })
                    .on("click", function(nodeObj){
                        var el = $(d3.select(this)[0][0]);
                        toggleBackground(el, nodeObj.name);
                    })
                    .on({
                        "mouseover": function() {
                            d3.select(this).style("cursor", "pointer");
                        },
                        "mouseout": function() {
                            d3.select(this).style("cursor", "default");
                        }
                    });

                nodeEnter.append("text")
                    .attr("x", function (d) {
                        return d._children ? -8 : 8;
                    })
                    .attr("y", 3)
                    .attr("dy", "0.68em")
                    .text(function (d) {
                        return d.name;
                    });

                $('.node text').on('click', function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                    var el = evt.target.parentNode.previousSibling;
                    var tblName = evt.target.parentNode.children[0].innerHTML;
                    toggleBackground($(el), tblName);
                })
                .on({
                    "mouseover": function(evt) {
                        var el = evt.target;
                        $(el).css("cursor", "pointer");
                    },
                    "mouseout": function(evt) {
                        var el = evt.target;
                        $(el).css("cursor", "default");
                    }
                }).on('dblclick', function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                });

                wrap(d3.selectAll('text'), 450);

                nodeEnter.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + (d.x-50) + "," + (d.y+50) + ")";
                    })
                    .style("opacity", 1)
                    .select("rect")
                    .style("fill", "#b0c4de");

                node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + (d.x-50) + "," + (d.y+50) + ")";
                    })
                    .style("opacity", 1);


                node.exit().transition()
                    .duration(duration)
                    .attr("transform", function () {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .style("opacity", 1e-6)
                    .remove();

                var link = svgGroup.selectAll("path.link")
                    .data(tree.links(nodes), function (d) {
                        return d.target.id;
                    });

                svgGroup.selectAll("path.link").attr();
                link.enter().insert("svg:path", "g")
                    .attr("class",  function (d) {
                        if(d.source && d.source.name && root.name &&d.source.name === root.name){
                            return "link_dashed";
                        }else{
                            return "link_continuous";
                        }
                    })
                    .attr("marker-mid","ArrowHead")
                    //return (d.source != root) ? "link_dashed" : "link_continuous" ; })
                    .attr("d", function () {
                        var o = {
                            x: source.x0,
                            y: source.y0,
                            height: source.height
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);


                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                link.exit().transition()
                    .duration(duration)
                    .attr("d", function () {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();


                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function wrap(text, width) {
                text.each(function (d) {
                    var text = d3.select(this),
                        words = d.name.split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1,
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dx", ".6em").attr("dy", dy + "em").attr('font-weight', 'bold').attr('fill','#204d74');
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
/*
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
*/
                        if(d.columns){
                            d.columns.forEach(function(c){
                                dy = dy + 1;
                                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dx", ".6em").attr("dy", dy + "em").text(c.name);
                            });
                        }
                    }

                    var textBox = text.node().getBBox();

                    d.height = 19 * (lineNumber + 1);
                    d3.select(this.parentNode.children[0]).attr('height', textBox.height + 10);

                });
            }

            function buildGraph(erData, blnTranslate) {
                initialize();
                root = erData[0];
                root.x0 = h / 2;
                root.y0 = 0;
                update(root);
                var nodes = $('.node').toArray();
                var dashed = $('.link_dashed').toArray();
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
