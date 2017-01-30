"""
This models is for apps rrhh
"""
#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.db import models
from audit_log.models.managers import AuditLog

from CMSGuias.apps.home.models import Employee, Proveedor
from CMSGuias.apps.ventas.models import Proyecto


class PhoneEmple(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    phone = models.CharField(max_length=12, null=True, blank=True)
    descripcion = models.CharField(max_length=150, null=True, blank=True)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return '%s' % (
            self.phone)

class TipoContrato(models.Model):
    tipocontrato_id = models.CharField(primary_key=True, max_length=9)
    contrato = models.CharField(max_length=50)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()


class TipoPago(models.Model):
    tipopago_id = models.CharField(primary_key=True, max_length=9)
    pago = models.CharField(max_length=90)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()


class CuentaEmple(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    cuenta = models.CharField(max_length=25) #191-xxxxxxxx-0-14
    tipodepago = models.ForeignKey(TipoPago, to_field='tipopago_id')#semanal,quincenal,mensual
    estado = models.CharField(max_length=50, null=True, blank=True)
    remuneracion = models.FloatField(null=False, default=0)
    tipocontrato = models.ForeignKey(TipoContrato, to_field='tipocontrato_id')
    cts = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    gratificacion = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    costxhora = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    registro = models.DateTimeField(auto_now_add=True)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()


class TipoExamen(models.Model):
    tipoexamen_id = models.CharField(primary_key=True, max_length=9)
    descripcion = models.CharField(max_length=200)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.descripcion


class ExamenEmple(models.Model):

    def url(self, filename):
        ruta = 'storage/examedic/%s/examenes/%s' % (self.empdni, filename)
        return ruta

    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    tipoexamen = models.ForeignKey(TipoExamen, to_field='tipoexamen_id')
    lugar = models.ForeignKey(Proveedor, to_field='proveedor_id', default=False)
    fechinicio = models.DateField(null=True, blank=True)
    fechcaduca = models.DateField(null=True, blank=True)
    aptitud = models.CharField(max_length=100, null=True, blank=True)
    comentario = models.CharField(max_length=250, null=True, blank=True)
    archivo = models.FileField(upload_to=url, null=True, blank=True, max_length=400)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class TipoDocumento(models.Model):
    tipodoc_id = models.CharField(primary_key=True, max_length=9)
    descripcion = models.CharField(max_length=200)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()


class DocumentoEmple(models.Model):

    def url(self, filename):
        ruta = 'storage/examedic/%s/documentos/%s' % (self.empdni, filename)
        return ruta

    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    documento = models.ForeignKey(TipoDocumento, to_field='tipodoc_id')
    fechinicio = models.DateField(null=True, blank=True)
    fechcaduca = models.DateField(null=True, blank=True)
    condicion = models.CharField(max_length=200, null=True, blank=True)
    archivo = models.FileField(upload_to=url, null=True, blank=True, max_length=500)
    observaciones = models.CharField(max_length=200, null=True, blank=True)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class EmpleCampo(models.Model):
    emplecampo_id = models.CharField(primary_key=True, max_length=20)
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    fechinicio = models.DateField(null=True)
    carnetmag = models.BooleanField(default=False)
    fotocheck = models.BooleanField(default=False)
    registro = models.DateTimeField(auto_now_add=True)
    comentario = models.CharField(max_length=200, null=True, blank=True)

    audit_log = AuditLog()


class Suspension(models.Model):
    suspension_id = models.CharField(primary_key=True, max_length=9)
    motivo = models.CharField(max_length=200)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.motivo


class detSuspension(models.Model):

    def url(self, filename):
        ruta = 'storage/examedic/%s/suspension/%s' % (self.empdni, filename)
        return ruta

    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    suspension = models.ForeignKey(Suspension, to_field='suspension_id')
    fechinicio = models.DateField()
    fechfin = models.DateField()
    registro = models.DateField(auto_now_add=True)
    archivo = models.FileField(upload_to=url, null=True, blank=True, max_length=500)
    estado = models.CharField(max_length=20, blank=True, null=True)
    comentario = models.CharField(max_length=250, null=True, blank=True)

    audit_log = AuditLog()


class Epps(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    item = models.CharField(max_length=50)
    fechentrega = models.DateField(null=True)
    registro = models.DateTimeField(auto_now_add=True)
    comentario = models.CharField(max_length=200, null=True, blank=True)
    estadoepp = models.CharField(max_length=50, null=True, blank=True)
    fechrecepcion = models.DateField(null=True, blank=True)

    audit_log = AuditLog()


class Induccion(models.Model):
    emplecampo = models.ForeignKey(EmpleCampo, to_field='emplecampo_id')
    fechinicio = models.DateField(null=True, blank=True)
    fechcaduca = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=50, null=True, blank=True)
    registro = models.DateTimeField(auto_now_add=True)
    comentario = models.CharField(max_length=200, null=True, blank=True)

    audit_log = AuditLog()


class CoberturaSalud(models.Model):
    coberturasalud_id = models.CharField(primary_key=True, max_length=9)
    cobertura = models.CharField(max_length=50)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.cobertura


class detCobSaludEmple(models.Model):
    cobertura = models.ForeignKey(CoberturaSalud, to_field='coberturasalud_id')
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    fechinicio = models.DateField(null=True)
    fechfin = models.DateField(null=True, blank=True)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class RegimenSalud(models.Model):
    regimensalud_id = models.CharField(primary_key=True, max_length=9)
    regimen = models.CharField(max_length=50)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.regimen


class detSaludEmple(models.Model):
    regimen = models.ForeignKey(RegimenSalud, to_field='regimensalud_id')
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    fechinicio = models.DateField(null=True, blank=True)
    fechfin = models.DateField(null=True, blank=True)
    entidad = models.CharField(max_length=150, blank=True, null=True)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class RegimenPensionario(models.Model):
    regimenpens_id = models.CharField(primary_key=True, max_length=9)
    regimen = models.CharField(max_length=95)
    coberturapension = models.CharField(max_length=100)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.regimen


class detPensEmple(models.Model):
    regimenpens = models.ForeignKey(RegimenPensionario, to_field='regimenpens_id')
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    fechinicio = models.DateField(null=True, blank=True)
    fechfin = models.DateField(null=True, blank=True)
    cuspp = models.CharField(max_length=20, null=True, blank=True)
    sctr = models.BooleanField(default=True)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class TipoInstitucion(models.Model):
    tipoinst_id = models.CharField(primary_key=True, max_length=9)
    tipo = models.CharField(max_length=50)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return self.tipo


class detEstudioEmple(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    tipoinstitucion = models.ForeignKey(TipoInstitucion, to_field='tipoinst_id')
    carrera = models.CharField(max_length=100, null=True, blank=True)
    anoEgreso = models.CharField(max_length=6, null=True, blank=True)
    situacioneduc = models.CharField(max_length=50, null=True, blank=True)
    estpais = models.BooleanField(default=True)
    institucion = models.CharField(max_length=100)
    regimen = models.CharField(max_length=50, null=True, blank=True)
    finicio = models.CharField(max_length=10, null=True, blank=True)
    ffin = models.CharField(max_length=10, null=True, blank=True)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()


class FamiliaEmple(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    nombres = models.CharField(max_length=100, null=True, blank=True)
    parentesco = models.CharField(max_length=20, null=True, blank=True)
    edad = models.CharField(max_length=2, null=True, blank=True)
    fnac = models.DateField(null=True, blank=True)

    audit_log = AuditLog()


class ExperienciaLab(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    empresa = models.CharField(max_length=20, null=True, blank=True)
    cargo = models.CharField(max_length=20, null=True, blank=True)
    finicio = models.CharField(max_length=10, null=True, blank=True)
    ffin = models.CharField(max_length=10, null=True, blank=True)
    duracion = models.CharField(max_length=10, null=True, blank=True)
    motivoretiro = models.CharField(max_length=50, null=True, blank=True)

    audit_log = AuditLog()


class DatoMedico(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    tipo = models.CharField(max_length=60)
    descripcion = models.CharField(max_length=50, null=True, blank=True)
    tiempo = models.CharField(max_length=20, null=True, blank=True)
    comentario = models.CharField(max_length=250, null=True, blank=True)

    audit_log = AuditLog()


class CasoEmergencia(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    nombres = models.CharField(max_length=100, null=True, blank=True)
    direccion = models.CharField(max_length=100, null=True, blank=True)
    telefono = models.CharField(max_length=12, null=True, blank=True)
    parentesco = models.CharField(max_length=20, null=True, blank=True)

    audit_log = AuditLog()


class FamiliaIcr(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    nombres = models.CharField(max_length=100, null=True, blank=True)
    parentesco = models.CharField(max_length=20, null=True, blank=True)
    areatrabajo = models.CharField(max_length=50, null=True, blank=True)

    audit_log = AuditLog()


class RenunciaEmple(models.Model):

    def url(self, filename):
        ruta = 'storage/renuncias/%s/%s' % (self.empdni, filename)
        return ruta

    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    motivo = models.CharField(max_length=250, null=True, blank=True)
    ultimodiatrab = models.DateField(null=True, blank=True)
    archivo = models.FileField(upload_to=url, null=True, blank=True, max_length=500)
    registro = models.DateTimeField(auto_now_add=True)

    audit_log = AuditLog()

