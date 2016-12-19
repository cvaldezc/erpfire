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
from django.views.generic import View, TemplateView

from .models import *
from ..home.models import Employee


class AsisstanceEmployee(TemplateView):
    """this class implement asisstance employee"""
    template_name = 'rrhh'

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            return  render(request, self.template_name, kwargs)
        except TemplateDoesNotExist as ext:
            raise Http404(ext)
