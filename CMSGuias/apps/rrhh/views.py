#!/usr/bin/env python
#-*- conding: utf-8 -*-

import json
import time
from datetime import datetime
from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.template import TemplateDoesNotExist
from django.views.generic import TemplateView

from .models import Assistance, TypesEmployee
from ..home.models import Employee, EmployeeSettings
from ..ventas.models import Proyecto
from ..tools.genkeys import TypesEmployeeKeys


class JSONResponseMixin(object):
    """ this class encode serialize objects model """
    def render_to_json_response(self, context, **response_kwargs):
        """this response to request ajax"""
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs)

    def convert_context_to_json(self, context):
        """function serialize obejct"""
        return json.dumps(
            context,
            encoding='utf-8',
            cls=DjangoJSONEncoder)


class TypeEmployeeView(JSONResponseMixin, TemplateView):

    template_name = 'rrhh/typeemployee.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if 'ltypes' in request.GET:
                        kwargs['types'] = json.loads(
                            serializers.serialize(
                                'json',
                                TypesEmployee.objects.filter(flag=True).order_by('register')))
                        kwargs['status'] = True
                except ObjectDoesNotExist as oex:
                    kwargs['raise'] = str(oex)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            try:
                if 'new' in request.POST:
                    key = TypesEmployeeKeys()
                    TypesEmployee.objects.create(
                        types_id=key,
                        description=request.POST['desc'].upper(),
                        starthour=request.POST['starthour'])
                if 'modify' in request.POST:
                    obj = TypesEmployee.objects.get(types_id=request.POST['pk'])
                    obj.description = request.POST['desc'].upper()
                    obj.starthour = request.POST['starthour']
                    obj.save()
                if 'delete' in request.POST:
                    obj = TypesEmployee.objects.get(types_id=request.POST['pk'])
                    obj.delete()
                kwargs['status'] = True
            except ObjectDoesNotExist as oex:
                kwargs['raise'] = str(oex)
                kwargs['status'] = False
            return self.render_to_json_response(kwargs)


class AssistanceEmployee(JSONResponseMixin, TemplateView):
    """this class implement asisstance employee"""
    template_name = 'rrhh/assistance.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if 'glist' in request.GET:
                        kwargs['employee'] = json.loads(
                            serializers.serialize(
                                'json',
                                Employee.objects.filter(flag=True),
                                relations=('charge')))
                        kwargs['status'] = True
                    if 'gproject' in request.GET:
                        kwargs['projects'] = json.loads(
                            serializers.serialize(
                                'json',
                                Proyecto.objects.filter(status='AC', flag=True)))
                        kwargs['status'] = True
                    if 'gettypes' in request.GET:
                        kwargs['types'] = json.loads(
                            serializers.serialize(
                                'json',
                                TypesEmployee.objects.filter(flag=True).order_by('description')))
                        kwargs['status'] = True
                except ObjectDoesNotExist as oex:
                    kwargs['raise'] = str(oex)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return  render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            try:
                if 'saveAssistance' in request.POST:
                    # print request.POST
                    proj = request.POST['project'] if 'project' in request.POST else ''
                    proj = '' if proj == 'null' else proj
                    def registerassistance():
                        """this function register assistance"""
                        obj = Assistance()
                        obj.userregister_id = request.user.get_profile().empdni_id
                        obj.employee_id = request.POST['dni']
                        obj.project_id = proj if proj != '' else None
                        obj.types_id = request.POST['type']
                        obj.assistance = request.POST['date']
                        obj.hourin = request.POST['hin']
                        obj.hourout = request.POST['hout']
                        obj.hourinbreak = request.POST['hinb']
                        obj.houroutbreak = request.POST['houtb']
                        obj.tag = True
                        obj.save()
                    exists = None
                    if proj != '' or proj is None:
                        exists = Assistance.objects.filter(
                            assistance=request.POST['date'],
                            employee_id=request.POST['dni'], project_id=proj)
                    else:
                        exists = Assistance.objects.filter(
                            assistance=request.POST['date'], employee_id=request.POST['dni'])
                    if len(exists):
                        obj = exists.latest('register')
                        hourin = request.POST['hin']
                        # print 'OBJECT ', type(obj.hourin), obj.hourin
                        inh = datetime.strptime(hourin, '%H:%M', ).time()
                        print type(inh), inh
                        print type(hourin), hourin
                        if inh <= obj.hourin:
                            kwargs['raise'] = 'No se puede por que la hora ingresada '\
                                'es menor a una ya ingresada para esta fecha'
                            kwargs['status'] = False
                        else:
                            registerassistance()
                    else:
                        registerassistance()
                    if 'status' not in kwargs:
                        kwargs['status'] = True
            except ObjectDoesNotExist as oex:
                kwargs['status'] = False
                kwargs['raise'] = str(oex)
            return self.render_to_json_response(kwargs)


# mantenice settings asisstance
class EmployeeAsisstanceView(JSONResponseMixin, TemplateView):

    template_name = 'rrhh/mantenice.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    if 'gettypes' in request.GET:
                        kwargs['types'] = json.loads(
                            serializers.serialize(
                                'json',
                                TypesEmployee.objects.filter()
                            )
                        )
                        kwargs['status'] = True
                    if 'getsettings' in request.GET:
                        kwargs['settings'] = json.loads(
                            serializers.serialize(
                                'json',
                                EmployeeSettings.objects.filter(flag=True)
                            )
                        )
                        kwargs['status'] = True
                except ObjectDoesNotExist as exo:
                    kwargs['raise'] = str(exo)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        # print request.is_ajax()
        if request.is_ajax():
            try:
                print request.POST
                if 'savesettings' in request.POST:
                    EmployeeSettings.objects.filter(flag=True).update(flag=False)
                    # print 'before declare'
                    emp = EmployeeSettings()
                    # print 'declare'
                    # print request.POST['hextperfirst'], type(request.POST['hextperfirst'])
                    emp.hextperfirst = Decimal(
                        request.POST['hextperfirst']).quantize(Decimal('0.1'))
                    emp.hextpersecond = Decimal(
                        request.POST['hextpersecond']).quantize(Decimal('0.1'))
                    emp.ngratification = request.POST['ngratification']
                    emp.ncts = request.POST['ncts']
                    emp.pergratification = Decimal(
                        request.POST['pergratification']).quantize(Decimal('0.1'))
                    emp.codeproject = request.POST['codeproject']
                    emp.starthourextra = request.POST['starthourextra']
                    emp.starthourextratwo = request.POST['starthourextratwo']
                    emp.totalhour = request.POST['totalhour']
                    emp.timeround = request.POST['timeround']
                    emp.save()
                    kwargs['status'] = True
            except ObjectDoesNotExist as oex:
                kwargs['raise'] = str(oex)
                kwargs['status'] = False
            return self.render_to_json_response(kwargs)


# load file for Assistance
class LoadAssistance(JSONResponseMixin, TemplateView):

    template_name = 'rrhh/loadfile.html'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            if request.is_ajax():
                try:
                    pass
                except ObjectDoesNotExist as oex:
                    kwargs['raise'] = str(oex)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)
