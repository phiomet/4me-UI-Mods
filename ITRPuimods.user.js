// ==UserScript==
// @name         ITRPuimods
// @version      0.4
// @description  Tampermonkey script. Modifications for the 4me/ITRP user interface. Works in Firefox and Chrome.
//               Use at your own risk.
// @author       Thomas Volpini
// @grant        none
//
// @updateURL    https://github.com/apa-it/4me-UI-Mods/raw/master/ITRPuimods.user.js
// @downloadURL  https://github.com/apa-it/4me-UI-Mods/raw/master/ITRPuimods.user.js
//
// @include https://*.itrp.at
// @include https://*.itrp.at
// @match   https://*.itrp.at/*
// @match   https://*.itrp.at/*
//
// @include https://*.itrp-qa.at
// @include https://*.itrp-qa.at
// @match   https://*.itrp-qa.at/*
// @match   https://*.itrp-qa.at/*
//
// @include https://*.itrp.com
// @include https://*.itrp.com
// @match   https://*.itrp.com/*
// @match   https://*.itrp.com/*
//
// @include https://*.4me.com
// @include https://*.4me.com
// @match   https://*.4me.com/*
// @match   https://*.4me.com/*
//
// @include https://*.4me-demo.com
// @include https://*.4me-demo.com
// @match   https://*.4me-demo.com/*
// @match   https://*.4me-demo.com/*
//
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$; // Prevent warning by Tampermonkey editor.

    if(true) {
        // Grey-out lines containing "Waiting..." Records.
        $("tr.item.table-row").has("span.waiting-until").css("color","Gainsboro");

        $("tr.item.table-row").has("span.to-do-status").filter(
          function() { return new RegExp(
            "Waiting|Warten|Wachtend|En Attente|Esperando|Aguardando|Aspettando"
            ).test($(this).text());
          }
        ).css("color","Gainsboro");
        // TODO Tickets are also "Waiting for Customer" when the current User is the customer. Tickets should not be greyed out then.
    }


    // Print lines bold where the current user is the assignee
    var currentUser = $("div.avatar").attr("alt");
    $("td.cell-assignment:contains('" + currentUser + "')").closest('tr').find("td").css("font-weight","bold");

    // Highlight lines containing Top impact incidents
    $("tr.item.table-row").has("div.icon-impact-top").css({"color":"red", "background-color" : "rgba(255,0,0, 0.08"});


    // Highlight all Record Identifiers contained in a list.
    // TODO Currently we don't differentiate problems, requests and tasks here. Fix this.
    if (false) {
        var highlightRecords = [1159, 1193, 173002, 179426];
        $("span.record-identifier").filter(function() { return (highlightRecords.includes( parseInt( $(this).text() ))) }).css("color", "green");
    }



    // Gray background for internal comments.
    // This makes it easier to see if a record didn't get a customer-visible comment for some time.
    if (true) {
        function FormatInternalComments() {
            // Adding and checking apaIt_InternalComment is to prevent loops.
            $("div.icon-locked-note").closest("li").find("div.note-content").not(".apaIt_InternalComment")
                .addClass("apaIt_InternalComment")
                .css({"background-color" : "LightGray",
                      "color": "black",
                      "border-bottom-left-radius" : "5px",
                      "border-bottom-right-radius" : "5px",
                      "border-top-left-radius" : "5px",
                      "border-top-right-radius" : "5px"
                     });
        };


        var ListenForDetailsModification = true;

        // Sometimes comments only become visible after the DOM is loaded, e.g. when
        // the user clicks a Request in the Request list and the Request is shown in the detail view on the right.
        $("#details-container").on('DOMSubtreeModified', function() {
            console.log("Details modified");

            if (ListenForDetailsModification) {
                ListenForDetailsModification = false; // prevent recursion

                FormatInternalComments();
                ListenForDetailsModification = true;
            }
        });

        // This call is for internal comments that are immediately visible after the DOM is loaded.
        FormatInternalComments();

    }

    // Hotkeys
    if (true) {

        $(document).bind('keypress', 'e', function() {
            if($(".modal_panel").length > 0) return; // Don't click the edit button when modal panels are visible.

            $("span.icon-edit").click();
        });

        $(document).keyup(function(e){
          if(e.keyCode === 27) { $("div.btn.cancel").click(); } // Binding escape like above doesn't work.
        });
    }
})();
