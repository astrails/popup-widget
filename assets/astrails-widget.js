/*
 * Astrails Popup Widget Library
 * http://astrails.com/
 *
 * Copyright (c) 2009 Astrails Ltd
 * Licensed under the MIT license.
 *
 * Revision: 0001
 */
(function(){
		var opts = {
			// put the correct urls without protocol of your javascript here:
			js_url: "assets.astrails.com.s3.amazonaws.com/popup-assests/astrails-widget.js",
			close_image: "assets.astrails.com.s3.amazonaws.com/popup-assests/close.png",
			loading_image: "assets.astrails.com.s3.amazonaws.com/popup-assests/loading.gif",
			button_image: "assets.astrails.com.s3.amazonaws.com/popup-assests/button.png",
			// backgorund css properties
			background_color: "#111",
			iframe_opts: {
				width: 600,
				height: 300,
				top: 50
			},
			// without protocol
			iframe_base_url: "google.com/search"
		};

		//mini framework
		function ce(e) {
			return document.createElement(e);
		}

		function e(el) {
			if (typeof el == "string") {
				return document.getElementById(el);
			}
			return el;
		}

		function r(el) {
			var ee = e(el);
			ee.parentNode.removeChild(ee);
		}

		function h(el) {
			e(el).style.display = "none";
		}

		function s(el) {
			e(el).style.display = "";
		}

		function bind(el, name, func) {
			var ee = e(el);
			if (!ee) return;
			if (ee.addEventListener) {
				ee.addEventListener(name, func, null);
			} 
			else if (ee.attachEvent) {
				ee.attachEvent('on' + name, func);
			}
		}

		function rnd(prefix) {
			var r = parseInt(Math.random() * 100000000000000000);
			if (prefix) {
				return prefix + "_" + r; 
			}
			return r;
		}

		// detecting protocol and parameters
		var protocol = "http://"
		var params_string = "referrer=" + escape(window.location.href);

		var ss = document.getElementsByTagName("script");
		for (var i=0; i<ss.length; i++) {
			if (ss[i].src && "" != ss[i].src) {
				var pos = ss[i].src.indexOf(opts.js_url);
				if (-1 != pos) {
					protocol = ss[i].src.substr(0, pos);
					var extra_params = ss[i].src.substr(pos + opts.js_url.length + 1);
					if ("" != extra_params) {
						params_string += "&" + extra_params;
					}
					break;
				}
			}
		}

		function with_protocol(url) {
			return protocol + url;
		}

		// generating ids
		var ids = {};
		var names = ["background", "container", "loading", "iframe", "close", "open"];
		for (var i=0; i<names.length; i++) {
			ids[names[i]] = rnd("astrails-" + names[i]);
		}

		// general usage functions
		function close_widget() {
			h(ids.container);
			h(ids.background);
			s(ids.loading);
			r(ids.iframe);
		}

		function show_widget() {
			var wi = opts.iframe_opts.width + "px";
			var he = opts.iframe_opts.height + "px";
			var url = with_protocol(opts.iframe_base_url);
			if (params_string && "" != params_string) {
				url += (-1 == url.indexOf("?") ? "?" : "&") + params_string;
			}

			if (!e(ids.container)) {
				var d = ce("div");
				d.setAttribute("id", ids.container);
				document.body.appendChild(d);
				var margin_left = -parseInt(opts.iframe_opts.width/2);
				d.style.cssText = "display:none; overflow:hidden; border:none; margin:0; z-index:10001; position:fixed; margin-left: " + margin_left + "px; top:" + opts.iframe_opts.top + "px; left:50%; width:" + wi + "; height:" + he + "; background:transparent";
				d.innerHTML = '<a id="' + ids.close + '" onclick="return false;" href="javascript:void(0)" style="float:right; border:0;text-decoration:none;padding:0;margin:0"><img src="' + with_protocol(opts.close_image) +'"></a>\
				<div id="' + ids.loading + '" style="text-align:center;color:#fff;font-weight:bold;font-size:22px;font-family:Arial;margin-top:32px;padding:40px 0 20px 0">Loading, please wait...<br/><img src="' + with_protocol(opts.loading_image) + '"></img></div>';
			}

			var html = '<iframe id="' + ids.iframe + '" width="' + wi + '" scrolling="no" height="' + he + '" frameborder="0" style="display:none;height: ' + he + '; width: ' + wi + ';" allowtransparency="true" src="'+ url + '"></iframe>';
			e(ids.container).innerHTML += html;
			bind(ids.iframe, "load", function(){
				h(ids.loading);
				s(ids.iframe);
			});

			s(ids.background);
			s(ids.container);
			bind(ids.close, "click", function(){close_widget(); return false;});
			return false;
		}

		// appending elements on first run
		bind(window, "load", function(){
			var d = ce("div");
			d.setAttribute("id", ids.background);
			document.body.appendChild(d);
			d.style.cssText = "display:none; padding:0; margin:0; z-index:10000; position:fixed; top:0; left:0; width:100%; height:100%; filter:alpha(opacity=60); -moz-opacity:0.6; -khtml-opacity:0.6; opacity:0.6; background:" + opts.background_color;
		});

		if (opts.button_image) {
			document.write("<a style='border:none;text-decoration:none' onclick='return false;' id='" + ids.open + "' href='#'><img src='" + with_protocol(opts.button_image) + "'></a>");
			bind(window, "load", function(){
				bind(ids.open, "click", function(){show_widget(); return false});
			});
		}
		else {
			// put manual binding after this line
			// bind("my_parsed_elelemt_id", "click", function(){show_widget(); return false});
		}
})();
