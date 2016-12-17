#!/usr/bin/env python
#-*- encoding: utf-8 -*-

from django.conf.urls import patterns, url
from django.contrib import admin

from .views import *


admin.autodiscover()

urlspatterns = patterns(
    '',
    url(r'^', {}),
)