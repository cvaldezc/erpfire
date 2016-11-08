#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.core.exceptions import ObjectDoesNotExist
import CMSGuias
from CMSGuias.apps.home.models import Brand, Model, Configuracion, KeyConfirm
# from CMSGuias.apps.ventas.models import 'Proyecto'
from CMSGuias.apps.tools import globalVariable


class searchBrands:
    """docstring for searchBrands"""

    brand = ""

    def validFormat(self):
        if self.brand.strip() == '':
            return False
        else:
            self.brand = self.brand.strip()
            return True

    def autoDetected(self):
        print self.brand[:2]
        if self.brand[:2] == "BR":
            try:
                # obj = Brand.objects.get(pk=self.brand)
                return dict((('pk', self.brand),))
            except ObjectDoesNotExist, e:
                raise e
        else:
            obj = Brand.objects.filter(
                    brand__istartswith=self.brand.lower())[:1]
            print obj
            return dict((('pk', obj[0].brand_id),))


class searchModels:
    """docstring for searchModels"""

    model = ""

    def validFormat(self):
        if self.model.strip() == '':
            return False
        else:
            self.model = self.model.strip()
            return True

    def autoDetected(self):
        if self.model[:2] == 'MO':
            try:
                # obj = model.objects.get(pk=self.model)
                return dict((('pk', self.model),))
            except ObjectDoesNotExist, e:
                raise e
        else:
            obj = Model.objects.filter(
                    model__istartswith=self.model.lower())[:1]
            print obj
            return dict((('pk', obj[0].model_id),))


# Get period of project
def searchPeriodProject(code=''):
    period = ''
    if code == '':
        period = globalVariable.get_year
    else:
        try:
            period = CMSGuias.apps.ventas.models.Proyecto.objects.get(
                        proyecto_id__exact=code)
            period = period.registrado.strftime('%Y')
        except ObjectDoesNotExist:
            period = globalVariable.get_year
    return period


# Get igv for year current
def getIGVCurrent(year=''):
    igv = ''
    try:
        conf = Configuracion.objects.get(periodo__exact=year)
        igv = conf.igv
    except ObjectDoesNotExist:
        conf = Configuracion.objects.get(
                    periodo__exact=globalVariable.get_year)
        igv = conf.igv
    return igv


def getPricePurchaseInventory(code=''):
    price = 0
    try:
        if code != '' and len(code) == 15:
            price = CMSGuias.apps.almacen.models.Inventario.objects.filter(
                        materiales_id=code).order_by(
                            '-periodo').distinct('periodo')
            if price.count():
                price = price[:1][0].precompra
            else:
                price = 0
    except ObjectDoesNotExist:
        price = 0
    return price


# valid key
def validKey(key='', code='', desc='', emp=''):
    valid = False
    try:
        obj = KeyConfirm.objects.get(
                empdni_id=emp,
                code=code if code != '' else None,
                desc=desc if desc != '' else None,
                key=key,
                flag=False)
        if obj:
            obj.flag = True
            obj.save()
            valid = True
        else:
            valid = False
    except ObjectDoesNotExist:
        valid = False
    return valid
