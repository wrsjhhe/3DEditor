function Struct(obj,textureSrc,objProperty) {

    this.keyId = Math.random()*100000000000000000;
    this.name = obj.name;
    this.type = obj.type;
    this.uuid = obj.uuid;
    this.text = (function () {
        try{
            return objProperty.text
        }catch (e){ return undefined }
    })();

    this.position = JSON.stringify(obj.position);
    this.scale = JSON.stringify(obj.scale);
    this.rotation = JSON.stringify(obj.rotation);
    return this;
}
function NormalStruct(obj,textureSrc,objProperty) {
    Struct.apply(this,arguments);
    this.materials = {
        id:this.keyId,
        material:JSON.stringify(obj.material.toJSON()),
        textureSrc:textureSrc
    };
    this.geometry = {
        type:obj.geometry.type,
        faces:JSON.stringify(obj.geometry.faces),
        vertices:JSON.stringify(obj.geometry.vertices),
        lineCurve:(function () {
            try{
                return JSON.stringify(objProperty.lineCurve)
            }catch (e){ return undefined }
        })()
    };

    this.obj = JSON.stringify(obj.toJSON());
    return this;
}

function CustomizeStruct(obj,textureSrc,objProperty) {
    Struct.apply(this,arguments);
    this.materials = {
        id:this.keyId,
        material:JSON.stringify(obj.material.toJSON()),
        textureSrc:textureSrc
    };
    this.geometry = {
        type:obj.geometry.type,
        faces:JSON.stringify(obj.geometry.faces),
        vertices:JSON.stringify(obj.geometry.vertices),
        lineCurve:(function () {
            try{
                return JSON.stringify(objProperty.lineCurve)
            }catch (e){ return undefined }
        })()
    };
    this.obj = undefined;
    return this;
}

function GroupStruct(obj) {

    Struct.apply(this,arguments);
    this.obj = JSON.stringify(obj.toJSON());
}

let objData = function (type,obj,textureSrc,objProperty) {

    switch(type)
    {
        case 0:
            return new NormalStruct(obj,textureSrc,objProperty);
            break;
        case 1:
            return new CustomizeStruct(obj,textureSrc,objProperty);
            break;
        case 2:
            return new  GroupStruct(obj,textureSrc,objProperty);
        break;
    }


};