webpackJsonp([0],{

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__guardados_guardados__ = __webpack_require__(414);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__guardados_guardados__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home__ = __webpack_require__(416);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__home_home__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mapa_mapa__ = __webpack_require__(265);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__mapa_mapa__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(417);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a"]; });




//# sourceMappingURL=index.paginas.js.map

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HistorialService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_scan_data_model__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_in_app_browser__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_contacts__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_mapa_mapa__ = __webpack_require__(265);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var HistorialService = /** @class */ (function () {
    function HistorialService(iab, modalCtrl, contacts, platform, toastCtrl) {
        this.iab = iab;
        this.modalCtrl = modalCtrl;
        this.contacts = contacts;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this._historial = [];
    }
    HistorialService.prototype.agregar_historial = function (texto) {
        var data = new __WEBPACK_IMPORTED_MODULE_1__models_scan_data_model__["a" /* ScanData */](texto);
        this._historial.unshift(data);
        console.table(this._historial);
        //this.abrir_scan(0);
    };
    HistorialService.prototype.abrir_scan = function (index) {
        var scanData = this._historial[index];
        console.log(scanData);
        switch (scanData.tipo) {
            case "http":
                this.iab.create(scanData.info, "_system");
                break;
            case "mapa":
                this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__pages_mapa_mapa__["a" /* MapaPage */], { coords: scanData.info })
                    .present();
                break;
            case "contacto":
                this.crear_contacto(scanData.info);
                break;
            case "email":
                this.crear_email(scanData.info);
                break;
            default:
                console.error("Tipo no soportado");
        }
    };
    HistorialService.prototype.crear_email = function (texto) {
        var correo = texto.split(";");
        this.to = correo[0].replace("MATMSG:TO:", "");
        this.subject = correo[1].replace("SUB:", "");
        this.body = correo[2].replace("BODY:", "");
        this.iab.create("mailto:" + this.to + "?subject=" + this.subject + "&body=" + this.body);
    };
    HistorialService.prototype.crear_contacto = function (texto) {
        var _this = this;
        var campos = this.parse_vcard(texto);
        console.log(campos);
        var nombre = campos['fn'];
        var tel = campos.tel[0].value[0];
        if (!this.platform.is('cordova')) {
            console.warn("Estoy en la computadora, no puedo crear contacto.");
            return;
        }
        var contact = this.contacts.create();
        contact.name = new __WEBPACK_IMPORTED_MODULE_3__ionic_native_contacts__["b" /* ContactName */](null, nombre);
        contact.phoneNumbers = [new __WEBPACK_IMPORTED_MODULE_3__ionic_native_contacts__["a" /* ContactField */]('mobile', tel)];
        contact.save().then(function () { return _this.crear_toast("Contacto " + nombre + " creado!"); }, function (error) { return _this.crear_toast("Error: " + error); });
    };
    HistorialService.prototype.crear_toast = function (mensaje) {
        this.toastCtrl.create({
            message: mensaje,
            duration: 2500
        }).present();
    };
    HistorialService.prototype.parse_vcard = function (input) {
        var Re1 = /^(version|fn|title|org):(.+)$/i;
        var Re2 = /^([^:;]+);([^:]+):(.+)$/;
        var ReKey = /item\d{1,2}\./;
        var fields = {};
        input.split(/\r\n|\r|\n/).forEach(function (line) {
            var results, key;
            if (Re1.test(line)) {
                results = line.match(Re1);
                key = results[1].toLowerCase();
                fields[key] = results[2];
            }
            else if (Re2.test(line)) {
                results = line.match(Re2);
                key = results[1].replace(ReKey, '').toLowerCase();
                var meta = {};
                results[2].split(';')
                    .map(function (p, i) {
                    var match = p.match(/([a-z]+)=(.*)/i);
                    if (match) {
                        return [match[1], match[2]];
                    }
                    else {
                        return ["TYPE" + (i === 0 ? "" : i), p];
                    }
                })
                    .forEach(function (p) {
                    meta[p[0]] = p[1];
                });
                if (!fields[key])
                    fields[key] = [];
                fields[key].push({
                    meta: meta,
                    value: results[3].split(';')
                });
            }
        });
        return fields;
    };
    ;
    HistorialService.prototype.cargar_historial = function () {
        return this._historial;
    };
    HistorialService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_contacts__["c" /* Contacts */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["f" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["g" /* ToastController */]])
    ], HistorialService);
    return HistorialService;
}());

//# sourceMappingURL=historial.js.map

/***/ }),

/***/ 173:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 173;

/***/ }),

/***/ 218:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 218;

/***/ }),

/***/ 265:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MapaPage = /** @class */ (function () {
    function MapaPage(navParams, viewCtrl) {
        //this.lat = 24.022657;
        //this.lng = -104.553776;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        var coordsArray = this.navParams.get("coords").split(",");
        this.lat = Number(coordsArray[0].replace("geo:", ""));
        this.lng = Number(coordsArray[1]);
        console.log(this.lat, this.lng);
    }
    MapaPage.prototype.cerrar_modal = function () {
        this.viewCtrl.dismiss();
    };
    MapaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mapa',template:/*ion-inline-start:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/mapa/mapa.html"*/'<ion-content>\n\n\n  <agm-map [latitude]="lat" [longitude]="lng" [zoom]="16">\n    <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>\n  </agm-map>\n\n\n</ion-content>\n\n\n \n<ion-footer>\n\n  <ion-toolbar color="primary">\n\n    <ion-buttons end>\n      <button ion-button\n              (click)="cerrar_modal()">\n        Cerrar\n      </button>\n    </ion-buttons>\n\n  </ion-toolbar>\n\n</ion-footer> \n'/*ion-inline-end:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/mapa/mapa.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ViewController */]])
    ], MapaPage);
    return MapaPage;
}());

//# sourceMappingURL=mapa.js.map

/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(371);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 371:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__(408);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__agm_core__ = __webpack_require__(418);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_historial__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_barcode_scanner__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_contacts__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(262);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// Mapas


// servicios

// plugins





var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["a" /* GuardadosPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["b" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["c" /* MapaPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["d" /* TabsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__agm_core__["a" /* AgmCoreModule */].forRoot({
                    apiKey: 'AIzaSyBEqKtJCsyLJBQibxDIdqqwd_KijpnchNc'
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["a" /* GuardadosPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["b" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["c" /* MapaPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_index_paginas__["d" /* TabsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_contacts__["c" /* Contacts */],
                __WEBPACK_IMPORTED_MODULE_6__providers_historial__["a" /* HistorialService */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 408:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_index_paginas__ = __webpack_require__(139);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_index_paginas__["d" /* TabsPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuardadosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_historial__ = __webpack_require__(140);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var GuardadosPage = /** @class */ (function () {
    function GuardadosPage(_historialService) {
        this._historialService = _historialService;
        this.historial = [];
    }
    GuardadosPage.prototype.ionViewDidLoad = function () {
        this.historial = this._historialService.cargar_historial();
    };
    GuardadosPage.prototype.abrir_scan = function (index) {
        this._historialService.abrir_scan(index);
    };
    GuardadosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-guardados',template:/*ion-inline-start:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/guardados/guardados.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <ion-title> Historial </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-list>\n\n    <button ion-item\n            *ngFor="let data of historial; let i = index"\n            (click)="abrir_scan( i )">\n      {{ data.info }}\n      <p>\n        {{ data.tipo }}\n      </p>\n    </button>\n\n  </ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/guardados/guardados.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__providers_historial__["a" /* HistorialService */]])
    ], GuardadosPage);
    return GuardadosPage;
}());

//# sourceMappingURL=guardados.js.map

/***/ }),

/***/ 415:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScanData; });
var ScanData = /** @class */ (function () {
    function ScanData(texto) {
        this.tipo = "no definido";
        this.info = texto;
        if (texto.startsWith("http")) {
            this.tipo = "http";
        }
        else if (texto.startsWith("geo")) {
            this.tipo = "mapa";
        }
        else if (texto.startsWith("BEGIN:VCARD")) {
            this.tipo = "contacto";
        }
        else if (texto.startsWith("MATMSG")) {
            this.tipo = "email";
        }
    }
    return ScanData;
}());

//# sourceMappingURL=scan-data.model.js.map

/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_historial__ = __webpack_require__(140);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// Componentes

// Plugins

// servicios

var HomePage = /** @class */ (function () {
    function HomePage(barcodeScanner, toastCtrl, platform, _historialService) {
        this.barcodeScanner = barcodeScanner;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this._historialService = _historialService;
    }
    HomePage.prototype.scan = function () {
        var _this = this;
        console.log("Realizando scan...");
        if (!this.platform.is('cordova')) {
            this._historialService.agregar_historial("http://google.com");
            this._historialService.agregar_historial("geo:9.976133040865312,-84.00677479055173");
            this._historialService.agregar_historial("BEGIN:VCARD\nVERSION:2.1\nN:Kent;Clark\nFN:Clark Kent\nORG:\nTEL;HOME;VOICE:12345\nTEL;TYPE=cell:67890\nADR;TYPE=work:;;;\nEMAIL:clark@superman.com\nEND:VCARD");
            this._historialService.agregar_historial("MATMSG:TO: abigail.orti@gmail.com;SUB:Asunto del mensaje;BODY:Texto del email.;;");
        }
        this.barcodeScanner.scan().then(function (barcodeData) {
            console.log('Barcode data', barcodeData);
        }).catch(function (err) {
            console.log('Error', err);
            _this.mostrar_error('Error: ' + err);
        });
    };
    HomePage.prototype.mostrar_error = function (mensaje) {
        var toast = this.toastCtrl.create({
            message: mensaje,
            duration: 2500
        });
        toast.present();
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>\n      QR-APP\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n\n  <button ion-button\n          block\n          (click)="scan()">\n    Realizar Scan\n  </button>\n\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__["a" /* BarcodeScanner */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__["a" /* BarcodeScanner */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__providers_historial__["a" /* HistorialService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_historial__["a" /* HistorialService */]) === "function" && _d || Object])
    ], HomePage);
    return HomePage;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 417:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_paginas__ = __webpack_require__(139);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.tab1 = __WEBPACK_IMPORTED_MODULE_1__index_paginas__["b" /* HomePage */];
        this.tab2 = __WEBPACK_IMPORTED_MODULE_1__index_paginas__["a" /* GuardadosPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tabs',template:/*ion-inline-start:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/tabs/tabs.html"*/'\n\n<ion-tabs color="primary">\n\n  <ion-tab tabTitle="Scan" tabIcon="qr-scanner" [root]="tab1"></ion-tab>\n  <ion-tab tabTitle="Historial" tabIcon="list" [root]="tab2"></ion-tab>\n\n\n</ion-tabs>\n'/*ion-inline-end:"/Users/Abigail/Desktop/practicas/uno/qrsacan_abigail/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ })

},[366]);
//# sourceMappingURL=main.js.map