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

from .models import Assistance, StatusEmployee
from ..home.models import Employee


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
                except ObjectDoesNotExist as oex:
                    kwargs['raise'] = str(oex)
                    kwargs['status'] = False
                return self.render_to_json_response(kwargs)
            return  render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)
