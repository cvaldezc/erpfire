# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AnalysisGroup'
        db.create_table(u'budget_analysisgroup', (
            ('agroup_id', self.gf('django.db.models.fields.CharField')(max_length=5, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('register', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2015, 7, 23, 0, 0), auto_now=True, blank=True)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['AnalysisGroup'])

        # Adding model 'AnalysisAuditLogEntry'
        db.create_table(u'budget_analysisauditlogentry', (
            ('analysis_id', self.gf('django.db.models.fields.CharField')(max_length=8, db_index=True)),
            ('group', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.AnalysisGroup'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('unit', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Unidade'])),
            ('performance', self.gf('django.db.models.fields.FloatField')()),
            ('register', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2015, 7, 23, 0, 0), auto_now=True, blank=True)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_analysis_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['AnalysisAuditLogEntry'])

        # Adding model 'Analysis'
        db.create_table(u'budget_analysis', (
            ('analysis_id', self.gf('django.db.models.fields.CharField')(max_length=8, primary_key=True)),
            ('group', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.AnalysisGroup'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('unit', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Unidade'])),
            ('performance', self.gf('django.db.models.fields.FloatField')()),
            ('register', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2015, 7, 23, 0, 0), auto_now=True, blank=True)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['Analysis'])

        # Adding model 'APMaterialsAuditLogEntry'
        db.create_table(u'budget_apmaterialsauditlogentry', (
            (u'id', self.gf('django.db.models.fields.IntegerField')(db_index=True, blank=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('materials', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Materiale'])),
            ('quantity', self.gf('django.db.models.fields.FloatField')()),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_apmaterials_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['APMaterialsAuditLogEntry'])

        # Adding model 'APMaterials'
        db.create_table(u'budget_apmaterials', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('materials', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Materiale'])),
            ('quantity', self.gf('django.db.models.fields.FloatField')()),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['APMaterials'])

        # Adding model 'APManPowerAuditLogEntry'
        db.create_table(u'budget_apmanpowerauditlogentry', (
            (u'id', self.gf('django.db.models.fields.IntegerField')(db_index=True, blank=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('manpower', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cargo'])),
            ('gang', self.gf('django.db.models.fields.DecimalField')(max_digits=3, decimal_places=2)),
            ('quantity', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=2)),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=8, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_apmanpower_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['APManPowerAuditLogEntry'])

        # Adding model 'APManPower'
        db.create_table(u'budget_apmanpower', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('manpower', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cargo'])),
            ('gang', self.gf('django.db.models.fields.DecimalField')(max_digits=3, decimal_places=2)),
            ('quantity', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=2)),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=8, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['APManPower'])

        # Adding model 'APToolsAuditLogEntry'
        db.create_table(u'budget_aptoolsauditlogentry', (
            (u'id', self.gf('django.db.models.fields.IntegerField')(db_index=True, blank=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('tools', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Tools'])),
            ('gang', self.gf('django.db.models.fields.DecimalField')(max_digits=3, decimal_places=2)),
            ('quantity', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=2)),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=8, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_aptools_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['APToolsAuditLogEntry'])

        # Adding model 'APTools'
        db.create_table(u'budget_aptools', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('tools', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Tools'])),
            ('gang', self.gf('django.db.models.fields.DecimalField')(max_digits=3, decimal_places=2)),
            ('quantity', self.gf('django.db.models.fields.DecimalField')(max_digits=5, decimal_places=2)),
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=8, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['APTools'])

        # Adding model 'BudgetAuditLogEntry'
        db.create_table(u'budget_budgetauditlogentry', (
            ('budget_id', self.gf('django.db.models.fields.CharField')(max_length=10, db_index=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('customers', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cliente'], null=True)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('country', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Pais'])),
            ('departament', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Departamento'])),
            ('province', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Provincia'])),
            ('district', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Distrito'])),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('hourwork', self.gf('django.db.models.fields.IntegerField')(default=8)),
            ('finish', self.gf('django.db.models.fields.DateField')()),
            ('base', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('offer', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('observation', self.gf('django.db.models.fields.TextField')()),
            ('reference', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('review', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('version', self.gf('django.db.models.fields.CharField')(default='', max_length=5)),
            ('status', self.gf('django.db.models.fields.CharField')(default='PE', max_length=2)),
            ('currency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Moneda'])),
            ('exchange', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=5, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_budget_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['BudgetAuditLogEntry'])

        # Adding model 'Budget'
        db.create_table(u'budget_budget', (
            ('budget_id', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('customers', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Cliente'], null=True)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('country', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Pais'])),
            ('departament', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Departamento'])),
            ('province', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Provincia'])),
            ('district', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Distrito'])),
            ('register', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('hourwork', self.gf('django.db.models.fields.IntegerField')(default=8)),
            ('finish', self.gf('django.db.models.fields.DateField')()),
            ('base', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('offer', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('observation', self.gf('django.db.models.fields.TextField')()),
            ('reference', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('review', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('version', self.gf('django.db.models.fields.CharField')(default='', max_length=5)),
            ('status', self.gf('django.db.models.fields.CharField')(default='PE', max_length=2)),
            ('currency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Moneda'])),
            ('exchange', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=5, decimal_places=3)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['Budget'])

        # Adding model 'BudgetItemsAuditLogEntry'
        db.create_table(u'budget_budgetitemsauditlogentry', (
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti_id', self.gf('django.db.models.fields.CharField')(max_length=13, db_index=True)),
            ('item', self.gf('django.db.models.fields.IntegerField')()),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('base', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('offer', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_budgetitems_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['BudgetItemsAuditLogEntry'])

        # Adding model 'BudgetItems'
        db.create_table(u'budget_budgetitems', (
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti_id', self.gf('django.db.models.fields.CharField')(max_length=13, primary_key=True)),
            ('item', self.gf('django.db.models.fields.DecimalField')(max_digits=3, decimal_places=2)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('base', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('offer', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=3)),
            ('tag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['BudgetItems'])

        # Adding model 'BudgetSubAuditLogEntry'
        db.create_table(u'budget_budgetsubauditlogentry', (
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetItems'])),
            ('budgetsub_id', self.gf('django.db.models.fields.CharField')(max_length=16, db_index=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('unit', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Unidade'])),
            ('status', self.gf('django.db.models.fields.CharField')(default='PE', max_length=2)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_budgetsub_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['BudgetSubAuditLogEntry'])

        # Adding model 'BudgetSub'
        db.create_table(u'budget_budgetsub', (
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetItems'])),
            ('budgetsub_id', self.gf('django.db.models.fields.CharField')(max_length=16, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('unit', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Unidade'])),
            ('status', self.gf('django.db.models.fields.CharField')(default='PE', max_length=2)),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'budget', ['BudgetSub'])

        # Adding model 'BudgetDetailsAuditLogEntry'
        db.create_table(u'budget_budgetdetailsauditlogentry', (
            (u'id', self.gf('django.db.models.fields.IntegerField')(db_index=True, blank=True)),
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetItems'])),
            ('budgetsub', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetSub'])),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('quantity', self.gf('django.db.models.fields.FloatField')()),
            (u'action_user', self.gf('audit_log.models.fields.LastUserField')(related_name=u'_budgetdetails_audit_log_entry', to=orm['auth.User'])),
            (u'action_id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            (u'action_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            (u'action_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'budget', ['BudgetDetailsAuditLogEntry'])

        # Adding model 'BudgetDetails'
        db.create_table(u'budget_budgetdetails', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('budget', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Budget'])),
            ('budgeti', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetItems'])),
            ('budgetsub', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.BudgetSub'])),
            ('analysis', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['budget.Analysis'])),
            ('quantity', self.gf('django.db.models.fields.FloatField')()),
        ))
        db.send_create_signal(u'budget', ['BudgetDetails'])


    def backwards(self, orm):
        # Deleting model 'AnalysisGroup'
        db.delete_table(u'budget_analysisgroup')

        # Deleting model 'AnalysisAuditLogEntry'
        db.delete_table(u'budget_analysisauditlogentry')

        # Deleting model 'Analysis'
        db.delete_table(u'budget_analysis')

        # Deleting model 'APMaterialsAuditLogEntry'
        db.delete_table(u'budget_apmaterialsauditlogentry')

        # Deleting model 'APMaterials'
        db.delete_table(u'budget_apmaterials')

        # Deleting model 'APManPowerAuditLogEntry'
        db.delete_table(u'budget_apmanpowerauditlogentry')

        # Deleting model 'APManPower'
        db.delete_table(u'budget_apmanpower')

        # Deleting model 'APToolsAuditLogEntry'
        db.delete_table(u'budget_aptoolsauditlogentry')

        # Deleting model 'APTools'
        db.delete_table(u'budget_aptools')

        # Deleting model 'BudgetAuditLogEntry'
        db.delete_table(u'budget_budgetauditlogentry')

        # Deleting model 'Budget'
        db.delete_table(u'budget_budget')

        # Deleting model 'BudgetItemsAuditLogEntry'
        db.delete_table(u'budget_budgetitemsauditlogentry')

        # Deleting model 'BudgetItems'
        db.delete_table(u'budget_budgetitems')

        # Deleting model 'BudgetSubAuditLogEntry'
        db.delete_table(u'budget_budgetsubauditlogentry')

        # Deleting model 'BudgetSub'
        db.delete_table(u'budget_budgetsub')

        # Deleting model 'BudgetDetailsAuditLogEntry'
        db.delete_table(u'budget_budgetdetailsauditlogentry')

        # Deleting model 'BudgetDetails'
        db.delete_table(u'budget_budgetdetails')


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
        u'budget.analysis': {
            'Meta': {'ordering': "['name']", 'object_name': 'Analysis'},
            'analysis_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.AnalysisGroup']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'performance': ('django.db.models.fields.FloatField', [], {}),
            'register': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2015, 7, 23, 0, 0)', 'auto_now': 'True', 'blank': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'budget.analysisauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'AnalysisAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_analysis_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'analysis_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'db_index': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.AnalysisGroup']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'performance': ('django.db.models.fields.FloatField', [], {}),
            'register': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2015, 7, 23, 0, 0)', 'auto_now': 'True', 'blank': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'budget.analysisgroup': {
            'Meta': {'ordering': "['register']", 'object_name': 'AnalysisGroup'},
            'agroup_id': ('django.db.models.fields.CharField', [], {'max_length': '5', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2015, 7, 23, 0, 0)', 'auto_now': 'True', 'blank': 'True'})
        },
        u'budget.apmanpower': {
            'Meta': {'ordering': "['manpower']", 'object_name': 'APManPower'},
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gang': ('django.db.models.fields.DecimalField', [], {'max_digits': '3', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'manpower': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cargo']"}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '2'})
        },
        u'budget.apmanpowerauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'APManPowerAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_apmanpower_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gang': ('django.db.models.fields.DecimalField', [], {'max_digits': '3', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'manpower': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cargo']"}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '2'})
        },
        u'budget.apmaterials': {
            'Meta': {'ordering': "['materials']", 'object_name': 'APMaterials'},
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.FloatField', [], {})
        },
        u'budget.apmaterialsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'APMaterialsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_apmaterials_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.FloatField', [], {})
        },
        u'budget.aptools': {
            'Meta': {'ordering': "['tools']", 'object_name': 'APTools'},
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gang': ('django.db.models.fields.DecimalField', [], {'max_digits': '3', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '2'}),
            'tools': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Tools']"})
        },
        u'budget.aptoolsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'APToolsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_aptools_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'gang': ('django.db.models.fields.DecimalField', [], {'max_digits': '3', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'price': ('django.db.models.fields.DecimalField', [], {'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '2'}),
            'tools': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Tools']"})
        },
        u'budget.budget': {
            'Meta': {'ordering': "['budget_id']", 'object_name': 'Budget'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'base': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'budget_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'currency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']"}),
            'customers': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']", 'null': 'True'}),
            'departament': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'district': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'exchange': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '5', 'decimal_places': '3'}),
            'finish': ('django.db.models.fields.DateField', [], {}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'hourwork': ('django.db.models.fields.IntegerField', [], {'default': '8'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'observation': ('django.db.models.fields.TextField', [], {}),
            'offer': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'province': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'reference': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'review': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'version': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '5'})
        },
        u'budget.budgetauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'BudgetAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_budget_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'address': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'base': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'budget_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'db_index': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Pais']"}),
            'currency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']"}),
            'customers': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']", 'null': 'True'}),
            'departament': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Departamento']"}),
            'district': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Distrito']"}),
            'exchange': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '5', 'decimal_places': '3'}),
            'finish': ('django.db.models.fields.DateField', [], {}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'hourwork': ('django.db.models.fields.IntegerField', [], {'default': '8'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'observation': ('django.db.models.fields.TextField', [], {}),
            'offer': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'province': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Provincia']"}),
            'reference': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'review': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'version': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '5'})
        },
        u'budget.budgetdetails': {
            'Meta': {'ordering': "['analysis']", 'object_name': 'BudgetDetails'},
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetItems']"}),
            'budgetsub': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetSub']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'quantity': ('django.db.models.fields.FloatField', [], {})
        },
        u'budget.budgetdetailsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'BudgetDetailsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_budgetdetails_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'analysis': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Analysis']"}),
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetItems']"}),
            'budgetsub': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetSub']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'quantity': ('django.db.models.fields.FloatField', [], {})
        },
        u'budget.budgetitems': {
            'Meta': {'ordering': "['name']", 'object_name': 'BudgetItems'},
            'base': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti_id': ('django.db.models.fields.CharField', [], {'max_length': '13', 'primary_key': 'True'}),
            'item': ('django.db.models.fields.IntegerField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'offer': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'budget.budgetitemsauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'BudgetItemsAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_budgetitems_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'base': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti_id': ('django.db.models.fields.CharField', [], {'max_length': '13', 'db_index': 'True'}),
            'item': ('django.db.models.fields.IntegerField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'offer': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '3'}),
            'tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'budget.budgetsub': {
            'Meta': {'ordering': "['name']", 'object_name': 'BudgetSub'},
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetItems']"}),
            'budgetsub_id': ('django.db.models.fields.CharField', [], {'max_length': '16', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'budget.budgetsubauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'BudgetSubAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_budgetsub_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'budget': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.Budget']"}),
            'budgeti': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['budget.BudgetItems']"}),
            'budgetsub_id': ('django.db.models.fields.CharField', [], {'max_length': '16', 'db_index': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
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
        u'home.materiale': {
            'Meta': {'ordering': "['matnom']", 'object_name': 'Materiale'},
            'matacb': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'matare': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'materiales_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15', 'primary_key': 'True'}),
            'matmed': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'matnom': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'unidad': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
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
        u'home.tools': {
            'Meta': {'ordering': "['name']", 'object_name': 'Tools'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'measure': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'tools_id': ('django.db.models.fields.CharField', [], {'max_length': '14', 'primary_key': 'True'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'home.unidade': {
            'Meta': {'object_name': 'Unidade'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unidad_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'uninom': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['budget']