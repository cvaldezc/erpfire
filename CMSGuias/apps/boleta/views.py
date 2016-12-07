#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""this is views Boleta"""
#
import os
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
# from xml.dom import minidom

from .models import *


class Main(TemplateView):
    """Menu Boleta"""
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        return render(request, 'tickets/main.html', kwargs)


class DeleteData(TemplateView):
    """Delete all data of tables"""
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        Rmotsusp1.objects.all().delete()
        Rngreso2.objects.all().delete()
        Rdescuento3.objects.all().delete()
        Raportrab4.objects.all().delete()
        Raportemp5.objects.all().delete()
        Cabprinc.objects.all().delete()
        return HttpResponse("Datos Eliminados")


class UploadTickets(TemplateView):
    """load tickets"""
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        return render(request, 'tickets/loads.html')


class SearchView(TemplateView):
    """search tickets"""
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        return render(request, 'tickets/search.html', kwargs)


class UploadView(TemplateView):
    """load files """
    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        try:
            kwargs['li'] = list()
            newli = list()
            path = '%s/storage/tickets/' % settings.MEDIA_ROOT
            if not os.path.exists(path):
                os.makedirs(path, mode=0777)
            print path
            for c, x in enumerate(request.FILES.getlist("files[]")):
                filename = '%sfile_%s.xml' % (path, str(c))
                def process(f):
                    with open(filename, 'wb+') as destination:
                        for chunk in f.chunks():
                            destination.write(chunk)
                process(x)
                lista = []
                lista2 = []
                text = open(filename)
                lines = text.readlines()
                i = 0
                for x in lines:
                    if 'ss:Data ss:Type' in x:
                        lista.append(x)
                        d = lista[i][36:-11]
                        lista2.append(d)
                        i = i + 1
                print '**************'
                p = lista2[6][10:]
                pe = p.replace("/", "")
                per = p.replace("/", "-")
                a = lista2[6] + lista2[14]
                cod = pe + lista2[14]
                ##OBTENER NETO##
                i = 0
                for x in lista2:
                    if x == 'Neto a Pagar':
                        n = lista2[i + 1]
                    i = i + 1

                tam = Cabprinc.objects.all().count()
                try:
                    Cabprinc.objects.get(idcabpr=cod)
                    kwargs['li'].append(cod)
                    continue
                except(Cabprinc.DoesNotExist):
                    r = Cabprinc(
                        idcabpr=cod,
                        periodo=per,
                        tipodni=lista2[13],
                        numdni=lista2[14],
                        nombres=lista2[15],
                        sit=lista2[16],
                        fechingreso=lista2[21],
                        tipotrab=lista2[22],
                        pensionar=lista2[23],
                        cuspp=lista2[24],
                        lab=lista2[35],
                        lab2=lista2[36],
                        subsidiado=lista2[37],
                        condici=lista2[38],
                        horas=lista2[39],
                        minut=lista2[40],
                        horas2=lista2[41],
                        minut2=lista2[42],
                        neto=n)
                    r.save()

                # rango de lineas
                print '*********aaaa'
                tamlis = len(lista2)
                fil = lista2[43:tamlis]
                ##lista de Tipo-Conceptos##
                i = 0
                for x in lista2:
                    if x == 'Conceptos':
                        n = lista2[i]
                        fil2 = lista2[48:i - 1]
                        txtdias = i - 3
                        v = lista2[txtdias]
                        print v
                    i = i + 1
                i = 0

                while i < len(fil2):
                    if len(fil2[i]) == 0:
                        break
                    try:
                        rm1 = Bmotsusp1.objects.get(tipo=fil2[i])
                    except Bmotsusp1.DoesNotExist, e:
                        rm1 = Bmotsusp1(tipo=fil2[i], motivo=fil2[i + 1])
                        rm1.save()
                    try:
                        Rmotsusp1.objects.get(cab_id=cod, tipo_id=fil2[i])
                        continue
                    except Rmotsusp1.DoesNotExist:
                        rm = Rmotsusp1(
                            cab_id=cod,
                            tipo_id=fil2[i],
                            dias=fil2[i + 2],
                            rentas=fil2[i + 3])
                        rm.save()
                        i += 4

                # LISTA INGRESOS-DESCUENTOS
                k = 0
                for x in lista2:
                    if x == 'Ingresos':
                        g = 0
                        for x in lista2:
                            if x == 'Descuentos':
                                print 'sss ' + str(k), str(g)
                                listaIng = lista2[k + 1:g]
                            g = g + 1
                    k = k + 1
                for x in listaIng:
                    print x, listaIng[0]
                i = 0
                while i < len(listaIng):
                    try:
                        ring2 = Bngreso2.objects.get(cod_ing=listaIng[i])
                    except Bngreso2.DoesNotExist, e:
                        ring2 = Bngreso2(cod_ing=listaIng[i], conc_ing=listaIng[i + 1])
                        ring2.save()
                    try:
                        Rngreso2.objects.get(cab_id=cod, ing_id=listaIng[i])
                        continue
                    except (Rngreso2.DoesNotExist):
                        r2 = Rngreso2(
                            cab_id=cod,
                            ing_id=listaIng[i],
                            ing2=listaIng[i + 2])

                        r2.save()
                        i += 3

                # LISTA DESCUENTOS-APORTES DEL TRABAJADOR

                k = 0
                for x in lista2:
                    if x == 'Descuentos':
                        g = 0
                        for x in lista2:
                            if x == 'Aportes del Trabajador':
                                print 'sss ' + str(k), str(g)
                                listaDes = lista2[k + 1:g]
                            g = g + 1
                    k = k + 1

                for x in listaDes:
                    print x

                i = 0

                while i < len(listaDes):
                    try:
                        rdes3 = Bdescuento3.objects.get(cod_desc=listaDes[i])
                    except Bdescuento3.DoesNotExist, e:
                        rdes3 = Bdescuento3(
                            cod_desc=listaDes[i], conc_desc=listaDes[i + 1])
                        rdes3.save()
                    try:
                        Rdescuento3.objects.get(cab_id=cod, desc_id=listaDes[i])
                        continue
                    except (Rdescuento3.DoesNotExist):
                        r3 = Rdescuento3(
                            cab_id=cod,
                            desc_id=listaDes[i],
                            des3=listaDes[i + 2])
                        r3.save()
                        i += 3

                # LISTA APORTES DEL TRABAJADOR - NETO A PAGAR
                k = 0
                for x in lista2:
                    if x == 'Aportes del Trabajador':
                        g = 0
                        for x in lista2:
                            if x == 'Neto a Pagar':
                                print 'sss ' + str(k), str(g)
                                listaAportr = lista2[k + 1:g]
                            g = g + 1
                    k = k + 1

                for x in listaAportr:
                    print x
                i = 0

                while i < len(listaAportr):
                    try:
                        raport4 = Baportrab4.objects.get(cod_aptrab=listaAportr[i])
                    except Baportrab4.DoesNotExist, e:
                        raport4 = Baportrab4(
                            cod_aptrab=listaAportr[i],
                            conc_aptrab=listaAportr[i + 1])
                        raport4.save()

                    try:
                        Raportrab4.objects.get(cab_id=cod, aptrab_id=listaAportr[i])
                        continue
                    except (Raportrab4.DoesNotExist):
                        r4 = Raportrab4(
                            cab_id=cod,
                            aptrab_id=listaAportr[i],
                            des4=listaAportr[i + 2],
                            n=listaAportr[i + 3])
                        r4.save()
                        i += 4

                # LISTA APORTES DE EMPLEADOR - TOTAL
                t = 0
                for x in lista2:
                    if x == 'Aportes de Empleador':
                        print 'apo ' + x
                        listaEmple = lista2[t + 1:tamlis]

                        for x in listaEmple:
                            print x
                        print len(listaEmple)
                    t = t + 1

                i = 0

                while i < len(listaEmple):
                    try:
                        rempl5 = Baportemp5.objects.get(cod_apemp=listaEmple[i])
                    except Baportemp5.DoesNotExist, e:
                        rempl5 = Baportemp5(
                            cod_apemp=listaEmple[i],
                            conc_apemp=listaEmple[i + 1])
                        rempl5.save()

                    try:
                        Raportemp5.objects.get(cab_id=cod, apemp_id=listaEmple[i])
                        continue
                    except (Raportemp5.DoesNotExist):
                        r5 = Raportemp5(
                            cab_id=cod,
                            apemp_id=listaEmple[i],
                            ne=listaEmple[i + 2])
                        r5.save()
                        i += 3
                text.close()
            path = settings.MEDIA_ROOT + '/storage/tickets/'
            try:
                for xfile in os.listdir(path):
                    os.remove('%s%s' % (path, xfile))
            except Exception as e:
                print e
            kwargs['status'] = True
        except Exception as ex:
            kwargs['raise'] = str(ex)
            kwargs['status'] = False
        return render(request, 'tickets/result.html', kwargs)
