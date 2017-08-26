#!/usr/bin/env python
#-*- Encoding: utf-8 -*-
#
from django import forms
from django.contrib.auth.models import User

# from .home.models import *
from CMSGuias.apps.home.models import(
    FormaPago, Documentos,Moneda, Cargo, AreaCargo, Unidade, AreaCargo, MNiple)

class FormaPagoForm(forms.ModelForm):
    class Meta:
        exclude = {'pagos_id','flag',}
        model = FormaPago
        widgets = {
            'pagos' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'valor' : forms.TextInput(attrs = {'class' : 'form-control'}),
        }

class DocumentoForm(forms.ModelForm):
    class Meta:
        exclude = {'documento_id','flag',}
        model = Documentos
        widgets = {
            'documento' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'tipo' : forms.TextInput(attrs = {'class' : 'form-control'}),
        }

class MonedaForm(forms.ModelForm):
    class Meta:
        exclude = {'moneda_id','flag',}
        model = Moneda
        widgets = {
            'moneda' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'simbolo' : forms.TextInput(attrs = {'class' : 'form-control'}),
        }

class CargoEmpleForm(forms.ModelForm):
    class Meta:
        exclude = {'flag','unit'}
        model = Cargo
        widgets = {
            'cargo_id' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'cargos' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'area' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'areac': forms.Select(attrs={'class': 'form-control browser-default'})
        }

class AreaForm(forms.ModelForm):
    class Meta:
        exclude = {'area_id','flag'}
        model = AreaCargo
        widgets = {
            'area' : forms.TextInput(attrs = {'class' : 'form-control'}),
        }

class MNipleForm(forms.ModelForm):
    class Meta:
        exclude = {'flag'}
        model = MNiple
        widgets = {
            'ktype' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'ntype' : forms.TextInput(attrs = {'class' : 'form-control'}),
            'ncount' : forms.TextInput(attrs = {'class' : 'form-control'}),
        }