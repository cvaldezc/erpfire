# -*- coding: utf-8 -*-

import json
import hashlib

from django.db.models import Q, Count, Sum
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.core.urlresolvers import reverse_lazy
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.utils import simplejson
from django.utils.decorators import method_decorator
from django.template import RequestContext, TemplateDoesNotExist
from django.views.generic import TemplateView, View, ListView
from django.views.generic.edit import CreateView
from xlrd import open_workbook, XL_CELL_EMPTY

from CMSGuias.apps.almacen.models import Suministro
from CMSGuias.apps.home.models import (
                                        Proveedor, Documentos, FormaPago,
                                        Almacene, Moneda, Configuracion,
                                        LoginProveedor, Brand, Model,
                                        Employee, Unidade, Materiale)
from .models import (
                        Compra, Cotizacion, CotCliente, CotKeys, DetCotizacion,
                        DetCompra, tmpcotizacion, tmpcompra, ServiceOrder,
                        DetailsServiceOrder)
from CMSGuias.apps.ventas.models import Proyecto, Subproyecto
from CMSGuias.apps.operations.models import MetProject
from CMSGuias.apps.tools import genkeys, globalVariable, uploadFiles, search, number_to_char
from .forms import (
                    addTmpCotizacionForm, addTmpCompraForm, CompraForm,
                    ProveedorForm, ServiceOrderForm)


# Class Bases Views generic

class JSONResponseMixin(object):
    def render_to_json_response(self, context, **response_kwargs):
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        return simplejson.dumps(context, encoding='utf-8')


class LogisticsHome(TemplateView):
    template_name = 'logistics/home.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LogisticsHome, self).dispatch(request, *args, **kwargs)


class SupplyPending(TemplateView):
    template_name = 'logistics/supplypending.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = super(SupplyPending, self).get_context_data(**kwargs)
        if request.GET.get('rdo') is not None:
            if request.GET.get('rdo') == 'code':
                model = Suministro.objects.filter(
                        pk=request.GET.get('id-su'), flag=True, status='PE')
            elif request.GET.get('rdo') == 'date':
                if request.GET.get('fi-su') != '' and request.GET.get('ff-su') == '':
                    messages.error(
                        request,
                        'Ha ocurrido un error miestras se realizaba la consulta %s' % (str(request)))
                    model = Suministro.objects.filter(
                        flag=True,
                        status='PE',
                        registrado__startswith=globalVariable.format_str_date(
                            _str=request.GET.get('fi-su')))
                elif request.GET.get('fi-su') != '' and request.GET.get('ff-su') != '':
                    model = Suministro.objects.filter(
                        flag=True,
                        status='PE',
                        registrado__range=(globalVariable.format_str_date(
                            request.GET.get('fi-su')),
                            globalVariable.format_str_date(
                            request.GET.get('ff-su'))))
        else:
            model = Suministro.objects.filter(flag=True, status='PE')

        paginator = Paginator(model, 20)
        page = request.GET.get('page')
        try:
            supply = paginator.page(page)
        except PageNotAnInteger:
            supply = paginator.page(1)
        except EmptyPage:
            supply = paginator.page(paginator.num_pages)

        context['supply'] = supply
        context['status'] = globalVariable.status
        return render_to_response(
                self.template_name,
                context,
                context_instance=RequestContext(request))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                obj = Suministro.objects.get(
                        flag=True,
                        status='PE',
                        pk=request.POST.get('id-su'))
                obj.status = (
                    'AP' if request.POST.get('status') == 'approve' else 'AN')
                obj.save()
                # update status supply
                context['status'] = True
            except ObjectDoesNotExist:
                messages.error(
                    request,
                    'Se ha encontrado error al cambiar el status de supply',
                    messages.ERROR)
                raise Http404
                context['status'] = False
            context['type'] = request.POST.get('status')
            context = simplejson.dumps(context)
            return HttpResponse(
                context,
                mimetype='application/json',
                content_type='application/json')


# Class view Convert Supply to quote or Purchase
class SupplytoDocumentIn(TemplateView):
    template_name = 'logistics/spdocumentin.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = super(SupplytoDocumentIn, self).get_context_data(**kwargs)
        model = Suministro.objects.filter(flag=True, status='AP')
        paginator = Paginator(model, 20)
        page = request.GET.get('page')
        try:
            supply = paginator.page(page)
        except PageNotAnInteger:
            supply = paginator.page(1)
        except EmptyPage:
            supply = paginator.page(paginator.num_pages)

        context['supply'] = supply
        context['status'] = globalVariable.status
        context['supplier'] = Proveedor.objects.filter(flag=True)
        context['storage'] = Almacene.objects.filter(flag=True)
        context['documents'] = Documentos.objects.filter(
                                flag=True).order_by('documento')
        context['payment'] = FormaPago.objects.filter(
                                flag=True).order_by('pagos')
        context['currency'] = Moneda.objects.filter(flag=True)
        context['projects'] = [{
            s.suministro_id: [{
                'nompro': x.nompro}
                for x in Proyecto.objects.filter(
                    proyecto_id__in=s.orders.split(','))]}
            for s in supply]
        # print context['projects']
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            if request.POST.get('type') == 'finish':
                data = {}
                try:
                    obj = Suministro.objects.get(pk=request.POST.get('supply'))
                    obj.status = 'CO'
                    obj.flag = False
                    obj.save()
                    data['obj'] = True
                except ObjectDoesNotExist, e:
                    data['status'] = False
                return HttpResponse(
                    simplejson.dumps(data),
                    mimetype='application/json',
                    content_type='application/json')
            response = HttpResponse()
            data = dict()
            try:
                # get status type document
                if request.POST.get('type') == 'quote':
                    # saved quotation
                    idquote = None
                    if request.POST.get('newid') == '1':
                        # recover data for header quote and save
                        idquote = genkeys.GenerateKeyQuotation()
                        obj = Cotizacion()
                        obj.cotizacion_id = idquote
                        obj.suministro_id = request.POST.get('supply')
                        obj.empdni_id = request.user.get_profile().empdni_id
                        obj.almacen_id = request.POST.get('storage')
                        obj.traslado = globalVariable.format_str_date(
                                        request.POST.get('traslado'))
                        obj.obser = request.POST.get('obser')
                        obj.status = 'PE'
                        obj.flag = True
                        obj.save()
                    elif request.POST.get('newid') == '0':
                        idquote = request.POST.get('id')

                    # save quote to client
                    counter = CotKeys.objects.filter(
                        cotizacion_id=idquote,
                        proveedor_id=request.POST.get('supplier')
                        ).aggregate(counter=Count('cotizacion'))
                    if counter['counter'] == 0:
                        obj = CotKeys()
                        obj.cotizacion_id = idquote
                        obj.proveedor_id = request.POST.get('supplier')
                        obj.keygen = genkeys.GeneratekeysQuoteClient()
                        obj.status = 'PE'
                        obj.flag = True
                        obj.save()
                    # save det quote
                    mats = json.loads(request.POST.get('mats'))
                    for x in range(mats.__len__()):
                        obj = DetCotizacion()
                        obj.cotizacion_id = idquote
                        obj.proveedor_id = request.POST.get('supplier')
                        obj.materiales_id = mats[x]['mid']
                        obj.cantidad = mats[x]['cant']
                        obj.marca = mats[x]['brand']
                        obj.modelo = mats[x]['model']
                        obj.flag = True
                        obj.save()
                    data['id'] = idquote
                    data['status'] = True
                if 'purchase' in request.POST:
                    form = CompraForm(request.POST, request.FILES)
                    if form.is_valid():
                        add = form.save(commit=False)
                        purchase = genkeys.GenerateKeyPurchase()
                        add.compra_id = purchase
                        add.empdni_id = request.user.get_profile().empdni_id
                        add.save()
                        # Save details
                        materials = json.loads(request.POST.get('mats'))
                        for x in materials:
                            obj = DetCompra()
                            obj.compra_id = purchase
                            obj.materiales_id = x['materials']
                            obj.brand_id = x['brand']
                            obj.model_id = x['model']
                            obj.cantidad = x['quantity']
                            obj.precio = x['price']
                            obj.discount = 0
                            obj.cantstatic = x['quantity']
                            obj.save()
                        data['purchase'] = purchase
                        data['status'] = True
                    else:
                        data['status'] = False
            except ObjectDoesNotExist, e:
                data['status'] = False
                data['raise'] = str(e)
            response.write(simplejson.dumps(data))
            response['content_type'] = 'application/json'
            response['mimetype'] = 'application/json'
            return response


class ViewListQuotation(TemplateView):
    template_name = 'logistics/listquotation.html'

    def get(self, request, *args, **kwargs):
        context = super(ViewListQuotation, self).get_context_data(**kwargs)
        if request.is_ajax():
            if request.GET.get('by') == 'code':
                model = CotKeys.objects.filter(
                    Q(cotizacion_id=request.GET.get('code')),
                    Q(flag=True),
                    ~Q(status='CO'),
                    ~Q(status='NC'))
            elif request.GET.get('by') == 'dates':
                if request.GET.get('dates') != '' and request.GET.get('datee') == '':
                    model = CotKeys.objects.filter(
                        Q(cotizacion__registrado__startswith=(
                            globalVariable.format_str_date(
                                request.GET.get('dates')))),
                        Q(flag=True),
                        ~Q(status='CO'),
                        ~Q(status='NC'))
                elif request.GET.get('dates') != '' and request.GET.get('datee') != '':
                    model = CotKeys.objects.filter(
                        Q(cotizacion__registrado__range=(
                            globalVariable.format_str_date(request.GET.get(
                                'dates')),
                            globalVariable.format_str_date(
                                request.GET.get('datee')))),
                        Q(flag=True),
                        ~Q(status='CO'),
                        ~Q(status='NC'))
        else:
            model = CotKeys.objects.filter(
                Q(flag=True),
                ~Q(status='CO'),
                ~Q(status='NC')).order_by('-cotizacion__registrado')

        paginator = Paginator(model, 15)
        page = request.GET.get('page')
        try:
            quote = paginator.page(page)
        except PageNotAnInteger:
            quote = paginator.page(1)
        except EmptyPage:
            quote = paginator.page(paginator.num_pages)
        context['list'] = quote
        if request.is_ajax():
            data = {}
            data['list'] = [{
                'cotizacion_id': x.cotizacion_id,
                'proveedor_id': x.proveedor_id,
                'razonsocial': x.proveedor.razonsocial,
                'keygen': x.keygen,
                'traslado': globalVariable.format_date_str(
                    x.cotizacion.traslado)}
                for x in quote]
            data['status'] = True
            return HttpResponse(
                simplejson.dumps(data),
                mimetype='application/json')
        else:
            return render_to_response(
                self.template_name,
                context,
                context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            context = dict()
            try:
                key = CotKeys.objects.get(
                    cotizacion_id=request.POST.get('quote'),
                    proveedor_id=request.POST.get('supplier'))
                if key.flag:
                    key.flag = False
                    key.save()
                flag = CotKeys.objects.filter(
                    cotizacion_id=request.POST.get('quote'),
                    proveedor_id=request.POST.get('supplier'),
                    flag=True).aggregate(counter=Count('cotizacion'))
                if flag['counter'] == 0:
                    quote = Cotizacion.objects.get(
                        cotizacion_id=request.POST.get('quote'))
                    quote.flag = False
                    quote.save()
                customer = CotCliente.objects.filter(
                    cotizacion_id=request.POST.get('quote'),
                    proveedor_id=request.POST.get('supplier'))
                if customer.__len__() > 0:
                    customer.flag = False
                    customer.save()
                context['status'] = True
            except ObjectDoesNotExist, e:
                raise e
                context['status'] = False
            return HttpResponse(
                simplejson.dumps(context),
                mimetype='application/json')


class ViewQuoteSingle(JSONResponseMixin, TemplateView):
    template_name = 'logistics/single.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = super(ViewQuoteSingle, self).get_context_data(**kwargs)
        if request.is_ajax():
            if request.GET.get('type') == 'list':
                context = {}
                try:
                    tmp = tmpcotizacion.objects.filter(
                        empdni=request.user.get_profile().empdni_id)
                    context['list'] = [
                        {
                            'id': x.id,
                            'materials_id': x.materiales_id,
                            'matname': x.materiales.matnom,
                            'matmeasure': x.materiales.matmed,
                            'brand_id': x.brand_id,
                            'model_id': x.model_id,
                            'brand': x.brand.brand,
                            'model': x.model.model,
                            'unit': x.materiales.unidad_id,
                            'quantity': x.cantidad
                        } for x in tmp
                    ]
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
        context['details'] = tmpcotizacion.objects.filter(
            empdni=request.user.get_profile().empdni_id
            ).order_by('materiales__matnom')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            context = dict()
            if request.POST.get('type') == 'add':
                try:
                    form = addTmpCotizacionForm(request.POST)
                    if form.is_valid():
                        add = form.save(commit=False)
                        add.empdni = request.user.get_profile().empdni_id
                        add.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'edit':
                try:
                    tmp = tmpcotizacion.objects.get(
                        pk=request.POST.get('id'),
                        materiales_id=request.POST.get('materials_id'))
                    tmp.cantidad = request.POST.get('quantity')
                    tmp.save()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'del':
                try:
                    tmp = tmpcotizacion.objects.get(
                        pk=request.POST.get('id'),
                        materiales_id=request.POST.get('materials_id'))
                    tmp.delete()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'delall':
                try:
                    tmp = tmpcotizacion.objects.filter(
                        empdni=request.user.get_profile().empdni_id)
                    tmp.delete()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'read':
                try:
                    nothing = list()
                    # upload file
                    arch = request.FILES['archivo']
                    filename = uploadFiles.upload('/storage/temporary/', arch)
                    book = open_workbook(filename, encoding_override='utf-8')
                    sheet = book.sheet_by_index(0)
                    # recover sheet of materials
                    for m in range(10, sheet.nrows):
                        mid = sheet.cell(m, 2)
                        if mid.ctype != XL_CELL_EMPTY:
                            mid = str(int(mid.value))
                        else:
                            mid = ''
                        cant = sheet.cell(m, 6)
                        # get quantity
                        if len(mid) == 15:
                            # row code is length equal 15 chars
                            obj, created = tmpcotizacion.objects.get_or_create(
                                materiales_id=mid,
                                empdni=request.user.get_profile().empdni_id,
                                defaults={'cantidad': cant.value})
                            if not created:
                                obj.cantidad = (obj.cantidad + cant.value)
                                obj.save()
                        else:
                            if cant.ctype != XL_CELL_EMPTY:
                                nothing.append({
                                    'name': sheet.cell(m, 3).value,
                                    'measure': sheet.cell(m, 4).value,
                                    'unit': sheet.cell(m, 5).value,
                                    'quantity': cant.value})
                            else:
                                continue
                    uploadFiles.removeTmp(filename)
                    context['status'] = True
                    context['list'] = nothing
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'addQuote':
                try:
                    if request.POST.get('check') == 'new':
                        quote = genkeys.GenerateKeyQuotation()
                        newQuote = True
                    elif request.POST.get('check') == 'old':
                        if request.POST.get('quote') == '':
                            quote = genkeys.GenerateKeyQuotation()
                            newQuote = True
                        else:
                            quote = request.POST.get('quote')
                            newQuote = False
                    if newQuote:
                        # Save quotation
                        obj = Cotizacion()
                        obj.cotizacion_id = quote
                        obj.empdni_id = request.user.get_profile().empdni_id
                        obj.almacen_id = request.POST.get('almacen')
                        obj.traslado = request.POST.get('traslado')
                        obj.obser = request.POST.get('obser')
                        obj.status = 'PE'
                        obj.flag = True
                        obj.save()

                    # Save Key Quotation for supplier
                    obj = CotKeys()
                    obj.cotizacion_id = quote
                    obj.proveedor_id = request.POST.get('proveedor')
                    obj.keygen = genkeys.GeneratekeysQuoteClient()
                    obj.status = 'PE'
                    obj.flag = True
                    obj.save()

                    # Save Details quotation for supplier
                    details = json.loads(request.POST.get('details'))
                    for x in details:
                        obj = DetCotizacion()
                        obj.cotizacion_id = quote
                        obj.proveedor_id = request.POST.get('proveedor')
                        obj.materiales_id = x['materials_id']
                        obj.cantidad = x['quantity']
                        obj.marca = x['brand']
                        obj.modelo = x['model']
                        obj.flag = True
                        obj.save()

                    context['quote'] = quote
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)


class ViewPurchaseSingle(JSONResponseMixin, TemplateView):
    template_name = 'logistics/purchase.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            if request.GET.get('type') == 'list':
                context = dict()
                try:
                    tmp = tmpcompra.objects.filter(
                        empdni=request.user.get_profile().empdni_id)
                    context['list'] = list()
                    # igv = 0
                    subt = 0
                    # total = 0
                    conf = Configuracion.objects.get(
                        periodo=globalVariable.get_year)
                    tdiscount = 0
                    # print conf.igv
                    for x in tmp:
                        disc = ((x.precio*x.discount)/100)
                        tdiscount += (disc*x.cantidad)
                        precio = x.precio - disc
                        print precio
                        if x.perception:
                            print ' percep precio ', conf.perception, precio
                            per = ((precio*conf.perception)/100)
                            print per, ' perception'
                            precio = per+precio
                            print precio, ' new precio'
                        amount = (precio*x.cantidad)
                        print 'precio cantidad ', precio, x.cantidad
                        subt += amount
                        context['list'].append({
                            'id': x.id,
                            'materials_id': x.materiales_id,
                            'matname': x.materiales.matnom,
                            'matmeasure': x.materiales.matmed,
                            'unit': (
                                x.unit_id if x.unit_id else x.materiales.unidad_id),
                            'brand': x.brand.brand,
                            'model': x.model.model,
                            'quantity': x.cantidad,
                            'price': x.precio,
                            'discount': x.discount,
                            'perception': conf.perception if x.perception else 0,
                            'observation': x.observation,
                            'amount': '%.2f' % amount})
                    context['discount'] = tdiscount
                    context['igv'] = ((conf.igv * subt) / 100)
                    context['subtotal'] = subt
                    context['total'] = (context['igv'] + subt)
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
        context = super(ViewPurchaseSingle, self).get_context_data(**kwargs)
        context['document'] = Documentos.objects.all().order_by('documento')
        context['pago'] = FormaPago.objects.all().order_by('pagos')
        context['currency'] = Moneda.objects.all()
        context['supplier'] = Proveedor.objects.all()
        context['projects'] = Proyecto.objects.filter(
            status='AC', flag=True).order_by('nompro')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            context = dict()
            if request.POST.get('type') == 'add':
                try:
                    form = addTmpCompraForm(request.POST)
                    if form.is_valid():
                        add = form.save(commit=False)
                        add.empdni = request.user.get_profile().empdni_id
                        add.unit_id = request.POST[
                            'unit'] if 'unit' in request.POST else None
                        form.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            # if request.POST.get('type') == 'add':
            #     try:
            #         form = addTmpCompraForm(request.POST)
            #         if form.is_valid():
            #             add = form.save(commit=False)
            #             add.empdni = request.user.get_profile().empdni_id
            #             add.save()
            #             context['status'] = True
            #         else:
            #             context['status'] = False
            #     except ObjectDoesNotExist, e:
            #         context['raise'] = e
            #         context['status'] = False
            #     return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'edit':
                try:
                    tmp = tmpcompra.objects.get(
                        pk=request.POST.get('id'),
                        materiales_id=request.POST.get('materials_id'))
                    tmp.cantidad = request.POST.get('quantity')
                    tmp.precio = request.POST.get('price')
                    tmp.discount = request.POST.get('discount')
                    tmp.brand_id = request.POST.get('brand')
                    tmp.model_id = request.POST.get('model')
                    tmp.perception = request.POST['perception']
                    if tmp.unit_id != request.POST['unit']:
                        if request.POST['unit'] == tmp.materiales.unidad_id:
                            tmp.unit_id = None
                        else:
                            tmp.unit_id = request.POST['unit']
                    tmp.save()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'del':
                try:
                    tmp = tmpcompra.objects.get(
                        pk=request.POST.get('id'),
                        materiales_id=request.POST.get('materials_id'))
                    tmp.delete()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'delall':
                try:
                    tmp = tmpcompra.objects.filter(
                        empdni=request.user.get_profile().empdni_id)
                    tmp.delete()
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            if request.POST.get('type') == 'read':
                try:
                    nothing = list()
                    # upload file
                    arch = request.FILES['archivo']
                    filename = uploadFiles.upload('/storage/temporary/', arch)
                    book = open_workbook(filename, encoding_override='utf-8')
                    sheet = book.sheet_by_index(0)
                    # recover sheet of materials
                    for m in range(10, sheet.nrows):
                        mid = sheet.cell(m, 2)
                        if mid.ctype != XL_CELL_EMPTY:
                            mid = str(int(mid.value))
                        else:
                            mid = ''
                        cant = sheet.cell(m, 6)
                        # get quantity
                        price = sheet.cell(m, 7)
                        # get price
                        if len(mid) == 15:
                            # row code is length equal 15 chars
                            obj, created = tmpcompra.objects.get_or_create(
                                materiales_id=mid,
                                empdni=request.user.get_profile().empdni_id,
                                defaults={
                                    'cantidad': cant.value,
                                    'precio': price.value})
                            if not created:
                                obj.cantidad = (obj.cantidad + cant.value)
                                obj.precio = price.value
                                obj.save()
                        else:
                            if cant.ctype != XL_CELL_EMPTY:
                                nothing.append({
                                    'name': sheet.cell(m, 3).value,
                                    'measure': sheet.cell(m, 4).value,
                                    'unit': sheet.cell(m, 5).value,
                                    'quantity': cant.value,
                                    'price': price.value})
                            else:
                                continue
                    uploadFiles.removeTmp(filename)
                    context['status'] = True
                    context['list'] = nothing
                except ObjectDoesNotExist, e:
                    context['raise'] = e
                    context['status'] = False
                return self.render_to_json_response(context, **kwargs)
            # save to oreder purchase
            try:
                if 'savePurchase' in request.POST:
                    # Set all data the form
                    form = CompraForm(request.POST, request.FILES)
                    # print form
                    if form.is_valid():
                        id = genkeys.GenerateKeyPurchase()
                        add = form.save(commit=False)
                        add.compra_id = id
                        add.empdni_id = request.user.get_profile().empdni_id
                        add.status = 'PE'
                        add.projects = request.POST[
                            'projects'] if 'projects' in request.POST else ''
                        add.discount = float(request.POST.get('discount'))
                        add.sigv = int(request.POST['sigv'])
                        add.save()
                        # save details os the order purchase
                        # details = json.loads(request.POST.get('details'))
                        for x in tmpcompra.objects.filter(
                                empdni=request.user.get_profile().empdni_id):
                            obj = DetCompra()
                            obj.compra_id = id
                            obj.materiales_id = x.materiales_id
                            obj.brand_id = x.brand_id
                            obj.model_id = x.model_id
                            obj.cantidad = x.cantidad
                            obj.precio = x.precio
                            obj.cantstatic = x.cantidad
                            obj.discount = x.discount
                            obj.perception = x.perception
                            obj.unit_id = x.unit_id
                            obj.observation = x.observation
                            obj.save()
                            # if all success delete all
                            # data of the temp purchase
                            x.delete()
                        context['status'] = True
                        context['nro'] = id
                    else:
                        context['status'] = False
                        context['raise'] = str(form)
                if 'saveComment' in request.POST:
                    tmp = tmpcompra.objects.get(id=request.POST['id'])
                    tmp.observation = request.POST['comment']
                    tmp.save()
                    context['status'] = True
            except (Exception, ObjectDoesNotExist) as e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


class ListPurchase(JSONResponseMixin, TemplateView):
    template_name = 'logistics/listPurchase.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'code' in request.GET:
                        context['list'] = [{
                            'purchase': x.compra_id,
                            'document': x.proveedor.razonsocial,
                            'projects': x.projects,
                            'transfer': globalVariable.format_date_str(
                                            x.traslado),
                            'currency': x.moneda.moneda,
                            'deposito': str(x.deposito),
                            'status': x.status}
                            for x in Compra.objects.filter(
                                flag=True, pk=request.GET.get('code'))]
                    if 'status' in request.GET:
                        context['list'] = [{
                            'purchase': x.compra_id,
                            'document': x.proveedor.razonsocial,
                            'projects': x.projects,
                            'transfer': globalVariable.format_date_str(
                                x.traslado),
                            'currency': x.moneda.moneda,
                            'deposito': str(x.deposito),
                            'status': x.status}
                            for x in Compra.objects.filter(
                                flag=True, status=request.GET.get('status'))]
                    if 'dates' in request.GET:
                        if 'start' in request.GET and 'end' not in request.GET:
                            obj = Compra.objects.filter(
                                flag=True,
                                registrado__startswith=(
                                    globalVariable.format_str_date(
                                        request.GET.get('start'))))
                        elif 'start' in request.GET and 'end' in request.GET:
                            obj = Compra.objects.filter(
                                flag=True,
                                registrado__range=(
                                    globalVariable.format_str_date(
                                        request.GET.get('start')),
                                    globalVariable.format_str_date(
                                        request.GET.get('end'))))
                        context['list'] = [{
                            'purchase': x.compra_id,
                            'document': x.proveedor.razonsocial,
                            'projects': x.projects,
                            'transfer': globalVariable.format_date_str(
                                            x.traslado),
                            'currency': x.moneda.moneda,
                            'deposito': str(x.deposito),
                            'status': x.status}
                            for x in obj]
                    if 'getpurchase' in request.GET:
                        p = Compra.objects.get(pk=request.GET.get('purchase'))
                        context['supplier'] = p.proveedor_id
                        context['reason'] = p.proveedor.razonsocial
                        context['space'] = p.lugent
                        context['document'] = p.documento_id
                        context['method'] = p.pagos_id
                        context['currency'] = p.moneda_id
                        context['transfer'] = globalVariable.format_date_str(
                                                p.traslado)
                        context['contact'] = p.contacto
                        context['discount'] = p.discount
                        context['observation'] = p.observation
                        context['igv'] = search.getIGVCurrent(
                                            p.registrado.strftime('%Y'))
                        context['details'] = [{
                            'materials': x.materiales_id,
                            'name': x.materiales.matnom,
                            'meter': x.materiales.matmed,
                            'unit': x.materiales.unidad.uninom,
                            'brand': x.brand.brand,
                            'model': x.model.model,
                            'quantity': x.cantidad,
                            'price': x.precio,
                            'discount': float(x.discount),
                            'amount': ((
                                x.precio - float(
                                    x.discount)) * x.cantidad)}
                            for x in DetCompra.objects.filter(
                                compra_id=request.GET.get('purchase')
                                ).order_by('materiales__matnom')]
                    if 'listDetails' in request.GET:
                        context['details'] = [{
                            'materials': x.materiales_id,
                            'name': x.materiales.matnom,
                            'meter': x.materiales.matmed,
                            'unit': x.materiales.unidad.uninom,
                            'brand': x.brand.brand,
                            'model': x.model.model,
                            'quantity': x.cantidad,
                            'price': x.precio,
                            'discount': float(x.discount),
                            'amount': ((
                                x.precio - float(x.discount)) * x.cantidad)}
                            for x in DetCompra.objects.filter(
                                compra_id=request.GET.get('purchase')
                                ).order_by('materiales__matnom')]
                    context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e.__str__()
                    context['status'] = False
                return self.render_to_json_response(context)
            obj = Compra.objects.filter(
                    status='PE', flag=True).order_by('-registrado')
            context['document'] = Documentos.objects.filter(
                                    flag=True).order_by('documento')
            context['payment'] = FormaPago.objects.filter(
                                    flag=True).order_by('pagos')
            context['currency'] = Moneda.objects.filter(flag=True)
            context['purchase'] = obj
            return render_to_response(
                self.template_name,
                context,
                context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404('Template not found')

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'addDPurchase' in request.POST:
                    try:
                        obj = DetCompra.objects.get(
                                compra_id=request.POST.get('purchase'),
                                materiales_id=request.POST.get('code'))
                        obj.cantidad = (float(
                            request.POST.get('quantity')) + obj.cantidad)
                        obj.cantstatic = (float(
                            request.POST.get('quantity')) + obj.cantidad)
                        obj.precio = float(request.POST.get('price')) if (
                            'price' in request.POST) else obj.precio
                        obj.discount = float(request.POST.get('discount'))
                        obj.brand_id = request.POST.get('brand') if (
                            'brand' in request.POST) else obj.brand_id
                        obj.model_id = request.POST.get('model') if (
                            'model' in request.POST) else obj.model_id
                        obj.save()
                    except ObjectDoesNotExist:
                        obj = DetCompra()
                        obj.compra_id = request.POST.get('purchase')
                        obj.materiales_id = request.POST.get('code')
                        obj.cantidad = float(request.POST.get('quantity'))
                        obj.precio = float(request.POST.get('price'))
                        obj.cantstatic = float(request.POST.get('quantity'))
                        obj.flag = '0'
                        obj.brand_id = request.POST.get('brand')
                        obj.model_id = request.POST.get('model')
                        obj.save()
                    if 'details' in request.POST:
                        for x in json.loads(request.POST.get('details')):
                            try:
                                obj = DetCompra.objects.get(
                                    compra_id=request.POST.get('purchase'),
                                    materiales_id=x['materials'])
                                obj.cantidad = ((float(
                                    request.POST.get('quantity')) * float(x[
                                        'quantity'])) + obj.cantidad)
                                obj.cantstatic = ((float(
                                    request.POST.get('quantity')) * float(x[
                                        'quantity'])) + obj.cantidad)
                                obj.save()
                            except ObjectDoesNotExist:
                                obj = DetCompra()
                                obj.compra_id = request.POST.get('purchase')
                                obj.materiales_id = x['materials']
                                obj.cantidad = (float(request.POST.get(
                                    'quantity')) * float(x['quantity']))
                                obj.precio = 0
                                obj.cantstatic = (float(request.POST.get(
                                    'quantity')) * float(x['quantity']))
                                obj.flag = '0'
                                obj.brand_id = 'BR000'
                                obj.model_id = 'MO000'
                                obj.save()
                    context['status'] = True
                if 'editDPurchase' in request.POST:
                    obj = DetCompra.objects.get(
                        compra_id=request.POST.get('purchase'),
                        materiales_id=request.POST.get('materials'))
                    obj.cantidad = float(request.POST.get('quantity'))
                    obj.cantstatic = float(request.POST.get('quantity'))
                    obj.precio = float(request.POST.get('price'))
                    obj.discount = float(request.POST.get('discount'))
                    obj.brand_id = request.POST.get('brand')
                    obj.model_id = request.POST.get('model')
                    obj.save()
                    context['status'] = True
                if 'delDPurchase' in request.POST:
                    DetCompra.objects.filter(
                        compra_id=request.POST.get('purchase'),
                        materiales_id__in=json.loads(
                            request.POST.get('materials'))).delete()
                    context['status'] = True
                if 'purchaseSave' in request.POST:
                    ob = Compra.objects.get(
                            compra_id=request.POST.get('purchase'))
                    ob.lugent = request.POST.get('delivery')
                    ob.documento_id = request.POST.get('document')
                    ob.pagos_id = request.POST.get('payment')
                    ob.moneda_id = request.POST.get('currency')
                    ob.traslado = globalVariable.format_str_date(
                                    request.POST.get('transfer'))
                    ob.contacto = request.POST.get('contact')
                    ob.discount = float(request.POST.get('discount'))
                    if request.POST['quotation']:
                        ob.quotation = request.POST['quotation']
                    if request.POST['observation']:
                        ob.observation = request.POST['observation']
                    if 'deposit' in request.FILES:
                        ob.deposito = request.FILES['deposit']
                    ob.save()
                    print 'here save buys edit'
                    context['status'] = True
                if 'annularPurchase' in request.POST:
                    an = Compra.objects.get(
                            compra_id=request.POST.get('purchase'))
                    an.status = 'AN'
                    an.save()
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)


class LoginSupplier(JSONResponseMixin, TemplateView):
    template_name = 'logistics/loginSupplier.html'

    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            if 'exists' in request.GET:
                exists = LoginProveedor.objects.filter(
                        supplier_id=request.GET.get('ruc'))
                if exists:
                    context['exists'] = {
                        'username': exists[0].username,
                        'status': True,
                        'supplier': exists[0].supplier_id}
                else:
                    context['exists'] = {'status': False}
            return self.render_to_json_response(context)
        context['supplier'] = Proveedor.objects.filter(
            flag=True).order_by('razonsocial')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'supplier' in request.POST:
                    obj = LoginProveedor.objects.filter(
                            supplier_id=request.POST.get('supplier'))
                    passwd = request.POST.get('password')
                    passwd = hashlib.sha256(b'%s' % passwd)
                    passwd = passwd.hexdigest()
                    if obj:
                        obj[0].password = passwd
                        obj[0].save()
                    else:
                        obj = LoginProveedor()
                        obj.username = request.POST.get('username')
                        obj.password = passwd
                        obj.supplier_id = request.POST.get('supplier')
                        obj.save()
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)


class SupplierCreate(CreateView):
    form_class = ProveedorForm
    model = Proveedor
    # success_url = reverse_lazy('proveedor_list')
    template_name = 'logistics/crud/supplier_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SupplierCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        # self.instance.save()
        form.save()
        return render_to_response(
                self.template_name,
                {'msg': 'success'},
                context_instance=RequestContext(self.request))


class CompareQuote(JSONResponseMixin, TemplateView):
    template_name = 'logistics/comparequote.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        try:
            print 'before quote'
            context['quote'] = Cotizacion.objects.get(
                                    Q(cotizacion_id=kwargs['quote']),
                                    ~Q(status='CO'))
            print context['quote']
            context['supplier'] = CotKeys.objects.filter(
                                    cotizacion_id=kwargs['quote'], flag=True)
            mats = DetCotizacion.objects.filter(
                    cotizacion_id=kwargs['quote']).order_by(
                        'materiales__materiales_id')
            # .distinct('materiales__materiales_id')
            context['client'] = CotCliente.objects.filter(
                                    cotizacion_id=kwargs['quote'])
            context['conf'] = Configuracion.objects.get(
                                periodo=globalVariable.get_year)
            arm = list()
            for x in mats:
                arr = list()
                data = dict()
                arsu = list()
                for j in context['supplier']:
                    try:
                        dsup = DetCotizacion.objects.get(
                                cotizacion_id=kwargs['quote'],
                                proveedor_id=j.proveedor_id,
                                materiales_id=x.materiales_id,
                                marca=x.marca,
                                modelo=x.modelo)
                        discount = (float(dsup.discount) / 100)
                        price = (dsup.precio - (float(dsup.precio) * discount))
                        amount = (price * float(x.cantidad))
                        arsu.append({
                                'supplier': j.proveedor_id,
                                'materiales_id': x.materiales_id,
                                'price': dsup.precio,
                                'discount': dsup.discount,
                                'brand': dsup.marca,
                                'model': dsup.modelo,
                                'amount': amount})
                    except ObjectDoesNotExist:
                        arsu.append({
                                'supplier': j.proveedor_id,
                                'materiales_id': x.materiales_id,
                                'price': 0,
                                'discount': 0,
                                'brand': '-',
                                'model': '-',
                                'amount': '0'})
                    # data[j.proveedor_id] = arsu
                    # {'price':dsup.precio,
                    # 'discount': dsup.discount,
                    # 'brand':dsup.marca, 'model':dsup.modelo}
                arr.append(data)
                arm.append({
                        'materials': x.materiales_id,
                        'name': x.materiales.matnom,
                        'measure': x.materiales.matmed,
                        'unit': x.materiales.unidad.uninom,
                        'quantity': x.cantidad,
                        'priceold': search.getPricePurchaseInventory(
                                        x.materiales_id),
                        'others': arsu})
            context['details'] = arm
            context['currency'] = Moneda.objects.filter(flag=True)
            context['document'] = Documentos.objects.filter(
                                    flag=True).order_by('documento')
            context['payment'] = FormaPago.objects.filter(
                                    flag=True).order_by('pagos')
            context['purchase'] = Compra.objects.filter(
                                    cotizacion_id=kwargs['quote'], flag=True)
            return render_to_response(
                self.template_name,
                context,
                context_instance=RequestContext(request))
        except ObjectDoesNotExist, e:
            raise Http404('Error %s' % (e.__str__()))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax:
            try:
                if 'purchase' in request.POST:
                    form = CompraForm(request.POST, request.FILES)
                    # print form.is_valid()
                    if form.is_valid():
                        add = form.save(commit=False)
                        purchase = genkeys.GenerateKeyPurchase()
                        add.compra_id = purchase
                        add.cotizacion_id = kwargs['quote']
                        add.flag = True
                        add.empdni_id = request.user.get_profile().empdni_id
                        try:
                            obj = Cotizacion.objects.get(
                                    cotizacion_id=kwargs['quote'])
                            if obj.suministro_id:
                                add.projects = obj.suministro.orders
                        except ObjectDoesNotExist:
                            raise
                        add.save()
                        # save the details
                        details = json.loads(request.POST.get('details'))
                        # print details
                        for x in details:
                            # consult if brand exists and model
                            brand = Brand.objects.filter(
                                        brand__icontains=x['brand'])
                            if brand or x['brand'] == unicode(None):
                                if x['brand'] == unicode(None):
                                    brand = 'BR000'
                                else:
                                    brand = brand[0].brand_id
                            else:
                                br = Brand()
                                brand = genkeys.GenerateIdBrand()
                                br.brand_id = brand
                                br.brand = x['brand']
                                br.save()
                            # print brand
                            model = Model.objects.filter(
                                        model__icontains=x['model'])
                            if model or x['model'] == unicode(None):
                                if x['model'] == unicode(None):
                                    model = 'MO000'
                                else:
                                    model = model[0].model_id
                            else:
                                mo = Model()
                                model = genkeys.GenerateIdModel()
                                mo.model_id = model
                                mo.brand_id = brand
                                mo.model = x['model']
                                mo.save()
                            # print model
                            det = DetCompra()
                            det.compra_id = purchase
                            det.materiales_id = x['materials']
                            det.brand_id = brand
                            det.model_id = model
                            det.cantidad = x['quantity']
                            det.cantstatic = x['quantity']
                            det.precio = x['price']
                            det.discount = x['discount']
                            det.flag = '1'
                            det.save()
                        # change status of models CotCliente
                        try:
                            cust = CotCliente.objects.get(
                                cotizacion_id=kwargs['quote'],
                                proveedor_id=request.POST.get('proveedor'))
                            cust.status = 'CO'
                            cust.save()
                        except ObjectDoesNotExist, e:
                            context['client'] = 'No change model CotClient'
                        # Change status of models CotKeys
                        try:
                            keys = CotKeys.objects.get(
                                cotizacion_id=kwargs['quote'],
                                proveedor_id=request.POST.get('proveedor'))
                            keys.status = 'CO'
                            keys.save()
                        except ObjectDoesNotExist, e:
                            context['keys'] = 'No change model CotKeys'
                        context['purchase'] = purchase
                        context['status'] = True
                if 'finish' in request.POST:
                    cot = Cotizacion.objects.get(pk=kwargs['quote'])
                    cot.status = 'CO'
                    cot.save()
                    # change status of cotkeys and cot cli
                    keys = CotKeys.objects.filter(
                            Q(cotizacion_id=kwargs['quote']),
                            ~Q(status='CO'))
                    if keys:
                        for x in keys:
                            x.status = 'NC'
                            x.save()
                    cust = CotCliente.objects.filter(
                            Q(cotizacion_id=kwargs['quote']),
                            ~Q(status='CO'))
                    if cust:
                        for x in cust:
                            x.status = 'NC'
                            x.save()
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)


class IngressPriceQuote(JSONResponseMixin, TemplateView):
    template_name = 'logistics/ingressprices.html'

    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'list' in request.GET:
                    context['details'] = [{
                        'pk': x.id,
                        'materials': x.materiales_id,
                        'names': '%s - %s' % (
                            x.materiales.matnom, x.materiales.matmed),
                        'unit': x.materiales.unidad.uninom,
                        'quantity': x.cantidad,
                        'price': x.precio,
                        'discount': x.discount,
                        'amount': ((x.precio - ((
                            x.precio * x.discount) / 100)) * x.cantidad),
                        'brand': x.marca,
                        'model': x.modelo,
                        'delivery': globalVariable.format_date_str(
                            x.entrega) if x.entrega else None}
                        for x in DetCotizacion.objects.filter(
                            cotizacion_id=kwargs['quote'],
                            proveedor_id=kwargs['supplier']
                            ).order_by('materiales__matnom')]
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)
        try:
            if kwargs['quote'] and kwargs['supplier']:
                if kwargs['quote'].__len__() == 10 and kwargs['supplier'].__len__() == 11:
                    context['quote'] = Cotizacion.objects.get(
                        pk=kwargs['quote'])
                    if context['quote'].status != 'PE':
                        return HttpResponseRedirect(
                            reverse_lazy('view_quote_list'))
                    else:
                        context['details'] = DetCotizacion.objects.filter(
                            cotizacion_id=kwargs['quote'],
                            proveedor_id=kwargs['supplier']).order_by(
                            'materiales__matnom')
                        obj = Configuracion.objects.filter(
                            periodo=globalVariable.get_year)[:1]
                        context['igv'] = obj[0].igv
                        context['currency'] = Moneda.objects.filter(
                            flag=True).order_by('moneda')
                        cli = CotCliente.objects.filter(
                            cotizacion_id=kwargs['quote'],
                            proveedor_id=kwargs['supplier'])
                        if cli:
                            if cli[0].status == 'CO':
                                context['disabled'] = True
                            else:
                                context['disabled'] = False
                        else:
                            context['disabled'] = False
                        context['supplier'] = kwargs['supplier']
                else:
                    return HttpResponseRedirect(
                        reverse_lazy('view_quote_list'))
            else:
                return HttpResponseRedirect(
                    reverse_lazy('view_quote_list'))
            return render_to_response(
                self.template_name,
                context,
                context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404('Template not found')

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            context = dict()
            try:
                if 'blur' in request.POST:
                    obj = DetCotizacion.objects.get(
                        Q(cotizacion_id=kwargs['quote']),
                        Q(proveedor_id=kwargs['supplier']),
                        Q(materiales_id=request.POST.get('materials')),
                        Q(id=request.POST.get('pk')))
                    if request.POST.get('blur') == 'price':
                        obj.precio = request.POST.get('val')
                        obj.save()
                        context['quantity'] = obj.cantidad
                        context['status'] = True
                    elif request.POST.get('blur') == 'desct':
                        obj.discount = request.POST.get('val')
                        obj.save()
                        context['quantity'] = obj.cantidad
                        context['status'] = True
                    elif request.POST.get('blur') == 'brands':
                        obj.marca = request.POST.get('val')
                        obj.save()
                        context['status'] = True
                    elif request.POST.get('blur') == 'models':
                        obj.modelo = request.POST.get('val')
                        obj.save()
                        context['status'] = True
                    elif request.POST.get('blur') == 'dates':
                        obj.entrega = globalVariable.format_str_date(
                            request.POST.get('val'))
                        obj.save()
                        context['status'] = True
                if request.POST.get('type') == 'file':
                    sheet = request.FILES['sheet']
                    uri = '/storage/quotations/%s/%s/' % (
                        kwargs['quote'], kwargs['supplier'])
                    name = '%s%s.pdf' % (uri, request.POST.get('materials'))
                    if uploadFiles.fileExists(name, True):
                        uploadFiles.deleteFile(name, True)
                    filename = uploadFiles.upload(uri, sheet, {
                        'name': request.POST.get('materials')})
                    if filename:
                        context['status'] = True
                    else:
                        context['status'] = False
                if 'client' in request.POST:
                    obj = CotCliente.objects.filter(
                        proveedor_id=kwargs['supplier'],
                        cotizacion_id=kwargs['quote'])
                    if not obj:
                        obj = CotCliente()
                        obj.proveedor_id = kwargs['supplier']
                        obj.cotizacion_id = kwargs['quote']
                        obj.envio = globalVariable.format_str_date(
                                        request.POST.get('traslado'))
                        obj.validez = globalVariable.format_str_date(
                            request.POST.get('validez'))
                        obj.contacto = request.POST.get('contacto')
                        obj.moneda_id = request.POST.get('moneda')
                        obj.obser = request.POST.get('obser')
                        obj.status = 'SD'
                        obj.flag = True
                        obj.save()
                        context['status'] = True
                        context['supplier'] = kwargs['supplier']
                        su = None
                        try:
                            su = Proveedor.objects.get(pk=kwargs['supplier'])
                            context['reason'] = su.razonsocial
                        except ObjectDoesNotExist, e:
                            su = 'Nothing'
                            print e
                        context['quote'] = kwargs['quote']
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)


class ListCompressed(JSONResponseMixin, TemplateView):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            pass
        else:
            try:
                queryset = MetProject.objects.extra(select={'stock': "SELECT stock FROM almacen_inventario WHERE operations_metproject.materiales_id LIKE almacen_inventario.materiales_id AND periodo LIKE to_char(now(), 'YYYY')"}).extra(select={ 'precompra': "SELECT precompra FROM almacen_inventario WHERE operations_metproject.materiales_id LIKE almacen_inventario.materiales_id AND periodo LIKE to_char(now(), 'YYYY')"}).filter(proyecto_id=kwargs['pro'], subproyecto_id=None)
                queryset = queryset.values(
                    'materiales_id',
                    'materiales__matnom',
                    'materiales__matmed',
                    'materiales__unidad__uninom',
                    'brand_id',
                    'model_id',
                    'brand__brand',
                    'model__model',
                    'precio',
                    'stock',
                    'precompra')
                queryset = queryset.annotate(
                    cantidad=Sum('cantidad')).annotate(
                    orders=Sum('quantityorder')).order_by('materiales__matnom')
                # met = MetProject.objects.filter(
                #    proyecto_id=kwargs['pro'],
                #    subproyecto_id=None
                # ).distinct('materiales__materiales_id')
                data = list()
                for x in queryset:
                    # stock = 0
                    # pbuy = 0
                    # result = Inventario.objects.filter(
                    #     materiales_id=x['materiales_id'],
                    #     periodo=globalVariable.get_year
                    # )
                    # if not result:
                    #     stock = '-'
                    #     pbuy = '-'
                    # else:
                    #     stock = result[0].stock
                    #     pbuy = result[0].precompra
                    data.append({
                        'materials': x['materiales_id'],
                        'name': x['materiales__matnom'],
                        'measure': x['materiales__matmed'],
                        'unit': x['materiales__unidad__uninom'],
                        'brand_id': x['brand_id'],
                        'model_id': x['model_id'],
                        'brand': x['brand__brand'],
                        'model': x['model__model'],
                        'quantity': x['orders'],
                        'cantidad': x['cantidad'],
                        'psale': x['precio'],
                        'ppurchase': x['precompra'],
                        'remainder': (x['cantidad'] - x['orders']),
                        'stock': x['stock']})
                context['compress'] = data
                return render_to_response(
                    'logistics/compressedProject.html',
                    context,
                    context_instance=RequestContext(request))
            except TemplateDoesNotExist, e:
                raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'quote' in request.POST:
                    for x in json.loads(request.POST.get('details')):
                        try:
                            obj = tmpcotizacion.objects.get(
                                empdni=request.user.get_profile().empdni_id,
                                materiales_id=x['materials'],
                                brand_id=x['brand'],
                                model_id=x['model']
                            )
                            obj.cantidad += x['quantity']
                            obj.save()
                        except ObjectDoesNotExist:
                            obj = tmpcotizacion()
                            obj.empdni = request.user.get_profile().empdni_id
                            obj.materiales_id = x['materials']
                            obj.cantidad = x['quantity']
                            obj.brand_id = x['brand']
                            obj.model_id = x['model']
                            obj.save()
                    context['status'] = True
                if 'purchase' in request.POST:
                    for x in json.loads(request.POST.get('details')):
                        try:
                            obj = tmpcompra.objects.get(
                                empdni=request.user.get_profile().empdni_id,
                                materiales_id=x['materials'],
                                brand_id=x['brand'],
                                model_id=x['model']
                            )
                            obj.cantidad += x['quantity']
                            obj.save()
                        except ObjectDoesNotExist:
                            obj = tmpcompra()
                            obj.empdni = request.user.get_profile().empdni_id
                            obj.materiales_id = x['materials']
                            obj.cantidad = x['quantity']
                            obj.brand_id = x['brand']
                            obj.model_id = x['model']
                            obj.save()
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)


class ListServiceOrders(JSONResponseMixin, TemplateView):

    template_name = 'logistics/listorderservice.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if '' in request.GET:
                        pass
                except ObjectDoesNotExist as e:
                    kwargs['raise'] = str(e)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ex:
            raise Http404(ex)

class ServiceOrders(JSONResponseMixin, TemplateView):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'changeProject' in request.GET:
                    address = Proyecto.objects.get(pk=request.GET.get('pro'))
                    sub = Subproyecto.objects.filter(
                        proyecto_id=request.GET.get('pro'))
                    context['address'] = address.direccion
                    context['subprojects'] = [{
                        'id': x.subproyecto_id,
                        'subproject': x.subproyecto}
                        for x in sub]
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)
        else:
            try:
                context['project'] = Proyecto.objects.filter(
                    flag=True,
                    status='AC')
                context['supplier'] = Proveedor.objects.filter(flag=True)
                context['document'] = Documentos.objects.filter(
                                        flag=True).order_by('documento')
                context['method'] = FormaPago.objects.filter(
                                        flag=True).order_by('pagos')
                context['authorized'] = Employee.objects.filter(flag=True)
                context['unit'] = Unidade.objects.filter(flag=True)
                context['vigv'] = search.getIGVCurrent()
                context['service'] = ServiceOrder.objects.filter(
                                        flag=True).order_by('-serviceorder_id')
                context['currency'] = Moneda.objects.filter(flag=True)
                return render_to_response(
                    'logistics/serviceorder.html',
                    context,
                    context_instance=RequestContext(request))
            except TemplateDoesNotExist, e:
                raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'additem' in request.POST:
                    if not 'serorddet' in request.session:
                        request.session['serorddet'] = list()
                    tmp = request.session['serorddet']
                    if 'pk' in request.POST:
                        for x in tmp:
                            if x['item'] == int(request.POST.get('pk')):
                                x['description'] = request.POST.get('desc')
                                x['unit'] = request.POST.get('unit')
                                x['quantity'] = request.POST.get('quantity')
                                x['price'] = request.POST.get('price')
                                x['amount'] = (float(request.POST.get(
                                    'quantity')) * float(
                                    request.POST.get('price')))
                                break
                    else:
                        tmp.append({
                            'item': len(request.session.get('serorddet')) + 1,
                            'description': request.POST.get('desc'),
                            'unit': request.POST.get('unit'),
                            'quantity': request.POST.get('quantity'),
                            'price': request.POST.get('price'),
                            'amount': (float(request.POST.get(
                                    'quantity')) * float(
                                request.POST.get('price')))})
                    request.session['serorddet'] = tmp
                    context['list'] = request.session.get('serorddet')
                    context['status'] = True
                if 'list' in request.POST:
                    # print request.session['serorddet']
                    context['list'] = request.session.get('serorddet')
                    context['status'] = True
                if 'edit' in request.POST:
                    for x in request.session.get('serorddet'):
                        if x['item'] == request.POST.get('pk'):
                            x['description'] = request.POST.get('desc')
                            x['unit'] = request.POST.get('unit')
                            x['quantity'] = request.POST.get('quantity')
                            x['price'] = request.POST.get('quantity')
                            x['amount'] = (float(request.POST.get(
                                    'quantity')) * float(
                                request.POST.get('price')))
                if 'del' in request.POST:
                    item = 1
                    tmp = request.session['serorddet']
                    for d in json.loads(request.POST.get('items')):
                        for x in request.session['serorddet']:
                            if x['item'] == int(d):
                                print 'remove ', x, ' content ', d
                                tmp.remove(x)
                    request.session['serorddet'] = tmp
                    for x in request.session['serorddet']:
                        x['item'] = item
                        item += 1
                    context['list'] = request.session['serorddet']
                    context['status'] = True
                if 'generateService' in request.POST:
                    form = ServiceOrderForm(request.POST, request.FILES)
                    # print form
                    # print form.is_valid()
                    if form.is_valid():
                        add = form.save(commit=False)
                        service = genkeys.GenerateIdServiceOrder()
                        add.serviceorder_id = service
                        add.elaborated_id = request.user.get_profile(
                            ).empdni_id
                        add.save()
                        # save details
                        for x in request.session['serorddet']:
                            obj = DetailsServiceOrder()
                            obj.serviceorder_id = service
                            obj.description = x['description']
                            obj.unit_id = x['unit']
                            obj.quantity = x['quantity']
                            obj.price = x['price']
                            obj.save()
                        del request.session['serorddet']
                        context['service'] = service
                        context['status'] = True
                    else:
                        context['status'] = False
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)

class EditServiceOrder(JSONResponseMixin, TemplateView):

    template = 'logistics/editOrderService.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if 'lnumber' in request.GET:
                        kwargs['letter'] = number_to_char.numero_a_letras(float(request.GET['number']))
                        kwargs['status'] = True
                    if 'details' in request.GET:
                        kwargs['details'] = json.loads(
                            serializers.serialize(
                                'json',
                                DetailsServiceOrder.objects.filter(
                                    serviceorder_id=kwargs['oservice'])))
                        kwargs['status'] = True
                    if 'load' in request.GET:
                        os = ServiceOrder.objects.get(serviceorder_id=kwargs['oservice'])
                        kwargs['data'] = json.loads(
                            serializers.serialize(
                                'json',
                                [os]))
                        kwargs['data'] = kwargs['data'][0]['fields']
                        kwargs['projects'] = json.loads(
                            serializers.serialize(
                                'json',
                                Proyecto.objects.filter(
                                    flag=True).exclude(status='AN').order_by('-registrado')))
                        kwargs['supplier'] = json.loads(
                            serializers.serialize(
                                'json',
                                Proveedor.objects.filter(flag=True)))
                        kwargs['currencys'] = json.loads(
                            serializers.serialize(
                                'json',
                                Moneda.objects.filter(flag=True)))
                        kwargs['document'] = json.loads(
                            serializers.serialize(
                                'json',
                                Documentos.objects.filter(flag=True)))
                        kwargs['method'] = json.loads(
                            serializers.serialize(
                                'json',
                                FormaPago.objects.filter(flag=True)))
                        kwargs['authorized'] = json.loads(
                            serializers.serialize(
                                'json', Employee.objects.filter(flag=True)))
                        kwargs['unit'] = json.loads(
                            serializers.serialize(
                                'json', Unidade.objects.filter(flag=True)))
                        y = globalVariable.format_date_str(_date=os.register, format='%Y')
                        kwargs['vigv'] = search.getIGVCurrent(year=y)
                        kwargs['status'] = True
                except ObjectDoesNotExist as e:
                    kwargs['raise'] = str(e)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return render(request, self.template, kwargs)
        except TemplateDoesNotExist as e:
            raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        # print request.POST
        # print request.is_ajax(), 'IS AJAX'
        if request.is_ajax():
            try:
                if 'editd' in request.POST:
                    # print request.POST
                    # e = DetailsServiceOrder.objects.get(
                    #         pk=request.POST['pk'],
                    #         serviceorder_id=kwargs['oservice'])
                    # e.description = request.POST['description']
                    # e.unit_id = request.POST['unit']
                    # e.quantity = request.POST['quantity']
                    # e.price = request.POST['price']
                    # e.save()
                    # kwargs['status'] = True
                    pass
                if 'saveOrder' in request.POST:
                    print request.POST
                    details = json.loads(request.POST['det'])
                    if len(details) > 0:
                        # save updade and create new details
                        for x in details:
                            if x['model'] == 'add':
                                DetailsServiceOrder.objects.create( serviceorder_id=kwargs['oservice'],
                                                                    description=x['fields']['description'],
                                                                    unit_id=x['fields']['unit'],
                                                                    quantity=x['fields']['quantity'],
                                                                    price=x['fields']['price'])
                            else:
                                try:
                                    ds = DetailsServiceOrder.objects.get(serviceorder_id=kwargs['oservice'], pk=x['pk'])
                                    ds.description = x['fields']['description']
                                    ds.unit_id = x['fields']['unit']
                                    ds.quantity = x['fields']['quantity']
                                    ds.price = x['fields']['price']
                                    ds.save()
                                except DetailsServiceOrder.DoesNotExist:
                                    print e
                    # we walk for delete items
                    dels = json.loads(request.POST['del'])
                    if len(dels) > 0: 
                        for x in dels:
                            if x['model'] != 'add':
                                try:
                                    dl = DetailsServiceOrder.objects.get(serviceorder_id=kwargs['oservice'], pk=x['pk'])
                                    dl.delete()
                                except DetailsServiceOrder as ex:
                                    print ex
                    # save bedside service order
                    s = json.loads(request.POST['so'])
                    print s
                    so = ServiceOrder.objects.get(serviceorder_id=kwargs['oservice'])
                    so.project_id = s['project']
                    so.supplier_id = s['supplier']
                    so.quotation = s['quotation']
                    so.arrival = s['arrival']
                    so.document_id = s['document']
                    so.method_id = s['method']
                    so.start = s['start']
                    so.term = s['term']
                    so.dsct = s['dsct']
                    so.elaborated_id = s['elaborated']
                    so.authorized_id = s['authorized']
                    so.currency_id = s['currency']
                    so.sigv = s['sigv']
                    so.tag = s['tag']
                    so.save()
                    kwargs['status'] = True
            except ObjectDoesNotExist as e:
                kwargs['status'] = False
                kwargs['raise'] = str(e)
            return self.render_to_json_response(kwargs)


class PriceMaterialsViews(JSONResponseMixin, TemplateView):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'searchCode' in request.GET:
                    det = DetCompra.objects.filter(
                            materiales_id=request.GET['code']
                            ).distinct(
                            'materiales__materiales_id').order_by(
                            'materiales__materiales_id')
                    # print det.count()
                    context['details'] = [{
                        'code': det[0].materiales_id,
                        'name': det[0].materiales.matnom,
                        'metering': det[0].materiales.matmed}]
                    context['status'] = True
                if 'searchName' in request.GET:
                    det = DetCompra.objects.filter(
                            materiales__matnom__icontains=request.GET['name'])
                    det = det.distinct(
                        'materiales__matnom',
                        'materiales__matmed')
                    # print DetCompra.objects.all().count()
                    context['details'] = [{
                        'code': x.materiales_id,
                        'name': x.materiales.matnom,
                        'metering': x.materiales.matmed}
                        for x in det]
                    context['status'] = True
                if 'prices' in request.GET:
                    det = DetCompra.objects.filter(
                        materiales_id=request.GET['code']
                        ).order_by('-compra__registrado')[:5]
                    context['data'] = {
                        'code': det[0].materiales_id,
                        'name': det[0].materiales.matnom,
                        'metering': det[0].materiales.matmed,
                        'unit': det[0].materiales.unidad.uninom}
                    context['prices'] = [{
                        'purchase': x.compra_id,
                        'supplier': x.compra.proveedor.razonsocial,
                        'currency': x.compra.moneda.moneda,
                        'date': x.compra.registrado.strftime('%d-%m-%Y'),
                        'price': x.precio}
                        for x in det]
                    context['status'] = True
            except ObjectDoesNotExist as e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        else:
            try:
                return render(request, 'logistics/searchprices.html', context)
            except TemplateDoesNotExist as e:
                raise Http404(e)

class ConsultPurchase(JSONResponseMixin, TemplateView):

    def get(self, request, *args, **kwargs):
        try:
            context = dict()
            if request.is_ajax():
                try:
                    if 'byPurchase' in request.GET:
                        context['details'] = json.loads(serializers.serialize(
                            'json',
                            DetCompra.objects.filter(compra_id=request.GET['compra']),
                            relations=(
                                'compra',
                                'materiales',
                                'brand',
                                'model',)))
                        context['bedside'] = json.loads(serializers.serialize(
                            'json',
                            Compra.objects.filter(compra_id=request.GET['compra']),
                            relations=('proveedor','moneda','documento', 'pagos')))
                        context['status'] = True
                    if 'byMaterials' in request.GET:
                        d = DetCompra.objects.filter(
                                    materiales__matnom__icontains=request.GET['materials']).values('materiales_id')
                        # print d.count()
                        d = d.order_by('materiales__materiales_id').distinct('materiales__materiales_id')
                        # print d
                        # print d.count()
                        m = Materiale.objects.filter(materiales_id__in=[x['materiales_id'] for x in d])
                        context['result'] = json.loads(
                            serializers.serialize(
                                'json',
                                m))
                        context['status'] = True
                    if 'getMaterialHist' in request.GET:
                        if 'year' in request.GET:
                            dc = DetCompra.objects.filter(
                                    materiales_id=request.GET['materiales'],
                                    compra__registrado__year=request.GET['year'])
                        else:
                            dc = DetCompra.objects.filter(
                                materiales_id=request.GET['materiales']).order_by('-compra__registrado')
                            context['years'] = list(set([x.compra.registrado.strftime('%Y') for x in dc]))
                            dc = dc.filter(compra__registrado__year=dc[0].compra.registrado.strftime('%Y'))
                        context['resumen'] = json.loads(
                            serializers.serialize(
                                'json',
                                dc, relations=('materiales', 'compra', 'brand', 'model',)))
                        context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = str(e)
                    context['status'] = False
                return self.render_to_json_response(context)
            return render(request, 'logistics/consultpurchase.html', context)
        except TemplateDoesNotExist, e:
            raise Http404(e)
