#!/usr/bin/env python
#-*- conding: utf-8 -*-

import json

from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext, TemplateDoesNotExist
from django.conf import settings
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView, TemplateView, View
from django.views.generic.edit import CreateView, UpdateView, DeleteView


from CMSGuias.apps.ventas.models import Proyecto
from .models import *
from CMSGuias.apps.tools import genkeys, globalVariable, uploadFiles
from xlrd import open_workbook, XL_CELL_EMPTY
from CMSGuias.apps.almacen.models import *
from ..home.models import SettingsApp


class JSONResponseMixin(object):
    def render_to_json_response(self, context, **response_kwargs):
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        return json.dumps(context, encoding='utf-8', cls=DjangoJSONEncoder)

class Herramient(JSONResponseMixin, TemplateView):
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'showeditherra' in request.GET:
                    herra = Herramienta.objects.values(
                        'herramienta_id',
                        'nombre',
                        'marca_id',
                        'medida',
                        'unidad_id',
                        'tvida').get(herramienta_id=request.GET.get('herraid'))
                    if len(herra) > 0:
                        herra['status'] = True

                dicHerra={}
                for x,num in herra.items():
                    dicHerra[x] = num

                context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(dicHerra)

        lmarcaherra = Brand.objects.filter(flag = True).order_by('brand')
        lunidherra = Unidade.objects.filter(flag = True).order_by('uninom')
        lherramienta = Herramienta.objects.all().order_by('nombre')

        return render(request,'almacen/herramienta.html',{
            'lmarca':lmarcaherra,
            'lunidade':lunidherra,
            'lherra':lherramienta
            })

    def post(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'exists' in request.POST:
                        try:
                            Herramienta.objects.get(
                                herramienta_id=request.POST.get('idherra'))
                            context['status'] = True
                        except Herramienta.DoesNotExist, e:
                            context['status'] = False

                    if 'saveherramienta' in request.POST:

                        Herramienta.objects.create(
                            herramienta_id=request.POST.get('idherra'),
                            nombre=request.POST.get('nameherra'),
                            marca_id=request.POST.get('marcaherra'),
                            medida=request.POST.get('medherra'),
                            unidad_id=request.POST.get('unidherra'),
                            tvida=request.POST.get('tvida')
                            )

                        InventarioHerra.objects.create(
                            herramienta_id = request.POST.get('idherra'),
                            )

                        context['status'] = True

                    if 'editherra' in request.POST:
                        eherra = Herramienta.objects.get(
                            herramienta_id=request.POST.get('idherra')
                            )
                        eherra.nombre = request.POST.get('nameherra')
                        eherra.marca_id = request.POST.get('marcaherra')
                        eherra.medida = request.POST.get('medherra')
                        eherra.unidad_id = request.POST.get('unidherra')
                        eherra.tvida = request.POST.get('tvida')
                        eherra.save()
                        context['status'] = True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

class Guia(JSONResponseMixin, TemplateView):
    def get(self, request, *args, **kwargs):
        context = dict();
        if request.is_ajax():
            try:

                if 'lherradev' in request.GET:
                    arrherradev = []
                    count = 1
                    for x in detGuiaHerramienta.objects.filter(guia_id=request.GET.get('nguia'),flagdev=False):
                        arrherradev.append(
                            {'nguia': x.guia_id,
                            'codherra':x.herramienta_id,
                            'nameherra': x.herramienta.nombre,
                            'medherra':x.herramienta.medida,
                            'marcherra':x.herramienta.marca.brand,
                            'conta':count,
                            'cantdevuelta':x.cantdev,
                            'cantiherra':x.cantidad})
                        count = count + 1
                        context['listherradev']= arrherradev
                    context['status'] = True


                if 'leditguia' in request.GET:
                    leditheguia = []
                    i = 1
                    for x in detGuiaHerramienta.objects.filter(guia_id=request.GET.get('idherraguia')):
                        leditheguia.append(
                            {'edid': x.id,
                            'edcodguia' : x.guia_id,
                            'edcodherra' : x.herramienta_id,
                            'ednombherra' : x.herramienta.nombre,
                            'edmedherra' : x.herramienta.medida,
                            'edbrandherra':x.herramienta.marca.brand,
                            'edest': x.estado,
                            'edcount':i,
                            'edcoment':x.comentario,
                            'edfdev': x.fechdevolucion,
                            'edcant':x.cantidad})
                        context['leditheguia']= leditheguia
                        i=i+1
                    context['status'] = True


                if 'listaherraguia' in request.GET:
                    lis = request.GET.getlist('tamdev[]')
                    li = []
                    j = 0
                    for x in lis:
                        k = 0
                        for x in detGuiaHerramienta.objects.filter(guia_id=lis[j]):
                            li.append({
                                'nameherra':x.herramienta.nombre,
                                'medherra':x.herramienta.medida,
                                'numguia':x.guia.guia_id,
                                'cant':x.cantidad,
                                'conta':k,
                                'codg':x.guia_id
                                })
                            context['nguia'] = x.guia_id
                            context['lcod'] = li
                            k=k+1
                        j=j+1

                    lisherraguia = []
                    i = 1
                    for x in detGuiaHerramienta.objects.filter(guia_id=request.GET.get('idherraguia')):
                        lisherraguia.append(
                            {'id': x.id,
                            'codguia' : x.guia_id,
                            'codherra' : x.herramienta_id,
                            'nombherra' : x.herramienta.nombre,
                            'medherra' : x.herramienta.medida,
                            'brandherra':x.herramienta.marca.brand,
                            'est': x.estado,
                            'count':i,
                            'coment':x.comentario,
                            'fdev': x.fechdevolucion,
                            'cant':x.cantidad})
                        context['lherraguia']= lisherraguia
                        i=i+1
                    context['status'] = True

                if 'vstock' in request.GET:
                    li = request.GET.getlist('listacodigos[]')

                    listain = []
                    m = 0
                    while m < len(li):
                        inv = InventarioHerra.objects.values(
                                'cantalmacen',
                                'herramienta_id'
                                ).get(herramienta_id=li[m])
                        listain.append(inv)
                        context['listainve'] = listain
                        m = m+2
                    context['status'] = True



                if 'vstockregreso' in request.GET:
                    lregreso = request.GET.getlist('lcd[]')
                    print 'lcd'
                    print lregreso
                    lregresosize = len(lregreso)
                    linventario = []
                    lcantenv = []
                    lcantdevpe = []

                    l = 0
                    while l < lregresosize:
                        for x in InventarioHerra.objects.filter(herramienta_id=lregreso[l]):
                            linventario.append({
                                'codh':x.herramienta_id,
                                'cantidadh':x.cantalmacen,
                                })
                            context['linve'] = linventario

                        for y in detGuiaHerramienta.objects.filter(guia_id=lregreso[l+4],herramienta_id=lregreso[l]):
                            lcantenv.append({
                                'cantenviada':y.cantidad,
                                'nameherra':y.herramienta.nombre,
                                'medidherra':y.herramienta.medida
                                })
                            context['lcantenviada'] = lcantenv

                        for z in detGuiaHerramienta.objects.filter(guia_id = lregreso[l+4],herramienta_id=lregreso[l]):
                            lcantdevpe.append({
                                'cantdevpe': z.cantdev,
                                'codherramienta': z.herramienta_id,
                                'guiaid':z.guia_id
                                })
                            context['lcantdevpendiente'] = lcantdevpe
                        l = l + 5
                        context['status'] = True


                if 'devolstk' in request.GET:
                    lhguia = []
                    for x in detGuiaHerramienta.objects.filter(guia_id=request.GET.get('nguia')):
                        lhguia.append(
                            {
                            'codherra' : x.herramienta_id,
                            'cantidad' : x.cantidad
                            })
                        context['lherrguia']= lhguia
                    context['status'] = True


                if 'devstock' in request.GET:
                    lis = request.GET.getlist('lidherra[]')
                    print 'wd'
                    print lis

                    listain = []
                    m = 0
                    while m < len(lis):
                        inv = InventarioHerra.objects.values(
                                'cantalmacen',
                                'herramienta_id'
                                ).get(herramienta_id=lis[m])
                        listain.append(inv)
                        context['listainventario'] = listain
                        m = m+1
                    print 'lil'
                    print listain

                    context['status'] = True
                #opcional
                if 'valcant' in request.GET:
                    lista = request.GET.getlist('lista[]')

                    lcant = []
                    t = 0
                    while t < len(lista):
                        for z in detDevHerramienta.objects.filter(
                                guia_id = lista[t+4],
                                docdev_id = request.GET.get('numdoc'),
                                herramienta_id = lista[t] ):
                            lcant.append({
                                'cantdev' : z.cantidad
                                })
                            context['lvalcantidad'] = lcant
                        t = t + 5

                    context['status'] = True



            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


        lproy = GuiaHerramienta.objects.all().distinct('proyecto__nompro').order_by('proyecto__nompro')
        lproyecto = Proyecto.objects.filter(status='AC').order_by('nompro')
        lcond = Conductore.objects.filter(flag = True).order_by('connom')
        ltrans = Transporte.objects.filter(flag = True).order_by('nropla_id')
        lherr = InventarioHerra.objects.all().order_by('herramienta__nombre')
        ltransportista = Transportista.objects.filter(flag=True).order_by('tranom')
        lguiape = GuiaHerramienta.objects.filter(estado='PE').order_by('guia_id')
        lguiagene = GuiaHerramienta.objects.filter(estado='GE').order_by('guia_id')
        lguiacomp = GuiaHerramienta.objects.filter(estado='DEVCOMP').order_by('guia_id')
        return render(request,'almacen/guia.html',{
            'lproyecto':lproy,
            'lconductor':lcond,
            'ltransporte':ltrans,
            'lherramienta':lherr,
            'ltransportista':ltransportista,
            'lguiape':lguiape,
            'lguiaco':lguiacomp,
            'lproyectos':lproyecto,
            'lguiagene':lguiagene
            })

    def post(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'exists' in request.POST:
                        print request.POST.get('numguia')
                        try:
                            GuiaHerramienta.objects.get(
                                guia_id=request.POST.get('numguia'))
                            context['status'] = True
                        except GuiaHerramienta.DoesNotExist, e:
                            context['status'] = False

                    if 'exists_detherra' in request.POST:
                        try:
                            detGuiaHerramienta.objects.get(
                                guia_id = request.POST.get('numberguia'),
                                herramienta_id = request.POST.get('newherra'))
                            context['status'] = True
                        except detGuiaHerramienta.DoesNotExist, e:
                            context['status'] = False

                    if 'savenewherra' in request.POST:
                        detGuiaHerramienta.objects.create(
                            guia_id=request.POST.get('numberguia'),
                            herramienta_id=request.POST.get('newherra'),
                            estado=request.POST.get('newhestado'),
                            fechdevolucion = None if request.POST.get('newfechdev') == "" else request.POST.get('newfechdev'),
                            cantidad = request.POST.get('newhcant'),
                            comentario = request.POST.get('newhcoment')
                            )
                        context['status'] = True


                    if 'savecabguia' in request.POST:
                        GuiaHerramienta.objects.create(
                            guia_id=request.POST.get('numguia'),
                            proyecto_id=request.POST.get('proyecto'),
                            fechsalida=request.POST.get('fsalida'),
                            condni_id=request.POST.get('conductor'),
                            nropla_id = request.POST.get('placa'),
                            traruc_id = request.POST.get('transp'),
                            estado=request.POST.get('est'),
                            empdni_id = request.user.get_profile().empdni_id,
                            comentario=request.POST.get('comentario')
                            )
                        detalle = request.POST.getlist('detherra[]')
                        tamlist = request.POST.get('tamdetherra')

                        tamdet = len(detalle)
                        campos = tamdet / int(tamlist)
                        j = 0
                        while j < tamdet:
                            detGuiaHerramienta.objects.create(
                                guia_id=request.POST.get('numguia'),
                                herramienta_id=detalle[j],
                                cantidad = detalle[j+1],
                                fechdevolucion= None if detalle[j+2] == "" else detalle[j+2],
                                estado=detalle[j+3],
                                comentario= detalle[j+4]
                                )
                            MovInventario.objects.create(
                                herramienta_id=detalle[j],
                                cantidad=detalle[j+1],
                                estado = 'GUARD'
                                )
                            j=j+campos;


                        ltot = request.POST.getlist('ltotal[]')
                        lsize = len(ltot)
                        k = 0
                        while k < lsize:
                            upd = InventarioHerra.objects.get(
                                herramienta_id=ltot[k]
                                )
                            upd.cantalmacen = ltot[k+1]
                            upd.save()
                            k = k+2
                        context['status'] = True

                    if 'savecabguiadevol' in request.POST:
                        devolucionHerra.objects.create(
                            docdev_id=genkeys.GenerateIdGuiaDev(),
                            fechretorno=request.POST.get('fretorno'),
                            condni_id=request.POST.get('cond'),
                            nropla_id = request.POST.get('nplaca'),
                            traruc_id = request.POST.get('transp'),
                            estado = request.POST.get('est')
                            )
                        context['status'] = True

                    if 'editdetguia' in request.POST:
                        eddetguia = detGuiaHerramienta.objects.get(
                            id=request.POST.get('codhe')
                            )
                        eddetguia.cantidad = request.POST.get('cantidad')
                        eddetguia.estado = request.POST.get('estado')
                        eddetguia.fechdevolucion =None if request.POST.get('fechdevolucion') == "" else request.POST.get('fechdevolucion')
                        eddetguia.comentario = request.POST.get('comenta')
                        eddetguia.save()


                        stckfin = InventarioHerra.objects.get(
                            herramienta_id= request.POST.get('codigohe')
                            )
                        stckfin.cantalmacen = request.POST.get('stockfin')
                        stckfin.save()
                        context['status'] = True

                    if 'devherraguia' in request.POST:
                        stfinal = InventarioHerra.objects.get(
                            herramienta_id= request.POST.get('codhe')
                            )
                        stfinal.cantalmacen = request.POST.get('stfinal')
                        stfinal.save()
                        context['status'] = True

                    if 'saveeditcabguia' in request.POST:
                        cabg = GuiaHerramienta.objects.get(
                            guia_id=request.POST.get('numguia')
                            )
                        cabg.proyecto_id = request.POST.get('proyecto')
                        cabg.fechsalida =request.POST.get('fsalida')
                        cabg.condni_id = request.POST.get('conductor')
                        cabg.nropla_id = request.POST.get('placa')
                        cabg.traruc_id = request.POST.get('transp')
                        cabg.estado = request.POST.get('est')
                        cabg.comentario = request.POST.get('comentario')
                        cabg.save()
                        context['status'] = True

                    if 'savecabguiaedit' in request.POST:
                        cabg = GuiaHerramienta.objects.get(
                            guia_id=request.POST.get('nguias')
                            )
                        cabg.proyecto_id = request.POST.get('edproy')
                        cabg.fechsalida =request.POST.get('edfechsalida')
                        cabg.condni_id = request.POST.get('edcond')
                        cabg.nropla_id = request.POST.get('edplaca')
                        cabg.traruc_id = request.POST.get('edtrans')
                        cabg.comentario = request.POST.get('edcomenta')
                        cabg.save()
                        context['status'] = True


                    if 'addherraguia' in request.POST:
                        detGuiaHerramienta.objects.create(
                            guia_id=request.POST.get('numguia'),
                            herramienta_id=request.POST.get('herra'),
                            estado=request.POST.get('est'),
                            fechdevolucion=None if request.POST.get('fdev') == "" else request.POST.get('fdev'),
                            cantidad = request.POST.get('canti'),
                            comentario=request.POST.get('coment')
                            )
                        context['status'] = True


                    if 'editherraguia' in request.POST:
                        eherra = detGuiaHerramienta.objects.get(
                            id=request.POST.get('tablepk'),
                            guia_id=request.POST.get('numguia')
                            )
                        eherra.herramienta_id = request.POST.get('herra')
                        eherra.estado = request.POST.get('est')
                        eherra.fechdevolucion =None if request.POST.get('fdev') == "" else request.POST.get('fdev')
                        eherra.cantidad = request.POST.get('canti')
                        eherra.comentario = request.POST.get('coment')
                        eherra.save()
                        context['status'] = True

                    if 'delherguia' in request.POST:
                        detGuiaHerramienta.objects.get(
                            id=request.POST.get('tablepk'),
                            guia_id=request.POST.get('guia')).delete()
                        context['status'] = True

                    if 'deleditherguia' in request.POST:
                        detGuiaHerramienta.objects.get(
                            id=request.POST.get('coddetalle')).delete()
                        context['status'] = True


                    if 'genguia' in request.POST:
                        gguia = GuiaHerramienta.objects.get(
                            guia_id=request.POST.get('numguia')
                            )
                        gguia.estado = request.POST.get('gener')
                        gguia.save()
                        context['status'] = True

                    if 'anularguiapendiente' in request.POST:
                        anulguia = GuiaHerramienta.objects.get(
                            guia_id = request.POST.get('nuguia')
                            )
                        anulguia.estado = 'AN'
                        anulguia.save()


                        det = request.POST.getlist('lthg[]')
                        print 'nvale'
                        print det
                        context['status'] = True

                    if 'devstockfinal' in request.POST:
                        lstock = request.POST.getlist('stkfinal[]')
                        lsize = len(lstock)
                        lcan = request.POST.getlist('lcantidad[]')

                        k = 0
                        while k < lsize:
                            upd = InventarioHerra.objects.get(
                                herramienta_id=lstock[k]
                                )
                            upd.cantalmacen = lstock[k+1]
                            upd.save()

                            MovInventario.objects.create(
                                herramienta_id=lcan[k],
                                cantidad=lcan[k+1],
                                estado = 'REGR'
                                )
                            k = k+2
                        context['status'] = True

                    if 'regrestock' in request.POST:
                        lstock = request.POST.getlist('stkfin[]')
                        lsize = len(lstock)
                        print 'opo'
                        print lstock

                        k = 0
                        while k < lsize:
                            upd = InventarioHerra.objects.get(
                                herramienta_id=lstock[k]
                                )
                            upd.cantalmacen = lstock[k+1]
                            upd.save()
                            k = k+2
                        gencoddev = genkeys.GenerateIdGuiaDev()
                        devolucionHerra.objects.create(
                            docdev_id=gencoddev,
                            fechretorno=request.POST.get('fret'),
                            condni_id=request.POST.get('co'),
                            nropla_id = request.POST.get('pla'),
                            traruc_id = request.POST.get('tra'),
                            empdni_id = request.user.get_profile().empdni_id,
                            estado = 'GE'
                            )
                        print 'generate'
                        print gencoddev


                        lcan = request.POST.getlist('lcant[]')
                        print 'plo'
                        print lcan
                        lcansize = len(lcan)


                        print 'lkl'
                        lisflag = request.POST.getlist('flagd[]')
                        print lisflag

                        p = 0
                        z = 0
                        while p < lcansize:
                            detDevHerramienta.objects.create(
                                guia_id = request.POST.get('codg'),
                                docdev_id = gencoddev,
                                herramienta_id = lcan[p],
                                cantidad = lcan[p+1],
                                estado = lcan[p+2],
                                comentario = lcan[p+3],
                                )

                            MovInventario.objects.create(
                                herramienta_id=lcan[p],
                                cantidad=lcan[p+1],
                                estado = 'DEV'
                                )
                            updest = detGuiaHerramienta.objects.get(
                                guia_id = lcan[p+4],
                                herramienta_id = lcan[p]
                                )
                            updest.flagdev = True if lisflag[z] == 'true' else False
                            updest.save()
                            p = p+5
                            z = z+1

                        print 'kl'
                        ltotales = request.POST.getlist('ltotalespe[]')
                        print ltotales

                        t = 0
                        while t < len(ltotales):
                            upddevpe = detGuiaHerramienta.objects.get(
                                    guia_id = ltotales[t],
                                    herramienta_id = ltotales[t + 1]
                                    )
                            upddevpe.cantdev = ltotales[t + 2]
                            upddevpe.save()
                            t = t + 3


                        if request.POST.get('estadocamb') == 'true':
                            updestado = GuiaHerramienta.objects.get(
                                    guia_id=request.POST.get('codg'),
                                    )
                            updestado.estado = 'DEVCOMP'
                            updestado.save()


                        context['numdoc'] = gencoddev
                        context['status'] = True


                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

class Inventario(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'viewstock' in request.GET:
                    stk = InventarioHerra.objects.values(
                        'cantalmacen'
                        ).get(herramienta_id=request.GET.get('herra'))
                    if len(stk) > 0:
                        stk['status'] = True

                context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(stk)

        lherra = Herramienta.objects.all().order_by('nombre')
        linvent = InventarioHerra.objects.all().order_by('herramienta__nombre')
        return render(request,'almacen/inventario.html',{
            'lherra':lherra,
            'linvent':linvent
            })

    def post(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:

                    if 'ingresoherra' in request.POST:
                        MovInventario.objects.create(
                            herramienta_id=request.POST.get('herra'),
                            cantidad=request.POST.get('canti'),
                            estado = 'INGRESO'
                            )

                        updt = InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('herra')
                            )
                        updt.stock = request.POST.get('sum')
                        updt.cantalmacen = request.POST.get('sum')
                        updt.price = request.POST['price']
                        updt.save()

                        context['status'] = True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

class Devolucion(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'cantherradev' in request.GET:
                    cherradev = []
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('idd'),herramienta_id = request.GET.get('idhe')):
                        cherradev.append(
                            {'cdev':x.cantdev,
                            'cherra':x.cantidad})
                        context['lcanherradev']= cherradev
                    context['status'] = True

                if 'cguia' in request.GET:
                    cantguia = []
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('idg')):
                        cantguia.append(
                            {'estadosh': x.flagdev
                            })
                        context['lestadosh'] = cantguia
                        context['lcantguia']= len(cantguia)
                    context['status'] = True



                if 'lherradoc' in request.GET:
                    arrherradoc = []
                    count = 1
                    for x in detDevHerramienta.objects.filter(docdev_id=request.GET.get('numerodoc')):
                        arrherradoc.append(
                            {'he_id': x.herramienta_id,
                            'he_name': x.herramienta.nombre,
                            'he_medida': x.herramienta.medida,
                            'coguia':x.guia.guia_id,
                            'docdev':x.docdev.docdev_id,
                            'he_marca':x.herramienta.marca.brand,
                            'he_cant':x.cantidad,
                            'he_est': x.estado,
                            'he_count': count,
                            'he_coment':x.comentario})
                        count = count + 1
                        context['lherradoc']= arrherradoc
                    context['status'] = True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


        # ldocdev = devolucionHerra.objects.filter(estado = 'GE').order_by('registro')
        ldocdev = detDevHerramienta.objects.filter(docdev__estado = 'GE').distinct('docdev__docdev_id').order_by('docdev__docdev_id')
        return render(request,'almacen/devolucion.html',{
            'listadocdev':ldocdev
            })

    def post(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:

                    if 'savecaedit' in request.POST:
                        updcan = detGuiaHerramienta.objects.get(
                            guia_id = request.POST.get('g'),
                            herramienta_id=request.POST.get('h')
                            )
                        updcan.cantdev = request.POST.get('can')
                        updcan.flagdev = True if request.POST.get('v') == 'true' else False
                        updcan.save()
                        context['status'] = True


                    if 'edherradev' in request.POST:
                        ehdev = detDevHerramienta.objects.get(
                            docdev_id = request.POST.get('coddochedev'),
                            herramienta_id=request.POST.get('codhedev')
                            )
                        ehdev.cantidad = request.POST.get('canthedev')
                        ehdev.estado = request.POST.get('esthedev')
                        ehdev.save()
                        context['status'] = True

                    if 'cambestdev' in request.POST:
                        cestdev = GuiaHerramienta.objects.get(
                            guia_id = request.POST.get('codigoguia'),
                            )
                        cestdev.estado = request.POST.get('estcamb')
                        cestdev.save()
                        context['status'] = True

                    if 'updst' in request.POST:
                        upd = InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('herramid')
                            )
                        upd.cantalmacen = request.POST.get('totfin')
                        upd.save()
                        context['status'] = True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

class Consulta(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:

                if 'ldetcons' in request.GET:
                    arrdetcons = []
                    count = 1
                    for x in detGuiaHerramienta.objects.filter(
                        guia__proyecto_id=request.GET.get('numproy'),
                        herramienta_id = request.GET.get('idherramienta'),
                        guia__estado='GE'):
                        arrdetcons.append(
                            {'nguia': x.guia_id,
                            'nameherra': x.herramienta.nombre,
                            'medherra':x.herramienta.medida,
                            'conta':count,
                            'marcahe':x.herramienta.marca.brand,
                            'regisday':x.guia.registro.day,
                            'regismonth':x.guia.registro.month,
                            'regisyear':x.guia.registro.year,
                            'fecsalida':x.guia.fechsalida,
                            'estado':x.estado,
                            'fde': x.fechdevolucion,
                            'cantiherra':x.cantidad})
                        count = count + 1
                        context['detherraxproy']= arrdetcons
                    context['status'] = True

                if 'lherraproy' in request.GET:
                    lish = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(herramienta_id=request.GET.get('codigoherra'),guia__estado = 'GE'):
                        lish.append(
                            {'proyc':x.guia.proyecto.proyecto_id,
                            'proynom':x.guia.proyecto.nompro,
                            'fsalid':x.guia.fechsalida,
                            'guiacod':x.guia.guia_id,
                            'conta':count,
                            'cantidad':x.cantidad}
                            )
                        count = count + 1;
                        context['listaherraproy'] = lish
                    context['status'] = True

                if 'lproyherra' in request.GET:
                    lisherra = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(guia__proyecto_id=request.GET.get('codigoproy'),guia__estado = 'GE'):
                        lisherra.append(
                            {'nombreherra':x.herramienta.nombre,
                            'herraid':x.herramienta_id,
                            'guia_cod':x.guia_id,
                            'medidaherra':x.herramienta.medida,
                            'cantid':x.cantidad,
                            'count':count,
                            'fechdev':x.fechdevolucion,
                            'estado':x.estado}
                            )
                        count = count + 1;
                        context['listaproyherra'] = lisherra
                    context['status'] = True

                if 'buscarh' in request.GET:
                    lishe = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(herramienta__nombre__icontains=request.GET.get('textoing'),guia__estado = 'GE').distinct(
                        'herramienta__nombre','herramienta__medida'):
                        lishe.append(
                            {'codh':x.herramienta_id,
                            'name':x.herramienta.nombre,
                            'medida':x.herramienta.medida,
                            'marcah':x.herramienta.marca.brand,
                            'count':count
                            })
                        count = count + 1;
                        context['namehe'] = lishe

                    if len(lishe) > 0 :
                        context['namehesize'] = True
                    else:
                        context['namehesize'] = False


                    context['status'] = True


            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


        lproyect = GuiaHerramienta.objects.filter(estado = 'GE').distinct('proyecto__proyecto_id').order_by('proyecto__proyecto_id')
        lherra = detGuiaHerramienta.objects.filter(guia__estado = 'GE').distinct('herramienta__nombre','herramienta__medida').order_by('herramienta__nombre')
        return render(request,'almacen/consulta.html',{
            'lhe':lherra,
            'lpro': lproyect
            })


class EstadoHerramienta(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'lherraalmacen' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(estado=request.GET.get('estmat'),guia__estado = 'GE').distinct('herramienta__nombre','herramienta__medida').order_by('herramienta__nombre'):
                        lestalmacen.append(
                            {'codherra':x.herramienta_id,
                            'nameherra':x.herramienta.nombre,
                            'medherra':x.herramienta.medida,
                            'codmarcherra':x.herramienta.marca_id,
                            'marcherra':x.herramienta.marca.brand,
                            'count':count}
                            )
                        count = count + 1;
                        context['lestalmacen'] = lestalmacen
                    context['status'] = True

                if 'lhereparacion' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detDevHerramienta.objects.filter(estado=request.GET.get('estmat'),docdev__estado = 'GE').distinct('herramienta__nombre','herramienta__medida').order_by('herramienta__nombre'):
                        lestalmacen.append(
                            {'codherra':x.herramienta_id,
                            'nameherra':x.herramienta.nombre,
                            'medherra':x.herramienta.medida,
                            'codmarcherra':x.herramienta.marca_id,
                            'marcherra':x.herramienta.marca.brand,
                            'count':count}
                            )
                        count = count + 1;
                        context['lestalmacen'] = lestalmacen
                    context['status'] = True

                if 'ldetalmacen' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(herramienta_id=request.GET.get('codhe'),estado=request.GET.get('idestado'),guia__estado = 'GE').order_by('herramienta__nombre'):
                        dayf = ''
                        if x.fechdevolucion != None:
                            day = x.fechdevolucion - x.guia.fechsalida
                            dayf = day.days

                        lestalmacen.append(
                            {'fechsalida':x.guia.fechsalida,
                            'fechdev':x.fechdevolucion,
                            'nompro':x.guia.proyecto.nompro,
                            'numguia':x.guia_id,
                            'dias':dayf,
                            'count':count,
                            'cantidad':x.cantidad,
                            'comentario':x.comentario}
                            )
                        count = count + 1;
                        context['lestalmacen'] = lestalmacen
                    context['status'] = True

                if 'ldetrepacion' in request.GET:
                    lestrepar = []
                    count = 1;
                    for x in detDevHerramienta.objects.filter(herramienta_id=request.GET.get('codhe'),estado=request.GET.get('idestado'),docdev__estado = 'GE').order_by('herramienta__nombre'):
                        lestrepar.append(
                            {'fechsalida':x.guia.fechsalida,
                            'registro':x.docdev.registro,
                            'fechretorno':x.docdev.fechretorno,
                            'nompro':x.guia.proyecto.nompro,
                            'numguia':x.guia_id,
                            'count':count,
                            'cantidad':x.cantidad,
                            'comentario':x.comentario}
                            )
                        count = count + 1;
                        context['lestreparacion'] = lestrepar
                    context['status'] = True



            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)

        return render(request, 'almacen/estadoherra.html')






class Cargar(TemplateView):
    def get(self, request, *args, **kwargs):
        # return HttpResponse("Archivos cargados",'_blank')
        return render(request, 'almacen/cargarherra.html')

    @method_decorator(login_required)
    def post(serlf, request, *args, **kwargs):
        try:

            lherram = []
            arch = request.FILES['files[]']
            exep = ""
            if arch.name.split('.')[-1] == 'xls':
                try:
                    filename = uploadFiles.upload('/storage/temp/', arch)
                    book = open_workbook(filename, encoding_override='utf-8')
                    sheet = book.sheet_by_index(0)
                    lmat = []
                    stockfinal = ''
                    for m in range(3, sheet.nrows):
                        hcod = str(int(sheet.cell(m, 1).value))
                        hname = sheet.cell(m, 2).value
                        hmarca = sheet.cell(m, 3).value
                        hmedida = sheet.cell(m, 4).value
                        hunid = sheet.cell(m, 5).value
                        hstock = sheet.cell(m, 6).value
                        price = sheet.cell(m, 7).value

                        if hstock == '' or hstock == '-':
                            hstock = 0

                        try:
                            Herramienta.objects.get(herramienta_id=hcod)
                            lherram.append({'hc': hcod, 'hn': hname, 'hm': hmedida})
                            for y in  InventarioHerra.objects.filter(herramienta_id=hcod):
                                stockfinal = y.cantalmacen + hstock
                                herra = InventarioHerra.objects.get(herramienta_id=hcod)
                                herra.cantalmacen = stockfinal
                                herra.price = price
                                herra.save()
                            continue
                        except Herramienta.DoesNotExist, e:
                            try:
                                hmarca = hmarca.strip()
                                if hmarca == '' or hmarca == '-':
                                    hmarca = 'S/M'
                                br = Brand.objects.get(brand=hmarca)
                            except Brand.DoesNotExist, e:
                                br = Brand(brand_id=genkeys.GenerateIdBrand(), brand=hmarca)
                                br.save()

                            try:
                                un = Unidade.objects.get(uninom=hunid)
                            except Unidade.DoesNotExist, e:
                                un = Unidade(unidad_id=hunid, uninom=hunid)
                                un.save()
                            lmat.append({
                                'codi': hcod,
                                'name': hname,
                                'marc': br.brand_id,
                                'med': hmedida,
                                'unid': un.unidad_id,
                                'stock': hstock,
                                'price': price})

                    cont = 0
                    while cont < len(lmat):
                        h = Herramienta(
                            herramienta_id=lmat[cont]['codi'],
                            nombre=lmat[cont]['name'],
                            marca_id=lmat[cont]['marc'],
                            medida=lmat[cont]['med'],
                            unidad_id=lmat[cont]['unid'])
                        h.save()
                        inv = InventarioHerra(
                            herramienta_id=lmat[cont]['codi'],
                            cantalmacen=lmat[cont]['stock'],
                            price=lmat[cont]['price'])
                        inv.save()
                        # try:
                        #     InventarioHerra.objects.get(
                        #         herramienta_id=lmat[cont]['codi'])
                        #     ex = True
                        # except InventarioHerra.DoesNotExist, e:
                        #     ex = False

                        # if ex == False:
                        #     inv = InventarioHerra(
                        #         herramienta_id = lmat[cont]['codi'])
                        #     inv.save()
                        cont = cont + 1
                except Exception as oiex:
                    exep = str(oiex)
                    lherram = list()
                finally:
                    print 'delete file'
                    book.release_resources()
                    del book
                    uploadFiles.deleteFile(filename)
                if exep:
                    return HttpResponse('<h1>Error al procesar el archivo</h1><p>%s</p>' % exep)
                return render(request,
                    'almacen/form/resultherra.html',
                    {"lisherra": lherram})
            else:
                return HttpResponse("<h1>FORMATO INCORRECTO<h1>")
        except Exception as ex:
            raise Http404(ex)


class DevMaterial(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'listmaterials' in request.GET:
                    lmat = []
                    count = 1;
                    countcod = 0
                    for x in DetGuiaRemision.objects.filter(guia_id=request.GET.get('txtingresado'), guia__status='GE',guia__flag = True).order_by('materiales__matnom'):
                        lmat.append(
                            {'numguia':x.guia_id,
                            'codmat':x.materiales_id,
                            'namemat':x.materiales.matnom,
                            'codbrand':x.brand_id,
                            'namebrand':x.brand.brand,
                            'codmodel':x.model_id,
                            'namemodel':x.model.model,
                            'cantguide':x.cantguide,
                            'count':count,
                            'countcod':countcod
                            })
                        count = count + 1;
                        countcod = countcod + 1;
                        context['lmaterials'] = lmat

                    if len(lmat) > 0 :
                        context['listmat'] = True
                    else:
                        context['listmat'] = False
                    context['sizelistmat'] = len(lmat)

                    context['status'] = True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


        return render(request,'almacen/devolucionmaterial.html')

"""
2017-05-19 09:12:07
Return item from guide for the project
@ Juan Julcapari
"""
class Pedidoap(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'getlpedido' in request.GET:
                    lpedido = []
                    count = 1
                    for x in Pedido.objects.filter(
                        Q(status = 'AP') | Q(status = 'IN'),
                        proyecto_id = request.GET.get('idproy'),
                        flag = True, stgrupo=True).order_by('pedido_id'):
                        lpedido.append({
                            'count': count,
                            'cod_ped': x.pedido_id,
                            'asunto':x.asunto,
                            'almacen':x.almacen.nombre,
                            'fechatraslado':x.traslado
                            })
                        count += 1
                        if len(lpedido) == 0:
                            context['lpedidosize'] = False
                        else:
                            context['lpedido'] = lpedido
                            context['lpedidosize'] = True

                    context['status'] = True

                if 'getldetped' in request.GET:
                    ldetpedido = []
                    countcod = 0
                    for x in Detpedido.objects.filter(
                        pedido_id = request.GET.get('codped'),
                        flag = True,
                        flagcantenv = False).order_by('materiales__matnom'):
                        ldetpedido.append({
                            'idtabdetped':x.id,
                            'codmat': x.materiales_id,
                            'namemat': x.materiales.matnom,
                            'medmat':x.materiales.matmed,
                            'idbrand':x.brand_id,
                            'namemarca':x.brand.brand,
                            'idmodel':x.model_id,
                            'namemodel':x.model.model,
                            'cantidad':x.cantidad,
                            'cantenv':x.cantenv,
                            'codpedido':x.pedido_id,
                            'countcod':countcod
                            })
                        countcod += 1
                        context['ldetpedido'] = ldetpedido
                    context['status'] = True

                if 'getlistadetped' in request.GET:
                    ldetped = []
                    lped = request.GET.getlist("lped[]")
                    lpedsize = len(lped)
                    i = 0
                    while i < lpedsize:
                        for x in Detpedido.objects.filter(
                            pedido_id = lped[i],
                            flag = True):
                            ldetped.append({
                                'codped':x.pedido_id,
                                'codmat':x.materiales_id,
                                'codbr':x.brand_id,
                                'codmod':x.model_id,
                                'cantidad':float(x.cantidad) - float(x.cantenv),
                                'cantenv':x.cantenv
                                })
                        i = i + 1
                    context['ldetped'] = ldetped
                    context['status'] = True

                if 'lcodgrupo' in request.GET:
                    print 'abv'
                    lcgrupo = []
                    estado =  request.GET.get('estado')
                    for x in GrupoPedido.objects.filter(
                        flagdetalle = True if estado=='true' else False):
                        lcgrupo.append({
                            'codgrup':xcodgrupo_id,
                            'codproy':x.proyecto_id,
                            'nompro':x.proyecto.nompro,
                            'ftrasl':x.fechtraslado
                            })
                        context['lcgrupo'] = lcgrupo
                    context['status'] = True

                if 'existmat' in request.GET:
                    lexistmat = []
                    lmat = json.loads(request.GET.get('lmat'))
                    print lmat
                    count = 0
                    for y in lmat:
                        for x in detGrupoPedido.objects.filter(
                            codgrupo_id = request.GET.get('codgrupo'),
                            material_id = y['codmat'],
                            marca_id=y['codbrad'],
                            model_id=y['codmodel']):
                            lexistmat.append({
                                'count':count,
                                'codigomat':x.material_id,
                                'namemat':x.material.matnom
                                })
                            count = count + 1;
                        context['lexistmat'] = lexistmat
                    if len(lexistmat) == 0:
                        context['stlexistmat'] = False
                    else:
                        context['stlexistmat'] = True
                    context['status'] =True
                if 'existniple' in request.GET:
                    ldetniple = json.loads(request.GET.get('ldetped'))
                    ldet = []
                    for x in ldetniple:
                        for y in Niple.objects.filter(
                            pedido_id = x['codped'],
                            materiales_id = x['codmat'],
                            brand_id = x['codbr'],
                            model_id = x['codmod'],
                            flagcantenv = False):
                            ldet.append({
                                'idtable':y.id,
                                'codped':y.pedido_id,
                                'codmat':y.materiales_id,
                                'codbr':y.brand_id,
                                'codmod':y.model_id,
                                'metrado':y.metrado,
                                'tipo':y.tipo,
                                'cantidad':y.cantidad,
                                'niple':'true',
                                'cantenv':y.cantenv,
                                'restcant':float(y.cantidad) - float(y.cantenv)
                                })
                    context['ldet'] = ldet
                    context['status'] = True
                if 'nipexist' in request.GET:
                    lexistmat = []
                    ldetnip = json.loads(request.GET.get('ldetnip'))
                    count = 0
                    for y in ldetnip:
                        for x in GrupoPedNiple.objects.filter(
                            idref_id = y['idtable'],
                            codgrupo_id = request.GET.get('codgrupo')):
                            lexistmat.append({
                                'count':count,
                                'codigomat':x.material_id,
                                'namemat':x.material.matnom
                                })
                            count = count + 1;
                        context['lexistmat'] = lexistmat
                    print len(lexistmat)
                    if len(lexistmat) == 0:
                        context['stlexistmat'] = False
                    else:
                        context['stlexistmat'] = True
                    context['status'] =True
                if 'getlniple' in request.GET:
                    listnip = []
                    countcod = 0
                    for x in Niple.objects.filter(
                        pedido_id = request.GET.get('codped'),
                        materiales_id = request.GET.get('codmat'),
                        brand_id = request.GET.get('codbr'),
                        model_id = request.GET.get('codmod'),
                        flag = True):
                        listnip.append({
                            'idtable':x.id,
                            'codped':x.pedido_id,
                            'codmat':x.materiales_id,
                            'namemat':x.materiales.matnom,
                            'medmat':x.materiales.matmed,
                            'codbr':x.brand_id,
                            'namebran':x.brand.brand,
                            'codmod':x.model_id,
                            'namemod':x.model.model,
                            'cantidad':x.cantidad,
                            'metrado':x.metrado,
                            'cenv':x.cantenv,
                            'countcod':countcod,
                            'tipo':x.tipo
                            })
                        countcod = countcod + 1
                    context['listnip'] = listnip
                    print len(listnip)
                    if len(listnip) > 0:
                        context['stlistnip'] = True
                    else:
                        context['stlistnip'] = False
                    context['status'] = True
                if 'getfech' in request.GET:
                    context = GrupoPedido.objects.values(
                                'fechtraslado'
                                ).get(codgrupo_id=request.GET.get('cgrupo'))
                    context['status'] = True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        listaproyectos = Proyecto.objects.filter(status = 'AC').order_by('-registrado')
        return render(request,'almacen/pedidoap.html',{
            'listaproyectos': listaproyectos
            })


    def post(self,request,*args,**kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'cantenvdetped' in request.POST:
                        can = Detpedido.objects.get(
                            pedido_id=request.POST.get('idped'),
                            materiales_id = request.POST.get('idmat'),
                            brand_id = request.POST.get('idbrand'),
                            model_id = request.POST.get('idmodel'))
                        can.cantenv = request.POST.get('canttot')
                        can.save()
                        context['status'] = True
                    if 'gencodgrupo' in request.POST:
                        codgrupo = genkeys.GenerateIdGrupoPedido()
                        cgr = GrupoPedido.objects.create(
                            codgrupo_id = codgrupo,
                            proyecto_id = request.POST.get('codpro'),
                            empdni_id = request.user.get_profile().empdni_id,
                            fechtraslado = None,
                            estado = 'GE')
                        cgr.save()
                        context['codgrupo'] = codgrupo
                        context['status'] = True
                    if 'savedetgrupo' in request.POST:
                        lmat = json.loads(request.POST.get('lmat'))
                        for x in lmat:
                            det = detGrupoPedido.objects.create(
                                codgrupo_id = request.POST.get('codgrupo'),
                                pedido_id = x['idped'],
                                material_id = x['codmat'],
                                marca_id = x['codbrand'],
                                model_id = x['codmodel'],
                                cantidad = round(float(x['inputcant'])*100)/100,
                                flag = True if request.POST.get('estado') =='true' else False)
                            det.save()

                        context['status'] = True

                    if 'savedetniple' in request.POST:
                        ldetnip = json.loads(request.POST.get('ldetnip'))
                        cntsum=0
                        for x in ldetnip:
                            dnip = GrupoPedNiple.objects.create(
                                codgrupo_id=request.POST.get('codgrupo'),
                                pedido_id=x['codped'],
                                material_id=x['codmat'],
                                marca_id=x['codbrand'],
                                model_id=x['codmod'],
                                cantidad=round(float(x['inputcant'])*100)/100,
                                metrado=x['metrado'],
                                tipo=x['tipo'],
                                idref_id=x['idtable'])
                            # dnip.save()

                            cantdiv = float(x['metrado'])/100
                            cantmult = float(cantdiv)*float(x['inputcant'])
                            cntsum = cntsum + float(cantmult)

                        dped = Detpedido.objects.get(
                            pedido_id=request.POST.get('cped'),
                            materiales_id=request.POST.get('cmat'),
                            brand_id=request.POST.get('cbr'),
                            model_id=request.POST.get('cmod')
                            )
                        dped.cantenv = float(cntsum) + float(request.POST.get('cenviada'))
                        dped.save()


                        context['status'] = True



                    if 'upddetped' in request.POST:
                        lmat = json.loads(request.POST.get('lmat'))
                        for x in lmat:
                            det = Detpedido.objects.get(
                                pedido_id = request.POST.get('idped'),
                                materiales_id = x['codmat'],
                                brand_id = x['codbrand'],
                                model_id = x['codmodel'])
                            det.cantenv = x['cantupd']
                            det.save()
                        context['status'] = True

                    if 'savealldetgrupo' in request.POST:
                        listmat = json.loads(request.POST.get('listmat'))
                        print 'bvbnc'
                        print listmat
                        for x in listmat:
                            print '--------------------'
                            print 'cmat', x['codmat']
                            print 'solo',x['cantidad']
                            print 'float', float(x['cantidad'])
                            print 'round', round(float(x['cantidad'])*100)/100

                            try:
                                detGrupoPedido.objects.get(
                                    codgrupo_id=request.POST.get('codgrupo'),
                                    material_id=x['codmat'],
                                    marca_id=x['codbr'],
                                    model_id=x['codmod'],
                                    pedido_id=x['codped'])

                                detail=detGrupoPedido.objects.get(
                                        codgrupo_id=request.POST.get('codgrupo'),
                                        material_id=x['codmat'],
                                        marca_id=x['codbr'],
                                        model_id=x['codmod'],
                                        pedido_id=x['codped'])
                                print 'juhdus', x['codmat']

                                detail.cantidad=float(x['cantenv'])+float(x['cantidad'])
                                detail.save()

                            except detGrupoPedido.DoesNotExist, e:
                                print 'xxxx', x['codmat']
                                print 'cccc', float(x['cantidad'])
                                det = detGrupoPedido.objects.create(
                                    codgrupo_id = request.POST.get('codgrupo'),
                                    material_id = x['codmat'],
                                    pedido_id = x['codped'],
                                    marca_id = x['codbr'],
                                    model_id = x['codmod'],
                                    cantidad = float(x['cantidad']),
                                    flag = True if request.POST.get('estado') =='true' else False)
                                # det.save()
                        context['status'] = True

                    if 'updalldetped' in request.POST:
                        lalldetped = json.loads(request.POST.get('lmaterials'))
                        for x in lalldetped:
                            det = Detpedido.objects.get(
                                pedido_id = x['codped'],
                                materiales_id = x['codmat'],
                                brand_id = x['codbr'],
                                model_id = x['codmod'])
                            det.cantenv = float(x['cantenv']) + float(x['cantidad'])
                            det.save()
                        context['status'] = True

                    if 'updfech' in request.POST:
                        fec = GrupoPedido.objects.get(
                            codgrupo_id = request.POST.get('cgrupo'))
                        fec.fechtraslado = request.POST.get('fechatrasl')
                        fec.save()
                        context['status'] = True

                    if 'updniple' in request.POST:
                        ldetniple = json.loads(request.POST.get('ldetnip'))
                        for x in ldetniple:
                            detnip = Niple.objects.get(
                                id = x['idtable'])
                            detnip.cantenv = float(x['inputcant']) + float(x['cenviado'])
                            detnip.save()
                        context['status'] = True

                    if 'savealldetniple' in request.POST:
                        ldetniple = json.loads(request.POST.get('ldet'))
                        for x in ldetniple:
                            dniple = GrupoPedNiple.objects.create(
                                codgrupo_id=request.POST.get('codgrupo'),
                                pedido_id=x['codped'],
                                material_id=x['codmat'],
                                marca_id=x['codbr'],
                                model_id=x['codmod'],
                                cantidad=round(float(x['restcant'])*100)/100,
                                metrado=x['metrado'],
                                tipo=x['tipo'],
                                idref_id=x['idtable'])
                            # dniple.save()

                            nip = Niple.objects.get(
                                id = x['idtable'])
                            nip.cantenv = float(x['cantidad'])
                            nip.save()
                        context['status'] = True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()


class GrupPedido(JSONResponseMixin, TemplateView):
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'getldetgrupo' in request.GET:
                    ldetgrupo = []
                    for x in detGrupoPedido.objects.filter(
                        codgrupo_id = request.GET.get('codgrupo')).order_by('pedido','material__matnom'):
                        ldetgrupo.append({
                            'id':x.id,
                            'codgrup':x.codgrupo_id,
                            'codmat': x.material_id,
                            'namemat':x.material.matnom,
                            'medmat':x.material.matmed,
                            'codmarca': x.marca_id,
                            'namemarca':x.marca.brand,
                            'codmod':x.model_id,
                            'namemodel':x.model.model,
                            'cantidad':float(x.cantidad),
                            'codped':x.pedido_id
                            })
                        context['ldetgrupo'] = ldetgrupo
                    print 'lengrupo'
                    if len(ldetgrupo) > 0:
                        context['lengrupo'] = True
                    print len(ldetgrupo)
                    context['status'] = True

                if 'getcantdetped' in request.GET:
                    context = Detpedido.objects.values(
                                'pedido_id',
                                'materiales_id',
                                'brand_id',
                                'model_id',
                                'cantidad',
                                'cantenv'
                                ).get(
                                    pedido_id=request.GET.get('cped'),
                                    materiales_id=request.GET.get('cmat'),
                                    brand_id=request.GET.get('cbr'),
                                    model_id=request.GET.get('cmod'))
                    if len(context) > 0:
                        context['status'] = True

                if 'listgrupo' in request.GET:
                    lgrupo = []
                    for x in GrupoPedido.objects.filter(estado=request.GET.get('estgr')).order_by('codgrupo_id'):
                        lgrupo.append({
                            'codgrupo_id': x.codgrupo_id,
                            'codproy': x.proyecto_id,
                            'nameproy': x.proyecto.nompro,
                            'codemple': x.empdni_id,
                            'nameemple': x.empdni.lastname + ', ' + x.empdni.firstname,
                            'fechtrasl': x.fechtraslado
                            })
                    context['lgrupo'] = lgrupo
                    context['servreport'] = SettingsApp.objects.values().get(flag=True)['serverreport']
                    context['status'] = True

                if 'getcantdetniple' in request.GET:
                    lcantdnip = []
                    for x in Niple.objects.filter(
                        pedido_id = request.GET.get('codped'),
                        materiales_id = request.GET.get('codmat'),
                        brand_id = request.GET.get('codbr'),
                        model_id = request.GET.get('codmod')):
                        lcantdnip.append({
                            'idped':x.pedido_id,
                            'idmat':x.materiales_id,
                            'idbr':x.brand_id,
                            'idmod':x.model_id
                            })
                        context['lcantdnip'] = lcantdnip
                    if len(lcantdnip) > 0:
                        context['stlcantdnip'] = True
                    else:
                        context['stlcantdnip'] = False
                    context['status'] = True

                if 'lgrpedniple' in request.GET:
                    lgrniple=[]
                    for x in GrupoPedNiple.objects.filter(
                        codgrupo_id = request.GET.get('codgroup'),
                        material_id= request.GET.get('codmat'),
                        marca_id=request.GET.get('codbr'),
                        model_id=request.GET.get('codmod')).order_by('tipo'):
                        lgrniple.append({
                            'idtable':x.id,
                            'idref':x.idref_id,
                            'codmat':x.material_id,
                            'codmarca':x.marca_id,
                            'codmod':x.model_id,
                            'cantidad':x.cantidad,
                            'metrado':x.metrado,
                            'tipo':x.tipo,
                            'cpedi':x.pedido_id
                            })
                        context['lgrniple'] = lgrniple
                    context['status'] = True

                if 'getdetniple' in request.GET:
                    context = Niple.objects.values(
                                'id',
                                'cantidad',
                                'cantenv',
                                'metrado',
                                'pedido',
                                'materiales',
                                'brand',
                                'model'
                                ).get(
                                    id=request.GET.get('idtabniple'))
                    if len(context) > 0:
                        context['status'] = True

                if 'getsizegrnip' in request.GET:
                    lgrnipl=[]
                    lstatus=[]
                    ldetgrupo = json.loads(request.GET.get('ldetgrupo'))
                    for x in ldetgrupo:
                        print x['codmat']
                        for y in GrupoPedNiple.objects.filter(
                            codgrupo_id=x['codgrup'],
                            material_id=x['codmat'],
                            marca_id=x['codmarca'],
                            model_id=x['codmod']):
                            lgrnipl.append({
                                'cgr':y.codgrupo_id,
                                'codped':y.pedido_id,
                                'codmat':y.material_id,
                                })

                        if len(lgrnipl) > 0:
                            stat=True
                        else:
                            stat=False
                        lstatus.append({
                            'estado':stat
                            })

                    # context['lstatus']= lstatus
                    context['status'] = True



                if 'getlstatus' in request.GET:

                    lst=[]
                    ldetsum = json.loads(request.GET.get('ldetsum'))
                    for x in ldetsum:
                        lgrni=[]
                        for y in GrupoPedNiple.objects.filter(
                            codgrupo_id=x['codgrup'],
                            material_id=x['codmat'],
                            marca_id=x['codmarca'],
                            model_id=x['codmod']):
                            lgrni.append({
                                'cgr':y.codgrupo_id,
                                'codped':y.pedido_id,
                                'codmat':y.material_id,
                                })

                        if len(lgrni) > 0:
                            stat=True
                        else:
                            stat=False
                        print 'qw',len(lgrni), stat
                        lst.append({
                            'estado':stat
                            })

                    context['lstat']= lst
                    context['status'] = True

                if 'getdetnip' in request.GET:
                    ldgr=[]
                    print request.GET.get('codgrupo')
                    for x in GrupoPedNiple.objects.filter(
                        codgrupo_id=request.GET.get('codgrupo')):
                        ldgr.append({
                            'id':x.id,
                            'codgr':x.codgrupo_id,
                            'codped':x.pedido_id,
                            'codmat':x.material_id,
                            'codbr':x.marca_id,
                            'codmod':x.model_id,
                            'cantid':x.cantidad,
                            'metrado':x.metrado,
                            'idnipleref':x.idref_id
                            })
                    context['ldgr'] = ldgr
                    context['status'] = True

                if 'getdetpedido' in request.GET:
                    listadped =[]
                    ldetgrupo = json.loads(request.GET.get('ldetgrupo'))
                    for x in ldetgrupo:
                        for y in Detpedido.objects.filter(
                            pedido_id=x['codped'],
                            materiales_id=x['codmat'],
                            brand_id=x['codmarca'],
                            model_id=x['codmod']):
                            listadped.append({
                                'idped':y.pedido_id,
                                'idmat':y.materiales_id,
                                'idbr':y.brand_id,
                                'idmod':y.model_id,
                                'canenviada':y.cantenv,
                                'cantrest':y.cantenv - x['cantidad']
                                })

                    context['listadped'] = listadped
                    context['status'] = True


                if 'gniple' in request.GET:
                    lgniple = []
                    lsumdetnip = json.loads(request.GET.get('lsumdetnip'))
                    for x in lsumdetnip:
                        for y in Niple.objects.filter(
                            id=x['idnipleref']):
                            lgniple.append({
                                'idniple':y.id,
                                'cantidad':y.cantenv,
                                'cantres':float(y.cantenv) - float(x['cantid'])
                                })
                    context['lgniple'] = lgniple
                    context['status'] = True

                if 'getcantdetgrped' in request.GET:
                    context = detGrupoPedido.objects.values(
                                'id',
                                'cantidad'
                                ).get(
                                    codgrupo_id=request.GET.get('codgrupo'),
                                    material_id=request.GET.get('cmat'),
                                    marca_id=request.GET.get('cbr'),
                                    model_id=request.GET.get('cmod'),
                                    pedido_id=request.GET.get('cped'))
                    if len(context) > 0:
                        context['status'] = True




            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        return render(request,'almacen/grupopedido.html')


    def post(self,request,*args,**kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'updcantdetped' in request.POST:
                        can = Detpedido.objects.get(
                            pedido_id=request.POST.get('idped'),
                            materiales_id = request.POST.get('idmat'),
                            brand_id = request.POST.get('idbr'),
                            model_id = request.POST.get('idmod'))
                        can.cantenv = request.POST.get('cantidad')
                        can.save()
                        context['status'] = True

                    if 'updcatndetgrupo' in request.POST:
                        can = detGrupoPedido.objects.get(
                            codgrupo_id = request.POST.get('codgrupo'),
                            material_id = request.POST.get('matid'),
                            marca_id = request.POST.get('brid'),
                            model_id = request.POST.get('modid'))
                        can.cantidad = request.POST.get('cantidad')
                        can.save()
                        context['status'] = True

                    if 'deldetmat' in request.POST:
                        detGrupoPedido.objects.get(
                            id=request.POST.get('idtable')).delete()
                        context['status'] = True

                    if 'delallgrupo' in request.POST:
                        ldetgrupo = json.loads(request.POST.get('ldetgrupo'))
                        for x in ldetgrupo:
                            detGrupoPedido.objects.get(
                                id=x['id']).delete()
                        context['status'] = True


                    if 'updcenvdetped' in request.POST:
                        ldetgrupo = json.loads(request.POST.get('ldetgrupo'))
                        for y in ldetgrupo:
                            cenv=Detpedido.objects.get(
                                pedido_id=y['codped'],
                                materiales_id=y['codmat'],
                                brand_id=y['codmarca'],
                                model_id=y['codmod'])
                            cenv.cantenv = 0
                            cenv.save()
                        context['status'] = True

                    if 'updcantenv' in request.POST:
                        nip = Niple.objects.get(
                            id=request.POST.get('idnip'))
                        nip.cantenv=request.POST.get('edcantsend')
                        nip.save()

                        grped = GrupoPedNiple.objects.get(
                            id=request.POST.get('idtab'))
                        grped.cantidad = request.POST.get('cant')
                        grped.save()

                        dgrped = detGrupoPedido.objects.get(
                            id=request.POST.get('codtabdetgrped'))
                        dgrped.cantidad= request.POST.get('total')
                        dgrped.save()

                        dped = Detpedido.objects.get(
                            pedido_id=request.POST.get('cped'),
                            materiales_id=request.POST.get('cmat'),
                            brand_id=request.POST.get('cbr'),
                            model_id=request.POST.get('cmod'))
                        dped.cantenv=request.POST.get('edcantdetped')
                        dped.save()

                        context['status'] = True

                    if 'upddelniple' in request.POST:

                        nip = Niple.objects.get(
                            id=request.POST.get('idnip'))
                        nip.cantenv = request.POST.get('cant')
                        nip.save()

                        GrupoPedNiple.objects.get(
                                id=request.POST.get('idtab')).delete()

                        detped = Detpedido.objects.get(
                            pedido_id=request.POST.get('cped'),
                            materiales_id=request.POST.get('cmat'),
                            brand_id=request.POST.get('cbr'),
                            model_id=request.POST.get('cmod'))
                        detped.cantenv=request.POST.get('cantdped')
                        detped.save()

                        detgrped = detGrupoPedido.objects.get(
                            codgrupo_id=request.POST.get('codgrupo'),
                            material_id=request.POST.get('cmat'),
                            marca_id=request.POST.get('cbr'),
                            model_id=request.POST.get('cmod'),
                            pedido_id=request.POST.get('cped'))
                        detgrped.cantidad=request.POST.get('cantdetgrped')
                        detgrped.save()

                        context['status'] = True

                    if 'updanulgrup' in request.POST:
                        listadped = json.loads(request.POST.get('listadped'))
                        lgniple = json.loads(request.POST.get('lgniple'))
                        ldgr = json.loads(request.POST.get('ldgr'))
                        ldetgrupo = json.loads(request.POST.get('ldetgrupo'))

                        for x in listadped:
                            dped = Detpedido.objects.get(
                                pedido_id=x['idped'],
                                materiales_id=x['idmat'],
                                brand_id=x['idbr'],
                                model_id=x['idmod'])
                            dped.cantenv=x['cantrest']
                            dped.save()

                        for y in lgniple:
                            nip=Niple.objects.get(
                                id=y['idniple'])
                            nip.cantenv=y['cantres']
                            nip.save()

                        for b in ldetgrupo:
                            grped = detGrupoPedido.objects.get(
                                id=b['id']).delete()

                        for z in ldgr:
                            gr = GrupoPedNiple.objects.get(
                                id=z['id']
                                ).delete()

                        grp = GrupoPedido.objects.get(
                            codgrupo_id=request.POST.get('delcodgrupo')).delete()

                        context['status'] = True

                    if 'updstgrped' in request.POST:
                        gru=GrupoPedido.objects.get(
                            codgrupo_id=request.POST.get('codgrupo'))
                        gru.estado=request.POST.get('estado')
                        gru.save()
                        context['status']=True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print str(e)

