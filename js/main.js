//Tutorial from Esri DevSummit: https://github.com/hgonzago/DevSummit-presentations/tree/gh-pages/Dev-Summit-2020/Getting-started-web-dev/Demos

//initial the base map
require(["esri/Map",
"esri/views/MapView",
"esri/layers/FeatureLayer",
"esri/PopupTemplate",
"esri/widgets/Expand",
"esri/widgets/Legend",
"esri/widgets/Swipe"],function(//,
    Map,
    MapView,
    FeatureLayer,
    PopupTemplate,
    Expand,
    Legend,
    Swipe
) {
    let crimeLayerView;
    const colorVisVar = {
        "type": "color",
        "field": "CrimeCnt", // the column name of your dataset you're rendering off
        "valueExpression": null,
        "stops": [{
            "value": 0,
            "color": [
            255,
            252,
            212,
            255
            ],
            "label": "< 0"
        },
        {
            "value": 25,
            "color": [
            224,
            178,
            193,
            255
            ],
            "label": null
        },
        {
            "value": 50.8,
            "color": [
            193,
            104,
            173,
            255
            ],
            "label": "50.8"
        },
        {
            "value": 75.9,
            "color": [
            123,
            53,
            120,
            255
            ],
            "label": null
        },
        {
            "value": 101,
            "color": [
            53,
            2,
            66,
            255
            ],
            "label": "> 101"
        }
        ]
    };

    const sizeVisVar = {
        "type": "size",
        "field": "NarcoticsC", //The size visual variable will be defined based on the narcotic counts within this tract.
        "valueExpression": null,
        "valueUnit": "unknown",
        "minSize": {
        "type": "size",
        "valueExpression": "$view.scale",
        "stops": [{
            "value": 1128,
            "size": 12
            },
            {
            "value": 2256,
            "size": 12
            },
            {
            "value": 288896,
            "size": 3
            },
            {
            "value": 2311162,
            "size": 3
            },
            {
            "value": 97989703,
            "size": 1.5
            }
        ]
        },
        "maxSize": {
        "type": "size",
        "valueExpression": "$view.scale",
        "stops": [{
            "value": 1128,
            "size": 60
            },
            {
            "value": 2256,
            "size": 60
            },
            {
            "value": 288896,
            "size": 37.5
            },
            {
            "value": 2311162,
            "size": 37.5
            },
            {
            "value": 97989703,
            "size": 18.75
            }
        ]
        },
        "minDataValue": 0,
        "maxDataValue": 378
    };

   /***********************************************************************
   * Define a simple renderer and set the visual variables.
   *
   * Even though the features in this layer are polygons, we will use a
   * SimpleMarkerSymbol to symbolize them. This will allow us to use the
   * size visual variable in the renderer.
   ***********************************************************************/

    const renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        // Define a default marker symbol with a small outline
        symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        outline: {
            // autocasts as new SimpleLineSymbol()
            color: [128, 128, 128],
            width: 0.5
        }
        },
        label: "test",
        // Set the color and size visual variables on the renderer
        visualVariables: [colorVisVar, sizeVisVar]
    };
    /******************************************************************
     *
     * Popup example
     *
     ******************************************************************/

    //Create the template
    const popupTemplate = new PopupTemplate({
        title: "Crime in Tract {NAME}",
        content: [{
            // Specify the type of popup element - fields
            //fieldInfos autocasts
            type: "fields",
            fieldInfos: [{
                fieldName: "CrimeCnt",
                visible: true,
                label: "Number of crimes: "
            },
            {
                fieldName: "NarcoticsC",
                visible: true,
                label: "Number of narcotics crimes: "
            },
            ]
        },
        {
            type: "media",
            // mediainfos autocasts
            mediaInfos: [{
            title: "Chicago Crime and Narcotics Rates",
            type: "column-chart",
            caption: "Crime rate in comparison to narcotics rate",
            value: {
                theme: "Julie",
                fields: ["CrimeRate", "NarcoticsR"],
            }
            }]
        }
        ]
    });

    const popupTemplate1 = new PopupTemplate({
        title: "Homicide in Tract {NAME}",
        content: [{
            // Specify the type of popup element - fields
            //fieldInfos autocasts
            type: "fields",
            fieldInfos: [{
                fieldName: "DATE__OF_OCCURRENCE",
                visible: true,
                label: "Date of Occurrence: "
            },
            {
                fieldName: "LOCATION_DESCRIPTION",
                visible: true,
                label: "Location: "
            },
            {
                fieldName: "CrimeCnt",
                visible: true,
                label: "Number of Crime: " 
            },
            {
                fieldName: "NarcoticsC",
                visible: true,
                label: "Number of Narcotics crimes: " 
            }
            ]
        }]
    });

    //add layers
    const chicagoCrime = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Chicago_Crime_Tracts/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: popupTemplate,
        renderer: renderer // Add the renderer to the feature layer
    });
    const chicagoHomicide = new FeatureLayer({
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Chicago_Homicide_Data/FeatureServer/0',
        popupTemplate: popupTemplate1,
    });

    //add map
    const map = new Map({
        basemap:"gray-vector",
        layers: [chicagoCrime, chicagoHomicide]
    }
    );

    //add mapview
    const view = new MapView({ //an instance which determine how your map is rendered
        container:"viewDiv", //all properties that can be set can show using console.log(view)
        map:map,
        zoom: 9,
        center:[-87.6298,41.8403],
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html#dockOptions
        popup:{ // popup is docked on the upper right corner
            dockOptions: {
                // Enables the dock button from the popup
                buttonEnabled: true,
                // Ignore the default sizes that trigger responsive docking
                breakpoint: true,
                position: 'bottom-right',
                height:2000,
                width:100
            }
        }
     });
    
    view.when(function () {
        // Add the layer
        // map.add(chicagoCrime);
        // map.addMany([chicagoCrime, chicagoHomicide]);
        /*****************************************************************
         * Demo 5: add the widget: Legend and Swipe 
         ****************************************************************/
        const chicagoCrime = map.layers.getItemAt(0); // bottom
        const homicideLayer = map.layers.getItemAt(1); // top
        homicideLayer.visible = true;
        
        // Step 1: Create the widget
        const legend = new Legend({
        // Step 2: Specify any additional properties for the legend. In this case,
        // we are just setting the view to where the legend should apply
        view: view,
        layerInfos: [{
            layer: chicagoCrime,
            title: "Chicago Crime Tracts"
            },
            {
            layer: homicideLayer,
            title: "Homicides"
            // layer: vehicles,
            // title: "Vehicle Thefts"
            }
        ]
        });
    
        const swipe = new Swipe({
        view: view,
        leadingLayers: [chicagoCrime],
        trailingLayers: [homicideLayer],
        position: 50
        });
    
        // Step 3: Add the widget to the view's UI, specify the docking position as well
        view.ui.add(legend, "bottom-left");
        view.ui.add(swipe);
    

        /******************************************************************
         * Demo 5.1: add the widget: Filtering data
         ******************************************************************/
        const crimeNodes = document.querySelectorAll('.crime-item');
        const crimesElement = document.getElementById('crimes-filter');
    
        // click event handler for crime amount choices
        crimesElement.addEventListener("click", filterByCrimeAmount);
    
        // User clicked on Winter, Spring, Summer or Fall
        // set an attribute filter on flood warnings layer view
        // to display the warnings issued in that season
        function filterByCrimeAmount(event) {
          const selectedCrimeAmount = event.target.getAttribute("data-crime");
    
          // switch statement for checking selectedCrimeAmount and then set filter
          // where clause
    
          switch (selectedCrimeAmount) {
            case "100":
              crimeLayerView.filter = {
                where: "CrimeCnt >= '" + selectedCrimeAmount + "'"
              };
              break;
            case "50-99":
              crimeLayerView.filter = {
                where: "(CrimeCnt >= 50)" + 'AND' + "(CrimeCnt <= 99)"
              };
              break;
            case "49":
              crimeLayerView.filter = {
                where: "CrimeCnt <= '" + selectedCrimeAmount + "'"
              };
          }
        }
    
        view.whenLayerView(chicagoCrime).then(function (layerView) {
          // Crime data layer is loaded
          // Get a reference to the crime data layerview
          crimeLayerView = layerView;
    
          // Set up the UI items
          crimesElement.style.visibility = "visible";
          const crimesExpand = new Expand({
            view: view,
            content: crimesElement,
            expandIconClass: "esri-icon-filter",
            group: "top-left"
          });
    
          // Clear the filters when the user closes the expand widget
          crimesExpand.watch("expanded", function () {
            if (!crimesExpand.expanded) {
              crimeLayerView.filter = null;
            }
          });
    
          // Add the widget
          view.ui.add(crimesExpand, "top-left");
        });
      });
})
