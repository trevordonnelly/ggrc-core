/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC, CMS) {
  'use strict';

  can.Component.extend('mapperResultsColumnsConfiguration', {
    tag: 'mapper-results-columns-configuration',
    template: can.view(
      GGRC.mustache_path +
      '/components/unified-mapper/mapper-results-columns-configuration.mustache'
    ),
    viewModel: {
      modelType: '',
      selectedColumns: [],
      availableColumns: [],
      columns: {},
      displayPrefs: null,
      init: function () {
        var self = this;
        this.initializeColumns();
        CMS.Models.DisplayPrefs.getSingleton().then(function (displayPrefs) {
          self.attr('displayPrefs', displayPrefs);
        });
      },
      getModel: function () {
        return CMS.Models[this.attr('modelType')];
      },
      initializeColumns: function () {
        var selectedColumns = can.makeArray(this.attr('selectedColumns'));
        var availableColumns = can.makeArray(this.attr('availableColumns'));
        var columns = new can.Map();
        availableColumns
          .forEach(function (attr) {
            var value = {};
            value[attr.attr_name] = selectedColumns
              .some(function (selectedAttr) {
                return selectedAttr.attr_name === attr.attr_name;
              });
            columns.attr(value);
          });
        this.attr('columns', columns);
      },
      onSelect: function (attr) {
        var columns = this.columns;
        var value = {};
        value[attr.attr_name] = !columns[attr.attr_name];
        this.columns.attr(value);
      },
      isSelected: function (attr) {
        var columns = this.attr('columns');
        return columns[attr.attr_name];
      },
      setColumns: function () {
        var selectedNames = [];
        var columns;

        can.each(this.attr('columns'), function (v, k) {
          if (v) {
            selectedNames.push(k);
          }
        });

        columns =
          GGRC.Utils.TreeView.setColumnsForModel(
            this.getModel().model_singular,
            selectedNames,
            this.attr('displayPrefs')
          );

        this.attr('selectedColumns', columns.selected);
      },
      stopPropagation: function (context, el, ev) {
        ev.stopPropagation();
      }
    },
    events: {
      '{viewModel} availableColumns': function () {
        this.viewModel.initializeColumns();
      },
      '{viewModel} selectedColumns': function () {
        this.viewModel.initializeColumns();
      }
    }
  });
})(window.can, window.GGRC, window.CMS);
