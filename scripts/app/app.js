define([
    'Router',
    'Main',
    'Sidebar',
    'About',
    'Contacts'
], function ( Router, MainModule, SidebarModule, AboutModule, ContactsModule ) {
    'use strict';

    var initialize = function ( data ) {
        var router = new Router({
            main: MainModule,
            sidebar: SidebarModule,
            about: AboutModule,
            contacts: ContactsModule
        });

        if ( typeof data === 'object' && data.sections ) {
            var key;
            for ( key in data.sections ) {
                if ( data.sections.hasOwnProperty(key) ) router.setModuleModel( key, data.sections[key] );
            }
        }

        Backbone.history.start();
    };

    return {
        initialize: initialize
    }
});