var _REDUX = {
    onTabVisa: function (_this) {
        _VAR.onWait(true);
        var _idCuenta = $(".IdCuenta").val();
        var _documento = $(".Documento").val();
        _VAR._tabSeleccionado = _this.attr("data-bs-target").replace("#", "");
        var _sel = _this.attr("data-bs-target").replace("#", "");
        var _url = ("/Visa/GetRows" + _VAR._tabSeleccionado);
        var _params = { "IdCuenta": _idCuenta, "ForceUpdate": true, "Usuario": $(".idUser").val() };
        switch (_VAR._tabSeleccionado) {
            case "cliente":
                _url = ("/Clientes/GetDataClienteForm");
                _params = { "NroDocumento": _documento };
                break;
        }
        _VAR.ExecutePostAjax(_url, _params).then(function (data) {
            $("#" + _sel).html(data.html);
            _VAR.onWait(false);
        }).catch(function (err) {
            alert("Se ha producido un error indeternimado");
            _VAR.onWait(false);
        });
    },
    onDetalleVisa: function (_this) {
        _VAR.onWait(true);
        var _id = _this.attr("data-id");
        var _url = ("/Visa/GetRows" + _VAR._tabSeleccionado);
        var _params = { "Id": _id, "ForceUpdate": false };
        _VAR.ExecutePostAjax(_url, _params).then(function (data) {
            var _params = { "id": "infoDetalleVisa", "title": "Detalles del registro", "body": data.html };
            _VAR.onShowStaticModal(_params, function () {
                $(".modal-dialog").removeClass("modal-md").addClass("modal-lg");
                $(".modal-footer").remove();
                _VAR.onWait(false);
            });
        }).catch(function (err) {
            alert("Se ha producido un error indeternimado");
            _VAR.onWait(false);
        });
    },
    onDecryptVisa: function (_this) {
        _VAR.onWait(true);
        var _id = _this.attr("data-id");
        var _url = ("/Visa/GetDecryptVisa");
        var _params = { "Id": _id, "ForceUpdate": false };
        _VAR.ExecutePostAjax(_url, _params).then(function (data) {
            var _params = { "id": "infoDecryptVisa", "title": "Detalles desencriptados", "body": data.html };
            _VAR.onShowStaticModal(_params, function () {
                $(".modal-dialog").removeClass("modal-md").addClass("modal-lg");
                $(".modal-footer").remove();
                _VAR.onWait(false);
            });
        }).catch(function (err) {
            alert("Se ha producido un error indeternimado");
            _VAR.onWait(false);
        });
    },
    onCambiarEstadoCuentaVisa: function (_this) {
        var _idSel = _this.attr("data-sel");
        var _html = "<div class='card shadow'>";
        _html += "      <label>Cambiar estado</label><br/>";
        _html += "      <select id='wIdEstado' name='wIdEstado' class='form-control wIdEstado'>";
        _html += "         <option value='0'>Normal</option>";
        _html += "         <option value='1'>Dado de baja</option>";
        _html += "         <option value='4'>Inhabilitada</option>";
        _html += "         <option value='12'>Congelada</option>";
        _html += "         <option value='13'>Inhibida</option>";
        _html += "         <option value='2' disabled>Morosa</option>";
        _html += "         <option value='23' disabled>Inhibida y morosa</option>";
        _html += "      </select>";
        _html += "</div>";
        var _params = { "id": "infoEstadoCuentaVisa", "title": "Modificar estado de la cuenta", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".wIdEstado").val(_idSel);
            switch (parseInt(_idSel)) {
                case 2:
                case 23:
                    $(".wIdEstado").attr("disabled", "disabled");
                    break;
            }
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoEstadoCuentaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de cambiar el estado de la cuenta VISA.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "cambiarestadocuenta",
                    "IdEstado": $(".wIdEstado").val(),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    $("#cuentas-tab").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onModificarCuentaVisa: function (_this) {
        var _html = "<div class='card shadow'>";
        _html += "      <label>Nuevo límite de crédito</label><br/>";
        _html += "      <input id='wLimiteCompra' name='wLimiteCompra' type='number' class='onlyNumbers wLimiteCompra' value='0'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoModificarCuentaVisa", "title": "Modificar límite de crédito", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoModificarCuentaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de modificar el límite de la cuenta VISA.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "modificarcuenta",
                    "LimiteCompra": $(".wLimiteCompra").val(),
                    "LimiteCredito": $(".wLimiteCompra").val(),
                    "LimitePrestamo": 0,
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    $("#cuentas-tab").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onAutorizacionCuentaVisa: function (_this) {
        var _idSel = _this.attr("data-sel");
        var _html = "<div class='card shadow'>";
        _html += "      <label>Tipo</label><br/>";
        _html += "      <select id='wTipo' name='wTipo' class='form-control wTipo'>";
        _html += "         <option value='Consumo'>Consumo</option>";
        _html += "         <option value='Adelanto'>Adelanto</option>";
        _html += "         <option value='Devolución'>Devolución</option>";
        _html += "      </select>";
        _html += "      <label>Moneda</label><br/>";
        _html += "      <select id='wMoneda' name='wMoneda' class='form-control wMoneda'>";
        _html += "         <option value='1'>Local</option>";
        _html += "         <option value='2'>Extranjera</option>";
        _html += "      </select>";
        _html += "      <label>Importe</label><br/>";
        _html += "      <input id='wImporte' name='wImporte' type='number' class='wImporte' value='0'/><br/>";
        _html += "      <input id='wComercio' name='wComercio' type='hidden' class='wComercio' value='9999'/><br/>";
        _html += "      <input id='wEstablecimiento' name='wEstablecimiento' type='hidden' class='wEstablecimiento' value='9999'/><br/>";
        _html += "      <input id='wPlan' name='wPlan' type='hidden' class='wPlan' value='9999'/><br/>";
        _html += "      <input id='wPlazo' name='wPlazo' type='hidden' class='wPlazo' value='0'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoAutorizacionCuentaVisa", "title": "Dar de alta autorización", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoAutorizacionCuentaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de ingresar una autorización a la cuenta VISA.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "ingresomanualautorizacion",
                    "Tipo": $(".wTipo").val(),
                    "Vencimiento": $(".wVencimiento").val(),
                    "Moneda": $(".wMoneda").val(),
                    "Importe": $(".wImporte").val(),
                    "Comercio": $(".wComercio").val(),
                    "Establecimiento": $(".wEstablecimiento").val(),
                    "Plan": $(".wPlan").val(),
                    "Plazo": $(".wPlaza").val(),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    $("#cuentas-tab").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCambiarEstadoTarjetaVisa: function (_this) {
        var _idSel = _this.attr("data-sel");
        var _numeroTarjeta = _this.attr("data-tarjeta");
        var _html = "<div class='card shadow'>";
        _html += "      <label>Cambiar estado</label><br/>";
        _html += "      <select id='wIdEstado' name='wIdEstado' class='form-control wIdEstado'>";
        _html += "         <option value='0'>Normal</option>";
        _html += "         <option value='1'>Dado de baja</option>";
        _html += "         <option value='2'>Baja para reimpresión</option>";
        _html += "         <option value='5'>Denuncia robo/Extravío socio</option>";
        _html += "         <option value='14'>Bloqueo temporal</option>";
        /*
        _html += "         <option value='10' disabled>Baja por renovación</option>";
        _html += "         <option value='15' disabled>Tarjeta no habilitada</option>";
        _html += "         <option value='17' disabled>Denuncia automática IVR</option>";
        _html += "         <option value='18' disabled>Bloqueo automático IVR</option>";
        _html += "         <option value='20' disabled>Vencida</option>";
        */
        _html += "      </select>";
        _html += "</div>";
        var _params = { "id": "infoEstadoTarjetaVisa", "title": "Modificar estado de la tarjeta", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".wIdEstado").val(_idSel);
            switch (parseInt(_idSel)) {
                case 10:
                case 15:
                case 17:
                case 18:
                case 20:
                    $(".wIdEstado").attr("disabled", "disabled");
                    break;
            }
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoEstadoTarjetaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de cambiar el estado de la cuenta VISA.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "cambiarestadotarjeta",
                    "NumeroTarjeta": _numeroTarjeta,
                    "IdEstado": $(".wIdEstado").val(),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    $("#tarjetas-tab").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCambiarPin: function (_this) {
        var _idVerifica = parseInt(_this.attr("data-verifica"));
        var _numeroTarjeta = _this.attr("data-tarjeta");
        var _mode = "cambiopinsinverificaciontarjeta";
        var _html = "<div class='card shadow'>";
        var _hide = "d-none";
        if (_idVerifica != 0) {
            _hide = "";
            _mode = "cambiopinconverificaciontarjeta";
        }
        _html += "      <label class='" + _hide + "'>Pin actual</label><br/>";
        _html += "      <input id='PinActual' name='PinActual' type='number' class='onlyNumbers PinActual " + _hide + "' value=''/><br/>";
        _html += "      <label>Pin nuevo</label><br/>";
        _html += "      <input id='PinNuevo' name='PinNuevo' type='number' class='onlyNumbers PinNuevo' value=''/><br/>";
        _html += "</div>";
        var _params = { "id": "infoPinTarjetaVisa", "title": "Modificar PIN de la tarjeta", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoEstadoTarjetaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de cambiar el PIN de la tarjeta VISA.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": _mode,
                    "NumeroTarjeta": _numeroTarjeta,
                    "PinActual": $(".PinActual").val(),
                    "PinNuevo": $(".PinNuevo").val(),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _p["SyncScope"] = "consultapintarjeta";
                    _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                        $(".btnTabVisa-tarjetas").click();
                    });
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCrearCobranza: function (_this) {
        var _html = "<div class='card shadow'>";
        _html += "      <label>Movimiento</label><br/>";
        _html += "      <input id='MovimientoCobranza' name='MovimientoCobranza' type='number' class='form-control onlyNumbers MovimientoCobranza' value=''/><br/>";
        _html += "      <label>Fecha cobro</label><br/>";
        _html += "      <input id='FechaCobranza' name='FechaCobranza' type='date' class='form-control FechaCobranza date' value=''/><br/>";
        _html += "      <label>Moneda</label><br/>";
        _html += "      <select id='Moneda' name='Moneda' class='form-control Moneda'>";
        _html += "         <option value='1' selected>Local</option>";
        _html += "         <option value='2'>Extranjera</option>";
        _html += "      </select>";
        _html += "      <label>Importe</label><br/>";
        _html += "      <input id='ImporteCobranza' name='ImporteCobranza' type='number' class='form-control onlyNumbers ImporteCobranza' value=''/><br/>";
        _html += "      <label>Comprobante</label><br/>";
        _html += "      <input id='ComprobanteCobranza' name='ComprobanteCobranza' type='number' class='form-control onlyNumbers ComprobanteCobranza' value=''/><br/>";
        _html += "      <label>Forma de pago</label><br/>";
        _html += "      <select id='FormaDePagoCobranza' name='FormaDePagoCobranza' class='form-control FormaDePagoCobranza'>";
        _html += "         <option value='0'>No informada</option>";
        _html += "         <option value='1'>Efectivo</option>";
        _html += "         <option value='2'>Acreditación en cuenta</option>";
        _html += "         <option value='3'>Transferencia bancaria</option>";
        _html += "         <option value='4'>Cheque al día</option>";
        _html += "         <option value='5'>Cheque diferido a 30 días</option>";
        _html += "         <option value='20'>Cheque diferido a 45 días</option>";
        _html += "         <option value='6'>Cheque diferido a 60 días</option>";
        _html += "         <option value='21'>Cheque diferido a 75 días</option>";
        _html += "         <option value='7'>Cheque diferido a 90 días</option>";
        _html += "         <option value='13'>Transferencia bancaria</option>";
        _html += "         <option value='14'>Transferencia bancaria a 30 días</option>";
        _html += "         <option value='15'>Transferencia bancaria a 60 días</option>";
        _html += "      </select>";
        _html += "      <label>Observación</label><br/>";
        _html += "      <input id='Observacion' name='Observacion' type='text' class='form-control Observacion' value=''/><br/>";
        _html += "</div>";
        var _params = { "id": "infoCrearCobranzaVisa", "title": "Crear cobranza", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoCrearCobranzaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de crear una cobranza.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "crearcobranzatransaccion",
                    "ImporteCobranza": $(".ImporteCobranza").val(),
                    "Moneda": $(".Moneda").val(),
                    "ComprobanteCobranza": $(".ComprobanteCobranza").val(),
                    "FormaDePagoCobranza": $(".FormaDePagoCobranza").val(),
                    "Observacion": $(".Observacion").val(),
                    "MovimientoCobranza": $(".MovimientoCobranza").val(),
                    "FechaCobranza": $(".FechaCobranza").val(),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onAltaAvisoViaje: function (_this) {
        var _adicional = _this.attr("data-adicional");
        var _html = "<div class='card shadow'>";
        _html += "      <label>Fecha desde</label><br/>";
        _html += "      <input id='FechaDesde' name='FechaDesde' type='date' class='form-control FechaDesde date' value=''/><br/>";
        _html += "      <label>Fecha hasta</label><br/>";
        _html += "      <input id='FechaHasta' name='FechaHasta' type='date' class='form-control FechaHasta date' value=''/><br/>";
        _html += "      <label>Países</label><br/>";
        _html += "      <input id='Paises' name='Paises' type='text' class='form-control Paises' value=''/><br/>";
        _html += "</div>";
        var _params = { "id": "infoCrearCobranzaVisa", "title": "Crear cobranza", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoCrearCobranzaVisa");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de crear una cobranza.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "NumeroAdicional": _adicional,
                    "SyncScope": "altaavisoviaje",
                    "FechaDesde": $(".FechaDesde").val(),
                    "FechaHasta": $(".FechaHasta").val(),
                    "Paises": $(".Países").val().split(","),
                    "Usuario": $(".idUser").val()
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCrearExcepcionFraude: function (_this) {
        var _html = "<div class='card shadow'>";
        _html += "      <label>Fecha desde</label><br/>";
        _html += "      <input id='Desde' name='Desde' type='date' class='form-control Desde date' value=''/><br/>";
        _html += "      <label>Fecha hasta</label><br/>";
        _html += "      <input id='Hasta' name='Hasta' type='date' class='form-control Hasta date' value=''/><br/>";
        _html += "      <label>Moneda</label><br/>";
        _html += "      <select id='Moneda' name='Moneda' class='form-control Moneda'>";
        _html += "         <option value='1' selected>Local</option>";
        _html += "         <option value='2'>Extranjera</option>";
        _html += "      </select>";
        _html += "      <label>Estado</label><br/>";
        _html += "      <select id='Estado' name='Estado' class='form-control Estado'>";
        _html += "         <option value='1' selected>Activo</option>";
        _html += "         <option value='0'>Inactivo</option>";
        _html += "      </select>";
        _html += "      <label>Observación</label><br/>";
        _html += "      <input id='Observacion' name='Observacion' type='text' class='form-control Observacion' value=''/><br/>";
        _html += "</div>";
        var _params = { "id": "infoCrearExcepcion", "title": "Crear excepción fraude", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoCrearExcepcion");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                if (!confirm("Está a punto de crear una excepción de fraude.\n¿Confirma?")) { return false; }
                _VAR.onWait(true);
                var _p = {
                    "IdCuenta": $(".IdCuenta").val(),
                    "SyncScope": "altaexcepcionfraude",
                    "FechaDesde": $(".Desde").val(),
                    "FechaHasta": $(".Hasta").val(),
                    "Moneda": $(".Moneda").val(),
                    "Observacion": $(".Observacion").val(),
                    "Estado": $(".Estado").val(),
                };
                _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onExecDelete: function (_this) {
        if (!confirm("¿Dar de baja el registro seleccionado?")) { return false; }
        _VAR.onWait(true);
        var _p = {
            "Id": _this.attr("data-id"),
            "SyncScope": _this.attr("data-mode"),
            "Usuario": $(".idUser").val()
        };
        _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
            if (!data.logica) { alert(data.mensaje); }
            _VAR.onWait(false);
        }).catch(function (err) {
            alert("Se ha producido un error indeterminado");
            _VAR.onWait(false);
        });
    },
    onExecNoParams: function (_this) {
        _VAR.onWait(true);
        var _mode = _this.attr("data-mode");
        var _tipoTarjeta = _this.attr("data-tipo");
        var _numeroTarjeta = _this.attr("data-tarjeta");
        var _p = {
            "IdCuenta": $(".IdCuenta").val(),
            "SyncScope": _mode,
            "NumeroTarjeta": _numeroTarjeta,
            "Usuario": $(".idUser").val()
        };
        if (_tipoTarjeta != undefined) { _p["TipoTarjeta"] = _tipoTarjeta; }

        _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
            if (data.mensaje != "") { alert(data.mensaje); }
            _VAR.onWait(false);
            switch (_mode) {
                case "consultapintarjeta":
                    $(".btnTabVisa-tarjetas").click();
                    break;
            }
        }).catch(function (err) {
            alert("Se ha producido un error indeterminado");
            _VAR.onWait(false);
        });
    },
    onSyncGP: function (_this) {
        _VAR.onWait(true);
        var _idCuenta = $(".IdCuenta").val();
        if (_idCuenta == undefined) { _idCuenta = _this.attr("data-id"); }
        var _p = {
            "IdCuenta": _idCuenta,
            "SyncScope": _this.attr("data-mode"),
            "Usuario": $(".idUser").val()
        };
        _VAR.ExecutePostAjax("/Visa/SyncGP", _p).then(function (data) {
            if (data.mensaje != "") { alert(data.mensaje); }
            window.location.reload();
            _VAR.onWait(false);
        }).catch(function (err) {
            alert("Se ha producido un error indeterminado");
            _VAR.onWait(false);
        });
    },
    onReiniciarIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se eliminarán todos los registros entrenados del proyecto seleccionado: <b>" + _description + "</b></p>";
        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Reiniciar proyecto IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Reiniciar");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id": $(".wId").val() };
                _VAR.ExecutePostAjax("/IA/Reiniciar", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                    window.location.reload();
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onBorrarComparativaIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se eliminarán todos los registros de comparativas realizadas del proyecto seleccionado: <b>" + _description + "</b></p>";
        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Reiniciar comparativas del proyecto IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Reiniciar");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id_project": $(".wId").val() };
                _VAR.ExecutePostAjax("/IA/BorrarComparativa", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                    window.location.reload();
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCargarIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se ejecutará el proceso de carga de los nuevos ítems de entrenamiento al proyecto: <b>" + _description + "</b></p>";
        _html += "      <label>Año</label><br/>";
        _html += "      <input id='wYear' name='wYear' type='number' class='form-control onlyNumbers wYear' value=''/><br/>";
        _html += "      <label>Mes</label><br/>";
        _html += "      <input id='wMonth' name='wMonth' type='number' class='form-control onlyNumbers wMonth' value=''/><br/>";

        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Cargar datos a proyecto IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Cargar");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id_project": $(".wId").val() };
                if ($(".wYear").val() != "" && $(".wYear").val() != "0") { _p["Year"] = $(".wYear").val(); }
                if ($(".wMonth").val() != "" && $(".wMonth").val() != "0") { _p["Month"] = $(".wMonth").val(); }

                _VAR.ExecutePostAjax("/IA/Cargar", _p).then(function (data) { }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
                alert("Se iniciado el proceso de carga.\nNo pueden realizarse acciones sobre el proyecto, hasta que no haya finalizado.\nSe puede observar el avance del proceso actualizando esta pantalla.");
                _VAR.onWait(false);
                window.location.reload();
            });
        });
    },
    onEntrenarIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se ejecutará el proceso de entrenamiento de los ítems sin procesar vinculados al proyecto seleccionado: <b>" + _description + "</b></p>";
        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Entrenar datos ya cargados a proyecto IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Entrenar");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id_project": $(".wId").val() };
                _VAR.ExecutePostAjax("/IA/Entrenar", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
                _VAR.onWait(false);
                window.location.reload();
            });
        });
    },
    onResolverIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>Realizar evaluación de <b>" + _description + "</b></h5>";
        _html += "      <div class='container-full'>";
        _html += "       <div class='row'>";
        _html += "        <div class='col-3'>";
        _html += "         <table class='table table-sm table-borderless'>";
        _html += "            <tr>";
        _html += "               <td><b>Solicitud</b></td>";
        _html += "               <td><input id='wIdSolicitud' name='wIdSolicitud' type='number' class='form-control onlyNumbers wIdSolicitud' value=''/></td>";
        _html += "            </tr>";
        _html += "         </table>";
        _html += "        </div>";
        _html += "       </div>";
        _html += "      </div>";
        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "      <div class='p2 areaRespuesta'></div>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Resolver consulta IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Resolver");
            $(".modal-dialog").addClass("modal-xl");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id_project": $(".wId").val(), "IdSolicitud": $(".wIdSolicitud").val() };
                _VAR.ExecutePostAjax("/IA/Resolver", _p).then(function (data) {
                    console.log(data);
                    if (!data.logica) { alert(data.mensaje); }
                    $(".areaRespuesta").html(data.html);
                    _VAR.onWait(false);
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onCompararIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se ejecutará el proceso comparativo de predicciones para el proyecto: <b>" + _description + "</b></p>";
        _html += "      <table>";
        _html += "         <tr>";
        _html += "            <td><label>Año</label></td><td><input id='wYear' name='wYear' type='number' class='form-control onlyNumbers wYear' value=''/></td>";
        _html += "            <td><label>Mes</label></td><td><input id='wMonth' name='wMonth' type='number' class='form-control onlyNumbers wMonth' value=''/></td>";
        _html += "         </tr>";
        _html += "      </table>";

        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        _html += "<div class='container areaRespuesta'></div>";

        var _params = { "id": "infoIA", "title": "Comparativa de resultados IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Comparar");
            $(".modal-dialog").addClass("modal-xl");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = {
                    "Id_project": $(".wId").val()
                };
                if ($(".wYear").val() != "" && $(".wYear").val() != "0") { _p["Year"] = $(".wYear").val(); }
                if ($(".wMonth").val() != "" && $(".wMonth").val() != "0") { _p["Month"] = $(".wMonth").val(); }
                _VAR.onWait(true);
                _VAR.ExecutePostAjaxAsync("/IA/Comparar", _p).then(function (data) { }).catch(function (err) { });
                alert("Se iniciado el proceso de comparación.\nSe puede observar el avance del proceso actualizando esta pantalla.");

                _VAR.onWait(false);
                window.location.reload();
            });
        });
    },
    onDetenerIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _html = "<div>";
        _html += "      <h5>" + _description + "</h5>";
        _html += "      <p>Se detendrá la carga en curso de los datos relacionados al proyecto seleccionado: <b>" + _description + "</b></p>";
        _html += "      <input id='wId' name='wId' class='wId' type='hidden' value='" + _id + "'/><br/>";
        _html += "</div>";
        var _params = { "id": "infoIA", "title": "Reiniciar proyecto IA", "body": _html };
        _VAR.onShowStaticModal(_params, function () {
            $(".btn-accept-modal").html("Detener");

            $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                _VAR.onDestroyModal("#infoIA");
            });
            $("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
                var _p = { "Id": $(".wId").val() };
                _VAR.ExecutePostAjax("/IA/Detener", _p).then(function (data) {
                    if (!data.logica) { alert(data.mensaje); }
                    $(".btn-close-modal").click();
                    _VAR.onWait(false);
                    window.location.reload();
                }).catch(function (err) {
                    alert("Se ha producido un error indeterminado");
                    _VAR.onWait(false);
                });
            });
        });
    },
    onStatsIA: function (_this) {
        var _id = _this.attr("data-id");
        var _description = _this.attr("data-description");
        var _p = { "Id_project": _id };
        _VAR.ExecutePostAjaxAsync("/IA/Stats", _p).then(function (data) {
            var _params = { "id": "infoIA", "title": ("Estadísticas del proyecto " + _description), "body": data.html };
            _VAR.onShowStaticModal(_params, function () {
                $(".btn-cancel-modal").html("Cerrar");
                $(".btn-accept-modal").remove();
                $(".modal-dialog").addClass("modal-xl");

                $("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
                    _VAR.onDestroyModal("#infoIA");
                });
            });

        }).catch(function (err) { });
    },
};
