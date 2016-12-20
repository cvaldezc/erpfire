#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.contrib import admin
from .models import Assistance, TypesEmployee


admin.site.register(Assistance)
admin.site.register(TypesEmployee)
