/**
 * @author Jason
 * @email jiangran@126.com
 * @name PsDeepCleaner
 * @description photoshop metadata deep clean script
 */

function deleteDocumentAncestorsMetadata() {
    if(String(app.name).search("Photoshop") > 0) {

        if(!documents.length) {
            alert("There are no open documents. Please open a file to run this script.")
            return;
        }

        if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");

        var xmp = new XMPMeta( activeDocument.xmpMetadata.rawData);
        xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
        app.activeDocument.xmpMetadata.rawData = xmp.serialize();

        clearDocumentAncestorsForAllLayers(app.activeDocument);

        if (app.activeDocument !== mainDocument) {
            app.activeDocument.close(SaveOptions.SAVECHANGES);
        }else{
            app.activeDocument.save();
        }
    }
}

function clearDocumentAncestorsForAllLayers(doc) {
    try {

        if (doc == undefined) {
            return;
        }

        for (var i = 0; i < doc.layers.length; i++) {
            var curLayer = doc.layers[i];
            if (curLayer.typename != "ArtLayer") {
                clearDocumentAncestorsForAllLayers(curLayer);
                continue;
            }

            if (curLayer.kind == "LayerKind.SMARTOBJECT") {

                app.activeDocument.activeLayer = curLayer;
                
                var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
                var actionDescriptor = new ActionDescriptor();
                executeAction(idplacedLayerEditContents, actionDescriptor, DialogModes.NO);

                if(app.activeDocument.activeLayer == curLayer){
                    continue;
                }
                deleteDocumentAncestorsMetadata()
                layerSetStr += ("\n"+curLayer.name)

            }
        }
    } catch (e) {
        alert("Layer clean fail.name="+doc+";e="+e)
    }
}

function deleteDocumentAncestorsMetadataByInnerLayer() {
    clearDocumentAncestorsForAllLayers(app.activeDocument);
}

function recurArtLayer(layers){

    for(var i=0; i<layers.length; i++){
        //alert(layers[i]+"--"+layers[i].kind)

        if(layers[i].grouped!=false){
            recurArtLayer(layers[i].linkedLayers);
            alert(layers[i]+":"+layers[i].linkedLayers)
        }else if(layers[i].kind=="LayerKind.SMARTOBJECT"){
            alert(layers[i]+"--"+layers[i].kind)
            deleteArtLayerAncestorsMetadata(layers[i])
        }
    }
}

var layerSetStr = "";
var mainDocument = app.activeDocument;
function start(){
    deleteDocumentAncestorsMetadata();
    alert("Clean finished.\n[doc name]:"+mainDocument.name+"\n[layer set]:"+layerSetStr);
}
try{
    if(confirm("Start to clean?")){
        start();
    }
} catch (e) {
    alert("Task clean fail.e="+e)
}