var _TOOLS = {
	_expanded:false,
	_timerPushAlert: 0,
	_timerClock: 0,
	onCreateDataTable: function (_id, _paging, _keyScroll = "") {
		if (_keyScroll != "") { $(window).off("scroll").on("scroll", function () { localStorage[_keyScroll] = $(document).scrollTop(); }); }

		if ($(".areaTabla").html().trim() == "") {
			setTimeout(function () {
				$(".card-wait").fadeOut("fast", function () {
					$(".card-empty").removeClass("d-none");
					$(".card-body").removeClass("d-none");
					$('.areaTabla').fadeIn("fast");
				});
			}, 1);
		}
		return $('#table_id').DataTable(
			{
				autoWidth: true,
				bFilter: false,
				bInfo: false,
				ordering: false,
				paging: _paging,
				dom: "rtip",
				responsive: false,
				lengthChange: true,
				columnDefs: [{ width: "100%", targets: -1 }],
				fixedColumns: false,
				language: { "url": "//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json" },
				preInit: function () {
					$('.areaTabla').hide();
				},
				initComplete: function () {
					$(".card-wait").fadeOut(750, function () { });
					setTimeout(function () {
						$(".card-empty").addClass("d-none");
						$(".card-body").removeClass("d-none");
						$('.areaTabla').fadeIn("fast");
						window.dispatchEvent(new Event('resize'));
						if (_keyScroll != "") { setTimeout(function () { try { $(document).scrollTop(localStorage[_keyScroll]); } catch (e) { } }, 1); }
					}, 500);
				}
			});
	},
	onAlert: function (_json) {
		try {
			clearTimeout(_TOOLS._timerPushAlert);
			$(".push-alert").remove();
			if (typeof _json["message"] === 'object') { _text = ""; } else { _text = _json["message"]; }
			if (_text == "") { return false; }
			var _html = "<div class='p-2 m-2 push-alert alert " + _json["class"] + " alert-dismissible fade show' role='alert' style='position:absolute;left:325px;top:75px;z-index:999999;'>";
			_html += _text;
			_html += "</div>";
			$("body").append(_html);
			_TOOLS._timerPushAlert = setTimeout(function () { $(".push-alert").alert('close') }, 5000);
			return true;
		} catch (rex) {
			alert(rex.message);
			return false;
		}
	},
	onShowAlertModal: function (_title, _body, _callback) {
		var _html = "";
		$(".modal-backdrop").remove();
		$("#dynModal").remove();
		_html += "<div class='modal fade' id='dynModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>";
		_html += "   <div class='modal-dialog modal-lg modal-dialog-top'>";
		_html += "      <div class='modal-content' style='position:absolute;top:0px;'>";
		_html += "         <div class='modal-header'>";
		_html += "            <h4 class='modal-title'>" + _title + "</h4>";
		_html += "         </div>";
		_html += "         <div class='modal-body'>" + _body + "</div>";
		_html += "		   <div class='modal-footer'></hr>";
		_html += "            <a href='#' class='btn btn-danger btn-close-modal'>Cerrar</a>";
		_html += "         </div>";
		_html += "      </div>";
		_html += "   </div>";
		_html += "</div>";
		$("body").append(_html);
		$("body").off("click", ".btn-close-modal").on("click", ".btn-close-modal", function () {
			$(".modal-backdrop").remove();
			$("#dynModal").remove();
			$("body").css({ "overflow-y": "auto" });
		});
		//$("#dynModal").modal({ backdrop: 'static', keyboard: false });
		//$("#dynModal").modal('show');
		var myModal = new bootstrap.Modal(document.getElementById("dynModal"), { backdrop: 'static', keyboard: false });
		myModal.toggle();
		if ($.isFunction(_callback)) { _callback(); }
	},
	copyToClipboard: function (_this) {
		var _id = _this.attr("data-source");
		var textToCopy = $('#' + _id).val();
		var tempTextarea = $('<textarea>');
		$('body').append(tempTextarea);
		tempTextarea.val(textToCopy).select();
		document.execCommand('copy');
		tempTextarea.remove();
		var _original = _this.html();
		setTimeout(function () {
			_this.html("<span class='material-icons'>done_all</span> Copiado");
		}, 1);
		setTimeout(function () {
			_this.html(_original);
		}, 1500);
	},

	todayYYYYMMDD: function (_separator) {
		var currentDate = new Date();
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		if (day < 10) { day = "0" + day; }
		if (month < 10) { month = "0" + month; }
		return (year + _separator + month + _separator + day);
	},
	toDeg: function (r) { return r * 180 / Math.PI; },
	prettyDate(_val) {
		var _s = _val.split("T");
		var _d = _s[0].split("-");
		var _h = _s[1].split(".");
		return (_d[2] + "/" + _d[1] + "/" + _d[0] + " " + _h[0]);
	},
	getNow: function () {
		var currentDate = new Date();
		var second = currentDate.getSeconds();
		var minute = currentDate.getMinutes();
		var hour = currentDate.getHours();
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		if (day < 10) { day = "0" + day; }
		if (month < 10) { month = "0" + month; }
		if (hour < 10) { hour = "0" + hour; }
		if (minute < 10) { minute = "0" + minute; }
		if (second < 10) { second = "0" + second; }
		return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
	},
	getNowYYYYMMDD: function () {
		var currentDate = new Date();
		var second = currentDate.getSeconds();
		var minute = currentDate.getMinutes();
		var hour = currentDate.getHours();
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		if (day < 10) { day = "0" + day; }
		if (month < 10) { month = "0" + month; }
		if (hour < 10) { hour = "0" + hour; }
		if (minute < 10) { minute = "0" + minute; }
		if (second < 10) { second = "0" + second; }
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	},
	getNowDDMMYYYY: function () {
		var currentDate = new Date();
		var second = currentDate.getSeconds();
		var minute = currentDate.getMinutes();
		var hour = currentDate.getHours();
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		if (day < 10) { day = "0" + day; }
		if (month < 10) { month = "0" + month; }
		if (hour < 10) { hour = "0" + hour; }
		if (minute < 10) { minute = "0" + minute; }
		if (second < 10) { second = "0" + second; }
		return day + "-" + month + "-" + year + hour + "." + minute;
	},
	dateCompareGreaterThan: function (_dateGreater, _dateBase) {
		const date1 = new Date(_dateGreater);
		const date2 = new Date(_dateBase);
		if (date1 > date2) {
			return true;
		} else if (date1 < date2) {
			return false;
		} else {
			return true;
		}
	},
	validateAge: function (_this) {
		var _source = _this.attr("data-source");
		var _target = _this.attr("data-target");
		var _area = _this.attr("data-area");
		var _calificacion = _this.attr("data-calificacion");
		var _params = { "fecha": $(_source).val(), "_area": _area };
		if (_calificacion != undefined && _calificacion != "") { _params["calificacion"] = _calificacion; }
		var date = _params.fecha.split("-");
		year = parseInt(date[0]);
		if (_params.fecha != "" && year > 1800) {
			_FUNCTIONS.ExecutePostAjax("/Abstract/validateAge", _params).then(function (data) {
				var _age = parseInt(data.id);
				if (_age == 0) { data.logica = false; _age = ""; }
				$(_target).val(_age);
				if (!data.logica && data.mensaje != "OVERMAX") {
					$(_source).val("");
					var _html = "<h5>La fecha de nacimiento no está dentro del rango permitido</h5>";
					_html += "<p>" + data.mensaje + "</p>";
					_TOOLS.onShowAlertModal("Datos incorrectos", _html);
				}
				if (data.mensaje == "OVERMAX") {
					_TOOLS.onShowAlertModal("Alerta al operador", "<p>La fecha de nacimiento excede los parámetros de control, pero al ser un cliente AAA se generará un informe de edad condicional, el cual deberá ser aprobado durante la gestión.");
				}
			});
		}
	},
	isValidDate: function (dateString) {
		var timestamp = Date.parse(dateString);
		return !isNaN(timestamp);
	},
	isValidEmail: function (email) {
		var em = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
		return em.test(email);
	},
	validate: function (_selector, _seeAlert) {
		if (_seeAlert == undefined) { _seeAlert = false; }
		var _ret = true;
		$(_selector).each(function () { _ret = _TOOLS.formatValidation($(this)) && _ret; });
		if (!_ret && _seeAlert) {
			var _html = "<h5>Hay datos sin completar en el formulario.</h5>";
			_html += "<p>Revise atentamente todas las secciones, los datos requeridos están marcados en color <span style='font-weight:bold;color:red;'>rojo</span></p>";
			_html += "<ul>";
			$(_selector).each(function () {
				if ($(this).attr("placeholder") != undefined && $(this).attr("placeholder") != "") {
					_html += "<li>" + $(this).attr("placeholder").replace("...", "") + "</li>";
				} else {
					_html += "<li>" + $(this).attr("id") + "</li>";
				}
			});
			_html += "</ul>";
			_TOOLS.onShowAlertModal("Datos faltantes", _html);
		}
		return _ret;
	},
	formatValidation: function (_obj) {
		var _ret = true;
		var _value = _obj.val();
		var property = _obj.attr('name');
		switch (_obj.prop("tagName")) {
			case "TEXTAREA":
			case "INPUT":
				var _min = _obj.attr('data-min');
				var _max = _obj.attr('data-max');
				switch (_obj.attr("type")) {
					case "number":
						if (_value == "") { _ret = false; }
						if (isNaN(_value)) { _ret = false; }
						if (_min !== undefined) {
							if (isNaN(_min)) {
								_min = $(_min).val();
								if (_min != undefined) { if (isNaN(_min)) { _ret = false; } }
							}
							if (_ret) { _ret = (parseDouble(_value) > parseDouble(_min)); }
						}
						if (_ret) {
							if (_max !== undefined) {
								if (isNaN(_max)) {
									_max = $(_max).val();
									if (_max != undefined) { if (isNaN(_max)) { _ret = false; } }
								}
								if (_ret) { _ret = (parseDouble(_value) < parseDouble(_max)); }
							}
						}
						break;
					case "date":
					case "datetime-local":
						if (!_TOOLS.isValidDate(_value)) { _ret = false; }
						if (_min !== undefined) {
							if (!_TOOLS.isValidDate(_min)) {
								_min = $(_min).val();
								if (_min != undefined) { if (!_TOOLS.isValidDate(_min)) { _ret = false; } }
							}
							if (_ret) { _ret = _TOOLS.dateCompareGreaterThan(_value, _min); }
						}
						if (_ret) {
							if (_max !== undefined) {
								if (!_TOOLS.isValidDate(_max)) {
									_max = $(_max).val();
									if (_max != undefined) { if (!_TOOLS.isValidDate(_max)) { _ret = false; } }
								}
								if (_ret) { _ret = _TOOLS.dateCompareGreaterThan(_max, _value); }
							}
						}
						break;
					case "email":
						if (!_TOOLS.isValidEmail(_value)) { _ret = false; }
						break;
					case "radio":
						_ret = ($("input[name='" + property + "']:checked").val() != undefined);
						if (!_ret) {
							_obj.parent().css("border", "solid 1px red");
						} else {
							_obj.parent().css("border", "solid 0px transparent");
						}
						break;
					case "checkbox":
						var _checked = _obj.is(":checked");
						if (!_checked) { _ret = false; }
						break;
					default:
						if (_obj.hasClass("data-list")) {
							if (_obj.attr("data-selected-id") == "" || _obj.attr("data-selected-id") == undefined) { _ret = false; }
						} else {
							if (_value == "") { _ret = false; }
						}
						break;
				}
				break;
			case "SELECT":
				if (_value == "0" || _value == "-1" || _value == undefined || _value == null || _value == "") { _ret = false; }
				break;
		}
		if (_ret) {
			_obj.removeClass("is-invalid").addClass("is-valid");
			$(".invalid-" + _obj.prop("name")).html("").addClass("d-none");
		} else {
			_obj.removeClass("is-valid").addClass("is-invalid");
			var _msg = _obj.attr("placeholder");
			if (_msg == undefined) { _msg = "el valor de selección"; }
			$(".invalid-" + _obj.prop("name")).html("Debe completar " + _msg).removeClass("d-none");
		}
		//if (!_ret) { alert(property);}
		return _ret;
	},
	getFormValues: function (_selector, _this) {
		try {
			var _jsonSave = {};
			$(_selector).each(function () {
				var property = $(this).attr('name');
				var value = "";
				switch ($(this).attr("data-type")) {
					case "select":
						if ($(this).length == 0) { value = ""; } else { value = $(this).val(); }
						if (value == null || value == "-1" || value == "0") { value = ""; }
						break;
					case "radio":
						value = $("input[name='" + property + "']:checked").val();
						if (value == undefined) { value = ""; }
						break;
					case "checkbox":
						if ($(this).prop("checked")) {
							value = $(this).val();
							if (parseInt(value) == 0 || value == '') { value = 1; }
						} else {
							value = 0;
						}
						break;
					default:
						value = $(this).val();
						break;
				}
				_jsonSave[property] = value;
			});
			//Process attached files
			if (_this != null) {
				_jsonSave["id"] = _this.attr("data-id");
				_jsonSave["module"] = _this.attr("data-module");
				_jsonSave["model"] = _this.attr("data-model");
				_jsonSave["table"] = _this.attr("data-table");
				if (_this.attr("data-page") == undefined) { _this.attr("data-page", 1); };
				_jsonSave["page"] = _this.attr("data-page");
			}
		} catch (rex) { };
		return _jsonSave;
	},
	UUID: function () {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";
		var uuid = s.join("");
		return uuid;
	},
	diffSeconds: function (_from, _to) {
		_from = moment(_from);
		_to = moment(_to);
		var _duration = moment.duration(_from.diff(_to));
		return _duration.asSeconds();
	},
	prettyPrint: function (obj) {
		return JSON.stringify(obj, undefined, 4);
	},
	replaceAll: function (str, find, replace) {
		return str.replace(new RegExp(find, 'g'), replace);
	},
	utf8_to_b64: function (str) { return window.btoa(unescape(encodeURIComponent(str))); },
	b64_to_utf8: function (str) {
		str = str.replace(/\s/g, '');
		return decodeURIComponent(escape(window.atob(str)));
	},
	LPAD: function (str, char, length) {
		while (String(str).length < length) {
			str = (char + str);
		}
		return str;
	},
	onlyNumbers: function (_this) {
		_this.val(_this.val().replace(/[^0-9]/g, ''));
	},
	isBase64: function (testString) {
		try {
			var isEncoded = (btoa(atob(testString)) == atob(btoa(testString)));
			return isEncoded;
		} catch (err) {
			return false;
		}
	},
	countDownClock: function (_locked_limit, _target, _targetMsg) {
		if (_locked_limit == "") {
			$(_targetMsg).addClass("d-none");
			return false;
		}
		clearInterval(_TOOLS._timerClock);
		var countDownDate = new Date(_locked_limit).getTime();
		_TOOLS._timerClock = setInterval(function () {
			var now = new Date().getTime();
			var distance = (countDownDate - now);
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			var _html = "";
			if (days != 0) {
				if (days == 1) {
					days = "0" + days.toString();
					_html += days + " día, ";
				} else {
					if (days < 10) { days = "0" + days.toString(); }
					_html += days + " días, ";
				}
			}
			if (hours != 0) {
				if (hours == 1) {
					hours = "0" + hours.toString();
					_html += hours + " hora, ";
				} else {
					if (hours < 10) { hours = "0" + hours.toString(); }
					_html += hours + " horas, ";
				}
			}
			if (minutes == 1) {
				minutes = "0" + minutes.toString();
				_html += minutes + " minuto, ";
			} else {
				if (minutes < 10) { minutes = "0" + minutes.toString(); }
				_html += minutes + " minutos, ";
			}
			if (seconds == 1) {
				seconds = "0" + seconds.toString();
				_html += seconds + " segundo";
			} else {
				if (seconds < 10) { seconds = "0" + seconds.toString(); }
				_html += seconds + " segundos";
			}
			$(_target).html(_html);
			$(_targetMsg).removeClass("d-none");
			if (distance < 0) {
				clearInterval(_TOOLS._timerClock);
				$(_target).html("<span class='badge badge-danger'>Tiempo agotado</span>");
				$(_targetMsg).addClass("d-none");
				alert("Se ha agotado el tiempo de gestión. Se cerrará el formulario, grabando la actividad hasta este momento.");
				$(".btn-Grabar").click();
			}
		});
	},
	toggleByClass: function (_this) {
		var _target = _this.attr("data-toggle");
		if ($(_target).hasClass("d-none")) {
			$(_target).removeClass("d-none");
			_this.html("Ver menos...");
		} else {
			$(_target).addClass("d-none");
			_this.html("Ver más...");
		}
	},
	formatMoney: function (_val, _dec = 2) {
		if (isNaN(_val)) { _val = 0; }
		return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: _dec, maximumFractionDigits: _dec }).format(_val);
	},
	itemToControl: function (_arr, _key, _renull) {
		if (_renull != "") {
			if (_arr[_key] == "") { _arr[_key] = _renull; }
		}
		try { $("." + _key).val(_arr[_key].toString().trim()); } catch (ex) { }
	},
	getAge: function (dateString) {
		return moment().diff(moment(dateString, 'YYYYMMDD'), 'years');
	},
	checkLen: function (_key, _label, _min) {
		var _val = $("." + _key).val();
		var _len = $("." + _key).attr("maxlength");
		if (_min != undefined) { _len = _min; }
		if (_val != "") {
			if (_val.length > _len) {
				alert("El " + _label + " debe tener un máximo de " + _len + " caracteres");
				return false;
			}
		}
		return true;
	},
	drawCredentialSwiss: function (item) {
		$(".area-swiss").html("").removeClass("card-loader").removeClass("skeleton").addClass("d-none");
		_TOOLS.drawCredential("canvasSwiss", "/img/Credenciales/swiss.png", "swiss", item).then(function (data) {
			if (item.NroCredencial != "") { _TOOLS.drawItemCredential(data, item, "swiss"); }
		});
		$(".area-swiss").removeClass("d-none");
		$(".title-credencial").show();
	},
	drawCredentialGerdanna: function (item) {
		$(".area-gerdanna").html("").removeClass("card-loader").removeClass("skeleton").addClass("d-none");
		_TOOLS.drawCredential("canvasGerdanna", "/img/Credenciales/gerdanna.png", "gerdanna", item).then(function (data) {
			if (item.NroCredencial != "") { _TOOLS.drawItemCredential(data, item, "gerdanna"); }
		});
		$(".area-gerdanna").removeClass("d-none");
		$(".title-credencial").show();
	},
	drawCredential: function (_canva, _file, _mode, data) {
		return new Promise(
			function (resolve, reject) {
				try {
					var canvas = document.createElement('canvas');
					canvas.width = 640;
					canvas.height = 406;
					const ctx = canvas.getContext('2d');
					let img = new Image();
					img.addEventListener("load", () => {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.reset();
						ctx.drawImage(img, 0, 0);
						var _NroCredencial = data.NroCredencial;
						var _Nombre = data.Nombre;
						var _FechaIngreso = data.FechaIngreso;
						var _FechaNacimiento = data.FechaNacimiento;
						switch (_mode) {
							case "clubredondo":
								break;
							case "swiss":
								ctx.fillStyle = "rgb(76, 76, 76)";
								ctx.font = '25px Lato-black';
								ctx.fillText(_NroCredencial, 54, 150);
								ctx.fillText(_Nombre, 54, 185);
								ctx.font = '20px Lato-black';
								ctx.fillText(_FechaIngreso, 110, 222);
								ctx.fillText(_FechaNacimiento, 320, 222);
								break;
							case "gerdanna":
								ctx.fillStyle = "rgb(255, 255, 255)";
								ctx.font = '24px Roboto-light';
								ctx.fillText(_Nombre, 40, 285);
								ctx.font = '24px Roboto-black';
								ctx.fillText(_NroCredencial, 40, 320);
								break;
						}
						var _b64 = canvas.toDataURL("image/png");
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.reset();
						resolve(_b64);
					});
					img.src = _file;
				} catch (err) {
					reject(null);
				}
			});
	},
	drawItemCredential: function (data, _record, _tipo) {
		$(".area-" + _tipo).removeClass("skeleton");
		$(".area-" + _tipo).removeClass("card-loader");
		var _html = "<img class='img-tarjeta p-1' src='" + data + "' alt='Credencial' style='width:100%;padding:5px;' />";
		if (parseInt(_record.IDParentesco) == 1) {
			$(".area-" + _tipo).prepend(_html);
		} else {
			$(".area-" + _tipo).append(_html);
		}
	},
	isInSecurityGroups: function (_group, _target) {
		var _ret = false;
		var _groups = $(_target).val().split(",");
		_groups.forEach(function (value, index, array) { if (!_ret) { _ret = (value == _group); } });
		return _ret;
	},
	validarLargoCBU: function (cbu) {
		if (cbu.length != 22) { return false; }
		return true;
	},
	validarCodigoBanco: function (codigo) {
		if (codigo.length != 8) { return false; }
		var banco = codigo.substr(0, 3);
		var digitoVerificador1 = codigo[3];
		var sucursal = codigo.substr(4, 3);
		var digitoVerificador2 = codigo[7];
		var suma = banco[0] * 7 + banco[1] * 1 + banco[2] * 3 + digitoVerificador1 * 9 + sucursal[0] * 7 + sucursal[1] * 1 + sucursal[2] * 3;
		var diferencia = 10 - (suma % 10);
		return (diferencia == digitoVerificador2);
	},
	validarCuenta: function (cuenta) {
		if (cuenta.length != 14) { return false; }
		var digitoVerificador = cuenta[13];
		var suma = cuenta[0] * 3 + cuenta[1] * 9 + cuenta[2] * 7 + cuenta[3] * 1 + cuenta[4] * 3 + cuenta[5] * 9 + cuenta[6] * 7 + cuenta[7] * 1 + cuenta[8] * 3 + cuenta[9] * 9 + cuenta[10] * 7 + cuenta[11] * 1 + cuenta[12] * 3;
		var diferencia = 10 - (suma % 10);
		if (diferencia == 10) { diferencia = 0; }
		return (diferencia == digitoVerificador);
	},
	validarCBU: function (cbu) {
		return _TOOLS.validarLargoCBU(cbu) && _TOOLS.validarCodigoBanco(cbu.substr(0, 8)) && _TOOLS.validarCuenta(cbu.substr(8, 14));
	},
	validarPAN: function (pan) {
		if (pan.length != 16) { return false; }
		return true;
	},
	sortTable: function (tableId, columnIndex,_type) {
		var table = document.getElementById(tableId);
		var tbody = table.querySelector('tbody');
		var rows = Array.from(tbody.querySelectorAll('tr'));
		var isAscending = table.dataset.sortDirection === 'asc' && table.dataset.sortColumn === String(columnIndex);
		rows.sort((rowA, rowB) => {
			var cellA = rowA.cells[columnIndex].textContent.trim();
			var cellB = rowB.cells[columnIndex].textContent.trim();
			// Add logic here to handle different data types (e.g., convert to numbers for numeric columns)
			switch (_type) {
				case "N":
					if (isAscending) {
						return cellA.localeCompare(cellB, false, {numeric:true});
					} else {
						return cellB.localeCompare(cellA, false, { numeric: true });
					}
					if (isAscending) {
						return parseFloat(cellA) < parseFloat(cellB);
					} else {
						return parseFloat(cellB) < parseFloat(cellA);
					}
					break;
				default:
					if (isAscending) {
						return cellA.localeCompare(cellB); // For string comparison
					} else {
						return cellB.localeCompare(cellA);
					}
			}
		});
		table.dataset.sortDirection = isAscending ? 'desc' : 'asc';
		table.dataset.sortColumn = columnIndex;
		while (tbody.firstChild) {tbody.removeChild(tbody.firstChild);}
		rows.forEach(row => tbody.appendChild(row));
	},

// Example usage (attach to a header click event)
// document.getElementById('myHeader').addEventListener('click', () => sortTable('myTable', 0));

}