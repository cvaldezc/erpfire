# -*- coding: utf-8 -*-

import json
import hashlib

from django.db.models import Q, Count
from django.core import serializers
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_list_or_404,get_object_or_404
from django.utils import simplejson
from django.utils.decorators import method_decorator
from django.template import RequestContext, TemplateDoesNotExist
from django.views.generic import TemplateView, View, ListView
from django.views.generic.edit import CreateView
from django.core.urlresolvers import reverse_lazy

from CMSGuias.apps.home.models import LoginProveedor, Configuracion, Moneda, Proveedor
from CMSGuias.apps.logistica.models import Cotizacion, DetCotizacion, CotCliente, CotKeys, Compra, DetCompra
from CMSGuias.apps.tools import globalVariable, uploadFiles


### Class Bases Views generic

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

class SignUpSupplier(TemplateView):
    template_name = 'suppliers/signup.html'

    def get(self, request, *args, **kwargs):
        if 'access' in request.session:
            return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        else:
            return render_to_response(self.template_name, context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        context = dict()
        try:
            supplier = request.POST.get('supplier')
            username = request.POST.get('username')
            passwd = request.POST.get('password')
            passwd = hashlib.sha256(b'%s'%passwd)
            passwd = passwd.hexdigest()
            if supplier != '':
                if username != '':
                    if passwd != '':
                        try:
                            obj = LoginProveedor.objects.get(supplier_id=supplier, username=username, password=passwd)
                            request.session['access'] = True
                            request.session['username'] = obj.username
                            request.session['ruc'] = obj.supplier_id
                            request.session['reason'] = obj.supplier.razonsocial
                            return HttpResponseRedirect(reverse_lazy('supplier_home'))
                        except ObjectDoesNotExist, e:
                            context['msg'] = 'El usuario o contraseña son incorrectos. Vuelva a intentarlo.'
                    else:
                        context['msg'] = 'El password es incorrecto.'
                else:
                    context['msg'] = 'El username es incorrecto.'
            else:
                context['msg'] = 'El RUC es incorrecto.'
            return render_to_response(self.template_name, context, context_instance=RequestContext(request))
        except ObjectDoesNotExist, e:
            context['raise'] = e.__str__()

class SignOutSupplier(View):
    def get(self, request, *args, **kwargs):
        if request.session['access']:
            del request.session['access']
            del request.session['username']
            del request.session['reason']
            del request.session['ruc']
        return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))

# view home logistics
class SupplierHome(TemplateView):
    template_name = 'suppliers/home.html'

    def get(self, request, *args, **kwargs):
        if not 'access' in request.session:
            if not request.session.get('access'):
                return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        return render_to_response(self.template_name, context_instance=RequestContext(request))

class ListQuote(JSONResponseMixin, TemplateView):
    template_name = 'suppliers/listquote.html'

    def get(self, request, *args, **kwargs):
        context = dict()
        if not 'access' in request.session:
            if not request.session.get('access'):
                return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        try:
            context['quote'] = CotKeys.objects.filter(Q(proveedor_id=request.session.get('ruc')), ~Q(status='CO'))
            return render_to_response(self.template_name, context, context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404('Template no Found')

    def post(self, request, *args, **kwargs):

        if request.is_ajax():
            context = dict()
            try:
                obj = CotKeys.objects.get(cotizacion_id=request.POST.get('quote'), proveedor_id=request.POST.get('ruc'), keygen=request.POST.get('key'))
                context['status'] = True
                context['quote'] = obj.cotizacion_id
                context['supplier'] = obj.proveedor_id
            except ObjectDoesNotExist, e:
                context['raise'] = e.__str__()
                context['status'] = False
            return self.render_to_json_response(context)

class ListDetailsQuote(JSONResponseMixin, TemplateView):
    template_name = "suppliers/detilsquote.html"

    def get(self, request, *args, **kwargs):
        context = dict()
        if not 'access' in request.session:
            if not request.session.get('access'):
                return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        else:
            if request.is_ajax():
                try:
                    if 'list' in request.GET:
                        context['details'] = [
                            {
                                'pk': x.id,
                                'materials': x.materiales_id,
                                'names': '%s - %s'%(x.materiales.matnom, x.materiales.matmed),
                                'unit': x.materiales.unidad.uninom,
                                'quantity': x.cantidad,
                                'price': x.precio,
                                'discount': x.discount,
                                'amount': ((x.precio - ((x.precio * x.discount) / 100)) * x.cantidad),
                                'brand': x.marca,
                                'model': x.modelo,
                                'delivery': globalVariable.format_date_str(x.entrega) if x.entrega else None
                            }
                            for x in DetCotizacion.objects.filter(cotizacion_id=kwargs['quote'], proveedor_id=kwargs['supplier']).order_by('materiales__matnom')
                        ]
                        context['status'] = True
                except ObjectDoesNotExist, e:
                    context['raise'] = e.__str__()
                    context['status'] = False
                return self.render_to_json_response(context)
            try:
                if kwargs['quote'] and kwargs['supplier']:
                    if kwargs['quote'].__len__() == 10 and kwargs['supplier'].__len__() == 11:
                        if kwargs['supplier'] == request.session.get('ruc'):
                            context['quote'] = Cotizacion.objects.get(pk=kwargs['quote'])
                            if context['quote'].status != 'PE':
                                return HttpResponseRedirect(reverse_lazy('supplier_quote'))
                            else:
                                context['details'] = DetCotizacion.objects.filter(cotizacion_id=kwargs['quote'], proveedor_id=kwargs['supplier']).order_by('materiales__matnom')
                                obj = Configuracion.objects.filter(periodo=globalVariable.get_year)[:1]
                                context['igv'] = obj[0].igv
                                context['currency'] = Moneda.objects.filter(flag=True).order_by('moneda')
                                cli = CotCliente.objects.filter(cotizacion_id=kwargs['quote'], proveedor_id=kwargs['supplier'])
                                # print cli
                                if cli:
                                    context['disabled'] = True
                                else:
                                    context['disabled'] = False
                                # print context['disabled']
                        else:
                            return HttpResponseRedirect(reverse_lazy('supplier_quote'))
                    else:
                        return HttpResponseRedirect(reverse_lazy('supplier_quote'))
                else:
                    return HttpResponseRedirect(reverse_lazy('supplier_quote'))
                return render_to_response(self.template_name, context, context_instance=RequestContext(request))
            except TemplateDoesNotExist, e:
                raise Http404('Template not found')

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            context = dict()
            try:
                if 'blur' in request.POST:
                    # obj = DetCotizacion.objects.get(cotizacion_id=kwargs['quote'], proveedor_id=kwargs['supplier'], materiales_id=request.POST.get('materials'))
                    obj = DetCotizacion.objects.get(Q(cotizacion_id=kwargs['quote']), Q(proveedor_id=kwargs['supplier']), Q(materiales_id=request.POST.get('materials')), Q(id=request.POST.get('pk')))
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
                        obj.entrega = globalVariable.format_str_date(request.POST.get('val'))
                        obj.save()
                        context['status'] = True
                if request.POST.get('type') == 'file':
                    sheet = request.FILES['sheet']
                    uri = '/storage/quotations/%s/%s/'%(kwargs['quote'], kwargs['supplier'])
                    name = '%s%s.pdf'%(uri, request.POST.get('materials'))
                    if uploadFiles.fileExists(name, True):
                        uploadFiles.deleteFile(name, True)

                    filename = uploadFiles.upload(uri, sheet, {'name':request.POST.get('materials')})
                    if filename:
                        context['status'] = True
                    else:
                        context['status'] = False
                if 'client' in request.POST:
                    obj = CotCliente.objects.filter(proveedor_id=kwargs['supplier'], cotizacion_id=kwargs['quote'])
                    if not obj:
                        obj = CotCliente()
                        obj.proveedor_id = kwargs['supplier']
                        obj.cotizacion_id = kwargs['quote']
                        obj.envio = globalVariable.format_str_date(request.POST.get('traslado'))
                        obj.validez = globalVariable.format_str_date(request.POST.get('validez'))
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

class ListOrderPurchase(TemplateView):
    template_name = 'suppliers/listpurchase.html'

    def get(self, request, *args, **kwargs):
        context = dict()
        if not 'access' in request.session:
            if not request.session.get('access'):
                return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        try:
            context['purchase'] = Compra.objects.filter(Q(proveedor_id=request.session.get('ruc')), ~Q(status='CO'))
            return render_to_response(self.template_name, context, context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404('Template no Found')

class ChangePassword(TemplateView):
    template_name = 'suppliers/changepasswd.html'

    def get_context_data(self, **kwargs):
        context = super(ChangePassword, self).get_context_data(**kwargs)
        if not 'access' in self.request.session:
            if not self.request.session.get('access'):
                return HttpResponseRedirect(reverse_lazy('view_supplier_signup'))
        return context

    def post(self, request, *args, **kwargs):
        context =dict()
        try:
            if 'confirm' in request.POST:
                if request.POST.get('passwd').strip() == request.POST.get('confirm').strip():
                    try:
                        obj = LoginProveedor.objects.get(supplier_id=request.session.get('ruc'))
                        passwd = request.POST.get('confirm')
                        passwd = hashlib.sha256(b'%s'%passwd)
                        passwd = passwd.hexdigest()
                        obj.password = passwd
                        obj.save()
                        context['msg'] = 'se ha cambiado la contraseña correctamente.'
                        context['alert'] = 'success'
                    except ObjectDoesNotExist, e:
                        context['msg'] = 'El usuario no existe, comuniquese para proceder con el registro.'
                        context['alert'] = 'warning'
                else:
                    context['msg'] = 'La contraseña ingresada no coinciden.'
                    context['alert'] = 'warning'
            return render_to_response(self.template_name, context,context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404