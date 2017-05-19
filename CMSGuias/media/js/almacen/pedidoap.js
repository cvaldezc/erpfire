lped = []
lpedido = [];
var codped = '';
var desc = '';
var vardetpedido = '';
var cgrupo = '';
var codigomaterial = '';
var codigobrand = '';
var codigomodel = '';
var codtabdetped='';
var idproy = '';
var descpro = '';
var valor = '';
var listnip = ''
var cenviada = '';
var pkmat=''
var pkbr=''
var pkmod=''
var nmat = ''
var medmat = ''
var codtable = ''
var cantidadenv = ''
var respcant = ''
var fechped = ''
var estadogrupo = ''
lmatselect = [];
ldetped = []
lfech = []
cantlinip = []

$(document).ready(function() {
    $('.modal').modal();
    $('.listdetped').modal({
        dismissible: false
    });
    $('.listdetniple').modal({
        dismissible:false
    })



    //buscadores
    $(".txtbuscarped").on("keyup", buscarpedido);
    $("input[name=txtbusdetgroup]").on("keyup", busdetgroup);
    $("input[name=txtbustabdetped]").on("keyup", bustabdetped);
    $("input[name=txtbustabgrupo]").on("keyup", bustabgrupo);
    $("input[name=txtbusgr]").on("keyup", busgr);


    //save
    $(document).on("click", ".btnsavdetped", savdetped);
    $(document).on("click", ".btnsavdetniple", savdetniple);
    //edit
    $(document).on("click", ".btneddetgrupo", eddetgrupo);
    $(document).on("click", ".btnedcantmatdetgr", edcantmatdetgr);
    $(document).on("click", ".btneddetniple", eddetniple);

    //delete
    $(document).on("click", ".btnanulgrupo", anulgrupo);
    $(document).on("click", ".btndeldetgrupo", deldetgrupo);
    $(document).on("click", ".btndeldetniple", deldetniple);

    //open modals
    $(document).on("click", ".btnopendetped", opendetped);
    $(document).on("click", ".btnopencodsgrupo", opencodsgrupo);
    $(document).on("click", ".btnselcodgrupo", selcodgrupo);


    $(".btngengrupo").click(function() { gengrupo(); });
    $(document).on("click", ".btngencodgrupo", gencodgrupo);
    $(document).on("click", ".btngenpdf", genpdf);
    $(document).on("click", ".btnviewpdf", viewpdf);



    estadogrupo = 'GE'
    listgrupo();
    combochosen('#cboproy');
});


anulgrupo = function(){
    var codgrupo;
    codgrupo = this.value;
    swal({
        title:'Eliminar Grupo',
        text:'Seguro de devolver todo el detalle del Grupo: '+codgrupo,
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Devolver!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true,
        type:'warning'

    }, function(isConfirm){
        if (isConfirm) {
            var data = new Object;
            data.getldetgrupo = true;
            data.codgrupo = codgrupo;
            $.getJSON("",data, function(response){
                if (response.status) {
                    var ldetgrupo = response.ldetgrupo
                    console.log(response.ldetgrupo) //detalle de almacen_detGrupoPedido
                    ///
                    suma =[]
                    // cantidad = 0
                    ldetgrupo.forEach(function(o) {
                    var existing = suma.filter(function(i){
                        return i.codgrup === o.codgrup &&
                               i.codmat === o.codmat &&
                               i.codmarca === o.codmarca &&
                               i.codmod === o.codmod &&
                               i.codped === o.codped
                    })[0];
                    if (!existing){
                        suma.push(o);
                    }
                    else{
                        // console.log(parseFloat(o.cantidad))
                        existing.cantidad = Math.round((existing.cantidad)*100)/100 + o.cantidad
                    }
                    })
                    ///
                    console.log(suma); // realiza suma de detalle de almacen_detGrupoPedido



                    var da =new Object;
                    da.getdetpedido = true
                    da.ldetgrupo = JSON.stringify(suma);
                    $.getJSON("",da,function(response){
                        if (response.status) {
                            console.log('as')
                            var listadped = response.listadped
                            console.log(response.listadped) //detalle de almacen_Detpedido con resta--guardarlo


                            var dato = new Object;
                            dato.getdetnip = true;
                            dato.codgrupo = codgrupo;
                            console.log(dato.codgrupo)
                            $.getJSON("",dato,function(response){
                                if (response.status) {
                                    var ldgr = response.ldgr
                                    console.log(response.ldgr)//detalle de almacen_GrupoPedNiple

                                    sumanip =[]
                                    ldgr.forEach(function(o) {
                                    var existing = sumanip.filter(function(i){
                                        return i.idnipleref === o.idnipleref
                                    })[0];
                                    if (!existing){
                                        sumanip.push(o);
                                    }
                                    else{
                                        // console.log(parseFloat(o.cantidad))
                                        existing.cantid = Math.round((existing.cantid)*100)/100 + o.cantid
                                    }
                                    })
                                    console.log(sumanip)

                                    var nipdata = new Object;
                                    nipdata.gniple = true
                                    nipdata.lsumdetnip = JSON.stringify(sumanip)
                                    $.getJSON("",nipdata, function(response){
                                        if (response.status) {
                                            var lgniple = response.lgniple
                                            console.log(response.lgniple)

                                            var fdata = new Object;
                                            fdata.updanulgrup = true
                                            fdata.delcodgrupo = codgrupo
                                            console.log(JSON.stringify(listadped))
                                            fdata.listadped = JSON.stringify(listadped)
                                            fdata.ldgr = JSON.stringify(ldgr)
                                            fdata.ldetgrupo = JSON.stringify(ldetgrupo)
                                            fdata.lgniple = JSON.stringify(lgniple)
                                            fdata.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                            $.post("",fdata,function(response){
                                                if (response.status) {
                                                    console.log('update detpedido')
                                                    swal({title:'Eliminacion de Grupo CORRECTA',timer:2000,showConfirmButton: false,type: "success"});
                                                    listgrupo();
                                                };
                                            })
                                        };
                                    })
                                };
                            })

                        };
                    })
                };
            })

        };
    })
}



bustabdetped = function(){
    busc2colherra('txtbustabdetped','tab-detped',1,2)
}

bustabgrupo = function(){
    busc2colherra('txtbustabgrupo','tab-lcodsgrupo',1,2)
}

buscarpedido = function(){
    busc2colherra('txtbuscarped','tab-pedido',1,3)
}

busdetgroup = function(){
    busc3colherra('txtbusdetgroup','tab-detgrupo',1,2,3)
}

busgr = function(){
    busc2colherra('txtbusgr','tab-grupo',1,1)
}


combochosen = function(combo){
$(combo).chosen({
    allow_single_deselect:true,
    width: '100%'});
}



edcantmatdetgr = function(){
    var cped,cmat,cbr,cmod,ctotal,canti,cgroup;
    cped = this.getAttribute("data-edcantidpedido")
    cmat = this.value;
    canti = this.getAttribute("data-edcantcantidad")
    cbr = this.getAttribute("data-edcantidbrand");
    cmod = this.getAttribute("data-edcantidmodel");
    nmat = this.getAttribute("data-ednamemat");
    medmat = this.getAttribute("data-edmedmat");
    codtable = this.getAttribute("data-idtable");
    console.log(cmod)
    console.log(codtable)

    var data = new Object;
    pkmat = cmat;
    pkbr = cbr;
    pkmod = cmod;
    data.getcantdetniple = true
    data.codped=cped
    data.codmat=pkmat
    data.codbr=pkbr
    data.codmod=pkmod
    /////
    data.getcantdetped = true
    data.cped = cped;
    data.cmat = pkmat;
    data.cbr = pkbr;
    data.cmod =pkmod;

    $.getJSON("",data,function(response){
        if (response.status) {
            var stlcantdnip = response.stlcantdnip;
            console.log(stlcantdnip)
            if (stlcantdnip == true) {
                respcant = response.cantenv;
                console.log(respcant)
                listeddetniple();
                console.log('tuberia')


            }else{
                console.log('no tuberia')
                swal({
                    title:'Material: '+cmat,
                    text:'Ingrese la cantidad para agrupar',
                    type:'input',
                    showCancelButton:true,
                    closeOnConfirm:false,
                    animation:"slide-from-top",
                }, function(inputValue){
                    ctotal = parseFloat(inputValue);
                    console.log(ctotal)

                    var dato = new Object;
                    dato.cped = cped;
                    dato.cmat = cmat;
                    dato.cbr = cbr;
                    dato.cmod = cmod;
                    dato.getcantdetped = true;
                    $.getJSON("",dato, function(response){
                        if (response.status) {
                            var cant,codbr,codm,codmod,codp,cantenv;
                            cant = response.cantidad;
                            cantenv = response.cantenv;
                            codbr = response.brand_id;
                            codm = response.materiales_id;
                            codp = response.pedido_id;
                            // cantidadenv = response.cantenv;
                            // console.log(cantidadenv)

                            if (ctotal == "" || parseFloat(ctotal) < 0 || (!/^[0-9.,\s]*$/.test(ctotal))) {
                                swal.showInputError("Cantidad ingresada INCORRECTA");
                                return false;
                            };

                            var tot,cantsend;
                            if (parseFloat(ctotal) >= parseFloat(canti)) {
                                tot = parseFloat(ctotal) - parseFloat(canti)
                                cantsend = parseFloat(tot) + parseFloat(cantenv)
                            }else{
                                tot = parseFloat(canti) - parseFloat(ctotal)
                                cantsend = parseFloat(cantenv) - parseFloat(tot)
                            }

                            // var sum = tot + cantenv
                            console.log(cantenv)
                            console.log(cant)

                            console.log(tot)
                            console.log(cantsend)

                            if (parseFloat(cantsend) > parseFloat(cant)) {
                                swal.showInputError("Debe ingresar una cantidad menor a la cantidad del pedido");
                                return false;
                            }else{
                            console.log('as')
                            console.log(response.cantidad)

                            var dat = new Object;
                            dat.codgrupo = $(".lblgrupo").text();
                            dat.matid = cmat;
                            dat.brid = cbr;
                            dat.modid = cmod;
                            dat.cantidad = ctotal;
                            dat.updcatndetgrupo = true;
                            dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                            $.post("", dat, function(response){
                                if (response.status) {
                                    var data = new Object;
                                    data.idped = cped;
                                    data.idmat = cmat;
                                    data.idbr = cbr;
                                    data.idmod = cmod;
                                    data.cantidad = parseFloat(cantsend);
                                    console.log(ctotal);
                                    data.updcantdetped = true;
                                    data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                    $.post("",data, function(response){
                                        if (response.status) {
                                            swal({title:'Cantidad Editada',timer:1000,showConfirmButton: false,type: "success"});
                                            cgrupo =$(".lblgrupo").text();
                                            listdetgrupo();
                                        };
                                    })
                                };
                            })
                            }

                        };
                    })
                })
            }

        };
    })
}

eddetniple = function(){

    var cmat,cbr,cmod,idtabniple,idtab,cpedi;
    cmat = this.getAttribute("data-ednipcodmat")
    cbr = this.getAttribute("data-ednipcodbr")
    cmod = this.getAttribute("data-ednipcodmod")
    ednipcant = this.getAttribute("data-ednipcant")
    idtab = this.getAttribute("data-idtable")
    cpedi = this.getAttribute("data-ednipcpedi")
    idtabniple = this.value;
    console.log(idtabniple,idtab)
    console.log(codtable)
    console.log(ednipcant)

    // console.log(respcant)

    swal({
        title:'Material: '+cmat,
        text:'Ingrese la cantidad para agrupar',
        type:'input',
        showCancelButton:true,
        closeOnConfirm:false,
        animation:"slide-from-top",
    }, function(inputValue){

        var datos = new Object
        datos.getcantdetped = true;
        datos.cped=cpedi
        datos.cmat=cmat
        datos.cbr=cbr
        datos.cmod=cmod
        $.getJSON("",datos,function(response){
            if (response.status) {
                var respcant = response.cantenv
                console.log(respcant)


                var dat=new Object;
                dat.cped=cpedi
                dat.codgrupo=$(".lblgrupo").text()
                dat.cmat=cmat
                dat.cbr=cbr
                dat.cmod=cmod
                dat.getcantdetgrped = true;
                $.getJSON("",dat,function(response){
                    if (response.status) {
                        var cantdetgr=response.cantidad
                        console.log(cantdetgr)


                        var data = new Object;
                        data.idtabniple = idtabniple;
                        data.getdetniple = true;
                        $.getJSON("",data,function(response){
                            if (response.status) {
                                var idnip = response.id;
                                var cant = response.cantidad;
                                var cantenv = response.cantenv;
                                var metrado = response.metrado;
                                var idped = response.pedido;
                                var idmat = response.materiales;
                                var idbr = response.brand;
                                var idmod = response.model;

                                var tot = (parseFloat(metrado)/100)*parseFloat(inputValue)
                                console.log(parseFloat(tot))
                                console.log(idnip,cant,cantenv,metrado,idped,idmat,idbr,idmod)

                                if (inputValue == "" || parseFloat(inputValue) < 0 || (!/^[0-9.,\s]*$/.test(inputValue))) {
                                    swal.showInputError("Cantidad ingresada INCORRECTA");
                                    return false;
                                }

                                var edtot,edcantsend,edcantdetped,edcantdetgr;
                                var metrdec = parseFloat(metrado)/100;
                                console.log(metrdec)
                                if (parseFloat(inputValue) >= parseFloat(ednipcant)) {
                                    edtot = parseFloat(inputValue) - parseFloat(ednipcant);
                                    edcantsend = parseFloat(edtot) + parseFloat(cantenv);
                                    edcantdetped = (parseFloat(edtot)*metrdec) + parseFloat(respcant)
                                    edcantdetgr = parseFloat(cantdetgr) + (parseFloat(edtot)*metrdec)
                                }else{
                                    edtot = parseFloat(ednipcant) - parseFloat(inputValue);
                                    edcantsend = parseFloat(cantenv) - parseFloat(edtot)
                                    edcantdetped = parseFloat(respcant) - (parseFloat(edtot)*metrdec)
                                    edcantdetgr = parseFloat(cantdetgr) - (parseFloat(edtot)*metrdec)
                                }
                                console.log(parseFloat(edcantsend));
                                console.log(parseFloat(edcantdetped));
                                console.log(parseFloat(edcantdetgr))

                                if (parseFloat(edcantsend) > parseFloat(cant)) {
                                    swal.showInputError("Debe ingresar una cantidad menor a la cantidad del pedido");
                                    return false;
                                }else{
                                    console.log('bi')
                                    var dato = new Object;
                                    dato.idnip = idnip;
                                    dato.idtab = idtab;
                                    dato.codtabdetgrped = codtable
                                    dato.edcantsend = Math.round(parseFloat(edcantsend)*100)/100
                                    dato.edcantdetped = Math.round(parseFloat(edcantdetped)*100)/100
                                    dato.cant = Math.round(parseFloat(inputValue)*100)/100;
                                    dato.cped = idped
                                    dato.cmat = idmat
                                    dato.cbr = idbr
                                    dato.cmod = idmod
                                    dato.total = Math.round(parseFloat(edcantdetgr)*100)/100
                                    dato.updcantenv = true;
                                    dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                    $.post("",dato,function(response){
                                        if (response.status) {
                                            swal({title:'Edicion de niple CORRECTO',timer:2000,showConfirmButton: false,type: "success"})
                                            cgrupo = $(".lblgrupo").text();
                                            listdetgrupo()
                                            pkmat = idmat;
                                            pkbr = idbr;
                                            pkmod = idmod;
                                            listeddetniple();
                                        };
                                    })
                                }
                            };
                        })



                    };
                })
            };
        })

    });
}

deldetniple = function(){
    var codtable,idref,cantniple,cped,cmat,cbr,cmod,metrado;
    idref = this.value;
    cped=this.getAttribute("data-cped")
    cmat = this.getAttribute("data-codmat")
    cbr = this.getAttribute("data-codbr")
    cmod = this.getAttribute("data-codmod")
    codtable = this.getAttribute("data-idtable");
    cantniple = this.getAttribute("data-cantidad")
    metrado = this.getAttribute("data-metrado")

    console.log(idref)
    console.log(cmod)
    console.log(codtable)

    swal({
        title: "Eliminar Niple",
        text: "Seguro de Eliminar niple del grupo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Eliminar!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
        }, function(isConfirm){
            if (isConfirm) {
                var data,
                data=new Object;
                data.idtabniple = idref
                data.getdetniple = true
                $.getJSON("",data,function(response){
                    if (response.status) {
                        console.log(response.cantenv)
                        var nipcantenv = parseFloat(response.cantenv)
                        var tot = parseFloat(nipcantenv) - parseFloat(cantniple)
                        console.log(parseFloat(tot))
                        /////////////////////////////////
                        var dato = new Object;
                        dato.cped = cped,
                        dato.cmat = cmat,
                        dato.cbr = cbr,
                        dato.cmod = cmod,
                        dato.getcantdetped = true
                        $.getJSON("",dato,function(response){
                            if (response.status) {
                                var cantmetxnip = (parseFloat(metrado)/100)*parseFloat(cantniple)
                                console.log(cantmetxnip)
                                var dpedcantenv = response.cantenv
                                console.log(dpedcantenv)
                                var updcantdped = parseFloat(dpedcantenv) - parseFloat(cantmetxnip)
                                console.log(parseFloat(updcantdped))


                                var da=new Object;
                                da.getcantdetgrped = true
                                da.cped =cped
                                da.codgrupo=$(".lblgrupo").text();
                                da.cmat=cmat
                                da.cbr=cbr
                                da.cmod=cmod
                                $.getJSON("",da,function(response){
                                    if (response) {
                                        var cantdetgrped = response.cantidad
                                        console.log(cantdetgrped)
                                        var totdetgrped=parseFloat(cantdetgrped) - parseFloat(cantmetxnip)
                                        console.log(totdetgrped)




                                        ////////////////////
                                        var dat = new Object;
                                        dat.idnip = idref;
                                        dat.cant = tot;
                                        dat.cped=cped;
                                        dat.cmat=cmat;
                                        dat.cbr=cbr;
                                        dat.codgrupo = $(".lblgrupo").text();
                                        dat.cmod=cmod;
                                        dat.cantdped = Math.round(updcantdped*100)/100;
                                        console.log(dat.cantdped)
                                        dat.cantmetxnip = Math.round(cantmetxnip*100)/100;
                                        console.log(dat.cantmetxnip)
                                        dat.idtab = codtable;
                                        dat.upddelniple = true;
                                        dat.cantdetgrped = Math.round(totdetgrped*100)/100;
                                        console.log(idref,tot,cped,cmat,cbr,dat.codgrupo,cmod,updcantdped,cantmetxnip,codtable)
                                        dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                        $.post("",dat,function(response){
                                            if (response.status) {
                                                console.log('ok')
                                                swal({title:'Eliminacion de Niple CORRECTA',timer:2000,showConfirmButton: false,type: "success"})
                                                cgrupo = $(".lblgrupo").text();
                                                listdetgrupo()
                                                pkmat = cmat;
                                                pkbr = cbr;
                                                pkmod = cmod;
                                                listeddetniple();
                                            };
                                        })

                                    };
                                })

                            };
                        })
                    };
                })

            };
        })
}

listeddetniple = function(){
    var data = new Object;

    data.codgroup = $(".lblgrupo").text();
    data.lgrpedniple = true
    data.codmat = pkmat;
    data.codbr = pkbr;
    data.codmod = pkmod
    $.getJSON("",data,function(response){
        if (response.status) {
            $(".leditdetnip").modal("open")
            $(".lblednipcodmat").text(pkmat)
            $(".lblednipnamemat").text(nmat)
            $(".lblednipmedmat").text(medmat)
            $tb = $("table.tab-eddetnip > tbody");
            $tb.empty();
            template = "<tr><td>{{ item }}</td><td>{{ cantidad }}</td><td>{{ metrado }}</td><td>{{ tipo }}</td><td><button type=\"button\" class=\"transparent btneddetniple\" style=\"border:none;font-size:25px;\" data-ednipcpedi=\"{{ cpedi }}\" data-idtable=\"{{ idtable }}\" value=\"{{ idref }}\" data-ednipcodmat=\"{{ codmat }}\" data-ednipcodbr=\"{{ codmarca }}\" data-ednipcodmod=\"{{ codmod }}\" data-ednipcant=\"{{ cantidad }}\"><a style=\"color:#4caf50\"><i class=\"fa fa-pencil-square\"></i></a></button><button type=\"button\" class=\"transparent btndeldetniple\" style=\"border:none;font-size:25px;\" value=\"{{ idref }}\" data-cantidad=\"{{ cantidad }}\" data-idtable=\"{{ idtable }}\" data-codmat=\"{{ codmat }}\" data-codbr=\"{{ codmarca }}\" data-codmod=\"{{ codmod }}\" data-cped=\"{{ cpedi }}\" data-metrado=\"{{ metrado }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
            for (x in response.lgrniple) {
            response.lgrniple[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.lgrniple[x]));
            }
        };
    })
}


eddetgrupo = function(){
    var codgrupo;
    codgrupo = this.value;
    console.log(codgrupo)
    $(".lblgrupo").text(codgrupo);
    cgrupo = codgrupo;
    listdetgrupo();
}

deldetgrupo = function(){
    console.log(this.value)
    var idtable,idped,idmat,idbr,idmod;
    idtable = this.value;
    idped = this.getAttribute("data-delidped");
    idmat = this.getAttribute("data-delidmat");
    idbr = this.getAttribute("data-delidbr");
    idmod = this.getAttribute("data-delidmod");

    swal({
        title:'Quitar Material',
        text:'Seguro de Eliminar Material del Grupo?',
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Eliminar!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true,
        type:'warning'

    }, function(isConfirm){
        if (isConfirm) {
            var dato = new Object;
            dato.idped = idped;
            dato.idmat = idmat;
            dato.idbr = idbr;
            dato.idmod = idmod;
            dato.cantidad = 0;
            dato.updcantdetped = true;
            dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
            $.post("",dato, function(response){
                if (response.status) {
                    var data = new Object;
                    data.deldetmat = true;
                    data.idtable = idtable;
                    data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                    $.post("",data,function(response){
                        if (response.status) {
                            swal({title:'Eliminacion de material CORRECTO',timer:2000,showConfirmButton: false,type: "success"})
                            cgrupo = $(".lblgrupo").text();
                            listdetgrupo()
                        };
                    })

                };
            })
        };
    })
}


genpdf=function(){
    var codigrupo = this.value
    console.log(codigrupo)
    swal({
        title:'Generar PDF',
        text:'Seguro de Generar PDF?',
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Generar!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true,
        type:'warning'

    }, function(isConfirm){
        if (isConfirm) {
            var data=new Object;
            data.updstgrped=true
            data.estado='CO'
            data.codgrupo=codigrupo;
            console.log(codigrupo)
            data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
            $.post("",data,function(response){
                if (response.status) {
                    console.log('gr update')
                    swal({title:'PDF Generado',timer:1000,showConfirmButton: false,type: "success"})
                    listgrupo()
                };
            })
        };
    })
}

listgrupo = function(){
    var data;
    data = new Object;
    console.log(estadogrupo)
    data.estgr=estadogrupo;
    data.listgrupo = true;
    $.getJSON("", data, function(response){
        if (response.status) {
            $tb = $("table.tab-grupo > tbody");
            $tb.empty();
            template = "<tr><td>{{ item }}</td><td>{{ codgrupo_id }}</td><td>{{ codproy }} - {{ nameproy }}</td><td>{{ nameemple }}</td><td>{{ fechtrasl }}</td><td><button type=\"button\" class=\"transparent btneddetgrupo\" style=\"border:none;font-size:25px;\" value=\"{{ codgrupo_id }}\"><a style=\"color:#4caf50\"><i class=\"fa fa-pencil-square\"></i></a></button><button type=\"button\" class=\"transparent btngenpdf\" style=\"border:none;font-size:22px;\" value=\"{{ codgrupo_id }}\"><a><i class=\"fa fa-file-pdf-o\"></i></a></button><button type=\"button\" class=\"transparent btnanulgrupo\" style=\"border:none;font-size:25px;\" value=\"{{ codgrupo_id }}\"><a style=\"color:#ef5350\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
            template2 ="<tr>" +
                "<td class='col-1'>{{ item }}</td>" +
                "<td>{{ codgrupo_id }}</td>" +
                "<td>{{ codproy }} - {{ nameproy }}</td>" +
                "<td>{{ nameemple }}</td>" +
                "<td>{{ fechtrasl }}</td>" +
                "<td>" +
                "<a class=\"transparent btnviewpdf\" style=\"border:none;font-size:22px;\" href=\""+ response['servreport'] + "orders/group/view?idgroup={{ codgrupo_id }}\"> " +
                "<i class=\"fa fa-file-pdf-o\"></i></a></td>" +
                "</tr>";

            if (estadogrupo=='GE') {
                for (x in response.lgrupo) {
                response.lgrupo[x].item = parseInt(x) + 1;
                $tb.append(Mustache.render(template, response.lgrupo[x]));
                }
            }else{
                for (x in response.lgrupo) {
                response.lgrupo[x].item = parseInt(x) + 1;
                $tb.append(Mustache.render(template2, response.lgrupo[x]));
                }
            }
        };
    })
}

listdetgrupo = function(){
    var data;
    data = new Object;
    data.codgrupo = cgrupo;
    console.log(data.codgrupo)
    data.getldetgrupo = true;
    $.getJSON("", data, function(response){
        if (response.status) {
            console.log(response.lengrupo)

            if (response.lengrupo == false) {
                console.log('saw')
                $(".leditdetnip").modal("close");
                $(".eddetgrupo").modal("close");
                listgrupo()
            }else{
                var dato = response.ldetgrupo
                console.log(dato)
                var dat=new Object;
                dat.getsizegrnip=true;
                dat.ldetgrupo = JSON.stringify(dato)
                $.getJSON("", dat, function(response){
                    if (response.status) {

                        console.log(dato)
                        suma =[]
                        dato.forEach(function(o) {
                        var existing = suma.filter(function(i){
                            return i.codgrup === o.codgrup &&
                                   i.codmat === o.codmat &&
                                   i.codmarca === o.codmarca &&
                                   i.codmod === o.codmod &&
                                   i.codped === o.codped
                        })[0];
                        if (!existing){
                            suma.push(o);
                            // console.log(o)
                        }
                        else{
                            existing.cantidad = Math.round((existing.cantidad)*100)/100 + o.cantidad;
                        }

                        });
                        console.log(suma)
                        var da= new Object;
                        da.ldetsum=JSON.stringify(suma);
                        da.getlstatus=true
                        $.getJSON("",da,function(response){
                            if (response.status) {
                                var lstat = response.lstat
                                console.log(lstat)

                                $(".eddetgrupo").modal("open");
                                $tb = $("table.tab-detgrupo > tbody");
                                $tb.empty();
                                template = "<tr><td class=\"col5\" style=\"text-align:center\">{{ item }}</td><td class=\"col10\">{{ codped }}</td><td class=\"col10\">{{ codmat }}</td><td class=\"col35\">{{ namemat }}</td><td class=\"col10\">{{ medmat }}</td><td class=\"col10\">{{ namemarca }}</td><td class=\"col10\">{{ namemodel }}</td><td class=\"col5\">{{ cantidad }}</td><td class=\"col5\"><button type=\"button\" class=\"transparent btnedcantmatdetgr\" style=\"border:none;font-size:20px;\" value=\"{{ codmat }}\" data-ednamemat=\"{{ namemat }}\" data-edmedmat=\"{{ medmat }}\" data-edcantidpedido=\"{{ codped }}\" data-edcantidbrand=\"{{ codmarca }}\" data-edcantidmodel=\"{{ codmod }}\" data-edcantcantidad=\"{{ cantidad }}\" data-idtable=\"{{ id }}\" data-codgroup=\"{{ codgrup }}\"><a><i class=\"fa fa-pencil-square\"></i><a/></button><button type=\"button\" class=\"transparent btndeldetgrupo\" style=\"border:none;font-size:20px\" value=\"{{ id }}\" data-delidped=\"{{ codped }}\" data-delidmat=\"{{ codmat }}\" data-delidbr=\"{{ codmarca }}\" data-delidmod=\"{{ codmod }}\"><a style=\"color:#ef5350;\"><i class=\"fa fa-times-circle\"></i></a></button></td></tr>";
                                template2 = "<tr><td class=\"col5\" style=\"text-align:center\">{{ item }}</td><td class=\"col10\">{{ codped }}</td><td class=\"col10\">{{ codmat }}</td><td class=\"col35\">{{ namemat }}</td><td class=\"col10\">{{ medmat }}</td><td class=\"col10\">{{ namemarca }}</td><td class=\"col10\">{{ namemodel }}</td><td class=\"col5\">{{ cantidad }}</td><td class=\"col5\"><button type=\"button\" class=\"transparent btnedcantmatdetgr\" style=\"border:none;font-size:20px;\" value=\"{{ codmat }}\" data-ednamemat=\"{{ namemat }}\" data-edmedmat=\"{{ medmat }}\" data-edcantidpedido=\"{{ codped }}\" data-edcantidbrand=\"{{ codmarca }}\" data-edcantidmodel=\"{{ codmod }}\" data-edcantcantidad=\"{{ cantidad }}\" data-idtable=\"{{ id }}\" data-codgroup=\"{{ codgrup }}\"><a><i class=\"fa fa-pencil-square\"></i><a/></button></td></tr>";

                                console.log(suma)
                                for (x in suma) {
                                    console.log(x)
                                    if (lstat[parseInt(x)]['estado']==false) {
                                        suma[x].item = parseInt(x) + 1;
                                        $tb.append(Mustache.render(template, suma[x]));
                                    }else{
                                        suma[x].item = parseInt(x) + 1;
                                        $tb.append(Mustache.render(template2, suma[x]));
                                    }
                                }

                            };
                        })
                    };
                })

            }

        }
    })
}

gencodgrupo = function(){
    var data,codpro,detpro,description;
    detpro = $("select[id=cboproy] > option:selected ").text();
    codpro = $("select[id=cboproy]").val();

    swal({
        title: "Desea Generar Codigo",
        text: "relacionado al proyecto "+detpro,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Generar!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
        }, function(isConfirm){
            if (isConfirm) {
                data = new Object;
                data.gencodgrupo = true;
                data.codpro = codpro;
                data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                $.post("",data,function(response){
                    if (response.status) {
                        document.getElementById('divcodgrupo').style.display="block"
                        $(".lblcodgrupo").text(response.codgrupo)
                        $(".lblcodproyecto").text(codpro)
                        $(".lbldetgrupo").text(detpro)
                        swal({title:'Codigo Generado',timer:1000,showConfirmButton: false,type: "success"})
                        document.getElementById('divcboproy').style.display = 'none';
                        document.getElementById('divgencodigo').style.display = 'none';
                    };
                })

            };
        })
}

savdetped = function(){
    var arrcantenv,datf,cgru,fechfinal;
    arrcantenv = [];
    console.log(vardetpedido)
    console.log(fechped)

    datf=new Object;
    cgru = $(".lblcodgrupo").text();
    datf.cgrupo = cgru;
    datf.getfech = true
    $.getJSON("",datf,function(response){
        if (response.status) {
            var fechtr = response.fechtraslado
            console.log(new Date(fechped))
            console.log(new Date(fechtr))
            if (fechtr == null) {
                fechfinal = fechped
            }else{
                if (new Date(fechped) > new Date(fechtr)) {
                    fechfinal = fechped
                }else{
                    fechfinal = fechtr
                }
            }
            console.log(fechfinal)
        };
    })



    for (var i=0; i < vardetpedido.length; i++){
        var input = $(".cenviada"+i).val();
        // console.log(double(input))
        if (parseFloat(input) < 0.1) {
            swal({title:'',text:"Cantidad INCORRECTA en el item "+vardetpedido[i]['item'],timer:2000,showConfirmButton: false,type: "error"})
            arrcantenv = []
            return false;
        }else{
            if (input != "") {
                var ctotal = parseInt(vardetpedido[i]['cantenv']) + parseFloat(input);
                if (parseFloat(ctotal) > parseFloat(vardetpedido[i]['cantidad'])) {
                    swal({title:'',text:"Cantidad total es mayor al detalle en el item "+vardetpedido[i]['item'],timer:2500,showConfirmButton: false,type: "error"})
                    arrcantenv = []
                    return false
                }else{
                    arrcantenv.push({
                        'codmat':vardetpedido[i]['codmat'],
                        'codbrand':vardetpedido[i]['idbrand'],
                        'codmodel':vardetpedido[i]['idmodel'],
                        'inputcant':parseFloat(input),
                        'cantupd':ctotal,
                        'idped':vardetpedido[i]['codpedido']
                    })
                }
            };
        }
    }
    console.log(arrcantenv);
    if (arrcantenv.length == 0) {
        swal({title:'Debe Enviar al menos un Material',timer:2500,showConfirmButton: false,type: "error"})
    }else{
        var lmat = JSON.stringify(arrcantenv);
        var da = new Object;
        da.lmat = lmat;
        da.codgrupo = $(".lblcodgrupo").text();
        da.existmat = true;
        // da.getfech = true;
        $.getJSON("",da, function(response){
            if (response.status) {
                var cantlexistmat = response.lexistmat;
                var stlexistmat = response.stlexistmat;
                console.log(response.stlexistmat)
                if (stlexistmat == false) {
                    swal({
                        title: "",
                        text: "Desea guardar el detalle?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#dd6b55",
                        confirmButtonText: "Si, Guardar!",
                        cancelButtonText: "No, Cancelar",
                        closeOnConfirm: true,
                        closeOnCancel: true
                        }, function(isConfirm){
                            if (isConfirm) {
                                console.log(arrcantenv);
                                console.log(lmat)
                                var dato;
                                dato = new Object;
                                dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                dato.lmat = lmat;
                                dato.codgrupo = $(".lblcodgrupo").text();
                                dato.idped = $(".lblcodped").text();
                                dato.upddetped = true
                                $.post("", dato, function(response){
                                    if (response.status) {
                                        var data;
                                        data= new Object;
                                        data.codgrupo = $(".lblcodgrupo").text();
                                        data.lmat = lmat;
                                        data.estado = true
                                        data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                        data.savedetgrupo = true;
                                        data.updfech = true
                                        data.cgrupo=cgru
                                        data.fechatrasl = fechfinal
                                        $.post("", data, function(response){
                                            if (response.status) {
                                                $(".listdetped").modal("close");
                                                swal({title:'Datos Guardados',timer:1000,showConfirmButton: false,type: "success"})
                                            };
                                        })
                                    };
                                })
                            };
                        })

                }else{
                    console.log(cantlexistmat)
                    var matexis = ''
                    for (var i = 0; i < cantlexistmat.length; i++) {
                        matexis = matexis+" "+cantlexistmat[i]['codigomat']+"\n";
                    };
                    swal({title:'Materiales ya existen en el grupo',text:matexis+" "+'\nPuede editarlo en GRUPOS GENERADOS',showConfirmButton: true,type: "error"})
                    return false;
                    // return false
                }
            };
        })
    }
}

savdetniple = function(){
    console.log(listnip)
    console.log(cenviada,codtabdetped)
    for (var i = 0; i < listnip.length; i++) {
        var cant = $(".cnipleenv"+i).val();
        if (cant != "") {
            if (parseFloat(cant) < 0.1 ) {
                swal({title:'Cantidad INCORRECTA en ITEM '+listnip[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
                cantlinip = []
                return false;
            }else{
                var canti = listnip[i]['cantidad']
                var sum = parseFloat(listnip[i]['cenv']) + parseFloat(cant);
                if (parseFloat(sum) > canti) {
                    swal({title:'Cantidad es mayor al total en ITEM '+listnip[i]['item'],timer:1500,showConfirmButton: false,type: "error"})
                    cantlinip = []
                    return false
                }else{
                    cantlinip.push({
                    'inputcant':cant,
                    'canti':listnip[i]['cantidad'],
                    'cenviado':listnip[i]['cenv'],
                    'codmat':listnip[i]['codmat'],
                    'codbrand':listnip[i]['codbr'],
                    'codmod':listnip[i]['codmod'],
                    'metrado':listnip[i]['metrado'],
                    'tipo':listnip[i]['tipo'],
                    'codped':listnip[i]['codped'],
                    'idtable':listnip[i]['idtable'],
                    'item':listnip[i]['item']
                    })
                }
            }
        };
    }
    console.log(cantlinip)

    if (cantlinip.length > 0) {

        var dat = new Object;

        dat.nipexist = true
        dat.codgrupo = $(".lblcodgrupo").text();
        dat.ldetnip =JSON.stringify(cantlinip)
        $.getJSON("",dat, function(response){
            if (response.status) {
                var stlexistmat = response.stlexistmat;
                var lexistmat = response.lexistmat;
                console.log(response.stlexistmat)

                if (stlexistmat == false) {
                    swal({
                    title:'Guardar Niple',
                    text:'Seguro de guardar detalle de niple?',
                    showCancelButton: true,
                    confirmButtonColor: "#dd6b55",
                    confirmButtonText: "Si, Guardar!",
                    cancelButtonText: "No, Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true,
                    type:'warning'
                }, function(isConfirm){
                    if (isConfirm) {
                    var data;
                    // codtabdetped
                    data = new Object;
                    data.ldetnip = JSON.stringify(cantlinip);
                    data.updniple = true;
                    data.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                    $.post("",data,function(response){
                        if (response.status) {
                            console.log('niple update')
                            var dato;
                            dato = new Object;
                            dato.savedetniple = true
                            dato.cenviada = cenviada
                            dato.cmat = $(".lblnipcmat").text();
                            dato.cped = $(".lblcodped").text();
                            dato.cbr = $(".lblnipedcbr").text();
                            dato.cmod = $(".lblnipedcmod").text();
                            dato.codgrupo = $(".lblcodgrupo").text();
                            dato.ldetnip = JSON.stringify(cantlinip);
                            dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                            $.post("", dato,function(response){
                                if (response.status) {
                                    swal({title:'Detalle de Niple Guardado',timer:1500,showConfirmButton: false,type: "success"})
                                    $(".listdetniple").modal("close")
                                    codped = $(".lblcodped").text();
                                    desc = $(".lbldesped").text();
                                    listdetped();
                                };
                            })
                        };
                    })
                    }else{
                        cantlinip = [];
                    }
                })

                }else{
                    swal({title:'Niples ya existen en el Grupo:',text:'Puede editarlo en GRUPOS GENERADOS',showConfirmButton: true,type: "error"})
                    cantlinip = [];
                    return false;
                }

            };
        })
    }else{
        swal({title:'Debe Enviar al menos un niple',timer:1500,showConfirmButton: false,type: "error"})
        return false;
    }
}

selcodgrupo = function(){
    var codgr,codpro,nompro,descr;
    codpro = this.getAttribute("data-codpro");
    nompro = this.getAttribute("data-nompro");
    descr = codpro+" "+nompro;
    codgr = this.value;
    $(".listcodgrupo").modal("close");
    document.getElementById('divcodgrupo').style.display='block'
    $(".lblcodgrupo").text(codgr);
    $(".lbldetgrupo").text(descr);
    $(".lblcodproyecto").text(codpro)
    document.getElementById('divcboproy').style.display = 'none';
    idproy = codpro;
    descpro = descr;
    listpedidos();

}

gengrupo = function(){
    var grupo,codproy,mat;
    codproy = $("select[id=cboproy]").val();
    console.log(codproy);
    grupo = new Object;
    mat = new Object;
    grupo[codproy] = []
    console.log(lpedido)
    for(var i=0; i < lpedido.length; i++){
        var idcheck = lpedido[i]['cod_ped'];
        var fechtras = lpedido[i]['fechatraslado'];
        if (document.getElementById(idcheck).checked) {
            var dat = fechtras.replace(/-/g , '\/')
            lped.push(idcheck);
            lfech.push(new Date(dat));
            console.log(idcheck)
        };
    }


    var date = new Date(Math.max.apply(null,lfech));
    console.log()
    if ((date.getMonth()+1).toString().length == 2) {
        mes = date.getMonth()+1;
    }else{
        mes = '0'+(date.getMonth()+1)
    }
    console.log(date)
    var fecha = date.getFullYear()+'-'+mes+ '-' + date.getDate()
    console.log(lfech)
    console.log(fecha)
    console.log(mat)
    console.log(lped)


    if (lped.length != 0){
        swal({
        title: "",
        text: 'Desea generar Grupo de pedidos con detalle completo de los pedidos seleccionados?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Si, Generar!",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
          }, function(isConfirm) {
            var data;
            if (isConfirm) {
                console.log(ldetped)
                var data;
                data = new Object;
                data.getlistadetped = true;
                data.lped = lped;
                $.getJSON("", data, function(response){
                    if (response.status) {
                        console.log(response.ldetped)
                        ldetped = response.ldetped;
                        console.log(lped)
                        var datos = new Object;
                        datos.ldetped = JSON.stringify(ldetped);
                        datos.existniple = true;
                        $.getJSON("",datos, function(response){
                            if (response.status) {
                                var ldet = response.ldet;
                                console.log(response.ldet)
                                var datas = new Object;
                                datas.codgrupo = $(".lblcodgrupo").text();
                                datas.savealldetniple = true
                                datas.ldet = JSON.stringify(ldet);
                                datas.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                $.post("",datas,function(response){
                                    if (response.status) {
                                        var dato = new Object;
                                        dato.listmat = JSON.stringify(ldetped);
                                        console.log(dato.listmat);
                                        dato.estado = true;
                                        dato.codgrupo = $(".lblcodgrupo").text();
                                        dato.savealldetgrupo = true;
                                        dato.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                        $.post("", dato, function(response){
                                            if (response.status) {
                                                var dat = new Object;
                                                dat.updalldetped = true;
                                                dat.lmaterials = JSON.stringify(ldetped);
                                                dat.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                                $.post("",dat, function(response){
                                                    if (response.status) {
                                                        console.log(fecha)
                                                        var da = new Object;
                                                        da.updfech = true
                                                        da.fechatrasl = fecha;
                                                        da.cgrupo = $(".lblcodgrupo").text();
                                                        da.csrfmiddlewaretoken = $("[name=csrfmiddlewaretoken]").val();
                                                        $.post("",da, function(response){
                                                            if (response.status) {
                                                                idproy = $(".lblcodproyecto").text();
                                                                descpro = $(".lbldescproy").text();//
                                                                listpedidos();
                                                                swal({title:'',text:"Detalle de Pedido fueron agregados al Grupo",timer:1500,showConfirmButton: false,type: "success"})
                                                            };
                                                        })
                                                    };
                                                })

                                            };
                                        })
                                          lped = []
                                          lfech = []
                                    };
                                })
                                lped=[]
                            };
                        })
                        };
                    })
            }else{
                lped =[]
                lfech = []
            }
          });
        }else{
            swal({
                title:"Debe Seleccionar al menos un pedido",
                timer:2000,
                showConfirmButton: false,
                type: "warning"
            })
            return false;
        }

}


opencodsgrupo = function(){
    valor = true;
    listtabgrupo()
    $(".listcodgrupo").modal("open");
}


opendetped = function(){
    var asunto,data;
    data= new Object;
    codped = this.value;
    asunto = this.getAttribute("data-asunto");
    fechped=this.getAttribute("data-ftras")
    desc = asunto;
    console.log(desc)
    listdetped();
}

listdetped = function(){
    var data,cped,description;
    cped = codped;
    description = desc;
    console.log(description)
    data = new Object;
    data.codped = cped;
    data.getldetped = true;
    $.getJSON("",data,function(response){
        if (response.status) {
            $(".listdetped").modal("open");
            $(".lblcodped").text(codped);
            $(".lbldesped").text(description);
            var $tb, template, x;
            vardetpedido = response.ldetpedido;
            $tb = $("table.tab-detped > tbody");
            $tb.empty();
            // template = "<tr><td>{{ item }}</td><td>{{ codmat }}</td><td>{{ namemat }}</td><td>{{ namemarca }}</td><td>{{ namemodel }}</td><td>{{ cantidad }}</td><td>{{ cantenv }}</td><td><input type=\"text\" class=\"cenviada{{ countcod }}\"></td><td><button type=\"button\" class=\"transparent btnedcantmat\" style=\"border:none;font-size:20px;\" value=\"{{ codmat }}\" data-edidpedido=\"{{ codpedido }}\" data-edidbrand=\"{{ idbrand }}\" data-edidmodel=\"{{ idmodel }}\" data-edcantidad=\"{{ cantidad }}\" data-edcantenv=\"{{ cantenv }}\"><a><i class=\"fa fa-pencil-square\"></i><a/></button></td></tr>";
            template = "<tr onclick=\"getR('{{ codmat }}','{{ idbrand }}','{{ idmodel }}','{{ namemat }}','{{ medmat }}','{{ idtabdetped }}','{{ cantenv }}')\"><td class=\"col5\">{{ item }}</td><td class=\"col10\">{{ codmat }}</td><td class=\"col35\">{{ namemat }}</td><td class=\"col10\">{{ medmat }}</td><td class=\"col10\">{{ namemarca }}</td><td class=\"col10\">{{ namemodel }}</td><td class=\"col5\">{{ cantidad }}</td><td class=\"col5\">{{ cantenv }}</td><td class=\"col10\" style=\"text-align:center;\"><input type=\"text\" style=\"height:25px;width:50px;\" maxlength=\"4\" class=\"cenviada{{ countcod }}\"></td></tr>";
            for (x in response.ldetpedido) {
            response.ldetpedido[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.ldetpedido[x]));
            }

        };
    })
}



function getR(cm,codbr,codmod,namemat,medmat,ctabdetped,cantenv) {
    codigomaterial = cm;
    codigobrand = codbr;
    codigomodel = codmod;
    codtabdetped = ctabdetped;
    cenviada = cantenv
    console.log(codbr,codmod,namemat,medmat,codtabdetped,cenviada)
    $(".lblnipcmat").text(cm);
    $(".lblnipdesmat").text(namemat);
    $(".lblnipmedmat").text(medmat);
    $(".lblnipedcbr").text(codbr);
    $(".lblnipedcmod").text(codmod)
    listniple();
}


listniple = function(){
    var data,cmat,cbr,cmod;
    cmat = codigomaterial;
    cbr = codigobrand;
    cmod = codigomodel;
    console.log(cmat)
    data = new Object;
    data.getlniple = true;
    data.codmat = cmat;
    data.codbr = cbr;
    data.codmod = cmod;
    data.codped = $(".lblcodped").text();
    console.log(data.codped)
    $.getJSON("",data,function(response){
        if (response.status) {
            console.log(response.stlistnip)
            if (response.stlistnip == true) {
                $(".listdetniple").modal("open")
                listnip = response.listnip;
                console.log(listnip)
                $tb = $("table.tab-detniple > tbody");
                $tb.empty();
                template = "<tr><td>{{ item }}</td><td>{{ cantidad }}</td><td>{{ metrado }}</td><td>{{ tipo }}</td><td>{{ cenv }}</td><td><input type=\"text\" style=\"height:25px;width:50px;\" maxlength=\"4\" class=\"cnipleenv{{ countcod }}\"></td></tr>";
                for (x in listnip) {
                listnip[x].item = parseInt(x) + 1;
                $tb.append(Mustache.render(template, listnip[x]));
                }
            }
        };
    })

}
$(function(){
    $('#cboproy').change(function(){
        document.getElementById('divbtnopencodsgr').style.display='none';
        document.getElementById('divgencodigo').style.display='block';
        var data;
        idproy = this.value
        descpro = $("select[id=cboproy] > option:selected ").text();
        listpedidos();
    });
});

listpedidos = function(){
    var data,cproy,des;
    cproy = idproy;
    console.log(cproy)
    des = descpro;
    data = new Object;
    data.getlpedido = true;
    data.idproy = cproy;
    $.getJSON("",data,function(response){
        if (response.status) {

            var $tb, template, x;
            document.getElementById('divtxtbuscarped').style.display='block';
            document.getElementById('divtabpedido').style.display='block';
            $(".lbldescproy").text(des);
            lpedido = response.lpedido;
            console.log(lpedido)
            $tb = $("table.tab-pedido > tbody");
            $tb.empty();
            template = "<tr><td class=\"col5\">{{ count }}</td><td class=\"col15\">{{ cod_ped }}</td><td class=\"col5\"><input type=\"checkbox\" id=\"{{ cod_ped }}\" value=\"{{ cod_ped }}\" class=\"checkpedido\" name=\"checkpedido{{cod_ped}}\" onclick=\"getRow(this)\"/><label for=\"{{ cod_ped }}\"></label></td><td class=\"col40\">{{ asunto }}</td><td class=\"col15\">{{ almacen }}</td><td class=\"col10\">{{ fechatraslado }}</td><td class=\"col10\" style=\"text-align:center\"><div id=\"divbtndet{{ cod_ped }}\" style=\"display:none\"><button class=\"transparent btnopendetped\" style=\"border:none\" value=\"{{ cod_ped }}\" data-asunto=\"{{ asunto }}\" data-ftras=\"{{ fechatraslado }}\"><a><i class=\"fa fa-info-circle\" style=\"font-size:20px;\"><i/></a></button></div></td></tr>";
            for (x in lpedido) {
            lpedido[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, lpedido[x]));
            }


            if(response.lpedidosize == true){
                // var $tb, template, x;
                // document.getElementById('divtxtbuscarped').style.display='block';
                // document.getElementById('divtabpedido').style.display='block';
                // $(".lbldescproy").text(des);
                // lpedido = response.lpedido;
                // console.log(lpedido)
                // $tb = $("table.tab-pedido > tbody");
                // $tb.empty();
          //       template = "<tr><td class=\"col5\">{{ count }}</td><td class=\"col15\">{{ cod_ped }}</td><td class=\"col5\"><input type=\"checkbox\" id=\"{{ cod_ped }}\" value=\"{{ cod_ped }}\" class=\"checkpedido\" name=\"checkpedido{{cod_ped}}\" onclick=\"getRow(this)\"/><label for=\"{{ cod_ped }}\"></label></td><td class=\"col40\">{{ asunto }}</td><td class=\"col15\">{{ almacen }}</td><td class=\"col10\">{{ fechatraslado }}</td><td class=\"col10\" style=\"text-align:center\"><div id=\"divbtndet{{ cod_ped }}\" style=\"display:none\"><button class=\"transparent btnopendetped\" style=\"border:none\" value=\"{{ cod_ped }}\" data-asunto=\"{{ asunto }}\" data-ftras=\"{{ fechatraslado }}\"><a><i class=\"fa fa-info-circle\" style=\"font-size:20px;\"><i/></a></button></div></td></tr>";
          //       for (x in lpedido) {
          //       lpedido[x].item = parseInt(x) + 1;
          //       $tb.append(Mustache.render(template, lpedido[x]));
          //       }
            }else{
                swal({
                    title:"No existe pedidos en este proyecto",
                    timer:1000,
                    showConfirmButton: false,
                    type: "warning"
                })
                return false;
            }

        };
    })
}




function getRow(n) {
    console.log(n)
    var val = "divbtndet"+n.value;
    var input = "input[name=checkpedido"+n.value+"]";

    if ($(".lblcodgrupo").text() == "") {
        swal({title:'Debe Generar o Seleccionar un Codigo de Grupo',timer:2000,showConfirmButton: false,type: "error"})
        document.getElementById(n.value).checked = false;
        return false;
    }else{
        if($(input).is(':checked')){
            document.getElementById(val).style.display = "block";
        }else{
            document.getElementById(val).style.display = "none";
        }
    }
}

viewallnone = function(){
    if(document.getElementById('radioall').checked){
        selectall(true,'block');
    }else{
        selectall(false,'none');
    }
}


viewtabgrupo = function(){
    if (document.getElementById('radiosi').checked) {
        valor = true;
    }else{
        valor = false;
    }
    console.log(valor)
    listtabgrupo();
}


viewgrupoxest = function(){
    var estadogr;
    if(document.getElementById('radpdfpe').checked){
        estadogr='GE'
    }else{
        estadogr='CO'
    }
    console.log(estadogr)
    estadogrupo = estadogr;
    listgrupo()
}

viewpdf = function(){
    console.log('viewpdf')
}



listtabgrupo = function(){
    var data,estado;
    estado = valor;
    data = new Object;
    data.estado = estado;
    console.log(data.estado)
    data.lcodgrupo = true;
    $.getJSON("", data, function(response){
        if (response.status) {
            console.log(response.lcgrupo)
            $tb = $("table.tab-lcodsgrupo > tbody");
            $tb.empty();
            template = "<tr><td>{{ item }}</td><td>{{ codgrup }}</td><td>{{ nompro }}</td><td>{{ ftrasl }}</td><td><button type=\"button\" class=\"transparent btnselcodgrupo\" style=\"border:none;font-size:20px;\" value=\"{{ codgrup }}\" data-codpro=\"{{ codproy }}\" data-nompro=\"{{ nompro }}\"><a><i class=\"fa fa-check\"></i></a></button></td></tr>";
            for (x in response.lcgrupo) {
            response.lcgrupo[x].item = parseInt(x) + 1;
            $tb.append(Mustache.render(template, response.lcgrupo[x]));
            }
        };
    })
}



selectall = function(estado,divbtn){
    if ($(".lblcodgrupo").text()=="") {
            swal({title:'Debe Generar o Seleccionar un Codigo de Grupo',timer:2000,showConfirmButton: false,type: "error"})
            return false;
        };
    for(var i=0; i < lpedido.length; i++){
        var idcheck = lpedido[i]['cod_ped'];
        document.getElementById('divbtndet'+idcheck).style.display = divbtn;
        document.getElementById(idcheck).checked = estado;
    }
}

busc2colherra = function(idtxtsearch,idtable,col1,col2){
    var input,filter,table, tr, td,td2, i;
    input = document.getElementById(idtxtsearch);
    filter = input.value.toUpperCase();
    table = document.getElementById(idtable);
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[col1];
        td2 = tr[i].getElementsByTagName("td")[col2];
        if (td || td2) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
                td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

busc3colherra = function(idtxtsearch,idtable,col1,col2,col3){
    var input,filter,table, tr, td,td2, i;
    input = document.getElementById(idtxtsearch);
    filter = input.value.toUpperCase();
    table = document.getElementById(idtable);
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[col1];
        td2 = tr[i].getElementsByTagName("td")[col2];
        td3 = tr[i].getElementsByTagName("td")[col3];
        if (td || td2 || td3) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
                td2.innerHTML.toUpperCase().indexOf(filter) > -1 ||
                td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}