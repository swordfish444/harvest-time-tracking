(function() {
  var CodebaseProfile,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CodebaseProfile = (function() {
    function CodebaseProfile(host1) {
      this.host = host1;
      this.addTimer = bind(this.addTimer, this);
      this.addTimers = bind(this.addTimers, this);
      this.groupNameSelector = ".site-header__title a";
      this.itemSelector = ".Thread__subject";
      this.platformLoaded = false;
      this.interval = 250;
      this.loadHarvestPlatform();
      window.setInterval(this.addTimers, this.interval);
    }

    CodebaseProfile.prototype.loadHarvestPlatform = function() {
      var configScript, ph, platformConfig, platformScript;
      platformConfig = {
        applicationName: "Codebase",
        permalink: "https://%ACCOUNT_ID%.codebasehq.com/projects/%GROUP_ID%/tickets/%ITEM_ID%"
      };
      configScript = document.createElement("script");
      configScript.innerHTML = "window._harvestPlatformConfig = " + (JSON.stringify(platformConfig)) + ";";
      platformScript = document.createElement("script");
      platformScript.src = this.host + "/assets/platform.js";
      platformScript.async = true;
      ph = document.getElementsByTagName("script")[0];
      ph.parentNode.insertBefore(configScript, ph);
      ph.parentNode.insertBefore(platformScript, ph);
      return document.body.addEventListener("harvest-event:ready", (function(_this) {
        return function() {
          _this.platformLoaded = true;
          return _this.addTimers();
        };
      })(this));
    };

    CodebaseProfile.prototype.addTimers = function() {
      var i, item, items, len, results;
      if (!this.platformLoaded) {
        return;
      }
      items = document.querySelectorAll(this.itemSelector);
      results = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        if (!item.querySelector(".harvest-timer")) {
          results.push(this.addTimer(item));
        }
      }
      return results;
    };

    CodebaseProfile.prototype.addTimer = function(item) {
      var data;
      data = this.getDataForTimer(item);
      if (this.isTodoCompleted(item) || this.notEnoughInfo(data)) {
        return;
      }
      this.buildTimer(item, data);
      return this.notifyPlatformOfNewTimers();
    };

    CodebaseProfile.prototype.getDataForTimer = function(item) {
      var groupName, itemName, link, linkParts;

      itemName = item.innerText;

      groupName = document.querySelector(this.groupNameSelector).innerHTML;

      linkParts = window.location.href.match(/\/projects\/(\S+)(?:\S+)?\/tickets\/(\d+)/);

      accountId = window.location.hostname.match(/.+?(?=.codebasehq.com)/);

      itemIdSplit = window.location.href.split('/tickets/');
      itemId = itemIdSplit[1];

      retArr = {
        account: {
          id: accountId[0]
        },
        group: {
          id: linkParts[1],
          name: groupName
        },
        item: {
          id: itemId,
          name: itemName
        }
      };

      console.log( 'retArr', retArr );

      return retArr;
    };

    CodebaseProfile.prototype.isTodoCompleted = function(item) {
      if (item.webkitMatchesSelector(".complete")) {
        return true;
      } else if (item.parentNode && item.parentNode !== document) {
        return this.isTodoCompleted(item.parentNode);
      }
    };

    CodebaseProfile.prototype.notEnoughInfo = function(data) {
      var ref, ref1;
      return !(((data != null ? (ref = data.group) != null ? ref.id : void 0 : void 0) != null) && ((data != null ? (ref1 = data.item) != null ? ref1.id : void 0 : void 0) != null));
    };

    CodebaseProfile.prototype.buildTimer = function(item, data) {
      var timer;
      timer = document.createElement("div");
      timer.className = "harvest-timer";
      timer.style.marginRight = "4px";
      timer.setAttribute("id", "harvest-basecamp-timer-" + data.item.id);
      timer.setAttribute("data-account", JSON.stringify(data.account));
      timer.setAttribute("data-group", JSON.stringify(data.group));
      timer.setAttribute("data-item", JSON.stringify(data.item));
      return item.insertBefore(timer, item.children[0]);
    };

    CodebaseProfile.prototype.notifyPlatformOfNewTimers = function() {
      var evt;
      evt = new CustomEvent("harvest-event:timers:chrome:add");
      return document.querySelector("#harvest-messaging").dispatchEvent(evt);
    };

    return CodebaseProfile;

  })();

  chrome.runtime.sendMessage({
    type: "getHost"
  }, function(host) {
    return new CodebaseProfile(host);
  });

}).call(this);
