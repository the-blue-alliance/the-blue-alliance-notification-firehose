#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import hashlib
import logging
import os
import webapp2

from google.appengine.ext.webapp import template

from models.notification import Notification

SECRET = 'REPLACE_WITH_SECRET'


class MainHandler(webapp2.RequestHandler):
    def get(self):

        template_values = {}

        path = os.path.join(os.path.dirname(__file__), "templates/notification_list.html")
        self.response.write(template.render(path, template_values))


class IncomingHandler(webapp2.RequestHandler):
    def post(self):
        checksum = self.request.headers['X-Tba-Checksum']
        payload = self.request.body

        if hashlib.sha1('{}{}'.format(SECRET, payload)).hexdigest() != checksum:
            return

        Notification(payload=payload).put()

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/incoming', IncomingHandler)

], debug=True)
