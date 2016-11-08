# -*- coding: utf-8 -*- 
# encoding: utf-8
from __future__ import unicode_literals
import datetime
from django.db import models
# from audit_log.models.fields import LastUserField
from audit_log.models.managers import AuditLog

from CMSGuias.apps.home.models import (
    Pais, Departamento, Provincia, Distrito, Cliente,
    Materiale, Employee, Brand, Model, Cargo, Moneda,
    Documentos, FormaPago, Unidade)
from CMSGuias.apps.tools import globalVariable, search
from CMSGuias.apps import operations

class Proyecto(models.Model):
    proyecto_id = models.CharField(primary_key=True, max_length=7, null=False)
    ruccliente = models.ForeignKey(
                    Cliente, to_field='ruccliente_id', null=True)
    nompro = models.CharField(max_length=200)
    registrado = models.DateTimeField(auto_now_add=True, null=False)
    comienzo = models.DateField(null=True)
    fin = models.DateField(null=True, blank=True)
    pais = models.ForeignKey(Pais, to_field='pais_id')
    departamento = models.ForeignKey(Departamento, to_field='departamento_id')
    provincia = models.ForeignKey(Provincia, to_field='provincia_id')
    distrito = models.ForeignKey(Distrito, to_field='distrito_id')
    direccion = models.CharField(max_length=200, null=False)
    obser = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=2, null=False, default='00')
    empdni = models.ForeignKey(
            Employee, related_name='proyectoAsEmployee', null=True, blank=True)
    approved = models.ForeignKey(
            Employee, related_name='approvedAsEmployee', null=True, blank=True)
    currency = models.ForeignKey(
                Moneda, to_field='moneda_id', null=True, blank=True)
    exchange = models.FloatField(null=True, blank=True)
    typep = models.CharField(max_length=3, default='ACI')
    contact = models.CharField(
                max_length=254, null=True, blank=True, default='')
    phone = models.CharField(max_length=16, blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    aservices = models.DecimalField(
                    max_digits=9,
                    decimal_places=3,
                    blank=True,
                    default=0,
                    null=False)
    flag = models.BooleanField(default=True, null=False)

    audit_log = AuditLog()

    class Meta:
        ordering = ['nompro']

    @property
    def itemsPercent(self):
        obj = operations.models.MetProject.objects.filter(
                proyecto_id=self.proyecto_id)
        items = obj.count()
        if items:
            attend = obj.filter(tag='2').count()
            percent = ((attend * 100) / items)
        else:
            percent = 0
        return '%.1f' % percent

    @property
    def is_out_date(self):
        if datetime.datetime.today().date() > self.fin:
            return True
        return False

    def __unicode__(self):
        return '%s %s %s' % (self.proyecto_id,
                            unicode(self.nompro).encode('ascii', errors='ignore'),
                            self.ruccliente_id)


class CloseProject(models.Model):

    def url(self, filename):
        return 'storage/projects/%s/%s/closed/%s' % (
            self.project.registrado.strftime('%Y'), self.project_id, filename)

    def uridoc(self, filename):
        return 'storage/projects/%s/%s/closed/calidad/%s' % (
            self.project.registrado.strftime('%Y'), self.project_id, filename)

    def uriaco(self, filename):
        return 'storage/projects/%s/%s/closed/contabilidad/%s' % (
            self.project.registrado.strftime('%Y'), self.project_id, filename)

    project = models.ForeignKey(Proyecto, to_field='proyecto_id')
    storageclose = models.BooleanField(default=False, blank=True)
    datestorage = models.DateTimeField()
    letterdelivery = models.FileField(upload_to=url, null=True, max_length=250)
    dateletter = models.DateTimeField(null=True, blank=True)
    documents = models.FileField(upload_to=uridoc, null=True, blank=True, max_length=255)
    docregister = models.DateTimeField(null=True)
    accounting = models.BooleanField(default=False, blank=True)
    tinvoice = models.FloatField(null=True, blank=True)
    tiva = models.FloatField(null=True, blank=True)
    otherin = models.FloatField(blank=True, null=True)
    otherout = models.FloatField(null=True, blank=True)
    retention = models.FloatField(null=True, blank=True)
    fileaccounting = models.FileField(
                        upload_to=uriaco, null=True, max_length=250)
    performedstorage = models.ForeignKey(
                    Employee, related_name='storage', null=True, blank=True)
    performedoperations = models.ForeignKey(
                    Employee, related_name='operations', null=True, blank=True)
    performeddocument = models.ForeignKey(
                    Employee, related_name='documents', null=True, blank=True)
    performedaccounting = models.ForeignKey(
                    Employee, related_name='accounting', null=True, blank=True)
    performedclose = models.ForeignKey(
                Employee, related_name='closeasproject', null=True, blank=True)
    closeconfirm = models.CharField(default='', max_length=6, blank=True)
    dateclose = models.DateTimeField(null=True)
    status = models.CharField(default='PE', max_length=2)
    keyreopens = models.CharField(max_length=6, null=True)
    performedre = models.ForeignKey(Employee, related_name='reopen', null=True)
    datereopen = models.DateTimeField(null=True)
    
    audit_log = AuditLog()


class Subproyecto(models.Model):
    subproyecto_id = models.CharField(
                        primary_key=True, max_length=7, null=False)
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    nomsub = models.CharField(max_length=200)
    registrado = models.DateTimeField(auto_now_add=True)
    comienzo = models.DateField(null=True, blank=True)
    fin = models.DateField(null=True, blank=True)
    obser = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=2, null=False, default='AC')
    additional = models.BooleanField(blank=True, default=False)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['nomsub']

    def __unicode__(self):
        return '%s - %s %s' % (self.proyecto, self.subproyecto_id, self.nomsub)


class Sectore(models.Model):
    sector_id = models.CharField(
        primary_key=True, max_length=20, null=False, unique=True)
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    planoid = models.CharField(max_length=16, null=True, default='')
    nomsec = models.CharField(max_length=200)
    registrado = models.DateTimeField(auto_now_add=True)
    comienzo = models.DateField(null=True, blank=True)
    fin = models.DateField(null=True, blank=True)
    obser = models.TextField(null=True, blank=True)
    amount = models.FloatField(default=0, blank=True, null=True)
    amountsales = models.FloatField(default=0, blank=True, null=True)
    atype = models.CharField(max_length=2, default='NN', blank=True)
    link = models.TextField(default='', blank=True)
    status = models.CharField(max_length=2, null=False, default='AC')
    flag = models.BooleanField(default=True, null=False)

    audit_log = AuditLog()

    class Meta:
        ordering = ['sector_id']

    def __unicode__(self):
        return '%s' % (self.sector_id)

    # @property
    # def itemsPercent(self):
    #     obj = operations.models.MetProject.objects.filter(
    #       proyecto_id=self.proyecto_id, sector_id=self.sector_id)
    #     items = obj.count()
    #     attend = obj.filter(tag='2').count()
    #     percent = ((attend * 100) / items)
    #     return '%.1f'%percent

    @property
    def stadistics(self):
        context = dict()
        obj = operations.models.MetProject.objects.filter(
                proyecto_id=self.proyecto_id, sector_id=self.sector_id)
        context['total'] = obj.count()
        context['attend'] = obj.filter(tag='2').count()
        context['semi'] = obj.filter(tag='1').count()
        context['pending'] = obj.filter(tag='0').count()
        return context


class SectorFiles(models.Model):
    def url(self, filename):
        ext = filename.split('.')[-1]
        date = datetime.datetime.today().strftime('%Y%m%d-%H%M%S')
        if self.dsector is None:
            if self.subproyecto is None:
                ruta = 'storage/projects/%s/%s/%s/%s.%s' % (
                        self.proyecto.registrado.strftime('%Y'),
                        self.proyecto_id,
                        self.sector_id,
                        date, ext)
            else:
                ruta = 'storage/projects/%s/%s/%s/%s/%s.%s' % (
                        self.proyecto.registrado.strftime('%Y'),
                        self.proyecto_id,
                        self.subproyecto_id,
                        self.sector_id,
                        date, ext)
        else:
            ruta = 'storage/projects/%s/%s/%s/%s/%s.%s' % (
                        self.proyecto.registrado.strftime('%Y'),
                        self.proyecto_id,
                        self.sector_id,
                        self.dsector_id,
                        date, ext)
        return ruta

    sector = models.ForeignKey(Sectore, to_field='sector_id')
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    from CMSGuias.apps.operations.models import DSector
    dsector = models.ForeignKey(DSector, to_field='dsector_id', blank=True, null=True)
    files = models.FileField(upload_to=url, max_length=200)
    note = models.TextField(default='', blank=True)
    date = models.DateField(auto_now=True)
    time = models.TimeField(auto_now=True)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s - %s' % (self.sector, self.files)


class Metradoventa(models.Model):
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    sector = models.ForeignKey(Sectore, to_field='sector_id')
    materiales = models.ForeignKey(Materiale, to_field='materiales_id')
    brand = models.ForeignKey(Brand, to_field='brand_id', default='BR000')
    model = models.ForeignKey(Model, to_field='model_id', default='MO000')
    cantidad = models.FloatField()
    precio = models.FloatField()
    sales = models.DecimalField(max_digits=9, decimal_places=3, default=0)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['proyecto']

    def __unicode__(self):
        return '%s %f %f' % (self.materiales, self.cantidad, self.precio)


class Alertasproyecto(models.Model):
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    sector = models.ForeignKey(
                Sectore, to_field='sector_id', null=True, blank=True)
    registrado = models.DateTimeField(auto_now_add=True)
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    charge = models.ForeignKey(Cargo, to_field='cargo_id')
    message = models.TextField(default='')
    status = models.CharField(max_length=8, default='success')
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['proyecto']

    def __unicode__(self):
        return '%s %s %s %s %s' % (
                                    self.proyecto,
                                    self.sector,
                                    self.charge,
                                    self.message,
                                    self.registrado)


class HistoryMetProject(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=6, default=globalVariable.get_Token())
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id', default='')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    sector = models.ForeignKey(Sectore, to_field='sector_id')
    materials = models.ForeignKey(
                    Materiale, to_field='materiales_id', default='')
    brand = models.ForeignKey(Brand, to_field='brand_id', default='BR000')
    model = models.ForeignKey(Model, to_field='model_id', default='MO000')
    quantity = models.FloatField()
    price = models.FloatField()
    sales = models.DecimalField(max_digits=9, decimal_places=3, default=0)
    comment = models.CharField(
                max_length=250, default='', null=True, blank=True)
    quantityorders = models.FloatField(default=0)
    tag = models.CharField(max_length=1, default='0')
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['proyecto']

    def __unicode__(self):
        return '%s %s %s %f %f' % (
                                    self.proyecto,
                                    self.sector,
                                    self.materials_id,
                                    self.quantity,
                                    self.price)


class RestoreStorage(models.Model):
    date = models.DateField(auto_now_add=True)
    token = models.CharField(max_length=6, default=globalVariable.get_Token())
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id', default='')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    sector = models.ForeignKey(Sectore, to_field='sector_id')
    materials = models.ForeignKey(
                    Materiale, to_field='materiales_id', default='')
    brand = models.ForeignKey(Brand, to_field='brand_id', default='BR000')
    model = models.ForeignKey(Model, to_field='model_id', default='MO000')
    quantity = models.FloatField()
    price = models.FloatField()
    sales = models.DecimalField(
            max_digits=9, decimal_places=3, default=0, null=True, blank=True)
    tag = models.CharField(max_length=1, default='0')
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['proyecto']

    def __unicode__(self):
        return '%s %s %s %f %f' % (
                    self.proyecto,
                    self.sector,
                    self.materials_id,
                    self.quantity,
                    self.price)


class UpdateMetProject(models.Model):
    proyecto = models.ForeignKey(Proyecto, to_field='proyecto_id', default='')
    subproyecto = models.ForeignKey(
                Subproyecto, to_field='subproyecto_id', null=True, blank=True)
    sector = models.ForeignKey(Sectore, to_field='sector_id')
    materials = models.ForeignKey(
                    Materiale, to_field='materiales_id', default='')
    brand = models.ForeignKey(Brand, to_field='brand_id', default='BR000')
    model = models.ForeignKey(Model, to_field='model_id', default='MO000')
    quantity = models.FloatField()
    price = models.FloatField()
    sales = models.DecimalField(
                max_digits=9, decimal_places=3, default=0, blank=True)
    comment = models.CharField(
                max_length=250, default='', null=True, blank=True)
    quantityorders = models.FloatField(default=0, blank=True)
    tag = models.CharField(max_length=1, default='0')
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    @property
    def amount(self):
        return (self.quantity * self.price)

    class Meta:
        ordering = ['proyecto']

    def __unicode__(self):
        return '%s %s %s %f %f' % (
                                    self.proyecto,
                                    self.sector,
                                    self.materials_id,
                                    self.quantity,
                                    self.price)


class PurchaseOrder(models.Model):
    def url(self, filename):
        ruta = 'storage/projects/%s/%s/purchase_order_customers/%s.pdf' % (
            search.searchPeriodProject(self.project_id),
            self.project_id,
            self.nropurchase)
        return ruta

    project = models.ForeignKey(Proyecto, to_field='proyecto_id')
    # subproject = models.ForeignKey(
    #   Subproyecto, to_field='subproyecto_id',null=True, blank=True)
    register = models.DateTimeField(auto_now_add=True)
    nropurchase = models.CharField(max_length=14)
    issued = models.DateField()
    currency = models.ForeignKey(Moneda, to_field='moneda_id')
    document = models.ForeignKey(Documentos, to_field='documento_id')
    method = models.ForeignKey(FormaPago, to_field='pagos_id')
    observation = models.TextField(null=True, blank=True)
    dsct = models.FloatField(default=0, blank=True)
    igv = models.FloatField(default=0, blank=True)
    order = models.FileField(
            upload_to=url, null=True, blank=True, max_length=200)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['project']

    def __unicode__(self):
        return '%s - %s' % (self.project, self.purchase_id)


class DetailsPurchaseOrder(models.Model):
    purchase = models.ForeignKey(PurchaseOrder, to_field='id')
    nropurchase = models.CharField(max_length=14)
    description = models.CharField(max_length=250)
    unit = models.ForeignKey(Unidade, to_field='unidad_id')
    delivery = models.DateField()
    quantity = models.FloatField()
    price = models.FloatField()

    audit_log = AuditLog()

    class Meta:
        ordering = ['nropurchase']


class Painting(models.Model):

    project = models.ForeignKey(Proyecto, to_field='proyecto_id')
    nlayers = models.SmallIntegerField(default=1, null=False)
    nfilmb = models.SmallIntegerField(default=4)
    nfilmc = models.SmallIntegerField(default=4)
    register = models.DateTimeField(auto_now_add=True)
    tag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['-project']

    def __unicode__(self):
        return 'unicode(%s) %s %d %d' % (self.project,
                                self.register,
                                self.nfilmb,
                                self.nfilmc)
