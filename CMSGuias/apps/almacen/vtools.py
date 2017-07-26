#!/usr/bin/env python
#-*- conding: utf-8 -*-

import json
import csv
import os


from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext, TemplateDoesNotExist
from django.template import Context
from django.conf import settings
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView, TemplateView, View
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from xlrd import open_workbook, XL_CELL_EMPTY


from CMSGuias.apps.home.models import *
from CMSGuias.apps.logistica.models import DetCompra
from CMSGuias.apps.operations.models import DSMetrado, SGroup, Nipple
from CMSGuias.apps.tools import genkeys, globalVariable, uploadFiles
from CMSGuias.apps.ventas.models import Proyecto, Sectore
# from ..home.models import SettingsApp
# from CMSGuias.apps.home.models import Materiale
from .models import *


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


class Herramienta(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'getherra' in request.GET:
                    lherra=[]
                    tipolist=request.GET.get('tipolist')
                    if tipolist=='all':
                        for x in InventarioHerra.objects.filter(
                            herramienta__tipo=request.GET.get('tipoacce'),
                            flag=True).order_by('herramienta__matnom'):
                            lherra.append({
                                'codherra':x.herramienta.materiales_id,
                                'nameherra':x.herramienta.matnom,
                                'medherra':x.herramienta.matmed,
                                'codbr':x.marca_id,
                                'brand':x.marca.brand,
                                'codunid':x.herramienta.unidad.unidad_id,
                                'tvida':x.tvida,
                                'unid':x.herramienta.unidad.uninom
                                })

                        context['lherra']=lherra[:50]
                    else:
                        for x in InventarioHerra.objects.filter(
                            Q(herramienta__materiales_id=request.GET.get('texto')) | Q(herramienta__matnom__icontains=request.GET.get('texto')),
                            herramienta__tipo=request.GET.get('tipoacce'),
                            flag=True).order_by('herramienta__matnom'):
                            lherra.append({
                                'codherra':x.herramienta.materiales_id,
                                'nameherra':x.herramienta.matnom,
                                'medherra':x.herramienta.matmed,
                                'codbr':x.marca_id,
                                'brand':x.marca.brand,
                                'codunid':x.herramienta.unidad.unidad_id,
                                'tvida':x.tvida,
                                'unid':x.herramienta.unidad.uninom
                                })
                        context['lherra']=lherra
                    context['status']=True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)

        lmarcaherra = Brand.objects.filter(flag = True).order_by('brand')
        lunidherra = Unidade.objects.filter(flag = True).order_by('uninom')

        return render(request,'almacen/herramienta.html',{
            'lmarca':lmarcaherra,
            'lunidade':lunidherra
            })

    @method_decorator(login_required)
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
                        print request.POST
                        tipoacce=request.POST.get('tipoacce')
                        if tipoacce=="TL":
                            codherra=genkeys.GenerateIdHerra()
                        else:
                            codherra=genkeys.GenerateIdEpps()

                        print codherra

                        mat = Materiale()
                        mat.materiales_id=codherra
                        mat.matnom=request.POST.get('nameherra')
                        mat.matmed=request.POST.get('medherra')
                        mat.unidad_id=request.POST.get('unidherra')
                        mat.matacb='Fabrica'
                        mat.matare=0
                        mat.tipo=request.POST.get('tipoacce')
                        mat.save()

                        InventarioHerra.objects.create(
                            herramienta_id = codherra,
                            marca_id=request.POST.get('marcaherra'),
                            moneda_id='CU02',
                            tvida=request.POST.get('tvida'))

                        context['status'] = True

                    if 'editherra' in request.POST:
                        print request.POST.get('unidherra')
                        edmat= Materiale.objects.get(
                            materiales_id=request.POST.get('codherra'))
                        edmat.matnom=request.POST.get('nameherra')
                        edmat.matmed=request.POST.get('medherra')
                        edmat.unidad_id=request.POST.get('unidherra')
                        edmat.save()


                        eherra = InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('codherra')
                            )
                        eherra.marca_id = request.POST.get('marcaherra')
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
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:

                if 'lherradev' in request.GET:
                    arrherradev = []
                    count = 0
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('nguia'),flagdev=False):
                        arrherradev.append(
                            {'nguia': x.guia_id,
                            'codherra':x.herramienta_id,
                            'codbr':x.brand.brand_id,
                            'unid':x.herramienta.unidad.uninom,
                            'nameherra': x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'marcherra':x.brand.brand,
                            'conta':count,
                            'cantdevuelta':x.cantdev,
                            'cantiherra':x.cantidad})
                        count = count + 1
                        context['listherradev']= arrherradev
                    context['status'] = True


                if 'leditguia' in request.GET:
                    leditheguia = []
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('idherraguia'),
                        flagdev=False).order_by('herramienta__matnom'):
                        leditheguia.append(
                            {'edid': x.id,
                            'edcodguia' : x.guia_id,
                            'edcodherra' : x.herramienta.materiales_id,
                            'ednombherra' : x.herramienta.matnom,
                            'edmedherra' : x.herramienta.matmed,
                            'edbrandherra':x.brand.brand,
                            'edest': x.estado,
                            'descgeneral':x.grupo,
                            # 'edcantdev':x.cantdev,
                            'restcant':float(x.cantidad) - float(x.cantdev),
                            'edcoment':x.comentario,
                            'edfdev': x.fechdevolucion,
                            'edcant':x.cantidad})
                    context['leditheguia']= leditheguia
                    context['status'] = True

                if 'ldetherraguia' in request.GET:
                    lisherraguia = []
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('idherraguia')):
                        lisherraguia.append(
                            {'id': x.id,
                            'codguia' : x.guia_id,
                            'codherra' : x.herramienta_id,
                            'nombherra' : x.herramienta.matnom,
                            'medherra' : x.herramienta.matmed,
                            'brandherra':x.brand.brand,
                            'est': x.estado,
                            'descgeneral':x.grupo,
                            # 'count':i,
                            'coment':x.comentario,
                            'fdev': x.fechdevolucion,
                            'cant':x.cantidad})

                    context['lherraguia']= lisherraguia
                    context['status']=True

                if 'listaherraguia' in request.GET:
                    lis = request.GET.getlist('tamdev[]')
                    li = []
                    j = 0
                    for x in lis:
                        k = 0
                        for x in detGuiaHerramienta.objects.filter(
                            guia_id=lis[j]):
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
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('idherraguia'),
                        flagdev=False):
                        lisherraguia.append(
                            {'id': x.id,
                            'codguia' : x.guia_id,
                            'codherra' : x.herramienta_id,
                            'nombherra' : x.herramienta.matnom,
                            'medherra' : x.herramienta.matmed,
                            'brandherra':x.brand.brand,
                            'est': x.estado,
                            'count':i,
                            'coment':x.comentario,
                            'fdev': x.fechdevolucion,
                            'cant':x.cantidad})
                        context['lherraguia']= lisherraguia
                        i=i+1
                    context['status'] = True

                ####edit 20/04
                if 'listconductor' in request.GET:
                    lcond = []
                    for x in Conductore.objects.filter(
                        traruc_id = request.GET.get('codtransp')).order_by('connom'):
                        lcond.append({
                            'cod_cond': x.condni_id,
                            'name_cond':x.connom
                            })
                    context['lcond'] = lcond
                    context['status'] = True

                    ltransp = []
                    for y in Transporte.objects.filter(
                        traruc_id = request.GET.get('codtransp')):
                        ltransp.append({
                            'placa': y.nropla_id,
                            'marca': y.marca
                            })
                    context['ltransp'] = ltransp
                    context['status'] = True

                if 'listarguiaherra' in request.GET:
                    print 'dsd'
                    lguiasherra=[]
                    tipolist=request.GET.get('tipolist')
                    if tipolist=="all":
                        for x in GuiaHerramienta.objects.filter(
                            tipo=request.GET.get('tipoacce'),
                            estado=request.GET.get('estadoguiaherra')).order_by('-registro'):
                            lguiasherra.append({
                                'numguiaherra':x.guia_id,
                                'codproy':x.proyecto_id,
                                'nameproy':x.proyecto.nompro,
                                'fsalida':x.fechsalida,
                                'apesuperv':x.proyecto.empdni.lastname,
                                'namesuperv':x.proyecto.empdni.firstname,
                                'codtransporte':x.traruc_id,
                                'transporte':x.traruc.tranom,
                                'codconductor':x.condni_id,
                                'conductor':x.condni.connom,
                                'codplaca':x.nropla_id,
                                'comentario':x.comentario,
                                'marcatransporte':x.nropla.marca,
                                'direcproy':x.proyecto.direccion,
                                'rzcliente':x.proyecto.ruccliente.razonsocial
                                })
                        context['lguiasherra']=lguiasherra[:50]
                    elif tipolist=='rangofecha':
                        for x in GuiaHerramienta.objects.filter(
                            tipo=request.GET.get('tipoacce'),
                            fechsalida__range=[request.GET.get('fechfrom'),request.GET.get('fechto')],
                            estado=request.GET.get('estadoguiaherra')).order_by('-registro'):
                            lguiasherra.append({
                                'numguiaherra':x.guia_id,
                                'codproy':x.proyecto_id,
                                'nameproy':x.proyecto.nompro,
                                'fsalida':x.fechsalida,
                                'apesuperv':x.proyecto.empdni.lastname,
                                'namesuperv':x.proyecto.empdni.firstname,
                                'codtransporte':x.traruc_id,
                                'transporte':x.traruc.tranom,
                                'codconductor':x.condni_id,
                                'conductor':x.condni.connom,
                                'codplaca':x.nropla_id,
                                'comentario':x.comentario,
                                'marcatransporte':x.nropla.marca,
                                'direcproy':x.proyecto.direccion,
                                'rzcliente':x.proyecto.ruccliente.razonsocial
                                })
                        context['lguiasherra']=lguiasherra
                    else:
                        for x in GuiaHerramienta.objects.filter(
                            Q(guia_id__icontains=request.GET.get('texto')) | Q(proyecto_id=request.GET.get('texto')),
                            tipo=request.GET.get('tipoacce'),
                            estado=request.GET.get('estadoguiaherra')).order_by('-registro'):
                            lguiasherra.append({
                                'numguiaherra':x.guia_id,
                                'codproy':x.proyecto_id,
                                'nameproy':x.proyecto.nompro,
                                'fsalida':x.fechsalida,
                                'apesuperv':x.proyecto.empdni.lastname,
                                'namesuperv':x.proyecto.empdni.firstname,
                                'codtransporte':x.traruc_id,
                                'transporte':x.traruc.tranom,
                                'codconductor':x.condni_id,
                                'conductor':x.condni.connom,
                                'codplaca':x.nropla_id,
                                'comentario':x.comentario,
                                'marcatransporte':x.nropla.marca,
                                'direcproy':x.proyecto.direccion,
                                'rzcliente':x.proyecto.ruccliente.razonsocial
                                })

                        context['lguiasherra']=lguiasherra
                    context['status']=True

                if 'listardocdev' in request.GET:
                    ldocdev=[]
                    tipolist=request.GET.get('tipolist')
                    if tipolist=='all':
                        for x in detDevHerramienta.objects.filter(
                            guia__tipo=request.GET.get('tipoacce'),
                            docdev__estado='GE').distinct('docdev__docdev_id').order_by('-docdev__docdev_id'):
                            ldocdev.append({
                                'coddocdev':x.docdev_id,
                                'fretorno':x.docdev.fechretorno,
                                'numguiaherra':x.guia_id,
                                'transporte':x.docdev.traruc.tranom,
                                'fretorno':x.docdev.fechretorno,
                                'conductor':x.docdev.condni.connom,
                                })
                        context['ldocdev']=ldocdev[:50]

                    elif tipolist=="rangofecha":
                        for x in detDevHerramienta.objects.filter(
                            guia__tipo=request.GET.get('tipoacce'),
                            docdev__fechretorno__range=[request.GET.get('fechfrom'),request.GET.get('fechto')],
                            docdev__estado='GE').distinct('docdev__docdev_id').order_by('-docdev__docdev_id'):
                            ldocdev.append({
                                'coddocdev':x.docdev_id,
                                'fretorno':x.docdev.fechretorno,
                                'numguiaherra':x.guia_id,
                                'transporte':x.docdev.traruc.tranom,
                                'fretorno':x.docdev.fechretorno,
                                'conductor':x.docdev.condni.connom,
                                })
                        context['ldocdev']=ldocdev

                    else:
                        for x in detDevHerramienta.objects.filter(
                            Q(docdev__docdev_id=request.GET.get('texto')) | Q(guia_id=request.GET.get('texto')),
                            guia__tipo=request.GET.get('tipoacce'),
                            docdev__estado='GE').distinct('docdev__docdev_id').order_by('-docdev__docdev_id'):
                            ldocdev.append({
                                'coddocdev':x.docdev_id,
                                'fretorno':x.docdev.fechretorno,
                                'numguiaherra':x.guia_id,
                                'transporte':x.docdev.traruc.tranom,
                                'fretorno':x.docdev.fechretorno,
                                'conductor':x.docdev.condni.connom,
                                })

                        context['ldocdev']=ldocdev
                    context['status']=True

                if 'getldetdocdev' in request.GET:
                    ldetdocdev=[]
                    for x in detDevHerramienta.objects.filter(
                        docdev_id=request.GET.get('coddocdev')):
                        ldetdocdev.append({
                            'idtable':x.id,
                            'numguiaherra':x.guia_id,
                            'codherra':x.herramienta_id,
                            'cantidad':x.cantidad
                            })
                    context['ldetdocdev']=ldetdocdev
                    context['status']=True

                if 'getldetguiahe' in request.GET:
                    ldetguiahe=[]
                    ldetdocdev=json.loads(request.GET.get('ldetdocdev'))
                    for y in ldetdocdev:
                        for x in detGuiaHerramienta.objects.filter(
                            guia_id=y['numguiaherra'],
                            herramienta_id=y['codherra']
                            ):
                            ldetguiahe.append({
                                'idtabdetghe':x.id,
                                'numguiahe':x.guia_id,
                                'codherra':x.herramienta_id,
                                'cantdev':x.cantdev,
                                'cantupddetghe':float(x.cantdev)-float(y['cantidad'])
                                })
                    context['ldetguiahe']=ldetguiahe
                    context['status']=True

                if 'getlinventhe' in request.GET:
                    ldetdocdev=json.loads(request.GET.get('ldetdocdev'))
                    linventhe=[]
                    for y in ldetdocdev:
                        for x in InventarioHerra.objects.filter(
                            herramienta_id=y['codherra']):
                            linventhe.append({
                                'idtabinventario':x.id,
                                'codherra':x.herramienta_id,
                                'cantalmacen':x.cantalmacen,
                                'cantupdinv':float(x.cantalmacen)-float(y['cantidad'])
                                })
                    context['linventhe']=linventhe
                    context['status']=True

                if 'getlistdetguiahe' in request.GET:
                    listdetguiahe=[]
                    for x in detGuiaHerramienta.objects.filter(
                        guia_id=request.GET.get('codguiahe')):
                        listdetguiahe.append({
                            'idtabdetghe':x.id,
                            'codguiahe':x.guia_id,
                            'codherra':x.herramienta_id,
                            'cantidad':x.cantidad
                            })
                    context['listdetguiahe']=listdetguiahe
                    context['status']=True

                if 'getlistinvent' in request.GET:
                    listinvent=[]
                    listdetguiahe=json.loads(request.GET.get('listdetguiahe'))
                    print 'lista', listdetguiahe
                    for y in listdetguiahe:
                        for x in InventarioHerra.objects.filter(
                            herramienta_id=y['codherra']):
                            listinvent.append({
                                'idtabinventhe':x.id,
                                'codherra':x.herramienta_id,
                                'cantalmacen':x.cantalmacen,
                                'cantdevuelto':y['cantidad'],
                                'cantalmacentotal':float(x.cantalmacen)+float(y['cantidad'])
                                })
                    context['listinvent']=listinvent
                    context['status']=True

                if 'getlinventrest' in request.GET:
                    linventrest=[]
                    lherranew=json.loads(request.GET.get('lherranew'))
                    for y in lherranew:
                        for x in InventarioHerra.objects.filter(
                            herramienta_id=y['codherra']):
                            linventrest.append({
                                'idtabinventhe':x.id,
                                'codherra':x.herramienta_id,
                                'medherra':y['medherra'],
                                'codbrherra':y['codbrherra'],
                                'fdev':y['fdev'],
                                'dgeneral':y['descgeneral'],
                                'estadoherra':y['estado'],
                                'cantidad':y['cantidad'],
                                'comentherra':y['coment'],
                                'cantalmacen':x.cantalmacen,
                                'cantupdinvent':float(x.cantalmacen)-float(y['cantidad'])
                                })
                    context['linventrest']=linventrest
                    context['status']=True

                if 'getlinv' in request.GET:
                    lhedev=json.loads(request.GET.get('lhedev'))
                    linv=[]
                    ldetghe=[]

                    for y in lhedev:
                        if y['estherra']=='BAJA':
                            cant=0
                        else:
                            cant=float(y['inputcant'])
                        for x in InventarioHerra.objects.filter(
                            herramienta_id=y['codherra']):
                            linv.append({
                                'idtabinventhe':x.id,
                                'codherra':x.herramienta_id,
                                'cantalmacen':x.cantalmacen,
                                'comentherra':y['comentherra'],
                                'estherra':y['estherra'],
                                'cantupdinv':float(x.cantalmacen)+float(cant)
                                })


                        for z in detGuiaHerramienta.objects.filter(
                            guia_id=request.GET.get('codguia'),
                            herramienta_id=y['codherra']):
                            ldetghe.append({
                                'idtabdetghe':z.id,
                                'codguia':z.guia_id,
                                'codbr':z.brand.brand_id,
                                'codherra':z.herramienta_id,
                                'inputcant':y['inputcant'],
                                'estado':y['estherra'],
                                'comenthe':y['comentherra'],
                                'cantdev':z.cantdev,
                                'cantupddetghe':float(z.cantdev)+float(y['inputcant'])
                                })


                    context['ldetghe']=ldetghe
                    context['linv']=linv
                    context['status']=True

                if 'gethedetghe' in request.GET:
                    context = detGuiaHerramienta.objects.values(
                        'cantdev',
                        'id'
                        ).get(
                        guia_id=request.GET.get('codguia'),
                        herramienta_id=request.GET.get('codherra'))
                    context['status']=True

                if 'listallherra' in request.GET:
                    lallherra=[]
                    for x in InventarioHerra.objects.filter(
                        herramienta__tipo=request.GET.get('tipoacce'),
                        flag=True).order_by('herramienta__matnom'):
                        if x.cantalmacen > 0:
                            lallherra.append({
                                'codherra':x.herramienta.materiales_id,
                                'nameherra':x.herramienta.matnom,
                                'codbr':x.marca.brand_id,
                                'brherra':x.marca.brand,
                                'medherra':x.herramienta.matmed,
                                'descherra':'%s %s %s' % (x.herramienta.matnom,x.herramienta.matmed,x.marca.brand),
                                'cantalmacen':x.cantalmacen
                                })
                    context['lallherra']=lallherra
                    context['status']=True

                if 'getlastguiama' in request.GET:
                    cguia=genkeys.GenerateIdGuiaHerra('002')
                    context['cguia']=cguia[4:12]
                    context['status']=True

                if 'lproyguia' in request.GET:
                    listproyguia=[]
                    for x in GuiaHerramienta.objects.filter(
                        tipo=request.GET.get('tipoacce')).distinct('proyecto__proyecto_id').order_by('proyecto__proyecto_id'):
                        listproyguia.append({
                            'codproy':x.proyecto.proyecto_id,
                            'nameproy':x.proyecto.nompro
                            })
                    context['listproyguia']=listproyguia
                    context['status']=True
                if 'getemple' in request.GET:
                    emple='%s, %s' % (request.user.get_profile().empdni.lastname,
                                      request.user.get_profile().empdni.firstname)
                    context['emple']=emple
                    context['servreport'] = SettingsApp.objects.values().get(flag=True)['serverreport']
                    context['ruc'] = request.session['company']['ruc']
                    context['status']=True



            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


        lproy = GuiaHerramienta.objects.filter(Q(estado='PE') | Q(estado='GE')).distinct('proyecto__nompro').order_by('proyecto__nompro')
        lproyecto = Proyecto.objects.filter(status='AC').order_by('-registrado')
        lcond = Conductore.objects.filter(flag = True).order_by('connom')
        ltrans = Transporte.objects.filter(flag = True).order_by('nropla_id')
        lherr = InventarioHerra.objects.filter(flag=True).order_by('herramienta__matnom')
        ltransportista = Transportista.objects.filter(flag=True).order_by('tranom')
        lguiape = GuiaHerramienta.objects.filter(estado='PE').order_by('-registro')
        lguiagene = GuiaHerramienta.objects.filter(estado='GE').order_by('-registro')
        ldocdev = detDevHerramienta.objects.filter(docdev__estado = 'GE').distinct('docdev__docdev_id').order_by('docdev__docdev_id')
        lbrandhe = Brand.objects.filter(flag = True).order_by('brand')
        lunidadhe = Unidade.objects.filter(flag = True).order_by('uninom')
        lmonedahe = Moneda.objects.filter(flag=True).order_by('-moneda')
        return render(request,'almacen/guia.html',{
            'lproyecto':lproy,
            'lconductor':lcond,
            'ltransporte':ltrans,
            'lherramienta':lherr,
            'ltransportista':ltransportista,
            'lguiape':lguiape,
            'lbrandhe':lbrandhe,
            'lunidadhe':lunidadhe,
            'lproyectos':lproyecto,
            'lguiagene':lguiagene,
            'listadocdev':ldocdev,
            'lmonedahe':lmonedahe,
            'hreport': SettingsApp.objects.get(flag=True).serverreport,
            'ruc': request.session['company']['ruc']
            })
    @method_decorator(login_required)
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
                                guia_id = request.POST.get('codguia'),
                                herramienta_id = request.POST.get('codherra'))
                            context['status'] = True
                        except detGuiaHerramienta.DoesNotExist, e:
                            context['status'] = False

                    if 'savenewherra' in request.POST:
                        detGuiaHerramienta.objects.create(
                            guia_id=request.POST.get('codguia'),
                            herramienta_id=request.POST.get('codherra'),
                            brand_id=request.POST.get('codbrhe'),
                            estado=request.POST.get('estado'),
                            grupo=request.POST.get('descripgrupo'),
                            fechdevolucion = None if request.POST.get('fdev') == "" else request.POST.get('fdev'),
                            cantidad = request.POST.get('inputcant'),
                            cantinicial = request.POST.get('inputcant'),
                            comentario = request.POST.get('coment')
                            )

                        upd=InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('codherra'))
                        upd.cantalmacen=request.POST.get('updst')
                        upd.save()

                        context['status'] = True


                    if 'savecabguia' in request.POST:
                        cguia=genkeys.GenerateIdGuiaHerra('001')
                        codguia=''
                        linventrest=json.loads(request.POST.get('linventrest'))

                        tipocod=request.POST.get('tipocod')
                        if tipocod=='auto':
                            codguia=cguia
                        else:
                            codguia=request.POST.get('codguia')

                        GuiaHerramienta.objects.create(
                            guia_id=codguia,
                            proyecto_id=request.POST.get('codproy'),
                            fechsalida=request.POST.get('fsalid'),
                            condni_id=request.POST.get('codcond'),
                            nropla_id = request.POST.get('codplaca'),
                            traruc_id = request.POST.get('codtrans'),
                            estado=request.POST.get('estado'),
                            empdni_id = request.user.get_profile().empdni_id,
                            comentario=request.POST.get('coment'),
                            tipo=request.POST.get('tipoacce')
                            )

                        for x in linventrest:
                            detGuiaHerramienta.objects.create(
                                guia_id=codguia,
                                herramienta_id=x['codherra'],
                                brand_id=x['codbrherra'],
                                cantidad = x['cantidad'],
                                cantinicial = x['cantidad'],
                                fechdevolucion= None if x['fdev']=="" else x['fdev'],
                                estado=x['estadoherra'],
                                comentario= x['comentherra'],
                                grupo=x['dgeneral']
                                )

                            MovInventario.objects.create(
                                herramienta_id=x['codherra'],
                                cantidad=x['cantidad'],
                                estado = 'SAVE'
                                )

                            updinv=InventarioHerra.objects.get(
                                id=x['idtabinventhe'])
                            updinv.cantalmacen=x['cantupdinvent']
                            updinv.save()

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


                        det = request.POST.getlist('lthg[]')
                        print 'nvale'
                        print det
                        context['status'] = True


                    if 'eddetguia' in request.POST:
                        detguia = detGuiaHerramienta.objects.get(
                            id=request.POST.get('idtable')
                            )
                        detguia.cantidad = request.POST.get('cantfinal')
                        detguia.save()

                        stckfin = InventarioHerra.objects.get(
                            herramienta_id= request.POST.get('codigohe')
                            )
                        stckfin.cantalmacen = request.POST.get('stockfin')
                        stckfin.save()

                        if request.POST.get('stcantidades')=='true':
                            detGuiaHerramienta.objects.get(
                                id=request.POST.get('idtable')).delete()

                        context['status'] = True


                    if 'upddeldocdev' in request.POST:
                        ldetguiahe = json.loads(request.POST.get('ldetguiahe'))
                        linventhe = json.loads(request.POST.get('linventhe'))
                        ldetdocdev = json.loads(request.POST.get('ldetdocdev'))

                        for x in ldetguiahe:
                            updghe = detGuiaHerramienta.objects.get(id=x['idtabdetghe'])
                            updghe.cantdev=x['cantupddetghe']
                            updghe.save()

                        for x in linventhe:
                            updinv=InventarioHerra.objects.get(id=x['idtabinventario'])
                            updinv.cantalmacen=x['cantupdinv']
                            updinv.save()

                        for x in ldetdocdev:
                            detDevHerramienta.objects.get(
                                id=x['idtable']).delete()

                        devolucionHerra.objects.get(
                            docdev_id=request.POST.get('coddocdev')).delete()


                        context['status']=True



                    if 'upddelguia' in request.POST:
                        listinvent=json.loads(request.POST.get('listinvent'))
                        listdetguiahe=json.loads(request.POST.get('listdetguiahe'))

                        for x in listdetguiahe:
                            detGuiaHerramienta.objects.get(
                                id=x['idtabdetghe']).delete()

                        for x in listinvent:
                            updinv= InventarioHerra.objects.get(
                                id=x['idtabinventhe'])
                            updinv.cantalmacen=x['cantalmacentotal']
                            updinv.save()

                        GuiaHerramienta.objects.get(
                            guia_id=request.POST.get('codguiahe')).delete()

                        context['status']=True

                    if 'updcreategdev' in request.POST:
                        linv=json.loads(request.POST.get('linv'))
                        ldetghe=json.loads(request.POST.get('ldetghe'))
                        cguia=genkeys.GenerateIdGuiaHerra('001')
                        tipocod=request.POST.get('tipocod')

                        if tipocod=='auto':
                            numguia=cguia
                        else:
                            numguia=request.POST.get('numguiatot')

                        devolucionHerra.objects.create(
                            docdev_id=numguia,
                            fechretorno=request.POST.get('fretorno'),
                            estado=request.POST.get('estado'),
                            empdni_id=request.user.get_profile().empdni_id,
                            condni_id=request.POST.get('codcond'),
                            nropla_id=request.POST.get('codplaca'),
                            traruc_id=request.POST.get('transp')
                            )

                        for x in linv:
                            updinv=InventarioHerra.objects.get(
                                id=x['idtabinventhe'])
                            updinv.cantalmacen=x['cantupdinv']
                            updinv.save()

                        for x in ldetghe:
                            upddetghe=detGuiaHerramienta.objects.get(
                                id=x['idtabdetghe'])
                            upddetghe.cantdev=x['cantupddetghe']
                            upddetghe.save()

                            upddetdevhe=detDevHerramienta.objects.create(
                                guia_id=request.POST.get('codguia'),
                                docdev_id=numguia,
                                herramienta_id=x['codherra'],
                                brand_id=x['codbr'],
                                cantidad=x['inputcant'],
                                estado=x['estado'],
                                comentario=x['comenthe'])

                        context['status']=True

                    if 'updeddocdev' in request.POST:

                        upddetdevhe=detDevHerramienta.objects.get(
                            docdev_id=request.POST.get('coddocdev'),
                            herramienta_id=request.POST.get('codherra'))
                        upddetdevhe.cantidad=request.POST.get('updcant')
                        upddetdevhe.estado=request.POST.get('estadohe')
                        upddetdevhe.save()

                        upddetghe=detGuiaHerramienta.objects.get(
                            id=request.POST.get('idtabdetghe'))
                        upddetghe.cantdev=request.POST.get('cantupddetghe')
                        upddetghe.save()

                        updcantinvhe=InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('codherra'))
                        updcantinvhe.cantalmacen=request.POST.get('cantupdinv')
                        updcantinvhe.save()

                        context['status']=True

                    if 'ex_guiadev' in request.POST:
                        try:
                            devolucionHerra.objects.get(
                                docdev_id = request.POST.get('numguiatot'))
                            context['estado'] = True
                            context['status'] = True
                        except devolucionHerra.DoesNotExist, e:
                            try:
                                GuiaHerramienta.objects.get(
                                    guia_id=request.POST.get('numguiatot'))
                                context['estado'] = False
                                context['status']=True
                            except GuiaHerramienta.DoesNotExist, e:
                                context['status'] = False


                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

datenow=globalVariable.date_now('datetime')
class Inventario(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if 'exportinv' in request.GET:
            tipoacce=request.GET.get('tipoacce')
            if tipoacce=="TL":
                lbltipoacce="HERRAMIENTA"
            else:
                lbltipoacce="EPPS"
            print 'tipoacce',datenow, tipoacce
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="list_"'+lbltipoacce+'".csv"'
            writer = csv.writer(response)
            writer.writerow(['INVENTARIO DE '+lbltipoacce,str(datenow)])
            writer.writerow(['ITEM','CODIGO',lbltipoacce,'MARCA','UNIDAD','MEDIDA','CANTIDAD','MONEDA','PRECIO'])
            data=[]
            cont=1
            for x in InventarioHerra.objects.filter(
                herramienta__tipo=tipoacce,
                flag=True).order_by("herramienta__matnom"):
                data.append({
                    'codherra':x.herramienta_id,
                    'namehe':x.herramienta.matnom,
                    'brandhe':x.marca.brand,
                    'stock':x.cantalmacen,
                    'count':cont,
                    'unidad':x.herramienta.unidad.uninom,
                    'medida':x.herramienta.matmed,
                    'moneda':x.moneda.moneda,
                    'price':x.price
                    })
                cont = cont+1
            for x in data:
                writer.writerow([
                    x['count'],
                    x['codherra'],
                    x['namehe'].encode("utf-8"),
                    x['brandhe'].encode("utf-8"),
                    x['unidad'].encode("utf-8"),
                    x['medida'].encode("utf-8"),
                    x['stock'],
                    x['moneda'],
                    x['price']
                    ])
            return response

        if request.is_ajax():
            try:
                if 'viewstock' in request.GET:
                    context = InventarioHerra.objects.values(
                        'cantalmacen',
                        'herramienta__materiales_id',
                        'herramienta__matnom',
                        'herramienta__matmed',
                        'marca__brand',
                        'marca__brand_id',
                        'herramienta__unidad__unidad_id',
                        'herramienta__unidad__uninom'
                        ).get(herramienta_id=request.GET.get('herra'))

                    context['status'] = True

                if 'getinvent' in request.GET:
                    areaemple=request.user.get_profile().empdni.charge.area
                    linvent=[]
                    tipolist=request.GET.get('tipolist')
                    print 'tipolist', tipolist
                    if tipolist=='all':
                        print 'alll'
                        for x in InventarioHerra.objects.filter(
                            herramienta__tipo=request.GET.get('tipoacce'),
                            flag=True).order_by('herramienta__matnom'):
                            linvent.append({
                                'codherra':x.herramienta.materiales_id,
                                'nameherra':x.herramienta.matnom,
                                'medherra':x.herramienta.matmed,
                                'codbr':x.marca.brand_id,
                                'lastprice':x.price,
                                'areaemple':True if areaemple=="ADMINISTRATOR" else False,
                                'unid':x.herramienta.unidad.uninom,
                                'brand':x.marca.brand,
                                'cantalmacen':x.cantalmacen
                                })
                        context['linvent']=linvent[:50]
                    else:
                        for x in InventarioHerra.objects.filter(
                            Q(herramienta_id=request.GET.get('texto')) |
                            Q(herramienta__matnom__icontains=request.GET.get('texto')),
                            herramienta__tipo=request.GET.get('tipoacce'),
                            flag=True).order_by('herramienta__matnom'):
                            linvent.append({
                                'codherra':x.herramienta.materiales_id,
                                'nameherra':x.herramienta.matnom,
                                'medherra':x.herramienta.matmed,
                                'codbr':x.marca.brand_id,
                                'lastprice':x.price,
                                'areaemple':areaemple,
                                'unid':x.herramienta.unidad.uninom,
                                'brand':x.marca.brand,
                                'cantalmacen':x.cantalmacen,
                                })
                        context['linvent']=linvent

                    context['status']=True
            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)

        linvent = InventarioHerra.objects.all().order_by('herramienta__matnom')
        ltipmoned = Moneda.objects.filter(flag=True).order_by('moneda')
        lbrandhe = Brand.objects.filter(flag = True).order_by('brand')
        lunidadhe = Unidade.objects.filter(flag = True).order_by('uninom')
        getmoned = Configuracion.objects.get(periodo=datenow.year)
        return render(request,'almacen/inventario.html',{
            'linvent':linvent,
            'ltipmoned':ltipmoned,
            'lbrandhe':lbrandhe,
            'lunidadhe':lunidadhe,
            'getmoned':getmoned.moneda.moneda
            })
    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:

                    if 'editstock' in request.POST:
                        updt = InventarioHerra.objects.get(
                            herramienta_id=request.POST.get('codherra'),
                            marca_id=request.POST.get('codbr')
                            )
                        updt.moneda_id=request.POST.get('tipmoneda')
                        updt.price=request.POST.get('lastprice')
                        updt.cantalmacen = request.POST.get('canti')
                        updt.save()

                        context['status'] = True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()


class Devolucion(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:

                if 'lherradoc' in request.GET:
                    arrherradoc = []
                    for x in detDevHerramienta.objects.filter(
                        docdev_id=request.GET.get('numerodoc'),
                        flag = True).order_by('herramienta__matnom'):
                        arrherradoc.append(
                            {'he_id': x.herramienta_id,
                            'he_name': x.herramienta.matnom,
                            'he_medida': x.herramienta.matmed,
                            'coguia':x.guia.guia_id,
                            'docdev':x.docdev.docdev_id,
                            'he_marca':x.brand.brand,
                            'he_cant':x.cantidad,
                            'he_est': x.estado,
                            'he_coment':x.comentario})
                    context['lherradoc']= arrherradoc
                    context['status'] = True

                if 'listgcomp' in request.GET:
                    lgcomp=[]
                    for x in GuiaHerramienta.objects.filter(
                        tipo=request.GET.get('tipoacce'),
                        estado='DEVCOMP'):
                        lgcomp.append({
                            'codproy':x.proyecto_id,
                            'nameproy':x.proyecto.nompro,
                            'codguia':x.guia_id,
                            'fsalida':x.fechsalida,
                            'lastnamesup':x.proyecto.empdni.lastname,
                            'firstnamesup':x.proyecto.empdni.firstname
                            })
                    context['lgcomp']=lgcomp
                    context['status']=True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)

        lguiacomp = GuiaHerramienta.objects.filter(estado='DEVCOMP').order_by('guia_id')
        kwargs['lguiaco'] = lguiacomp
        kwargs['hreport'] = SettingsApp.objects.get(flag=True).serverreport
        kwargs['ruc'] = request.session['company']['ruc']
        return render(request, 'almacen/devolucion.html', kwargs)


class Consulta(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if 'exporthexproy' in request.GET:
            data=[]
            cproy=request.GET.get('codproy')
            tipoacce=request.GET.get('tipoacce')
            lbltipoacce=request.GET.get('lbltipoacce')
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="list_'+lbltipoacce+'_'+cproy+'.csv" '
            writer = csv.writer(response)
            writer.writerow(['ITEM','GUIA','CODIGO',lbltipoacce, 'MEDIDA','MARCA','UNIDAD','CANTIDAD'])

            cont = 1
            for x in detGuiaHerramienta.objects.filter(
                guia__proyecto_id=cproy,
                guia__tipo=tipoacce,
                guia__estado = 'GE').order_by('herramienta__matnom'):
                data.append({
                    'codherra':x.herramienta_id,
                    'codguia':x.guia_id,
                    'namehe':x.herramienta.matnom,
                    'brand':x.brand.brand,
                    'medmat':x.herramienta.matmed,
                    'count':cont,
                    'unidad':x.herramienta.unidad.unidad_id,
                    'cantidad':x.cantidad
                    })
                cont= cont + 1

            y = 0
            for x in data:
                writer.writerow([
                    x['count'],
                    x['codguia'],
                    x['codherra'],
                    x['namehe'].encode("utf-8"),
                    x['medmat'].encode("utf-8"),
                    x['brand'],
                    x['unidad'],
                    x['cantidad']
                    ])
            return response


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
                            'nameherra': x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'conta':count,
                            'marcahe':x.brand.brand,
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
                    for x in detGuiaHerramienta.objects.filter(
                        herramienta_id=request.GET.get('codigoherra'),
                        guia__estado = 'GE'):
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
                    for x in detGuiaHerramienta.objects.filter(
                        guia__proyecto_id=request.GET.get('codigoproy'),
                        guia__tipo=request.GET.get('tipoacce'),
                        guia__estado = 'GE').order_by('herramienta__matnom'):

                        lisherra.append(
                            {'nombreherra':x.herramienta.matnom,
                            'herraid':x.herramienta_id,
                            'guia_cod':x.guia_id,
                            'brand':x.brand.brand,
                            'unidad':x.herramienta.unidad.uninom,
                            'medidaherra':x.herramienta.matmed,
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
                    for x in detGuiaHerramienta.objects.filter(
                        herramienta__matnom__icontains=request.GET.get('textoing'),
                        guia__tipo=request.GET.get('tipoacce'),
                        guia__estado = 'GE').distinct(
                        'herramienta__matnom','herramienta__matmed'):
                        lishe.append(
                            {'codh':x.herramienta_id,
                            'name':x.herramienta.matnom,
                            'medida':x.herramienta.matmed,
                            'marcah':x.brand.brand,
                            'count':count
                            })
                        count = count + 1;
                    context['namehe'] = lishe

                    if len(lishe) > 0 :
                        context['namehesize'] = True
                    else:
                        context['namehesize'] = False

                    context['status'] = True

                if 'lproyconsult' in request.GET:
                    lprocons=[]
                    for x in GuiaHerramienta.objects.filter(
                        tipo=request.GET.get('tipoacce'),
                        estado='GE').distinct('proyecto__proyecto_id').order_by('proyecto__proyecto_id'):
                        lprocons.append({
                            'codproy':x.proyecto.proyecto_id,
                            'nameproy':x.proyecto.nompro
                            })
                    context['lprocons']=lprocons
                    context['status']=True


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
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'lherraalmacen' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(
                        guia__tipo=request.GET.get('tipoacce'),
                        estado=request.GET.get('estmat'),
                        guia__estado = 'GE').distinct(
                            'herramienta__matnom',
                            'herramienta__matmed').order_by('herramienta__matmed'):
                        lestalmacen.append(
                            {'codherra':x.herramienta_id,
                            'nameherra':x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'codmarcherra':x.brand.brand_id,
                            'marcherra':x.brand.brand,
                            'count':count}
                            )
                        count = count + 1;
                    context['lestalmacen'] = lestalmacen
                    context['status'] = True

                if 'lhereparacion' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detDevHerramienta.objects.filter(
                        guia__tipo=request.GET.get('tipoacce'),
                        estado=request.GET.get('estmat'),
                        docdev__estado = 'GE').distinct('herramienta__matnom','herramienta__matmed').order_by('herramienta__matmed'):
                        lestalmacen.append(
                            {'codherra':x.herramienta_id,
                            'nameherra':x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'codmarcherra':x.brand.brand_id,
                            'marcherra':x.brand.brand,
                            'count':count}
                            )
                        count = count + 1;
                    context['lestalmacen'] = lestalmacen
                    context['status'] = True

                if 'ldetalmacen' in request.GET:
                    lestalmacen = []
                    count = 1;
                    for x in detGuiaHerramienta.objects.filter(
                        herramienta_id=request.GET.get('codhe'),
                        estado=request.GET.get('idestado'),
                        guia__estado = 'GE').order_by('herramienta__matnom'):
                        dayf = ''
                        if x.fechdevolucion != None:
                            day = x.fechdevolucion - x.guia.fechsalida
                            dayf = day.days

                        lestalmacen.append(
                            {'fechsalida':x.guia.fechsalida,
                            'fechdev':x.fechdevolucion,
                            'codproy':x.guia.proyecto.proyecto_id,
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
                    for x in detDevHerramienta.objects.filter(
                        herramienta_id=request.GET.get('codhe'),
                        estado=request.GET.get('idestado'),
                        docdev__estado = 'GE').order_by('herramienta__matnom'):
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


class Trasladohe(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'getltrproyectos' in request.GET:
                    ltrproyectos=[]
                    for x in GuiaHerramienta.objects.filter(
                        estado='GE').distinct('proyecto__proyecto_id').order_by('-proyecto__proyecto_id'):
                        ltrproyectos.append({
                            'codproy':x.proyecto.proyecto_id,
                            'nameproy':x.proyecto.nompro,
                            'fsalida':x.fechsalida
                            })

                    context['ltrproyectos']=ltrproyectos
                    context['status']=True

                if 'getltrherraxcod' in request.GET:
                    ltrherra=[]
                    conta=0
                    for x in detGuiaHerramienta.objects.filter(
                        herramienta_id=request.GET.get('txtcodherra'),
                        guia__estado='GE',
                        flagdev=False).order_by('herramienta__matnom'):
                        ltrherra.append({
                            'codguia':x.guia_id,
                            'codherra':x.herramienta.materiales_id,
                            'nameherra':x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'codbrand':x.brand.brand_id,
                            'brandherra':x.brand.brand,
                            'unidherra':x.herramienta.unidad.uninom,
                            'cantidad':x.cantidad,
                            'cantdev':x.cantdev,
                            'conta':conta,
                            'estadohe':x.estado,
                            'codproy':x.guia.proyecto.proyecto_id,
                            'nameproy':x.guia.proyecto.nompro
                            })
                        conta=conta+1
                    context['ltrherra']=ltrherra
                    context['status']=True

                if 'getltrherraxdes' in request.GET:
                    ltrherrades=[]
                    for x in detGuiaHerramienta.objects.filter(
                        herramienta__matnom__icontains=request.GET.get('txtdesherra'),
                        herramienta__tipo=request.GET.get('tipoacce'),
                        guia__estado='GE',
                        flagdev=False).distinct('herramienta__materiales_id').order_by('herramienta__materiales_id'):
                        ltrherrades.append({
                            'codherra':x.herramienta.materiales_id,
                            'nameherra':x.herramienta.matnom,
                            'medherra':x.herramienta.matmed,
                            'codbrand':x.brand.brand_id,
                            'brandherra':x.brand.brand,
                            'unidherra':x.herramienta.unidad.uninom,
                            })
                    context['ltrherrades']=ltrherrades
                    context['status']=True

                if 'listconductor' in request.GET:
                    lcond = []
                    for x in Conductore.objects.filter(
                        traruc_id = request.GET.get('codtransp')).order_by('connom'):
                        lcond.append({
                            'cod_cond': x.condni_id,
                            'name_cond':x.connom
                            })
                    context['lcond'] = lcond
                    context['status'] = True

                    ltransp = []
                    for y in Transporte.objects.filter(
                        traruc_id = request.GET.get('codtransp')):
                        ltransp.append({
                            'placa': y.nropla_id,
                            'marca': y.marca
                            })
                    context['ltransp'] = ltransp
                    context['status'] = True

                if 'getltrdetghe' in request.GET:
                    dettraslado=json.loads(request.GET.get('dettraslado'))
                    ltrdghe=[]
                    for y in dettraslado:
                        for x in detGuiaHerramienta.objects.filter(
                            guia_id=y['codguia'],
                            herramienta_id=y['codherra']):
                            ltrdghe.append({
                                'idtabdetghe':x.id,
                                'codguia':x.guia_id,
                                'codherra':x.herramienta_id,
                                'cantdev':x.cantdev,
                                'inputcant':y['cantidad'],
                                'cantupd':float(x.cantdev)+float(y['cantidad'])
                                })
                    context['ltrdghe']=ltrdghe
                    context['status']=True


            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        kwargs['trlempautor']=Employee.objects.filter(flag=True).order_by('lastname')
        kwargs['ltransport'] = Transportista.objects.filter(flag=True).order_by('tranom')
        kwargs['trlproyecto'] = Proyecto.objects.filter(status='AC').order_by('-registrado')
        kwargs['hreport'] = SettingsApp.objects.get(flag=True).serverreport
        kwargs['ruc'] = request.session['company']['ruc']
        return render(request, 'almacen/trasladohe.html', kwargs)

    def post(self,request,*args,**kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'savetraslado' in request.POST:
                        codauto=request.POST.get('codauto')
                        codigo=''
                        if codauto=='true':
                            codigo=genkeys.GenerateIdGuiaHerra('001')
                        else:
                            codigo=request.POST.get('numguiatr')

                        sumdettras=json.loads(request.POST.get('sumdettras'))
                        ltrdghe=json.loads(request.POST.get('ltrdghe'))

                        GuiaHerramienta.objects.create(
                            guia_id=codigo,
                            proyecto_id=request.POST.get('codproydest'),
                            fechsalida=request.POST.get('ftraslado'),
                            empdni_id=request.user.get_profile().empdni_id,
                            condni_id=request.POST.get('cond'),
                            nropla_id=request.POST.get('placa'),
                            traruc_id=request.POST.get('transp'),
                            estado='PE',
                            tipo=request.POST.get('tipoacce'),
                            comentario=request.POST.get('comentario'),
                            motivo='TR')

                        for x in sumdettras:
                            detGuiaHerramienta.objects.create(
                                guia_id=codigo,
                                herramienta_id=x['codherra'],
                                brand_id=x['codbr'],
                                estado=x['estadohe'],
                                fechdevolucion=None if x['fdev']=="" else x['fdev'],
                                cantidad=x['cantidad'],
                                comentario=x['comenthe'],
                                cantinicial=x['cantidad'],
                                grupo='')

                        for y in ltrdghe:
                            upd=detGuiaHerramienta.objects.get(
                                id=y['idtabdetghe'])
                            upd.cantdev=y['cantupd']
                            upd.save()
                        context['status']=True

                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

class NotaIngreso(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        context = dict();
        if request.is_ajax():
            try:
                if 'lordcompra' in request.GET:
                    listcomp=[]
                    for x in Compra.objects.filter(
                        Q(status='PE') | Q(status='IN'),
                        tipoing=request.GET.get('tipoacce'),
                        compra_id__icontains=request.GET.get('texting'),
                        flag=True).order_by('-registrado')[:50]:
                        listcomp.append({
                            'codorden':x.compra_id,
                            'rucprov':x.proveedor.proveedor_id,
                            'proveedor':x.proveedor.razonsocial,
                            'projects':x.projects,
                            'documento':x.documento.documento,
                            'pago':x.pagos.pagos,
                            'ftraslado':x.traslado,
                            'contacto':x.contacto
                            })

                    context['listcomp']=listcomp
                    context['status']=True

                if 'lnoting' in request.GET:
                    listingr=[]
                    for x in NotaIngresoHe.objects.filter(
                        compra__tipoing=request.GET.get('tipoacce'),
                        ingresohe_id__icontains=request.GET.get('texting'),
                        flag=True).order_by('-register')[:50]:
                        listingr.append({
                            'codnoting':x.ingresohe_id,
                            'codalmacen':x.almacen_id,
                            'almacen':x.almacen.nombre,
                            'codcompra':x.compra_id,
                            'nguia':x.guia,
                            'factura':x.factura,
                            'motivo':x.motivo,
                            'dnirecib':x.recibido_id,
                            'dniinspecc':x.inspeccionado_id,
                            'dniaprob':x.aprobado_id,
                            'coment':x.comentario,
                            'estado':x.estado
                            })
                    context['listingr']=listingr
                    context['status']=True

                if 'ldetcompra' in request.GET:
                    ldetcomp=[]
                    conta=0
                    for x in DetCompra.objects.filter(
                        Q(flag='0')|Q(flag='1'),
                        compra_id=request.GET.get('codcompra')
                        ).order_by('materiales__matnom'):
                        uni = x.unit_id
                        ldetcomp.append({
                            'idtabdetcompra':x.id,
                            'codmat':x.materiales.materiales_id,
                            'namemat':x.materiales.matnom,
                            'medmat':x.materiales.matmed,
                            'uninomhe':x.materiales.unidad.uninom,
                            'unidad':x.materiales.unidad.uninom if uni==None else x.unit.uninom,
                            'sameunit':True if uni==None else False,
                            'printrow':False if uni==None else True,
                            'codbrand':x.brand_id,
                            'brand':x.brand.brand,
                            'conta':conta,
                            'cantpend':x.cantidad,
                            'cantidad':x.cantstatic
                            })
                        conta=conta+1
                    print 'ldetcomp',ldetcomp
                    context['ldetcomp']=ldetcomp
                    context['status']=True

                if 'ldetnoting' in request.GET:
                    listdeting=[]
                    for x in DetIngresoHe.objects.filter(
                        ingresohe_id=request.GET.get('codnoting')):
                        listdeting.append({
                            'idtabdeting':x.id,
                            'codhe':x.herramienta_id,
                            'codcompra':x.ingresohe.compra_id,
                            'namehe':x.herramienta.matnom,
                            'medhe':x.herramienta.matmed,
                            'unidad':x.herramienta.unidad.uninom,
                            'codbr':x.marca.brand_id,
                            'brand':x.marca.brand,
                            'cantidad':x.cantidad
                            })
                    context['listdeting']=listdeting
                    context['status']=True

            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        kwargs['lalmaceneros']=Employee.objects.filter(charge__area='Almacen',flag=True)
        kwargs['lalmacen']=Almacene.objects.filter(flag=True)
        kwargs['hreport'] = SettingsApp.objects.get(flag=True).serverreport
        kwargs['ruc'] = request.session['company']['ruc']
        return render(request, 'almacen/notaingreso.html', kwargs)

    def post(self,request,*args,**kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'savenoting' in request.POST:
                        ldetingreso=json.loads(request.POST.get('ldetingreso'))


                        codnoting=genkeys.GenerateIdNotaIngresoHe()
                        NotaIngresoHe.objects.create(
                            ingresohe_id=codnoting,
                            almacen_id=request.POST.get('almacen'),
                            compra_id=request.POST.get('ncompra'),
                            guia=request.POST.get('cguia'),
                            factura=request.POST.get('nfactura'),
                            motivo=request.POST.get('motingreso'),
                            recibido_id=request.POST.get('recib'),
                            inspeccionado_id=request.POST.get('inspecc'),
                            aprobado_id=request.POST.get('aprob'),
                            comentario=request.POST.get('coment'),
                            registro_id=request.user.get_profile().empdni_id)

                        for x in ldetingreso:
                            DetIngresoHe.objects.create(
                                ingresohe_id=codnoting,
                                herramienta_id=x['codmat'],
                                cantidad=x['inpcanttotal'],
                                marca_id=x['codbr'],
                                convertto=x['convertto'])
                        context['status']=True

                    if 'anulnoting' in request.POST:

                        updnot=NotaIngresoHe.objects.get(
                            ingresohe_id=request.POST.get('codnoting'))
                        updnot.estado='AN'
                        updnot.flag=False
                        updnot.save()

                        context['status']=True


                except Exception, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
        except Exception, e:
            print e.__str__()

url = settings.PATH_PROJECT
class Cargar(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
        if 'descformat' in request.GET:
            file_path = '{}/formats/{}'.format(settings.STATIC_ROOT, "FI_HERRAMIENTAS_Y_EPPS.xls")
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type='application/vnd.ms-excel;charset=utf-16')
                response['Content-Disposition'] = 'inline; filename=FI_HERRAMIENTAS_Y_EPPS.xls'
            return response

        return render(request,'almacen/cargarherra.html')

    def post(self,request,*args,**kwargs):
        lherram = []
        arch= request.FILES['files[]']
        filename= uploadFiles.upload('/storage/',arch)
        book= open_workbook(filename,encoding_override='utf-8')
        sheet= book.sheet_by_index(0)
        lmat = []
        stockfinal = ''
        tipo = sheet.cell(2,0).value
        tipoacce=''
        if tipo=="":
            return HttpResponse("INGRESAR TIPO DE INGRESO(HERRAMIENTA O EPPS)")
            return False
        else:
            if tipo=="TL":
                tipoacce="HERRAMIENTAS"
            else:
                tipoacce="EPPS"

            for m in range(3, sheet.nrows):
                print 'm',m
                hname = sheet.cell(m, 1).value
                hmarca = sheet.cell(m, 2).value
                hmedida = sheet.cell(m, 3).value
                hunid = sheet.cell(m, 4).value
                hstock = sheet.cell(m, 5).value
                moneda = sheet.cell(m, 6).value
                precio = sheet.cell(m, 7).value
                tvida = sheet.cell(m, 8).value

                if hstock == '' or hstock == '-':
                    hstock = 0

                if precio == '' or hstock == '-':
                    precio = 0
                if moneda != 'CU02':
                    moneda = 'CU01'


                try:
                    if hmarca == '' or hmarca == '-':
                        hmarca = 'S/M'
                    br = Brand.objects.get(brand = hmarca)
                except Brand.DoesNotExist, e:
                    br = Brand(brand_id = genkeys.GenerateIdBrand(), brand = hmarca)
                    br.save()

                try:
                    un = Unidade.objects.get(uninom = hunid)
                except Unidade.DoesNotExist, e:
                    un = Unidade(unidad_id = hunid,uninom = hunid)
                    un.save()

                if hmedida == '' or hmedida == '-':
                    hmedida = "ESTANDAR"

                if tipo=="TL":
                    codhe = genkeys.GenerateIdHerra()
                else:
                    codhe = genkeys.GenerateIdEpps()

                h = Materiale(
                    materiales_id = codhe,
                    matnom = hname,
                    matmed = hmedida,
                    unidad_id = un.unidad_id,
                    matacb='Natural',
                    matare='0',
                    tipo=tipo)
                h.save()

                inv = InventarioHerra(
                    herramienta_id = codhe,
                    marca_id = br.brand_id,
                    moneda_id = moneda,
                    price = precio,
                    tvida = tvida,
                    cantalmacen = hstock)
                inv.save()
            return render(request, url+'/templates/almacen/form/resultherra.html',{'tipoacce':tipoacce})


# class DevConGuia(JSONResponseMixin, TemplateView):
#     @method_decorator(login_required)
#     def get(self,request,*args,**kwargs):
#         context = dict();
#         if request.is_ajax():
#             try:

#                 if 'viewcant' in request.GET:
#                     context = DetGuiaRemision.objects.values(
#                         'cantguide',
#                         'cantdev'
#                         ).get(
#                         guia_id=request.GET.get('numguia'),
#                         order_id=request.GET.get('codped'),
#                         materiales_id=request.GET.get('codmat'),
#                         brand_id=request.GET.get('codbrand'),
#                         model_id=request.GET.get('codmodel'))
#                     if len(context) > 0:
#                         context['status'] = True
#                     context['status'] = True


#                 if 'lmatguiadev' in request.GET:
#                     lmat = []
#                     count = 1
#                     for x in detGuiaDevMat.objects.filter(
#                         guiadevmat_id = request.GET.get('codgdevmat')).order_by('material__matnom'):
#                         lmat.append({
#                             'id': x.id,
#                             'numguia':x.guia_id,
#                             'guiadevmat':x.guiadevmat_id,
#                             'count':count,
#                             'codped':x.pedido_id,
#                             'codmat':x.material_id,
#                             'nommat':x.material.matnom,
#                             'medmat':x.material.matmed,
#                             'codmarca':x.marca_id,
#                             'nommarca':x.marca.brand,
#                             'codmodel': x.model_id,
#                             'nommodel': x.model.model,
#                             'cantidad':x.cantidad,
#                             'coment':x.comentario,
#                             'motiv':x.motivo
#                             })

#                         count = count +1
#                     context['lmat'] = lmat

#                     context['status'] = True

#                 if 'listmaterials' in request.GET:
#                     lmat = []
#                     count = 1
#                     countcod = 0
#                     for x in DetGuiaRemision.objects.filter(
#                         guia_id=request.GET.get('txtingresado'),
#                         stcantdev=False,
#                         order__flag=True,
#                         guia__status='GE',
#                         flag=True,
#                         guia__flag = True
#                         ).order_by('materiales__matnom'):
#                         lmat.append(
#                             {'numguia':x.guia_id,
#                             'codmat':x.materiales_id,
#                             'namemat':x.materiales.matnom,
#                             'medmat':x.materiales.matmed,
#                             'codbrand':x.brand_id,
#                             'namebrand':x.brand.brand,
#                             'codmodel':x.model_id,
#                             'namemodel':x.model.model,
#                             'cantguide':x.cantguide,
#                             'count':count,
#                             'cantdev':x.cantdev,
#                             'codped':x.order_id,
#                             'countcod':countcod,
#                             'codproy':x.order.proyecto_id,
#                             'coddsector':x.order.dsector_id
#                             })
#                         count = count + 1
#                         countcod = countcod + 1
#                     context['lmaterials'] = lmat

#                     if len(lmat) > 0 :
#                         context['listmat'] = True
#                     else:
#                         context['listmat'] = False
#                     context['sizelistmat'] = len(lmat)

#                     context['status'] = True

#                 if 'getlnip' in request.GET:
#                     listnip = []
#                     countcod = 0
#                     for x in NipleGuiaRemision.objects.filter(
#                         order_id = request.GET.get('codped'),
#                         materiales_id = request.GET.get('codmat'),
#                         brand_id = request.GET.get('codbr'),
#                         model_id = request.GET.get('codmod'),
#                         flag = True,
#                         flagcenvdevmat=False).order_by('materiales__matnom'):
#                         listnip.append({
#                             'idtabnipgrem':x.id,
#                             'codped':x.order_id,
#                             'codmat':x.materiales_id,
#                             'namemat':x.materiales.matnom,
#                             'medmat':x.materiales.matmed,
#                             'codbr':x.brand_id,
#                             'namebran':x.brand.brand,
#                             'codmod':x.model_id,
#                             'namemod':x.model.model,
#                             'cantidad':x.cantguide,
#                             'metrado':x.metrado,
#                             'num':request.GET.get('num'),
#                             'row':countcod,
#                             'numguia':request.GET.get('numguia'),
#                             'motinip':request.GET.get('motinip'),
#                             'comnip':request.GET.get('comnip'),
#                             'cenvmat':x.cenvdevmat,
#                             'countcod':countcod,
#                             'tipo':x.tipo,
#                             'canti':x.cantguide
#                             })
#                         countcod = countcod + 1

#                     context['listnip'] = listnip
#                     print len(listnip)
#                     if len(listnip) > 0:
#                         context['stlistnip'] = True
#                     else:
#                         context['stlistnip'] = False
#                     context['status'] = True

#                 if 'existsnip' in request.GET:
#                     lstniple=[]
#                     lmat = json.loads(request.GET.get('lmat'))
#                     for y in lmat:
#                         lnip=[]
#                         for x in NipleGuiaRemision.objects.filter(
#                             order_id = y['codped'],
#                             materiales_id = y['codmat'],
#                             brand_id = y['codbrand'],
#                             model_id = y['codmodel'],
#                             flag=True):
#                             lnip.append({
#                                 'id':x.id
#                                 })
#                         if len(lnip)>0:
#                             estado = True
#                         else:
#                             estado = False
#                         lstniple.append({
#                             'estado': estado
#                             })
#                     context['lstniple'] = lstniple
#                     context['status'] = True

#                 if 'existguiape' in request.GET:
#                     lgdev=[]
#                     for x in detGuiaDevMat.objects.filter(
#                         guia_id=request.GET.get('codguia'),
#                         guiadevmat__estado='PE'):
#                         lgdev.append({
#                             'coddevmat':x.guiadevmat_id
#                             })
#                     if len(lgdev) > 0:
#                         context['stlgdev'] = True
#                     else:
#                         context['stlgdev'] = False

#                     context['status'] = True

#                 if 'getlistnip' in request.GET:
#                     listmat = json.loads(request.GET.get('listmat'))
#                     lstmat=[]
#                     for x in listmat:
#                         lmaterials = []
#                         for y in GuiaDevMatNiple.objects.filter(
#                             guiadevmat_id=x['guiadevmat'],
#                             material_id=x['codmat'],
#                             marca_id=x['codmarca'],
#                             model_id=x['codmodel']
#                             ):
#                             lmaterials.append({
#                                 'id':y.id
#                                 })
#                         if len(lmaterials)==0:
#                             estado=False
#                         else:
#                             estado=True
#                         lstmat.append({
#                             'estado':estado
#                             })
#                     context['lestados']=lstmat
#                     context['status']=True

#                 if 'getniple' in request.GET:
#                     lni=[]
#                     for x in GuiaDevMatNiple.objects.filter(
#                         guiadevmat_id=request.GET.get('idgdevmat'),
#                         material_id=request.GET.get('idmat'),
#                         pedido_id=request.GET.get('codped'),
#                         marca_id=request.GET.get('idbr'),
#                         model_id=request.GET.get('idmod')
#                         ):
#                         lni.append({
#                             'id':x.id
#                             })
#                     if len(lni) > 0:
#                         context['stlni'] = True
#                     else:
#                         context['stlni'] = False
#                     context['status']=True

#                 if 'glnipdevmat' in request.GET:
#                     lnipdev=[]
#                     for x in GuiaDevMatNiple.objects.filter(
#                         guiadevmat_id=request.GET.get('codgdevmat'),
#                         material_id=request.GET.get('codmat'),
#                         pedido_id=request.GET.get('codped'),
#                         marca_id=request.GET.get('codbr'),
#                         model_id=request.GET.get('codmod')):
#                         lnipdev.append({
#                             'idtable':x.id,
#                             'codguiadevmat':x.guiadevmat_id,
#                             'codmat':x.material_id,
#                             'namemat':x.material.matnom,
#                             'medmat':x.material.matmed,
#                             'codbr':x.marca_id,
#                             'codmod':x.model_id,
#                             'cantidad':x.cantidad,
#                             'metrado':x.metrado,
#                             'tipo':x.tipo,
#                             'idrefid':x.idnipgrem_id,
#                             'motivo':x.motivo,
#                             'comentario':x.comentario
#                             })
#                     context['lnipdev']=lnipdev
#                     context['status']=True

#                 if 'getcantnip' in request.GET:
#                     print request.GET.get('codtabnip')
#                     context = NipleGuiaRemision.objects.values(
#                                 'cenvdevmat',
#                                 'cantguide'
#                                 ).get(id=request.GET.get('codtabnip'))

#                     context['status'] =True

#                 if 'getcantdevmat' in request.GET:
#                     context=detGuiaDevMat.objects.values(
#                             'cantidad').get(
#                             guiadevmat_id=request.GET.get('codgdevmat'),
#                             material_id=request.GET.get('codmat'),
#                             marca_id=request.GET.get('codbr'),
#                             model_id=request.GET.get('codmod'))
#                     context['status']=True

#                 if 'getcantdetguiarem' in request.GET:

#                     lmat=json.loads(request.GET.get('lmat'))
#                     ldetgrem=[]
#                     ldetinven=[]
#                     ldetpedido=[]
#                     # ldetdsmetrado=[]
#                     for x in lmat:
#                         for y in DetGuiaRemision.objects.filter(
#                             guia_id=x['numguia'],
#                             order_id=x['codped'],
#                             materiales_id=x['codmat'],
#                             brand_id=x['codmarca'],
#                             model_id=x['codmodel']):
#                             ldetgrem.append({
#                                 'idtabdetgrem':y.id,
#                                 'numguia':y.guia_id,
#                                 'codmat':y.materiales_id,
#                                 'codbr':y.brand_id,
#                                 'codmod':y.model_id,
#                                 'cdevuelta':y.cantdev,
#                                 'updcantguide':round((float(y.cantguide)-float(x['cantidad']))*100)/100,
#                                 'updcantdev':round((float(x['cantidad'])+float(y.cantdev))*100)/100
#                                 })

#                         try:
#                             InventoryBrand.objects.get(
#                                 materials_id=x['codmat'],
#                                 brand_id=x['codmarca'],
#                                 model_id=x['codmodel'])
#                             codbrand=x['codmarca']
#                             codmodel=x['codmodel']

#                         except InventoryBrand.DoesNotExist, e:
#                             try:
#                                 InventoryBrand.objects.get(
#                                     materials_id=x['codmat'],
#                                     brand_id=x['codmarca'])
#                                 codbrand=x['codmarca']
#                                 codmodel='MO000'

#                             except InventoryBrand.DoesNotExist, e:
#                                 codbrand='BR000'
#                                 codmodel='MO000'

#                         for z in InventoryBrand.objects.filter(
#                             materials_id=x['codmat'],
#                             brand_id=codbrand,
#                             model_id=codmodel):
#                             ldetinven.append({
#                                 'idtabinvbrand':z.id,
#                                 'codmat':z.materials_id,
#                                 'codbr':z.brand_id,
#                                 'codmod':z.model_id,
#                                 'stock':z.stock,
#                                 'updstock':round((float(z.stock)+float(x['cantidad']))*100)/100
#                                 })
#                         try:
#                             Detpedido.objects.get(
#                                 pedido_id=x['codped'],
#                                 materiales_id=x['codmat'],
#                                 brand_id=x['codmarca'],
#                                 model_id=x['codmodel'])
#                             codbrand=x['codmarca']
#                             codmodel=x['codmodel']
#                             print 'existe'
#                         except Detpedido.DoesNotExist, e:
#                             try:
#                                 Detpedido.objects.get(
#                                     pedido_id=x['codped'],
#                                     materiales_id=x['codmat'],
#                                     brand_id=x['codmarca'])
#                                 codbrand=x['codmarca']
#                                 codmodel='MO000'
#                             except Detpedido.DoesNotExist, e:
#                                 codbrand='BR000'
#                                 codmodel='MO000'

#                         for n in Detpedido.objects.filter(
#                             pedido_id=x['codped'],
#                             materiales_id=x['codmat'],
#                             brand_id=codbrand,
#                             model_id=codmodel):
#                             ldetpedido.append({
#                                 'idtabdetped':n.id,
#                                 'cantstatic':n.cantidad,
#                                 'updcantshop':round((float(n.cantshop)+float(x['cantidad']))*100)/100,
#                                 'updcantguide':round((float(n.cantguide)-float(x['cantidad']))*100)/100,
#                                 'updcantenv':round((float(n.cenvdevmat)+float(x['cantidad']))*100)/100,
#                                 })

#                     context['ldetgrem']=ldetgrem
#                     context['ldetinven']=ldetinven
#                     context['ldetpedido']=ldetpedido

#                     context['status']=True

#                 if 'getdetgdevmatnip' in request.GET:
#                     lgdevmatnip=[]
#                     for x in GuiaDevMatNiple.objects.filter(
#                         guiadevmat_id=request.GET.get('ngdevmat')):
#                         lgdevmatnip.append({
#                             'idgdevmatniple':x.id,
#                             'codguiadevmat':x.guiadevmat_id,
#                             'codmat':x.material_id,
#                             'codbr':x.marca_id,
#                             'codmod':x.model_id,
#                             'cantidad':x.cantidad,
#                             'metrado':x.metrado,
#                             'tipo':x.tipo,
#                             'idtabnipgrem':x.idnipgrem_id,
#                             'idtabniple':x.idnipgrem.related
#                             })
#                     context['lgdevmatnip']=lgdevmatnip
#                     context['status']=True

#                 if 'sumcantnip' in request.GET:
#                     lgdevmatnip = json.loads(request.GET.get('lgdevmatnip'))
#                     # lgdev=[]
#                     lnip=[]
#                     lnippedido=[]
#                     for x in lgdevmatnip:
#                         for z in NipleGuiaRemision.objects.filter(
#                             id=x['idtabnipgrem']):
#                             lnip.append({
#                                 'idtabnipgrem':z.id,
#                                 'codmat':z.materiales_id,
#                                 'codbr':z.brand_id,
#                                 'codped':z.order_id,
#                                 'codmod':z.model_id,
#                                 'cant':z.cantguide,
#                                 'metrado':z.metrado,
#                                 'tipo':z.tipo,
#                                 'updcantguide':float(z.cantguide)-float(x['cantidad']),
#                                 'updcantenv':float(z.cenvdevmat)+float(x['cantidad'])
#                                 # 'updcantshop':float(z.cantshop)+float(x['cantidad']),
#                                 })
#                         for y in Niple.objects.filter(
#                             id=x['idtabniple']):
#                             lnippedido.append({
#                                 'idtabnipped':y.id,
#                                 'cantstatic':y.cantidad,
#                                 'codmat':y.materiales_id,
#                                 'codbr':y.brand_id,
#                                 'codmod':y.model_id,
#                                 'codped':y.pedido_id,
#                                 'metrado':y.metrado,
#                                 'tipo':y.tipo,
#                                 'updcantguide':float(y.cantguide)-float(x['cantidad']),
#                                 'updcantenv':float(y.cenvdevmat)+float(x['cantidad']),
#                                 'updcantshop':float(y.cantshop)+float(x['cantidad'])
#                                 })


#                     context['lnip']=lnip
#                     context['lnippedido']=lnippedido
#                     context['status'] = True

#                 if 'lguiasdev' in request.GET:
#                     lguia=[]
#                     estsearch = request.GET.get('search_one')

#                     if estsearch=='true':
#                         for x in GuiaDevMat.objects.filter(
#                             guiadevmat_id=request.GET.get('idguiadevmat'),
#                             estado=request.GET.get('stguia')).order_by('-registro'):
#                             lguia.append({
#                                 'empleaut':x.emple_aut_id,
#                                 'codproy':x.proyecto_id,
#                                 'nameproyecto':x.proyecto.nompro,
#                                 'codguiadev':x.guiadevmat_id,
#                                 'fechdev':x.fechadevolucion,
#                                 'registro':x.registro.strftime('%d-%m-%Y'),
#                                 'autnames':'%s, %s' % (x.emple_aut.lastname,x.emple_aut.firstname),
#                                 'genero':'%s, %s' % (x.empdni.lastname,x.empdni.firstname),
#                                 'coment':x.comentario,
#                                 'cond':x.condni_id,
#                                 'placa':x.nropla_id,
#                                 'transp':x.traruc_id
#                                 })
#                         context['lguia']=lguia
#                     else:
#                         for x in GuiaDevMat.objects.filter(
#                             estado=request.GET.get('stguia')).order_by('-registro'):
#                             lguia.append({
#                                 'empleaut':x.emple_aut_id,
#                                 'codproy':x.proyecto_id,
#                                 'nameproyecto':x.proyecto.nompro,
#                                 'codguiadev':x.guiadevmat_id,
#                                 'fechdev':x.fechadevolucion,
#                                 'registro':x.registro.strftime('%d-%m-%Y'),
#                                 'autnames':'%s, %s' % (x.emple_aut.lastname,x.emple_aut.firstname),
#                                 'genero':'%s, %s' % (x.empdni.lastname,x.empdni.firstname),
#                                 'coment':x.comentario,
#                                 'cond':x.condni_id,
#                                 'placa':x.nropla_id,
#                                 'transp':x.traruc_id
#                                 })

#                         context['lguia']=lguia[0:50]
#                     context['status']=True


#                 if 'lcbotransxguia' in request.GET:
#                     lcond = []
#                     ltransp = []
#                     for x in Conductore.objects.filter(
#                         traruc_id = request.GET.get('codtransp')).order_by('connom'):
#                         lcond.append({
#                             'cod_cond': x.condni_id,
#                             'name_cond':x.connom
#                             })
#                         context['lcond'] = lcond

#                     for y in Transporte.objects.filter(
#                         traruc_id = request.GET.get('codtransp')):
#                         ltransp.append({
#                             'placa': y.nropla_id,
#                             'marca': y.marca
#                             })
#                         context['ltransp'] = ltransp

#                     context['status'] = True

#                 if 'getuser' in request.GET:
#                     user='%s, %s' % (request.user.get_profile().empdni.lastname,
#                                       request.user.get_profile().empdni.firstname)
#                     context['user']=user
#                     context['status']=True


#             except ObjectDoesNotExist, e:
#                 context['raise'] = str(e)
#                 context['status'] = False
#             return self.render_to_json_response(context)

#         lemple = Employee.objects.filter(flag=True).order_by('lastname')
#         lguiadevmat = GuiaDevMat.objects.filter(estado = 'PE').order_by('guiadevmat_id')
#         lguiadevmatge = GuiaDevMat.objects.filter(estado = 'GE').order_by('guiadevmat_id')
#         ltransportist = Transportista.objects.filter(flag=True).order_by('tranom')
#         lplaca= Transporte.objects.filter(flag=True)
#         lconduct=Conductore.objects.filter(flag=True)

#         return render(request,'almacen/devolucionmaterial.html',{
#             'lguiadevmat':lguiadevmat,
#             'lguiadevmatge':lguiadevmatge,
#             'lemple':lemple,
#             'ltransportist':ltransportist,
#             'lplaca':lplaca,
#             'lconduct':lconduct
#             })

# # ///////////////////////////
#     @method_decorator(login_required)
#     def post(self, request, *args, **kwargs):
#         try:
#             context = dict()
#             if request.is_ajax():
#                 try:
#                     if 'exists' in request.POST:
#                         try:
#                             GuiaRemision.objects.get(
#                                 guia_id=request.POST.get('codguia'))
#                             context['status'] = True
#                         except GuiaRemision.DoesNotExist, e:
#                             context['status'] = False

#                     if 'exguiadevmat' in request.POST:
#                         try:
#                             GuiaDevMat.objects.get(
#                                 guiadevmat_id=request.POST.get('codguia'))
#                             context['status'] = True
#                         except GuiaDevMat.DoesNotExist, e:
#                             context['status'] = False

#                     if 'updestguiadevmat' in request.POST:
#                         lgdevmatnip = json.loads(request.POST.get('lgdevmatnip'))
#                         ldetgdevmat = json.loads(request.POST.get('ldetgdevmat'))
#                         print 'lgdevmatnip', lgdevmatnip
#                         if len(lgdevmatnip)>0:
#                             for x in lgdevmatnip:
#                                 GuiaDevMatNiple.objects.get(
#                                     id=x['idgdevmatniple']).delete()

#                         if len(ldetgdevmat)>0:
#                             for x in ldetgdevmat:
#                                 detGuiaDevMat.objects.get(
#                                     id=x['id']).delete()

#                         GuiaDevMat.objects.get(
#                             guiadevmat_id=request.POST.get('codguidevmat')).delete()
#                         context['status'] = True

#                     if 'saveeditmat' in request.POST:
#                         edmat = detGuiaDevMat.objects.get(
#                             id = request.POST.get('idt'))
#                         edmat.cantidad = request.POST.get('cant')
#                         edmat.comentario = request.POST.get('com')
#                         edmat.motivo = request.POST.get('motivo')
#                         edmat.save()
#                         context['status'] = True


#                     if 'delmatdet' in request.POST:
#                         detGuiaDevMat.objects.get(
#                             id=request.POST.get('idtable')).delete()
#                         context['status'] = True


#                     if 'savecabgdev' in request.POST:
#                         cabgdev = GuiaDevMat.objects.get(
#                             guiadevmat_id = request.POST.get('codgdev'))
#                         cabgdev.fechadevolucion = request.POST.get('fdev')
#                         cabgdev.emple_aut_id = request.POST.get('empleaut')
#                         cabgdev.comentario = request.POST.get('coment')
#                         cabgdev.save()
#                         context['status'] = True


#                     if 'savedevmat' in request.POST:
#                         lniplefinal2=json.loads(request.POST.get('lniplefinal2'))
#                         ldetdev = json.loads(request.POST.get('ldetdev'))


#                         GuiaDevMat.objects.create(
#                             guiadevmat_id = request.POST.get('numeroguia'),
#                             fechadevolucion = request.POST.get('fdev'),
#                             emple_aut_id = request.POST.get('empdniaut'),
#                             empdni_id = request.user.get_profile().empdni_id,
#                             condni_id=request.POST.get('cond'),
#                             nropla_id=request.POST.get('placa'),
#                             proyecto_id=request.POST.get('codproy'),
#                             traruc_id=request.POST.get('transport'),
#                             estado = request.POST.get('est'),
#                             comentario = request.POST.get('comen')
#                             )


#                         if len(ldetdev) > 0:
#                             for x in ldetdev:
#                                 detGuiaDevMat.objects.create(
#                                     guiadevmat_id = request.POST.get('numeroguia'),
#                                     guia_id=x['numguia'],
#                                     material_id = x['codmat'],
#                                     marca_id = x['codbr'],
#                                     model_id = x['codmod'],
#                                     cantidad = x['inputcant'],
#                                     comentario = x['comment'],
#                                     motivo = x['motivo'],
#                                     pedido_id=x['codped']
#                                     )

#                         if len(lniplefinal2) > 0:
#                             for y in lniplefinal2:
#                                 GuiaDevMatNiple.objects.create(
#                                     guiadevmat_id=request.POST.get('numeroguia'),
#                                     guia_id=y['numguia'],
#                                     material_id=y['codmat'],
#                                     marca_id=y['codbr'],
#                                     model_id=y['codmod'],
#                                     cantidad=y['canti'],
#                                     metrado=y['metrado'],
#                                     tipo=y['tipo'],
#                                     idnipgrem_id=y['idtabnipgrem'],
#                                     motivo='' if y['motinip']==None else y['motinip'],
#                                     comentario='' if y['comnip']==None else y['comnip'],
#                                     pedido_id=y['codped']
#                                     )

#                         context['status'] = True

#                     if 'upddevmatniple' in request.POST:
#                         nip=GuiaDevMatNiple.objects.get(
#                             id=request.POST.get('codtab'))
#                         nip.cantidad=request.POST.get('cantupdnip')
#                         nip.save()

#                         detgdev=detGuiaDevMat.objects.get(
#                             guiadevmat_id=request.POST.get('codguiadevmat'),
#                             material_id=request.POST.get('codmat'),
#                             marca_id=request.POST.get('codbr'),
#                             model_id=request.POST.get('codmod'))
#                         detgdev.cantidad=request.POST.get('canttot')
#                         detgdev.save()

#                         context['status']=True

#                     if 'delnipdevmat' in request.POST:

#                         GuiaDevMatNiple.objects.get(
#                             id=request.POST.get('idtable')).delete()

#                         upd=detGuiaDevMat.objects.get(
#                             guiadevmat_id=request.POST.get('codgdevmat'),
#                             material_id=request.POST.get('codmat'),
#                             marca_id=request.POST.get('codbr'),
#                             model_id=request.POST.get('codmod'))
#                         upd.cantidad=request.POST.get('canttotal')
#                         upd.save()

#                         context['status']=True

#                     if 'updsavedevmat' in request.POST:
#                         # update detguiaremision
#                         ldetgrem = json.loads(request.POST.get('ldetgrem'))
#                         # update nipleguiaremision
#                         lnip=json.loads(request.POST.get('lnip'))
#                         # update inventorybrand
#                         ldetinven = json.loads(request.POST.get('ldetinven'))
#                         # update detpedido
#                         ldetpedido = json.loads(request.POST.get('ldetpedido'))
#                         #update niple(pedido)
#                         lnippedido = json.loads(request.POST.get('lnippedido'))


#                         if len(ldetgrem)>0:
#                             for x in ldetgrem:
#                                 dgr=DetGuiaRemision.objects.get(
#                                     id=x['idtabdetgrem'])
#                                 dgr.cantdev=x['updcantdev']
#                                 dgr.cantguide=x['updcantguide']
#                                 dgr.save()
#                             context['status']=True

#                         if len(lnip)>0:
#                             for x in lnip:
#                                 if x['cant']==x['updcantenv']:
#                                     estado=True
#                                 else:
#                                     estado=False

#                                 ni=NipleGuiaRemision.objects.get(
#                                     id=x['idtabnipgrem'])
#                                 ni.cenvdevmat=x['updcantenv']
#                                 ni.cantguide=x['updcantguide']
#                                 ni.flagcenvdevmat=estado
#                                 ni.save()
#                             context['status']=True

#                         if len(ldetpedido)>0:
#                             for x in ldetpedido:
#                                 if x['updcantshop']== x['cantstatic']:
#                                     tag = '0'
#                                 elif x['updcantshop'] > 0 and x['updcantshop'] < x['cantstatic']:
#                                     tag = '1'
#                                 else:
#                                     tag = '2'

#                                 dped=Detpedido.objects.get(
#                                     id=x['idtabdetped'])
#                                 dped.cantshop=x['updcantshop']
#                                 dped.cantguide=x['updcantguide']
#                                 dped.cenvdevmat=x['updcantenv']
#                                 dped.tag=tag
#                                 dped.save()
#                             context['status']=True

#                         if len(lnippedido)>0:
#                             for x in lnippedido:

#                                 if x['updcantshop']==x['cantstatic']:
#                                     tag='0'
#                                 elif x['updcantshop'] > 0 and x['updcantshop'] < x['cantstatic']:
#                                     tag = '1'
#                                 else:
#                                     tag = '2'

#                                 print 'tag', tag

#                                 nipped=Niple.objects.get(
#                                     id=x['idtabnipped'])
#                                 nipped.cantshop=x['updcantshop']
#                                 nipped.cantguide=x['updcantguide']
#                                 nipped.cenvdevmat=x['updcantenv']
#                                 nipped.tag=tag
#                                 nipped.save()
#                             context['status']=True

#                         gdevmat=GuiaDevMat.objects.get(
#                             guiadevmat_id=request.POST.get('codguiadevmat'))
#                         gdevmat.estado='GE'
#                         gdevmat.save()

#                         if len(ldetinven)>0:
#                             for x in ldetinven:
#                                 inv=InventoryBrand.objects.get(
#                                     id=x['idtabinvbrand'])
#                                 inv.stock=x['updstock']
#                                 inv.save()

#                         context['status']=True


#                 except Exception, e:
#                     context['raise'] = str(e)
#                     context['status'] = False
#                 return self.render_to_json_response(context)
#         except Exception, e:
#             print e.__str__()

# class DevConMaterial(JSONResponseMixin, TemplateView):
#     @method_decorator(login_required)
#     def get(self,request,*args,**kwargs):
#         context = dict();
#         if request.is_ajax():
#             try:
#                 if 'lmatdetguiapro' in request.GET:
#                     listprojects = []
#                     for x in Detpedido.objects.filter(
#                         Q(pedido__status='AP') | Q(pedido__status='IN') | Q(pedido__status='CO'),
#                         materiales_id= request.GET.get('txtcodmat'),
#                         pedido__proyecto__status='AC',
#                         pedido__proyecto_id=request.GET.get('cproy'),
#                         flag=True).distinct('pedido__proyecto__proyecto_id').order_by('-pedido__proyecto__proyecto_id'):
#                         if x.cantshop < x.cantidad:
#                             listprojects.append({
#                                 'matcod':x.materiales_id,
#                                 'matnom':x.materiales.matnom,
#                                 'matmed':x.materiales.matmed,
#                                 'codproy':x.pedido.proyecto_id,
#                                 'nompro':x.pedido.proyecto.nompro
#                                 })

#                     context['listprojects'] = listprojects
#                     context['status'] = True


#                 if 'lmatdetguia' in request.GET:
#                     lmat = []
#                     count = 1
#                     for x in DetGuiaRemision.objects.filter(
#                         materiales_id = request.GET.get('txtcodmat'),
#                         order__flag = True,
#                         guia__status = 'GE',
#                         guia__flag = True).distinct('guia__pedido__proyecto__proyecto_id').order_by('-guia__pedido__proyecto__proyecto_id'):
#                         lmat.append({
#                             'count':count,
#                             'nguia':x.guia_id,
#                             'matcod':x.materiales_id,
#                             'matnom':x.materiales.matnom,
#                             'matmed':x.materiales.matmed,
#                             'matcodbrand':x.brand_id,
#                             'matnombrand':x.brand.brand,
#                             'matcodmodel':x.model.model_id,
#                             'matnommodel':x.model.model,
#                             'matcant':x.cantguide,
#                             'codped':x.order_id,
#                             'codproy':x.order.proyecto_id,
#                             'nompro':x.order.proyecto.nompro
#                             })

#                         count = count + 1
#                     context['lmateriales'] = lmat
#                     if len(lmat) > 0:
#                         context['listmateriales'] = True
#                     else:
#                         context['listmateriales'] = False
#                     context['sizelistmateriales'] = len(lmat)
#                     context['status'] = True

#                 if 'lproyectos' in request.GET:
#                     listprojects = []
#                     for x in Detpedido.objects.filter(
#                         Q(pedido__status='AP') | Q(pedido__status='IN') | Q(pedido__status='CO'),
#                         materiales_id= request.GET.get('txtcodmat'),
#                         pedido__proyecto__status='AC',
#                         flag=True).distinct('pedido__proyecto__proyecto_id').order_by('-pedido__proyecto__proyecto_id'):
#                         if x.cantshop < x.cantidad:
#                             listprojects.append({
#                                 'matcod':x.materiales_id,
#                                 'matnom':x.materiales.matnom,
#                                 'matmed':x.materiales.matmed,
#                                 'codproy':x.pedido.proyecto_id,
#                                 'nompro':x.pedido.proyecto.nompro
#                                 })
#                     context['listprojects']=listprojects
#                     context['status']=True


#                 if 'listsector' in request.GET:
#                     lsector=[]
#                     for x in DetGuiaRemision.objects.filter(
#                         Q(order__status='AP') | Q(order__status='IN') | Q(order__status='CO'),
#                         materiales_id= request.GET.get('mat_id'),
#                         order__proyecto__status='AC',
#                         flag=True,
#                         order__proyecto_id=request.GET.get('proy_id'),
#                         order__flag=True):
#                         lsector.append({
#                             'codguia':x.guia_id,
#                             'namegrupo':x.order.dsector.sgroup.name,
#                             'namesector':x.order.dsector.sector.nomsec,
#                             'namedsector':x.order.dsector.name
#                             })
#                     context['lsector']=lsector
#                     context['status']=True

#                 if 'listmat' in request.GET:
#                     listamat = []
#                     stlblcodpro = request.GET.get('stlblcodpro')
#                     if stlblcodpro == 'false':
#                         for x in Detpedido.objects.filter(
#                             Q(pedido__status='AP') | Q(pedido__status='IN') | Q(pedido__status='CO'),
#                             materiales__matnom__icontains= request.GET.get('matdesc'),
#                             pedido__proyecto__status='AC',
#                             flag=True).distinct('materiales__matnom','materiales__matmed').order_by('materiales__matnom'):
#                             if x.cantshop < x.cantidad:
#                                 listamat.append({
#                                     'cmat':x.materiales.materiales_id,
#                                     'namemat':x.materiales.matnom,
#                                     'medmat':x.materiales.matmed,
#                                     'unidad':x.materiales.unidad.uninom,
#                                     'marca':x.brand.brand,
#                                     'model':x.model.model,
#                                     'codped':x.pedido_id
#                                     })
#                     else:
#                         for x in Detpedido.objects.filter(
#                             Q(pedido__status='AP') | Q(pedido__status='IN') | Q(pedido__status='CO'),
#                             materiales__matnom__icontains= request.GET.get('matdesc'),
#                             pedido__proyecto_id=request.GET.get('lblcodpro'),
#                             pedido__proyecto__status='AC',
#                             flag=True).distinct('materiales__matnom','materiales__matmed').order_by('materiales__matnom'):
#                             if x.cantshop < x.cantidad:
#                                 listamat.append({
#                                     'cmat':x.materiales.materiales_id,
#                                     'namemat':x.materiales.matnom,
#                                     'medmat':x.materiales.matmed,
#                                     'unidad':x.materiales.unidad.uninom,
#                                     'marca':x.brand.brand,
#                                     'model':x.model.model,
#                                     'codped':x.pedido_id
#                                     })

#                     context['listamat']= listamat
#                     context['status'] = True

#                 if 'exniple' in request.GET:
#                     listaniple=[]
#                     count=0
#                     for x in NipleGuiaRemision.objects.filter(
#                         order_id=request.GET.get('codped'),
#                         materiales_id=request.GET.get('codmat'),
#                         brand_id=request.GET.get('codbr'),
#                         model_id=request.GET.get('codmod'),
#                         flag=True,
#                         flagcenvdevmat=False):
#                         listaniple.append({
#                             'idtabnipgrem':x.id,
#                             'codped':x.order_id,
#                             'codmat':x.materiales_id,
#                             'codbr':x.brand_id,
#                             'marca':x.brand.brand,
#                             'codmod':x.model_id,
#                             'modelo':x.model.model,
#                             'count':count,
#                             # 'related':x.related,
#                             'cenvdevmat':x.cenvdevmat,
#                             'cantidad':x.cantguide,
#                             'metrado':x.metrado,
#                             'tipo':x.tipo
#                             # 'dsector_id':x.dsector_id,
#                             })
#                         count=count+1
#                     context['listaniple']=listaniple
#                     context['status']=True


#                 if 'ldetguiarem' in request.GET:
#                     ldetguiaremision=[]
#                     countcod = 0
#                     for x in DetGuiaRemision.objects.filter(
#                         guia_id=request.GET.get('codguiarem'),
#                         materiales_id=request.GET.get('codmat'),
#                         flag=True):
#                         ldetguiaremision.append({
#                             'codped':x.guia.pedido_id,
#                             'codguiarem':x.guia.guia_id,
#                             'codmat':x.materiales_id,
#                             'namemat':x.materiales.matnom,
#                             'medmat':x.materiales.matmed,
#                             'cantidad':x.cantguide,
#                             'codbr':x.brand_id,
#                             'marca':x.brand.brand,
#                             'codmod':x.model_id,
#                             'modelo':x.model.model,
#                             'codproy':x.guia.pedido.proyecto_id,
#                             'nameproy':x.guia.pedido.proyecto.nompro,
#                             'cantdev':x.cantdev,
#                             'countcod':countcod
#                             })
#                         countcod=countcod+1

#                     context['ldetguiaremision']=ldetguiaremision
#                     context['status'] = True

#                 if 'gentcantniple' in request.GET:
#                     sizeniple=[]
#                     ldetguiaremision=json.loads(request.GET.get('ldetguiaremision'))
#                     for y in ldetguiaremision:
#                         for x in Niple.objects.filter(
#                             pedido_id=y['codped'],
#                             materiales_id=y['codmat'],
#                             brand_id=y['codbr'],
#                             model_id=y['codmod']):
#                             sizeniple.append({
#                                 'id':x.id
#                                 })
#                     context['sizeniple']=sizeniple
#                     context['status']=True

#                 if 'exguiapemat' in request.GET:
#                     ldetdev = json.loads(request.GET.get('ldetdev'))
#                     lexmat=[]
#                     for y in ldetdev:
#                         for x in detGuiaDevMat.objects.filter(
#                             guiadevmat__estado='PE',
#                             guia__pedido_id=y['codped'],
#                             guia_id=y['nguia'],
#                             material_id=y['codmat'],
#                             marca_id=y['codbr'],
#                             model_id=y['codmod']):
#                             lexmat.append({
#                                 'id':x.id,
#                                 'coditem':int(y['it'])+1,
#                                 'docdevmat':x.guiadevmat_id
#                                 })

#                     context['lexmat']=lexmat
#                     context['status']=True

#                 if 'lcbotransxmat' in request.GET:
#                     print 'sfe'
#                     lcond = []
#                     ltransp = []
#                     for x in Conductore.objects.filter(
#                         traruc_id = request.GET.get('codtransp')).order_by('connom'):
#                         lcond.append({
#                             'cod_cond': x.condni_id,
#                             'name_cond':x.connom
#                             })
#                         context['lcond'] = lcond

#                     for y in Transporte.objects.filter(
#                         traruc_id = request.GET.get('codtransp')):
#                         ltransp.append({
#                             'placa': y.nropla_id,
#                             'marca': y.marca
#                             })
#                         context['ltransp'] = ltransp

#                     context['status'] = True



#             except ObjectDoesNotExist, e:
#                 context['raise'] = str(e)
#                 context['status'] = False
#             return self.render_to_json_response(context)
#         lempleados = Employee.objects.filter(flag=True).order_by('lastname')
#         ltransportmat = Transportista.objects.filter(flag=True).order_by('tranom')
#         return render(request,'almacen/devconmat.html',{
#             'lempleados':lempleados,
#             'ltransportmat':ltransportmat
#             })

#     def post(self,request,*args,**kwargs):
#         try:
#             context = dict()
#             if request.is_ajax():
#                 try:
#                     if 'savefinconmat' in request.POST:
#                         lnippleselect = json.loads(request.POST.get('lnippleselect'))
#                         ldetdevfin=json.loads(request.POST.get('ldetdevfin'))
#                         # guiadevmat = genkeys.GenerateIdGuiaMatDev();

#                         GuiaDevMat.objects.create(
#                             guiadevmat_id=request.POST.get('codguia'),
#                             fechadevolucion=request.POST.get('fechdev'),
#                             emple_aut_id=request.POST.get('auth'),
#                             empdni_id=request.user.get_profile().empdni_id,
#                             proyecto_id=request.POST.get('cproy'),
#                             condni_id=request.POST.get('codcond'),
#                             nropla_id=request.POST.get('codplaca'),
#                             traruc_id=request.POST.get('codtr'),
#                             estado=request.POST.get('estado'),
#                             comentario=request.POST.get('comenconmat')
#                             )

#                         if len(ldetdevfin) > 0:
#                             for x in ldetdevfin:
#                                 detGuiaDevMat.objects.create(
#                                     guiadevmat_id=request.POST.get('codguia'),
#                                     guia_id=x['nguia'],
#                                     material_id=x['codmat'],
#                                     marca_id=x['codbr'],
#                                     model_id=x['codmod'],
#                                     cantidad=x['cantidad'],
#                                     motivo=x['motivo'],
#                                     pedido_id=x['codped'],
#                                     comentario=x['comentario'])

#                         if len(lnippleselect) > 0:
#                             for x in lnippleselect:
#                                 GuiaDevMatNiple.objects.create(
#                                     guiadevmat_id=request.POST.get('codguia'),
#                                     guia_id=x['numguia'],
#                                     material_id=x['codmat'],
#                                     marca_id=x['codbr'],
#                                     model_id=x['codmod'],
#                                     cantidad=x['inputcant'],
#                                     metrado=x['metrado'],
#                                     tipo=x['tipo'],
#                                     idnipgrem_id=x['idtabnipgrem'],
#                                     motivo=x['motivo'],
#                                     pedido_id=x['codped'],
#                                     comentario=x['comentario'])

#                         context['status'] = True

#                 except Exception, e:
#                     context['raise'] = str(e)
#                     context['status'] = False
#                 return self.render_to_json_response(context)
#         except Exception, e:
#             print e.__str__()


'''
2017-05-19 09:12:07
Return item from guide for the project
@ Juan Julcapari
'''
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

