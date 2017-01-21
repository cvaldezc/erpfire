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
    starthour = models.TimeField(default='08:00', null=False)
    outsaturday = models.TimeField(default='00:00:00', null=True, blank=True)
    flag = models.BooleanField(default=True, null=False)

    audit_log = AuditLog()

    class Meta:
        ordering = ['-register']

    def __unicode__(self):
        return '%s % s %s' % (self.description, self.starthour, self.flag)

class EmployeeBreak(models.Model):
    """ define the break for employees already break, license, vacation, lack """
    status_id = models.CharField(primary_key=True, max_length=4, null=False)
    description = models.CharField(max_length=60)
    register = models.DateTimeField(auto_now_add=True)
    flag = models.BooleanField(default=True)

    class Meta:
        ordering = ['-register']

    def __unicode__(self):
        return '%s %s' % (self.description)

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
    viatical = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    status = models.ForeignKey(EmployeeBreak, related_name='breakforemployee', null=True)
    flag = models.CharField(max_length=1, default='A')
    tag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['-register']

    def __unicode__(self):
        return '%s %s %s %s' % (self.register, self.employee, self.assistance, self.tag)


class BalanceAssistance(models.Model):
    employee = models.ForeignKey(Employee, related_name='EmployeeasRegister')
    assistance = models.DateField(null=False)
    hextfirst = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    hextsecond = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    hwork = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    hdelay = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    hlack = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=True)
    flag = models.BooleanField(default=True)

    def __unicode__(self):
        return '%s %s' % (self.employee_id, self.assistance)

# INSERT INTO public.almacen_nipleguiaremision(
#     guia_id, materiales_id, metrado, cantguide, tipo, flag, brand_id, model_id, related, order_id)
# 	VALUES ('001-00022224', '115100030400034', 55, 2, 'A', true, 'BR000', 'MO000', 17869,'PE16002599');
