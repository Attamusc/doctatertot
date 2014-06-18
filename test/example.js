define([
  'jquery',
  'nbd/util/construct',
  '../Component',
  '../Controller',
  '../trait/eventMappable'
], function($, construct, Component, Controller, eventMappable) {
  'use strict';

  /**
   * Manages a DOM region that contains a list of Controllers for each item
   *
   * @module Container
   * @mixes eventMappable
   */
  return Component.extend({
    /**
     * The controller class constructed for each item in the container
     * Defaults to the base BeFF/Controller unless overridden
     *
     * @memberOf Container
     * @type BeFF/Controller
     */
    Controller: Controller,

    /**
     * @constructs Container
     *
     * @param {$} $view The "container" element that should be managed
     */
    init: function($view) {
      this.$view = $view;
    },

    /**
     * Sets up event delegation and constructs controllers for
     * the existing children within the $view
     *
     * @memberOf Container
     */
    bind: function() {
      this._mapEvents();
      this._nodes = this.$view.children().toArray()
      .map(this.decorate, this);
    },

    /**
     * Destroys delegation bindings
     *
     * @memberOf Container
     */
    unbind: function() {
      this._undelegateEvents();
    },

    /**
     * Constructs an instance of the controller with the passed args
     *
     * @memberOf Container
     * @return {BeFF/Controller} An instance of the controller
     */
    decorate: function () {
      return construct.apply(this.Controller, arguments);
    },

    /**
     * Constructs a controller for every element of the resultset
     * and renders the controller into the managed $view
     *
     * @memberOf Container
     *
     * @param {Array} resultset A list of JSON objects representing new items in the container
     *
     * @return {Array} A list of the newly constructed controllers rendered into $view
     */
    add: function(resultset) {
      var nodes = resultset.map(this.decorate, this).filter(Boolean);

      nodes.forEach(function(node) {
        return node.render && node.render(this.$view);
      }, this);

      this._nodes = this._nodes.concat(nodes);

      return nodes;
    },

    /**
     * Destroys all of the managed controllers and empties
     * the managed $view
     *
     * @memberOf Container
     *
     * @return {$} The newly emptied $view
     */
    empty: function() {
      this._nodes.forEach(function(item) {
        return item && item.destroy && item.destroy();
      });
      this._nodes = [];
      return this.$view.empty();
    },

    /**
     * @memberOf Container
     *
     * @return {Boolean} Whether or not there are any managed controllers
     */
    isEmpty: function() {
      return !this._nodes.length;
    }
  }, {
    /**
     * Destroys all of the managed controllers and empties
     * the managed $view
     *
     * @static
     * @return {$} The newly emptied $view
     */
    init: function() {},

    /**
     * Destroys all of the managed controllers and empties
     * the managed $view
     *
     * @static
     * @return {$} The newly emptied $view
     */
    foo: function() {}
  })
  .mixin(eventMappable);
});
