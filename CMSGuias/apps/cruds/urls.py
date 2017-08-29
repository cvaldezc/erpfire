#!/usr/bin/env python
#-*- encoding: utf-8 -*-

from django.conf.urls import patterns, url, include
from .views import *


FormaPago_urls = patterns(
    '',
    url(r'^list/$', FormaPagoList.as_view(), name='formpago_list'),
    url(r'^new/$', FormaPagoCreate.as_view(), name='formpago_new'),
    url(r'^edit/(?P<pk>\w+)/$', FormaPagoEdit.as_view(), name='formpago_edit'),
    url(r'^delete/(?P<pk>\w+)/$', FormaPagoDelete.as_view(), name='formpago_del'),
)

Documento_urls = patterns(
    '',
    url(r'^list/$', DocumentoList.as_view(), name='documento_list'),
    url(r'^new/$', DocumentoCreate.as_view(), name='documento_new'),
    url(r'^edit/(?P<pk>\w+)/$', DocumentoEdit.as_view(), name='documento_edit'),
    url(r'^delete/(?P<pk>\w+)/$', DocumentoDelete.as_view(), name='documento_del'),
)

Moneda_urls = patterns(
    '',
    url(r'^list/$', MonedaList.as_view(), name='moneda_list'),
    url(r'^new/$', MonedaCreate.as_view(), name='moneda_new'),
    url(r'^edit/(?P<pk>\w+)/$', MonedaEdit.as_view(), name='moneda_edit'),
    url(r'^delete/(?P<pk>\w+)/$', MonedaDelete.as_view(), name='moneda_del'),
)

CargoEmple_urls = patterns(
    '',
    url(r'^list/$', CargoEmpleList.as_view(), name='cargoemple_list'),
    url(r'^new/$', CargoEmpleCreate.as_view(), name='cargoemple_new'),
    url(r'^edit/(?P<pk>\w+)/$', CargoEmpleEdit.as_view(), name='cargoemple_edit'),
    url(r'^delete/(?P<pk>\w+)/$', CargoEmpleDelete.as_view(), name='cargoemple_del'),
)

Area_urls = patterns(
    '',
    url(r'^list/$', AreaList.as_view(), name='area_list'),
    url(r'^new/$', AreaCreate.as_view(), name='area_new'),
    url(r'^edit/(?P<pk>\w+)/$', AreaEdit.as_view(), name='area_edit'),
    url(r'^delete/(?P<pk>\w+)/$', AreaDelete.as_view(), name='area_del'),
)

MNiple_urls = patterns(
    '',
    url(r'^list/$', MNipleList.as_view(), name='mniple_list'),
    url(r'^new/$', MNipleCreate.as_view(), name='mniple_new'),
    url(r'^edit/(?P<pk>\w+)/$', MNipleEdit.as_view(), name='mniple_edit'),
    url(r'^delete/(?P<pk>\w+)/$', MNipleDelete.as_view(), name='mniple_del'),
)

urlpatterns = patterns(
	'',
    url(r'^$', CrudsHome.as_view(), name='cruds_home'),

    url(r'^formapago/',include(FormaPago_urls)),
    url(r'^documento/',include(Documento_urls)),
    url(r'^moneda/',include(Moneda_urls)),
    url(r'^cargoemple/',include(CargoEmple_urls)),
    url(r'^area/',include(Area_urls)),
    url(r'^mniple/',include(MNiple_urls)),
)

