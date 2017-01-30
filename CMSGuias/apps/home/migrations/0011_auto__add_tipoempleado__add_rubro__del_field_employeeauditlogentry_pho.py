# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'TipoEmpleado'
        db.create_table(u'home_tipoempleado', (
            ('tipoemple_id', self.gf('django.db.models.fields.CharField')(max_length=9, primary_key=True)),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'home', ['TipoEmpleado'])

        # Adding model 'Rubro'
        db.create_table(u'home_rubro', (
            ('rubro_id', self.gf('django.db.models.fields.CharField')(max_length=8, primary_key=True)),
            ('rubro', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'home', ['Rubro'])

        # Deleting field 'EmployeeAuditLogEntry.phonejob'
        db.delete_column(u'home_employeeauditlogentry', 'phonejob')

        # Deleting field 'EmployeeAuditLogEntry.phone'
        db.delete_column(u'home_employeeauditlogentry', 'phone')

        # Deleting field 'EmployeeAuditLogEntry.fixed'
        db.delete_column(u'home_employeeauditlogentry', 'fixed')

        # Adding field 'EmployeeAuditLogEntry.tipoemple'
        db.add_column(u'home_employeeauditlogentry', 'tipoemple',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.TipoEmpleado'], null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.sexo'
        db.add_column(u'home_employeeauditlogentry', 'sexo',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.estadocivil'
        db.add_column(u'home_employeeauditlogentry', 'estadocivil',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.address2'
        db.add_column(u'home_employeeauditlogentry', 'address2',
                      self.gf('django.db.models.fields.CharField')(max_length=180, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.nacionalidad'
        db.add_column(u'home_employeeauditlogentry', 'nacionalidad',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.discapacidad'
        db.add_column(u'home_employeeauditlogentry', 'discapacidad',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.situacion'
        db.add_column(u'home_employeeauditlogentry', 'situacion',
                      self.gf('django.db.models.fields.CharField')(default='Activo', max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.feching'
        db.add_column(u'home_employeeauditlogentry', 'feching',
                      self.gf('django.db.models.fields.DateField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.estadoplanilla'
        db.add_column(u'home_employeeauditlogentry', 'estadoplanilla',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.archivo'
        db.add_column(u'home_employeeauditlogentry', 'archivo',
                      self.gf('django.db.models.fields.files.FileField')(max_length=500, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.foto'
        db.add_column(u'home_employeeauditlogentry', 'foto',
                      self.gf('django.db.models.fields.files.FileField')(max_length=300, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.nacdpt'
        db.add_column(u'home_employeeauditlogentry', 'nacdpt',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.nacprov'
        db.add_column(u'home_employeeauditlogentry', 'nacprov',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.nacdist'
        db.add_column(u'home_employeeauditlogentry', 'nacdist',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.tallazap'
        db.add_column(u'home_employeeauditlogentry', 'tallazap',
                      self.gf('django.db.models.fields.CharField')(max_length=6, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.tallapolo'
        db.add_column(u'home_employeeauditlogentry', 'tallapolo',
                      self.gf('django.db.models.fields.CharField')(max_length=6, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.cargopostula'
        db.add_column(u'home_employeeauditlogentry', 'cargopostula',
                      self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.distrito'
        db.add_column(u'home_employeeauditlogentry', 'distrito',
                      self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True),
                      keep_default=False)


        # Changing field 'EmployeeAuditLogEntry.birth'
        db.alter_column(u'home_employeeauditlogentry', 'birth', self.gf('django.db.models.fields.DateField')(null=True))

        # Changing field 'EmployeeAuditLogEntry.register'
        db.alter_column(u'home_employeeauditlogentry', 'register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True))

        # Changing field 'EmployeeAuditLogEntry.charge'
        db.alter_column(u'home_employeeauditlogentry', 'charge_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cargo'], null=True))

        # Changing field 'EmployeeAuditLogEntry.address'
        db.alter_column(u'home_employeeauditlogentry', 'address', self.gf('django.db.models.fields.CharField')(max_length=180, null=True))
        # Deleting field 'Employee.phone'
        db.delete_column(u'home_employee', 'phone')

        # Deleting field 'Employee.phonejob'
        db.delete_column(u'home_employee', 'phonejob')

        # Deleting field 'Employee.fixed'
        db.delete_column(u'home_employee', 'fixed')

        # Adding field 'Employee.tipoemple'
        db.add_column(u'home_employee', 'tipoemple',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.TipoEmpleado'], null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.sexo'
        db.add_column(u'home_employee', 'sexo',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Employee.estadocivil'
        db.add_column(u'home_employee', 'estadocivil',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Employee.address2'
        db.add_column(u'home_employee', 'address2',
                      self.gf('django.db.models.fields.CharField')(max_length=180, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.nacionalidad'
        db.add_column(u'home_employee', 'nacionalidad',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Employee.discapacidad'
        db.add_column(u'home_employee', 'discapacidad',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Employee.situacion'
        db.add_column(u'home_employee', 'situacion',
                      self.gf('django.db.models.fields.CharField')(default='Activo', max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.feching'
        db.add_column(u'home_employee', 'feching',
                      self.gf('django.db.models.fields.DateField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.estadoplanilla'
        db.add_column(u'home_employee', 'estadoplanilla',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Employee.archivo'
        db.add_column(u'home_employee', 'archivo',
                      self.gf('django.db.models.fields.files.FileField')(max_length=500, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.foto'
        db.add_column(u'home_employee', 'foto',
                      self.gf('django.db.models.fields.files.FileField')(max_length=300, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.nacdpt'
        db.add_column(u'home_employee', 'nacdpt',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.nacprov'
        db.add_column(u'home_employee', 'nacprov',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.nacdist'
        db.add_column(u'home_employee', 'nacdist',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.tallazap'
        db.add_column(u'home_employee', 'tallazap',
                      self.gf('django.db.models.fields.CharField')(max_length=6, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.tallapolo'
        db.add_column(u'home_employee', 'tallapolo',
                      self.gf('django.db.models.fields.CharField')(max_length=6, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.cargopostula'
        db.add_column(u'home_employee', 'cargopostula',
                      self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.distrito'
        db.add_column(u'home_employee', 'distrito',
                      self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True),
                      keep_default=False)


        # Changing field 'Employee.register'
        db.alter_column(u'home_employee', 'register', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True))

        # Changing field 'Employee.charge'
        db.alter_column(u'home_employee', 'charge_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cargo'], null=True))

        # Changing field 'Employee.birth'
        db.alter_column(u'home_employee', 'birth', self.gf('django.db.models.fields.DateField')(null=True))

        # Changing field 'Employee.address'
        db.alter_column(u'home_employee', 'address', self.gf('django.db.models.fields.CharField')(max_length=180, null=True))

    def backwards(self, orm):
        # Deleting model 'TipoEmpleado'
        db.delete_table(u'home_tipoempleado')

        # Deleting model 'Rubro'
        db.delete_table(u'home_rubro')

        # Adding field 'EmployeeAuditLogEntry.phonejob'
        db.add_column(u'home_employeeauditlogentry', 'phonejob',
                      self.gf('django.db.models.fields.CharField')(max_length=32, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.phone'
        db.add_column(u'home_employeeauditlogentry', 'phone',
                      self.gf('django.db.models.fields.CharField')(max_length=32, null=True, blank=True),
                      keep_default=False)

        # Adding field 'EmployeeAuditLogEntry.fixed'
        db.add_column(u'home_employeeauditlogentry', 'fixed',
                      self.gf('django.db.models.fields.CharField')(max_length=26, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'EmployeeAuditLogEntry.tipoemple'
        db.delete_column(u'home_employeeauditlogentry', 'tipoemple_id')

        # Deleting field 'EmployeeAuditLogEntry.sexo'
        db.delete_column(u'home_employeeauditlogentry', 'sexo')

        # Deleting field 'EmployeeAuditLogEntry.estadocivil'
        db.delete_column(u'home_employeeauditlogentry', 'estadocivil')

        # Deleting field 'EmployeeAuditLogEntry.address2'
        db.delete_column(u'home_employeeauditlogentry', 'address2')

        # Deleting field 'EmployeeAuditLogEntry.nacionalidad'
        db.delete_column(u'home_employeeauditlogentry', 'nacionalidad')

        # Deleting field 'EmployeeAuditLogEntry.discapacidad'
        db.delete_column(u'home_employeeauditlogentry', 'discapacidad')

        # Deleting field 'EmployeeAuditLogEntry.situacion'
        db.delete_column(u'home_employeeauditlogentry', 'situacion')

        # Deleting field 'EmployeeAuditLogEntry.feching'
        db.delete_column(u'home_employeeauditlogentry', 'feching')

        # Deleting field 'EmployeeAuditLogEntry.estadoplanilla'
        db.delete_column(u'home_employeeauditlogentry', 'estadoplanilla')

        # Deleting field 'EmployeeAuditLogEntry.archivo'
        db.delete_column(u'home_employeeauditlogentry', 'archivo')

        # Deleting field 'EmployeeAuditLogEntry.foto'
        db.delete_column(u'home_employeeauditlogentry', 'foto')

        # Deleting field 'EmployeeAuditLogEntry.nacdpt'
        db.delete_column(u'home_employeeauditlogentry', 'nacdpt')

        # Deleting field 'EmployeeAuditLogEntry.nacprov'
        db.delete_column(u'home_employeeauditlogentry', 'nacprov')

        # Deleting field 'EmployeeAuditLogEntry.nacdist'
        db.delete_column(u'home_employeeauditlogentry', 'nacdist')

        # Deleting field 'EmployeeAuditLogEntry.tallazap'
        db.delete_column(u'home_employeeauditlogentry', 'tallazap')

        # Deleting field 'EmployeeAuditLogEntry.tallapolo'
        db.delete_column(u'home_employeeauditlogentry', 'tallapolo')

        # Deleting field 'EmployeeAuditLogEntry.cargopostula'
        db.delete_column(u'home_employeeauditlogentry', 'cargopostula')

        # Deleting field 'EmployeeAuditLogEntry.distrito'
        db.delete_column(u'home_employeeauditlogentry', 'distrito')


        # Changing field 'EmployeeAuditLogEntry.birth'
        db.alter_column(u'home_employeeauditlogentry', 'birth', self.gf('django.db.models.fields.DateField')(auto_now_add=True, default=None))

        # Changing field 'EmployeeAuditLogEntry.register'
        db.alter_column(u'home_employeeauditlogentry', 'register', self.gf('django.db.models.fields.DateTimeField')(auto_now=True))

        # Changing field 'EmployeeAuditLogEntry.charge'
        db.alter_column(u'home_employeeauditlogentry', 'charge_id', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['home.Cargo']))

        # Changing field 'EmployeeAuditLogEntry.address'
        db.alter_column(u'home_employeeauditlogentry', 'address', self.gf('django.db.models.fields.CharField')(default=None, max_length=180))
        # Adding field 'Employee.phone'
        db.add_column(u'home_employee', 'phone',
                      self.gf('django.db.models.fields.CharField')(max_length=32, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.phonejob'
        db.add_column(u'home_employee', 'phonejob',
                      self.gf('django.db.models.fields.CharField')(max_length=32, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Employee.fixed'
        db.add_column(u'home_employee', 'fixed',
                      self.gf('django.db.models.fields.CharField')(max_length=26, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Employee.tipoemple'
        db.delete_column(u'home_employee', 'tipoemple_id')

        # Deleting field 'Employee.sexo'
        db.delete_column(u'home_employee', 'sexo')

        # Deleting field 'Employee.estadocivil'
        db.delete_column(u'home_employee', 'estadocivil')

        # Deleting field 'Employee.address2'
        db.delete_column(u'home_employee', 'address2')

        # Deleting field 'Employee.nacionalidad'
        db.delete_column(u'home_employee', 'nacionalidad')

        # Deleting field 'Employee.discapacidad'
        db.delete_column(u'home_employee', 'discapacidad')

        # Deleting field 'Employee.situacion'
        db.delete_column(u'home_employee', 'situacion')

        # Deleting field 'Employee.feching'
        db.delete_column(u'home_employee', 'feching')

        # Deleting field 'Employee.estadoplanilla'
        db.delete_column(u'home_employee', 'estadoplanilla')

        # Deleting field 'Employee.archivo'
        db.delete_column(u'home_employee', 'archivo')

        # Deleting field 'Employee.foto'
        db.delete_column(u'home_employee', 'foto')

        # Deleting field 'Employee.nacdpt'
        db.delete_column(u'home_employee', 'nacdpt')

        # Deleting field 'Employee.nacprov'
        db.delete_column(u'home_employee', 'nacprov')

        # Deleting field 'Employee.nacdist'
        db.delete_column(u'home_employee', 'nacdist')

        # Deleting field 'Employee.tallazap'
        db.delete_column(u'home_employee', 'tallazap')

        # Deleting field 'Employee.tallapolo'
        db.delete_column(u'home_employee', 'tallapolo')

        # Deleting field 'Employee.cargopostula'
        db.delete_column(u'home_employee', 'cargopostula')

        # Deleting field 'Employee.distrito'
        db.delete_column(u'home_employee', 'distrito')


        # Changing field 'Employee.register'
        db.alter_column(u'home_employee', 'register', self.gf('django.db.models.fields.DateTimeField')(auto_now=True))

        # Changing field 'Employee.charge'
        db.alter_column(u'home_employee', 'charge_id', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['home.Cargo']))

        # Changing field 'Employee.birth'
        db.alter_column(u'home_employee', 'birth', self.gf('django.db.models.fields.DateField')(auto_now_add=True, default=None))

        # Changing field 'Employee.address'
        db.alter_column(u'home_employee', 'address', self.gf('django.db.models.fields.CharField')(default=None, max_length=180))

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
        u'home.almacene': {
            'Meta': {'ordering': "['nombre']", 'object_name': 'Almacene'},
            'almacen_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'home.brand': {
            'Meta': {'object_name': 'Brand'},
            'brand': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'brand_id': ('django.db.models.fields.CharField', [], {'max_length': '5', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'home.brandmaterial': {
            'Meta': {'object_name': 'BrandMaterial'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"})
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
        u'home.clienteauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'ClienteAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_cliente_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'contact': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'blank': 'True'}),
            'departamento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'distrito': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'provincia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'razonsocial': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'ruccliente_id': ('django.db.models.fields.CharField', [], {'max_length': '11', 'db_index': 'True'}),
            'telefono': ('django.db.models.fields.CharField', [], {'default': "'000-000-000'", 'max_length': '30', 'null': 'True', 'blank': 'True'})
        },
        u'home.company': {
            'Meta': {'object_name': 'Company'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '250'}),
            'companyname': ('django.db.models.fields.CharField', [], {'max_length': '250'}),
            'fax': ('django.db.models.fields.CharField', [], {'max_length': '60', 'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'default': "'000-000'", 'max_length': '60', 'null': 'True', 'blank': 'True'}),
            'ruc': ('django.db.models.fields.CharField', [], {'max_length': '11', 'primary_key': 'True'})
        },
        u'home.conductore': {
            'Meta': {'object_name': 'Conductore'},
            'condni_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'coninscription': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'}),
            'conlic': ('django.db.models.fields.CharField', [], {'max_length': '12'}),
            'connom': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'contel': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '11', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"})
        },
        u'home.configuracion': {
            'Meta': {'object_name': 'Configuracion'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'igv': ('django.db.models.fields.FloatField', [], {'default': '18'}),
            'moneda': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']"}),
            'perception': ('django.db.models.fields.FloatField', [], {'default': '2'}),
            'periodo': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '4'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'home.departamento': {
            'Meta': {'ordering': "['depnom']", 'object_name': 'Departamento'},
            'departamento_id': ('django.db.models.fields.CharField', [], {'max_length': '2', 'primary_key': 'True'}),
            'depnom': ('django.db.models.fields.CharField', [], {'max_length': '56'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pais': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"})
        },
        u'home.detailsgroup': {
            'Meta': {'object_name': 'DetailsGroup'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'mgroup': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.GroupMaterials']"}),
            'quantity': ('django.db.models.fields.FloatField', [], {})
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
        u'home.documentos': {
            'Meta': {'object_name': 'Documentos'},
            'documento': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'documento_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        },
        u'home.emails': {
            'Meta': {'object_name': 'Emails'},
            'account': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'body': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'cc': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'cco': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'fors': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'issue': ('django.db.models.fields.CharField', [], {'max_length': '250'})
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
        u'home.employeeauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'EmployeeAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_employee_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'address': ('django.db.models.fields.CharField', [], {'max_length': '180', 'null': 'True', 'blank': 'True'}),
            'address2': ('django.db.models.fields.CharField', [], {'max_length': '180', 'null': 'True', 'blank': 'True'}),
            'archivo': ('django.db.models.fields.files.FileField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'birth': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'cargopostula': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'charge': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cargo']", 'null': 'True'}),
            'discapacidad': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'distrito': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '80', 'null': 'True', 'blank': 'True'}),
            'empdni_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'db_index': 'True'}),
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
        u'home.formapago': {
            'Meta': {'object_name': 'FormaPago'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pagos': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'pagos_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'valor': ('django.db.models.fields.FloatField', [], {})
        },
        u'home.groupmaterials': {
            'Meta': {'object_name': 'GroupMaterials'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'mgroup_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250'}),
            'tgroup': ('django.db.models.fields.related.ForeignKey', [], {'default': "'TG00000'", 'to': u"orm['home.TypeGroup']"})
        },
        u'home.herramientas': {
            'Meta': {'object_name': 'Herramientas'},
            'acabado': ('django.db.models.fields.CharField', [], {'max_length': '13'}),
            'herramientas': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'herramientas_id': ('django.db.models.fields.CharField', [], {'max_length': '14', 'primary_key': 'True'}),
            'medida': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'tvida': ('django.db.models.fields.IntegerField', [], {}),
            'unidad': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.keyconfirm': {
            'Meta': {'object_name': 'KeyConfirm'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'desc': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '40', 'null': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '80'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        },
        u'home.keyconfirmauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'KeyConfirmAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_keyconfirm_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'desc': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '40', 'null': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '80'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'key': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        },
        u'home.loginproveedor': {
            'Meta': {'object_name': 'LoginProveedor'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'supplier': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Proveedor']"}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '16'})
        },
        u'home.logsys': {
            'Meta': {'object_name': 'LogSys'},
            'flag': ('django.db.models.fields.CharField', [], {'default': "'1'", 'max_length': '1'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'log': ('django.db.models.fields.TextField', [], {}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'version': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'home.logsysauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'LogSysAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_logsys_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.CharField', [], {'default': "'1'", 'max_length': '1'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'log': ('django.db.models.fields.TextField', [], {}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'version': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'home.materiale': {
            'Meta': {'ordering': "['matnom']", 'object_name': 'Materiale'},
            'matacb': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'matare': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'materiales_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15', 'primary_key': 'True'}),
            'matmed': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'matnom': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'unidad': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.materialeauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'MaterialeAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_materiale_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'matacb': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'matare': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'materiales_id': ('django.db.models.fields.CharField', [], {'max_length': '15', 'db_index': 'True'}),
            'matmed': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'matnom': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'unidad': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.mniple': {
            'Meta': {'ordering': "['ktype']", 'object_name': 'MNiple'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'ktype': ('django.db.models.fields.CharField', [], {'max_length': '1', 'primary_key': 'True'}),
            'ncount': ('django.db.models.fields.CharField', [], {'max_length': '6', 'null': 'True'}),
            'ntype': ('django.db.models.fields.CharField', [], {'max_length': '80'})
        },
        u'home.model': {
            'Meta': {'object_name': 'Model'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'model_id': ('django.db.models.fields.CharField', [], {'max_length': '5', 'primary_key': 'True'})
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
        u'home.tipocambio': {
            'Meta': {'object_name': 'TipoCambio'},
            'compra': ('django.db.models.fields.FloatField', [], {}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'moneda': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']"}),
            'registrado': ('django.db.models.fields.TimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'venta': ('django.db.models.fields.FloatField', [], {})
        },
        u'home.tipoempleado': {
            'Meta': {'object_name': 'TipoEmpleado'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipoemple_id': ('django.db.models.fields.CharField', [], {'max_length': '9', 'primary_key': 'True'})
        },
        u'home.tools': {
            'Meta': {'ordering': "['name']", 'object_name': 'Tools'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'measure': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'tools_id': ('django.db.models.fields.CharField', [], {'max_length': '14', 'primary_key': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.toolsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'ToolsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_tools_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'measure': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'tools_id': ('django.db.models.fields.CharField', [], {'max_length': '14', 'db_index': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.transporte': {
            'Meta': {'object_name': 'Transporte'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'marca': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'nropla_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"})
        },
        u'home.transportista': {
            'Meta': {'object_name': 'Transportista'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tranom': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'traruc_id': ('django.db.models.fields.CharField', [], {'max_length': '11', 'primary_key': 'True'}),
            'tratel': ('django.db.models.fields.CharField', [], {'default': "'000-000-000'", 'max_length': '11', 'null': 'True'})
        },
        u'home.typegroup': {
            'Meta': {'object_name': 'TypeGroup'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tgroup_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'typeg': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'home.unidade': {
            'Meta': {'object_name': 'Unidade'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unidad_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'uninom': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'home.userprofile': {
            'Meta': {'object_name': 'userProfile'},
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['home']