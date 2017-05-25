# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'detGrupoPedido'
        db.create_table(u'almacen_detgrupopedido', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('codgrupo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['almacen.GrupoPedido'])),
            ('pedido', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['almacen.Pedido'])),
            ('material', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Materiale'])),
            ('marca', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Brand'])),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Model'])),
            ('cantidad', self.gf('django.db.models.fields.FloatField')()),
            ('flag', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'almacen', ['detGrupoPedido'])

        # Adding model 'GrupoPedido'
        db.create_table(u'almacen_grupopedido', (
            ('codgrupo_id', self.gf('django.db.models.fields.CharField')(max_length=7, primary_key=True)),
            ('proyecto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['ventas.Proyecto'])),
            ('empdni', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='AuthAsEmployeegr', null=True, to=orm['home.Employee'])),
            ('registro', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('fechtraslado', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('flagdetalle', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('estado', self.gf('django.db.models.fields.CharField')(max_length=2)),
        ))
        db.send_create_signal(u'almacen', ['GrupoPedido'])

        # Adding model 'GrupoPedNiple'
        db.create_table(u'almacen_grupopedniple', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('codgrupo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['almacen.GrupoPedido'])),
            ('pedido', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['almacen.Pedido'])),
            ('material', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Materiale'])),
            ('marca', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Brand'])),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['home.Model'])),
            ('cantidad', self.gf('django.db.models.fields.FloatField')()),
            ('metrado', self.gf('django.db.models.fields.FloatField')()),
            ('tipo', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('idref', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['almacen.Niple'])),
        ))
        db.send_create_signal(u'almacen', ['GrupoPedNiple'])

        # Adding field 'Detpedido.cantenv'
        db.add_column(u'almacen_detpedido', 'cantenv',
                      self.gf('django.db.models.fields.FloatField')(default=0, blank=True),
                      keep_default=False)

        # Adding field 'Detpedido.flagcantenv'
        db.add_column(u'almacen_detpedido', 'flagcantenv',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'NipleAuditLogEntry.cantenv'
        db.add_column(u'almacen_nipleauditlogentry', 'cantenv',
                      self.gf('django.db.models.fields.FloatField')(default=0, blank=True),
                      keep_default=False)

        # Adding field 'NipleAuditLogEntry.flagcantenv'
        db.add_column(u'almacen_nipleauditlogentry', 'flagcantenv',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'PedidoAuditLogEntry.stgrupo'
        db.add_column(u'almacen_pedidoauditlogentry', 'stgrupo',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Pedido.stgrupo'
        db.add_column(u'almacen_pedido', 'stgrupo',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Niple.cantenv'
        db.add_column(u'almacen_niple', 'cantenv',
                      self.gf('django.db.models.fields.FloatField')(default=0, blank=True),
                      keep_default=False)

        # Adding field 'Niple.flagcantenv'
        db.add_column(u'almacen_niple', 'flagcantenv',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'DetpedidoAuditLogEntry.cantenv'
        db.add_column(u'almacen_detpedidoauditlogentry', 'cantenv',
                      self.gf('django.db.models.fields.FloatField')(default=0, blank=True),
                      keep_default=False)

        # Adding field 'DetpedidoAuditLogEntry.flagcantenv'
        db.add_column(u'almacen_detpedidoauditlogentry', 'flagcantenv',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting model 'detGrupoPedido'
        db.delete_table(u'almacen_detgrupopedido')

        # Deleting model 'GrupoPedido'
        db.delete_table(u'almacen_grupopedido')

        # Deleting model 'GrupoPedNiple'
        db.delete_table(u'almacen_grupopedniple')

        # Deleting field 'Detpedido.cantenv'
        db.delete_column(u'almacen_detpedido', 'cantenv')

        # Deleting field 'Detpedido.flagcantenv'
        db.delete_column(u'almacen_detpedido', 'flagcantenv')

        # Deleting field 'NipleAuditLogEntry.cantenv'
        db.delete_column(u'almacen_nipleauditlogentry', 'cantenv')

        # Deleting field 'NipleAuditLogEntry.flagcantenv'
        db.delete_column(u'almacen_nipleauditlogentry', 'flagcantenv')

        # Deleting field 'PedidoAuditLogEntry.stgrupo'
        db.delete_column(u'almacen_pedidoauditlogentry', 'stgrupo')

        # Deleting field 'Pedido.stgrupo'
        db.delete_column(u'almacen_pedido', 'stgrupo')

        # Deleting field 'Niple.cantenv'
        db.delete_column(u'almacen_niple', 'cantenv')

        # Deleting field 'Niple.flagcantenv'
        db.delete_column(u'almacen_niple', 'flagcantenv')

        # Deleting field 'DetpedidoAuditLogEntry.cantenv'
        db.delete_column(u'almacen_detpedidoauditlogentry', 'cantenv')

        # Deleting field 'DetpedidoAuditLogEntry.flagcantenv'
        db.delete_column(u'almacen_detpedidoauditlogentry', 'flagcantenv')


    models = {
        u'almacen.balance': {
            'Meta': {'ordering': "['-register']", 'object_name': 'Balance'},
            'balance': ('django.db.models.fields.FloatField', [], {}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'default': "'AL01'", 'to': u"orm['home.Almacene']", 'blank': 'True'})
        },
        u'almacen.balanceauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'BalanceAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_balance_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'balance': ('django.db.models.fields.FloatField', [], {}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'default': "'AL01'", 'to': u"orm['home.Almacene']", 'blank': 'True'})
        },
        u'almacen.detdevherramienta': {
            'Meta': {'object_name': 'detDevHerramienta'},
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'docdev': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.devolucionHerra']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'guia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GuiaHerramienta']"}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'almacen.detgrupopedido': {
            'Meta': {'object_name': 'detGrupoPedido'},
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'codgrupo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GrupoPedido']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'marca': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'material': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"})
        },
        u'almacen.detguiaherramienta': {
            'Meta': {'object_name': 'detGuiaHerramienta'},
            'cantdev': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'fechdevolucion': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flagdev': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'guia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GuiaHerramienta']"}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'almacen.detguiaremision': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'DetGuiaRemision'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GuiaRemision']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'obrand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'related_name': "'obrandAsDetGuide'", 'blank': 'True', 'to': u"orm['home.Brand']"}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'omodel': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'related_name': "'omodelAsDetGuide'", 'blank': 'True', 'to': u"orm['home.Model']"}),
            'order': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'})
        },
        u'almacen.detguiaremisionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'DetGuiaRemisionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detguiaremision_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GuiaRemision']"}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'obrand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'related_name': "u'_auditlog_obrandAsDetGuide'", 'blank': 'True', 'to': u"orm['home.Brand']"}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'omodel': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'related_name': "u'_auditlog_omodelAsDetGuide'", 'blank': 'True', 'to': u"orm['home.Model']"}),
            'order': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'})
        },
        u'almacen.detingress': {
            'Meta': {'object_name': 'DetIngress'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'convertto': ('django.db.models.fields.DecimalField', [], {'default': '1', 'max_digits': '6', 'decimal_places': '2'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ingress': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.NoteIngress']"}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'purchase': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '2'}),
            'report': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'}),
            'sales': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '3'})
        },
        u'almacen.detingressauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'DetIngressAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detingress_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'convertto': ('django.db.models.fields.DecimalField', [], {'default': '1', 'max_digits': '6', 'decimal_places': '2'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'ingress': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.NoteIngress']"}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'purchase': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '3'}),
            'quantity': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '2'}),
            'report': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'}),
            'sales': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '3'})
        },
        u'almacen.detpedido': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'Detpedido'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantenv': ('django.db.models.fields.FloatField', [], {'default': '0', 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'cantshop': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'comment': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'flagcantenv': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'spptag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'tag': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'})
        },
        u'almacen.detpedidoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'DetpedidoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_detpedido_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantenv': ('django.db.models.fields.FloatField', [], {'default': '0', 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'cantshop': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'comment': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'flagcantenv': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'spptag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'tag': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'})
        },
        u'almacen.detrestoration': {
            'Meta': {'ordering': "['materials']", 'object_name': 'DetRestoration'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'niple': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'other': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'quantity': ('django.db.models.fields.FloatField', [], {}),
            'restoration': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Restoration']"})
        },
        u'almacen.detsuministro': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'DetSuministro'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'null': 'True', 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'cantshop': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'null': 'True', 'blank': 'True'}),
            'origin': ('django.db.models.fields.CharField', [], {'default': "'NN'", 'max_length': '10'}),
            'suministro': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Suministro']"}),
            'tag': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'})
        },
        u'almacen.devolucionherra': {
            'Meta': {'object_name': 'devolucionHerra'},
            'condni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Conductore']"}),
            'docdev_id': ('django.db.models.fields.CharField', [], {'max_length': '12', 'primary_key': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']", 'null': 'True'}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'fechretorno': ('django.db.models.fields.DateField', [], {}),
            'nropla': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transporte']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"})
        },
        u'almacen.grupopedido': {
            'Meta': {'object_name': 'GrupoPedido'},
            'codgrupo_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'AuthAsEmployeegr'", 'null': 'True', 'to': u"orm['home.Employee']"}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'fechtraslado': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flagdetalle': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'almacen.grupopedniple': {
            'Meta': {'object_name': 'GrupoPedNiple'},
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'codgrupo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GrupoPedido']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'idref': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Niple']"}),
            'marca': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'material': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'metrado': ('django.db.models.fields.FloatField', [], {}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'almacen.guiaherramienta': {
            'Meta': {'object_name': 'GuiaHerramienta'},
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'condni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Conductore']"}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']", 'null': 'True'}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'fechsalida': ('django.db.models.fields.DateField', [], {}),
            'guia_id': ('django.db.models.fields.CharField', [], {'max_length': '12', 'primary_key': 'True'}),
            'nropla': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transporte']"}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"})
        },
        u'almacen.guiaremision': {
            'Meta': {'object_name': 'GuiaRemision'},
            'comment': ('django.db.models.fields.TextField', [], {'default': "''"}),
            'condni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Conductore']"}),
            'dotoutput': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guia_id': ('django.db.models.fields.CharField', [], {'max_length': '12', 'primary_key': 'True'}),
            'motive': ('django.db.models.fields.CharField', [], {'default': "'NO SE ESPECIFICA.'", 'max_length': '250', 'blank': 'True'}),
            'moveby': ('django.db.models.fields.CharField', [], {'default': "'Venta'", 'max_length': '60', 'blank': 'True'}),
            'nota': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'nropla': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transporte']"}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'orders': ('django.db.models.fields.CharField', [], {'default': 'None', 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'}),
            'perreg': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']", 'null': 'True', 'blank': 'True'}),
            'puntollegada': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'ruccliente': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']"}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'46'", 'max_length': '2'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'almacen.guiaremisionauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'GuiaRemisionAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_guiaremision_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'comment': ('django.db.models.fields.TextField', [], {'default': "''"}),
            'condni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Conductore']"}),
            'dotoutput': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guia_id': ('django.db.models.fields.CharField', [], {'max_length': '12', 'db_index': 'True'}),
            'motive': ('django.db.models.fields.CharField', [], {'default': "'NO SE ESPECIFICA.'", 'max_length': '250', 'blank': 'True'}),
            'moveby': ('django.db.models.fields.CharField', [], {'default': "'Venta'", 'max_length': '60', 'blank': 'True'}),
            'nota': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'nropla': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transporte']"}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'orders': ('django.db.models.fields.CharField', [], {'default': 'None', 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'}),
            'perreg': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']", 'null': 'True', 'blank': 'True'}),
            'puntollegada': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'ruccliente': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Cliente']"}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'46'", 'max_length': '2'}),
            'traruc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Transportista']"}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'almacen.herramienta': {
            'Meta': {'object_name': 'Herramienta'},
            'herramienta_id': ('django.db.models.fields.CharField', [], {'max_length': '15', 'primary_key': 'True'}),
            'marca': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'medida': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'tvida': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'unidad': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Unidade']"})
        },
        u'almacen.inventario': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'Inventario'},
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'compra': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['logistica.Compra']", 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ingreso': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'periodo': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '4'}),
            'precompra': ('django.db.models.fields.FloatField', [], {}),
            'preventa': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'spptag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'stkdevuelto': ('django.db.models.fields.FloatField', [], {}),
            'stkmin': ('django.db.models.fields.FloatField', [], {}),
            'stkpendiente': ('django.db.models.fields.FloatField', [], {}),
            'stock': ('django.db.models.fields.FloatField', [], {})
        },
        u'almacen.inventarioauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'InventarioAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_inventario_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'compra': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['logistica.Compra']", 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'ingreso': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'periodo': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '4'}),
            'precompra': ('django.db.models.fields.FloatField', [], {}),
            'preventa': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'spptag': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'stkdevuelto': ('django.db.models.fields.FloatField', [], {}),
            'stkmin': ('django.db.models.fields.FloatField', [], {}),
            'stkpendiente': ('django.db.models.fields.FloatField', [], {}),
            'stock': ('django.db.models.fields.FloatField', [], {})
        },
        u'almacen.inventarioherra': {
            'Meta': {'object_name': 'InventarioHerra'},
            'cantalmacen': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ingreso': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'observacion': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'price': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'reparacion': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'})
        },
        u'almacen.inventorybrand': {
            'Meta': {'ordering': "['materials']", 'object_name': 'InventoryBrand'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ingress': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'period': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'purchase': ('django.db.models.fields.FloatField', [], {}),
            'sale': ('django.db.models.fields.FloatField', [], {}),
            'stock': ('django.db.models.fields.FloatField', [], {}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"})
        },
        u'almacen.inventorybrandauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'InventoryBrandAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_inventorybrand_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'ingress': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'period': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'purchase': ('django.db.models.fields.FloatField', [], {}),
            'sale': ('django.db.models.fields.FloatField', [], {}),
            'stock': ('django.db.models.fields.FloatField', [], {}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"})
        },
        u'almacen.movinventario': {
            'Meta': {'object_name': 'MovInventario'},
            'cantidad': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'estado': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'almacen.niple': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'Niple'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantenv': ('django.db.models.fields.FloatField', [], {'default': '0', 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {'default': '1', 'null': 'True'}),
            'cantshop': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True'}),
            'comment': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'dsector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'flagcantenv': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'metrado': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'related': ('django.db.models.fields.IntegerField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'}),
            'tag': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'almacen.nipleauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'NipleAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_niple_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantenv': ('django.db.models.fields.FloatField', [], {'default': '0', 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {'default': '1', 'null': 'True'}),
            'cantshop': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True'}),
            'comment': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'dsector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'flagcantenv': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.IntegerField', [], {'db_index': 'True', 'blank': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'metrado': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'related': ('django.db.models.fields.IntegerField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'}),
            'tag': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'almacen.nipleguiaremision': {
            'Meta': {'ordering': "['materiales']", 'object_name': 'NipleGuiaRemision'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantguide': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guia': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.GuiaRemision']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'metrado': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'order': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'}),
            'related': ('django.db.models.fields.IntegerField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'almacen.noteingress': {
            'Meta': {'object_name': 'NoteIngress'},
            'approval': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'approvalAsEmployee'", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guide': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'}),
            'ingress_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'inspection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'inspectionAsEmployee'", 'to': u"orm['home.Employee']"}),
            'invoice': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'}),
            'motive': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'purchase': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['logistica.Compra']"}),
            'receive': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'receiveAsEmployee'", 'to': u"orm['home.Employee']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'IN'", 'max_length': '2'}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"})
        },
        u'almacen.noteingressauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'NoteIngressAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_noteingress_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'approval': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_approvalAsEmployee'", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guide': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'}),
            'ingress_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'db_index': 'True'}),
            'inspection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_inspectionAsEmployee'", 'to': u"orm['home.Employee']"}),
            'invoice': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'}),
            'motive': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'purchase': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['logistica.Compra']"}),
            'receive': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'_auditlog_receiveAsEmployee'", 'to': u"orm['home.Employee']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'IN'", 'max_length': '2'}),
            'storage': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"})
        },
        u'almacen.pedido': {
            'Meta': {'object_name': 'Pedido'},
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'asunto': ('django.db.models.fields.CharField', [], {'max_length': '160', 'null': 'True'}),
            'dsector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'default': "''", 'to': u"orm['home.Employee']", 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'orderfile': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'pedido_id': ('django.db.models.fields.CharField', [], {'default': "'PEAA000000'", 'max_length': '10', 'primary_key': 'True'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'stgrupo': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'almacen.pedidoauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'PedidoAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_pedido_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'asunto': ('django.db.models.fields.CharField', [], {'max_length': '160', 'null': 'True'}),
            'dsector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'default': "''", 'to': u"orm['home.Employee']", 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'orderfile': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'pedido_id': ('django.db.models.fields.CharField', [], {'default': "'PEAA000000'", 'max_length': '10', 'db_index': 'True'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'stgrupo': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'almacen.reparacionherra': {
            'Meta': {'object_name': 'ReparacionHerra'},
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'comentario': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'fechreparacion': ('django.db.models.fields.DateField', [], {}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lugarreparacion': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'registro': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'})
        },
        u'almacen.reportinspect': {
            'Meta': {'object_name': 'ReportInspect'},
            'arrival': ('django.db.models.fields.DateField', [], {}),
            'boarding': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'description': ('django.db.models.fields.TextField', [], {}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'ingress': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.NoteIngress']"}),
            'inspect': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'instorage': ('django.db.models.fields.DateField', [], {}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'transport': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'almacen.restoration': {
            'Meta': {'object_name': 'Restoration'},
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']", 'blank': 'True'}),
            'dsector_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guidein': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'guideinGuide'", 'null': 'True', 'to': u"orm['almacen.GuiaRemision']"}),
            'guideout': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'guideoutAsGuide'", 'null': 'True', 'to': u"orm['almacen.GuiaRemision']"}),
            'observation': ('django.db.models.fields.TextField', [], {}),
            'performed': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']", 'null': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'restoration_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'primary_key': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'AC'", 'max_length': '2'})
        },
        u'almacen.restorationauditlogentry': {
            'Meta': {'ordering': "(u'-action_date',)", 'object_name': 'RestorationAuditLogEntry'},
            u'action_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'action_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            u'action_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'action_user': ('audit_log.models.fields.LastUserField', [], {'related_name': "u'_restoration_audit_log_entry'", 'to': u"orm['auth.User']"}),
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']", 'blank': 'True'}),
            'dsector_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.DSector']", 'null': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'guidein': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "u'_auditlog_guideinGuide'", 'null': 'True', 'to': u"orm['almacen.GuiaRemision']"}),
            'guideout': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "u'_auditlog_guideoutAsGuide'", 'null': 'True', 'to': u"orm['almacen.GuiaRemision']"}),
            'observation': ('django.db.models.fields.TextField', [], {}),
            'performed': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']", 'null': 'True'}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'restoration_id': ('django.db.models.fields.CharField', [], {'max_length': '8', 'db_index': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'AC'", 'max_length': '2'})
        },
        u'almacen.returnitemsproject': {
            'Meta': {'ordering': "['-register']", 'object_name': 'ReturnItemsProject'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'listsend': ('django.db.models.fields.TextField', [], {}),
            'note': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'notpro': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'pedido': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'AC'", 'max_length': '2'})
        },
        u'almacen.suministro': {
            'Meta': {'ordering': "['suministro_id']", 'object_name': 'Suministro'},
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'asunto': ('django.db.models.fields.CharField', [], {'max_length': '180', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'ingreso': ('django.db.models.fields.DateField', [], {}),
            'obser': ('django.db.models.fields.TextField', [], {}),
            'orders': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'blank': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'suministro_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'})
        },
        u'almacen.tmpdetguia': {
            'Meta': {'ordering': "['materials']", 'object_name': 'TmpDetGuia'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Brand']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materials': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Model']"}),
            'observation': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'quantity': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'})
        },
        u'almacen.tmpniple': {
            'Meta': {'object_name': 'tmpniple'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {'default': '1', 'null': 'True'}),
            'comment': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'metrado': ('django.db.models.fields.FloatField', [], {'default': '1'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']", 'null': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'almacen.tmppedido': {
            'Meta': {'object_name': 'tmppedido'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']", 'blank': 'True'}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'empdni': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']", 'blank': 'True'})
        },
        u'almacen.tmpsuministro': {
            'Meta': {'object_name': 'tmpsuministro'},
            'brand': ('django.db.models.fields.related.ForeignKey', [], {'default': "'BR000'", 'to': u"orm['home.Brand']"}),
            'cantidad': ('django.db.models.fields.FloatField', [], {}),
            'empdni': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'materiales': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Materiale']"}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'default': "'MO000'", 'to': u"orm['home.Model']"}),
            'orders': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Pedido']", 'null': 'True', 'blank': 'True'}),
            'origin': ('django.db.models.fields.CharField', [], {'default': "'NN'", 'max_length': '2', 'null': 'True'})
        },
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
        u'home.documentos': {
            'Meta': {'object_name': 'Documentos'},
            'documento': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'documento_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '2'})
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
        u'home.formapago': {
            'Meta': {'object_name': 'FormaPago'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'pagos': ('django.db.models.fields.CharField', [], {'max_length': '160'}),
            'pagos_id': ('django.db.models.fields.CharField', [], {'max_length': '4', 'primary_key': 'True'}),
            'valor': ('django.db.models.fields.FloatField', [], {})
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
        u'home.unidade': {
            'Meta': {'object_name': 'Unidade'},
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'unidad_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'}),
            'uninom': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'logistica.compra': {
            'Meta': {'ordering': "['compra_id']", 'object_name': 'Compra'},
            'compra_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'contacto': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'cotizacion': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['logistica.Cotizacion']", 'null': 'True', 'blank': 'True'}),
            'deposito': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'discount': ('django.db.models.fields.FloatField', [], {'default': '0', 'blank': 'True'}),
            'documento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Documentos']", 'null': 'True', 'blank': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'default': "''", 'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'lugent': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'moneda': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Moneda']", 'null': 'True', 'blank': 'True'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'pagos': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.FormaPago']", 'null': 'True', 'blank': 'True'}),
            'paid': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1', 'blank': 'True'}),
            'projects': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'proveedor': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Proveedor']"}),
            'quotation': ('django.db.models.fields.CharField', [], {'max_length': '25', 'null': 'True', 'blank': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sigv': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'logistica.cotizacion': {
            'Meta': {'ordering': "['cotizacion_id']", 'object_name': 'Cotizacion'},
            'almacen': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Almacene']"}),
            'cotizacion_id': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'empdni': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['home.Employee']"}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'}),
            'suministro': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['almacen.Suministro']", 'null': 'True', 'blank': 'True'}),
            'traslado': ('django.db.models.fields.DateField', [], {})
        },
        u'operations.dsector': {
            'Meta': {'object_name': 'DSector'},
            'dateend': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'datestart': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'dsector_id': ('django.db.models.fields.CharField', [], {'default': "'PRAA000VEN00SG0000DS000'", 'max_length': '23', 'primary_key': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'plane': ('django.db.models.fields.files.FileField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']", 'null': 'True', 'blank': 'True'}),
            'sgroup': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['operations.SGroup']"}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2'})
        },
        u'operations.sgroup': {
            'Meta': {'object_name': 'SGroup'},
            'colour': ('django.db.models.fields.CharField', [], {'max_length': '21', 'null': 'True', 'blank': 'True'}),
            'dateend': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'datestart': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'observation': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'register': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Sectore']"}),
            'sgroup_id': ('django.db.models.fields.CharField', [], {'default': "'PRAA000SG0000'", 'max_length': '18', 'primary_key': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'PE'", 'max_length': '2', 'blank': 'True'}),
            'subproject': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'})
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
        },
        u'ventas.sectore': {
            'Meta': {'ordering': "[u'sector_id']", 'object_name': 'Sectore'},
            'amount': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'amountsales': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'atype': ('django.db.models.fields.CharField', [], {'default': "u'NN'", 'max_length': '2', 'blank': 'True'}),
            'comienzo': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'link': ('django.db.models.fields.TextField', [], {'default': "u''", 'blank': 'True'}),
            'nomsec': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'planoid': ('django.db.models.fields.CharField', [], {'default': "u''", 'max_length': '16', 'null': 'True'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'sector_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20', 'primary_key': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "u'AC'", 'max_length': '2'}),
            'subproyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Subproyecto']", 'null': 'True', 'blank': 'True'})
        },
        u'ventas.subproyecto': {
            'Meta': {'ordering': "[u'nomsub']", 'object_name': 'Subproyecto'},
            'additional': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'comienzo': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'fin': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'flag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'nomsub': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'obser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'proyecto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['ventas.Proyecto']"}),
            'registrado': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "u'AC'", 'max_length': '2'}),
            'subproyecto_id': ('django.db.models.fields.CharField', [], {'max_length': '7', 'primary_key': 'True'})
        }
    }

    complete_apps = ['almacen']