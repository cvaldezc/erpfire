#!/usr/bin/env python
#-*- conding: utf-8 -*-

import json

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
from ..home.models import Employee
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
                        types_id=key, description=request.POST['desc'].upper())
                if 'modify' in request.POST:
                    obj = TypesEmployee.objects.get(types_id=request.POST['pk'])
                    obj.description = request.POST['desc'].upper()
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
                except ObjectDoesNotExist as oex:
                    kwargs['raise'] = str(oex)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return  render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)
