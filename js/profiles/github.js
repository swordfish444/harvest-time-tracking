(function() {
  var GithubProfile, injectScript;

  injectScript = function(opts) {
    var name, ph, script, value;
    script = document.createElement("script");
    switch (typeof opts) {
      case "object":
        for (name in opts) {
          value = opts[name];
          script[name] = value;
        }
        break;
      case "string":
        script.innerHTML = opts;
    }
    ph = document.getElementsByTagName("script")[0];
    return ph.parentNode.insertBefore(script, ph);
  };

  GithubProfile = (function() {
    function GithubProfile(host1) {
      this.host = host1;
      this.listen();
      this.infect();
    }

    GithubProfile.prototype.platformConfig = function() {
      return {
        applicationName: "GitHub",
        permalink: "https://github.com/%ACCOUNT_ID%/%GROUP_ID%/issues/%ITEM_ID%"
      };
    };

    GithubProfile.prototype.listen = function() {
      document.body.addEventListener("harvest-event:ready", (function(_this) {
        return function() {
          return _this.addTimerIfOnIssue();
        };
      })(this));
      return window.addEventListener("message", (function(_this) {
        return function(event) {
          var ref;
          if (((ref = event.data) != null ? ref.type : void 0) !== 'harvest:change') {
            return;
          }
          return _this.addTimerIfOnIssue();
        };
      })(this));
    };

    GithubProfile.prototype.infect = function() {
      injectScript("window._harvestPlatformConfig = " + (JSON.stringify(this.platformConfig())) + ";");
      injectScript({
        src: this.host + "/assets/platform.js",
        async: true
      });
      return injectScript("(" + this.changeMonitor + ")();");
    };

    GithubProfile.prototype.changeMonitor = function() {
      var handler;
      handler = function() {
        return window.postMessage({
          type: 'harvest:change'
        }, "*");
      };
      return $(document).on('pjax:end', handler).ajaxComplete(handler);
    };

    GithubProfile.prototype.addTimerIfOnIssue = function() {
      var _, account, group, issueOrPull, item, ref;
      ref = window.location.pathname.split("/"), _ = ref[0], account = ref[1], group = ref[2], issueOrPull = ref[3], item = ref[4];
      if (!(item && (issueOrPull === "issues" || issueOrPull === "pull"))) {
        return;
      }
      return this.addTimer({
        item: {
          id: item,
          name: "#" + item + ": " + (this.issueTitle())
        },
        group: {
          id: group,
          name: group
        },
        account: {
          id: account
        }
      });
    };

    GithubProfile.prototype.issueTitle = function() {
      return document.querySelector('.js-issue-title').innerText;
    };

    GithubProfile.prototype.addTimer = function(data) {
      var button, formActions, i, len, ref, timer, toolbar;
      ref = document.querySelectorAll('.harvest-timer');
      for (i = 0, len = ref.length; i < len; i++) {
        timer = ref[i];
        timer.remove();
      }
      button = this.createButton(data);
      button.classList.add('btn-sm');
      toolbar = document.querySelector("div.gh-header-actions");
      if (toolbar != null) {
        toolbar.insertBefore(button, toolbar.children[0]);
      }
      button = this.createButton(data);
      formActions = document.querySelector('#partial-new-comment-form-actions');
      if (formActions != null) {
        formActions.appendChild(button);
      }
      return this.notifyPlatformOfNewTimers();
    };

    GithubProfile.prototype.createButton = function(data) {
      var button, i, len, name, ref;
      button = document.createElement("button");
      button.type = "button";
      button.className = "harvest-timer btn";
      button.setAttribute("data-skip-styling", "true");
      button.innerHTML = "<svg aria-hidden=\"true\" class=\"octicon octicon-clock\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 14 16\" width=\"14\"><path d=\"M8 8h3v2H7c-0.55 0-1-0.45-1-1V4h2v4z m-1-5.7c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z\"></path></svg>\nTrack time";
      ref = ['account', 'group', 'item'];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        button.setAttribute("data-" + name, JSON.stringify(data[name]));
      }
      return button;
    };

    GithubProfile.prototype.notifyPlatformOfNewTimers = function() {
      var evt, ref;
      evt = new CustomEvent("harvest-event:timers:chrome:add");
      return (ref = document.querySelector("#harvest-messaging")) != null ? ref.dispatchEvent(evt) : void 0;
    };

    return GithubProfile;

  })();

  chrome.runtime.sendMessage({
    type: "getHost"
  }, function(host) {
    return new GithubProfile(host);
  });

}).call(this);
