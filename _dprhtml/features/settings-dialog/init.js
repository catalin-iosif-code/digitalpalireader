'use strict';

class SettingsDialogTabsViewModel {
  constructor() {
    this.isGeneralSettingsTabSelected = ko.observable(true);
    this.isLayoutSettingsTabSelected = ko.observable(false);
    this.isTextSettingsTabSelected = ko.observable(false);

    this.settings = this.createSettings();
  }

  createSettings() {
    return Object
      .entries(DPR_prefsInfo)
      .reduce((acc, [k, v]) => {
          acc[k] = ko.observable(getPref(k));
          return acc;
        },
        {});
  }

  savePreferences() {
    Object
      .entries(DPR_prefsInfo)
      .forEach(([k, v]) => {
          localStorage[`DPR_Prefs_${k}_type`] = v.type;
          localStorage[`DPR_Prefs_${k}`] = this.settings[k]();
          DPR_prefs['colfont'] = this.settings[k]();
        });

    window.location.reload();
  }

  defaultPreferences() {
    Object
      .entries(DPR_prefsInfo)
      .forEach(([k, v]) => {
          this.settings[k](DPR_prefsD[k]);
        });
  }

  cancelPreferences() {
    Object
      .entries(DPR_prefsInfo)
      .forEach(([k, v]) => {
          this.settings[k](DPR_prefs[k]);
        });
  }

  updateActiveSettingsTabId(tabId) {
    Object
      .entries(this)
      .filter(([n, _]) => n.indexOf("TabSelected") !== -1)
      .forEach(([_, fn]) => fn(false));

    this[`is${tabId}SettingsTabSelected`](true);
  }

  updateActiveSettingsTab(_, event) {
    this.updateActiveSettingsTabId($(event.currentTarget).data("tabid"));
  }
}
