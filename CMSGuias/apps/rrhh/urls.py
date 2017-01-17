#!/usr/bin/env python
#-*- encoding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib import admin

from .views import (
    AssistanceEmployee,
    TypeEmployeeView,
    EmployeeAsisstanceView,
    LoadAssistance,
    EmployeeBreakView)


admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^types/employee/$', TypeEmployeeView.as_view(), name='rrhh_typeemp_view'),
    url(r'^list/employee/$', AssistanceEmployee.as_view(), name='rrhh_assistancelist'),
    url(r'^settings/employee/$', EmployeeAsisstanceView.as_view(), name='rrhh_settings'),
    url(r'^load/assistance/$', LoadAssistance.as_view(), name='rrhh_load_assistance'),
    url(r'^status/assistance/$', EmployeeBreakView.as_view(), name='rrhh_status_assistance'),
)
