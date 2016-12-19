# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Asisstance'
        db.delete_table(u'rrhh_asisstance')

        # Deleting model 'AsisstanceAuditLogEntry'
        db.delete_table(u'rrhh_asisstanceauditlogentry')

        # Adding model 'AssistanceAuditLogEntry'
        db.create_table(u'rrhh_assistanceauditlogentry', (
            (u'id', self.gf('django.db.models.fields.IntegerField')(db_index=True, blank=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceEmployee', to=orm['home.Employee'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceProject', null=True, to=orm['ventas.Proyecto'])),
            ('stsemp', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceStatusEmp', to=orm['rrhh.StatusEmployee'])),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('asisstance', self.gf('django.db.models.fields.DateField')()),
            ('hourin', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('houroutbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hourinbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hourout', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hextfirst', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            ('hextsecond', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_assistance_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'rrhh', ['AssistanceAuditLogEntry'])

        # Adding model 'Assistance'
        db.create_table(u'rrhh_assistance', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceEmployee', to=orm['home.Employee'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceProject', null=True, to=orm['ventas.Proyecto'])),
            ('stsemp', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceStatusEmp', to=orm['rrhh.StatusEmployee'])),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('asisstance', self.gf('django.db.models.fields.DateField')()),
            ('hourin', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('houroutbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hourinbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hourout', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hextfirst', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            ('hextsecond', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'rrhh', ['Assistance'])


    def backwards(self, orm):
        # Adding model 'Asisstance'
        db.create_table(u'rrhh_asisstance', (
            ('hourin', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hextfirst', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('hextsecond', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('hourinbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('asisstance', self.gf('django.db.models.fields.DateField')()),
            ('stsemp', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceStatusEmp', to=orm['rrhh.StatusEmployee'])),
            ('houroutbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceProject', null=True, to=orm['ventas.Proyecto'])),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(related_name='AsisstanceEmployee', to=orm['home.Employee'])),
            ('hourout', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
        ))
        db.send_create_signal(u'rrhh', ['Asisstance'])

        # Adding model 'AsisstanceAuditLogEntry'
        db.create_table(u'rrhh_asisstanceauditlogentry', (
            ('asisstance', self.gf('django.db.models.fields.DateField')()),
            ('hourinbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hourin', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('houroutbreak', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('hextfirst', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_asisstance_audit_log_entry', to=orm['auth.User'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceProject', null=True, to=orm['ventas.Proyecto'])),
            ('stsemp', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceStatusEmp', to=orm['rrhh.StatusEmployee'])),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('employee', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'_auditlog_AsisstanceEmployee', to=orm['home.Employee'])),
            ('hourout', self.gf('django.db.models.fields.TimeField')(default='00:00:00')),
            ('hextsecond', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=1)),
            (u'id', self.gf('django.db.models.fields.IntegerField')(blank=True, db_index=True)),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'rrhh', ['AsisstanceAuditLogEntry'])

        # Deleting model 'AssistanceAuditLogEntry'
        db.delete_table(u'rrhh_assistanceauditlogentry')

        # Deleting model 'Assistance'
        db.delete_table(u'rrhh_assistance')


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
            'address': ('django.db.models.fields.CharField', [], {'max_length': '180'}),
            'birth': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'charge': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cargo']"}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '80', 'null': 'True', 'blank': 'True'}),
            'empdni_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'firstname': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'fixed': ('django.db.models.fields.CharField', [], {'max_length': '26', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'lastname': ('django.db.models.fields.CharField', [], {'max_length': '150'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '32', 'null': 'True', 'blank': 'True'}),
            'phonejob': ('django.db.models.fields.CharField', [], {'max_length': '32', 'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
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
        u'home.provincia': {
            'Meta': {'ordering': "['pronom']", 'object_name': 'Provincia'},
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'pronom': ('django.db.models.fields.CharField', [], {'max_length': '56'}),
            'provincia_id': ('django.db.models.fields.CharField', [], {'max_length': '3', 'primary_key': 'True'})
        },
        u'home.unidade': {
            'Meta': {'object_name': 'Unidade'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unidad_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'uninom': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'rrhh.assistance': {
            'Meta': {'ordering': "['-register']", 'object_name': 'Assistance'},
            'asisstance': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AsisstanceEmployee'", 'to': u"orm['home.Employee']"}),
            'hextfirst': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '3', 'decimal_places': '1'}),
            'hextsecond': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '3', 'decimal_places': '1'}),
            'hourin': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourinbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourout': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'houroutbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AsisstanceProject'", 'null': 'True', 'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'stsemp': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'AsisstanceStatusEmp'", 'to': u"orm['rrhh.StatusEmployee']"}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'rrhh.assistanceauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'AssistanceAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_assistance_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'asisstance': ('django.db.models.fields.DateField', [], {}),
            'employee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AsisstanceEmployee'", 'to': u"orm['home.Employee']"}),
            'hextfirst': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '3', 'decimal_places': '1'}),
            'hextsecond': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '3', 'decimal_places': '1'}),
            'hourin': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourinbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'hourout': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            'houroutbreak': ('django.db.models.fields.TimeField', [], {'default': "'00:00:00'"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AsisstanceProject'", 'null': 'True', 'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'stsemp': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_AsisstanceStatusEmp'", 'to': u"orm['rrhh.StatusEmployee']"}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'rrhh.statusemployee': {
            'Meta': {'ordering': "['-register']", 'object_name': 'StatusEmployee'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status_id': ('django.db.models.fields.CharField', [], {'default': "'SE00'", 'max_length': '4', 'primary_key': 'True'})
        },
        u'rrhh.statusemployeeauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'StatusEmployeeAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_statusemployee_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status_id': ('django.db.models.fields.CharField', [], {'default': "'SE00'", 'max_length': '4', 'db_index': 'True'})
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