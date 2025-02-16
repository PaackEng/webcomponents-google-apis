/**
@license
Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at https://polymer.github.io/LICENSE.txt
The complete set of authors may be found at https://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at https://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at https://polymer.github.io/PATENTS.txt
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronJsonpLibraryBehavior } from '@polymer/iron-jsonp-library/iron-jsonp-library.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

/**
Dynamically loads the Google Maps JavaScript API, firing the `api-load` event when ready.

#### Example

    <google-maps-api api-key="abc123" version="3.exp"></google-maps-api>
    <script>
      var mapsAPI = document.querySelector('google-maps-api');
      mapsAPI.addEventListener('api-load', function(e) {
        // this.api === google.maps
      });
    </script>

Any number of components can use `<google-maps-api>` elements, and the library will only be loaded once.

@summary Element wrapper around Google Maps API.
*/
Polymer({

  is: 'google-maps-api',

  /** @override */
  _template: null,

  behaviors: [
    IronJsonpLibraryBehavior
  ],

  properties: {

    /** @private */
    mapsUrl: {
      type: String,
      value: 'https://maps.googleapis.com/maps/api/js?callback=%%callback%%'
    },

    /**
     * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
     */
    apiKey: {
      type: String,
      value: ''
    },

    /**
     * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see developers.google.com/maps/documentation/business/.
     * If set, a Client ID will take precedence over an API Key.
     */
    clientId: {
      type: String,
      value: ''
    },

    /**
     * Version of the Maps API to use.
     */
    version: {
      type: String,
      value: 'beta'
    },

    /**
     * The localized language to load the Maps API with. For more information
     * see https://developers.google.com/maps/documentation/javascript/basics#Language
     *
     * Note: the Maps API defaults to the preffered language setting of the browser.
     * Use this parameter to override that behavior.
     */
    language: {
      type: String,
      value: ''
    },
    /**
     * If true, sign-in is enabled.
     * See https://developers.google.com/maps/documentation/javascript/signedin#enable_sign_in
     */
    signedIn: {
      type: Boolean,
      value: false
    },

    /**
     * Fired when the Maps API library is loaded and ready.
     * @event api-load
     */
    /**
     * Name of event fired when library is loaded and available.
     */
    notifyEvent: {
      type: String,
      value: 'api-load'
    },

    /** @private */
    libraryUrl: {
      type: String,
      computed: '_computeUrl(mapsUrl, version, apiKey, clientId, language, signedIn)'
    }
  },

  _computeUrl: function(mapsUrl, version, apiKey, clientId, language, signedIn) {
    var url = mapsUrl + '&v=' + version;

    // Always load all Maps API libraries.
    url += '&libraries=drawing,geometry,places,visualization,journeySharing';

    if (apiKey && !clientId) {
      url += '&key=' + apiKey;
    }

    if (clientId) {
      url += '&client=' + clientId;
    }

    // Log a warning if the user is not using an API Key or Client ID.
    if (!apiKey && !clientId) {
      var warning = 'No Google Maps API Key or Client ID specified. ' +
          'See https://developers.google.com/maps/documentation/javascript/get-api-key ' +
          'for instructions to get started with a key or client id.';
      console.warn(warning);
    }

    if (language) {
      url += '&language=' + language;
    }

    if (signedIn) {
      url += '&signed_in=' + signedIn;
    }
    return url;
  },

  /**
   * Provides the google.maps JS API namespace.
   */
  get api() {
    return google.maps;
  }
});
