# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Cabprinc'
        db.create_table(u'boleta_cabprinc', (
            ('idcabpr', self.gf('django.db.models.fields.CharField')(max_length=30, primary_key=True)),
            ('periodo', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('tipodni', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('numdni', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('nombres', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('sit', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('fechingreso', self.gf('django.db.models.fields.CharField')(max_length=15)),
            ('tipotrab', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('pensionar', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('cuspp', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('lab', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('lab2', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('subsidiado', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('condici', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('horas', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('minut', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('horas2', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('minut2', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('neto', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal(u'boleta', ['Cabprinc'])

        # Adding model 'Bmotsusp1'
        db.create_table(u'boleta_bmotsusp1', (
            ('tipo', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('motivo', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'boleta', ['Bmotsusp1'])

        # Adding model 'Bngreso2'
        db.create_table(u'boleta_bngreso2', (
            ('cod_ing', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('conc_ing', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'boleta', ['Bngreso2'])

        # Adding model 'Bdescuento3'
        db.create_table(u'boleta_bdescuento3', (
            ('cod_desc', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('conc_desc', self.gf('django.db.models.fields.CharField')(max_length=60)),
        ))
        db.send_create_signal(u'boleta', ['Bdescuento3'])

        # Adding model 'Baportrab4'
        db.create_table(u'boleta_baportrab4', (
            ('cod_aptrab', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('conc_aptrab', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'boleta', ['Baportrab4'])

        # Adding model 'Baportemp5'
        db.create_table(u'boleta_baportemp5', (
            ('cod_apemp', self.gf('django.db.models.fields.CharField')(max_length=10, primary_key=True)),
            ('conc_apemp', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'boleta', ['Baportemp5'])

        # Adding model 'Rmotsusp1'
        db.create_table(u'boleta_rmotsusp1', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Cabprinc'])),
            ('tipo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Bmotsusp1'])),
            ('dias', self.gf('django.db.models.fields.CharField')(max_length=5)),
            ('rentas', self.gf('django.db.models.fields.CharField')(max_length=60)),
        ))
        db.send_create_signal(u'boleta', ['Rmotsusp1'])

        # Adding model 'Rngreso2'
        db.create_table(u'boleta_rngreso2', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Cabprinc'])),
            ('ing', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Bngreso2'])),
            ('ing2', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal(u'boleta', ['Rngreso2'])

        # Adding model 'Rdescuento3'
        db.create_table(u'boleta_rdescuento3', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Cabprinc'])),
            ('desc', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Bdescuento3'])),
            ('des3', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal(u'boleta', ['Rdescuento3'])

        # Adding model 'Raportrab4'
        db.create_table(u'boleta_raportrab4', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Cabprinc'])),
            ('aptrab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Baportrab4'])),
            ('des4', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('n', self.gf('django.db.models.fields.CharField')(max_length=30)),
        ))
        db.send_create_signal(u'boleta', ['Raportrab4'])

        # Adding model 'Raportemp5'
        db.create_table(u'boleta_raportemp5', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Cabprinc'])),
            ('apemp', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['boleta.Baportemp5'])),
            ('ne', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal(u'boleta', ['Raportemp5'])


    def backwards(self, orm):
        # Deleting model 'Cabprinc'
        db.delete_table(u'boleta_cabprinc')

        # Deleting model 'Bmotsusp1'
        db.delete_table(u'boleta_bmotsusp1')

        # Deleting model 'Bngreso2'
        db.delete_table(u'boleta_bngreso2')

        # Deleting model 'Bdescuento3'
        db.delete_table(u'boleta_bdescuento3')

        # Deleting model 'Baportrab4'
        db.delete_table(u'boleta_baportrab4')

        # Deleting model 'Baportemp5'
        db.delete_table(u'boleta_baportemp5')

        # Deleting model 'Rmotsusp1'
        db.delete_table(u'boleta_rmotsusp1')

        # Deleting model 'Rngreso2'
        db.delete_table(u'boleta_rngreso2')

        # Deleting model 'Rdescuento3'
        db.delete_table(u'boleta_rdescuento3')

        # Deleting model 'Raportrab4'
        db.delete_table(u'boleta_raportrab4')

        # Deleting model 'Raportemp5'
        db.delete_table(u'boleta_raportemp5')


    models = {
        u'boleta.baportemp5': {
            'Meta': {'object_name': 'Baportemp5'},
            'cod_apemp': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'conc_apemp': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'boleta.baportrab4': {
            'Meta': {'object_name': 'Baportrab4'},
            'cod_aptrab': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'conc_aptrab': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'boleta.bdescuento3': {
            'Meta': {'object_name': 'Bdescuento3'},
            'cod_desc': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'conc_desc': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'boleta.bmotsusp1': {
            'Meta': {'object_name': 'Bmotsusp1'},
            'motivo': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'})
        },
        u'boleta.bngreso2': {
            'Meta': {'object_name': 'Bngreso2'},
            'cod_ing': ('django.db.models.fields.CharField', [], {'max_length': '10', 'primary_key': 'True'}),
            'conc_ing': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'boleta.cabprinc': {
            'Meta': {'object_name': 'Cabprinc'},
            'condici': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'cuspp': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'fechingreso': ('django.db.models.fields.CharField', [], {'max_length': '15'}),
            'horas': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'horas2': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'idcabpr': ('django.db.models.fields.CharField', [], {'max_length': '30', 'primary_key': 'True'}),
            'lab': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'lab2': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'minut': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'minut2': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'neto': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'nombres': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'numdni': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'pensionar': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'periodo': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'sit': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'subsidiado': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'tipodni': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'tipotrab': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'boleta.raportemp5': {
            'Meta': {'object_name': 'Raportemp5'},
            'apemp': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Baportemp5']"}),
            'cab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Cabprinc']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ne': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'boleta.raportrab4': {
            'Meta': {'object_name': 'Raportrab4'},
            'aptrab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Baportrab4']"}),
            'cab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Cabprinc']"}),
            'des4': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'n': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        u'boleta.rdescuento3': {
            'Meta': {'object_name': 'Rdescuento3'},
            'cab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Cabprinc']"}),
            'des3': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'desc': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Bdescuento3']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'boleta.rmotsusp1': {
            'Meta': {'object_name': 'Rmotsusp1'},
            'cab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Cabprinc']"}),
            'dias': ('django.db.models.fields.CharField', [], {'max_length': '5'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rentas': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'tipo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Bmotsusp1']"})
        },
        u'boleta.rngreso2': {
            'Meta': {'object_name': 'Rngreso2'},
            'cab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Cabprinc']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ing': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['boleta.Bngreso2']"}),
            'ing2': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['boleta']