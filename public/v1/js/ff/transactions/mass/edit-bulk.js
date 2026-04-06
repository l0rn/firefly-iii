/*
 * edit-bulk.js
 * Copyright (c) 2019 james@firefly-iii.org
 *
 * This file is part of Firefly III (https://github.com/firefly-iii).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/** global: what */

$(document).ready(function () {
    "use strict";
    initTagsAC();
    initCategoryAC();

    // Source account autocomplete (all account types, for mixed transaction types)
    var sourceAccounts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'api/v1/autocomplete/accounts?query=%QUERY&uid=' + uid,
            wildcard: '%QUERY',
            filter: function (list) {
                return $.map(list, function (item) {
                    return {name: item.name, id: item.id};
                });
            }
        }
    });
    sourceAccounts.initialize();
    $('input[name="source_name"]').typeahead({hint: true, highlight: true}, {
        source: sourceAccounts,
        displayKey: 'name',
        autoSelect: false
    }).on('typeahead:selected typeahead:autocompleted', function (e, datum) {
        $('input[name="source_id"]').val(datum.id);
    });

    // Destination account autocomplete (all account types, for mixed transaction types)
    var destinationAccounts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'api/v1/autocomplete/accounts?query=%QUERY&uid=' + uid,
            wildcard: '%QUERY',
            filter: function (list) {
                return $.map(list, function (item) {
                    return {name: item.name, id: item.id};
                });
            }
        }
    });
    destinationAccounts.initialize();
    $('input[name="destination_name"]').typeahead({hint: true, highlight: true}, {
        source: destinationAccounts,
        displayKey: 'name',
        autoSelect: false
    }).on('typeahead:selected typeahead:autocompleted', function (e, datum) {
        $('input[name="destination_id"]').val(datum.id);
    });

    // on change, remove the checkbox.
    $('input[name="category"]').change(function () {
        $('input[name="ignore_category"]').attr('checked', false);
    });

    $('select[name="budget_id"]').change(function () {

        $('input[name="ignore_budget"]').attr('checked', false);
    });
    $('input[name="tags"]').on('itemAdded', function (event) {
        var isChecked = $('#tags_action_do_nothing').is(':checked');
        if (true === isChecked) {
            $('#tags_action_do_nothing').attr('checked', false);
            $('#tags_action_do_replace').attr('checked', true);
        }

    });

    $('input[name="source_name"]').on('input', function () {
        $('input[name="ignore_source"]').prop('checked', false);
    });

    $('input[name="destination_name"]').on('input', function () {
        $('input[name="ignore_destination"]').prop('checked', false);
    });


});
