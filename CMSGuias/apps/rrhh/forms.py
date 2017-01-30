from django import forms
from django.contrib.auth.models import User
from .models import *
from CMSGuias.apps.home.models import *

class TipoInstitucionForm(forms.ModelForm):
    class Meta:
        model = TipoInstitucion
        exclude = {'flag', 'tipoinst_id',}
        widgets = {
            'tipo': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoEmpleadoForm(forms.ModelForm):
    class Meta:
        model = TipoEmpleado
        exclude = {'flag', 'tipoemple_id',}
        widgets = {
            'descripcion': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoCoberturaForm(forms.ModelForm):
    class Meta:
        model = CoberturaSalud
        exclude = {'flag','coberturasalud_id',}
        widgets = {
            'cobertura': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoRegimenForm(forms.ModelForm):
    class Meta:
        model = RegimenSalud
        exclude = {'flag','regimensalud_id',}
        widgets = {
            'regimen': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoExamenForm(forms.ModelForm):
    class Meta:
        model = TipoExamen
        exclude = {'flag','tipoexamen_id',}
        widgets = {
            'descripcion': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoRegimenPensForm(forms.ModelForm):
    class Meta:
        model = RegimenPensionario
        exclude = {'flag','regimenpens_id',}
        STATUS_CHOICES = (
            ('S', 'Seguro Privado'),
            ('O', 'ONP'),
            )
        widgets = {
            'regimen': forms.TextInput(attrs={'class': 'form-control'}),
            'coberturapension': forms.TextInput(attrs={'class': 'form-control'})}

class TipoContratoForm(forms.ModelForm):
    class Meta:
        model = TipoContrato
        exclude = {'flag','tipocontrato_id',}
        widgets = {
            'tipocontrato_id': forms.TextInput(attrs={'class': 'form-control'}),
            'contrato': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoPagoForm(forms.ModelForm):
    class Meta:
        model = TipoPago
        exclude = {'flag','tipopago_id',}
        widgets = {
            'pago': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipoSuspensionForm(forms.ModelForm):
    class Meta:
        model = Suspension
        exclude = {'flag',}
        widgets = {
            'suspension_id': forms.TextInput(attrs={'class': 'form-control'}),
            'motivo': forms.TextInput(attrs={'class': 'form-control'}),
        }

class RubroProForm(forms.ModelForm):
    class Meta:
        model = Rubro
        exclude = {'flag','rubro_id',}
        widgets = {
            'rubro': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TipDocForm(forms.ModelForm):
    class Meta:
        model = TipoDocumento
        exclude = {'flag','tipodoc_id',}
        widgets = {
            'documento': forms.TextInput(attrs={'class': 'form-control'}),
        }