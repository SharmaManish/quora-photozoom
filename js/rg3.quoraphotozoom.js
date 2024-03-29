/**
 * RG3 Photo Zoom for Facebook
 * Author: Regis Gaughan, III
 * Email:  regis.gaughan@gmail.com
 * Web:    http://regisgaughan.com
 * (c) Copyright 2012. All Right Reserved
 */
RG3.phototip = function (a) {
    return this.init(a)
};
RG3.phototip.prototype = {
    options: {
        padding: 5,
        offset: 10,
        gutter: 20,
        opacity: 1,
        delay: 0,
        fadeInDuration: 250,
        fadeOutDuration: 250
    },
    setOptions: function (a) {
        RG3.util.setOptions(this.options, a);
        if (this.tooltip && this.tooltip.style.opacity > 0) {
            this.setOpacity()
        }
    },
    init: function (a) {
        this.setOptions(a);
        this.waitingRoom = document.body.appendChild(RG3.util.newElement("div", {
            "class": "rg3fbpz-waitingroom",
            styles: {
                height: "0px",
                width: "0px",
                position: "absolte",
                top: "-10px",
                left: "-10px",
                overflow: "hidden",
                visibility: "hidden"
            }
        }));
        var b = (this.options.fadeInDuration / 1000) + "s";
        this.tooltip = document.body.appendChild(RG3.util.newElement("div", {
            "class": "rg3fbpz-tooltip",
            styles: {
                opacity: 0,
                MozTransitionDuration: b,
                WebkitTransitionDuration: b,
                TransitionDuration: b,
                padding: this.options.padding + "px"
            }
        }));
        this.tooltipImg;
        this.tooltipTitle = this.tooltip.appendChild(RG3.util.newElement("div", {
            "class": "rg3fbpz-title"
        }));
        this.currentSrc = "";
        this.open = false;
        this.opening = false;
        this.hiding = false;
        this.coords = null;
        this.binds = {
            onImgLoad: RG3.util.bind(this, this.onImgLoad),
            onImgError: RG3.util.bind(this, this.onImgError),
            onImgReady: RG3.util.bind(this, this.onImgReady),
            setOpacity: RG3.util.bind(this, this.setOpacity),
            onMouseMove: RG3.util.bind(this, this.onMouseMove),
            onHidden: RG3.util.bind(this, this.onHidden)
        };
        this.spacer = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw%3D%3D";
        RG3.util.addEvent(document.body, "mousemove", this.binds.onMouseMove)
    },
    newImage: function (c, b) {
        var a = this.getImgBySrc(c);
        if (!a) {
            a = RG3.util.newElement("img", {
                title: b || null,
                "class": "rg3fbpz-image",
                styles: {
                    position: "relative",
                    "z-index": 2
                }
            });
            this.waitingRoom.appendChild(a);
            RG3.util.addEvent(a, "load", this.binds.onImgLoad);
            RG3.util.addEvent(a, "error", this.binds.onImgError);
            a.src = c
        }
        return a
    },
    getImgBySrc: function (a) {
        return this.waitingRoom.querySelector('img[src^="' + a + '"]') || (this.tooltipImg && this.tooltipImg.src == a && this.tooltipImg)
    },
    setOpacity: function () {
        if (this.tooltip) {
            var a = (this.options.fadeInDuration / 1000) + "s";
            RG3.util.setStyles(this.tooltip, {
                MozTransitionDuration: a,
                WebkitTransitionDuration: a,
                TransitionDuration: a,
                opacity: this.options.opacity
            })
        }
    },
    setPosition: function () {
        var c, f = this.coords,
            g, b = "auto",
            h = {
                x: window.scrollX,
                y: window.scrollY
            }, a = false,
            i, d, e;
        if ((this.open || this.opening) && f) {
            g = (f.y + h.y - (this.tooltip.offsetHeight / 2));
            b = (f.x + h.x + this.options.offset);
            if (this.tooltipImg && this.tooltipImg.getAttribute("loaded") == "loaded") {
                e = {
                    x: document.body.clientWidth,
                    y: document.body.clientHeight
                };
                d = {
                    x: this.tooltipImg.naturalWidth,
                    y: this.tooltipImg.naturalHeight
                };
                i = ((f.x + this.options.offset) + (d.x + (this.options.padding * 2))) < e.x - this.options.gutter;
                if (!i) {
                    a = f.x - this.options.offset - (d.x + (this.options.padding * 2)) > this.options.gutter
                }
                if (i || a) {
                    RG3.util.setStyles(this.tooltipImg, {
                        width: "auto",
                        height: "auto"
                    })
                }
                if (!i && a) {
                    b = (f.x + h.x) - this.options.offset - (d.x + (this.options.padding * 2))
                } else {
                    if (!i && !a) {
                        if (f.x <= (e.x / 2)) {
                            RG3.util.setStyles(this.tooltipImg, {
                                width: (e.x - (f.x + this.options.offset + (this.options.padding * 2) + this.options.gutter)) + "px",
                                height: "auto"
                            })
                        } else {
                            b = h.x + this.options.gutter;
                            RG3.util.setStyles(this.tooltipImg, {
                                width: (f.x - this.options.offset - (this.options.padding * 2) - this.options.gutter) + "px",
                                height: "auto"
                            })
                        }
                    }
                }
                if (g > window.innerHeight + window.scrollY - this.tooltip.offsetHeight - this.options.gutter) {
                    g = window.innerHeight + window.scrollY - this.tooltip.offsetHeight - this.options.gutter
                }
                if (g < window.scrollY + this.options.gutter) {
                    g = window.scrollY + this.options.gutter;
                    if (this.tooltip.offsetHeight > window.innerHeight - (this.options.gutter * 2)) {
                        RG3.util.setStyles(this.tooltipImg, {
                            height: (window.innerHeight - (this.options.padding * 2) - (this.options.gutter * 2)) + "px",
                            width: "auto"
                        });
                        i = ((f.x + this.options.offset) + this.tooltip.offsetWidth) < e.x - this.options.gutter;
                        if (i) {
                            b = (f.x + h.x) + this.options.offset
                        } else {
                            b = (f.x + h.x) - this.tooltip.offsetWidth - this.options.offset
                        }
                    }
                }
            }
            RG3.util.setStyles(this.tooltip, {
                top: parseInt(g) + "px",
                left: parseInt(b) + "px"
            })
        }
    },
    onMouseMove: function (a) {
        this.coords = {
            x: a.clientX,
            y: a.clientY
        };
        if (this.open || this.opening) {
            this.setPosition()
        }
    },
    start: function (a) {
        this.resetImg();
        this.opening = true;
        this.setImg(a.src, a.title);
        this.show()
    },
    reloadTitle: function () {
        RG3.util.setProperty(this.tooltipTitle, "html", this.tooltipImg.title)
    },
    resetImg: function () {
        if (this.tooltipImg) {
            this.waitingRoom.appendChild(this.tooltipImg)
        }
        this.currentSrc = "";
        this.tooltipImg = null;
        setTimeout(RG3.util.bind(this, function () {
            this.setPosition()
        }), 0)
    },
    setImg: function (b, a) {
        RG3.util.setProperty(this.tooltipTitle, "text", "");
        this.currentSrc = b;
        this.tooltipImg = this.newImage(b, a);
        if (this.tooltipImg.getAttribute("loaded") == "loaded") {
            this.setTooltipImg(this.tooltipImg)
        }
    },
    onImgLoad: function (b) {
        var a = RG3.util.getEventTarget(b);
        proxy.log("info", "Photo Loaded.", {
            src: a.src
        });
        RG3.util.getEventTarget(b).setAttribute("loaded", "loaded");
        this.setTooltipImg(a)
    },
    onImgError: function (b) {
        var a = RG3.util.getEventTarget(b);
        proxy.log("error", "Photo Error", {
            src: a.src
        });
        this.hide()
    },
    setTooltipImg: function (a) {
        if ((this.open || this.opening) && a.src.indexOf(this.currentSrc) === 0) {
            if (!a.naturalWidth || a.naturalWidth <= 0) {
                this.waitingRoom.removeChild(a);
                this.tooltipImg = this.newImage(this.currentSrc + "?force=" + (new Date().getTime()), this.tooltipImg.title)
            } else {
                if (a.getAttribute("avoid") == "avoid" || (a.naturalWidth == 1 && a.naturalHeight == 1)) {
                    a.setAttribute("avoid", "avoid");
                    setTimeout(RG3.util.bind(this, function () {
                        this.hide()
                    }), 0)
                } else {
                    setTimeout(RG3.util.bind(this, function () {
                        this.tooltip.appendChild(this.tooltipImg);
                        this.reloadTitle();
                        this.setPosition()
                    }), 0)
                }
            }
        }
    },
    show: function () {
        if (this.showInterval) {
            clearInterval(this.showInterval)
        }
        if (this.hideInterval) {
            clearInterval(this.hideInterval)
        }
        this.opening = true;
        this.setPosition();
        this.hiding = false;
        this.showInterval = setTimeout(RG3.util.bind(this, function () {
            this.open = true;
            this.opening = false;
            this.setPosition();
            this.binds.setOpacity()
        }), (this.open ? 0 : this.options.delay))
    },
    hide: function () {
        if (this.hideInterval) {
            clearInterval(this.hideInterval)
        }
        this.hiding = true;
        this.opening = false;
        var a = (this.options.fadeOutDuration / 1000) + "s";
        RG3.util.setStyles(this.tooltip, {
            MozTransitionDuration: a,
            WebkitTransitionDuration: a,
            TransitionDuration: a,
            opacity: 0
        });
        this.hideInterval = setTimeout(this.binds.onHidden, this.options.fadeOutDuration + 100);
        if (this.showInterval) {
            clearInterval(this.showInterval)
        }
        RG3.util.setProperty(this.tooltipTitle, "html", "")
    },
    onHidden: function () {
        this.open = false;
        this.opening = false;
        this.hiding = false;
        this.resetImg();
        this.hidingSrc = null
    }
};
RG3.fbPhotoZoom = function (a) {
    return this.init(a)
};
RG3.fbPhotoZoom.prototype = {
    options: {
        name: null,
        version: null,
        id: null,
        enabled: true,
        showCaptions: true,
        disableTheater: false,
        enableShortcut: 90,
        openShortcut: 88,
        forceZoomKey: -1,
        forceHideKey: -1,
        loading: RG3.util.newElement("img", {
            src: "data:image/gif;base64,R0lGODlhEAALAPQAAP///6NGnfHj8O3c7Pbv9qVKn6NGnbNnrtGkzsWLweXM5K9eqb17udSp0caOw%2BfP5bBhq6RInr5%2BuvXs9PDi7/r2%2BrdusvHl8fn1%2BeTJ4ty52uvY6vjy9wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh%2BQQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5%2By967tYLyicBYE7EYkYAgAh%2BQQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh%2BQQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ%2BYrBH%2BhWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C%2B4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc%2Bl4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa%2BkEAA7AAAAAAAAAAAA"
        })
    },
    init: function (a) {
        RG3.util.setOptions(this.options, a);
        this.injectCSS();
        this["name"] = this.options.name;
        this.tooltip = new RG3.phototip(a);
        this.currentImg = null;
        this.icon = null;
        this.icons = {
            on: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXFJREFUeNpi%2FP%2F%2FPwMymDJlyv9Xr14xEAPExMQYWI6cf4ostgOkuaioiEFAQACv5g8fPjD09fUxsGCTBGnObNiE14DpDX5gmgnZdmwKmZgYGcK9dBnKU20Z%2BHjYMeUJ%2BdNAQ5LBwUyRQUFakMFcXxanATtwGcDDzQZn83Kxke6CD59%2BwNnvPn7HasAOfAZcuf2S4c%2Fff2D2hRvPMeRZbl8%2BZPT%2B%2FXusmrk52RjcbVQYWJghDg1w1mJYt%2Fsqw6cvPxEGgDRHhIcz8PDwggV6ulrANCjggly1GFhZmeGKzfVlGIx1pBh2HLqNMAAcUEDNPfOPMHBxsMITCSjqsAGQa3wc1cFq4AbAgJOFEsOpn2LgFEZ0UkYW%2BP7jN4OJbcDrbYduMZQk2jDMmTuHwczO%2FxwuA2wMpT3gBihICTAoyggCUx4Tg6q8MCHLPVDC4MuXzwwh7jpwWX8nTbAYPo1wAwQFBRlWrFyJ1RqQHC6NMAAQYADaHmfCJgAfvAAAAABJRU5ErkJggg%3D%3D",
            off: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZdJREFUeNpi%2Bf%2F%2FPwMymDJlyv9Xr14xEAPExMQYWI6cf4ostgOkuaioiEFAQACv5g8fPjD09fUxsGCTBGnObNiE14DpDX5gmgnZdmwKmZgYGcK9dBnKU20Z%2BHjYMeUJ%2BdNAQ5LBwUyRQUFakMFcXxanATtwGcDDzQZn83Kxke6CD59%2BwNnvPn7HasAOfAZcuf2S4c%2Fff2D2hRvPMeRZbl8%2BZPT%2B%2FXusmrk52RjcbVQYWJghDg1w1mJYt%2Fsqw6cvPxGKeidMffX0%2BZtXHz%2F%2FBOPa2tr%2FILBi66X%2Fv379%2BY8Mjjg5%2Fd%2FAwADHixUU%2FoPTAQ8PL0PP%2FCMMXBys8EQCijp08GbfPgZ%2FYMrdyMgIp1ESkpOFEsOpn2LgFIYNGAMxsmZwGCAr%2BP7jN4OJbcDrbYduMZQk2jDMmTuHwczO%2FxxM%2Fm1zsztOFyhICTAoyggCUx4Tg6q8MFYXsOgavQFqEmGAugQUg2ADvnz5zBDirgNX6O%2BkCRZDB38unxPFMFRQUJBhxcqVWG0EyYGAjaG0B5iBlvVBACDAAHFtphFIakqbAAAAAElFTkSuQmCC"
        };
        this.overrideZoom = false;
        this.overrideHide = false;
        this.ctrlDown = false;
        this.shiftDown = false;
        this.mouseDown = false;
        RG3.util.addEvent(document.body, "drag", RG3.util.bind(this, this.onMouseDrag));
        RG3.util.addEvent(document.body, "dragstart", RG3.util.bind(this, this.onMouseDown));
        RG3.util.addEvent(document.body, "dragend", RG3.util.bind(this, this.onMouseUp));
        RG3.util.addEvent(document.body, "mousedown", RG3.util.bind(this, this.onMouseDown));
        RG3.util.addEvent(document.body, "mouseup", RG3.util.bind(this, this.onMouseUp));
        RG3.util.addEvent(document.body, "mousemove", RG3.util.bind(this, this.onMouseMove));
        RG3.util.addEvent(document.body, "mousewheel", RG3.util.bind(this, this.onMouseMove));
        RG3.util.addEvent(document, "keydown", RG3.util.bind(this, this.onKeyDown));
        RG3.util.addEvent(document, "keyup", RG3.util.bind(this, this.onKeyUp));
        RG3.util.addEvent(document.body, "click", RG3.util.bind(this, this.onBodyClick));
        this.createAppIcon();
        return this
    },
    injectCSS: function () {
        var a = '.rg3fbpz-tooltip {position:absolute; overflow:hidden; font-size:0; -moz-box-shadow:0px 0px 10px rgba(0,0,0,1); -webkit-box-shadow:0px 0px 10px rgba(0,0,0,1); box-shadow:0px 0px 10px rgba(0,0,0,1); min-height:50px; min-width:50px; pointer-events:none; background:#FFF url(data:image/gif;base64,R0lGODlhEAALALMMAOXp8a2503CHtOrt9L3G2+Dl7vL0+J6sy4yew1Jvp/T2+e/y9v///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCwAMACwAAAAAEAALAAAEK5DJSau91KxlpObepinKIi2kyaAlq7pnCq9p3NZ0aW/47H4dBjAEwhiPlAgAIfkECQsADAAsAAAAAAQACwAABA9QpCQRmhbflPnu4HdJVAQAIfkECQsADAAsAAAAABAACwAABDKQySlSEnOGc4JMCJJk0kEQxxeOpImqIsm4KQPG7VnfbEbDvcnPtpINebJNByiTVS6yCAAh+QQJCwAMACwAAAAAEAALAAAEPpDJSaVISVQWzglSgiAJUBSAdBDEEY5JMQyFyrqMSMq03b67WY2x+uVgvGERp4sJfUyYCQUFJjadj3WzuWQiACH5BAkLAAwALAAAAAAQAAsAAAQ9kMlJq73hnGDWMhJQFIB0EMSxKMoiFcNQmKjKugws0+navrEZ49S7AXfDmg+nExIPnU9oVEqmLpXMBouNAAAh+QQFCwAMACwAAAAAEAALAAAEM5DJSau91KxlpOYSUBTAoiiLZKJSMQzFmjJy+8bnXDMuvO89HIuWs8E+HQYyNAJgntBKBAAh+QQFFAAMACwMAAIABAAHAAAEDNCsJZWaFt+V+ZVUBAA7) no-repeat center center; z-index:99999;}.rg3fbpz-tooltip * {color:#333 !important; font-size:11px !important; font-family:"lucida grande",tahoma,verdana,arial,sans-serif !important;}.rg3fbpz-tooltip {-moz-transition:opacity 0s ease-in-out; -webkit-transition:opacity 0s ease-in-out; transition:opacity 0s ease-in-out;}.rg3fbpz-title:empty {bottom:-20px; height:0px; min-height:0px; -moz-transition:bottom 0s ease-in-out; -webkit-transition:bottom 0s ease-in-out; transition:bottom 0s ease-in-out;}.rg3fbpz-title {-moz-transition:bottom 0.33s ease-in-out; -webkit-transition:bottom 0.33s ease-in-out; transition:bottom 0.33s ease-in-out;}.rg3fbpz-title {position:absolute; z-index:3; padding:4px 5px 5px; bottom:0px; left:0px; width:100%; background:#FFF; color:#000; font:bold 11px helvetica,arial,sans-serif; -moz-box-sizing:border-box; -webkit-box-sizing:border-box; box-sizing:border-box; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}.rg3fbpz-tooltip.rg3fbpz-hide-tooltip .rg3fbpz-title {bottom:-20px !important;}.rg3fbpz-icon {cursor:pointer; color:transparent !important; text-decoration:none !important; position:absolute !important; top:auto; left:-35px; right:auto; bottom:0px; padding:0px; z-index:300;}.fbDockWrapperLeft .rg3fbpz-icon {left:auto !important; right:-35px !important;}body > .rg3fbpz-icon {position:fixed !important; right:25px !important; left:auto !important;}.rg3fbpz-icon {background:#EBEEF4; border:1px solid #BDBFC4; border-bottom:0px; -webkit-background-clip:padding-box; -moz-background-clip:padding-box; -webkit-box-shadow:0 1px 1px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.5); -moz-box-shadow:0 1px 1px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.5); box-shadow:0 1px 1px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.5);  -webkit-border-top-left-radius: 1px 1px; -webkit-border-top-right-radius: 1px 1px;}.rg3fbpz-icon:hover {cursor:pointer; background:#F5F7FA text-decoration:none !important;}.rg3fbpz-icon *, .rg3fbpz-icon:hover * {text-decoration:none !important;}.rg3fbpz-icon > i {pointer-events:none; display:block; width:27px; height:24px; background:transparent none no-repeat center center;}.rg3fbpz-icon .rg3fbpz-titletip {display:none; position:absolute; color:#FFF !important; right:6px; bottom:27px; z-index:20; padding-bottom:4px; background:transparent url(data:image/gif;base64,R0lGODlhEwAEAIABACgoKAAAACH5BAEAAAEALAAAAAATAAQAAAINjA+pcO2x2Jsw0StnAQA7) no-repeat right bottom;}.rg3fbpz-icon .rg3fbpz-titletip strong {display:block; *margin:0; padding:3px 8px; text-align:center; white-space:nowrap; font-weight:normal; color:#fff; background:#282828;}.rg3fbpz-icon:hover .rg3fbpz-titletip {display:block !important;}.friendListing .friendName {pointer-events:none;}*[class*="Image"]:after, [class*="image"]:after, *[class*="Photo"]:after, *[class*="photo"]:after {pointer-events:none !important;}';
        document.head.appendChild(RG3.util.newElement("style", {
            type: "text/css",
            text: a
        }))
    },
    setOptions: function (a) {
        RG3.util.setOptions(this.options, a);
        this.tooltip && this.tooltip.setOptions(a);
        this.tooltip && this.tooltip.tooltip && RG3.util[this.options.showCaptions ? "removeClass" : "addClass"](this.tooltip.tooltip, "rg3fbpz-hide-tooltip");
        this.updateAppIcon()
    },
    toggle: function () {
        this.options.enabled = !this.options.enabled;
        proxy.setEnabled(this.options.enabled);
        if (!this.options.enabled) {
            this.tooltip.hide()
        }
        this.updateAppIcon();
        proxy.log("info", "Toggled", this.options.enabled)
    },
    getTitle: function (c) {
        var d = c._title || c.title || c.alt || c.getAttribute("aria-label") || null;
        if (!d) {
            var b, a = c.parentNode;
            d = a && a.getAttribute("aria-label");
            if (!d && a && (a.getAttribute("class") || "").indexOf("uiTooltip") > -1) {
                b = a.querySelector('*[class*="uiTooltipText"]');
                if (b) {
                    b.style.display = "none";
                    b.setAttribute("class", "");
                    d = b.firstChild ? (b.firstChild.innerText ? b.firstChild.innerText : b.firstChild.textContent) : ""
                }
            }
            if (!d && a && a.dataset && a.dataset.hover === "tooltip") {
                b = document.querySelector('*[data-ownerid="' + a.id + '"]');
                if (b && (d = b.querySelector(".tooltipText"))) {
                    d = d.innerText ? d.innerText : d.textContent;
                    d && (b.style.opacity = 0)
                }
            }
        }
        return (d && d.replace(/^photo:?\s*/i, "")) || ""
    },
    getNewSrc: function (a, c) {
        var b, d = null;
        if ((b = /^.*?app_full_proxy\.php\?.*?src\=([^\&]+).*$/i).test(a)) {
            d = decodeURIComponent(a.replace(b, "$1"))
        } else {
            if ((b = /^.*?safe_image\.php\?.*?url\=([^\&]+).*$/i).test(a)) {
                d = decodeURIComponent(a.replace(b, "$1"))
            } else {
                if ((b = new RegExp("_[aqst" + (c ? "n" : "") + "]\\.(jpe?g)$", "i")).test(a)) {
                    d = a.replace(b, "_n.$1")
                } else {
                    if ((b = new RegExp("[aqst" + (c ? "n" : "") + "]([\\d_]+)\\.(jpe?g)$", "i")).test(a)) {
                        d = a.replace(b, "n$1.$2")
                    }
                }
            }
        }
        d = d || a;
        if ((b = /\/[a-z]\d+x\d+\//i).test(d)) {
            d = d.replace(b, "/")
        }
        if ((b = /\/[a-z]\d+(\.\d+){3}\//i).test(d)) {
            d = d.replace(b, "/")
        }
        if ((b = /^(https?:\/\/[^\/]*flickr.com\/.*)_[tsm](\.jpe?g)$/i).test(d)) {
            d = d.replace(b, "$1$2")
        }
        return d && d.replace(/(^['"])|(['"]$)/g, "")
    },
    onMouseMove: function (g) {
        if (!this.mouseDown) {
            g = g || this.lastMouseMoveEvent;
            this.lastMouseMoveEvent = g;
            var j, a, b, i, h, f, c;
            h = RG3.util.getEventTarget(RG3.util.getEvent(g));
            f = h.localName.toLowerCase();
            c = false;
            if (this.options.disableTheater) {
                var d = f == "a" ? h : (h.parentNode && h.parentNode.localName.toLowerCase() == "a" ? h.parentNode : null);
                if (d && (j = d.getAttribute("rel"))) {
                    if (this.options.disableTheater && j == "theater") {
                        d.setAttribute("rel", "fbpz_no_theat")
                    } else {
                        if (!this.options.disableTheater && j == "fbpz_no_theat") {
                            d.setAttribute("rel", "theater")
                        }
                    }
                }
            }
            if (f == "img" && h.src && !/spotlight/i.test(h.className) && !/fbPhotoImage/i.test(h.id) && !/coverWrap/i.test(h.parentNode.className)) {
                if ((a = this.getNewSrc(h.src))) {
                    b = h.src.replace(/(^['"])|(['"]$)/g, "");
                    i = this.getTitle(h)
                } else {
                    if (h.offsetWidth < h.naturalWidth - 10 && h.offsetHeight < h.naturalHeight - 10) {
                        b = h.src.replace(/(^['"])|(['"]$)/g, "");
                        a = b;
                        i = this.getTitle(h)
                    } else {
                        if (/find\s+friends/i.test(document.title) && f == "img" && h.className.indexOf("friendBrowserPicture") > -1 && h.style.backgroundImage) {
                            b = h.style.backgroundImage.replace(/^\s*url\(([^\)]+)\).*$/i, "$1").replace(/(^['"])|(['"]$)/g, "");
                            a = b;
                            i = this.getTitle(h);
                            c = true
                        }
                    }
                }
            } else {
                if (f == "i" && h.style.backgroundImage && !/tickerFullPhoto/i.test(h.parentNode.className)) {
                    b = h.style.backgroundImage.replace(/^\s*url\(([^\)]+)\).*$/i, "$1").replace(/(^['"])|(['"]$)/g, "");
                    a = this.getNewSrc(b, true);
                    i = h._title || (h.parentNode && h.parentNode.title && h.parentNode.title.length > 0 ? h.parentNode.title : "") || (h.parentNode && h.parentNode.parentNode && h.parentNode.parentNode.title && h.parentNode.parentNode.title.length > 0 ? h.parentNode.parentNode.title : "")
                } else {
                    if (f == "a" && h.className.indexOf("album_link") > -1 && h.parentNode.className.indexOf("album_thumb") > -1 && h.parentNode.style.backgroundImage) {
                        b = h.parentNode.style.backgroundImage.replace(/^\s*url\(([^\)]+)\).*$/i, "$1").replace(/(^['"])|(['"]$)/g, "");
                        i = ""
                    }
                }
            }
            if (((!this.options.enabled && this.overrideZoom === true) || (this.options.enabled && this.overrideHide === false)) && b && !/\/vthumb/i.test(b) && (a || (a = this.getNewSrc(b)))) {
                if (!this.currentImg || this.currentImg.oSrc !== b) {
                    this.currentImg = {
                        src: a,
                        oSrc: b
                    };
                    pNode = h.parentNode;
                    i = i || this.getTitle(h);
                    h._title = i;
                    RG3.util.setProperties(h, {
                        title: "",
                        alt: ""
                    });
                    RG3.util.setProperties(h.parentNode, {
                        title: "",
                        alt: ""
                    });
                    RG3.util.setProperties(h.parentNode.parentNode, {
                        title: "",
                        alt: ""
                    });
                    proxy.log("info", "Setting Photo.", {
                        original_src: h.src,
                        src: this.currentImg.src,
                        title: h._title
                    });
                    this.showTooltip(this.currentImg.src, h._title);
                    proxy.setCurrentImage(this.currentImg.src);
                    if (pNode && pNode.nodeName && pNode.nodeName.toLowerCase() == "a" && (j = pNode.getAttribute("rel"))) {
                        if (this.options.disableTheater && j == "theater") {
                            pNode.setAttribute("rel", "fbpz_no_theat")
                        } else {
                            if (!this.options.disableTheater && j == "fbpz_no_theat") {
                                pNode.setAttribute("rel", "theater")
                            }
                        }
                    }
                }
            } else {
                this.hideTooltip()
            }
        } else {
            if (Math.abs(g.x - this.mouseDownCoords.x) > 5 || Math.abs(g.y - this.mouseDownCoords.y) > 5) {
                this.hideTooltip()
            }
        }
    },
    getIdFromSrc: function (c) {
        var b, a, d;
        if ((b = new RegExp("/([\\d_]+)_n.(jpe?g)$", "i")).test(c) && (a = b.exec(c)) && a.length > 1 && (a = a[1])) {
            (a = a.split("_")) && a.length > 1 && (d = a[1])
        }
        return d
    },
    showTooltip: function (c, b) {
        this.tooltip.start({
            src: c
        });
        var d = this.getIdFromSrc(c);
        var a = this.tooltip.getImgBySrc(c);
        if (d && a && !a.fbpz_graph) {
            proxy.getGraphInfo(d, {}, RG3.util.bind(this, function (f) {
                a.fbpz_graph = true;
                if (f && f.name) {
                    a.title = f.name + ' <i style="color:#F00;">' + f.name + "</i>"
                } else {
                    a.title = b || ""
                }
                if (a == this.tooltip.tooltipImg) {
                    this.tooltip.reloadTitle()
                }
            }))
        }
    },
    hideTooltip: function () {
        if ((this.tooltip.open && !this.tooltip.hiding) || this.currentImg !== null) {
            this.tooltip.hide();
            this.currentImg = null;
            proxy.setCurrentImage(null)
        }
    },
    onKeyDown: function (a) {
        if (a.keyCode == "17") {
            this.ctrlDown = true
        } else {
            if (a.keyCode == "16") {
                this.shiftDown = true
            }
        }
        if (a.keyCode == this.options.enableShortcut && this.ctrlDown && this.shiftDown) {
            this.toggle()
        }
        if (a.keyCode == this.options.openShortcut && this.ctrlDown && this.shiftDown) {
            proxy.openImage()
        }
        if (a.keyCode == this.options.forceZoomKey) {
            this.overrideZoom = true;
            this.onMouseMove()
        }
        if (a.keyCode == this.options.forceHideKey) {
            this.overrideHide = true;
            this.onMouseMove()
        }
    },
    onKeyUp: function (a) {
        if (a.keyCode == "17") {
            this.ctrlDown = false
        }
        if (a.keyCode == "16") {
            this.shiftDown = false
        }
        if (a.keyCode == this.options.forceZoomKey) {
            this.overrideZoom = false;
            this.onMouseMove()
        }
        if (a.keyCode == this.options.forceHideKey) {
            this.overrideHide = false;
            this.onMouseMove()
        }
    },
    onMouseDrag: function (a) {
        this.hideTooltip()
    },
    onMouseDown: function (a) {
        this.mouseDown = true;
        this.mouseDownCoords = {
            x: a.x,
            y: a.y
        }
    },
    onMouseUp: function (a) {
        this.mouseDown = false;
        this.mouseDownCoords = null
    },
    onBodyClick: function (a) {
        this.hideTooltip()
    },
    createAppIcon: function () {
        if (!this.icon) {
            this.icon = {};
            this.icon.container = RG3.util.newElement("span", {
                "class": "rg3fbpz-icon",
                onclick: function (c) {
                    RG3.util.preventEventDefault(c);
                    return false
                }
            });
            this.icon.tooltip = RG3.util.newElement("strong", {
                text: this["name"]
            });
            var b = RG3.util.newElement("div", {
                "class": "rg3fbpz-titletip"
            });
            b.appendChild(this.icon.tooltip);
            this.icon.container.appendChild(b)
        }
        if (document.body && !document.querySelector(".rg3fbpz-icon")) {
            this.attachIconAttempts = this.attachIconAttempts == null ? 0 : this.attachIconAttempts + 1;
            var a = document.querySelector(".fbDockWrapper");
            if (!a && this.attachIconAttempts > 4) {
                proxy.log("error", "Couldn't attach PZ4FB icon to side bar.", {
                    attempts: this.attachIconAttempts
                });
                a = document.body
            }
            if (a) {
                a.appendChild(this.icon.container);
                RG3.util.addEvent(this.icon.container, "click", RG3.util.bind(this, function (c) {
                    RG3.util.preventEventDefault(c);
                    this.toggle();
                    return false
                }));
                this.updateAppIcon()
            } else {
                setTimeout(RG3.util.bind(this, this.createAppIcon), 500)
            }
        }
    },
    updateAppIcon: function () {
        if (this.icon) {
            RG3.util.setStyles(this.icon.image, {
                "background-image": "url(" + this.icons[(this.options.enabled ? "on" : "off")] + ")"
            });
            RG3.util.setProperty(this.icon.tooltip, "text", this["name"] + (this.options.enabled ? " (on)" : " (off)"))
        }
    }
};
var photozoom, proxy = {
    update: function (a) {
        if (!photozoom) {
            photozoom = new RG3.fbPhotoZoom(a)
        } else {
            photozoom.setOptions(a)
        }
    }
};
chrome.extension.onRequest.addListener(function (c, b, a) {
    switch (c.name) {
        case "callback":
            if (c.callback_key) {
                proxy.callbacks[c.callback_key] && proxy.callbacks[c.callback_key](c.data) && delete proxy.callbacks[c.callback_key]
            }
        case "updateOptions":
            proxy.getOptions();
            a({});
            break
    }
});
proxy.callbacks = {};
proxy.setEnabled = function (a) {
    chrome.extension.sendRequest({
        name: "setEnabled",
        value: a
    })
};
proxy.setCurrentImage = function (a) {
    chrome.extension.sendRequest({
        name: "setCurrentImage",
        value: a
    })
};
proxy.openImage = function () {
    chrome.extension.sendRequest({
        name: "openImage"
    })
};
proxy.openOptions = function () {
    chrome.extension.sendRequest({
        name: "openOptions"
    })
};
proxy.options = {};
proxy.getOptions = function () {
    chrome.extension.sendRequest({
        name: "getOptions"
    }, function (a) {
        proxy.options = a.value;
        proxy.update({
            name: proxy.options.name,
            version: proxy.options.version,
            enabled: proxy.options.enabled,
            hideContextMenu: proxy.options.hideContextMenu,
            showCaptions: proxy.options.showCaptions,
            disableTheater: proxy.options.disableTheater || false,
            forceZoomKey: proxy.options.forceZoomKey || -1,
            forceHideKey: proxy.options.forceHideKey || -1,
            enableShortcut: proxy.options.enableShortcut || 90,
            opacity: (proxy.options.opacity || 100) / 100,
            delay: parseInt(proxy.options.delay || 0, 10),
            fadeInDuration: parseInt(proxy.options.fadeInDuration != null ? proxy.options.fadeInDuration : 0, 10),
            fadeOutDuration: parseInt(proxy.options.fadeOutDuration != null ? proxy.options.fadeOutDuration : 0, 10)
        })
    })
};
proxy.log = function (a, b, c) {
    if (proxy.options.debug) {
        c = c || {};
        c.page_url = window.location.toString();
        chrome.extension.sendRequest({
            name: "log",
            type: a,
            message: b,
            data: JSON.stringify(c)
        });
        if (typeof (console) === "object") {
            console[/warn|error/.test(a) ? "warn" : "debug"]("[PZ4FB " + (a || "info").toUpperCase() + "]", b, c)
        }
    }
};
proxy.getGraphInfo = function (d, b, c) {
    var a = "getGraphInfoCallback" + (+new Date);
    proxy.callbacks[a] = c;
    chrome.extension.sendRequest({
        name: "getGraphInfo",
        id: d,
        data: b,
        callback_key: a
    })
};
proxy.getOptions();
"\n"