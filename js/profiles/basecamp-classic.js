(function() {
  var BasecampProfile,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BasecampProfile = (function() {
    function BasecampProfile(host1) {
      this.host = host1;
      this.addTimer = bind(this.addTimer, this);
      this.addTimers = bind(this.addTimers, this);
      this.groupNameSelector = "h1";
      this.itemSelector = ".page_header";
      this.platformLoaded = false;
      this.interval = 250;
      this.loadHarvestPlatform();
      window.setInterval(this.addTimers, this.interval);
    }

    BasecampProfile.prototype.loadHarvestPlatform = function() {
      var configScript, ph, platformConfig, platformScript;
      platformConfig = {
        applicationName: "Basecamp",
        permalink: "https://%ACCOUNT_ID%.basecamphq.com/projects/%GROUP_ID%/todo_items/%ITEM_ID%/comments"
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

    BasecampProfile.prototype.addTimers = function() {
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

    BasecampProfile.prototype.addTimer = function(item) {
      var data;
      data = this.getDataForTimer(item);
      if (this.isTodoCompleted(item) || this.notEnoughInfo(data)) {
        return;
      }
      this.buildTimer(item, data);
      return this.notifyPlatformOfNewTimers();
    };

    BasecampProfile.prototype.getDataForTimer = function(item) {
      var groupName, itemName, link, linkParts;

      itemName = ( item.querySelector("a[title]") || item.querySelector("a") ).innerText;

      groupNameHTML = document.querySelector(this.groupNameSelector).innerHTML;
      groupNameMatch = groupNameHTML.match(/.+?(?= <)/);
      groupName = groupNameMatch[0];

      link = item.querySelector("a").getAttribute("href") || "";
      linkParts = link.match(/^\/projects\/(\S+)(?:\S+)?\/todo_lists\/(\d+)/);

      accountId = window.location.hostname.match(/.+?(?=.basecamphq.com)/);

      itemIdSplit = window.location.href.split('/todo_items/');
      itemId = itemIdSplit[1].replace('\/comments', '');

      itemSubTitle = item.querySelector(".item").innerText || "";
      itemSubTitle = itemSubTitle.match(/(?:\*+)?:.+?(?= Due )/);
      itemTitle = itemName + itemSubTitle;

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
          name: itemTitle
        }
      };

      // console.log( 'retArr', retArr );

      return retArr;
    };

    BasecampProfile.prototype.isTodoCompleted = function(item) {
      if (item.webkitMatchesSelector(".complete")) {
        return true;
      } else if (item.parentNode && item.parentNode !== document) {
        return this.isTodoCompleted(item.parentNode);
      }
    };

    BasecampProfile.prototype.notEnoughInfo = function(data) {
      var ref, ref1;
      return !(((data != null ? (ref = data.group) != null ? ref.id : void 0 : void 0) != null) && ((data != null ? (ref1 = data.item) != null ? ref1.id : void 0 : void 0) != null));
    };

    BasecampProfile.prototype.buildTimer = function(item, data) {
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

    BasecampProfile.prototype.notifyPlatformOfNewTimers = function() {
      var evt;
      evt = new CustomEvent("harvest-event:timers:chrome:add");
      return document.querySelector("#harvest-messaging").dispatchEvent(evt);
    };

    return BasecampProfile;

  })();

  chrome.runtime.sendMessage({
    type: "getHost"
  }, function(host) {
    return new BasecampProfile(host);
  });

}).call(this);
