#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime
from random import randint

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Max

from CMSGuias.apps.almacen.models import (
    Pedido, GuiaRemision, Suministro, NoteIngress, Restoration, devolucionHerra,
    GrupoPedido)
from CMSGuias.apps.logistica.models import Cotizacion, Compra, ServiceOrder
from CMSGuias.apps.ventas.models import Proyecto, ProjectItemizer
from CMSGuias.apps.home.models import Brand, Model, GroupMaterials, TypeGroup, TipoEmpleado, Rubro
from CMSGuias.apps.operations.models import (
    Deductive, Letter, PreOrders, SGroup, DSector)
from CMSGuias.apps.ventas.budget.models import AnalysisGroup, Analysis, Budget

from ..rrhh.models import (
    TipoInstitucion, CoberturaSalud, RegimenSalud, RegimenPensionario, TipoExamen,
    TipoContrato, TipoPago, TipoDocumento, EmpleCampo, TypesEmployee, EmployeeBreak)


# format date str
__date_str = '%Y-%m-%d'
__year_str = '%y'


def __init__():
    return 'MSG => select key generator'


def GenerateIdOrders():
    id = None
    try:
        cod = Pedido.objects.latest('registrado')
        # .all().aggregate(Max('pedido_id'))
        id = cod.pedido_id
        an = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            aa = int(id[2:4])
            count = int(id[4:10])
            if an > aa:
                count = 1
            else:
                count += 1
        else:
            count = 1
        id = '%s%s%s' % ('PE', str(an), '{:0>6d}'.format(count))
    except Pedido.DoesNotExist:
        an = int(datetime.datetime.today().strftime(__year_str))
        id = '%s%s%s' % ('PE', str(an), '{:0>6d}'.format(1))
    return u'%s' % id


# generate serie - number of guide for key guide remision
def GenerateSerieGuideRemision():
    id = None
    try:
        cod = GuiaRemision.objects.all().aggregate(Max('guia_id'))
        id = cod['guia_id__max']
        if id is not None:
            # print 'codigo not empty'
            sr = int(id[0:3])
            num = int(id[4:])
            # print '%i %i'%(sr,num)
            sr = sr + 1 if num >= 99999999 else sr
            num = num + 1 if num <= 99999999 else 1
            # print '%i %i'%(sr,num)
        else:
            sr = 1
            num = 1
        id = '%s-%s' % ('{:0>3d}'.format(sr), '{:0>8d}'.format(num))
    except ObjectDoesNotExist, e:
        id = '000-00000000'
        raise e
    return id


# Generate id for order supply
def GenerateKeySupply():
    id = None
    try:
        cod = Suministro.objects.aggregate(max=Max('suministro_id'))
        id = cod['max']
        cy = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if cy > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('SP', cy.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


# Generate id for order Quotation
def GenerateKeyQuotation():
    id = None
    try:
        cod = Cotizacion.objects.aggregate(max=Max('cotizacion_id'))
        id = cod['max']
        cy = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if cy > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('SC', cy.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GeneratekeysQuoteClient():
    keys = ''
    try:
        chars = '@ObAcPdB1Qe2Cf3Dg4Rh5Ei6S7jF8kT9lG0UmnHoWpIqJrYsKtLuZwMyzN!' \
                '()=|'
        for x in xrange(1, 10):
            index = randint(0, (chars.__len__() - 1))
            keys = '%s%s' % (keys, chars[index])
    except Exception, e:
        raise e
    return 'SC%s' % keys


# Generate id for order Quotation
def GenerateKeyPurchase():
    id = None
    try:
        cod = Compra.objects.aggregate(max=Max('compra_id'))
        id = cod['max']
        cy = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if cy > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('OC', cy.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


# Generate Id for Project
def GenerateIdPorject():
    id = None
    try:
        code = Proyecto.objects.aggregate(max=Max('proyecto_id'))
        id = code['max']
        yn = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:7])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('PR', yn.__str__(), '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


# Generate Id for Brand
def GenerateIdBrand():
    id = None
    try:
        code = Brand.objects.aggregate(max=Max('brand_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:5])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('BR', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


# Generate Id for Model
def GenerateIdModel():
    id = None
    try:
        code = Model.objects.aggregate(max=Max('model_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:5])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('MO', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdNoteIngress():
    id = None
    try:
        code = NoteIngress.objects.aggregate(max=Max('ingress_id'))
        id = code['max']
        yn = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('NI', yn.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdDeductive():
    id = None
    try:
        code = Deductive.objects.aggregate(max=Max('deductive_id'))
        id = code['max']
        yn = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('DC', yn.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdGroupMaterials():
    id = None
    try:
        code = GroupMaterials.objects.aggregate(max=Max('mgroup_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:10])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('GM', '{:0>8d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdTypeGroupMaterials():
    id = None
    try:
        code = TypeGroup.objects.aggregate(max=Max('tgroup_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:7])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('TG', '{:0>5d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


# Generate Key COnfirm
def GeneratekeysConfirm():
    keys = ''
    try:
        chars = '1234567890'
        for x in xrange(0, 6):
            index = randint(0, (chars.__len__() - 1))
            keys = '%s%s' % (keys, chars[index])
    except Exception, e:
        raise e
    return '%s' % keys


def GenerateIdServiceOrder():
    id = None
    try:
        code = ServiceOrder.objects.aggregate(max=Max('serviceorder_id'))
        id = code['max']
        yn = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            yy = int(id[2:4])
            counter = int(id[4:10])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%s%s' % ('SO', yn.__str__(), '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def generateLetterCode(pro='PRAA000', ruc=''):
    id = None
    try:
        code = Letter.objects.latest('register')
        # print code.register
        id = code.letter_id
        yn = int(datetime.datetime.today().strftime(__year_str))
        if id is not None:
            counter = int(id[-3:])
            if yn > int(code.register.strftime('%y')):
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        if ruc == '20428776110':
            signal = 'ICR'
        else:
            signal = 'ICT'
        id = 'CTA-%s-%s-%s' % (signal, pro, '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
        id = 'CTA-%s-%s-%s' % ('ICR', pro, '{:0>3d}'.format(1))
    return id


def generatePreOrdersId():
    id = None
    yn = int(datetime.datetime.today().strftime(__year_str))
    try:
        code = PreOrders.objects.latest('register')
        id = code.preorder_id
        if id is not None:
            yy = int(id[3:5])
            counter = int(id[5:10])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%i%s' % ('PRO', yn, '{:0>5d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
        id = '%s%i%s' % ('PRO', yn, '{:0>5d}'.format(1))
    return id


def generateAnalysis():
    id = None
    try:
        code = Analysis.objects.latest('register')
        id = code.analysis_id
        if code.analysis_id:
            counter = int(code.analysis_id[2:])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('AP', '{:0>6d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
        id = '%s%s' % ('AP', '{:0>6d}'.format(1))
    return id


def generateGroupAnalysis():
    id = None
    try:
        code = AnalysisGroup.objects.latest('register')
        if code.agroup_id:
            counter = int(code.agroup_id[2:])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('AG', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
        id = '%s%s' % ('AG', '{:0>3d}'.format(1))
    return id


def generateBudget():
    id = None
    yn = int(datetime.datetime.today().strftime(__year_str))
    try:
        code = Budget.objects.latest('register')
        id = code.budget_id
        if id is not None:
            yy = int(id[4:6])
            counter = int(id[6:10])
            if yn > yy:
                counter = 1
            else:
                counter += 1
        else:
            counter = 1
        id = '%s%i%s' % ('PROP', yn, '{:0>4d}'.format(counter))
    except ObjectDoesNotExist:
        id = '%s%i%s' % ('PROP', yn, '{:0>4d}'.format(1))
    return id


def genSGroup(pro=None, sec=None):
    try:
        row = SGroup.objects.filter(
                project_id=pro, sector_id=sec)
        if row:
            row = row.latest('register')
            code = int(row.sgroup_id[-4:])
            return '%s%s%s' % (pro, str(sec.strip()[-5:]), 'SG{:0>4d}'.format(code + 1))
        else:
            return '%s%s%s' % (pro, str(sec.strip()[-5:]), 'SG0001')
    except ObjectDoesNotExist:
        return '%s%s%s' % (pro, str(sec.strip()[-5:]), 'SG0001')


def genDSector(pro, group=None):
    try:
        raw = DSector.objects.filter(
                sgroup_id=group)
        if raw:
            raw = raw.latest('register')
            code = int(raw.dsector_id[-3:])
            return '%s%s' % (group, 'DS{:0>3d}'.format(code + 1))
        else:
            return '%s%s' % (group, 'DS001')
    except ObjectDoesNotExist:
        return '%s%s' % (group, 'DS001')


def keyRestoration():
    yn = int(datetime.datetime.today().strftime(__year_str))
    count = 1
    try:
        raw = Restoration.objects.latest('register')
        if raw:
            if yn > int(raw.restoration_id[1:3]):
                count = 1
            else:
                count = (int(raw.restoration_id[3:]) + 1)
            return 'D%s%s' % (yn, '{:0>3d}'.format(count))
        else:
            return 'D%s%s' % (yn, '{:0>3d}'.format(count))
    except ObjectDoesNotExist:
        return 'D%s%s' % (yn, '{:0>3d}'.format(count))


def TypesEmployeeKeys():
    count = 1
    try:
        raw = TypesEmployee.objects.latest('register')
        count = int(raw.types_id[2:]) + 1
    except Exception as ex:
        count = 1
    return 'TY%s' % ('{:0>2d}'.format(count))


def StatusAssistanceId():
    count = 1
    try:
        raw = EmployeeBreak.objects.latest('register')
        count = (int(raw.status_id[2:]) + 1)
    except Exception as exk:
        count = 1
        print exk
    return 'AS%s' % ('{:0>2d}'.format(count))


def GenerateIdTipEmple():
    id = None
    try:
        code = TipoEmpleado.objects.aggregate(max=Max('tipoemple_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('EM', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdInstituto():
    id = None
    try:
        code = TipoInstitucion.objects.aggregate(max=Max('tipoinst_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('IN', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdCobertura():
    id = None
    try:
        code = CoberturaSalud.objects.aggregate(max=Max('coberturasalud_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('CB', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdRegimenSalud():
    id = None
    try:
        code = RegimenSalud.objects.aggregate(max=Max('regimensalud_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('RS', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdRegimenPensionario():
    id = None
    try:
        code = RegimenPensionario.objects.aggregate(max=Max('regimenpens_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('RP', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdExamen():
    id = None
    try:
        code = TipoExamen.objects.aggregate(max=Max('tipoexamen_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('EX', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdContrato():
    id = None
    try:
        code = TipoContrato.objects.aggregate(max=Max('tipocontrato_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('CT', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdPago():
    id = None
    try:
        code = TipoPago.objects.aggregate(max=Max('tipopago_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('PA', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdRubro():
    id = None
    try:
        code = Rubro.objects.aggregate(max=Max('rubro_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('RU', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id


def GenerateIdDoc():
    id = None
    try:
        code = TipoDocumento.objects.aggregate(max=Max('tipodoc_id'))
        id = code['max']
        print code
        print id
        if id is not None:
            counter = int(id[2:5])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('DC', '{:0>3d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

def GenerateIdEmpleCampo(dni=None, pr=None):
    try:
        row = EmpleCampo.objects.filter(empdni_id=dni, proyecto_id=pr).latest('registro')
        print dni
        print pr
        if row:
            code = int(row.emplecampo_id[-3:])
            print code
            return '%s%s%s' % (dni, pr, '{:0>3d}'.format(code + 1))
        else:
            return '%s%s%s' % (dni, pr, '001')
    except ObjectDoesNotExist:
        return '%s%s%s' % (dni, pr, '001')


def GenerateIdGuiaDev():
    id = None
    try:
        code = devolucionHerra.objects.aggregate(max=Max('docdev_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:7])
            print counter
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('DO', '{:0>5d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

"""
add 2017-05-18 17:25:51
@ Juan Julcapari
"""
def GenerateIdGrupoPedido():
    """
    generate group order
    """
    id = ""
    try:
        code = GrupoPedido.objects.aggregate(max=Max('codgrupo_id'))
        id = code['max']
        if id is not None:
            counter = int(id[2:7])
            counter += 1
        else:
            counter = 1
        id = '%s%s' % ('GR', '{:0>5d}'.format(counter))
    except ObjectDoesNotExist, e:
        raise e
    return id

# 2017-07-10 12:24:48
# @cvaldezch - add generate for itemizer
def GenerateIDItemizerProject(pro):
    '''
    generate max item for each project
    '''
    number = ''
    counter = 1
    try:
        code = ProjectItemizer.objects.filter(project_id=pro).latest('register')
        print code
        if code is not None:
            counter = (int(code.itemizer_id[9:]) + 1)
    except ObjectDoesNotExist as oex:
        counter = 1
    number = u'{0}{1:0>3d}'.format(pro, counter)
    return number
# endblock
