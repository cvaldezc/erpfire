#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""only urls"""
from django.conf.urls import url, patterns
from .views import *

urlpatterns = patterns(
    '',
    url(r'^$', Main.as_view(), name='tickets_menu_view'),
    url(r'^inicio/$', UploadTickets.as_view(), name='tickets_inicio_view'),
    url(r'^results/$', UploadView.as_view(), name='tickets_carga_view'),
    url(r'^eliminar/$', DeleteData.as_view(), name='tickets_elimina_view'),
    url(r'^buscar/$', SearchView.as_view(), name='tickets_buscar_view'),
)
