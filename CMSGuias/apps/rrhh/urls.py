#!/usr/bin/env python
#-*- encoding: utf-8 -*-

from django.conf.urls import patterns, url
from django.conf.urls import patterns, url, include
from .views import *
from assistance import *


TipoInstitucion_urls = patterns(
    '',
    url(r'^list/$', TipInstList.as_view(), name='tipoinst_list'),
    url(r'^new/$', TipInstCreate.as_view(), name='tipoinst_new'),
    url(r'^edit/(?P<pk>\w+)/$', TipInstUpdate.as_view(), name='tipoinst_edit'),
    url(r'^delete/(?P<pk>\w+)/$', TipInstDelete.as_view(), name='tipoinst_del'),
)

TipoEmple_urls = patterns(
    '',
    url(r'^list/$', TipEmpleList.as_view(), name='tipoemple_list'),
    url(r'^new/$', TipEmpleCreate.as_view(), name='tipoemple_new'),
    url(r'^edit/(?P<tipoemple_id>\w+)/$', TipEmpleUpdate.as_view(),
        name='tipoemple_edit'),
    url(r'^delete/(?P<tipoemple_id>\w+)/$', TipEmpleDelete.as_view(),
        name='tipoemple_del'),
)

TipoCobertura_urls = patterns(
    '',
    url(r'^list/$', TipCoberturaList.as_view(),name='tipocobertura_list'),
    url(r'^new/$', TipCoberturaCreate.as_view(),name='tipocobertura_new'),
    url(r'^edit/(?P<coberturasalud_id>\w+)/$',TipCoberturaUpdate.as_view(), name='tipocobertura_edit'),
    url(r'^delete/(?P<coberturasalud_id>\w+)/$',TipCoberturaDelete.as_view(), name='tipocobertura_del'),
)

TipoRegimen_urls = patterns(
    '',
    url(r'^list/$', TipRegimenList.as_view(),name='tiporegimen_list'),
    url(r'^new/$', TipRegimenCreate.as_view(),name='tiporegimen_new'),
    url(r'^edit/(?P<regimensalud_id>\w+)/$',TipRegimenUpdate.as_view(), name='tiporegimen_edit'),
    url(r'^delete/(?P<regimensalud_id>\w+)/$',TipRegimenDelete.as_view(), name='tiporegimen_del'),
)

TipoExamen_urls = patterns(
    '',
    url(r'^list/$', TipExamenList.as_view(),name='tipoexamen_list'),
    url(r'^new/$', TipExamenCreate.as_view(),name='tipoexamen_new'),
    url(r'^edit/(?P<tipoexamen_id>\w+)/$',TipExamenUpdate.as_view(), name='tipoexamen_edit'),
    url(r'^delete/(?P<tipoexamen_id>\w+)/$',TipExamenDelete.as_view(), name='tipoexamen_del'),
)

TipoRegimenPens_urls = patterns(
    '',
    url(r'^list/$', TipRegimenPensList.as_view(),name='tiporegimenpens_list'),
    url(r'^new/$', TipRegimenPensCreate.as_view(),name='tiporegimenpens_new'),
    url(r'^edit/(?P<regimenpens_id>\w+)/$',TipRegimenPensUpdate.as_view(), name='tiporegimenpens_edit'),
    url(r'^delete/(?P<regimenpens_id>\w+)/$',TipRegimenPensDelete.as_view(), name='tiporegimenpens_del'),
)

TipoContrato_urls = patterns(
    '',
    url(r'^list/$', TipContratoList.as_view(),name='tipocontrato_list'),
    url(r'^new/$', TipContratoCreate.as_view(),name='tipocontrato_new'),
    url(r'^edit/(?P<tipocontrato_id>\w+)/$',TipContratoUpdate.as_view(), name='tipocontrato_edit'),
    url(r'^delete/(?P<tipocontrato_id>\w+)/$',TipContratoDelete.as_view(), name='tipocontrato_del'),
)

TipoPago_urls = patterns(
    '',
    url(r'^list/$', TipPagoList.as_view(),name='tipopago_list'),
    url(r'^new/$', TipPagoCreate.as_view(),name='tipopago_new'),
    url(r'^edit/(?P<tipopago_id>\w+)/$',TipPagoUpdate.as_view(), name='tipopago_edit'),
    url(r'^delete/(?P<tipopago_id>\w+)/$',TipPagoDelete.as_view(), name='tipopago_del'),
)
TipoSuspension_urls = patterns(
    '',
    url(r'^list/$', TipSuspensionList.as_view(),name='tiposuspension_list'),
    url(r'^new/$', TipSuspensionCreate.as_view(),name='tiposuspension_new'),
    url(r'^edit/(?P<suspension_id>\w+)/$',TipSuspensionUpdate.as_view(), name='tiposuspension_edit'),
    url(r'^delete/(?P<suspension_id>\w+)/$',TipSuspensionDelete.as_view(), name='tiposuspension_del'),
)
RubroPro_urls = patterns(
    '',
    url(r'^list/$', RubroProList.as_view(),name='rubropro_list'),
    url(r'^new/$', RubroProCreate.as_view(),name='rubropro_new'),
    url(r'^edit/(?P<rubro_id>\w+)/$',RubroProUpdate.as_view(), name='rubropro_edit'),
    url(r'^delete/(?P<rubro_id>\w+)/$',RubroProDelete.as_view(), name='rubropro_del'),
)

TipoDocumento_urls = patterns(
    '',
    url(r'^list/$', TipDocList.as_view(),name='tipdoc_list'),
    url(r'^new/$', TipDocCreate.as_view(),name='tipdoc_new'),
    url(r'^edit/(?P<tipodoc_id>\w+)/$',TipDocUpdate.as_view(), name='tipdoc_edit'),
    url(r'^delete/(?P<tipodoc_id>\w+)/$',TipDocDelete.as_view(), name='tipdoc_del'),
)

DetailsEmple_urls = patterns(
    '',
    url(r'^list/(?P<empdni_id>\w+)/$',EmpleDetails.as_view(), name='emple_details'),
)

EmpleNoActive_urls = patterns(
    '',
    url(r'^list/$',EmpleNoActive.as_view(), name='noactive'),
)

Proyecto_urls = patterns(
    '',
    url(r'^list/$',Proyectos.as_view(), name='emple_proy'),
)

ExaDoc_urls = patterns(
    '',
    url(r'^list/$',Examenes.as_view(), name='exadoc'),
)

urlpatterns = patterns(
	'',
    url(r'^$', EmployeeHome.as_view(), name='rrhh_index'),
	url(r'^empleado/$',Menu.as_view(),name='menu'),
    url(r'^empleado/phone/$',Phone.as_view(),name='rrhhphone_view'),
    url(r'^empleado/cuentacorriente/$',CuentaCorriente.as_view(),name='rrhhcuenta_view'),
    url(r'^empleado/suspension/$',SuspensionEmple.as_view(),name='rrhhsuspension_view'),
    url(r'^empleado/documento/$',DocumentoEmpleado.as_view(),name='rrhhdocumento_view'),
    url(r'^empleado/obra/$',ObraEmpleado.as_view(),name='rrhhobra_view'),
    url(r'^empleado/estudios/$',EstudiosEmpleado.as_view(),name='rrhhestudios_view'),
    url(r'^empleado/segsocial/$',SegSocial.as_view(),name='rrhhsegsocial_view'),
    url(r'^tipoinstitucion/',include(TipoInstitucion_urls)),
    url(r'^tipoempleado/',include(TipoEmple_urls)),
    url(r'^tipocobertura/',include(TipoCobertura_urls)),
    url(r'^tiporegimen/',include(TipoRegimen_urls)),
    url(r'^tipoexamen/',include(TipoExamen_urls)),
    url(r'^tiporegimenpens/',include(TipoRegimenPens_urls)),
    url(r'^tipocontrato/',include(TipoContrato_urls)),
    url(r'^tipopago/',include(TipoPago_urls)),
    url(r'^tiposuspension/',include(TipoSuspension_urls)),
    url(r'^rubropro/',include(RubroPro_urls)),
    url(r'^tipodocumento/',include(TipoDocumento_urls)),
    url(r'^details/',include(DetailsEmple_urls)),
    url(r'^NoActive/',include(EmpleNoActive_urls)),
    url(r'^proyecto/',include(Proyecto_urls)),
    url(r'^exadoc/',include(ExaDoc_urls)),
    url(r'^types/employee/$', TypeEmployeeView.as_view(), name='rrhh_typeemp_view'),
    url(r'^list/employee/$', AssistanceEmployee.as_view(), name='rrhh_assistancelist'),
    url(r'^settings/employee/$', EmployeeAsisstanceView.as_view(), name='rrhh_settings'),
    url(r'^load/assistance/$', LoadAssistance.as_view(), name='rrhh_load_assistance'),
    url(r'^status/assistance/$', EmployeeBreakView.as_view(), name='rrhh_status_assistance'),
    url(r'^view/assistance/$', ViewAssistance.as_view(), name='rrhh_view_assistance'),
    url(r'^exportar/assistance/$', ExportarAssistance.as_view(), name='rrhh_exportar_view'),
    url(r'^delete/assistance/$', DeleteAssistance.as_view(), name='rrhh_delete_assistance'),
    ###
    url(r'^test/$', LoadRe.as_view(), name='rrhh_test'),
)
