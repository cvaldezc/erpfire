#!/usr/bin/env python

# -*- coding: utf-8 -*-
#
# import datetime

from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
# from audit_log.models.fields import LastUserField
from audit_log.models.managers import AuditLog


class Pais(models.Model):
    pais_id = models.CharField(primary_key=True, max_length=3)
    paisnom = models.CharField(max_length=56)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['paisnom']

    def __unicode__(self):
        return self.paisnom


class Departamento(models.Model):
    departamento_id = models.CharField(primary_key=True, max_length=2)
    pais = models.ForeignKey(Pais, to_field='pais_id')
    depnom = models.CharField(max_length=56)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['depnom']

    def __unicode__(self):
        return self.depnom


class Provincia(models.Model):
    provincia_id = models.CharField(primary_key=True, max_length=3)
    departamento = models.ForeignKey(Departamento, to_field='departamento_id')
    pais = models.ForeignKey(Pais, to_field='pais_id')
    pronom = models.CharField(max_length=56)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['pronom']

    def __unicode__(self):
        return self.pronom


class Distrito(models.Model):
    distrito_id = models.CharField(primary_key=True, max_length=2)
    provincia = models.ForeignKey(Provincia, to_field='provincia_id')
    departamento = models.ForeignKey(Departamento, to_field='departamento_id')
    pais = models.ForeignKey(Pais, to_field='pais_id')
    distnom = models.CharField(max_length=56)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['distnom']

    def __unicode__(self):
        return self.distnom


class Unidade(models.Model):
    unidad_id = models.CharField(primary_key=True, max_length=7)
    uninom = models.CharField(max_length=10)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.unidad_id, self.uninom)

# class Category(models.Model):
#     '''
#     Model class category for master items
#     '''
#     category_id


class Materiale(models.Model):
    '''
    model class master for items for the project
    '''
    materiales_id = models.CharField(primary_key=True, max_length=15)
    matnom = models.CharField(max_length=200, null=False)
    matmed = models.CharField(max_length=200, null=False)
    unidad = models.ForeignKey(Unidade, to_field='unidad_id')
    # matpre = models.FloatField(default=0,null=True)
    # matmar = models.CharField(max_length=40,null=True)
    # matmod = models.CharField(max_length=40,null=True)
    matacb = models.CharField(max_length=255, null=True)
    matare = models.FloatField(null=True)
    # @Juan Julcapari 2017-07-12 14:57:30
    tipo = models.CharField(max_length=2, default='MT', blank=False, null=False)
    #endblock
    # @cvaldezch 2017-07-19 14:55:23 - add columns
    weight = models.FloatField(default=0, blank=False, null=False)
    register = models.DateTimeField(auto_now_add=True, blank=True, null=False)
    #endblock

    # audit_log = AuditLog() 2017-07-31 11:31:27

    class Meta:
        ordering = ['matnom']

    @property
    def complete_name(self):
        return u''.join((self.matnom, self.matmed)).encode('utf-8').strip()

    def __unicode__(self):
        name = u''.join((self.matnom, self.matmed)).encode('utf-8').strip()
        return '{0} {1} {2}'.format(self.materiales_id, name, self.unidad.uninom)


class MNiple(models.Model):
    ktype = models.CharField(max_length=1, primary_key=True)
    ntype = models.CharField(max_length=80)
    ncount = models.CharField(max_length=6, null=True)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['ktype']

    def __unicode__(self):
        return '%s %s %s' % (self.ktype, self.ntype, self.ncount)


class TypeGroup(models.Model):
    tgroup_id = models.CharField(max_length=7, primary_key=True)
    typeg = models.CharField(max_length=200)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.tgroup_id, self.typeg)


class GroupMaterials(models.Model):
    mgroup_id = models.CharField(max_length=10, primary_key=True)
    tgroup = models.ForeignKey(
                TypeGroup, to_field='tgroup_id', default='TG00000')
    name = models.CharField(max_length=200, blank=True)
    materials = models.ForeignKey(Materiale, to_field='materiales_id')
    # parent = models.CharField(max_length=13, null=True, blank=True)
    observation = models.CharField(max_length=250)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.mgroup_id, self.materials_id)


class DetailsGroup(models.Model):
    mgroup = models.ForeignKey(GroupMaterials, to_field='mgroup_id')
    materials = models.ForeignKey(Materiale, to_field='materiales_id')
    quantity = models.FloatField()
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s %f' % (self.mgroup_id, self.materials, self.quantity)


class Cargo(models.Model):
    cargo_id = models.CharField(primary_key=True, max_length=9)
    cargos = models.CharField(max_length=60)
    area = models.CharField(max_length=60, default='Nothing')
    unit = models.ForeignKey(
            Unidade, to_field='unidad_id', default='HH', null=True)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['cargos']

    def __unicode__(self):
        return '%s %s - %s' % (self.cargo_id, self.cargos, self.area)


class TipoEmpleado(models.Model):
    tipoemple_id = models.CharField(primary_key=True, max_length=9)
    descripcion = models.CharField(max_length=100)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return ' %s ' %(self.descripcion)


class Employee(models.Model):
    def url(self, filename):
        ruta = 'storage/examedic/%s/fichaentrada/%s' % (self.empdni_id, filename)
        return ruta

    def urlfoto(self, filename):
        fotoruta = 'storage/examedic/%s/foto/%s' % (self.empdni_id, filename)
        return fotoruta

    empdni_id = models.CharField(primary_key=True, max_length=8)
    tipoemple = models.ForeignKey(TipoEmpleado, to_field='tipoemple_id', null=True, blank=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=150)
    sexo = models.BooleanField()
    estadocivil = models.BooleanField()
    birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=180, null=True, blank=True)
    address2 = models.CharField(max_length=180, null=True, blank=True)
    email = models.EmailField(max_length=80, null=True, blank=True)
    nacionalidad = models.BooleanField(default=True)
    discapacidad = models.BooleanField(default=False)
    situacion = models.CharField(max_length=100, default="Activo", null=True, blank=True)
    feching = models.DateField(null=True, blank=True)
    estadoplanilla = models.BooleanField(default=False)
    register = models.DateTimeField(auto_now_add=True)
    charge = models.ForeignKey(Cargo, to_field='cargo_id', null=True)
    observation = models.TextField(null=True, blank=True)
    archivo = models.FileField(upload_to=url, null=True, blank=True, max_length=500)
    foto = models.FileField(upload_to=urlfoto, null=True, blank=True, max_length=300)
    nacdpt = models.CharField(max_length=20, null=True, blank=True)
    nacprov = models.CharField(max_length=20, null=True, blank=True)
    nacdist = models.CharField(max_length=20, null=True, blank=True)
    tallazap = models.CharField(max_length=6, null=True, blank=True)
    tallapolo = models.CharField(max_length=6, null=True, blank=True)
    cargopostula = models.CharField(max_length=30, null=True, blank=True)
    distrito = models.CharField(max_length=30, null=True, blank=True)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        '''some options for view in admin'''
        ordering = ['lastname']

    def __unicode__(self):
        name = u' '.join((unicode(self.firstname), unicode(self.lastname))).decode('utf-8').strip()
        # last = self.lastname
        return '{0} {1}'.format(self.empdni_id, name)

    @property
    def name_complete(self):
        name = u' '.join((self.firstname, self.lastname)).encode('utf-8').strip()
        return name

    @property
    def name_charge(self):
        return u' '.join((self.firstname, self.lastname)).encode('utf-8').strip()


class userProfile(models.Model):
    def url(self, filename):
        ruta = 'storage/Users/%s/%s' % (self.empdni, filename)
        return ruta

    user = models.OneToOneField(User)
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    photo = models.ImageField(upload_to=url, null=True, blank=True)

    def __unicode__(self):
        return self.user.username


class Almacene(models.Model):
    almacen_id = models.CharField(primary_key=True, max_length=4)
    nombre = models.CharField(max_length=50, null=False)
    flag = models.BooleanField(default=True, null=False)

    class Meta:
        ordering = ['nombre']

    def __unicode__(self):
        return '%s %s' % (self.almacen_id, self.nombre)


class Transportista(models.Model):
    traruc_id = models.CharField(primary_key=True, max_length=11)
    tranom = models.CharField(max_length=200, null=False)
    tratel = models.CharField(max_length=11, null=True, default='000-000-000')
    flag = models.BooleanField(default=True, null=False)

    def __unicode__(self):
        return '%s %s' % (self.traruc_id, self.tranom)


class Conductore(models.Model):
    traruc = models.ForeignKey(Transportista, to_field='traruc_id')
    condni_id = models.CharField(primary_key=True, max_length=8)
    connom = models.CharField(max_length=200, null=False)
    conlic = models.CharField(max_length=12, null=False)
    coninscription = models.CharField(max_length=12, null=True, blank=True)
    contel = models.CharField(max_length=11, null=True, default='', blank=True)
    flag = models.BooleanField(default=True, null=False)

    def __unicode__(self):
        return '%s %s %s' % (self.traruc, self.condni_id, self.connom)


class Transporte(models.Model):
    traruc = models.ForeignKey(Transportista, to_field='traruc_id')
    nropla_id = models.CharField(primary_key=True, max_length=8)
    marca = models.CharField(max_length=60, null=False)
    flag = models.BooleanField(default=True, null=False)

    def __unicode__(self):
        return '%s %s %s' % (self.traruc, self.nropla_id, self.marca)


class Cliente(models.Model):
    ruccliente_id = models.CharField(primary_key=True, max_length=11)
    razonsocial = models.CharField(max_length=200)
    pais = models.ForeignKey(Pais, to_field='pais_id')
    departamento = models.ForeignKey(Departamento, to_field='departamento_id')
    provincia = models.ForeignKey(Provincia, to_field='provincia_id')
    distrito = models.ForeignKey(Distrito, to_field='distrito_id')
    direccion = models.CharField(max_length=200, null=False)
    telefono = models.CharField(max_length=30, null=True, blank=True, default='000-000-000')
    contact = models.CharField(max_length=200, default='', blank=True)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['razonsocial']

    audit_log = AuditLog()

    def __unicode__(self):
        return '%s %s' % (self.ruccliente_id, self.razonsocial)

    def get_absolute_url(self):
        return reverse('customers_edit', kwargs={'pk': self.ruccliente_id})


class Brand(models.Model):
    brand_id = models.CharField(primary_key=True, max_length=5, null=False)
    brand = models.CharField(max_length=40, null=False)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.brand_id, self.brand)


class Model(models.Model):
    model_id = models.CharField(primary_key=True, max_length=5)
    brand = models.ForeignKey(Brand, to_field='brand_id')
    model = models.CharField(max_length=60)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s - %s' % (self.brand, self.model)


class BrandMaterial(models.Model):
    materiales = models.ForeignKey(Materiale, to_field='materiales_id')
    brand = models.ForeignKey(Brand, to_field='brand_id')

    def __unicode__(self):
        return '%s %s' % (self.materiales, self.brand)


class Herramientas(models.Model):
    herramientas_id = models.CharField(primary_key=True, max_length=14)
    herramientas = models.CharField(max_length=160, null=False)
    medida = models.CharField(max_length=160)
    unidad = models.ForeignKey(Unidade, to_field='unidad_id')
    tvida = models.IntegerField()
    acabado = models.CharField(max_length=13)

    def __unicode__(self):
        return '%s %s %s %s' % (
            self.herramientas_id, self.herramientas, self.medida, self.unidad)


class Documentos(models.Model):
    documento_id = models.CharField(primary_key=True, max_length=4)
    documento = models.CharField(max_length=160)
    tipo = models.CharField(max_length=2)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.documento_id, self.documento)


class FormaPago(models.Model):
    pagos_id = models.CharField(primary_key=True, max_length=4)
    pagos = models.CharField(max_length=160)
    valor = models.FloatField()
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.pagos_id, self.pagos)


class Moneda(models.Model):
    moneda_id = models.CharField(primary_key=True, max_length=4)
    moneda = models.CharField(max_length=60)
    simbolo = models.CharField(max_length=5, default='')
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.moneda_id, self.moneda)


class TipoCambio(models.Model):
    moneda = models.ForeignKey(Moneda, to_field='moneda_id')
    fecha = models.DateField(auto_now=True)
    registrado = models.TimeField(auto_now_add=True)
    compra = models.FloatField()
    venta = models.FloatField()
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s - %f %f' % (
            self.moneda, self.fecha, self.compra, self.venta)


class Rubro(models.Model):
    rubro_id = models.CharField(primary_key=True, max_length=8)
    rubro = models.CharField(max_length=50)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s' % self.rubro


class Proveedor(models.Model):
    proveedor_id = models.CharField(primary_key=True, max_length=11)
    razonsocial = models.CharField(max_length=200)
    direccion = models.CharField(max_length=200)
    pais = models.ForeignKey(Pais, to_field='pais_id')
    departamento = models.ForeignKey(Departamento, to_field='departamento_id')
    provincia = models.ForeignKey(Provincia, to_field='provincia_id')
    distrito = models.ForeignKey(Distrito, to_field='distrito_id')
    telefono = models.CharField(max_length=30)
    tipo = models.CharField(max_length=8)
    origen = models.CharField(max_length=10)
    last_login = models.DateTimeField(auto_now=True, null=True)
    email = models.CharField(
        max_length=60, default='ejemplo@dominio.com', null=True)
    contact = models.CharField(
        max_length=200, default='', blank=True, null=True)
    register = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    rubropro = models.ForeignKey(Rubro, to_field='rubro_id', null=True)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['razonsocial']

    def __unicode__(self):
        return '%s %s %s' % (
                self.proveedor_id, self.razonsocial, self.direccion)


class LoginProveedor(models.Model):
    supplier = models.ForeignKey(Proveedor, to_field='proveedor_id')
    username = models.CharField(max_length=16)
    password = models.CharField(max_length=128)

    def __unicode__(self):
        return '%s %s' % (self.supplier_id, self.username)


class Configuracion(models.Model):
    periodo = models.CharField(max_length=4, default='')
    registrado = models.DateTimeField(auto_now_add=True)
    moneda = models.ForeignKey(Moneda, to_field='moneda_id')
    igv = models.FloatField(default=18)
    perception = models.FloatField(default=2)

    def __unicode__(self):
        return '%s %s' % (self.periodo, self.moneda)


class SettingsApp(models.Model):
    serverreport = models.CharField(max_length=255, default='')
    servermail = models.CharField(max_length=255, default='')
    register = models.DateTimeField(auto_now_add=True)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s %s %d' % (self.servermail, self.serverreport, self.register, self.flag)


class Emails(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    email = models.CharField(max_length=200, null=True)
    fors = models.TextField(null=False)
    cc = models.TextField(null=True, blank=True)
    cco = models.TextField(null=True, blank=True)
    issue = models.CharField(max_length=250)
    body = models.TextField(null=True, blank=True)
    account = models.BooleanField(default=False)

    def __unicode__(self):
        return '%s %s' % (self.empdni, self.fors)


class Company(models.Model):
    def url(self, filename):
        filename = filename.split(".")
        ext = filename[len(filename) - 1]
        ruta = 'imnages/%s.%s' % (self.companyname.replace(' ', ''), ext)
        return ruta
    ruc = models.CharField(primary_key=True, max_length=11)
    companyname = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    phone = models.CharField(
        max_length=60, null=True, default='000-000', blank=True)
    fax = models.CharField(max_length=60, blank=True, null=True)

    def __unicode__(self):
        return '%s %s' % (self.ruc, self.companyname)


class KeyConfirm(models.Model):
    empdni = models.ForeignKey(Employee, to_field='empdni_id')
    email = models.CharField(max_length=80)
    code = models.CharField(max_length=20)
    key = models.CharField(max_length=6)
    desc = models.CharField(max_length=40, default='', null=True)
    flag = models.BooleanField(default=False)

    audit_log = AuditLog()

    def __unicode__(self):
        return '%s %s %s' % (self.empdni, self.code, self.key)


class Tools(models.Model):
    tools_id = models.CharField(max_length=14, primary_key=True)
    name = models.CharField(max_length=255)
    measure = models.CharField(max_length=255, null=True)
    unit = models.ForeignKey(Unidade, to_field='unidad_id')
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return '%s - %s' % (self.name, self.measure)

class LogSys(models.Model):
    version = models.CharField(max_length=10)
    register = models.DateTimeField(auto_now_add=True)
    flag = models.CharField(max_length=1, default='1')
    log = models.TextField()

    audit_log = AuditLog()

    def __unicode__(self):
        return '%s %s' % (self.version, register)


class EmployeeSettings(models.Model):
    register = models.DateTimeField(auto_now_add=True)
    hextperfirst = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    hextpersecond = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    ngratification = models.SmallIntegerField(default=2)
    ncts = models.SmallIntegerField(default=1)
    pergratification = models.DecimalField(max_digits=5, decimal_places=2)
    starthourextra = models.TimeField(default='09:00:00')
    starthourextratwo = models.TimeField(default='11:00:00')
    shxsaturday = models.TimeField(default='15:00:00')
    shxsaturdayt = models.TimeField(default='17:00:00')
    totalhour = models.TimeField(default='08:30:00')
    timeround = models.TimeField(default='00:30:00')
    codeproject = models.CharField(max_length=4, default='', null=True)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    def __unicode__(self):
        return '%s %s %s' % (self.register, self.totalhour, self.flag)
