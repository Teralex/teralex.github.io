define([
    'backbone'
], function (Backbone) {
    'use strict';

    var ContactsView = Backbone.View.extend({
        className: 'grd-row',
        childrenViews: [],
        initialize: function (options) {
            if (typeof options === 'object') {
                for (var key in options)
                    this[key] = options[key];
            }
            $.getJSON("http://teralex.github.io/scripts/api/base.php", function (data) {
                console.log(data);
            });
            //http://teralex.github.io/css/style.css
            this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            this.$el.empty().html(
                    this['template'] ? this.template(this.model.toJSON()) : 'Template not found!'
                    );
            return this;
        },
        renderNestedView: function (parentSelector, childEl) {
            parentSelector = '#' + parentSelector;

            this.$(parentSelector).html(childEl);
            this.childrenViews.push(childEl);
        }
    });

    return ContactsView;
});