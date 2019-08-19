from django.contrib import admin

from api.models import Card, Collection, Visitor


class CardAdmin(admin.ModelAdmin):
    fields = ('id', 'question', 'answer', 'visitor')
    list_display = ('question', 'answer', 'visitor')
    raw_id_fields = ('visitor',)


class CollectionAdmin(admin.ModelAdmin):
    fields = ('id', 'name', 'cards', 'visitor')
    list_display = ('name', 'visitor')
    raw_id_fields = ('cards', 'visitor')


class VisitorAdmin(admin.ModelAdmin):
    fields = ('id', 'ip_address',)
    list_display = ('ip_address',)


admin.site.register(Card, CardAdmin)
admin.site.register(Collection, CollectionAdmin)
admin.site.register(Visitor, VisitorAdmin)
