var _PAYMENTS = {
	_itemsPagos: [],
	_TMR_PAY_BOTONPAGO: 0,
	DNI:"",
	FISERV_STOREID: "5930544571808",
	FISERV_SHAREDSECRET: "EEt8*{6pEh",
	FISERV_URL: "https://www5.ipg-online.com/connect/gateway/processing",
	URL_ERROR: "https://fiserv.credipaz.com/webhooks/FiservError",
	URL_OK: "https://fiserv.credipaz.com/webhooks/FiservOk",
	URL_NOTIFY: "https://fiserv.credipaz.com/webhooks/FiservNotify",
	GetToday:function(){
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
		return (year + ":" + month + ":" + day + "-" + hour + ":" + minute + ":" + second);
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
	formatChargeTotal: function (str) {
		var part = str.toString().split(".");
		return (part[0] + "." + part[1].slice(0, 2));
	},
	isset: function (_val) {
		return (typeof _val !== undefined);
	},
	hash: function (alg, str) {
		var msgBuffer = new TextEncoder().encode(str);
		var hashBuffer = crypto.subtle.digest(alg, msgBuffer);
		var hashArray = Array.from(new Uint8Array(hashBuffer));
		var hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
		return hashHex;
	},
	bin2hex: function (str) {
		var hex = '';
		for (var i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i);
			hex += charCode.toString(16).padStart(2, '0');
		}
		return hex;
	},
	totalizePayment: function (_this) {
		var _pagoTarjeta = 0;
		var _reset = _this.attr("data-reset");
		var _sort = parseInt(_this.attr("data-sort"));
		var _total = 0;
		var _color = "";
		var _rec = "";

		_PAYMENTS._itemsPagos = [];
		$(".divForm").fadeOut("fast").html("");
		if (_reset != "") {
			$(_reset).prop("checked", false);
		}
		else {
			$(".chkCre").each(function () {
				var _dataSort = parseInt($(this).attr("data-sort"));
				if (_dataSort != 9999) {
					if (_dataSort <= _sort) {
						$(this).prop("checked", true);
					} else {
						$(this).prop("checked", false);
					}
				}
			});
		}
		if (_reset == ".chkTarMin" || _reset == ".chkTarTot") { $(".otro_monto").val(""); }

		if ($(".samImporte").val() != undefined) {
			$(".samImporte").css("background-color", "white");
			$(".samImporte").each(function () {
				_rec = "";
				var _samMin = parseInt($(this).attr("min"));
				var _samMax = parseInt($(this).attr("max"));
				var _samImporte = parseInt($(this).val());
				_color = "lightgreen";
				if (_samImporte != "" && (_samImporte < _samMin || _samImporte > _samMax)) {
					alert("Solo puede pagar un mínimo de $ " + _samMin + " o un máximo de $ " + _samMax);
					$(this).val(0);
					_color = "pink";
				} else {
					_rec = JSON.parse(_TOOLS.b64_to_utf8($(this).attr("data-record")));
					_rec.Importe = _samImporte.toFixed(2).toString();
					$(this).attr("data-record", _TOOLS.utf8_to_b64(JSON.stringify(_rec)));
					_total += _samImporte;
					if (_samImporte != 0) { _PAYMENTS._itemsPagos.push(_rec); }
				}
				$(this).css("background-color", _color);
			});
		}
		if ($(".otro_monto").val() != undefined) {
			$(".otro_monto").css("background-color", "white");
			_rec = "";
			var _otro_monto = parseFloat($(".otro_monto").val().replaceAll(".", "").replaceAll(",", "."));
			if (isNaN(_otro_monto)) {
				$(".otro_monto").val("");
				_otro_monto = 0;
			} else {
				var _tar_min = parseFloat($(".chkTarMin").val());
				var _tar_tot = parseFloat($(".chkTarTot").val());
				_rec = JSON.parse(_TOOLS.b64_to_utf8($(".otro_monto").attr("data-record")));
				if (_otro_monto != 0) {
					if (isNaN(_tar_min)) { _tar_min = 0; }
					if (isNaN(_tar_tot)) { _tar_tot = 0; }
					_color = "lightgreen";
					if (_otro_monto < _tar_min || _otro_monto > _tar_tot) { _color = "pink"; }
					$(".otro_monto").css("background-color", _color);
					$(".chkTar").prop("checked", false);
					_total += _otro_monto;
				}
				if (_otro_monto == null || _otro_monto == "") { _otro_monto = 0; }
				_rec.Importe = _otro_monto.toFixed(2).toString();
				if (_tar_tot != 0) { _pagoTarjeta = 1; }
			}
			if (_otro_monto != 0) { _PAYMENTS._itemsPagos.push(_rec); }
		}
		$(".chkPay").each(function () {
			var _rec = JSON.parse(_TOOLS.b64_to_utf8($(this).attr("data-record")));
			if ($(this).prop("checked")) {
				if (_rec.Importe == null || _rec.Importe == "") { _rec.Importe = 0; }
				if (parseFloat(_rec.Importe) != 0) {
					_rec.Importe = _rec.Importe.toFixed(2).toString();
					_PAYMENTS._itemsPagos.push(_rec);
					_total += parseFloat(this.value);
				}
			}
		});
		/*consolidar total contra los items registrados! */
		var _total_consolidado = 0;
		for (var item of _PAYMENTS._itemsPagos) { _total_consolidado += (item.Importe * 1); }
		_total = _total_consolidado;
		$(".coinTotal").html(_TOOLS.formatMoney(_total, 2));
		if (_total.toString().indexOf(".") == -1) { _total += ".00"; }
		var chargetotal = _PAYMENTS.formatChargeTotal(_total.toString());
		$(".importe").val(_total);
		if (_total_consolidado > 0) {
			var _targetFrame = "iframe_fiserv";
			var _location = window.location.href;
			var _json = {
				"pagoTarjeta": _pagoTarjeta,
				"paymentMethod": "",
				"currency": "032",
				"total": _total,
				"dni": _PAYMENTS.DNI,
				"itemsPagos": JSON.stringify(_PAYMENTS._itemsPagos),
				"targetFrame": _targetFrame,
				"sandbox": 0,
				"visible": 1,
				"parentUri": _location
			};
			var _html=_PAYMENTS.onBuildFormFiserv(_json);
			$(".divForm").html(_html).fadeIn("fast");
			$("#comments").val(JSON.stringify(_PAYMENTS._itemsPagos));
			$(".data-payment1").removeClass("d-none");
			$(".data-payment2").addClass("d-none");
		} else {
			$(".data-payment1").addClass("d-none");
			$(".data-payment2").addClass("d-none");
		}
	},
	onLoadPaymentData: function (_interval, data, _importe_forzado) {
		_timer = setTimeout(function () {
			clearTimeout(_timer);
			$(".div-msg-intranet").html("").addClass("d-none");
			$(".div-msg-web").html("").hide();
			$(".div-datos").removeClass("d-none");
			$(".datos-informados").html(_PAYMENTS.onBuildPaymentsByForm(data, _importe_forzado)).removeClass("d-none");
			var element = document.getElementById('otro_monto');
			if (element != null) {
				var maskOptions = { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, normalizeZeros: true, radix: ',', mapToRadix: ['.'], min: 0, max: 999999999, autofix: true, };
				var mask = IMask(element, maskOptions);
			}
			if ($(".samImporte").val() != undefined) { _PAYMENTS.totalizePayment($(".samImporte")); }
			if ($(".moraImporte").val() != undefined) { _PAYMENTS.totalizePayment($(".moraImporte")); }
			if (parseFloat(_importe_forzado) != 0) {
				$(".chkPay").prop("checked", true).prop("disabled", true);
				_PAYMENTS.totalizePayment($(".chkPay"));
			}
			$("body").off("change", ".cbo-cards").on("change", ".cbo-cards", function () {
				_COIN.getQuotes($(this));
			});
			$("body").off("change", ".cbo-quotes").on("change", ".cbo-quotes", function () {
				var _val = $('.cbo-quotes option:selected').data('amount');
				var _importe = _TOOLS.formatMoney(_val, 2);
				$(".coinTotal").html(_importe);
				_COIN.setQuote($(this));
			});
			$("body").off("change", ".chkPay").on("change", ".chkPay", function () {
				_PAYMENTS.totalizePayment($(this));
			});
			$("body").off("keydown", ".otro_monto").on("keydown", ".otro_monto", function (e) {
				$(".data-payment1").addClass("d-none");
			});
			$("body").off("keyup", ".otro_monto").on("keyup", ".otro_monto", function (e) {
				$(".data-payment1").addClass("d-none");
				clearTimeout(_PAYMENTS._TIMER_LAZY);
				_PAYMENTS._TIMER_LAZY = setTimeout(function () { _PAYMENTS.totalizePayment($(this)); }, 500);
			});
			$("body").off("keydown", ".samImporte").on("keydown", ".samImporte", function (e) {
				$(".data-payment1").addClass("d-none");
			});
			$("body").off("keyup", ".samImporte").on("keyup", ".samImporte", function (e) {
				$(".data-payment1").addClass("d-none");
				clearTimeout(_PAYMENTS._TIMER_LAZY);
				_PAYMENTS._TIMER_LAZY = setTimeout(function () { _PAYMENTS.totalizePayment($(this)); }, 500);
			});
			$("body").off("keydown", ".moraImporte").on("keydown", ".moraImporte", function (e) {
				$(".data-payment1").addClass("d-none");
			});
			$("body").off("keyup", ".moraImporte").on("keyup", ".moraImporte", function (e) {
				$(".data-payment1").addClass("d-none");
				clearTimeout(_PAYMENTS._TIMER_LAZY);
				_PAYMENTS._TIMER_LAZY = setTimeout(function () { _PAYMENTS.totalizePayment($(this)); }, 500);
			});
		}, _interval);
	},
	onBuildPaymentsByForm(data, _importe_forzado) {
		var _bDirty = false;
		var _html = "";
		_html += _PAYMENTS.onBuildItemsTarjeta(data.TAR, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCredito(data.CRE, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsSAM(data.SAM, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsMORA(data.MOR, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCuotaInicialCR(data.CICR, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCuotaCRDO(data.CRDO, _importe_forzado);
		_bDirty = (_html != "");
		if (!_bDirty) {
			_html = "<h3>Sin datos para este documento</h3>";
		} else {
			_html += "<table style='width:100%;font-size:18px;margin-top:15px;border:dowuble 3px silver;'>";
			_html += "<tr>";
			_html += "   <td colspan='2'><b>TOTAL A PAGAR</b></td>";
			_html += "   <td align='right' class='coinTotal' style='font-size:18px;font-weight:bold;padding:10px;'></td>";
			_html += "   <td></td>";
			_html += "</tr>";
			_html += "</table>";
		}
		return _html;
	},
	onBuildItemsTarjeta: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data != null && data.length > 0) {
			_html += "<h5>Tarjeta - " + data[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Minimo };
					var _rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td style='width:75%;'>Pago mínimo</td>";
					_html += "   <td style='width:2%;' align='left'></td>";
					_html += "   <td style='width:100px;' align='right'>" + _TOOLS.formatMoney(item.Minimo, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='-999' data-reset='.chkTarTot' type='checkbox' class='chkPay chkTarMin chkTar' id='chkPay' name='chkPay' value='" + item.Minimo + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
					_data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td style='width:75%;'>Pago total</td>";
					_html += "   <td style='width:2%;' align='left'></td>";
					_html += "   <td style='width:100px;' align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='-999' data-reset='.chkTarMin' type='checkbox' class='chkPay chkTarTot chkTar' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
					_data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": 0 };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td style='width:75%;'>Otro monto</td>";
					_html += "   <td style='width:2%;' align='left'>$</td>";
					_html += "   <td style='width:100px;' align='right'><input onclick='this.select();' data-reset='.chkTar' style='width:100px;text-align:right;-webkit-appearance:none;margin:0;' type='text' id='otro_monto' name='otro_monto' class='form-control otro_monto' value='' data-record='" + _rec + "'/></td>";
					_html += "   <td align='left' style='width:15%;'></td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsCredito: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data != null && data.length > 0) {
			_html += "<h5>Crédito - " + data[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Vto.</td>";
			_html += "   <td align='center'>Nº</td>";
			_html += "   <td align='right'>Cuotas</td>";
			_html += "   <td align='right'>Punit.</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					var _rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td align='center'>" + item.Vto + "</td>";
					_html += "   <td align='center'>" + item.Cuota + "</td>";
					_html += "   <td align='right'>" + _TOOLS.formatMoney(item.ImporteCuota, 2) + "</td>";
					_html += "   <td align='right'>" + _TOOLS.formatMoney(item.Punitorios, 2) + "</td>";
					_html += "   <td align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='" + i + "' data-reset='' type='checkbox' class='chkPay chkCre' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsSAM: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		var _rec = null;
		if (data != null && data.length > 0) {
			_html += "<h5>SAM - " + data[0].Nombre + "</h5>";
			_html += "<table style='font-size:14px;'>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Minimo };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td>" + item.Descripcion + " #" + item.Identificacion + "</td>";
					_html += "   <td align='right' style='padding-left:15px;'>";
					_html += "      $ <input style='display:inline;width:100px;text-align:right;-webkit-appearance:none;margin:0;' min='" + parseInt(item.Minimo) + "' max='" + parseInt(item.Total) + "' type='number' id='samImporte' name='samImporte' class='form-control samImporte' value='" + parseInt(item.Minimo) + "' data-record='" + _rec + "' />";
					_html += "   (Mínimo " + _TOOLS.formatMoney(item.Minimo, 2) + " Máximo " + _TOOLS.formatMoney(item.Total, 2) + ")";
					_html += "   </td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsMORA: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		var _rec = null;
		if (data != null && data.length > 0) {
			_html += "<h5>Mora - " + data[0].Nombre + "</h5>";
			_html += "<table style='font-size:14px;'>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td style='width:75%;'>" + item.Descripcion + " #" + item.Identificacion + "</td>";
					_html += "   <td style='width:2%;' align='left'></td>";
					_html += "   <td style='width:100px;' align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='-999' data-reset='.chkMoraTot' type='checkbox' class='chkPay chkMoraMin chkMora' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsCuotaInicialCR: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data != null && data.length > 0) {
			_html += "<h5>Cuota inicial Mediya - " + data[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Concepto</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					if (parseFloat(_importe_forzado) != 0) { item.Total = parseFloat(_importe_forzado); }
					if (parseFloat(_importe_forzado) != 0 && i != 0) { return true; }
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					var _rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td align='center'>" + item.Descripcion + "</td>";
					_html += "   <td align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='9999' data-reset='' type='checkbox' class='chkPay chkCre' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsCuotaCRDO: function (data, _importe_forzado) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data != null && data.length > 0) {
			_html += "<h5>Mediya - " + data[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Concepto</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					var _rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td align='center'>" + item.Descripcion + "</td>";
					_html += "   <td align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					//_html += "   <td align='center' style='width:15%;'><input data-sort='" + i + "' data-reset='' type='checkbox' class='chkPay chkCre' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='9999' data-reset='' type='checkbox' class='chkPay chkCre' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},

	onBuildFormFiserv: function (values) {
		if (!_PAYMENTS.isset(values.parentUri)) { values.parentUri = ""; }
		if (!_PAYMENTS.isset(values.pagoTarjeta)) { values.pagoTarjeta = 0; }
		if (!_PAYMENTS.isset(values.paymentMethod)) { values.paymentMethod = ""; }
		if (!_PAYMENTS.isset(values.styleButton)) { values.styleButton = ""; }
		if (values.styleButton == "") { values.styleButton = "border-radius:5px;padding:3px;color:black;border:solid 1px white !important;background-color:WHITE !important;"; }
		if (!_PAYMENTS.isset(values.currency)) { values.currency = "032"; }
		if (!_PAYMENTS.isset(values.dni)) { values.dni = ""; }
		if (!_PAYMENTS.isset(values.installments)) { values.installments = 0; }
		if (parseInt(values.installments) == 0) { values.installments = 1; }
		if (!_PAYMENTS.isset(values.responseFailURL)) { values.responseFailURL = ""; }
		if (!_PAYMENTS.isset(values.responseSuccessURL)) { values.responseSuccessURL = ""; }
		if (!_PAYMENTS.isset(values.targetFrame)) { values.targetFrame = "iframe_fiserv"; }

		if (values.responseFailURL == "") { values.responseFailURL = _PAYMENTS.URL_ERROR; }
		if (values.responseSuccessURL == "") { values.responseSuccessURL = _PAYMENTS.URL_OK; }
		var hostURI = _PAYMENTS.URL_NOTIFY;
		var transactionNotificationURL = _PAYMENTS.URL_NOTIFY;
		var checkoutoption = "classic";
		var txntype = "sale";
		var timezone = "America/Buenos_Aires";
		var txndatetime = _PAYMENTS.GetToday();
		var currency = values.currency;
		var chargetotal = _PAYMENTS.formatChargeTotal(values.total.toString());

		if (values.itemsPagos == undefined || values.itemsPagos == null || values.itemsPagos.length == 0) {
			values.itemsPagos = [];
			var _rec = { "Tipo": "TAR", "Identificacion": (values.dni + " Pago tarjeta"), "Importe": chargetotal, "idTransfer": 0 };
			values.itemsPagos.push(_rec);
			values.itemsPagos = JSON.stringify(values.itemsPagos);
		}
		values.itemsPagos = JSON.parse(values.itemsPagos, true);
		var identificacion = values.itemsPagos[0].Identificacion;
		var responseFailURL = values.responseFailURL;
		var responseSuccessURL = values.responseSuccessURL;
		var authenticateTransaction = "false";
		var mode = "payonly";
		var cardFunction = "";
		var dynamicMerchantName = "";
		var invoicenumber = "";
		var item1 = "";
		var language = "es_ES";
		var merchantTransactionId = "";
		var mobileMode = "true";
		var numberOfInstallments = 1;
		var oid = "";
		//Si viene vacío muestra todas las tarjetas posibles, sino hay que pasarle los valores desde la implementación!
		var paymentMethod = values.paymentMethod;
		var refer = "";
		var referencedMerchantTransactionID = "";
		var referencedSchemeTransactionId = "";
		var shipping = "";
		var trxOrigin = "ECI";
		var vattax = "";
		var hash_algorithm = "SHA256";
		var parentUri = values.parentUri;
		var action = _PAYMENTS.FISERV_URL;
		var storeID = _PAYMENTS.FISERV_STOREID;
		var sharedSecret = _PAYMENTS.FISERV_SHAREDSECRET;
		var stringToHash = (storeID + txndatetime + chargetotal + currency + sharedSecret);
		var extendedHash = _PAYMENTS.hash("SHA-256", _PAYMENTS.bin2hex(stringToHash));
		action += ("?" + _PAYMENTS.UUID());
		var html = "";

		html += "  <form id='checkoutform' method='post' action='" + action + "' target='" + values.targetFrame + "'>";
		html += "   <table style='width:100%;' class='tbl-fiserv'>";
		/*Mandatory*/
		html += "    <tr><td style='font-weight:bold;'>parentUri</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='parentUri' name='parentUri' value='" + parentUri + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>checkoutoption</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='checkoutoption' name='checkoutoption' value='" + checkoutoption + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>hostURI</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='hostURI' name='hostURI' value='" + hostURI + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>txntype</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='txntype' name='txntype' value='" + txntype + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>timezone</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='timezone' name='timezone' value='" + timezone + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>txndatetime</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='txndatetime' name='txndatetime' value='" + txndatetime + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>hash_algorithm</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='hash_algorithm' name='hash_algorithm' value='" + hash_algorithm + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>hash</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='hash' name='hash' value='" + extendedHash + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>storename</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='storename' name='storename' value='" + storeID + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>currency</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='currency' name='currency' value='" + currency + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>chargetotal</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='chargetotal' name='chargetotal' value='" + chargetotal + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>responseFailURL</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='responseFailURL' name='responseFailURL' value='" + responseFailURL + "'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>responseSuccessURL</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='responseSuccessURL' name='responseSuccessURL' value='" + responseSuccessURL + "'/></td></tr>";
		//html+="    <tr><td style='font-weight:bold;'>transactionNotificationURL</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='transactionNotificationURL' name='transactionNotificationURL' value='"+transactionNotificationURL+"'/></td></tr>";
		html += "    <tr><td style='font-weight:bold;'>authenticateTransaction</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='authenticateTransaction' name='authenticateTransaction' value='" + authenticateTransaction + "'/></td></tr>";
		/*Optionals*/
		html += "    <tr><td style='font-weight:bold;'>mode</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='mode' name='mode' value='" + mode + "'/></td></tr>";
		if (cardFunction != "") { html += "<tr><td style='font-weight:bold;'>cardFunction</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='cardFunction' name='cardFunction' value='" + cardFunction + "'/></td></tr>"; }
		html += "<tr><td style='font-weight:bold;'>comments</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='comments' name='comments' value=''/></td></tr>";
		if (identificacion != "") { html += "<tr><td style='font-weight:bold;'>customerid</td><td style='width:100%;'><input sclass='dataPost' tyle='width:100%;' type='text' id='customerid' name='customerid' value='" + identificacion + "'/></td></tr>"; }
		if (dynamicMerchantName != "") { html += "<tr><td style='font-weight:bold;'>dynamicMerchantName</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='dynamicMerchantName' name='dynamicMerchantName' value='" + dynamicMerchantName + "'/></td></tr>"; }
		if (invoicenumber != "") { html += "<tr><td style='font-weight:bold;'>invoicenumber</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='invoicenumber' name='invoicenumber' value='" + invoicenumber + "'/></td></tr>"; }
		if (item1 != "") { html += "<tr><td style='font-weight:bold;'>item1</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='item1' name='item1' value='" + item1 + "'/></td></tr>"; }
		if (language != "") { html += "<tr><td style='font-weight:bold;'>language</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='language' name='language' value='" + language + "'/></td></tr>"; }
		if (merchantTransactionId != "") { html += "<tr><td style='font-weight:bold;'>merchantTransactionId</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='merchantTransactionId' name='merchantTransactionId' value='" + merchantTransactionId + "'/></td></tr>"; }
		if (mobileMode != "") { html += "<tr><td style='font-weight:bold;'>mobileMode</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='mobileMode' name='mobileMode' value='" + mobileMode + "'/></td></tr>"; }
		if (numberOfInstallments != "") { html += "<tr><td style='font-weight:bold;'>numberOfInstallments</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='numberOfInstallments' name='numberOfInstallments' value='" + numberOfInstallments + "'/></td></tr>"; }
		if (oid != "") { html += "<tr><td style='font-weight:bold;'>oid</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='oid' name='oid' value='" + oid + "'/></td></tr>"; }
		html += "<tr><td style='font-weight:bold;'>paymentMethod</td><td style='width:100%;'><input class='dataPost paymentMethod' style='width:100%;' type='text' id='paymentMethod' name='paymentMethod' value='" + paymentMethod + "'/></td></tr>";
		if (refer != "") { html += "<tr><td style='font-weight:bold;'>refer</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='refer' name='refer' value='" + refer + "'/></td></tr>"; }
		html += "<tr><td style='font-weight:bold;'>referencedMerchantTransactionID</td><td class='dataPost' style='width:100%;'><input style='width:100%;' type='text' id='referencedMerchantTransactionID' name='referencedMerchantTransactionID' value='" + referencedMerchantTransactionID + "'/></td></tr>";
		if (referencedSchemeTransactionId != "") { html += "<tr><td style='font-weight:bold;'>referencedSchemeTransactionId</td><td class='dataPost' style='width:100%;'><input style='width:100%;' type='text' id='referencedSchemeTransactionId' name='referencedSchemeTransactionId' value='" + referencedSchemeTransactionId + "'/></td></tr>"; }
		if (shipping != "") { html += "<tr><td style='font-weight:bold;'>shipping</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='shipping' name='shipping' value='" + shipping + "'/></td></tr>"; }
		if (trxOrigin != "") { html += "<tr><td style='font-weight:bold;'>trxOrigin</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='trxOrigin' name='trxOrigin' value='" + trxOrigin + "'/></td></tr>"; }
		if (vattax != "") { html += "<tr><td style='font-weight:bold;'>vattax</td><td style='width:100%;'><input class='dataPost' style='width:100%;' type='text' id='vattax' name='vattax' value='" + vattax + "'/></td></tr>"; }
		html += "   </table>";
		html += "   <br/>";
		html += "   <h3>Seleccione tarjeta y complete sus datos de pago</h3>";
		html += "   <a href='#' data-tc='' class='btn btn-raised btn-info btn-pagar-fiserv btn-all'>Elegir tarjeta para el pago</a>";
		html += "  </form>";

		return html;
	},
onCheckStatusPaymentBotonPago: function (_idTransfer_botonpago, _dni) {
		var _json = {
			"module": "mod_payments",
			"table": "transactions",
			"model": "transactions",
			"page": 1,
			"pagesize": 1,
			"where": ("id=" + _idTransfer_botonpago),
			"order": "description ASC",
		};
		_AJAX.UiGetTransparent(_json).then(function (datajson) {
			if (datajson.data[0].status != "INICIADO") {
				clearInterval(_FUNCTIONS._TMR_PAY_BOTONPAGO);
				if (datajson.data[0].status == "APROBADO") {
					$(".data-payment1").addClass("d-none");
					$(".btn-deuda-fiserv").click();
					$(".id_payment").val(0);
					$(".code_payment").val(_idTransfer_botonpago); //id en mod_payments_transactions
					var response = { "now": _TOOLS.getNow(), "apiReference": _idTransfer_botonpago };
					var _fulldata = { "dni": _dni, "MedioPago": datajson.data[0].partial_card_number };
					var _raw_request = JSON.parse(datajson.data[0].raw_request);
					_raw_request = JSON.parse(_raw_request["comments"]);
					_FUNCTIONS.onWindowComprobante(response, _fulldata, _raw_request);
				} else {
					_FUNCTIONS.onAlert({ "class": "alert-danger", "message": "Su pago no ha podido ser procesado.  Reintente con otro medio de pago." });
					//setTimeout(function () { window.location.reload(); }, 3000);
				}
			}
		}).catch(function (error) {
			alert("id:" + _idTransfer_botonpago + " " + error.message);
		});
	},
onWindowComprobante: function (response, _fulldata, _raw_request) {
		var _identificaciones = "";
		var _html = "<div style='max-width:540px;width:100%;font-family:arial;border:solid 2px black;padding:5px;' class='data-pdf'>";
		_html += "<input type='hidden' id='code' name='code' value='" + _fulldata.dni + "' class='code dbaseComprobante'/>";
		_html += "<input type='hidden' id='description' name='description' value='comprobanteCOIN' class='description dbaseComprobante'/>";
		_html += "<input type='hidden' id='base64' name='base64' value='' class='base64 dbaseComprobante'/>";
		_html += "<input type='hidden' id='filename' name='filename' value='Comprobante de pago " + _TOOLS.UUID() + ".pdf' class='filename dbaseComprobante'/>";
		_html += "<input type='hidden' id='extension' name='extension' value='pdf' class='extension dbaseComprobante'/>";
		_html += "      <table style='width:100%;font-family:calibri;padding:5px;'>";
		_html += "         <tr>";
		switch (_raw_request[0].Tipo) {
			case "CRDO":
			case "CICR":
				_html += "<td align='center' valign='middle'>";
				_html += "   <img src='https://intranet.credipaz.com/assets/credipaz/img/mediya.png' style='width:75px;'/>";
				_html += "</td>";
				break;
			default:
				_html += "<td align='center' valign='middle' style='border:solid 1px black;background-color:rgb(230,0,150);'>";
				_html += "   <span style='font-weight:bold;font-size:40px;color:yellow;'>CREDIPAZ</span>";
				_html += "</td>";
				break;
		}
		_html += "         </tr>";
		_html += "         <tr>";
		_html += "            <td align='center' valign='middle' style='border-bottom:solid 1px silver;'>";
		_html += "               <span style='font-weight:bold;font-size:24px;'>Comprobante de pago</span>";
		_html += "            </td>";
		_html += "         </tr>";
		for (_item of _raw_request) {
			switch (_item.Tipo) {
				case "TAR":
					_html += "         <tr>";
					_html += "            <td align='center' valign='middle' style='font-size:24px;'>TARJETA CABAL CREDIPAZ</td>";
					_html += "         </tr>";
					break;
				case "CRE":
					_html += "         <tr>";
					_html += "            <td align='center' valign='middle' style='font-size:24px;'>CRÉDITO</td>";
					_html += "         </tr>";
					break;
				case "CICR":
					_html += "         <tr>";
					_html += "            <td align='center' valign='middle' style='font-size:24px;'>MEDIYA Cuota Anticipada</td>";
					_html += "         </tr>";
					break;
				case "CRDO":
					_html += "         <tr>";
					_html += "            <td align='center' valign='middle' style='font-size:24px;'>MEDIYA Cuota</td>";
					_html += "         </tr>";
					break;
				case "ACU":
					_html += "         <tr>";
					_html += "            <td align='center' valign='middle' style='font-size:24px;'>ACUERDO DE PAGO</td>";
					_html += "         </tr>";
					break;
			}
			_html += "         <tr>";
			_html += "            <td align='center' valign='middle' style='font-weight:bold;font-size:24px;'>$ " + _item.Importe + "</td>";
			_html += "            <td align='center' valign='middle' style='font-weight:bold;font-size:12px;'>(Importe sujeto a confirmación de cobro)</td>";
			_html += "         </tr>";
			if (_identificaciones != "") { _identificaciones += ", " }
			_identificaciones += _item.Identificacion;
		}
		_html += "         <tr>";
		_html += "            <td align='center' valign='middle'>";
		_html += "               <table align='center' style='width:80%;padding:5px;' cellspacing='0'>";
		_html += "                  <tr>";
		_html += "                     <td align='left' valign='top' style='border-top:solid 1px black;'>Identificación</td>";
		_html += "                     <td align='right' valign='top' style='border-top:solid 1px black;'>" + _identificaciones + "</td>";
		_html += "                  </tr>";
		_html += "                  <tr>";
		_html += "                     <td align='left' valign='top' style='border-top:solid 1px black;'>Medio de pago</td>";
		_html += "                     <td align='right' valign='top' style='border-top:solid 1px black;'>" + _fulldata.MedioPago + "</td>";
		_html += "                  </tr>";
		_html += "                  <tr>";
		_html += "                     <td align='left' valign='top' style='border-top:solid 1px black;'>Fecha de pago</td>";
		_html += "                     <td align='right' valign='top' style='border-top:solid 1px black;'>" + response.now + "</td>";
		_html += "                  </tr>";
		_html += "                  <tr>";
		_html += "                     <td align='left' valign='top' style='border-top:solid 1px black;border-bottom:solid 1px black;'>Número de pago</td>";
		_html += "                     <td align='right' valign='top' style='border-top:solid 1px black;border-bottom:solid 1px black;'>" + response.apiReference + "</td>";
		_html += "                  </tr>";
		_html += "               </table>";
		_html += "            </td>";
		_html += "         </tr>";
		_html += "      </table>";
		_html += "   </div>";
		_html += "   <table align='center' style='width:100%;'>";
		_html += "      <tr>";
		_html += "         <td align='center' style='border-bottom:solid 1px grey;padding:5px;'>";
		_html += "            <a href='#' class='d-none btn btn-md btn-raised btn-success btnGetBase64'>Descargar PDF</a>";
		_html += "         </td>";
		_html += "      </tr>";
		_html += "   </table>";
		_FUNCTIONS.onShowInfoPDF(_html, "<b style='color:darkgreen;'>Pago procesado en forma exitosa</b>");
		$(".base64").val(_TOOLS.utf8_to_b64($(".data-pdf").html()));
		var _url = (_AJAX.server + "downloadBase64File/" + $(".code").val() + "/" + $(".description").val());
		$(".btnGetBase64").attr("href", _url);
		var _json = _TOOLS.getFormValues(".dbaseComprobante", null);
		_json["module"] = "mod_backend";
		_json["table"] = "Files_base64";
		_json["model"] = "Files_base64";
		_AJAX.UiSave(_json).then(function (data) {
			$(".btnGetBase64").removeClass("d-none");
		});
	},
	
}
