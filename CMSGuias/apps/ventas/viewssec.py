#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# standard library
import json

# Django library
# from django.db.models import Sum
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.template import TemplateDoesNotExist
from django.views.generic import View, TemplateView

# local Django
from .models import Proyecto, CloseProject
from ..home.models import Emails
from ..tools.globalVariable import date_now, get_pin, emails, status
from ..tools.uploadFiles import descompressRAR, get_extension


class JSONResponseMixin(object):

    def render_to_json_response(self, context, **response_kwargs):
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs)

    def convert_context_to_json(self, context):
        return json.dumps(
            context,
            encoding='utf-8',
            cls=DjangoJSONEncoder)


class ClosedProjectView(JSONResponseMixin, View):
    """Closed Sales Project"""
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if 'load' in request.GET:
                        kwargs['closed'] = json.loads(
                            serializers.serialize(
                                'json',
                                CloseProject.objects.filter(
                                    project_id=kwargs['pro'])))
                        kwargs['status'] = True
                    if 'gcomplete' in request.GET:
                        kwargs['documents'] = dict()
                        kwargs['complete'] = {
                            'storage': False,
                            'operations': False,
                            'quality': False,
                            'accounting': False,
                            'sales': False}
                        cldata = CloseProject.objects.get(project_id=kwargs['pro'])
                        if cldata.storageclose != None and cldata.storageclose != False:
                            kwargs['complete']['storage'] = True
                        if cldata.letterdelivery != None and cldata.letterdelivery != '':
                            kwargs['complete']['operations'] = True
                            kwargs['documents']['operations'] = str(cldata.letterdelivery)
                        if cldata.documents != None and cldata.documents != '':
                            kwargs['complete']['quality'] = True
                            kwargs['documents']['quality'] = str(cldata.documents)
                        if cldata.accounting != None and cldata.accounting != False:
                            kwargs['complete']['accounting'] = True
                            kwargs['documents']['accounting'] = str(cldata.fileaccounting)
                        if cldata.status != None and cldata.status != 'PE':
                            kwargs['complete']['sales'] = True
                        kwargs['status'] = True
                except (ObjectDoesNotExist) as ex:
                    kwargs['status'] = False
                    kwargs['raise'] = str(ex)
                return self.render_to_json_response(kwargs)
            kwargs['pr'] = Proyecto.objects.get(proyecto_id=kwargs['pro'], flag=True)
            return render(request, 'sales/closedproject.html', kwargs)
        except TemplateDoesNotExist as ex:
            raise Http404(ex)
        return HttpResponse('GET request!')

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            try:
                prj = dict()
                try:
                    prj = Proyecto.objects.get(proyecto_id=kwargs['pro'])
                    kwargs['pr'] = {
                        'pk': prj.proyecto_id,
                        'name': prj.nompro.upper(),
                        'customers': prj.ruccliente.razonsocial.upper(),
                        'company': request.session.get('company')}
                    issue = 'APERTURA DE PROYECTO %s %s - %s' % (
                        prj.proyecto_id, prj.nompro, prj.ruccliente.razonsocial)
                    fsmail = Emails.objects.filter(issue=issue)
                    kwargs['fors'] = fsmail[0].fors if fsmail else ','.join(emails)
                except Proyecto.DoesNotExist:
                    pass
                if 'storage' in request.POST:
                    try:
                        cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    except (CloseProject.DoesNotExist) as ex:
                        cldt = CloseProject()
                        cldt.project_id = kwargs['pro']
                    cldt.storageclose = True
                    cldt.datestorage = date_now('datetime')
                    cldt.performedstorage_id = request.user.get_profile().empdni_id
                    cldt.save()
                    kwargs['area'] = 'ALMACÉN'
                    kwargs['status'] = True
                if 'operations' in request.POST:
                    try:
                        cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    except (CloseProject.DoesNotExist) as ex:
                        cldt = CloseProject()
                        cldt.project_id = kwargs['pro']
                    cldt.letterdelivery = request.FILES['letter']
                    cldt.dateletter = date_now('datetime')
                    cldt.performedoperations_id = request.user.get_profile().empdni_id
                    cldt.save()
                    kwargs['area'] = 'OPERACIONES'
                    kwargs['status'] = True
                if 'quality' in request.POST:
                    try:
                        cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    except (CloseProject.DoesNotExist) as ex:
                        cldt = CloseProject()
                        cldt.project_id = kwargs['pro']
                    cldt.documents = request.FILES['documents']
                    cldt.docregister = date_now('datetime')
                    cldt.performeddocument_id = request.user.get_profile().empdni_id
                    cldt.save()
                    if get_extension(cldt.documents.name) == '.rar':
                        descompressRAR(cldt.documents)
                    kwargs['area'] = 'CALIDAD'
                    kwargs['status'] = True
                if 'accounting' in request.POST:
                    try:
                        cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    except (CloseProject.DoesNotExist) as ex:
                        cldt = CloseProject()
                        cldt.project_id = kwargs['pro']
                    if 'tinvoice' in request.POST:
                        if request.POST['tinvoice'] > -1:
                            cldt.tinvoice = request.POST['tinvoice']
                    if 'tiva' in request.POST:
                        if request.POST['tiva'] > -1:
                            cldt.tiva = request.POST['tiva']
                    if 'otherin' in request.POST:
                        if request.POST['otherin'] > -1:
                            cldt.otherin = request.POST['otherin']
                    if 'otherout' in request.POST:
                        if request.POST['otherout'] > -1:
                            cldt.otherout = request.POST['otherout']
                    if 'retention' in request.POST:
                        if request.POST['retention'] > -1:
                            cldt.retention = request.POST['retention']
                    if 'fileaccounting' in request.FILES:
                        cldt.fileaccounting = request.FILES['fileaccounting']
                    cldt.performedaccounting_id = request.user.get_profile().empdni_id
                    cldt.save()
                    if get_extension(cldt.fileaccounting) == '.rar':
                        descompressRAR(cldt.fileaccounting)
                    kwargs['status'] = True
                if 'quitaccounting' in request.POST:
                    cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    cldt.accounting = True
                    cldt.save()
                    kwargs['area'] = 'CONTABILIDAD'
                    kwargs['status'] = True
                if 'sales' in request.POST:
                    cldt = CloseProject.objects.get(project_id=kwargs['pro'])
                    if 'genpin' in request.POST:
                        cldt.closeconfirm = get_pin()
                        cldt.save()
                        kwargs['pin'] = cldt.closeconfirm
                        kwargs['company'] = request.session['company']['name']
                        kwargs['name'] = cldt.project.nompro
                        kwargs['mail'] = request.user.get_profile().empdni.email
                        kwargs['status'] = True
                    if 'closed' in request.POST:
                        if request.POST['confirm'] == cldt.closeconfirm:
                            cldt.dateclose = date_now('datetime')
                            cldt.performedclose_id = request.user.get_profile().empdni_id
                            cldt.status = 'CO'
                            cldt.save()
                            prj = Proyecto.objects.get(proyecto_id=kwargs['pro'])
                            prj.status = 'CL'
                            prj.flag = True
                            prj.save()
                            kwargs['area'] = 'VENTAS | PROYECTO CERRADO'
                            kwargs['status'] = True
            except (ObjectDoesNotExist) as ex:
                kwargs['raise'] = str(ex)
                kwargs['status'] = False
            return self.render_to_json_response(kwargs)


class StatusProject(View):
    """Show status Project"""
    template_name = 'sales/status.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        """process get"""
        try:
            kwargs['pro'] = Proyecto.objects.get(proyecto_id=kwargs['pk'])
            kwargs['sts'] = status[kwargs['pro'].status]
            return render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ex:
            raise Http404(ex)



class GeneralExpenses(JSONResponseMixin, TemplateView):
    '''
    create and keep other expenses for the project
    '''

    template_name = 'sales/generalexpenses.html'

    # @method_decorator(login_required)
    def get_context_data(self, **kwargs):
        context = super(GeneralExpenses, self).get_context_data(**kwargs)
        return context
