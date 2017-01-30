# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'PhoneEmple'
        db.create_table(u'rrhh_phoneemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('phone', self.gf('django.db.models.fields.CharField')(max_length=12, null=True, blank=True)),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['PhoneEmple'])

        # Adding model 'TipoContrato'
        db.create_table(u'rrhh_tipocontrato', (
            ('tipocontrato_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('contrato', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['TipoContrato'])

        # Adding model 'TipoPago'
        db.create_table(u'rrhh_tipopago', (
            ('tipopago_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('pago', self.gf('django.db.models.fields.CharField')(max_length=90)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['TipoPago'])

        # Adding model 'CuentaEmple'
        db.create_table(u'rrhh_cuentaemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('cuenta', self.gf('django.db.models.fields.CharField')(max_length=25)),
            ('tipodepago', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.TipoPago'])),
            ('estado', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('remuneracion', self.gf('django.db.models.fields.FloatField')(default=0)),
            ('tipocontrato', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.TipoContrato'])),
            ('cts', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=8, decimal_places=3, blank=True)),
            ('gratificacion', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=8, decimal_places=3, blank=True)),
            ('costxhora', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=8, decimal_places=3, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['CuentaEmple'])

        # Adding model 'TipoExamen'
        db.create_table(u'rrhh_tipoexamen', (
            ('tipoexamen_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['TipoExamen'])

        # Adding model 'ExamenEmple'
        db.create_table(u'rrhh_examenemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('tipoexamen', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.TipoExamen'])),
            ('lugar', self.gf('django.db.models.fields.related.ForeignKey')(default=False, to=orm['home.Proveedor'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fechcaduca', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('aptitud', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=250, null=True, blank=True)),
            ('archivo', self.gf('django.db.models.fields.files.FileField')(max_length=400, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['ExamenEmple'])

        # Adding model 'TipoDocumento'
        db.create_table(u'rrhh_tipodocumento', (
            ('tipodoc_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['TipoDocumento'])

        # Adding model 'DocumentoEmple'
        db.create_table(u'rrhh_documentoemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('documento', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.TipoDocumento'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fechcaduca', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('condicion', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('archivo', self.gf('django.db.models.fields.files.FileField')(max_length=500, null=True, blank=True)),
            ('observaciones', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['DocumentoEmple'])

        # Adding model 'EmpleCampo'
        db.create_table(u'rrhh_emplecampo', (
            ('emplecampo_id', self.gf('django.db.models.fields.CharField')(max_length=20, primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('proyecto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['ventas.Proyecto'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True)),
            ('carnetmag', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('fotocheck', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['EmpleCampo'])

        # Adding model 'Suspension'
        db.create_table(u'rrhh_suspension', (
            ('suspension_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('motivo', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['Suspension'])

        # Adding model 'detSuspension'
        db.create_table(u'rrhh_detsuspension', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('suspension', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.Suspension'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')()),
            ('fechfin', self.gf('django.db.models.fields.DateField')()),
            ('registro', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('archivo', self.gf('django.db.models.fields.files.FileField')(max_length=500, null=True, blank=True)),
            ('estado', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=250, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['detSuspension'])

        # Adding model 'Epps'
        db.create_table(u'rrhh_epps', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('item', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('fechentrega', self.gf('django.db.models.fields.DateField')(null=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('estadoepp', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('fechrecepcion', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['Epps'])

        # Adding model 'Induccion'
        db.create_table(u'rrhh_induccion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('emplecampo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.EmpleCampo'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fechcaduca', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('estado', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['Induccion'])

        # Adding model 'CoberturaSalud'
        db.create_table(u'rrhh_coberturasalud', (
            ('coberturasalud_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('cobertura', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['CoberturaSalud'])

        # Adding model 'detCobSaludEmple'
        db.create_table(u'rrhh_detcobsaludemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cobertura', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.CoberturaSalud'])),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True)),
            ('fechfin', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['detCobSaludEmple'])

        # Adding model 'RegimenSalud'
        db.create_table(u'rrhh_regimensalud', (
            ('regimensalud_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('regimen', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['RegimenSalud'])

        # Adding model 'detSaludEmple'
        db.create_table(u'rrhh_detsaludemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('regimen', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.RegimenSalud'])),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fechfin', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('entidad', self.gf('django.db.models.fields.CharField')(max_length=150, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['detSaludEmple'])

        # Adding model 'RegimenPensionario'
        db.create_table(u'rrhh_regimenpensionario', (
            ('regimenpens_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('regimen', self.gf('django.db.models.fields.CharField')(max_length=95)),
            ('coberturapension', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['RegimenPensionario'])

        # Adding model 'detPensEmple'
        db.create_table(u'rrhh_detpensemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('regimenpens', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.RegimenPensionario'])),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('fechinicio', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fechfin', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('cuspp', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('sctr', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['detPensEmple'])

        # Adding model 'TipoInstitucion'
        db.create_table(u'rrhh_tipoinstitucion', (
            ('tipoinst_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('tipo', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['TipoInstitucion'])

        # Adding model 'detEstudioEmple'
        db.create_table(u'rrhh_detestudioemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('tipoinstitucion', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rrhh.TipoInstitucion'])),
            ('carrera', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('anoEgreso', self.gf('django.db.models.fields.CharField')(max_length=6, null=True, blank=True)),
            ('situacioneduc', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('estpais', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('institucion', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('regimen', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('finicio', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('ffin', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['detEstudioEmple'])

        # Adding model 'FamiliaEmple'
        db.create_table(u'rrhh_familiaemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('nombres', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('parentesco', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('edad', self.gf('django.db.models.fields.CharField')(max_length=2, null=True, blank=True)),
            ('fnac', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['FamiliaEmple'])

        # Adding model 'ExperienciaLab'
        db.create_table(u'rrhh_experiencialab', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('empresa', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('cargo', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('finicio', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('ffin', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('duracion', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('motivoretiro', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['ExperienciaLab'])

        # Adding model 'DatoMedico'
        db.create_table(u'rrhh_datomedico', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('tipo', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('tiempo', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('comentario', self.gf('django.db.models.fields.CharField')(max_length=250, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['DatoMedico'])

        # Adding model 'CasoEmergencia'
        db.create_table(u'rrhh_casoemergencia', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('nombres', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('direccion', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('telefono', self.gf('django.db.models.fields.CharField')(max_length=12, null=True, blank=True)),
            ('parentesco', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['CasoEmergencia'])

        # Adding model 'FamiliaIcr'
        db.create_table(u'rrhh_familiaicr', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('nombres', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('parentesco', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('areatrabajo', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['FamiliaIcr'])

        # Adding model 'RenunciaEmple'
        db.create_table(u'rrhh_renunciaemple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Employee'])),
            ('motivo', self.gf('django.db.models.fields.CharField')(max_length=250, null=True, blank=True)),
            ('ultimodiatrab', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('archivo', self.gf('django.db.models.fields.files.FileField')(max_length=500, null=True, blank=True)),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'rrhh', ['RenunciaEmple'])


    def backwards(self, orm):
        # Deleting model 'PhoneEmple'
        db.delete_table(u'rrhh_phoneemple')

        # Deleting model 'TipoContrato'
        db.delete_table(u'rrhh_tipocontrato')

        # Deleting model 'TipoPago'
        db.delete_table(u'rrhh_tipopago')

        # Deleting model 'CuentaEmple'
        db.delete_table(u'rrhh_cuentaemple')

        # Deleting model 'TipoExamen'
        db.delete_table(u'rrhh_tipoexamen')

        # Deleting model 'ExamenEmple'
        db.delete_table(u'rrhh_examenemple')

        # Deleting model 'TipoDocumento'
        db.delete_table(u'rrhh_tipodocumento')

        # Deleting model 'DocumentoEmple'
        db.delete_table(u'rrhh_documentoemple')

        # Deleting model 'EmpleCampo'
        db.delete_table(u'rrhh_emplecampo')

        # Deleting model 'Suspension'
        db.delete_table(u'rrhh_suspension')

        # Deleting model 'detSuspension'
        db.delete_table(u'rrhh_detsuspension')

        # Deleting model 'Epps'
        db.delete_table(u'rrhh_epps')

        # Deleting model 'Induccion'
        db.delete_table(u'rrhh_induccion')

        # Deleting model 'CoberturaSalud'
        db.delete_table(u'rrhh_coberturasalud')

        # Deleting model 'detCobSaludEmple'
        db.delete_table(u'rrhh_detcobsaludemple')

        # Deleting model 'RegimenSalud'
        db.delete_table(u'rrhh_regimensalud')

        # Deleting model 'detSaludEmple'
        db.delete_table(u'rrhh_detsaludemple')

        # Deleting model 'RegimenPensionario'
        db.delete_table(u'rrhh_regimenpensionario')

        # Deleting model 'detPensEmple'
        db.delete_table(u'rrhh_detpensemple')

        # Deleting model 'TipoInstitucion'
        db.delete_table(u'rrhh_tipoinstitucion')

        # Deleting model 'detEstudioEmple'
        db.delete_table(u'rrhh_detestudioemple')

        # Deleting model 'FamiliaEmple'
        db.delete_table(u'rrhh_familiaemple')

        # Deleting model 'ExperienciaLab'
        db.delete_table(u'rrhh_experiencialab')

        # Deleting model 'DatoMedico'
        db.delete_table(u'rrhh_datomedico')

        # Deleting model 'CasoEmergencia'
        db.delete_table(u'rrhh_casoemergencia')

        # Deleting model 'FamiliaIcr'
        db.delete_table(u'rrhh_familiaicr')

        # Deleting model 'RenunciaEmple'
        db.delete_table(u'rrhh_renunciaemple')


    models = {
        u'home.cargo': {
            'Meta': {'ordering': "['cargos']", 'object_name': 'Cargo'},
            'area': ('django.db.models.fields.CharField', [], {'default': "'Nothing'", 'max_length': '60'}),
            'cargo_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'}),
            'cargos': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'default': "'HH'", 'to': u"orm['home.Unidade']", 'null': 'True'})
        },
        u'home.cliente': {
            'Meta': {'ordering': "['razonsocial']", 'object_name': 'Cliente'},
            'contact': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'blank': 'True'}),
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'distrito': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'razonsocial': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'ruccliente_id': ('django.db.models.fields.CharField', [], {'max_length': '11', 'primary_key': 'True'}),
            'telefono': ('django.db.models.fields.CharField', [], {'default': "'000-000-000'", 'max_length': '30', 'null': 'True', 'blank': 'True'})
        },
        u'home.departamento': {
            'Meta': {'ordering': "['depnom']", 'object_name': 'Departamento'},
            'departamento_id': ('django.db.models.fields.CharField', [], {'max_length': '2', 'primary_key': 'True'}),
            'depnom': ('django.db.models.fields.CharField', [], {'max_length': '56'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"})
        },
        u'home.distrito': {
            'Meta': {'ordering': "['distnom']", 'object_name': 'Distrito'},
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'distnom': ('django.db.models.fields.CharField', [], {'max_length': '56'}),
            'distrito_id': ('django.db.models.fields.CharField', [], {'max_length': '2', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"})
        },
        u'home.employee': {
            'Meta': {'ordering': "['lastname']", 'object_name': 'Employee'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '180', 'null': 'True', 'blank': 'True'}),
            'address2': ('django.db.models.fields.CharField', [], {'max_length': '180', 'null': 'True', 'blank': 'True'}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'birth': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'cargopostula': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'charge': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cargo']", 'null': 'True'}),
            'discapacidad': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'distrito': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '80', 'null': 'True', 'blank': 'True'}),
            'empdni_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'estadocivil': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'estadoplanilla': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'feching': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'firstname': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'foto': ('django.db.models.fields.files.FileField', [], {'max_length': '300', 'null': 'True', 'blank': 'True'}),
            'lastname': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'nacdist': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'nacdpt': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'nacionalidad': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'nacprov': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sexo': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'situacion': ('django.db.models.fields.CharField', [], {'default': "'Activo'", 'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'tallapolo': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True', 'blank': 'True'}),
            'tallazap': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True', 'blank': 'True'}),
            'tipoemple': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.TipoEmpleado']", 'null': 'True', 'blank': 'True'})
        },
        u'home.moneda': {
            'Meta': {'object_name': 'Moneda'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'moneda': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'moneda_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'simbolo': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '5'})
        },
        u'home.pais': {
            'Meta': {'ordering': "['paisnom']", 'object_name': 'Pais'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais_id': ('django.db.models.fields.CharField', [], {'max_length': '3', 'primary_key': 'True'}),
            'paisnom': ('django.db.models.fields.CharField', [], {'max_length': '56'})
        },
        u'home.proveedor': {
            'Meta': {'ordering': "['razonsocial']", 'object_name': 'Proveedor'},
            'contact': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'distrito': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'email': ('django.db.models.fields.CharField', [], {'default': "'ejemplo@dominio.com'", 'max_length': '60', 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'origen': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'proveedor_id': ('django.db.models.fields.CharField', [], {'max_length': '11', 'primary_key': 'True'}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'razonsocial': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'rubropro': ('django.db.models.fields.related.ForeignKey', [], {'default': "'RU002'", 'to': u"orm['home.Rubro']"}),
            'telefono': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '8'})
        },
        u'home.provincia': {
            'Meta': {'ordering': "['pronom']", 'object_name': 'Provincia'},
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'pronom': ('django.db.models.fields.CharField', [], {'max_length': '56'}),
            'provincia_id': ('django.db.models.fields.CharField', [], {'max_length': '3', 'primary_key': 'True'})
        },
        u'home.rubro': {
            'Meta': {'object_name': 'Rubro'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'rubro': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rubro_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'})
        },
        u'home.tipoempleado': {
            'Meta': {'object_name': 'TipoEmpleado'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipoemple_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'home.unidade': {
            'Meta': {'object_name': 'Unidade'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unidad_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'uninom': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'rrhh.casoemergencia': {
            'Meta': {'object_name': 'CasoEmergencia'},
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombres': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'parentesco': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'telefono': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.coberturasalud': {
            'Meta': {'object_name': 'CoberturaSalud'},
            'cobertura': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'coberturasalud_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'rrhh.cuentaemple': {
            'Meta': {'object_name': 'CuentaEmple'},
            'costxhora': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            'cts': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            'cuenta': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gratificacion': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'remuneracion': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'tipocontrato': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoContrato']"}),
            'tipodepago': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoPago']"})
        },
        u'rrhh.datomedico': {
            'Meta': {'object_name': 'DatoMedico'},
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'tiempo': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'rrhh.detcobsaludemple': {
            'Meta': {'object_name': 'detCobSaludEmple'},
            'cobertura': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.CoberturaSalud']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.detestudioemple': {
            'Meta': {'object_name': 'detEstudioEmple'},
            'anoEgreso': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True', 'blank': 'True'}),
            'carrera': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estpais': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'ffin': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'finicio': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institucion': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'situacioneduc': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'tipoinstitucion': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoInstitucion']"})
        },
        u'rrhh.detpensemple': {
            'Meta': {'object_name': 'detPensEmple'},
            'cuspp': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'regimenpens': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.RegimenPensionario']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sctr': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'rrhh.detsaludemple': {
            'Meta': {'object_name': 'detSaludEmple'},
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'entidad': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'regimen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.RegimenSalud']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.detsuspension': {
            'Meta': {'object_name': 'detSuspension'},
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'fechfin': ('django.db.models.fields.DateField', [], {}),
            'fechinicio': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'suspension': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.Suspension']"})
        },
        u'rrhh.documentoemple': {
            'Meta': {'object_name': 'DocumentoEmple'},
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'condicion': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'documento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoDocumento']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'observaciones': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.emplecampo': {
            'Meta': {'object_name': 'EmpleCampo'},
            'carnetmag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'emplecampo_id': ('django.db.models.fields.CharField', [], {'max_length': '20', 'primary_key': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'fotocheck': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.epps': {
            'Meta': {'object_name': 'Epps'},
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estadoepp': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'fechentrega': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'fechrecepcion': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'item': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.examenemple': {
            'Meta': {'object_name': 'ExamenEmple'},
            'aptitud': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lugar': ('django.db.models.fields.related.ForeignKey', [], {'default': 'False', 'to': u"orm['home.Proveedor']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'tipoexamen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoExamen']"})
        },
        u'rrhh.experiencialab': {
            'Meta': {'object_name': 'ExperienciaLab'},
            'cargo': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'duracion': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'empresa': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'ffin': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'finicio': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'motivoretiro': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.familiaemple': {
            'Meta': {'object_name': 'FamiliaEmple'},
            'edad': ('django.db.models.fields.CharField', [], {'max_length': '2', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fnac': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombres': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'parentesco': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.familiaicr': {
            'Meta': {'object_name': 'FamiliaIcr'},
            'areatrabajo': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombres': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'parentesco': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.induccion': {
            'Meta': {'object_name': 'Induccion'},
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'emplecampo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.EmpleCampo']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.phoneemple': {
            'Meta': {'object_name': 'PhoneEmple'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.regimenpensionario': {
            'Meta': {'object_name': 'RegimenPensionario'},
            'coberturapension': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '95'}),
            'regimenpens_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.regimensalud': {
            'Meta': {'object_name': 'RegimenSalud'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'regimensalud_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.renunciaemple': {
            'Meta': {'object_name': 'RenunciaEmple'},
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'motivo': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'ultimodiatrab': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'})
        },
        u'rrhh.suspension': {
            'Meta': {'object_name': 'Suspension'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'motivo': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'suspension_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipocontrato': {
            'Meta': {'object_name': 'TipoContrato'},
            'contrato': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipocontrato_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipodocumento': {
            'Meta': {'object_name': 'TipoDocumento'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipodoc_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipoexamen': {
            'Meta': {'object_name': 'TipoExamen'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipoexamen_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipoinstitucion': {
            'Meta': {'object_name': 'TipoInstitucion'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'tipoinst_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipopago': {
            'Meta': {'object_name': 'TipoPago'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pago': ('django.db.models.fields.CharField', [], {'max_length': '90'}),
            'tipopago_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'ventas.proyecto': {
            'Meta': {'ordering': "[u'nompro']", 'object_name': 'Proyecto'},
            'approved': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "u'approvedAsEmployee'", 'null': 'True', 'to': u"orm['home.Employee']"}),
            'aservices': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '9', 'decimal_places': '3', 'blank': 'True'}),
            'comienzo': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'contact': ('django.db.models.fields.CharField', [], {'default': "u''", 'max_length': '254', 'null': 'True', 'blank': 'True'}),
            'currency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']", 'null': 'True', 'blank': 'True'}),
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'distrito': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '254', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "u'proyectoAsEmployee'", 'null': 'True', 'to': u"orm['home.Employee']"}),
            'exchange': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'nompro': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'proyecto_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'ruccliente': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']", 'null': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "u'00'", 'max_length': '2'}),
            'typep': ('django.db.models.fields.CharField', [], {'default': "u'ACI'", 'max_length': '3'})
        }
    }

    complete_apps = ['rrhh']