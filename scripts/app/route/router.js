define(['backbone'], function ( Backbone ) {
    'use strict';

    var modules = {},
        contentEl,
        Router = Backbone.Router.extend({

            routes: {
                '': 'ShowMain',
                'about': 'ShowAbout',
                'contacts': 'ShowContacts'
            },

            initialize: function ( options ) {
                modules = options  || {};

                var sidebarEl = modules.sidebar.get('moduleEl');
                modules.main.renderNestedView('sidebar', sidebarEl);
            },

            // Pages Render
            ShowMain: function () {
                contentEl = contentEl || modules.about.get('moduleEl');
                modules.main.renderNestedView('content', contentEl);
            },
            ShowAbout: function () {
                var tiny = modules.sidebar.get('view').tinySidebar;

                contentEl = modules.about.get('moduleEl');
                modules.main.renderNestedView('content', contentEl);
                if ( !tiny ) modules.sidebar.toggleSidebar();
            },
            ShowContacts: function () {
                var tiny = modules.sidebar.get('view').tinySidebar;

                contentEl = modules.contacts.get('moduleEl');
                modules.main.renderNestedView('content', contentEl);
                if ( !tiny ) modules.sidebar.toggleSidebar();
            },

            // Helpers
            setModuleModel: function ( module, data ) {
                if ( modules[module] ) modules[module].setModel( data );
            },
            simpleLogger: function ( message ) {
                if (console && console.log) console.log(message);
            }
        });

    return Router;
});