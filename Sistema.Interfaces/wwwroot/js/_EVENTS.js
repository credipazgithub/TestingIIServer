
$("body").off("click", ".btnQuitarTodosLosFiltros").on("click", ".btnQuitarTodosLosFiltros", function () {
	_FUNCTIONS.onQuitarTodosLosFiltros($(this));
});
$("body").off("click", ".btnOfflineWebSocket").on("click", ".btnOfflineWebSocket", function () {
	_FUNCTIONS.onOfflineWebSocket($(this));
});
$("body").off("click", ".btn-ComercianteCBU").on("click", ".btn-ComercianteCBU", function () {
	_FUNCTIONS.onChangeComercianteCBU($(this));
});
$("body").off("click", ".btn-GoProcessExportInternal").on("click", ".btn-GoProcessExportInternal", function () {
	_FUNCTIONS.onProcessExportInternal($(this));
});
$("body").off("click", ".btn-GoProcessImportInternal").on("click", ".btn-GoProcessImportInternal", function () {
	_FUNCTIONS.onProcessImportInternal($(this));
});
$("body").off("click", ".btn-DeleteTransfer").on("click", ".btn-DeleteTransfer", function () {
	_FUNCTIONS.onDeleteTransfer($(this));
});
$("body").off("click", ".btn-GoTransfer").on("click", ".btn-GoTransfer", function () {
	_FUNCTIONS.onGoTransfer($(this));
});
$("body").off("change", ".ctrlAllNone").on("change", ".ctrlAllNone", function () {
	_FUNCTIONS.onCtrlAllnone($(this));
});
$("body").off("click", ".btnRefreshQR").on("click", ".btnRefreshQR", function () {
	_FUNCTIONS.onRefreshQRcode($(this));
});
$("body").off("click", ".btnEjecutarAlerta").on("click", ".btnEjecutarAlerta", function () {
	_FUNCTIONS.onEjecutarAlerta($(this));
});
$("body").off("click", ".btn-copyClip").on("click", ".btn-copyClip", function () {
	_TOOLS.copyToClipboard($(this));
});
$("body").off("click", ".btnGenerarCampaign").on("click", ".btnGenerarCampaign", function () {
	_FUNCTIONS.onGenerarCampaign($(this));
});
$("body").off("click", ".btn-generarPlanosWaldbott").on("click", ".btn-generarPlanosWaldbott", function () {
	_FUNCTIONS.onGenerarPlanosWaldbott($(this));
});
$("body").off("change", ".chkReasignarAll").on("change", ".chkReasignarAll", function () {
	_FUNCTIONS.onSelectReasignarAll($(this));
});
$("body").off("change", ".chkReasignarOperadorAll").on("change", ".chkReasignarOperadorAll", function () {
	_FUNCTIONS.onSelectReasignarOperadorAll($(this));
});
$("body").off("change", ".chkReasignarOperador").on("change", ".chkReasignarOperador", function () {
	_FUNCTIONS.onSelectReasignarOperador($(this));
});
$("body").off("change", ".reasignarLanding").on("change", ".reasignarLanding", function () {
	_FUNCTIONS.onReasignarLanding($(this));
});
$("body").off("change", ".gestorReasignado").on("change", ".gestorReasignado", function () {
	_FUNCTIONS.onReasignarGestor($(this));
});
$("body").off("click", ".btnEmitirProducto").on("click", ".btnEmitirProducto", function () {
	_FUNCTIONS.onEmitirProducto($(this));
});
$("body").off("click", ".btnOfflineFormularios").on("click", ".btnOfflineFormularios", function () {
	_FUNCTIONS.onOfflineFormularios($(this));
});
$("body").off("click", ".btn-Reservar").on("click", ".btn-Reservar", function () {
	_FUNCTIONS.onReservarMediya($(this));
});
$("body").off("click", ".btnModificarEndeudamiento").on("click", ".btnModificarEndeudamiento", function () {
	_FUNCTIONS.onModificarEndeudamiento($(this));
});

$("body").off("change", ".ws-EnviarLinkGestionProducto").on("change", ".ws-EnviarLinkGestionProducto", function () {
	_FUNCTIONS.onEnviarLinkGestionProducto($(this));
});
$("body").off("click", ".btnAprobarTransaccion").on("click", ".btnAprobarTransaccion", function () {
	_FUNCTIONS.onAprobarTransaccion($(this));
});

$("body").off("change", ".chkPago").on("change", ".chkPago", function () {
	_FUNCTIONS.onSelectOperacionPago($(this));
});
$("body").off("change", ".chkPagoAll").on("change", ".chkPagoAll", function () {
	_FUNCTIONS.onSelectPagoAll($(this));
});

$("body").off("change", ".chkConfirmAuditoria").on("change", ".chkConfirmAuditoria", function () {
	_FUNCTIONS.onConfirmarAuditoriaInforme($(this));
});
$("body").off("change", ".typeObservacion").on("change", ".typeObservacion", function (e) {
	_FUNCTIONS.onConfirmarAuditoriaInforme($(this));
});
$("body").off("keyup", ".notaAuditoria").on("keyup", ".notaAuditoria", function (e) {
	var _this = $(this);
	clearTimeout(_FUNCTIONS._TIMER_LAZY);
	_FUNCTIONS._TIMER_LAZY = setTimeout(function () {
		_FUNCTIONS.onConfirmarAuditoriaInforme(_this);
	}, 1000);
});

$("body").off("change", ".chkConfirm").on("change", ".chkConfirm", function () {
	_FUNCTIONS.onConfirmarOperacionPago($(this));
});
$("body").off("click", ".btnTerminarConciliacionDia").on("click", ".btnTerminarConciliacionDia", function () {
	_FUNCTIONS.onTerminarConciliacionDia($(this));
});
$("body").off("click", ".btnExportarApi").on("click", ".btnExportarApi", function () {
	var _params = {
		"Tipo": "finanzas-pagos",
		"Proceso": $(this).attr("data-out"),
		"Data": $(".dataExport").val(),
		"Description": $(this).attr("data-description"),
		"Mime_type": $(this).attr("data-mime"),
		"Separator": $(this).attr("data-separator"),
		"Username": $(".Username").val(),
		"UsaPath": $(this).attr("data-path"),
		"Banco": $(this).attr("data-banco"),
	};
	_FUNCTIONS.onExportarApi(_params).then(function (_data) {
		$(".btn-close-modal").html("Cerrar");
		$(".btnArmarAccionesOperaciones").click();
	});
});
$("body").off("click", ".btnExportarArchivoPlano").on("click", ".btnExportarArchivoPlano", function () {
	var _params = {
		"Tipo": "finanzas-pagos",
		"Proceso": $(this).attr("data-out"),
		"Data": $(".dataExport").val(),
		"Description": $(this).attr("data-description"),
		"Mime_type": $(this).attr("data-mime"),
		"Separator": $(this).attr("data-separator"),
		"Username": $(".Username").val(),
		"UsaPath": $(this).attr("data-path"),
		"Banco": $(this).attr("data-banco"),
		"id_canal": $(this).attr("data-canal")
	};
	_FUNCTIONS.onExportarArchivoPlano(_params).then(function (_data) {
		$(".btn-close-modal").html("Cerrar");
		$(".btnArmarAccionesOperaciones").click();
	});
});
$("body").off("click", ".btnArmarAccionesOperaciones").on("click", ".btnArmarAccionesOperaciones", function () {
	_FUNCTIONS.onArmarAccionesLotesOperaciones($(this));
});
$("body").off("change", ".id_type_modo_pago").on("change", ".id_type_modo_pago", function () {
	_FUNCTIONS.onSelectModoPago($(this));
});
$("body").off("change", ".Sucursales_Activas").on("change", ".Sucursales_Activas", function () {
	_FUNCTIONS.onSelectSucursalPago($(this));
});
$("body").off("click", ".btnSecurityGroups").on("click", ".btnSecurityGroups", function () {
	_FUNCTIONS.onSecurityGroups($(this));
});
$("body").off("click", ".btnConvertir").on("click", ".btnConvertir", function () {
	_FUNCTIONS.onConvertir($(this));
});
$("body").off("click", ".btnRetomar").on("click", ".btnRetomar", function () {
	_FUNCTIONS.onRetomar($(this));
});
$("body").off("keyup", ".chkEnGestion").on("keyup", ".chkEnGestion", function (e) {
	var _this = $(this);
	clearTimeout(_FUNCTIONS._TIMER_LAZY);
	_FUNCTIONS._TIMER_LAZY = setTimeout(function () {
		_FUNCTIONS.onCheckEnGestion(_this);
	}, 1500);
});
$("body").off("change", ".selEnGestion").on("change", ".selEnGestion", function () {
	_FUNCTIONS.onCheckEnGestion($(this));
});
$("body").off("change", ".resetScoring").on("change", ".resetScoring", function () {
	_FUNCTIONS.onResetScoring($(this));
});

$("body").off("click", ".btn-FirstEvaluation").on("click", ".btn-FirstEvaluation", function () {
	_FUNCTIONS.onFirstEvaluation($(this));
});
$("body").off("click", ".btn-RejectTransaction").on("click", ".btn-RejectTransaction", function () {
	_FUNCTIONS.onRejectTransaction($(this));
});
$("body").off("click", ".btn-NoTransaction").on("click", ".btn-NoTransaction", function () {
	_FUNCTIONS.onNoTransaction($(this));
});
$("body").off("click", ".btnAccionProducto").on("click", ".btnAccionProducto", function () {
	_FUNCTIONS.onAccionSobreProducto($(this));
});
$("body").off("click", ".btn-ScoringCalificacion").on("click", ".btn-ScoringCalificacion", function () {
	_FUNCTIONS.onScoringSimulator($(this),'calificacion',0);
});
$("body").off("click", ".btn-ScoringSimulator").on("click", ".btn-ScoringSimulator", function () {
	_FUNCTIONS.onScoringSimulator($(this), 'simulador', $(".iRefinancia").val());
});
$("body").off("click", ".btn-InformeAuditoria").on("click", ".btn-InformeAuditoria", function () {
	_FUNCTIONS.onInformeAuditoria($(this));
});
$("body").off("click", ".btn-InformeAuditoriaPdf").on("click", ".btn-InformeAuditoriaPdf", function () {
	_FUNCTIONS.onInformeAuditoriaPdf($(this));
});
$("body").off("click", ".btn-InformeBCRA").on("click", ".btn-InformeBCRA", function () {
	_FUNCTIONS.onInformeBCRA($(this));
});
$("body").off("click", ".btn-InformeVerazExperto").on("click", ".btn-InformeVerazExperto", function () {
	_FUNCTIONS.onInformeVerazExperto($(this));
});
$("body").off("click", ".btn-InformeVerazConsumo").on("click", ".btn-InformeVerazConsumo", function () {
	_FUNCTIONS.onInformeVerazConsumo($(this));
});
$("body").off("click", ".btn-InformeResumen").on("click", ".btn-InformeResumen", function () {
	_FUNCTIONS.onInformeResumen($(this));
});
$("body").off("click", ".btn-InformeNosisExperto").on("click", ".btn-InformeNosisExperto", function () {
	_FUNCTIONS.onInformeNosisExperto($(this));
});
$("body").off("click", ".btn-InformeNosisConsumo").on("click", ".btn-InformeNosisConsumo", function () {
	_FUNCTIONS.onInformeNosisConsumo($(this));
});
$("body").off("click", ".btn-InformeSaldos").on("click", ".btn-InformeSaldos", function () {
	_FUNCTIONS.onInformeSaldos($(this));
});
$("body").off("click", ".btn-InformeCajaFisicas").on("click", ".btn-InformeCajaFisica", function () {
	_FUNCTIONS.onInformeCajaFisica($(this));
});
$("body").off("click", ".btn-InformeComerciantes").on("click", ".btn-InformeComerciantes", function () {
	_FUNCTIONS.onInformeComerciantes($(this));
});
$("body").off("click", ".btn-InformeTarjetas").on("click", ".btn-InformeTarjetas", function () {
	_FUNCTIONS.onInformeTarjetas($(this));
});
$("body").off("click", ".btnCambiarFormaDePago").on("click", ".btnCambiarFormaDePago", function () {
	_FUNCTIONS.onCambiarFormaDePago($(this));
});
$("body").off("click", ".btnAuditoriaTransaccion").on("click", ".btnAuditoriaTransaccion", function () {
	_FUNCTIONS.onAuditoriaTransaccion($(this));
});
$("body").off("click", ".btnReabrirAuditoriaTransaccion").on("click", ".btnReabrirAuditoriaTransaccion", function () {
	_FUNCTIONS.onReabrirAuditoriaTransaccion($(this));
});

$("body").off("click", ".btnFullAudit").on("click", ".btnFullAudit", function () {
	_FUNCTIONS.onFullAudit($(this));
});
$("body").off("click", ".btn-Grabar").on("click", ".btn-Grabar", function () {
	$(this).hide();
	if ($(".validarCBU").val() != undefined) {
		if (!_TOOLS.validarCBU($(".validarCBU").val())) {
			alert('¡El CBU especificado no es un CBU válido!');
			return false;
		}
	}
	if ($(".validarPAN").val() != undefined) {
		if (!_TOOLS.validarPAN($(".validarPAN").val())) {
			alert('¡El PAN especificado no es un PAN válido!');
			return false;
		}
	}
	var _validate = $(this).attr("data-validate");
	var _target = $(this).attr("data-target");
	if (_validate == undefined || _validate == null || _validate == "") { _validate = ".validate"; }
	if (_target == undefined || _target == null || _target == "") { _target = "#formABM"; }
	if (_TOOLS.validate(_validate, true)) {
		$(".form-check-input").each(function () {
			var _v = 0;
			if ($(this).is(":checked")) { _v = 1; }
			$(".v_" + $(this).attr("id")).val(_v);
		})
		$("input").attr("disabled", false);
		$("select").attr("disabled", false);
		$(_target).submit();
	}
	$(this).fadeIn("fast");
});
$("body").off("click", ".btn-GrabarAndStay").on("click", ".btn-GrabarAndStay", function () {
	$(".iReload").val("1");
	$(".btn-Grabar").click();
});
$("body").off("click", ".btn-Edit").on("click", ".btn-Edit", function () {
    var _id = $(this).attr("data-id");
	var _controller = $(this).attr("data-controller");
	var _action = $(this).attr("data-action");
	var _protocol = window.location.protocol;
	var _host = window.location.host;
	var url = (_protocol + "//" + _host + "/" + _controller + "/" + _action + "?_id=" + _id);
    window.location.href = url;
});
$("body").off("click", ".btn-Save").on("click", ".btn-Save", function () {
	$(".formControls").fadeOut("slow");
	var _validate = $(this).attr("data-validate");
	var _target = $(this).attr("data-target");
	var _controller = $(this).attr("data-controller");
	var _action = $(this).attr("data-action");
	if (_validate == undefined || _validate == null || _validate == "") { _validate = ".validate"; }
	if (_target == undefined || _target == null || _target == "") { _target = "#formABM"; }
	if (_TOOLS.validate(_validate, true)) {
		var _protocol = window.location.protocol;
		var _host = window.location.host;
		var url = (_protocol + "//" + _host + "/" + _controller + "/" + _action);
		$(_target).attr("action", url);
		$(_target).submit();
	} else {
		$(".formControls").fadeIn("fast");
	}
});
$("body").off("click", ".btnNewModal").on("click", ".btnNewModal", function () {
	_FUNCTIONS.onClickActivateModalInterface($(this));
});
$("body").off("click", ".btnEditModal").on("click", ".btnEditModal", function () {
	_FUNCTIONS.onClickActivateModalInterface($(this));
});
$("body").off("click", ".btnDeleteModal").on("click", ".btnDeleteModal", function () {
	_FUNCTIONS.onClickDeleteItemInterface($(this));
});
$("body").off("click", ".btnVerifyModal").on("click", ".btnVerifyModal", function () {
	_FUNCTIONS.onClickVerifyItemInterface($(this));
});
$("body").off("click", ".btnMarcarLeido").on("click", ".btnMarcarLeido", function () {
	_FUNCTIONS.onClickMarcarLeido($(this));
});
$("body").off("input", ".onlyNumbers").on("input", ".onlyNumbers", function () {
	_TOOLS.onlyNumbers($(this));
});
$("body").off("change", ".validateAge").on("change", ".validateAge", function () {
	_TOOLS.validateAge($(this));
});
$("body").off("click", ".btnResolverCondicional").on("click", ".btnResolverCondicional", function () {
	_FUNCTIONS.onResolverCondicional($(this));
});
$("body").off("click", ".btnTraerFormularios").on("click", ".btnTraerFormularios", function () {
	_FUNCTIONS.onTraerFormulario($(this));
});
$("body").off("click", ".btnCarpetaDigital").on("click", ".btnCarpetaDigital", function () {
	_FUNCTIONS.onTraerCarpetaDigital($(this));
});
$("body").off("click", ".btnBridgeFile").on("click", ".btnBridgeFile", function () {
	_FUNCTIONS.onBridgeFile($(this));
});
$("body").off("click", ".btnToggleByClass").on("click", ".btnToggleByClass", function () {
	_TOOLS.toggleByClass($(this));
});
$("body").off("change", ".modalresYear").on("change", ".modalresYear", function () {
	_FUNCTIONS.onTraerConsumosHistoricos($(this).val(), $(".modalresMonth").val());
	$(".resYear").val($(".modalresYear").val());
	$(".resMonth").val($(".modalresMonth").val());
});
$("body").off("change", ".modalresMonth").on("change", ".modalresMonth", function () {
	_FUNCTIONS.onTraerConsumosHistoricos($(".modalresYear").val(), $(".modalresMonth").val());
	$(".resYear").val($(".modalresYear").val());
	$(".resMonth").val($(".modalresMonth").val());
});
$("body").off("click", ".WbtnResumen").on("click", ".WbtnResumen", function () {
	$(".btnResumen").click();
});
$("body").off("click", ".btn-GrabarCapitalCuotas").on("click", ".btn-GrabarCapitalCuotas", function () {
	var _this = $(this);
	var _rec = _this.attr("data-record");
	if (_rec == "") {
		$(".cuotas").each(
			function () {
				if ($(this).is(":checked")) { _this.attr("data-record",$(this).attr("data-record")); }
			});
	}
	_FUNCTIONS.onGrabarCapitalCuotas(_this);
});
$("body").off("click", ".btnReleaseLock").on("click", ".btnReleaseLock", function () {
	_FUNCTIONS.onReleaseLock($(this));
});
$("body").off("click", ".btnCrearCardCred").on("click", ".btnCrearCardCred", function () {
	_FUNCTIONS.onCrearCardCred($(this));
});
$("body").off("click", ".btnEnviarCardCred").on("click", ".btnEnviarCardCred", function () {
	_FUNCTIONS.onEnviarCardCred($(this));
});
$("body").off("click", ".btnActualizarCardCred").on("click", ".btnActualizarCardCred", function () {
	_FUNCTIONS.onActualizarCardCred($(this));
});
$("body").off("click", ".btnImputacionesCardCred").on("click", ".btnImputacionesCardCred", function () {
	_FUNCTIONS.onImputacionesCardCred($(this));
});
$("body").off("click", ".btnRecaudacionCardCred").on("click", ".btnRecaudacionCardCred", function () {
	_FUNCTIONS.onRecaudacionCardCred($(this));
});
$("body").off("click", ".btnBorrarSolicitud").on("click", ".btnBorrarSolicitud", function () {
	_FUNCTIONS.onBorrarSolicitud($(this));
});
$("body").off("click", ".btnLinkToFrame").on("click", ".btnLinkToFrame", function () {
	_FUNCTIONS.onLinkToFrame($(this));
});
$("body").off("click", ".btnDetalleLote").on("click", ".btnDetalleLote", function () {
	_FUNCTIONS.onDetalleLote($(this));
});
$("body").off("click", ".btnDetalleCabeceraLote").on("click", ".btnDetalleCabeceraLote", function () {
	_FUNCTIONS.onDetalleCabeceraLote($(this));
});
$("body").off("click", ".btnDetalleImputacion").on("click", ".btnDetalleImputacion", function () {
	_FUNCTIONS.onDetalleImputacion($(this));
});
$("body").off("click", ".btnCancelarLote").on("click", ".btnCancelarLote", function () {
	_FUNCTIONS.onCancelarLote($(this));
});


