import json


from django.core.exceptions import ObjectDoesNotExist
from django.db.models import get_models
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext, TemplateDoesNotExist
from django.conf import settings
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView, TemplateView, View
from django.views.generic.edit import CreateView, UpdateView, DeleteView


from CMSGuias.apps.cruds.forms import (
	FormaPagoForm,DocumentoForm,MonedaForm,CargoEmpleForm,AreaForm,MNipleForm)
from CMSGuias.apps.home.models import (
    FormaPago,Documentos,Moneda,Cargo,AreaCargo, MNiple)
from CMSGuias.apps.tools import genkeys



class JSONResponseMixin(object):
    def render_to_json_response(self, context, **response_kwargs):
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        return json.dumps(context, encoding='utf-8', cls=DjangoJSONEncoder)


class CrudsHome(JSONResponseMixin, TemplateView):
    @method_decorator(login_required)
    def get(self,request,*args,**kwargs):
    	return render(request,'cruds/crudshome.html')


# CRUD FORMA DE PAGO
# LIST
class FormaPagoList(ListView):
    template_name = 'cruds/formapago/formapago.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listformpago'] = FormaPago.objects.filter(flag=True).order_by('pagos')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class FormaPagoCreate(CreateView):
    form_class = FormaPagoForm
    model = FormaPago
    success_url = reverse_lazy('formpago_list')
    template_name = 'cruds/formapago/formapago_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(FormaPagoCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        try:
            pago = FormaPago.objects.get(pagos__icontains=self.object.pagos)
            if pago:
                return HttpResponseRedirect(self.success_url)
        except ObjectDoesNotExist:
            self.object.pagos_id = genkeys.GenerateIdFormaPago()
            self.object.save()
            return super(FormaPagoCreate, self).form_valid(form)

# EDIT
class FormaPagoEdit(UpdateView):
    form_class = FormaPagoForm
    model = FormaPago
    slug_field = 'pagos_id'
    slug_url_kwarg = 'pagos_id'
    success_url = reverse_lazy('formpago_list')
    template_name = 'cruds/formapago/formapago_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(FormaPagoEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class FormaPagoDelete(DeleteView):
    model = FormaPago
    slug_field = 'pagos_id'
    slug_url_kwarg = 'pagos_id'
    success_url = reverse_lazy('formpago_list')
    template_name = 'cruds/formapago/formapago_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(FormaPagoDelete, self).dispatch(request, *args, **kwargs)



# CRUD DOCUMENTO
# LIST
class DocumentoList(ListView):
    template_name = 'cruds/documento/documento.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listdocumento'] = Documentos.objects.filter(flag=True).order_by('documento')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class DocumentoCreate(CreateView):
    form_class = DocumentoForm
    model = Documentos
    success_url = reverse_lazy('documento_list')
    template_name = 'cruds/documento/documento_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DocumentoCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        try:
            documento = Documentos.objects.get(documento__icontains=self.object.documento)
            if documento:
                return HttpResponseRedirect(self.success_url)
        except ObjectDoesNotExist:
            self.object.documento_id = genkeys.GenerateIdDocumento()
            self.object.save()
            return super(DocumentoCreate, self).form_valid(form)

# EDIT
class DocumentoEdit(UpdateView):
    form_class = DocumentoForm
    model = Documentos
    slug_field = 'documento_id'
    slug_url_kwarg = 'documento_id'
    success_url = reverse_lazy('documento_list')
    template_name = 'cruds/documento/documento_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DocumentoEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class DocumentoDelete(DeleteView):
    model = Documentos
    slug_field = 'documento_id'
    slug_url_kwarg = 'documento_id'
    success_url = reverse_lazy('documento_list')
    template_name = 'cruds/documento/documento_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DocumentoDelete, self).dispatch(request, *args, **kwargs)


# CRUD MONEDA
# LIST
class MonedaList(ListView):
    template_name = 'cruds/moneda/moneda.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listmoneda'] = Moneda.objects.filter(flag=True).order_by('moneda')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class MonedaCreate(CreateView):
    form_class = MonedaForm
    model = Moneda
    success_url = reverse_lazy('moneda_list')
    template_name = 'cruds/moneda/moneda_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MonedaCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        try:
            moneda = Moneda.objects.get(moneda__icontains=self.object.moneda)
            if moneda:
                return HttpResponseRedirect(self.success_url)
        except ObjectDoesNotExist:
            self.object.moneda_id = genkeys.GenerateIdMoneda()
            self.object.save()
            return super(MonedaCreate, self).form_valid(form)

# EDIT
class MonedaEdit(UpdateView):
    form_class = MonedaForm
    model = Moneda
    slug_field = 'moneda_id'
    slug_url_kwarg = 'moneda_id'
    success_url = reverse_lazy('moneda_list')
    template_name = 'cruds/moneda/moneda_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MonedaEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class MonedaDelete(DeleteView):
    model = Moneda
    slug_field = 'moneda_id'
    slug_url_kwarg = 'moneda_id'
    success_url = reverse_lazy('moneda_list')
    template_name = 'cruds/moneda/moneda_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MonedaDelete, self).dispatch(request, *args, **kwargs)


# CRUD CARGO EMPLEADO
# LIST
class CargoEmpleList(ListView):
    template_name = 'cruds/cargoemple/cargoemple.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listcargoemple'] = Cargo.objects.filter(flag=True).order_by('area','cargo_id')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class CargoEmpleCreate(CreateView):
    form_class = CargoEmpleForm
    model = Cargo
    success_url = reverse_lazy('cargoemple_list')
    template_name = 'cruds/cargoemple/cargoemple_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CargoEmpleCreate, self).dispatch(request, *args, **kwargs)

# EDIT
class CargoEmpleEdit(UpdateView):
    form_class = CargoEmpleForm
    model = Cargo
    slug_field = 'cargo_id'
    slug_url_kwarg = 'cargo_id'
    success_url = reverse_lazy('cargoemple_list')
    template_name = 'cruds/cargoemple/cargoemple_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CargoEmpleEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class CargoEmpleDelete(DeleteView):
    model = Cargo
    slug_field = 'cargo_id'
    slug_url_kwarg = 'cargo_id'
    success_url = reverse_lazy('cargoemple_list')
    template_name = 'cruds/cargoemple/cargoemple_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CargoEmpleDelete, self).dispatch(request, *args, **kwargs)



# CRUD AREA CARGO
# LIST
class AreaList(ListView):
    template_name = 'cruds/areacargo/area.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listarea'] = AreaCargo.objects.filter(flag=True).order_by('area')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class AreaCreate(CreateView):
    form_class = AreaForm
    model = AreaCargo
    success_url = reverse_lazy('area_list')
    template_name = 'cruds/areacargo/area_form.html'


    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AreaCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        try:
            area = AreaCargo.objects.get(area__icontains=self.object.area)
            if area:
                return HttpResponseRedirect(self.success_url)
        except ObjectDoesNotExist:
            self.object.area_id = genkeys.GenerateIdArea()
            self.object.save()
            return super(AreaCreate, self).form_valid(form)

# EDIT
class AreaEdit(UpdateView):
    form_class = AreaForm
    model = AreaCargo
    slug_field = 'area_id'
    slug_url_kwarg = 'area_id'
    success_url = reverse_lazy('area_list')
    template_name = 'cruds/areacargo/area_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AreaEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class AreaDelete(DeleteView):
    model = AreaCargo
    slug_field = 'area_id'
    slug_url_kwarg = 'area_id'
    success_url = reverse_lazy('area_list')
    template_name = 'cruds/areacargo/area_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AreaDelete, self).dispatch(request, *args, **kwargs)



# CRUD MNIPLE
# LIST
class MNipleList(ListView):
    template_name = 'cruds/mniple/mniple.html'
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.GET.get('menu'):
            context['menu'] = request.GET.get('menu')
        context['listmniple'] = MNiple.objects.filter(flag=True).order_by('ktype')
        return render_to_response(
            self.template_name,
            context,
            context_instance=RequestContext(request))

# CREATE
class MNipleCreate(CreateView):
    form_class = MNipleForm
    model = MNiple
    success_url = reverse_lazy('mniple_list')
    template_name = 'cruds/mniple/mniple_form.html'


    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MNipleCreate, self).dispatch(request, *args, **kwargs)

# EDIT
class MNipleEdit(UpdateView):
    form_class = MNipleForm
    model = MNiple
    slug_field = 'ktype'
    slug_url_kwarg = 'ktype'
    success_url = reverse_lazy('mniple_list')
    template_name = 'cruds/mniple/mniple_form.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MNipleEdit, self).dispatch(request, *args, **kwargs)

# DELETE
class MNipleDelete(DeleteView):
    model = MNiple
    slug_field = 'ktype'
    slug_url_kwarg = 'ktype'
    success_url = reverse_lazy('mniple_list')
    template_name = 'cruds/mniple/mniple_del.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MNipleDelete, self).dispatch(request, *args, **kwargs)