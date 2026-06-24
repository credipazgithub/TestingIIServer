
_PAYMENTS = {
	onLoadPaymentData: function (_interval, _form, _gateway, _importe_forzado = 0) {
		if (_importe_forzado == "") { _importe_forzado = 0; }
		_timer = setTimeout(function () {
			clearTimeout(_timer);
			$(".div-msg-intranet").html("").addClass("d-none")
			$(".div-msg-web").html("").hide();
			var _dni = $("#dni").val();
			var _json = { "form": _form, "gateway": _gateway, "dni": _dni, "function": "dataForPaymentsByType" };
			_AJAX.UiMediyaTransparent(_json).then(function (data) {
				var _inhabilitadaT = false;
				var _inhabilitadaC = false;
				if (data.status == "OK") {
					$(".div-datos").removeClass("d-none");
					$(".datos-informados").html(_PAYMENTS.onBuildPaymentsByForm(data, _importe_forzado)).removeClass("d-none");

					const element = document.getElementById('otro_monto');
					if (element != null) {
						const maskOptions = {
							mask: Number,
							scale: 2,
							thousandsSeparator: '.',
							padFractionalZeros: true,
							normalizeZeros: true,
							radix: ',',
							mapToRadix: ['.'],
							min: 0,
							max: 999999999,
							autofix: true,
						};
						const mask = IMask(element, maskOptions);
					}

					if ($(".samImporte").val() != undefined) { totalizePayment($(".samImporte")); }
					if ($(".moraImporte").val() != undefined) { totalizePayment($(".moraImporte")); }
					if (parseFloat(_importe_forzado) != 0) {
						$(".chkPay").prop("checked", true).prop("disabled", true);
						totalizePayment($(".chkPay"));
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
						totalizePayment($(this));
					});
					$("body").off("keydown", ".otro_monto").on("keydown", ".otro_monto", function (e) {
						$(".data-payment1").addClass("d-none");
					});
					$("body").off("keyup", ".otro_monto").on("keyup", ".otro_monto", function (e) {
						$(".data-payment1").addClass("d-none");
						clearTimeout(_PAYMENTS._TIMER_LAZY);
						_PAYMENTS._TIMER_LAZY = setTimeout(function () { totalizePayment($(this)); }, 500);
					});
					$("body").off("keydown", ".samImporte").on("keydown", ".samImporte", function (e) {
						$(".data-payment1").addClass("d-none");
					});
					$("body").off("keyup", ".samImporte").on("keyup", ".samImporte", function (e) {
						$(".data-payment1").addClass("d-none");
						clearTimeout(_PAYMENTS._TIMER_LAZY);
						_PAYMENTS._TIMER_LAZY = setTimeout(function () { totalizePayment($(this)); }, 500);
					});
					$("body").off("keydown", ".moraImporte").on("keydown", ".moraImporte", function (e) {
						$(".data-payment1").addClass("d-none");
					});
					$("body").off("keyup", ".moraImporte").on("keyup", ".moraImporte", function (e) {
						$(".data-payment1").addClass("d-none");
						clearTimeout(_PAYMENTS._TIMER_LAZY);
						_PAYMENTS._TIMER_LAZY = setTimeout(function () { totalizePayment($(this)); }, 500);
					});
				} else {
					throw data;
				}
			}).catch(function (err) {
				$(".div-msg-intranet").removeClass("d-none").html("<h1 class='mt-3 text-center' style='border-raius:10px;border:solid 1px red;color:red;'>" + err.message + "</h1>");
				$(".datos-informados").html("");
			});
		}, _interval);
	},
	onBuildPaymentsByForm(data, _importe_forzado = 0) {
		var _bDirty = false;
		var _html = "";
		_html += _PAYMENTS.onBuildItemsTarjeta(data, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCredito(data, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsSAM(data, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsMORA(data, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCuotaInicialCR(data, _importe_forzado);
		_html += _PAYMENTS.onBuildItemsCuotaCRDO(data, _importe_forzado);
		_bDirty = (_html != "");
		if (!_bDirty) {
			_html = "<h3>Sin datos para este documento</h3>";
		} else {
			_PAYMENTS.onReBuildLinkPago();
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
	onReBuildLinkPago: function () {
		var _link = $(".linkDni").val();
		var _dni = $(".dni_tarjeta").val();
		var _importe = $(".importe").val();
		if (_importe == "") { _importe = 0; }
		var _additional = (_dni + "|" + _importe);
		if (_link != "") {
			var _url = (window.location.origin + "/" + _link + "/" + _TOOLS.utf8_to_b64(_additional));
			if (_PAYMENTS._forcedAlias != "") {
				_url = (_PAYMENTS._forcedAlias + "/" + _link + "/" + _TOOLS.utf8_to_b64(_additional));
			}

			$(".div-msg-web").html("<table><tr><td><a href='#' class='btn bt-raised btn-sm btn-primary btn-raised btn-copySimple' data-source='myInput'><i class='material-icons'>share</i> Copiar Link de pago</a></td><td style='display:none;'><pre class='nd-button'>" + _url + "</pre></td></tr></table><input type='text' value='" + _url + "' id='myInput' class='d-none'>").fadeIn("fast");
			$(".div-msg-web").show();
		} else {
			$(".div-msg-web").html("");
		}
	},
	onBuildItemsTarjeta: function (data, _importe_forzado = 0) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data.data.tarjeta != null && data.data.tarjeta.length > 0) {
			_html += "<h5>Tarjeta - " + data.data.tarjeta[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			$.each(data.data.tarjeta, function (i, item) {
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
	onBuildItemsCredito: function (data, _importe_forzado = 0) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data.data.credito != null && data.data.credito.length > 0) {
			_html += "<h5>Crédito - " + data.data.credito[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Vto.</td>";
			_html += "   <td align='center'>Nº</td>";
			_html += "   <td align='right'>Cuotas</td>";
			_html += "   <td align='right'>Punit.</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data.data.credito, function (i, item) {
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
	onBuildItemsSAM: function (data, _importe_forzado = 0) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		var _rec = null;
		if (data.data.sam != null && data.data.sam.length > 0) {
			_html += "<h5>SAM - " + data.data.sam[0].Nombre + "</h5>";
			_html += "<table style='font-size:14px;'>";
			$.each(data.data.sam, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Minimo };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td>" + item["Descripcion"] + " #" + item.Identificacion + "</td>";
					_html += "   <td align='right' style='padding-left:15px;'>";
					_html += "      $ <input style='display:inline;width:100px;text-align:right;-webkit-appearance:none;margin:0;' min='" + parseInt(item.Minimo) + "' max='" + parseInt(item.Total) + "' type='number' id='samImporte' name='samImporte' class='form-control samImporte' value='" + parseInt(item.Minimo) + "' data-record='" + _rec + "' />"
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
	onBuildItemsMORA: function (data, _importe_forzado = 0) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		var _rec = null;
		if (data.data.mora != null && data.data.mora.length > 0) {
			_html += "<h5>Mora - " + data.data.mora[0].Nombre + "</h5>";
			_html += "<table style='font-size:14px;'>";
			$.each(data.data.mora, function (i, item) {
				if (item.Identificacion != "") {
					_bDirty = true;
					if (item.Total != null) { _total = (parseFloat(item.Total) > 0); }
					var _data = { "Tipo": item.Tipo, "Identificacion": item.Identificacion, "Importe": item.Total };
					_rec = _TOOLS.utf8_to_b64(JSON.stringify(_data));
					_html += "<tr>";
					_html += "   <td style='width:75%;'>" + item["Descripcion"] + " #" + item.Identificacion + "</td>";
					_html += "   <td style='width:2%;' align='left'></td>";
					_html += "   <td style='width:100px;' align='right'>" + _TOOLS.formatMoney(item.Total, 2) + "</td>";
					_html += "   <td align='center' style='width:15%;'><input data-sort='-999' data-reset='.chkMoraTot' type='checkbox' class='chkPay chkMoraMin chkMora' id='chkPay' name='chkPay' value='" + item.Total + "' data-record='" + _rec + "'/></td>";
					_html += "</tr>";

					//					_html += "<tr>";
					//					_html += "   <td>" + item["Descripcion"] + " #" + item.Identificacion + "</td>";
					//					_html += "   <td align='right' style='padding-left:15px;'>";
					//					_html += "      $ <input style='display:inline;width:100px;text-align:right;-webkit-appearance:none;margin:0;' min='" + parseInt(item.Minimo) + "' max='" + parseInt(item.Total) + "' type='number' id='moraImporte' name='moraImporte' class='form-control moraImporte' value='" + parseInt(item.Total) + "' data-record='" + _rec + "' />"
					//					_html += "   </td>";
					//					_html += "</tr>";
				}
			});
			_html += "</table>";
		}
		if (!_bDirty) { _html = ""; }
		if (!_total) { _html = ""; }
		return _html;
	},
	onBuildItemsCuotaInicialCR: function (data, _importe_forzado = 0) {
		if (_importe_forzado == "") { _importe_forzado = 0; }
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data.data.cuota_inicial_cr != null && data.data.cuota_inicial_cr.length > 0) {
			_html += "<h5>Cuota inicial Mediya - " + data.data.cuota_inicial_cr[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Concepto</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data.data.cuota_inicial_cr, function (i, item) {
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
	onBuildItemsCuotaCRDO: function (data, _importe_forzado = 0) {
		var _html = "";
		var _bDirty = false;
		var _total = false;
		if (data.data.cuota_inicial_crdo != null && data.data.cuota_inicial_crdo.length > 0) {
			_html += "<h5>Mediya - " + data.data.cuota_inicial_crdo[0].Nombre + "</h5>";
			_html += "<table style='width:100%;font-size:14px;'>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td align='center'>Concepto</td>";
			_html += "   <td align='right'>Total</td>";
			_html += "   <td></td>";
			_html += "</tr>";
			$.each(data.data.cuota_inicial_crdo, function (i, item) {
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
}