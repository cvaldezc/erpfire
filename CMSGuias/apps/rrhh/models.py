#!/usr/bin/env python
# -*- condingL utf-8 -*-

from django.db import models
from audit_log.models.managers import AuditLog

from ..home.models import Employee
from ..ventas.models import Proyecto


class TypesEmployee(models.Model):
    """  Type of Employee """
    types_id = models.CharField(primary_key=True, max_length=4, default='TY00')
    register = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=60)
    flag = models.BooleanField(default=True, null=False)

    audit_log = AuditLog()

    class Meta:
        ordering = ['-register']

    def __unicode__(self):
        return '%s' % (self)


class Assistance(models.Model):
    userregister = models.ForeignKey(Employee, related_name='EmployeeRegister')
    employee = models.ForeignKey(Employee, related_name='AssistanceEmployee')
    project = models.ForeignKey(Proyecto, related_name='AssistanceProject', null=True)
    types = models.ForeignKey(TypesEmployee, related_name='AssistanceTypeEmpployee')
    register = models.DateTimeField(auto_now_add=True)
    assistance = models.DateField(null=False)
    hourin = models.TimeField(null=False, default='00:00:00')
    hourinbreak = models.TimeField(null=False, default='00:00:00')
    houroutbreak = models.TimeField(null=False, default='00:00:00')
    hourout = models.TimeField(null=False, default='00:00:00')
    hextfirst = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    hextsecond = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    tag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['-register']

    def __unicode__(self):
        return '%s' % (self)

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 55, 2, 'A', true, 'BR000', 'MO000', 17869,'PE16002599');

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 59, 1, 'A', true, 'BR000', 'MO000', 17868,'PE16002599');

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 64, 1, 'A', true, 'BR000', 'MO000', 17867,'PE16002599');

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 70, 2, 'A', true, 'BR000', 'MO000', 17866,'PE16002599');

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 10, 6, 'A', true, 'BR000', 'MO000', 17865,'PE16002599');
