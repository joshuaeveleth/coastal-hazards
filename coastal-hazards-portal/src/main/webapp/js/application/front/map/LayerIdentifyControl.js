/*jslint browser: true */
/*jslint plusplus: true */
/*global $*/
/*global LOG*/
/*global CCH*/
/*global OpenLayers*/
CCH.Objects.LayerIdentifyControl = OpenLayers.Class(OpenLayers.Control.WMSGetFeatureInfo, {
    title: 'identify-control',
    layers: [],
    queryVisible: true,
    output: 'features',
    drillDown: true,
    maxFeatures: 1000,
    infoFormat: 'application/vnd.ogc.gml',
    vendorParams: {
        radius: 3
    },
    layerIdClickHandler : function (evt) {
        "use strict";
        var features = evt.features,
            cchLayers,
            layerUrlToId = {},
            ids,
            layerName,
            featuresByName = {},
            featureCount,
            popup,
            popupHtml,
            splitName,
            sldResponseHandler,
            trimLayerName = function (name) {
                // Names can be:
                // aggregationId_itemId_r_ribbonIndex
                // aggregationId_itemId
                // itemId
                splitName = name.split('_');
                if (splitName.length > 3) {
                    return splitName[1];
                } else if (splitName.length > 2) {
                    return splitName[0];
                }
                return splitName.last();
            };

        // I don't roll out of bed before having some features to work with.
        // If I have no features, this means the user clicked in an empty
        // spot
        if (features.length) {
            // Get just the displayed layers on the map 
            cchLayers = CCH.map.getMap().layers.findAll(function (l) {
                // Having geoserver as part of the url tells me that it's a
                // CCH layer and not anything else.
                // Even though the control itself filters by visible layer, I
                // have to check for visibility here because of the case where
                // the same layer is in the map a number of times but ribboned
                return l.url && l.url.indexOf('geoserver') > -1 && l.getVisibility();
            });

            // Set up the layer URL to ID lookup table. It is possible that
            // the map contains an aggregation of the same layer over and 
            // over with a different SLD for each layer. In order to handle
            // that, I need to make an array for the layer name (item.id) 
            // to be able to process this going forward
            cchLayers.each(function (l) {
                var lName = trimLayerName(l.name);

                if (!layerUrlToId[l.params.LAYERS]) {
                    layerUrlToId[l.params.LAYERS] = [];
                }

                layerUrlToId[l.params.LAYERS].push(lName);
                featuresByName[lName] = [];
            });

            // Populate the layers map
            // WARNING: This is a problem. There object of arrays created here 
            // could be massive. The maximum will be the count of layers being 
            // identified multiplied by me.maxFeatures. If max features or the
            // amount of layers gets too high, this could impact performance.
            // This function could probably be rewritten to use only the evt.features
            // array and not have to duplicate it over and over if multiple layers
            // are using the same features
            features.each(function (feature) {
                ids = layerUrlToId[feature.gml.featureNSPrefix + ':' + feature.gml.featureType];
                ids.each(function (id) {
                    featuresByName[id].push(feature.attributes);
                });
            });

            popupHtml = '<div class="col-md-12">' +
                    '<table>' +
                    '<tr id="loading-info-row"><td>Loading Information...</td></tr>' +
                    '</table>';

            // Create the popup and add it to the map
            popup = new OpenLayers.Popup.FramedCloud('feature-identification-popup',
                CCH.map.getMap().getLonLatFromPixel(evt.xy),
                new OpenLayers.Size(50,50),
                popupHtml,
                null,
                true,
                null);

            // Close any other layer identification widgets on the map
            CCH.map.removeAllPopups();
            CCH.map.getMap().addPopup(popup, true);

            sldResponseHandler = function (sld) {
                var bins = sld.bins,
                    units = sld.units,
                    title = sld.title,
                    layerId = this.layerId,
                    item = CCH.items.getById({id : layerId}),
                    attr = item.attr,
                    attrAvg = 0,
                    category,
                    incomingFeatures = this.features,
                    color,
                    buildLegend,
                    $popupHtml = $(popup.contentHTML),
                    $table = $popupHtml.find('table'),
                    $theadRow = $('<thead />').append(
                    $('<tr />').append(
                        $('<td />').html('Layer'),
                        $('<td />').html('Color'),
                        $('<td />').html('Value')
                    )),
                    buildLegend = function (args) {
                        args = args || {}
                        var binIdx = 0,
                            bins = args.bins,
                            color = args.color,
                            attrAvg = args.attrAvg,
                            title = args.title,
                            popup = args.popup,
                            units = args.units,
                            $popupHtml = $(popup.contentHTML),
                            $table = $popupHtml.find('table'),
                            $titleContainer = $('<td />'),
                            $colorContainer = $('<td />'),
                            $averageContainer = $('<td />'),
                            $legendRow = $('<tr>'),
                            item = args.item,
                            lb,
                            ub,
                            width,
                            height;
                    
                        $table.find('#loading-info-row').remove();
                        if ($table.find('thead').length === 0) {
                            $table.append($theadRow);
                        }
                        for (binIdx = 0; binIdx < bins.length && !color; binIdx++) {
                            lb = bins[binIdx].lowerBound;
                            ub = bins[binIdx].upperBound;

                            if (lb !== undefined && ub !== undefined) {
                                if (attrAvg < ub && attrAvg > lb) {
                                    color = bins[binIdx].color;
                                }
                            } else if (lb === undefined && ub !== undefined) {
                                if (attrAvg < ub) {
                                    color = bins[binIdx].color;
                                }
                            } else {
                                if (attrAvg > lb) {
                                    color = bins[binIdx].color;
                                }
                            }
                        }

                        $titleContainer.html(title);
                        $colorContainer.append($('<span />').css('backgroundColor', color).html('&nbsp;&nbsp;&nbsp;&nbsp;'));

                        if (item.attr.toLowerCase() === 'cvirisk') {
                            $averageContainer.append(bins[attrAvg.toFixed(0) - 1].category + ' Risk');
                        } else {
                            $averageContainer.append(attrAvg % 1 === 0 ? attrAvg.toFixed(0) : attrAvg.toFixed(3));
                            $averageContainer.append(' ' + units);
                        }
                        $legendRow.append($titleContainer, $colorContainer, $averageContainer);

                        $table.append($legendRow);
                        $popupHtml.append($table);
                        popup.setContentHTML($popupHtml.clone().wrap('<div/>').parent().html());
                        width = new OpenLayers.Size($('#feature-identification-popup div.col-md-12 > table').width());
                        height = function () {
                            var cHeight = 0;
                            $('#feature-identification-popup div.col-md-12 > table tr').each(function (ind, item) {
                                cHeight += $(item).height();
                            })
                            return cHeight;
                        };
                        popup.setSize(new OpenLayers.Size(width, height() + 5));
                        popup.panIntoView();
                        $(window).on('cch.ui.redimensioned', function () {
                            popup.setSize(new OpenLayers.Size(width, height() + 5));
                        });
                    };


                // Add up the count for each feature
                incomingFeatures.each(function (f) {
                    var pFl = parseFloat(f[attr]);
                    if (isNaN(pFl)) {
                        pFl = 0.0;
                    }
                    attrAvg += pFl;
                });

                // Average them out
                attrAvg /= incomingFeatures.length;

                if (item.type.toLowerCase() === 'vulnerability') {
                    if (["TIDERISK", "SLOPERISK", "ERRRISK", "SLRISK", "GEOM", "WAVERISK", "CVIRISK"].indexOf(attr.toUpperCase()) !== -1) {
                        attrAvg = Math.ceil(attrAvg);
                        category = sld.bins[attrAvg - 1].category;
                        color = sld.bins[attrAvg - 1].color;
                    }
                } else if (item.type.toLowerCase() === 'historical') {
                    if (["LRR", "WLR", "SCE", "NSM", "EPR"].indexOf(attr.toUpperCase()) === -1) {
                        // TODO - Figure out what needs to be done here. Need data to look at before that happens
                    }
                }
                
                buildLegend({
                    bins : bins,
                    color : color,
                    title : title,
                    attrAvg : attrAvg,
                    item : item,
                    popup : popup,
                    units : units
                });
            };

            for (layerName in featuresByName) {
                if (featuresByName.hasOwnProperty(layerName)) {
                    layerName = trimLayerName(layerName);
                    if (featuresByName.hasOwnProperty(layerName)) {
                        features = featuresByName[layerName];
                        featureCount = features.length;
                        if (featureCount) {
                            CCH.Util.getSLD({
                                itemId : layerName,
                                contextPath: CCH.CONFIG.contextPath,
                                context : {
                                    features : features,
                                    layerId : layerName,
                                    evt : evt,
                                    popup : popup
                                },
                                callbacks : {
                                    success : [sldResponseHandler],
                                    error : [
                                        function () {
                                            CCH.LOG.warn('Map.js::Could not get SLD information for item ' + layerName);
                                        }
                                    ]
                                }
                            });
                        }
                    }
                }
            }
        }
    },
    initialize : function (options) {
        "use strict";
        options = options || {};
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.WMSGetFeatureInfo.prototype.initialize.apply(this, [options]);

        this.events.register("getfeatureinfo", this, this.layerIdClickHandler);
    },
    CLASS_NAME: "OpenLayers.Control.WMSGetFeatureInfo"
});