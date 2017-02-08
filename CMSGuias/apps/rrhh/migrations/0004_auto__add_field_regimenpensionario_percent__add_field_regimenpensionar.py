# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'RegimenPensionario.percent'
        db.add_column(u'rrhh_regimenpensionario', 'percent',
                      self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=5, decimal_places=2),
                      keep_default=False)

        # Adding field 'RegimenPensionarioAuditLogEntry.percent'
        db.add_column(u'rrhh_regimenpensionarioauditlogentry', 'percent',
                      self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=5, decimal_places=2),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'RegimenPensionario.percent'
        db.delete_column(u'rrhh_regimenpensionario', 'percent')

        # Deleting field 'RegimenPensionarioAuditLogEntry.percent'
        db.delete_column(u'rrhh_regimenpensionarioauditlogentry', 'percent')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
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
            'rubropro': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Rubro']", 'null': 'True'}),
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
        u'rrhh.assistance': {
            'Meta': {'ordering': "['-register']", 'object_name': 'Assistance'},
            'assistance': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AssistanceEmployee'", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.CharField', [], {'default': "'A'", 'max_length': '1'}),
            'hourin': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourinbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourout': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'houroutbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AssistanceProject'", 'null': 'True', 'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.related.ForeignKey', [], {'default': "'AS01'", 'related_name': "'breakforemployee'", 'null': 'True', 'to': u"orm['rrhh.EmployeeBreak']"}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'types': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AssistanceTypeEmpployee'", 'to': u"orm['rrhh.TypesEmployee']"}),
            'userregister': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'EmployeeRegister'", 'to': u"orm['home.Employee']"}),
            'viatical': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '4', 'decimal_places': '2'})
        },
        u'rrhh.assistanceauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'AssistanceAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_assistance_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'assistance': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AssistanceEmployee'", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.CharField', [], {'default': "'A'", 'max_length': '1'}),
            'hourin': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourinbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourout': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'houroutbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AssistanceProject'", 'null': 'True', 'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.related.ForeignKey', [], {'default': "'AS01'", 'related_name': "u'_auditlog_breakforemployee'", 'null': 'True', 'to': u"orm['rrhh.EmployeeBreak']"}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'types': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AssistanceTypeEmpployee'", 'to': u"orm['rrhh.TypesEmployee']"}),
            'userregister': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_EmployeeRegister'", 'to': u"orm['home.Employee']"}),
            'viatical': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '4', 'decimal_places': '2'})
        },
        u'rrhh.balanceassistance': {
            'Meta': {'object_name': 'BalanceAssistance'},
            'assistance': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'EmployeeasRegister'", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'hdelay': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2'}),
            'hextfirst': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2'}),
            'hextsecond': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2'}),
            'hlack': ('django.db.models.fields.DecimalField', [], {'default': '0', 'null': 'True', 'max_digits': '4', 'decimal_places': '2'}),
            'hwork': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
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
        u'rrhh.casoemergenciaauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'CasoEmergenciaAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_casoemergencia_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.coberturasaludauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'CoberturaSaludAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_coberturasalud_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'cobertura': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'coberturasalud_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'}),
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
        u'rrhh.cuentaempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'CuentaEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_cuentaemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'costxhora': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            'cts': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            'cuenta': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gratificacion': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '3', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.datomedicoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'DatoMedicoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_datomedico_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.detcobsaludempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'detCobSaludEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detcobsaludemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'cobertura': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.CoberturaSalud']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.detestudioempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'detEstudioEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detestudioemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'anoEgreso': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True', 'blank': 'True'}),
            'carrera': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estpais': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'ffin': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'finicio': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.detpensempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'detPensEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detpensemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'cuspp': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.detsaludempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'detSaludEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detsaludemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'entidad': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'fechfin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.detsuspensionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'detSuspensionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detsuspension_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'fechfin': ('django.db.models.fields.DateField', [], {}),
            'fechinicio': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.documentoempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'DocumentoEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_documentoemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'condicion': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'documento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.TipoDocumento']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.emplecampoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'EmpleCampoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_emplecampo_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'carnetmag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'emplecampo_id': ('django.db.models.fields.CharField', [], {'max_length': '20', 'db_index': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'fotocheck': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'rrhh.employeebreak': {
            'Meta': {'ordering': "['-register']", 'object_name': 'EmployeeBreak'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'payment': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'})
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
        u'rrhh.eppsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'EppsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_epps_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'estadoepp': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'fechentrega': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'fechrecepcion': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.examenempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'ExamenEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_examenemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'aptitud': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.experiencialabauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'ExperienciaLabAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_experiencialab_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'cargo': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'duracion': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'empresa': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'ffin': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'finicio': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.familiaempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'FamiliaEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_familiaemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'edad': ('django.db.models.fields.CharField', [], {'max_length': '2', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fnac': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.familiaicrauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'FamiliaIcrAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_familiaicr_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'areatrabajo': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.induccionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'InduccionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_induccion_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'emplecampo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['rrhh.EmpleCampo']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'fechcaduca': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fechinicio': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.phoneempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'PhoneEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_phoneemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'})
        },
        u'rrhh.regimenpensionario': {
            'Meta': {'object_name': 'RegimenPensionario'},
            'coberturapension': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'percent': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '5', 'decimal_places': '2'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '95'}),
            'regimenpens_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.regimenpensionarioauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'RegimenPensionarioAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_regimenpensionario_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'coberturapension': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'percent': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '5', 'decimal_places': '2'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '95'}),
            'regimenpens_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.regimensalud': {
            'Meta': {'object_name': 'RegimenSalud'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'regimensalud_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.regimensaludauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'RegimenSaludAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_regimensalud_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'regimen': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'regimensalud_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
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
        u'rrhh.renunciaempleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'RenunciaEmpleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_renunciaemple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
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
        u'rrhh.suspensionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'SuspensionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_suspension_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'motivo': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'suspension_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.tipocontrato': {
            'Meta': {'object_name': 'TipoContrato'},
            'contrato': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipocontrato_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipocontratoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TipoContratoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tipocontrato_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'contrato': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipocontrato_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.tipodocumento': {
            'Meta': {'object_name': 'TipoDocumento'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipodoc_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipodocumentoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TipoDocumentoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tipodocumento_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipodoc_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.tipoexamen': {
            'Meta': {'object_name': 'TipoExamen'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipoexamen_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipoexamenauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TipoExamenAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tipoexamen_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipoexamen_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.tipoinstitucion': {
            'Meta': {'object_name': 'TipoInstitucion'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'tipoinst_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipoinstitucionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TipoInstitucionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tipoinstitucion_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'tipoinst_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.tipopago': {
            'Meta': {'object_name': 'TipoPago'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pago': ('django.db.models.fields.CharField', [], {'max_length': '90'}),
            'tipopago_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'rrhh.tipopagoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TipoPagoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tipopago_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pago': ('django.db.models.fields.CharField', [], {'max_length': '90'}),
            'tipopago_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'db_index': 'True'})
        },
        u'rrhh.typesemployee': {
            'Meta': {'ordering': "['-register']", 'object_name': 'TypesEmployee'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'outsaturday': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'", 'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'starthour': ('django.db.models.fields.TimeField', [], {'default': "'08:00'"}),
            'types_id': ('django.db.models.fields.CharField', [], {'default': "'TY00'", 'max_length': '4', 'primary_key': 'True'})
        },
        u'rrhh.typesemployeeauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'TypesEmployeeAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_typesemployee_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'outsaturday': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'", 'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'starthour': ('django.db.models.fields.TimeField', [], {'default': "'08:00'"}),
            'types_id': ('django.db.models.fields.CharField', [], {'default': "'TY00'", 'max_length': '4', 'db_index': 'True'})
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
            'handworkpurchase': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '12', 'decimal_places': '2'}),
            'handworksales': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '12', 'decimal_places': '2'}),
            'nompro': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'outsaturday': ('django.db.models.fields.TimeField', [], {'default': "u'13:30:00'", 'blank': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'proyecto_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'ruccliente': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']", 'null': 'True'}),
            'servicessales': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '12', 'decimal_places': '2'}),
            'shxsaturday': ('django.db.models.fields.TimeField', [], {'default': "u'15:00:00'", 'blank': 'True'}),
            'shxsaturdayt': ('django.db.models.fields.TimeField', [], {'default': "u'17:000:00'", 'blank': 'True'}),
            'starthour': ('django.db.models.fields.TimeField', [], {'default': "u'07:30:00'", 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "u'00'", 'max_length': '2'}),
            'typep': ('django.db.models.fields.CharField', [], {'default': "u'ACI'", 'max_length': '3'})
        }
    }

    complete_apps = ['rrhh']