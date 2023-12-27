/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n( function(){\n    const lat = 45.4883882;\n    const lng = -73.6609482;\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12.3);\n\n    let markers = new L.FeatureGroup().addTo(mapa)\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    const obtenerPropiedades = async () =>{\n        try {\n            const url = '/api/propiedades'\n            const respuesta = await fetch(url)\n            const propiedades = await respuesta.json()\n\n            mostrarPropiedades(propiedades)\n            \n        } catch (error) {\n            console.log(error)\n        }\n    }\n\n    const mostrarPropiedades = propiedades =>{\n        propiedades.forEach( propiedad => {\n            //Agregar pin \n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\n                autoPan: true,\n            })\n            .addTo(mapa)\n            .bindPopup(`\n                <p class='text-indigo-600 font-bold'>${propiedad?.categoria.nombre}</p>\n                <h1 class='text-md font-extrabold uppercase my-2'>${propiedad?.titulo}</h1>\n                <img src='/uploads/${propiedad.imagen}' alt=${propiedad.titulo}>\n                <p class='text-gray-600 font-bold'>${propiedad?.precio.nombre}</p>\n                <a href='/propiedad/${propiedad.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase'>Ver Propiedad</a>\n            `)\n\n            markers.addLayer(marker)\n        })\n    }\n\n    obtenerPropiedades()\n\n})()\n\n//# sourceURL=webpack://bienesraicesmvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;