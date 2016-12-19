#!/usr/bin/env python
#-*- encoding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib import admin

from .views import AssistanceEmployee


admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^list/employee/$', AssistanceEmployee.as_view(), name='rrhh_assistancelist'),
)