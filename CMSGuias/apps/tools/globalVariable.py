#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime
import pytz
from random import randint

from django.conf import settings
from django.contrib import messages
from django.http import Http404
from CMSGuias.apps.tools import number_to_char


#######################
#  Variables Globals  #
#######################
"""
    Status ENTITIES
"""
status = {
    'AC': 'ACTIVO',
    'AN': 'ANULADO',
    'AP': 'APROBADO',
    'CO': 'COMPLETO',
    'DL': 'ELIMINADO',
    'IN': 'INCOMPLETO',
    'NN': 'Nothing',
    'PE': 'PENDIENTE',
    'EN': 'ENVIADO',
    'UP': 'CARGADO',
}

doc_status = [
    {'key': 'AC', 'status': 'ACTIVO'},
    {'key': 'AN', 'status': 'ANULADO'},
    {'key': 'AP', 'status': 'APROBADO'},
    {'key': 'CO', 'status': 'COMPLETO'},
    {'key': 'DL', 'status': 'ELIMINADO'},
    {'key': 'IN', 'status': 'INCOMPLETO'},
    {'key': 'NN', 'status': 'NOTHING'},
    {'key': 'PE', 'status': 'PENDIENTE'},
    {'key': 'EN', 'status': 'ENVIADO'},
    {'key': 'UP', 'status': 'CARGADO'},
]

# types nipples
tipo_nipples = {
    'A': 'Roscado',
    'B': 'Ranurado',
    'C': 'Rosca - Ranura',
    'D': 'Brida',
    'E': 'Brida - Rosca',
    'F': 'Brida - Ranura',
    'G': 'Bisel - Bisel',
    'H': 'Bisel - Rosca',
    'I': 'BridaHechizo',
    '-': ''}

# name month
months_name = {
    'January': 'Enero',
    'February': 'Febrero',
    'March': 'Marzo',
    'April': 'Abril',
    'May': 'Mayo',
    'June': 'Junio',
    'July': 'Julio',
    'August': 'Agosto',
    'September': 'Setiembre',
    'Octuber': 'Octubre',
    'November': 'Noviembre',
    'Decemcer': 'Diciembre'
}
# munber month
months_name = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Setiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre'
}

# List of emails
emails = [
    # 'almacen@icrperusa.com',
    'armando.atencio@icrperusa.com',
    # 'asistente1@icrperusa.com',
    'contabilidad@icrperusa.com',
    'cvaldezchavez@gmail.com',
    'danilo.martinez@icrperusa.com',
    # 'icr.luisvalencia@gmail.com',
    'logistica@icrperusa.com',
    'luis.martinez@icrperusa.com',
    'sandra.atencio@icrperusa.com',
    'steven.paredes@icrperusa.com',
    'ssoma1@icrperusa.com',
    'jesus.esteban@icrperusa.com',
    # 'operaciones1@icrperusa.com',
    'operaciones2@icrperusa.com',
    'operaciones3@icrperusa.com',
    'calidad@icrperusa.com',
    # 'mauromartinezicr@gmail.com',
    'a.atenciov@icrperusa.com',
    'jhon.martinez@icrperusa.com',
    'ingeneria1@icrperusa.com',
    'info@icrperusa.com']

# Type of project
typeProject = {
    'ACI': 'Agua Contra Incendio',
    'MAN': 'Mantenimiento',
    'AYD': 'Alarma y Detección'
}

# date now format str


def date_now(type='date', format='%Y-%m-%d'):
    date = datetime.datetime.today()
    if type == 'str':
        return '%s' % (date.strftime(format))
    elif type == 'date':
        return date.date()
    elif type == 'time':
        return date.time()
    else:
        return date

# Convert Date str to Date and date to str


def format_date_str(_date=None, format='%Y-%m-%d', options={}):
    date_str = ''
    try:
        if _date is not None:
            if format.startswith('%d'):
                date_str = _date.strftime(format)
                old = _date.strftime('%B')
                date_str = date_str.replace(old, months_name[old])
            else:
                date_str = _date.strftime(format)
        else:
            date_str = 'date invalid!'
    except Exception, e:
        messages.add_message('%s' % str(e))
    return date_str


def format_time_str(_date=None, format='%H:%M:%S', options={}):
    time_str = ''
    try:
        if _date is not None:
            if options.__len__() > 0:
                if options['tz']:
                    local = pytz.timezone(settings.TIME_ZONE)
                    _date = local.normalize(_date)
                    time_str = _date.strftime(format)
            else:
                time_str = _date.strftime(format)
        else:
            time_str = 'date invalid!'
    except Exception, e:
        messages.add_message('%s' % e)
        raise Http404
    return time_str


def format_str_date(_str=None, format='%Y-%m-%d'):
    str_date = ''
    try:
        if _str is not None:
            str_date = datetime.datetime.strptime(_str, format).date()
        else:
            str_date = 'str invalid!'
    except Exception, e:
        str_date = 'date invalid!'
        # messages.add_message(e)
    return str_date
# Block Dates and Times
# get year current str
get_year = datetime.datetime.today().date().strftime('%Y')

getToday = datetime.datetime.today()

# get Relative path
relative_path = settings.MEDIA_ROOT


def get_Token():
    token = ''
    try:
        chars = '1C3A5E7B9H2D46FI80GJZXYPRTKL'
        for x in xrange(0, 6):
            index = randint(0, (chars.__len__() - 1))
            token = '%s%s' % (token, chars[index])
    except Exception, e:
        raise e
    return token

def get_pin():
    pin = ''
    try:
        ar = list()
        for x in range(0, 6):
            pin += str(randint(0, 9))
    except Exception as ex:
        print ex
        pin = '000000'
    return pin

def convertNumberLiteral(number=0):
    literal = ''
    try:
        literal = number_to_char.numero_a_letras(number)
    except Exception:
        literal = 'Nothing'
    return literal
