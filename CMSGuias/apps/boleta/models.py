#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""This script prompts a user to enter a message to encode or decode
using a classic Caeser shift substitution (3 letter shift)"""
#
from django.db import models


class Cabprinc(models.Model):
    """Principal"""
    idcabpr = models.CharField(primary_key=True, max_length=30)
    periodo = models.CharField(max_length=50)
    tipodni = models.CharField(max_length=20)
    numdni = models.CharField(max_length=10)
    nombres = models.CharField(max_length=100)
    sit = models.CharField(max_length=100)
    fechingreso = models.CharField(max_length=15)
    tipotrab = models.CharField(max_length=60)
    pensionar = models.CharField(max_length=100)
    cuspp = models.CharField(max_length=30)
    lab = models.CharField(max_length=3)
    lab2 = models.CharField(max_length=3)
    subsidiado = models.CharField(max_length=10)
    condici = models.CharField(max_length=60)
    horas = models.CharField(max_length=10)
    minut = models.CharField(max_length=10)
    horas2 = models.CharField(max_length=10)
    minut2 = models.CharField(max_length=10)
    neto = models.CharField(max_length=20)


class Bmotsusp1(models.Model):
    """Boleta suspencion"""
    tipo = models.CharField(primary_key=True, max_length=10)
    motivo = models.CharField(max_length=200)


class Bngreso2(models.Model):
    """Boleta ingreso"""
    cod_ing = models.CharField(primary_key=True, max_length=10)
    conc_ing = models.CharField(max_length=200)


class Bdescuento3(models.Model):
    """Boleta descuento"""
    cod_desc = models.CharField(primary_key=True, max_length=10)
    conc_desc = models.CharField(max_length=60)


class Baportrab4(models.Model):
    """Boleta trabajo"""
    cod_aptrab = models.CharField(primary_key=True, max_length=10)
    conc_aptrab = models.CharField(max_length=200)


class Baportemp5(models.Model):
    """Boleta Temp"""
    cod_apemp = models.CharField(primary_key=True, max_length=10)
    conc_apemp = models.CharField(max_length=200)


class Rmotsusp1(models.Model):
    """Motivo de suspencion"""
    cab = models.ForeignKey('cabprinc')
    tipo = models.ForeignKey('bmotsusp1')
    dias = models.CharField(max_length=5)
    rentas = models.CharField(max_length=60)


class Rngreso2(models.Model):
    """Reingreso"""
    cab = models.ForeignKey('cabprinc')
    ing = models.ForeignKey('bngreso2')
    ing2 = models.CharField(max_length=10)


class Rdescuento3(models.Model):
    """R Descuento"""
    cab = models.ForeignKey('cabprinc')
    desc = models.ForeignKey('bdescuento3')
    des3 = models.CharField(max_length=10)


class Raportrab4(models.Model):
    """Aportaciones"""
    cab = models.ForeignKey('cabprinc')
    aptrab = models.ForeignKey('baportrab4')
    des4 = models.CharField(max_length=10)
    n = models.CharField(max_length=30)


class Raportemp5(models.Model):
    """Report Temporal"""
    cab = models.ForeignKey('cabprinc')
    apemp = models.ForeignKey('baportemp5')
    ne = models.CharField(max_length=10)
