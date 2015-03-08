from google.appengine.ext import ndb


class Notification(ndb.Model):
    payload = ndb.StringProperty(required=True, indexed=False)
    created = ndb.DateTimeProperty(auto_now_add=True)
