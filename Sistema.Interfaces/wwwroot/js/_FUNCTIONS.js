var _FUNCTIONS = {
	/**
	 * Nivel 6
	 * Llamada a funciones especificas para armar segmentos de formularios
	 * 
	 */
	onNewFolderItem: function (_this) {
		var _html = "<h3 style='color:black;'>Datos del archivo a incluir</h3>";
		_html += "</hr>";
		_html += "<div class='py-4 px-0'>";
		_html += "   <table style='width:100%;'>";
		_html += "      <tr><td><span class='badge badge-success'>Seleccione archivo:</span> <input id='btnItemFolderFile' name='btnItemFolderFile' class='btn btn-dark btnItemFolderFile btnUploadFile' type='file' accept='application/pdf'></td></tr>";
		_html += "      <tr><td><label>Tipo de documento</label></td></tr>";
		_html += "      <tr><td><select class='form-control wvalidate wid_type_folder_item' data-id='id' data-descripcion='descripcion' id='wid_type_folder_item' name='wid_type_folder_item'></select></td></tr>";
		_html += "      <tr><td><label>Descripción</label></td></tr>";
		_html += "      <tr><td><input type='text' id='wDescription' name='wDescription' class='form-control dbase wvalidate wDescription' value='' placeholder='Descripción'/></td></tr>";
		_html += "      <tr><td><label>Palabras claves (separadas por ,)</label></td></tr>";
		_html += "      <tr><td><input type='text' id='wKeywords' name='wKeywords' class='form-control dbase wKeywords' value='' placeholder='Palabras clave'/></td></tr>";
		_html += "   </table>";
		_html += "   <input id='wid' name='wid' class='wid' type='hidden' value='" + _this.attr("data-id") + "'>";
		_html += "   <input id='wbase64' name='wbase64' class='wbase64' type='hidden' value=''>";
		_html += "   <input id='wfilename' name='wfilename' class='wfilename' type='hidden' value=''>";
		_html += "</div>";

		_VAR.onShowHtmlModal({ "id": "modalItemFolder", "title": "Nuevo archivo en carpeta", "body": _html },
			function () {
				_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=NS_mod_folders_type_folder_items", "wid_type_folder_item", "").then(function (data) { });
				$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
					if ($(".wbase64").val() == "") { alert("¡Debe seleccionar algún archivo para ser incluído!"); return false; }
					if (!_TOOLS.validate(".wvalidate", false)) { return false; }
					var _params = {
						"id": $(".wid").val(),
						"id_type_folder_item": $(".wid_type_folder_item").val(),
						"mime": $(".wbase64").val().split(';')[0].split(':')[1],
						"filename": $(".wfilename").val(),
						"description": $(".wDescription").val(),
						"keywords": $(".wKeywords").val(),
						"base64": $(".wbase64").val()
					};
					_VAR.ExecutePostAjax("/Documentacion/GrabarItemFolder", _params).then(function (data) {
						window.location.reload();
					});
				});
				$("body").off("click", ".btnItemFolderFile").on("click", ".btnItemFolderFile", function (event) {
					$(this).val(null);
				});
				$("body").off("change", ".btnItemFolderFile").on("change", ".btnItemFolderFile", function (event) {
					var base64 = "";
					var reader = new FileReader();
					var _f = $(".btnItemFolderFile").prop('files')[0];
					var _name = _f.name;
					reader.readAsDataURL(_f);
					reader.onload = function () {
						$("#wDescription").val(_name);
						$("#wfilename").val(_name);
						$(".wbase64").val(reader.result);
					};
				});
			}
		);
	},
	onSecurityGroups: function (_this) {
		var _groups = $(".securityGroups").val().split(',');
		var _body = "<ul>";
		_groups.forEach(function (value, index, array) { _body += "<li>" + value + "</li>"; });
		_body += "</ul>";
		var _params = { "id": "infoModalSecurityGroups", "title": "Grupo de permisos del usuario activo", "body": _body };
		_VAR.onShowInfoModal(_params, function () {
			$(".modal-dialog").removeClass("modal-xl").addClass("modal-sm");
			$(".modal-footer").remove();
		});
	},
	onTraerConsumosHistoricos: function (_year, _month) {
		var _params = { "sCuenta": _VAR.ValueforRetrieve, "iYear": _year, "iMonth": _month };
		var _url = "/Cabal/ObtenerDatosCierreHistorico";
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			var _html = "<h5 style='color:red;'>Sin datos para el período seleccionado</h5>";
			if (data.records.length != 0) {
				_html = "<div class='card shadow-lg'>";
				_html += "  <table style='width:100%;'>";
				_html += "     <tbody>";
				_html += "        <tr>";
				_html += "           <td>F.pago:</td><td style='font-weight:bold;'>" + data.records[0]["dFechaPagoF"] + "</td>";
				_html += "           <td>F.proceso:</td><td style='font-weight:bold;'>" + data.records[0]["dFechaProcesoF"] + "</td>";
				_html += "           <td>F.Vto.:</td><td style='font-weight:bold;'>" + data.records[0]["dFechaVtoF"] + "</td>";
				_html += "           <td>Compras mes:</td><td style='font-weight:bold;'>$" + data.records[0]["nComprasMes"] + "</td>";
				_html += "           <td>Cuotas:</td><td style='font-weight:bold;'>" + data.records[0]["nCuotasAPagar"] + "</td>";
				_html += "        </tr>";
				_html += "        <tr>";
				_html += "           <td>Pago mes:</td><td style='font-weight:bold;'>$" + data.records[0]["nPagoMes"] + "</td>";
				_html += "           <td>Pago mín.:</td><td style='font-weight:bold;'>$" + data.records[0]["nPagoMinimo"] + "</td>";
				_html += "           <td>Pago mín.ant.:</td><td style='font-weight:bold;'>$" + data.records[0]["nPagoMinimoAnterior"] + "</td>";
				_html += "           <td>Pago sugerido:</td><td style='font-weight:bold;'>$" + data.records[0]["nPagoSugerido"] + "</td>";
				_html += "           <td>Pago total:</td><td style='font-weight:bold;'>$" + data.records[0]["nPagoTotal"] + "</td>";
				_html += "        </tr>";
				_html += "        <tr>";
				_html += "           <td>Saldo anterior:</td><td style='font-weight:bold;'>$" + data.records[0]["nSaldoAnterior"] + "</td>";
				_html += "           <td>Saldo a favor:</td><td style='font-weight:bold;'>$" + data.records[0]["nSaldoAFavor"] + "</td>";
				_html += "           <td>Sellado:</td><td style='font-weight:bold;'>$" + data.records[0]["nSellado"] + "</td>";
				_html += "           <td>Gs.admin.:</td><td style='font-weight:bold;'>$" + data.records[0]["nGastosAdm"] + "</td>";
				_html += "           <td>Int.compensat.:</td><td style='font-weight:bold;'>$" + data.records[0]["nInteresCompensatorio"] + "</td>";
				_html += "        </tr>";
				_html += "        <tr>";
				_html += "           <td>Seguro:</td><td style='font-weight:bold;'>$" + data.records[0]["nSeguro"] + "</td>";
				_html += "           <td>Riesgo vida:</td><td style='font-weight:bold;'>$" + data.records[0]["nRiesgoVida"] + "</td>";
				_html += "        </tr>";
				_html += "     </tbody>";
				_html += "  </table>";
				_html += "  <div class='DIVbtnResumenHistorico'></div>";
				_html += "</div>";
			}
			$(".areaConsumosHistoricos").html(_html);
			var _rep = $(".btnResumenHistorico").clone();
			_rep.attr("data-prefix", "modal").removeClass("btn-secondary").removeClass("btn-sm").addClass("btn-md").addClass("btn-primary");
			$(".DIVbtnResumenHistorico").html(_rep);
		});
	},
	onResolverCondicional: function (_this) {
		_this.fadeOut("fast");
		var _grupoResuelveCondicional = _this.attr("data-security");
		var _avoidReject = (_this.attr("data-enteexterno") != "16");
		/*CONTROLA LOS PERMISOS DEL USUARIO PARA HABILITAR LA CARGA DE LOS NFORME SMANUALES O RESOLUCION DE CONDICIONALES */
		if (_grupoResuelveCondicional != undefined && _grupoResuelveCondicional != "" && !_TOOLS.isInSecurityGroups(_grupoResuelveCondicional, ".securityGroups")) {
			_this.fadeIn("fast");
			alert("Ud. no tiene permisos para resolver este condicional o ingresar el informe manualmente.  Revise su perfil de seguridad o consulte a su supervisor.");
			return false;
		}
		var _title = _this.attr("data-title");
		var _idEnteExterno = _this.attr("data-enteexterno");
		var _idParent = _this.attr("data-parent");
		var _idTransaccion = _this.attr("data-transaccion");
		var _idRequest = _this.attr("data-request");
		if (_this.attr("data-reejecutable") == undefined) { _this.attr("data-reejecutable", "0"); }
		var _reEjecutable = parseInt(_this.attr("data-reejecutable"));
		var _url = "/Utilidades/TraerFormulario";
		$("#dynResolve").remove();
		var _body = "";
		if (_reEjecutable != 0) {
			_body += "<div class='row p-0 m-0 mb-2 align-items-end'>";
			_body += "   <div class='col-12 p-1 m-0 text-center messageInForm hideReejecucion'>";
			_body += "      <p>En caso de resolver el condicional con una <b>re ejecución</b> tenga en cuenta que debe revisar los datos que generaron el rechazo, solucionar los mismos en el formulario de gestión y luego 'Grabar y continuar la gestión'</b>";
			_body += "      <p>Esto debe realizarse <b>antes</b> de intentar resolver el condicional</p>";
			_body += "      <p style='color:red;'><b>Si no se actualizan los datos y se graba la gestión, el informe seguirá generándose como 'Condicional'</b></p>";
			_body += "   </div>";
			_body += "</div>";
			_body += "<div class='row p-0 m-0 mb-2 align-items-end'>";
			_body += "   <div class='col-3 p-0 m-0'>";
			_body += "      <label>Nombre</label>"
			_body += "      <input type='text' class='form-control wAuto wNombre' id='wNombre' name='wNombre' placeholder='Nombre...'>";
			_body += "   </div>";
			_body += "   <div class='col-2 p-0 m-0'>";
			_body += "      <label>DNI</label>"
			_body += "      <input type='text' class='form-control wAuto wNroDocumento' id='wNroDocumento' name='wNroDocumento' placeholder='DNI...'>";
			_body += "   </div>";
			_body += "   <div class='col-2 p-0 m-0'>";
			_body += "      <label>Sexo</label>"
			_body += "      <select class='form-control wAuto wSexo' id='wSexo' name='wSexo' style='opacity: 1; color: black;'></select>";
			_body += '   </div>';
			_body += "   <div class='col-2 p-0 m-0'>";
			_body += "      <label>Ingresos estimados</label>"
			_body += "      <input type='number' class='form-control wAuto wIngresoMensualEmpresa' id='wIngresoMensualEmpresa' name='wIngresoMensualEmpresa' placeholder='Ingreso mensual $...'>";
			_body += "   </div>";
			_body += "   <div class='col-3 p-0 m-0'>";
			_body += "      <a href='#' class='ml-2 btn btn-info btn-ReEjecutarInforme-modal' data-reejecucion='" + _reEjecutable + "' data-transaccion='" + _idTransaccion + "' data-enteexterno='" + _idEnteExterno + "'>Re ejecutar informe</a>";
			_body += "      <a href='#' data-reload='1' class='btn btn-secondary btn-close-modal cdynResolve d-none showCerrar'>Cerrar</a>";
			_body += "   </div>";
			_body += "</div>";
		}
		_body += "<div class='row'>";
		_body += "   <div class='col-5 showReejecucion'>";
		_body += "      <h5 class='hideReejecucion'>Documentación adicional</h5>";
		_body += "      <table style='width:100%;' class='hideReejecucion'>";
		_body += "         <tr><td><input type='radio' id='rFormat' name='rFormat' class='rFormat' value='image'/> Solo imágenes</td><td><input type='radio' id='rFormat' name='rFormat' class='rFormat' value='pdf'/> Solo PDF</td></tr>";
		_body += "         <tr><td><i>(1 o varios archivos)</i></td><td><i>(1 solo archivo)</i></td></tr>";
		_body += "      </table>";
		_body += "      <div id='drop-area' class='drop-area p-3 d-none'>";
		_body += "         Arrastre y suelte el archivo aquí";
		_body += "      </div>";
		_body += "      <div class='preview' style='width:100%;height:100%;'></div>";
		_body += "   </div>";
		_body += "   <div class='col-7 hideReejecucion'>";
		_body += "      <h5>Comentario del operador</h5>";
		if (!_avoidReject) { _body += "		<select class='form-control wvalidate wEstado' data-id='id' data-descripcion='descripcion' id='wEstado' name='wEstado'></select>"; }
		_body += "      <textarea id='wTexto' name='wTexto' class='form-control wTexto dbase wvalidate' value='' rows='9' style='width:100%;margin:20px auto;' placeholder='Ingrese comentario'></textarea>";
		_body += "   </div>";
		_body += "</div>";
		_body += "<input type='file' id='file-input' hidden multiple>";

		var _html = "";
		_html += "<div class='modal fade' id='dynResolve' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>";
		_html += "   <div class='modal-dialog modal-xl modal-dialog-top'>";
		_html += "      <div class='modal-content' style='position:absolute;top:0px;'>";
		_html += "         <div class='modal-header'>";
		_html += "            <h4 class='modal-title'>" + _title + "</h4>";
		_html += "            <button type='button' class='close btn btn-lg btn-light btn-close-modal cdynResolve' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		_html += '         </div>';
		_html += "		   <div class='windowWaiter card-wait p-2 m-0'>";
		_html += "            <p style='font-weight:bold;color:darkred;'>Aguarde unos instantes, se está accediendo a los datos...</p>";
		_html += "         </div>";
		_html += "         <div class='windowBody modal-body' style='display:none;'>" + _body + "</div>";
		_html += "		   <div class='modal-footer'></hr>";
		_html += "            <div class='row' style='width:100%;'>";
		_html += "               <div class='col-6'>";
		if (!_avoidReject) { _html += "<a href='#' class='btn btn-danger btn-Reject-modal hideReejecucion'>Generar informe de rechazo</a>"; }
		_html += "               </div>";
		_html += "               <div class='col-6 text-right'>";
		_html += "                  <a href='#' class='btn btn-success btn-Save-modal hideReejecucion'>Guardar datos</a>";
		_html += "                  <a href='#' data-reload='0' class='btn btn-secondary btn-close-modal cdynResolve'>Cerrar</a>";
		_html += "               </div>";
		_html += "            </div>";
		_html += "         </div>";
		_html += "      </div>";
		_html += "   </div>";
		_html += "</div>";

		$("body").append(_html);
		_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=NS_EstadoTransaccionManual", "wEstado", 0).then(function (data) { });
		$(".wNombre").val($(".Nombre").val() + " " + $(".Apellido").val());
		$(".wNroDocumento").val($(".NroDocumento").val());
		$(".wSexo").html($(".Sexo").html());
		$(".wIngresoMensualEmpresa").val($(".IngresoMensualEmpresa").val());
		setTimeout(function () {
			$(".windowWaiter").fadeOut("slow", function () {
				_this.fadeIn("fast");
				$(".windowBody").fadeIn("slow");
			})
		}, 250);

		$("body").off("change", ".rFormat").on("change", ".rFormat", function () {
			var _msg = "";
			$(".preview").html("");
			switch ($(this).val()) {
				case "image":
					_msg = "Arrastre y suelte los archivos aquí.</br>Solo PNG, JPG, GIF";
					$("#file-input").attr("multiple", "multiple");
					_VAR.allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
					break;
				case "pdf":
					_msg = "Arrastre y suelte el archivo aquí.</br>Solo PDF";
					$("#file-input").removeAttr("multiple");
					_VAR.allowedTypes = ['application/pdf'];
					break;
			}
			$(".drop-area").html(_msg).removeClass("d-none");
		});

		$("body").off("click", ".btn-close-modal").on("click", ".btn-close-modal", function () {
			var _reload = parseInt($(this).attr("data-reload"));
			if ($(this).hasClass("cdynResolve")) { $(".modal-backdrop").remove(); }
			$("#dynResolve").remove();
			$("body").css({ "overflow-y": "auto" });
			if (_reload == 1) {
				_VAR.onWait(true);
				window.location.reload();
			}
		});
		$("body").off("click", ".btn-Reject-modal").on("click", ".btn-Reject-modal", function () {
			if (!confirm("Se generará un informe de rechazo de la operación.  ¿Confirma?")) { return false; }
			$(".preview").html("<embed class='fileLoaded' type='image/jpg' src='data:image/jpg;base64," + _VAR._image_rechazado + "' style='width:100%;'/>");
			_idEnteExterno = 16; //fuerza informe de rechazo
			$(".btn-Save-modal").click();
		});
		$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
			if (!_TOOLS.validate(".wvalidate", false)) { return false; }
			$(".modal-footer").addClass("d-none");
			$(".modal-body").fadeOut("slow");
			_VAR.onWait(true);
			var _documento = $(".wNroDocumento").val();
			var _sexo = $(".wSexo").val();
			var _ingresosEstimados = $(".wIngresoMensualEmpresa").val();
			var _estado = $(".wEstado").val();
			var _url = "/Utilidades/ResolverCondicional";
			var _params = {
				"idRequest": _idRequest,
				"idTransaccion": _idTransaccion,
				"idEnteExterno": _idEnteExterno,
				"idParent": _idParent,
				"base64": "",
				"comment": $("#wTexto").val()
			};
			if (_documento != undefined) { _params["dni"] = _documento; }
			if (_sexo != undefined) { _params["sexo"] = _sexo; }
			if (_ingresosEstimados != undefined) { _params["ingresosEstimados"] = _ingresosEstimados; }
			if (_estado != undefined && _estado != "" && _estado != "0" && _estado != "-1") { _params["idEstadoTransaccion"] = _estado; }

			var _toPDF = false;
			var _bReady = false;
			var _html = "";
			$(".fileLoaded").each(function () {
				var _b64 = $(this).attr("src");
				switch ($(this).attr("type").split("/")[0]) {
					case "image":
						_bReady = true;
						_toPDF = true;
						_html += "<img src='" + _b64 + "' style='display:block;width:50%;page-break-after:always;'/>";
						break;
					default:
						_params["base64"] = _b64;
						_bReady = true;
						_VAR.ExecutePostAjax(_url, _params).then(function (data) {
							_VAR.onWait(true);
							window.location.reload();
						}).catch(function (err) {
							_bReady = false;
							alert("Se ha producido un error al grabar el PDF provisto.");
						});
						break;
				}
			});
			if (_toPDF) {
				var opt = { margin: 0, pagebreak: { 'mode': ['css', 'legacy'] }, image: { type: 'jpeg', quality: 0.95 }, html2canvas: { scale: 3, y: 0, scrollY: 0 }, jsPDF: { format: 'A4' } };
				html2pdf().from(_html).set(opt).outputPdf().then(function (pdf) {
					_params["base64"] = ("data:application/pdf;base64," + btoa(pdf));
					_bReady = true;
					_VAR.ExecutePostAjax(_url, _params).then(function (data) {
						_VAR.onWait(true);
						window.location.reload();
					}).catch(function (err) {
						alert("Se ha producido un error al grabar el PDF generado con las imágenes provistas.");
					});
				});
			}
			if (!_bReady) {
				alert("¡Debe adjuntar imágenes o PDF de respaldo!");
				$(".modal-footer").removeClass("d-none");
				$(".modal-body").show();
				_VAR.onWait(false);
			} else {
				if (_idEnteExterno == 16) {
					$(".btn-Back").click();
				} else {
					_VAR.onWait(true);
					window.location.reload();
				}
			}
		});

		$("body").off("click", ".btn-ReEjecutarInforme-modal").on("click", ".btn-ReEjecutarInforme-modal", function () {
			var _this = $(this);
			if (!_TOOLS.validate(".wAuto", false)) { return false; }
			_this.hide();
			_VAR.onWait(true);
			var _idTransaccion = $(this).attr("data-transaccion");
			var _reEjecucion = parseInt($(this).attr("data-reejecucion"));
			var _idEnteExterno = $(this).attr("data-enteexterno");
			var _nombre = $(".wNombre").val();
			var _documento = $(".wNroDocumento").val();
			var _sexo = $(".wSexo").val();
			var _ingresosEstimados = $(".wIngresoMensualEmpresa").val();
			var _autoclose = false;
			var _params = {
				"Nombre": _nombre,
				"Documento": _documento,
				"Sexo": _sexo,
				"ingresosEstimados": _ingresosEstimados,
				"notSave": 0,
				"idTransaccion": _idTransaccion,
				"Producto": _idEnteExterno,
				"Formato": "PDF"
			};
			switch (_reEjecucion) {
				case 1: // manual normal como pdf
					break;
				case 2: // manual automatizado, saliendo inmediatamente si da A y registrando como M pero haciendolo automatico
					_autoclose = true;
					_params["notSave"] = 0;
					_params["Modo"] = "M";
					break;
			};

			var _url = "/Utilidades/ConsultaEntidadExterna";
			_VAR.ExecutePostAjax(_url, _params).then(function (data) {
				if (!_autoclose) {
					//if (data != "" && (data == "C" || data == "R")) {
					//	alert("La reejecución arrojó resultado: " + data + ".  No puede resolverse esta situación con este resultado.");
					//	$(".preview").html("");
					//} else {
					if (_TOOLS.isBase64(data)) {
						$(".preview").html("<embed class='fileLoaded' type='application/pdf' src='data:application/pdf;base64," + data + "' style='width:100%;height:640px;'/>");
						$(".hideReejecucion").addClass("d-none");
						$(".btn-close-modal").addClass("d-none");
						$(".wTexto").addClass("d-none");
						$(".showReejecucion").addClass("col-12");
						$(".showCerrar").removeClass("d-none");
					} else {
						alert("El informe solicitado responde con error: " + data);
						$(".preview").html("");
						$(".hideReejecucion").removeClass("d-none");
						$(".showReejecucion").addClass("col-5");
						$(".showCerrar").addClass("d-none");
					}
					//}
				} else {
					alert("El informe solicitado ha sido generado en forma exitosa!");
					_VAR.onWait(true);
					window.location.reload();
				}
				_this.fadeIn("slow");
				_VAR.onWait(false);
			});
		});

		var dropArea = document.getElementById('drop-area');
		dropArea.removeEventListener('dragover', _VAR.preventDefaultsOver);
		dropArea.removeEventListener('dragenter', _VAR.preventDefaultsEnter);
		dropArea.removeEventListener('dragleave', _VAR.preventDefaultsLeave);
		dropArea.removeEventListener('drop', _VAR.handleDrop);

		dropArea.addEventListener('dragover', _VAR.preventDefaultsOver);
		dropArea.addEventListener('dragenter', _VAR.preventDefaultsEnter);
		dropArea.addEventListener('dragleave', _VAR.preventDefaultsLeave);
		dropArea.addEventListener('drop', _VAR.handleDrop);

		var myModal = new bootstrap.Modal(document.getElementById("dynResolve"), { backdrop: true, keyboard: true });
		myModal.toggle();
	},
	onFullAudit: function (_this) {
		var _id = _this.attr("data-id");
		var _title = _this.attr("data-title");
		var _url = "/Utilidades/FullAudit";
		var _params = { "Id": _id };
		$("#dynAudit").remove();
		var _html = "";
		_html += "<div class='modal fade' id='dynAudit' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>";
		_html += "   <div class='modal-dialog modal-xl modal-dialog-top'>";
		_html += "      <div class='modal-content' style='position:absolute;top:0px;'>";
		_html += "         <div class='modal-header'>";
		_html += "            <h4 class='modal-title'>" + _title + "</h4>";
		_html += "            <button type='button' class='close btn btn-lg btn-light btn-close-modal cdynAudit' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		_html += '         </div>';
		_html += "		   <div class='windowWaiter card-wait p-2 m-0'>";
		_html += "            <p style='font-weight:bold;color:darkred;'>Aguarde unos instantes, se está accediendo a los datos...</p>";
		_html += "         </div>";
		_html += "         <div class='windowBody modal-body' style='display:none;'></div>";
		_html += "      </div>";
		_html += "   </div>";
		_html += "</div>";
		$("body").append(_html);
		$("body").off("click", ".btn-close-modal").on("click", ".btn-close-modal", function () {
			if ($(this).hasClass("cdynAudit")) { $(".modal-backdrop").remove(); }
			$("#dynAudit").remove();
			$("body").css({ "overflow-y": "auto" });
		});
		var myModal = new bootstrap.Modal(document.getElementById("dynAudit"), { backdrop: true, keyboard: true });
		myModal.toggle();
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			var _html = "";
			_html += "<table style='width:100%;' class='table table-striped table-hover table-condensed'>";
			_html += "<tr style='background-color:silver;'>";
			_html += "   <td>Timestamp</td>";
			_html += "   <td>Descripción</td>";
			_html += "   <td>Comando</td>";
			_html += "   <td>Parámetros</td>";
			_html += "   <td>Respuesta</td>";
			_html += "</tr>";
			if (data.records != null) {
				for (var i = 0; i < data.records.length; i++) {
					var _json = JSON.parse(data.records[i]["raw_data"]);
					try { var _rd = JSON.parse(_json["returnData"]); } catch (e) { }
					_html += "<tr valign='top'>";
					_html += "   <td valign='top'>" + _TOOLS.prettyDate(_json.timestamp) + "</td>";
					_html += "   <td valign='top'>" + _json.comment + "</td>";
					_html += "   <td valign='top'>" + _json.command + "</td>";
					delete _json["timestamp"];
					delete _json["comment"];
					delete _json["command"];
					try { delete _json["returnData"]; } catch (e) { }
					_html += "   <td valign='top'><pre>" + _TOOLS.prettyPrint(_json) + "</pre></td>";
					_html += "   <td valign='top'>";
					try { _html += "<pre>" + _TOOLS.prettyPrint(_rd) + "</pre>"; } catch (e) { }
					_html += "   </td>";
					_html += "</tr>";
				}
			}
			_html += "</table>";

			$(".windowBody").html(_html);
			setTimeout(function () {
				$(".windowWaiter").fadeOut("slow", function () {
					_this.fadeIn("fast");
					$(".windowBody").fadeIn("slow");
				})
			}, 50);
		});
	},
	onReabrirAuditoriaTransaccion: function (_this) {
		_VAR.p2 = _this.attr("data-id");
		var _pReabrir = { "Id": _VAR.p2, "Usuario": $(".Username").val() };
		if (!confirm("Está a punto de reabrir la auditoría, esto permitirá volver a relizar acciones de auditoría.\n¿Confirma?")) { return false; }
		_VAR.ExecutePostAjax("/Transaccion/ReabrirAuditoria", _pReabrir)
			.then(function (_data) {
				$(".btnConsultarGrillaTransaccion").click();
			})
			.catch(function (err) { alert(err.message); });
	},
	onAuditoriaTransaccion: function (_this) {
		_VAR.p1 = _this.attr("data-idcliente");
		_VAR.p2 = _this.attr("data-id");
		var _realizada = _this.attr("data-realizada");
		var _auditor = _this.attr("data-auditor");
		var _pCerrar = { "Id": _VAR.p2, "Usuario": $(".Username").val() };
		var _title = "Auditoría sobre la transacción: #" + _VAR.p2;
		var _bCerrada = false;
		var _html = "<div class='container'>";
		_html += "      <div class='row px-1 p-0 m-0'><div class='col-12 text-center'>";
		if (_realizada == "") {
			_html += "<a href='#' class='btn btn-dark btn-lg btn-Save-modal'>Cerrar la auditoría</a></div></div>";
		} else {
			_html += "<span class='badge badge-success p-2' style='font-size:1rem;'>Auditoría realizada por <b>" + _auditor + "</b> en fecha " + _realizada + "</span>";
			_bCerrada = true;
		}
		_html += "      <hr/></div>";
		_html += "	    <div class='row px-1 py-1 m-0'>";
		_html += "	       <div class='col-12'><b>Informes automáticos</b></div>";
		_html += "	       <div class='col-12 areaInformesAutomaticos'></div>";
		_html += "	       <div class='col-12'><b>Informes manuales</b></div>";
		_html += "	       <div class='col-12 areaInformesManuales'></div>";
		_html += "	       <div class='col-12 areaDatosTransaccion'></div>";
		_html += "	       <div class='col-12'><b>Domicilios</b></div>";
		_html += "	       <div class='col-12 areaDomicilios'></div>";
		_html += "	       <div class='col-12'><b>Teléfonos</b></div>";
		_html += "	       <div class='col-12 areaTelefonos'></div>";
		_html += "      </div>";
		_html += "   </div>";
		var _params = { "id": "infoModalAuditoria", "title": _title, "body": _html };
		_VAR.onShowInfoModal(_params, function () {
			$(".modal-footer").remove();
			_VAR.buildForAuditoria("", ".areaInformesAutomaticos", "Automaticos", "A", _bCerrada).then(function (data) {
				_VAR.buildForAuditoria("", ".areaInformesManuales", "Manuales", "M", _bCerrada).then(function (_data) {
					$('.chkConfirmAuditoria').bootstrapToggle({ on: 'Correcto', off: 'Observado', width: '90' });
				});
			});

			_VAR.buildDomicilios("P", ".areaDomicilios", true);
			_VAR.buildTelefonos("P", ".areaTelefonos", true);
			_VAR.ExecutePostAjax("/Transaccion/GetAreaDatosTransaccion", { "Id": _VAR.p2 }).then(function (_detalles) {
				$(".areaDatosTransaccion").html(_detalles.mensaje);
			});
			$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
				if (!confirm("Está a punto de cerrar la auditoría, esto fijará el estado de revisión sobre los informes manuales.\n¿Confirma?")) { return false; }
				_VAR.ExecutePostAjax("/Transaccion/CerrarAuditoria", _pCerrar)
					.then(function (_data) {
						$(".btn-close-modal").click();
						$(".btnConsultarGrillaTransaccion").click();
					})
					.catch(function (err) { alert(err.message); });
			});
		});


		$("body").off("click", ".btn-close-modal").on("click", ".btn-close-modal", function () {
			if ($(this).hasClass("cdynAuditoriaTransaccion")) { $(".modal-backdrop").remove(); }
			$("#dynAuditoriaTransaccion").remove();
			$("body").css({ "overflow-y": "auto" });
		});
		var myModal = new bootstrap.Modal(document.getElementById("dynAuditoriaTransaccion"), { backdrop: true, keyboard: true });
		myModal.toggle();

		//$(".windowBody").html(_html);
		setTimeout(function () {
			$(".windowWaiter").fadeOut("slow", function () {
				_this.fadeIn("fast");
				$(".windowBody").fadeIn("slow");
			})
		}, 50);
	},
	onSaveRedMutual: function (_this) {
		if (_TOOLS.validate(".validate", true)) {
			_VAR.onWait(true);
			$("input").attr("disabled", false);
			$("select").attr("disabled", false);
			var _params = _TOOLS.getFormValues(".dbAll");
			var _s = "";
			$(".sAdicionales").each(function () { if ($(this).prop("checked")) { _s += ($(this).val() + "*"); } });
			_params["sAdicionales"] = _s;
			var _urlBack = "/Transaccion/Grilla?tipo=" + _params["Tipo"];
			_VAR.ExecutePostAjax("/Transaccion/SaveRedMutual", _params).then(function (data) {
				_VAR.onWait(false);
				window.location = _urlBack;
			}).catch(function (err) {
				_html = "<h3 style='color:black;'>ERROR</h4>";
				_html += "<h4 style='color:back;'>Ha ocurrido un problema de comunicación, por favor verifique lo siguiente:</h4>";
				_html += "<ul>";
				_html += "<li>Registre el DNI y el sexo de la operación que estaba realizando</li>";
				_html += "<li>Vuelva a la grilla de gestión y verifique si se ha grabado o no lo operación</li>";
				_html += "</ul>";
				_html += "<h5 style='color:blue;'>Al informar a soporte indique DNI y datos del formulario que ha utilizado</h5>";
				_html += "<b>Detalles del error</b>";
				_html += "<pre>" + JSON.stringify(err) + "</pre>";
				_html += "</hr>";
				_html += "<div class='py-4 px-2'>";
				_html += "   <table style='width:100%;'>";
				_html += "      <tr>";
				_html += "         <td align='center'><a href='" + _urlBack + "' class='btn btn-danger'>Volver a la grilla de gestión</a></td>";
				_html += "      </tr>";
				_html += "   </table>";
				_html += "</div>";
				_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Error en el procesamiento", "body": _html },
					function () {
						$(".modal-footer").remove();
						_VAR.onWait(false);
					}
				);
			});
		}
	},
	onFirstEvaluation: function (_this) {
		var _error = false;
		var _html = "";
		if ($(".chkIngresos").prop("checked") && parseInt($(".IngresosForzados").val()) <= 0) {
			alert("Si ha marcado ingresos forzados, debe ingresar un ingreso mayor a 0.  Si no, debe desmarcar los ingresos forzados.");
			return false;
		}

		if (_TOOLS.validate(".validate", true)) {
			$("input").attr("disabled", false);
			$("select").attr("disabled", false);
			var _params = _TOOLS.getFormValues(".dbAll");

			_params["checkIngresoForzados"] = 0;
			_params["ingresosEstimados"] = 0;
			if ($(".chkIngresos").prop("checked") && parseInt($(".IngresosForzados").val()) > 0) {
				_params["checkIngresoForzados"] = 1;
				_params["ingresosEstimados"] = parseInt($(".IngresosForzados").val());
			}
			_params["nIDSucursalPago"] = $(".Sucursales_Activas").val();
			_VAR.onWait(true);

			var _urlBack = "/Transaccion/Grilla?tipo=" + _params["Tipo"];
			_VAR.ExecutePostAjax("/Transaccion/FirstEvaluation", _params).then(function (data) {
				var _url = "/Transaccion/ABMTransaccion?id_sucursal=" + $(".IdUserSucursal").val() + "&sucursal=" + $(".UserSucursal").val() + "&_id=" + data[0].idTransaccion + "&_tipo=" + _params["Tipo"];
				var _estado = "A";
				switch (data[0].estado) {
					case "ERROR":
						_estado = "R";
						if (data[0].mensaje.includes("CONDICIONAL")) { _estado = "C"; }
						break;
					default:
						break;
				}
				switch (_estado) {
					case "A":
						_html += "<h3 style='color:green;'>APROBADO</h3>";
						_html += "<h4 style='color:green;'>Puede continuar la gestión sin inconvenientes</h4>";
						break;
					case "C":
						_html += "<h3 style='color:orange;'>CONDICIONAL</h3>";
						_html += ("<h4 style='color:orange;'>" + data[0].mensaje + "</h4>");
						_html += ("<h5 style='color:orange;'>Debe resolver informes condicionales desde el formulario de gestión</h5>");
						break;
					case "R":
						_html += "<h3 style='color:orange;'>RECHAZADO</h3>";
						_html += ("<h4 style='color:red;'>" + data[0].mensaje + "</h4>");
						_html += ("<h5 style='color:red;'>No puede continuar la gestión debido a un rechazo en los controles</h5>");
						_html += ("<h5 style='color:red;'>Puede ingresar a la gestión para consultar detalles, pero no puede salvarse el rechazo indicado</h5>");
						break;
					default:
						_error = true;
						_html += "<h3 style='color:black;'>ERROR</h3>";
						_html += "<h4 style='color:darkred;'>Ha ocurrido un problema de comunicación, por favor contacte a soporte</h4>";
						_html += "<h5 style='color:blue;'>Indique DNI y condiciones del frmulario de verificación que ha utilizado</h5>";
						break;
				}
				_html += "</hr>";
				_html += "<div class='py-4 px-2'>";
				_html += "   <table style='width:100%;'>";
				_html += "      <tr>";
				_html += "         <td align='center'><a href='" + _urlBack + "' class='btn btn-danger'>Volver a la grilla de gestión</a></td>";
				if (!_error) { _html += "<td align='center'><a href='" + _url + "' class='btn btn-success'>Continuar con esta operación</a></td>"; }
				_html += "      </tr>";
				_html += "   </table>";
				_html += "</div>";
				_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Resultado de la verificación inicial", "body": _html },
					function () {
						$(".modal-footer").remove();
						_VAR.onWait(false);
					}
				);
			}).catch(function (err) {
				_html = "<h3 style='color:black;'>ERROR</h4>";
				_html += "<h4 style='color:back;'>Ha ocurrido un problema de comunicación, por favor verifique lo siguiente:</h4>";
				_html += "<ul>";
				_html += "<li>Registre el DNI y el sexo de la operación que estaba realizando</li>";
				_html += "<li>Vuelva a la grilla de gestión y verifique si se ha grabado o no lo operación</li>";
				_html += "<li>Si la operación fue iniciada, vea si la misma ha sido rechazada o puede gestionarse</li>";
				_html += "<li>Si puede gestionarse, informe a soporte para que le indique si puede o no continuar</li>";
				_html += "<li>Si no puede gestionarse, informe a soporte y aguarde se le indque como continuar</li>";
				_html += "</ul>";
				_html += "<h5 style='color:blue;'>Al informar a soporte indique DNI y condiciones del formulario de verificación que ha utilizado</h5>";
				_html += "<b>Detalles del error</b>";
				_html += "<pre>" + JSON.stringify(err) + "</pre>";
				_html += "</hr>";
				_html += "<div class='py-4 px-2'>";
				_html += "   <table style='width:100%;'>";
				_html += "      <tr>";
				_html += "         <td align='center'><a href='" + _urlBack + "' class='btn btn-danger'>Volver a la grilla de gestión</a></td>";
				_html += "      </tr>";
				_html += "   </table>";
				_html += "</div>";
				_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Error en el procesamiento", "body": _html },
					function () {
						$(".modal-footer").remove();
						_VAR.onWait(false);
					}
				);
			});
		}
	},
	onCheckEnGestion: function (_this) {
		var _showAlert = false;
		var _rechazos = false;
		var _bRefinancia = (parseInt($(".iRefinancia").val()) != 0);
		var _dni = parseInt($(".chkEnGestion").val());
		var _tipo = parseInt($(".chkEnGestion").attr("data-tipo"));
		var _sexo = $(".selEnGestion").val();
		/*Controla si requiere sea cliente o no, para refinanciaciones y cambios de límites de crédito */
		var _OnlyIfClient = (parseInt(_tipo) == 19 || _bRefinancia);

		if (_dni >= 99999 && _sexo != "") {
			$(".btn-ScoringSimulator").show();
			$(".dbReset").val("");
			$(".id_type_modo_pago").val("0").change();
			$(".Sucursales_Activas").val($(".nIDSucursal").val()).prop("disabled", true);
			$(".dCalificacion").html("");
			_VAR.ExecutePostAjax("/Clientes/GetCliente", { "NroDocumento": _dni, "Sexo": _sexo }).then(function (data) {
				if (data.records.length == 0) {
					$(".dCalificacion").html("No es cliente").css({ "border": "double 3px red", "font-weight": "bold" });
				}
				if (data.records.length == 0 && _OnlyIfClient) {
					_VAR.onShowInfoModal({ "id": "errModal", "title": "Alerta", "body": "DNI y sexo informado, no pertenecen a un cliente.  Imposible procesar la operación solicitada." }, function () {
						$(".btn-Save-modal").remove();
						$(".validateFirst").val("");
					});
					return false;
				}
				$.each(data.records, function (i, item) {
					if (i == 0) {
						$(".Ocupacion").val(item.sLKOcupacion.trim());
						var _vTel = item.TelefonoNormalizado.split("|");
						$(".Area").val(_vTel[0].trim());
						$(".Telefono").val(_vTel[1].trim());
						$(".Nombre").val(item.sNombre.trim());
						$(".Apellido").val("");
						$(".CUIL").val(_TOOLS.stripNumbers(item.nCUIL.trim()));
						$(".Email").val(item.sEmail.trim());
						$(".Sexo").val(item.sSexo.trim());
						$(".dFechaNac").val(item.dFechaNac.trim().split("T")[0]).change();
						$(".dCalificacion").html(item.sLKCalificacion.trim()).css({ "border": "double 3px blue" });

						/*Evaluar si tiene tarjeta en caso de ser una verificacion de tarjeta! */
						switch (_tipo) {
							case 2: //refinanciacion credito CP
							case 4: //refinanciacion credito Amutra
							case 563: //refinanciacion tarjeta CABAL
							case 566: //Refinanciacion cabal/cabal
								_VAR.ExecutePostAjax("/Transaccion/CheckProductoVigente", { "NroDocumento": _dni, "Sexo": _sexo, "Tipo": _tipo }).then(function (data) {
									if (data.records[0].Mensaje != '') {
										$(".btn-ScoringSimulator").hide();
										alert(data.records[0].Mensaje);
										window.location.reload();
									}
								});
								break;
						}
						_VAR.ExecutePostAjax("/Transaccion/HabilitarSeguimientoGestion", { "Id": item.nID, "IdProducto": _tipo }).then(function (data) {
							var _msg = data.records[0]["Respuesta"];
							if (_msg != "") {
								_VAR.onDestroyModal("#infoModalEnGestion");
								var _body = ("<p>No es posible continuar con la gestión de este DNI la pre evaluación indica:</p><h5 style='color:red;'>" + _msg + "</h5><br/>");
								var _params = { "id": "infoModalAlert", "title": "Alerta de gestión", "body": _body };
								_VAR.onShowInfoModal(_params, function () {
									$(".modal-dialog").removeClass("modal-xl").addClass("modal-sm");
									$(".modal-footer").remove();
									$(".validateFirst").val("");
									$(".Nombre").val("");
									$(".Apellido").val("");
									$(".dFechaNac").val("");
									$(".dCalificacion").html("").css({ "border": "double 0px blue" });
								});
							} else {
								$(".IdCreditoRenovar").val(data.records[0]["IdCredito_A_Renovar"]);
							}
						});
					}
				});
				$(".validateAge").attr("data-calificacion", $(".dCalificacion").html());
			});
			//if (!_OnlyIfClient) {
			_VAR.ExecutePostAjax("/Transaccion/CheckLimitesEnGestion", { "NroDocumento": _dni, "Sexo": _sexo, "Tipo": _tipo }).then(function (data) {
				var _backdrop = true;
				var _title = ("Operaciones pendientes y límites de gestión para el DNI " + _dni);
				var _body = "";
				_body += "<table class='table table-sm' style='width:100%;font-size:0.8rem;'>";
				_body += "<tr style='background-color:silver;'>";
				_body += "   <td></td>";
				_body += "   <td>ID</td>";
				_body += "   <td>Fecha</td>";
				_body += "   <td>Producto</td>";
				_body += "   <td>Verificación</td>";
				_body += "</tr>";
				$.each(data.records, function (i, item) {
					var _bShow = false;
					var _bSame = (_tipo == parseInt(item.Tipo));
					var _blink = "";
					switch (_tipo) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 563:
						case 566: //Refinanciacion cabal+cabal
							switch (parseInt(item.Tipo)) {
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
								case 6:
								case 7:
								case 8:
								case 9:
								case 10:
								case 14:
								case 141:
								case 241:
								case 563:
								case 566: //Refinanciacion cabal+cabal
									_bShow = true;
									_showAlert = true;
							}
							break;
					}
					var _color = "success";
					_body += "<tr>";
					_body += "   <td>";
					if (!_bSame) {
						_body += "<a href='#' data-tipo='" + _tipo + "' data-id='" + item.Id + "' class='btn btn-primary btn-sm btnConvertir'>Convertir en producto</a>";
					} else {
						_backdrop = 'static';
						_blink = "blink_me";
						_body += "<a href='#' data-tipo='" + item.Tipo + "' data-id='" + item.Id + "' class='btn btn-success btn-sm btnRetomar'>Retomar gestión</a>";
					}
					_body += "   </td>";
					_body += "   <td>" + item.Id + "</td>";
					_body += "   <td>" + item.fechaFormat + "</td>";
					_body += "   <td>" + item.Producto + "</td>";
					if (parseInt(item.rechazada) != 0) {
						_rechazos = true;
						_color = "danger";
					}
					_body += "   <td><span class='" + _blink + " badge badge-" + _color + "'>" + item.message_control_validez + "</span></td>";
					_body += "</tr>";
				});
				_body += "</table><br/>";
				if (_backdrop == "static") {
					_body += "<div class='p-2 text-center' style='font-size:0.75rem;border:double 3px red;border-radius:10px;color:darkred;background-color:ivory;'>";
					_body += "<p style='font-weight:bold;' class='m-0'>";
					_body += "Existe, al menos, una operación activa para este DNI del tipo que está intentando dar de alta.  No puede ingresar una nueva operación, sin haber terminado la gestión en curso<br/>";
					_body += "<b>No puede generar una nueva operación de este tipo</b>.  Retome la gestión y conclúyala.";
					_body += "</p>";
					_body += "</div><br/>";
				}

				_body += "<div class='p-2 text-center' style='font-size:0.75rem;border:solid 1px red;border-radius:10px;'>";
				_body += "<p style='font-weight:bold;' class='m-0'>";
				_body += "Se listan las transacciones de acuerdo a reglas de control de duplicidad y de gestión recurrente de rechazos en período determinado.<br/>";
				_body += "Adicionalmente se considera el intervalo de vuelta a gestionar de operaciones cerradas con o sin contacto en forma negativa.";
				_body += "</p>";
				_body += "</div>";
				var _params = { "id": "infoModalEnGestion", "title": _title, "body": _body, "backdrop": _backdrop, "keyboard": false };
				if (_showAlert) {
					_VAR.onShowInfoModal(_params, function () {
						$(".modal-footer").remove();
						$(".btn-close-modal").remove()
						_VAR.onWait(false);
					});
				};
			}).catch(function (err) {
				console.log("err");
				console.log(err);
			});
			//}
		} else {
			$(".dbReset").val("");
			$(".id_type_modo_pago").val("0").change();
			$(".Sucursales_Activas").val($(".nIDSucursal").val()).prop("disabled", true);
			$(".dCalificacion").html("");
		}
	},
	onResetScoring: function (_this) {
		var _tipo = parseInt($(".Tipo").val());
		if (_tipo != 17) {
			$(".areaScoring").html("");
			$(".btn-FirstEvaluation").addClass("d-none");
		}
	},
	onConvertir: function (_this) {
		if (!confirm("¿Confirma la conversión a producto de la nueva solicitud?")) { return false; };
		$(".idTransaccionOriginal").val(_this.attr("data-id"));
		var _url = "/Transaccion/ABMTransaccion?id_sucursal=" + $(".IdUserSucursal").val() + "&sucursal=" + $(".UserSucursal").val() + "&_id=0&_id_original=" + _this.attr("data-id") + "&_tipo=" + _this.attr("data-tipo");
		window.location = _url;
	},
	onRetomar: function (_this) {
		if (!confirm("¿Confirma continuar la gestión de la solicitud seleccionada?")) { return false; };
		var _url = "/Transaccion/ABMTransaccion?id_sucursal=" + $(".IdUserSucursal").val() + "&sucursal=" + $(".UserSucursal").val() + "&_id=" + _this.attr("data-id") + "&_tipo=" + _this.attr("data-tipo");
		window.location = _url;
	},
	onGetTransaccionOriginal: function (_id) {
		_VAR.ExecutePostAjax("/Transaccion/GetTransaccionOriginal", { "Id": _id }).then(function (data) {
			var _data = null;
			if (data.records[0]["Nombre"] == data.records[0]["Apellido"]) {
				_data = data.records[0]["Nombre"].trim().replace(/\s\s/g, ' ').split(" ");
				$(".Nombre").val(_data.shift());
				$(".Apellido").val(_data.pop());
			} else {
				$(".Nombre").val(data.records[0]["Nombre"]);
				$(".Apellido").val(data.records[0]["Apellido"]);
			}
			$(".Documento").val(data.records[0]["NroDocumento"]).attr("disabled", true);
			if (data.records[0]["Sexo"] != "") { $(".Sexo").val(data.records[0]["Sexo"]).attr("disabled", true); }
			$(".CUIL").val(_TOOLS.stripNumbers(data.records[0]["CUIL"]));
			$(".Ocupacion").val(data.records[0]["Ocupacion"].trim());
			$(".Email").val(data.records[0]["Email"]);
			$(".Area").val(data.records[0]["prefijoTelefono"]);
			$(".Telefono").val(data.records[0]["Telefono"]);
		});
	},
	onResolverScoring: function (_nombre,
		_documento, _sexo, _ingresosEstimados,
		_importeSolicitado, _idTransaccion,
		_idRequest, _notSave, _modo,
		_chkIngresosForzados, _idComercio = 0) {
		return new Promise(
			function (resolve, reject) {
				try {
					var _simulador = 0;
					_VAR._productoConsulta = $(".ProductoConsulta").val();
					var iRefinancia = (parseInt($(".iRefinancia").val()) == 1);
					var iTarjeta = (parseInt($(".iTarjeta").val()) == 1);
					var endeudamientoTarjeta = $(".endeudamientoTarjeta").val();
					var endeudamientoCredito = $(".endeudamientoCredito").val();
					if (endeudamientoTarjeta == "") { endeudamientoTarjeta = 0; }
					if (endeudamientoCredito == "") { endeudamientoCredito = 0; }
					if (_modo == "calificacion") { $(".rEndeudamiento").removeClass("d-none"); }
					if (_VAR._simuladorScoringActivo) { _simulador = 1; }
					if (_ingresosEstimados == "" || _ingresosEstimados == null || _ingresosEstimados < 0) { _ingresosEstimados = 0; }

					var _none = "";
					if (iRefinancia) { _none = "d-none"; }
					var _html = "";
					if (_notSave == 1) {
						_html += "<div class='row align-items-center' style='font-size: 0.85em;'>";
						var _colLeft = "col-4";
						var _colRight = "col-8";
						if (iTarjeta) {
							_colLeft = "col-6";
							_colRight = "col-6";
						}
						if (_VAR._productoConsulta == "RC2C") {
							_colLeft = "col-1";
							_colRight = "col-11";
						}

						_html += "	<div class='" + _colLeft + " auxScoring " + _none + "'>";
						_html += "		<div class='row align-items-center py-1'>";
						var _checked = "";
						var _hideInforme = "d-none";
						var _hideCheckIngresos = "";
						if ((_chkIngresosForzados != 0) || (!_VAR._simuladorScoringActivo && _VAR._persistCheck != 0)) {
							_checked = "checked";
							_hideInforme = "";
						}
						if (!_VAR._simuladorScoringActivo) { _hideCheckIngresos = "d-none"; }
						_html += "			<div class='col-12 text-left areaForzar noPromocion " + _hideCheckIngresos + "'><h5><span class='forzarTitle'>Forzar ingresos </span><input " + _checked + " id='chkIngresos' name='chkIngresos' type='checkbox' class='chkIngresos changeCheckSimulator'/></h5></div>";
						if (!_VAR._simuladorScoringActivo) {
							_html += "			<div class='col-12 text-center areaIngresos py-1 noPromocion divInformeIngresos " + _hideInforme + "'>";
							_html += "				<b style='color:red;'>Requiere ingreso manual de </b>";
							_html += "				<a href='#' class='pl-2 btn btn-danger btn-sm btnResolverCondicional' data-security='' data-request='" + _idRequest + "' data-enteexterno='9' data-transaccion='" + _idTransaccion + "' data-parent='0' data-title='Comprobante manual para: Comprobante de ingresos'>Comprobante de ingresos</a>";
							_html += "			</div>";
							_html += "          <div class='col-12 text-center areaIngresos'>Ingresos considerados</div>";
							_html += "			<div class='col-3 text-right areaIngresos noPromocion'></div>";
							_html += "			<div class='col-6 text-center areaIngresos noPromocion'>";
							_html += "				<input type='number' disabled value='" + _ingresosEstimados + "' class='changeSimulator form-control number IngresosForzados' id='IngresosForzados' name='IngresosForzados' style='font-size:1rem;text-align:center;' />";
							_html += "			</div>";
						} else {
							_html += "          <div class='col-12 text-center areaIngresos hideForzar'>Ingresos considerados</div>";
							_html += "			<div class='col-3 text-right areaIngresos noPromocion hideForzar '></div>";
							_html += "			<div class='col-6 text-center areaIngresos noPromocion hideForzar '>";
							_html += "				<input type='number' value='" + _ingresosEstimados + "' class='changeSimulator form-control number IngresosForzados' id='IngresosForzados' name='IngresosForzados' style='font-size:1rem;text-align:center;' />";
							_html += "			</div>";
						}
						_html += "			<div class='col-3 text-left areaIngresos noPromocion hideForzar d-none'></div>";
						_html += "		</div>";

						_html += "		<div class='row align-items-center py-1 areaCapital'>";
						if (!iTarjeta) { _html += "<div class='col-12 text-left'><h5 class='titleCapital'>Modificar capital</h5></div>"; }
						if (iTarjeta) { $(".titleScoring").html("Ingresar límite de crédito"); }
						_html += "			<div class='col-3 text-center'>Mínimo</div>";
						_html += "			<div class='col-6 areaSelector text-center py-2'>";
						_html += "				<div class='slidecontainer'>";
						_html += "					<input type='range' min='1' max='100' value='100' step='" + _VAR._IntervalSlider + "' class='slider SliderMonto' id='SliderMonto' name='SliderMonto'>";
						_html += "				</div>";
						_html += "			</div>";
						_html += "			<div class='col-3 text-center'>Máximo</div>";

						_html += "			<div class='col-3 areaMinimo text-center'></div>";
						_html += "			<div class='col-6 areaSelector text-center'>";
						_html += "				<input type='number' value='' min='' max='' class='form-control number MontoSeleccionado' id='MontoSeleccionado' name='MontoSeleccionado' style='font-size:1rem;text-align:center;' />";
						_html += "			</div>";
						_html += "			<div class='col-3 areaMaximo text-center'></div>";
						_html += "		</div>";
						if (iTarjeta) {
							_html += "		<div class='row align-items-center py-1 sliderTarjeta2 d-none'>";
							_html += "			<div class='col-12 text-center'>Crédito</div>";
							_html += "			<div class='col-3 text-center'>Mínimo</div>";
							_html += "			<div class='col-6 areaSelector2 text-center py-2'>";
							_html += "				<div class='slidecontainer'>";
							_html += "					<input type='range' min='1' max='100' value='100' step='" + _VAR._IntervalSlider + "' class='slider SliderMonto2' id='SliderMonto2' name='SliderMonto2'>";
							_html += "				</div>";
							_html += "			</div>";
							_html += "			<div class='col-3 text-center'>Máximo</div>";

							_html += "			<div class='col-3 areaMinimo2 text-center'></div>";
							_html += "			<div class='col-6 areaSelector2 text-center'>";
							_html += "				<input type='number' value='' min='' max='' class='form-control number MontoSeleccionado2' id='MontoSeleccionado2' name='MontoSeleccionado2' style='font-size:1rem;text-align:center;' />";
							_html += "			</div>";
							_html += "			<div class='col-3 areaMaximo2 text-center'></div>";
							_html += "		</div>";

							_html += "		<div class='row align-items-center py-1 sliderTarjeta3 d-none'>";
							_html += "          <div class='col-12 text-center'>Préstamo</div>";
							_html += "			<div class='col-3 text-center'>Mínimo</div>";
							_html += "			<div class='col-6 areaSelector3 text-center py-2'>";
							_html += "				<div class='slidecontainer'>";
							_html += "					<input type='range' min='1' max='100' value='100' step='" + _VAR._IntervalSlider + "' class='slider SliderMonto3' id='SliderMonto3' name='SliderMonto3'>";
							_html += "				</div>";
							_html += "			</div>";
							_html += "			<div class='col-3 text-center'>Máximo</div>";

							_html += "			<div class='col-3 areaMinimo3 text-center'></div>";
							_html += "			<div class='col-6 areaSelector3 text-center'>";
							_html += "				<input type='number' value='' min='' max='' class='form-control number MontoSeleccionado3' id='MontoSeleccionado3' name='MontoSeleccionado3' style='font-size:1rem;text-align:center;' />";
							_html += "			</div>";
							_html += "			<div class='col-3 areaMaximo3 text-center'></div>";
							_html += "		</div>";
						}

						if (_VAR._simuladorScoringActivo) {
							_html += "		<div class='row align-items-center py-1'>";
							_html += "			<div class='col-12 text-left'><a href='#' class='btn btn-primary btnGenerarScoringPdf'>Generar PDF</a></div>";
							_html += "		</div>";
						}
						_html += "	</div>";
						_html += "	<div class='" + _colRight + "' align-items-center'>";
						_html += "		<div class='areaCuotas align-items-center'></div>";
						_html += "	</div>";
						if (!_VAR._simuladorScoringActivo && $(".allowGrabarPlan").val() == "S") {
							_html += "	<div class='col-12 text-right'>";
							var _btnClick = "btn-GrabarCapitalCuotas";
							if (iTarjeta) { _btnClick = "btn-GrabarLimitesTarjeta"; }
							_html += "	   <a href='#' class='btn btn-sm btn-warning " + _btnClick + "'><span class='material-icons'>save</span> Grabar selección</a>";
							_html += "  </div>";
						}
						_html += "</div>";
						$(".areaScoring").html(_html);
						$(".IngresosForzados").prop("disabled", !$(".chkIngresos").prop("checked"));
					}
					if (_VAR._simuladorScoringActivo) { _importeSolicitado = 0; }

					var _params = {
						"Documento": _documento,
						"Sexo": _sexo,
						"ingresosEstimados": _ingresosEstimados,
						"notSave": _notSave,
						"idTransaccion": _idTransaccion,
						"Producto": 12,
						"Formato": "HTML",
						"fullResponse": 1,
						"Nombre": _nombre,
						"Ocupacion": $(".Ocupacion").val(),
						"idSucursal": $(".nIDSucursal").val(),
						"idSucursalPago": $(".IdSucursalPago").val(),
						"ProductoConsulta": _VAR._productoConsulta,
						"importeSolicitado": _importeSolicitado,
						"simulador": _simulador,
						"Modo": _modo,
						"endeudamientoTarjeta": endeudamientoTarjeta,
						"endeudamientoCredito": endeudamientoCredito,
						"idComercio": _idComercio
					};
					_VAR.ExecutePostAjax("/Utilidades/ConsultaEntidadExterna", _params)
						.then(function (data) {
							_VAR._lastAreaScoringPdf = data;
							switch (parseInt($(".Tipo").val())) {
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
								case 6:
								case 7:
								case 8:
								case 9:
								case 10:
									/*solo reasigna producto en caso de ser algun tipo de credito */
									if ($(".Id").val() == undefined || parseInt($(".Id").val()) == 0) {
										$(".Tipo").val(data.idProducto);
										_VAR._productoConsulta = data.codigoProducto;
										$(".ProductoConsulta").val(_VAR._productoConsulta);
										$(".hTitulo").html("Nueva operación de " + data.descripcionProducto);
									}
									break;
							}

							if (_notSave == 0) {
								resolve(data);
								return false;
							}
							$("body").off("click", ".btnGenerarScoringPdf").on("click", ".btnGenerarScoringPdf", function () {
								//$(".areaScoringPdf").html(_VAR._lastAreaScoringPdf.text + $(".areaCuotas").html());
								$(".areaScoringPdf").html(_VAR._lastAreaScoringPdf.text);
								_VAR.ExecutePostAjax("/Utilidades/HtmlToPdfBase64", { "PlainString": $(".areaScoringPdf").html() }).then(function (pdf) {
									var _mime = "application/pdf";
									var _body = ("<embed type='" + _mime + "' src='" + ("data:" + _mime + ";base64," + pdf) + "' style='height:600px;width:100%;'/>");
									_VAR.onShowInfoModal({ "id": "ScoringPdf", "title": "Calificación", "body": _body }, function () {
										$(".btn-Save-modal").remove();
										$(".btn-close-modal").html("Cerrar");
									});
								});
							});
							$("body").off("keyup", ".MontoSeleccionado").on("keyup", ".MontoSeleccionado", function () {
								var _val = $(this).val();
								if (_val == "") { $(this).val(0); }
								clearTimeout(_VAR._TIMER_LAZY2);
								_VAR._TIMER_LAZY2 = setTimeout(function () {
									$(".SliderMonto").val(_val).trigger("input");
									_VAR.onBuildPlanes(_scoring);
								}, 1250);
							});
							$("body").off("input", ".SliderMonto").on("input", ".SliderMonto", function () {
								var _val = $(this).val();
								$(".MontoSeleccionado").val(_val);
								if (!iTarjeta) {
									clearTimeout(_VAR._TIMER_LAZY1);
									_VAR._TIMER_LAZY1 = setTimeout(function () { _VAR.onBuildPlanes(_scoring); }, 500);
								}
							});

							if (iTarjeta) {
								$("body").off("keyup", ".MontoSeleccionado2").on("keyup", ".MontoSeleccionado2", function () {
									var _val = $(this).val();
									if (_val == "") { $(this).val(0); }
									clearTimeout(_VAR._TIMER_LAZY2);
									_VAR._TIMER_LAZY2 = setTimeout(function () {
										$(".SliderMonto2").val(_val).trigger("input");
										if (!iTarjeta) { _VAR.onBuildPlanes(_scoring); }
									}, 1250);
								});
								$("body").off("input", ".SliderMonto2").on("input", ".SliderMonto2", function () {
									var _val = $(this).val();
									$(".MontoSeleccionado2").val(_val);
									if (!iTarjeta) {
										clearTimeout(_VAR._TIMER_LAZY1);
										_VAR._TIMER_LAZY1 = setTimeout(function () { _VAR.onBuildPlanes(_scoring); }, 500);
									}
								});
								$("body").off("keyup", ".MontoSeleccionado3").on("keyup", ".MontoSeleccionado3", function () {
									var _val = $(this).val();
									if (_val == "") { $(this).val(0); }
									clearTimeout(_VAR._TIMER_LAZY2);
									_VAR._TIMER_LAZY2 = setTimeout(function () {
										$(".SliderMonto2").val(_val).trigger("input");
										if (!iTarjeta) { _VAR.onBuildPlanes(_scoring); }
									}, 1250);
								});
								$("body").off("input", ".SliderMonto3").on("input", ".SliderMonto3", function () {
									var _val = $(this).val();
									$(".MontoSeleccionado3").val(_val);
									if (!iTarjeta) {
										clearTimeout(_VAR._TIMER_LAZY1);
										_VAR._TIMER_LAZY1 = setTimeout(function () { _VAR.onBuildPlanes(_scoring); }, 500);
									}
								});
							}
							$("body").off("keyup", ".changeSimulator").on("keyup", ".changeSimulator", function () {
								var _val = $(this).val();
								if (_val == "") { $(this).val(0); }
								clearTimeout(_VAR._TIMER_LAZY3);
								_VAR._TIMER_LAZY3 = setTimeout(function () {
									if (_VAR._simuladorScoringActivo) {
										_FUNCTIONS.onResolverScoring($("#Nombre").val(), $("#Documento").val(), $("#Sexo").val(), $(".IngresosForzados").val(), 0, 0, 0, 1, "simulador", $(".checkIngresoForzados").val(), $(".idcomercio").val());
									} else {
										$(".ingresoMensual").val($(".IngresosForzados").val());
										var _importeSolicitado = $(".importeSolicitado").val();
										if (_importeSolicitado == "") { _importeSolicitado = 0; }
										_FUNCTIONS.onResolverScoring($("#Nombre").val(), $("#NroDocumento").val(), $("#Sexo").val(), $(".IngresosForzados").val(), _importeSolicitado, $("#Id").val(), $("#id_obj").val(), 1, "simulador", $(".checkIngresoForzados").val(), $(".idcomercio").val());
									}
								}, 1000);
							});
							$("body").off("change", ".cuotas").on("change", ".cuotas", function () {
								var _record = JSON.parse(_TOOLS.b64_to_utf8($(this).attr("data-record")));
								$(".btn-GrabarCapitalCuotas").attr("data-record", $(this).attr("data-record"));
								var _fixedCapital = parseFloat(_record["Monto_a_Ofrecer"]);
								if (parseFloat(_record["Monto_a_Ofrecer"]) > parseFloat(_record["MontoOfrecido"])) { _fixedCapital = parseFloat(_record["MontoOfrecido"]); }
								var _maximo = parseFloat(_record["MontoOfrecido"]);
								$(".importeCancelacion").val(_record["ImporteCancelacion"]);
								$(".importeEntregar").val(_record["ImporteAEntregar"]);
								if (isNaN(_maximo)) { _maximo = 0; }
								if (_maximo <= _minimo) { _maximo = _minimo; }
								$(".SliderMonto").attr("min", _minimo).attr("max", _maximo);
								var y = document.getElementById("SliderMonto");
								y.value = _fixedCapital;
								$(".areaMaximo").html(_TOOLS.formatMoney(_maximo));
								$(".MontoSeleccionado").val(_fixedCapital);
								if (iTarjeta) {
									$(".areaMaximo2").html(_TOOLS.formatMoney(_maximo));
									$(".areaMaximo3").html(_TOOLS.formatMoney(_maximo));
									if ($(".LimiteCompra").val() == "") { $(".LimiteCompra").val("0"); }
									if ($(".LimiteCredito").val() == "") { $(".LimiteCredito").val("0"); }
									if ($(".LimitePrestamo").val() == "") { $(".LimitePrestamo").val("0"); }
									$(".MontoSeleccionado").val($(".LimiteCompra").val());
									$(".MontoSeleccionado2").val($(".LimiteCredito").val());
									$(".MontoSeleccionado3").val($(".LimitePrestamo").val());
									$(".SliderMonto2").attr("min", _minimo).attr("max", _maximo);
									var y = document.getElementById("SliderMonto");
									y.value = $(".LimiteCompra").val();
									var y = document.getElementById("SliderMonto2");
									y.value = $(".LimiteCredito").val();
									$(".SliderMonto3").attr("min", _minimo).attr("max", _maximo);
									var y = document.getElementById("SliderMonto3");
									y.value = $(".LimitePrestamo").val();

								}
							});
							$("body").off("change", ".chkIngresos").on("change", ".chkIngresos", function () {
								if ($(this).prop("checked")) {
									_VAR._persistCheck = 1;
									$(".IngresosForzados").prop("disabled", false);
									$(".divInformeIngresos").removeClass("d-none");
									$(".hideForzar").removeClass("d-none");
								} else {
									_VAR._persistCheck = 0;
									$(".IngresosForzados").prop("disabled", true);
									$(".divInformeIngresos").addClass("d-none");
									$(".hideForzar").addClass("d-none");
								}
							});

							var _html = "";
							var _minimo = 0;
							var _maximo = 0;
							var _capital = 0;
							var _scoring = JSON.parse(data.scoring);
							if (_scoring.length == 0) {
								_scoring = [{}];
								$(".btn-FirstEvaluation").addClass("d-none");
								_html = "<h5>No es posible resolver scoring para esta operación</h5>";
								if (!_VAR._simuladorScoringActivo) { _html += "<span style='color:red;'>Cerrar la operación con </span><a href='#' class='m-2 btn btn-danger btn-sm btnResolverCondicional' data-request='" + _idRequest + "' data-enteexterno='16' data-security='' data-transaccion='" + _idTransaccion + "' data-parent='0' data-title='Comprobante manual para: Informe de rechazo'>Informe de rechazo</a>"; }
							} else {
								$(".btn-FirstEvaluation").removeClass("d-none");
							}

							var _plan = $(".idPlan").val();

							if (!$(".chkIngresos").prop("checked")) { $(".IngresosForzados").val((_scoring[0]["IngresoMensual"])); }

							_VAR._lastPlanIndex = 0;
							if (_plan != "") {
								var _plan = $(".idPlan").val();
								$.each(_scoring, function (i, val) {
									if (parseInt(_plan) == parseInt(val["nIDPlan"])) { _VAR._lastPlanIndex = i; }
								});
							};
							if (_scoring[_VAR._lastPlanIndex].hasOwnProperty("Minimo") && _scoring[_VAR._lastPlanIndex].hasOwnProperty("MontoOfrecido")) {
								if (_scoring[_VAR._lastPlanIndex]["Minimo"] == null || _scoring[_VAR._lastPlanIndex]["Minimo"] == "") { _scoring[_VAR._lastPlanIndex]["Minimo"] = 0; }
								_minimo = parseFloat(_scoring[_VAR._lastPlanIndex]["Minimo"]);
								if (_scoring[_VAR._lastPlanIndex]["MontoOfrecido"] == null || _scoring[_VAR._lastPlanIndex]["MontoOfrecido"] == "") { _scoring[_VAR._lastPlanIndex]["MontoOfrecido"] = 0; }
								_maximo = parseFloat(_scoring[_VAR._lastPlanIndex]["MontoOfrecido"]);
								_capital = parseFloat(_scoring[_VAR._lastPlanIndex]["Monto_a_Ofrecer"]);
								if (parseFloat(_scoring[_VAR._lastPlanIndex]["Monto_a_Ofrecer"]) > parseFloat(_scoring[_VAR._lastPlanIndex]["MontoOfrecido"])) {
									_capital = parseFloat(_scoring[_VAR._lastPlanIndex]["MontoOfrecido"]);
								}
							}
							if (isNaN(_maximo)) { _maximo = 0; }
							if (_maximo <= _minimo) { _maximo = _minimo; }
							$(".SliderMonto").attr("min", _minimo).attr("max", _maximo);
							if (_maximo <= 0) {
								$(".areaScoringWaiter").addClass("d-none");
								$(".areaCuotas").html(_html);
								$(".MontoSeleccionado").addClass("d-none");
								if (_VAR._simuladorScoringActivo) { $(".areaForzar").addClass("d-none"); }
							}
							$(".MontoSeleccionado").removeClass("d-none");
							if (_VAR._simuladorScoringActivo) { $(".areaForzar").removeClass("d-none"); }

							if (_VAR._productoConsulta == "RC2C") {
								if (_VAR._simuladorScoringActivo) { $(".areaForzar").addClass("d-none"); }
								$(".areaCapital").addClass("d-none");
								$(".areaIngresos").addClass("d-none");
							}

							var y = document.getElementById("SliderMonto");
							y.value = _capital;
							$(".SliderMonto").trigger("input");
							$(".areaMaximo").html(_TOOLS.formatMoney(_maximo));
							$(".MontoSeleccionado").val(_capital);
							$(".areaScoringError").addClass("d-none");
							$(".areaScoring").removeClass("d-none");
							$(".areaScoring").show();
							$(".areaMinimo").html("<input type='hidden' id='minimo' name='minimo' class='minimo' value='" + _minimo + "'/>" + _TOOLS.formatMoney(_minimo));
							$(".areaMaximo").html("<input type='hidden' id='maximo' name='maximo' class='maximo' value='" + _maximo + "'/>" + _TOOLS.formatMoney(_maximo));
							$(".MontoSeleccionado").attr("min", _minimo).attr("max", _maximo);

							if (iTarjeta) {
								$(".SliderMonto2").attr("min", _minimo).attr("max", _maximo);
								$(".SliderMonto3").attr("min", _minimo).attr("max", _maximo);
								$(".SliderMonto2").trigger("input");
								$(".SliderMonto3").trigger("input");

								$(".areaMaximo2").html(_TOOLS.formatMoney(_maximo));
								$(".areaMaximo3").html(_TOOLS.formatMoney(_maximo));
								$(".areaMinimo2").html("<input type='hidden' id='minimo2' name='minimo2' class='minimo2' value='" + _minimo + "'/>" + _TOOLS.formatMoney(_minimo));
								$(".areaMaximo2").html("<input type='hidden' id='maximo2' name='maximo2' class='maximo2' value='" + _maximo + "'/>" + _TOOLS.formatMoney(_maximo));
								$(".areaMinimo3").html("<input type='hidden' id='minimo3' name='minimo3' class='minimo3' value='" + _minimo + "'/>" + _TOOLS.formatMoney(_minimo));
								$(".areaMaximo3").html("<input type='hidden' id='maximo3' name='maximo3' class='maximo3' value='" + _maximo + "'/>" + _TOOLS.formatMoney(_maximo));
								$(".MontoSeleccionado2").attr("min", _minimo).attr("max", _maximo);
								$(".MontoSeleccionado3").attr("min", _minimo).attr("max", _maximo);

								if ($(".LimiteCompra").val() == "") { $(".LimiteCompra").val("0"); }
								if ($(".LimiteCredito").val() == "") { $(".LimiteCredito").val("0"); }
								if ($(".LimitePrestamo").val() == "") { $(".LimitePrestamo").val("0"); }
								$(".MontoSeleccionado").val($(".LimiteCompra").val());
								$(".MontoSeleccionado2").val($(".LimiteCredito").val());
								$(".MontoSeleccionado3").val($(".LimitePrestamo").val());

								var y = document.getElementById("SliderMonto");
								y.value = $(".LimiteCompra").val();
								var y = document.getElementById("SliderMonto2");
								y.value = $(".LimiteCredito").val();
								var y = document.getElementById("SliderMonto3");
								y.value = $(".LimitePrestamo").val();

								$(".areaScoringWaiter").addClass("d-none");
								$(".areaNosis").addClass("d-none");
							}
							$(".IngresosForzados").val(_ingresosEstimados);
							resolve(data);
						})
						.catch(function (err) {
							console.log(err);
							_VAR.onWait(false);
							$(".areaScoring").addClass("d-none");
							$(".areaScoringError").removeClass("d-none").html("<h3 style='color:red;'>Hay problemas para resolver la consulta.  Reporte a soporte.</h3>");
							$(".areaScoringWaiter").addClass("d-none");
							reject(err);
						});
				} catch (rex) {
					reject(rex);
				}
			}
		);
	},
	onGrabarLimitesTarjeta: function (_this) {
		_VAR.onWait(true);
		var _params = {};
		_params["idTransaccion"] = $("#Id").val()
		_params["idRequest"] = $("#id_obj").val()
		_params["ingresosForzados"] = $(".IngresosForzados").val();
		_params["checkIngresoForzados"] = 0;
		_params["LimiteCompra"] = $(".MontoSeleccionado").val();
		_params["LimiteCredito"] = $(".MontoSeleccionado").val(); //$(".MontoSeleccionado2").val();
		_params["LimitePrestamo"] = 0; //$(".MontoSeleccionado3").val();
		if ($(".chkIngresos").prop("checked") && parseInt($(".IngresosForzados").val()) > 0) { _params["checkIngresoForzados"] = 1; }
		$(".ingresoMensual").val($(".IngresosForzados").val());

		_VAR.ExecutePostAjax("/Transaccion/GrabarLimitesTarjeta", _params).then(function (data) {
			window.location.reload();
			_VAR.onWait(false);
		});
	},
	onGrabarCapitalCuotas: function (_this) {
		_VAR.onWait(true);
		_rec = _this.attr("data-record");

		var _record = "";
		if (_rec == "" && _VAR._productoConsulta != "TAR" && _VAR._productoConsulta != "CABAL" && _VAR._productoConsulta != "VISA" && _VAR._productoConsulta != "CLC") {
			alert("No se puede grabar sin seleccionar plan");
			return false;
		}
		if (_rec == "") {
			_record = { "nIDPlan": 0, "ImporteCuota": 0 };
			_record["Monto_a_Ofrecer"] = $(".MontoSeleccionado").val();
			_record["MontoOfrecido"] = $(".MontoSeleccionado").val();
		} else {
			_record = JSON.parse(_TOOLS.b64_to_utf8(_rec));
		}

		if (_record.Nombre == "REF_Cabal_Cabal") {
			_record.ImporteCuota = _record.ImportePlan;
			$(".IngresosForzados").val(0);
		}
		var _params = {};
		_params["idTransaccion"] = $("#Id").val()
		_params["idRequest"] = $("#id_obj").val()
		_params["idPlan"] = _record.nIDPlan;
		_params["importeCuota"] = _record.ImporteCuota;
		_params["ingresosForzados"] = $(".IngresosForzados").val();
		_params["montoOfrecido"] = _record["Monto_a_Ofrecer"];
		_params["importeCancelacion"] = _record.importeCancelacion;
		_params["importeEntregar"] = $(".importeEntregar").val();
		_params["checkIngresoForzados"] = 0;
		_params["endeudamientoTarjeta"] = 0;
		_params["endeudamientoCredito"] = 0;

		_params["Pago_Total_Cierre"] = _record.Pago_Total_Cierre;
		_params["Deuda_Futura_Cierre"] = _record.Deuda_Futura_Cierre;
		_params["Deuda_Total_Cierre"] = _record.Deuda_Total_Cierre;
		_params["Pagos_Periodo"] = _record.Pagos_Periodo;
		_params["Consumos_Periodo"] = _record.Consumos_Periodo;

		if ($(".chkIngresos").prop("checked") && parseInt($(".IngresosForzados").val()) > 0) { _params["checkIngresoForzados"] = 1; }
		$(".ingresoMensual").val($(".IngresosForzados").val());
		_VAR.ExecutePostAjax("/Transaccion/GrabarCapitalCuotas", _params).then(function (data) {
			if (parseInt(_record.MontoOfrecido) != 0) {
				window.location = "/Transaccion/ABMTransaccion?id_sucursal=" + $(".IdUserSucursal").val() + "&sucursal=" + $(".UserSucursal").val() + "&_id=" + _params["idTransaccion"];
			}
			_VAR.onWait(false);
		});
	},
	onCambiarFormaDePago: function (_this) {
		_VAR.onWait(true);
		var _params = {};
		_params["idTransaccion"] = $("#Id").val();
		_params["id_type_modo_pago"] = $("#id_type_modo_pago").val();
		_params["nIDSucursalPago"] = $("#Sucursales_Activas").val();
		_params["CBU"] = $("#CBU").val();
		_params["CBU"] = $("#CBU").val();
		_VAR.ExecutePostAjax("/Transaccion/CambiarFormaDePago", _params).then(function (data) {
			_VAR.onWait(false);
			alert("Se ha modificado correctamente la forma de pago");
		});
	},
	onScoringSimulator: function (_this, _modo, _refinancia) {
		var _bRefinancia = (parseInt(_refinancia) != 0);
		_VAR._simuladorScoringActivo = true;
		$(".areaScoring").addClass("d-none");
		if (_TOOLS.validate(".validateFirst", true)) {
			_VAR.onWait(true);
			var _documento = ""
			if (_VAR._simuladorScoringActivo) {
				_documento = $("#Documento").val();
			} else {
				_documento = $("#NroDocumento").val();
			}
			var _chkIngresos = 0;
			var IngresosForzados = 0;
			if ($(".chkIngresos").prop("checked") && parseInt($(".IngresosForzados").val()) > 0) {
				_chkIngresos = 1;
				IngresosForzados = parseInt($(".IngresosForzados").val());
			}
			_FUNCTIONS.onResolverScoring($("#Nombre").val(), _documento, $("#Sexo").val(), IngresosForzados, 0, 0, 0, 1, _modo, _chkIngresos, $(".idcomercio").val())
				.then(function (data) {
					if (_bRefinancia) { $(".auxScoring").addClass("d-none"); }
					_VAR.onWait(false);
				})
				.catch(function (err) {
					if (_bRefinancia) { $(".auxScoring").addClass("d-none"); }
					_VAR.onWait(false);
				});
		}
	},
	onInformeSoporte: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		var FechaDesde = $(".FechaDesde").val();
		var FechaHasta = $(".FechaHasta").val();
		var FechaCierreDesde = $(".FechaCierreDesde").val();
		var FechaCierreHasta = $(".FechaCierreHasta").val();
		var sPrioridad = $(".sPrioridad").val();
		var id_status_soporte = $(".id_status_soporte").val();
		var sAsunto = $(".sAsunto").val();
		var sDescripcion = $(".sDescripcion").val();

		_VAR.onWait(true);
		var _url = "/Administracion/InformeSoporte";
		var _params = {
			"FechaDesde": FechaDesde,
			"FechaHasta": FechaHasta,
			"FechaCierreDesde": FechaCierreDesde,
			"FechaCierreHasta": FechaCierreHasta,
			"sPrioridad": sPrioridad,
			"id_status_soporte": id_status_soporte,
			"sAsunto": sAsunto,
			"sDescripcion": sDescripcion
		};
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			var _body = ("<embed type='application/pdf' src='" + data.mensaje + "' style='height:720px;width:100%;'/>");
			_VAR.onShowWindowFormulario("xxx_idw", "Tickets de soporte", _body);
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});

	},
	onInformeAuditoria: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _detail = "";
		var _scope = $(".scope").val();
		var _scopeD = "CLIENTES y NUEVOS";
		switch (_scope) {
			case "T":
				_scopeD = "CLIENTES y NUEVOS";
				break;
			case "C":
				_scopeD = "CLIENTES";
				break;
			case "N":
				_scopeD = "NUEVOS";
				break;
		}
		var _fechaDesde = $(".FechaDesde").val();
		var _fechaHasta = $(".FechaHasta").val();
		var _id_sucursal = $(".id_sucursal").val();
		var _id_observacion = $(".id_observacion").val();
		var _id_detalle = $(".id_detalle").val();
		var _calificacion = $(".calificacion").val();
		var _adicionales = (_id_sucursal != "" || _id_observacion != "" || _id_detalle != "");
		var _html = "";
		var _url = "/Transaccion/BuildInformeAuditoria";
		var _params = {
			"scope": _scope,
			"Estado": "UNIVERSE",
			"FechaDesde": _fechaDesde,
			"FechaHasta": _fechaHasta,
			"Id_sucursal": _id_sucursal,
			"Id_observacion": _id_observacion,
			"Id_detalle": _id_detalle,
			"calificacion": _calificacion
		};
		/*Ordenar por %*/
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			console.log(data);
			_html = "<div class='divAuditoria py-2 px-3 mb-5 shadow-lg'>";
			_html += "<hr/><h3>Informe de auditoría global desde: " + _fechaDesde + " hasta: " + _fechaHasta + " <b>" + _scopeD + "</b></h3>";
			if (_adicionales) {
				var t1 = "";
				var t2 = "";
				var t3 = "";
				if (_id_sucursal != "") { t1 = "Sucursal: <b>" + $("#id_sucursal option:selected").text() + "</b> "; }
				if (_id_observacion != "") { t2 = "Observación: <b>" + $("#id_observacion option:selected").text() + "</b> "; }
				if (_id_detalle != "") { t3 = "Detalle: <b>" + $("#id_detalle option:selected").text() + "</b> "; }
				_html += "<hr/><h3>" + t1 + t2 + t3 + "</b></h3>";
			}
			_html += "<hr/><h4>Totales generales por sucursal</h4>";
			_html += "<table id='tblTGS' style='width:100%;'>";
			_html += "   <thead>";
			_html += "   <tr style='background-color:silver;font-weight:bold;'>";
			_html += "      <td>Sucursal</td>";
			_html += "      <td align='right'>Operaciones</td>";
			_html += "      <td align='right'>Auditadas</td>";
			_html += "      <td align='right'>% auditadas</td>";
			_html += "      <td align='right'>Observaciones</td>";
			_html += "      <td align='right'>% observadas</td>";
			_html += "      <td class='d-none'></td>";
			_html += "   </tr>";
			_html += "   <thead>";
			var _lastSucursal = "";
			var _total = 0;
			var _total1 = 0;
			var _total2 = 0;
			_html += "<tbody>";
			$.each(data.records, function (i, item) {
				var _t = parseInt(item["Total"]);
				var _t1 = parseInt(item["Total1"]);
				var _t2 = parseInt(item["Total2"]);
				_total += _t;
				_total1 += _t1;
				_total2 += _t2;
				var _porc = ((_t1 / _t) * 100);
				var _porc1 = ((_t2 / _t) * 100);
				_html += "<tr>";
				_html += "   <td>" + item["Sucursal"] + "</td>";
				_html += "   <td align='right'>" + item["Total"] + "</td>";
				_html += "   <td align='right'>" + item["Total1"] + "</td>";
				_html += "   <td align='right'>" + _porc.toFixed(2) + "%</td>";
				_html += "   <td align='right'>" + item["Total2"] + "</td>";
				_html += "   <td align='right'>" + _porc1.toFixed(2) + "%</td>";
				_html += "   <td class='d-none'>" + _porc1.toFixed(2) + "</td>";
				_html += "</tr>";
			});
			_html += "</tbody>";
			var _porcT = ((_total1 / _total) * 100);
			var _porcT1 = ((_total2 / _total) * 100);

			_html += "<tr>";
			_html += "   <td colspan='7'><hr/></td>";
			_html += "</tr>";
			_html += "<tr style='font-weight:bold;'>";
			_html += "   <td></td>";
			_html += "   <td align='right'>" + _total + "</td>";
			_html += "   <td align='right'>" + _total1 + "</td>";
			_html += "   <td align='right'>" + _porcT.toFixed(2) + "%</td>";
			_html += "   <td align='right'>" + _total2 + "</td>";
			_html += "   <td align='right'>" + _porcT1.toFixed(2) + "%</td>";
			_html += "   <td class='d-none'></td>";
			_html += "</tr>";
			_html += "</table>";

			_params = {
				"scope": _scope,
				"Estado": "TOTAL",
				"FechaDesde": _fechaDesde,
				"FechaHasta": _fechaHasta,
				"Id_sucursal": _id_sucursal,
				"Id_observacion": _id_observacion,
				"Id_detalle": _id_detalle,
				"calificacion": _calificacion
			};
			_VAR.ExecutePostAjax(_url, _params).then(function (data) {
				_html += "<hr/><h4>Totales por tipo de observación</h4>";
				_html += "<table style='width:100%;'>";
				_html += "   <tr style='background-color:silver;font-weight:bold;'>";
				_html += "      <td>Observación</td>";
				_html += "      <td>Detalle</td>";
				_html += "      <td align='right'>Cantidad</td>";
				_html += "   </tr>";
				var _lastSucursal = "";
				var _totSuc = 0;
				$.each(data.records, function (i, item) {
					if (item["CodeTypeObservacion"] != "") {
						_detail = item["TypeObservacion"].replace(item["CodeTypeObservacion"], "").replace(",", "").trim();
						_detail = (_detail.charAt(0).toUpperCase() + _detail.slice(1));
						_html += "<tr>";
						_html += "   <td><span class='badge badge-info'>" + item["CodeTypeObservacion"] + "</span></td>";
						_html += "   <td>" + _detail + "</td>";
						_html += "   <td align='right'>" + item["Total"] + "</td>";
						_html += "</tr>";
						_totSuc += parseInt(item["Total"]);
					}
				});
				_html += "<tr style='border-bottom:solid 1px grey;border-top:double 3px grey;'>";
				_html += "   <td></td>";
				_html += "   <td align='right'><b>TOTAL</b></td>";
				_html += "   <td align='right'><b>" + _totSuc + "</b></td>";
				_html += "</tr>";
				_html += "</table>";

				_params = {
					"scope": _scope,
					"Estado": "FULL",
					"FechaDesde": _fechaDesde,
					"FechaHasta": _fechaHasta,
					"Id_sucursal": _id_sucursal,
					"Id_observacion": _id_observacion,
					"Id_detalle": _id_detalle,
					"calificacion": _calificacion
				};
				_VAR.ExecutePostAjax(_url, _params).then(function (data) {
					_html += "<hr/><h4>Totales por sucursal y por tipo de observación</h4>";
					_html += "<table style='width:100%;'>";
					_html += "   <tr style='background-color:silver;font-weight:bold;'>";
					_html += "      <td>Sucursal</td>";
					_html += "      <td>Observación</td>";
					_html += "      <td>Detalle</td>";
					_html += "      <td align='right'>Cantidad</td>";
					_html += "   </tr>";
					var _lastSucursal = "";
					var _totBloque = 0;
					$.each(data.records, function (i, item) {
						var _tLine = "";
						_detail = item["TypeObservacion"].replace(item["CodeTypeObservacion"], "").replace(",", "").trim();
						_detail = (_detail.charAt(0).toUpperCase() + _detail.slice(1));
						_html += "<tr>";
						if (_lastSucursal != item["Sucursal"]) {
							if (_lastSucursal != "") {
								_html += "<tr style='border-bottom:solid 1px grey;border-top:double 3px grey;'>";
								_html += "   <td></td>";
								_html += "   <td></td>";
								_html += "   <td align='right'><b>TOTAL</b></td>";
								_html += "   <td align='right'><b>" + _totBloque + "</b></td>";
								_html += "</tr>";
							}
							_lastSucursal = item["Sucursal"];
							_html += "<td><span class='badge badge-dark'>" + _lastSucursal + "</span></td>";
							_totBloque = 0;
							_tLine = "";
						} else {
							_html += "<td></td>";
							_tLine = item["Total"];
							_totBloque += parseInt(item["Total"]);
						}
						_html += "   <td><span class='badge badge-info'>" + item["CodeTypeObservacion"] + "</span></td>";
						_html += "   <td>" + _detail + "</td>";
						_html += "   <td align='right'>" + _tLine + "</td>";
						_html += "</tr>";
					});
					_html += "<tr style='border-bottom:solid 1px grey;border-top:double 3px grey;'>";
					_html += "   <td></td>";
					_html += "   <td></td>";
					_html += "   <td align='right'><b>TOTAL</b></td>";
					_html += "   <td align='right'><b>" + _totBloque + "</b></td>";
					_html += "</tr>";
					_html += "</table>";

					_params = {
						"scope": _scope,
						"Estado": "TOTALCALIFICACION",
						"FechaDesde": _fechaDesde,
						"FechaHasta": _fechaHasta,
						"Id_sucursal": _id_sucursal,
						"Id_observacion": _id_observacion,
						"Id_detalle": _id_detalle,
						"calificacion": _calificacion
					};
					_VAR.ExecutePostAjax(_url, _params).then(function (data) {
						_html += "<hr/><h4>Totales por calificación</h4>";
						_html += "<table id='tblTPC' style='width:100%;'>";
						_html += "   <thead>";
						_html += "   <tr style='background-color:silver;font-weight:bold;'>";
						_html += "      <td>Calificación</td>";
						_html += "      <td align='right'>Cantidad</td>";
						_html += "   </tr>";
						_html += "   </thead>";
						_html += "   <tbody>";
						var _lastSucursal = "";
						var _totSuc = 0;
						$.each(data.records, function (i, item) {
							var _orden = 0;
							switch (item["CodeTypeObservacion"]) {
								case "AAA":
									_orden = 10;
									break;
								case "AA":
									_orden = 9;
									break;
								case "A":
									_orden = 8;
									break;
								case "B":
									_orden = 7;
									break;
								case "C":
									_orden = 6;
									break;
								case "D":
									_orden = 5;
									break;
								case "E":
									_orden = 4;
									break;
								case "N":
									_orden = 3;
									break;
							}
							var _total3 = parseInt(item["Total3"]);
							if (_total3 > 0) {
								_html += "<tr>";
								_html += "   <td><span class='badge badge-info'>" + item["CodeTypeObservacion"] + "</span></td>";
								_html += "   <td align='right'>" + _total3 + "</td>";
								_html += "</tr>";
							}
							_totSuc += _total3;
						});
						_html += "</tbody>";
						_html += "<tr style='border-bottom:solid 1px grey;border-top:double 3px grey;'>";
						_html += "   <td align='right'><b>TOTAL</b></td>";
						_html += "   <td align='right'><b>" + _totSuc + "</b></td>";
						_html += "</tr>";
						_html += "</table>";
						_params = {
							"scope": _scope,
							"Estado": "FULLCALIFICACION",
							"FechaDesde": _fechaDesde,
							"FechaHasta": _fechaHasta,
							"Id_sucursal": _id_sucursal,
							"Id_observacion": _id_observacion,
							"Id_detalle": _id_detalle,
							"calificacion": _calificacion
						};
						_VAR.ExecutePostAjax(_url, _params).then(function (data) {
							_html += "</div>";
							$(".areaResultado").html(_html).removeClass("d-none");
							_TOOLS.sortTable('tblTGS', 6, "N");
							_TOOLS.sortTable('tblTPC', 1, "N");
							$(".btn-InformeAuditoriaPdf").removeClass("d-none");
							_this.fadeIn("slow");
							_VAR.onWait(false);
						}).catch(function (e) {
							alert("Error al solicitar el informe");
							_this.fadeIn("slow");
							_VAR.onWait(false);
						});
					});
				}).catch(function (e) {
					alert("Error al solicitar el informe");
					_this.fadeIn("slow");
					_VAR.onWait(false);
				});
				$(".areaResultado").append(_html);
			});
		});

	},
	onInformeAuditoriaPdf: function () {
		_VAR.ExecutePostAjax("/Utilidades/HtmlToPdfBase64", { "PlainString": $(".areaResultado").html() }).then(function (pdf) {
			var _mime = "application/pdf";
			var _body = ("<embed type='" + _mime + "' src='" + ("data:" + _mime + ";base64," + pdf) + "' style='height:600px;width:100%;'/>");
			_VAR.onShowInfoModal({ "id": "AuditoriaPdf", "title": "Auditoría", "body": _body }, function () {
				$(".btn-Save-modal").remove();
				$(".btn-close-modal").html("Cerrar");
			});
		});
	},
	onInformeIngresos: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Opcion": "INGRESOS", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onDocumentoFirmable: function (_this) {
		var _id = $(".idDocumento").val();
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/DocumentoFirmable";
		var _params = { "Id": _id };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al ejecutar el proceso");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onAccionesSoporte: function (_this) {
		var _id = $(".IdAccion").val();
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/AccionesSoporte";
		var _params = { "Id": _id, "Documento": _doc };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al ejecutar el proceso");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onAnularBarridoCardCredByDni: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/CardCred/AnularBarridoByDni";
		var _params = { "Id": _doc, "Id_empresa_origen": $(".Id_empresa_origen").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al ejecutar el proceso");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeBCRA: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Opcion": "BCRA", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeVerazExperto: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Nombre": $(".nombre").val(), "Opcion": "VEA", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeVerazConsumo: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Nombre": $(".nombre").val(), "Opcion": "VC", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeNosisExperto: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Nombre": $(".nombre").val(), "Opcion": "NE", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeNosisConsumo: function (_this) {
		var _doc = $(".Documento").val();
		if (_doc.length > 9) { alert("El documento no puede tener más de 9 dígitos"); return false; }
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ConsultasExternas";
		var _params = { "Nombre": $(".nombre").val(), "Opcion": "NC", "Documento": _doc, "Sexo": $(".Sexo").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeResumen: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _mode = _this.attr("data-mode");
		var _url = "/Cabal/ResumenCabal";
		var _params = { "Tipo": $(".tipo").val(), "Valor": $(".valor").val(), "Modo": _mode, "iYear": $(".year").val(), "iMonth": $(".month").val(), "Format": "PDF" };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			console.log(data);
			$(".areaResultado").html("<embed type='application/pdf' src='data:application/pdf;base64," + data.mensaje + "' style='height:720px;width:100%;'/>").removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onQuickSearch: function (_url, _id, _field, _tipo, _valor, _tData, _vData) {
		return new Promise(
			function (resolve, reject) {
				try {
					if (_valor.length < 5) {
						resolve({ "status": false, "tipo": "", "valor": "", "message": "Debe poner al menos 5 letras para buscar por este criterio...", "records": null });
					} else {
						var _p = {};
						_p[_field] = _valor;
						_VAR.ExecutePostAjax(_url, _p).then(function (data) {
							var _html = "<table class='table table-info table-stripped'>";
							_html += "<tr style='font-weight:bold;'>";
							_html += "   <td></td>";
							_tData.forEach(function (v, ndx, a) { _html += "   <td>" + v + "</td>"; });
							_html += "</tr>";
							$.each(data.records, function (i, item) {
								_html += "<tr>";
								_html += "   <td><a href='#' class='btn btn-sm btn-primary btn-selectQuick' data-id='" + item[_id] + "'>Seleccionar</a></td>";
								_vData.forEach(function (v, ndx, a) { _html += "   <td>" + item[v] + "</td>"; });
								_html += "</tr>";
							});
							_html += "</table>";
							_VAR.onShowInfoModal({ "id": "modal-disambiguar", "title": "Seleccione la opción adecuada", "body": _html },
								function () {
									$(".modal-footer").remove();
									_VAR.onWait(false);
									$("body").off("click", ".btn-selectQuick").on("click", ".btn-selectQuick", function () {
										var _val = $(this).attr("data-id");
										_VAR.onDestroyModal("#modal-disambiguar");
										var _p = { "status": true, "tipo": "", "valor": _val, "messsage": "", "records": data.records };
										_p["tipo"] = _tipo;
										resolve(_p);
									});
								}
							);
						}).catch(function (e) {
							resolve({ "status": false, "tipo": "", "valor": "", "message": "Se ha producido un error en la búsqueda", "records": null });
						});
					}
				} catch (rex) {
					reject(rex);
				}
			}
		);
	},
	onInformeSaldos: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		var _mode = _this.attr("data-mode");
		var _url = "/Clientes/InformeSaldos";
		var _tipo = $(".tipo").val();
		var _valor = $(".valor").val();
		switch (_tipo) {
			case "nombre":
				_tData = ["Nºde socio", "Cuenta", "Nombre"];
				_vData = ["nID", "sCuenta", "sNombre"];
				_FUNCTIONS.onQuickSearch("/Abstract/GetCliente", "nID", "ApellidoNombre", "socio", _valor, _tData, _vData).then(function (_sel) {
					_VAR.onWait(false);
					if (!_sel.status) { alert(_sel.message); return false; }
					$(".tipo").val(_sel.tipo);
					$(".valor").val(_sel.valor);
					$(".btn-go").click();
				});
				break;
			default:
				var _params = { "Tipo": _tipo, "Valor": _valor };
				_VAR.ExecutePostAjax(_url, _params).then(function (data) {
					$(".areaResultado").html(data.mensaje).removeClass("d-none");
					_VAR.onWait(false);
				}).catch(function (e) {
					alert("Error al solicitar el informe");
					_VAR.onWait(false);
				});
				break;
		}
	},
	onInformeTarjetas: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		var _mode = _this.attr("data-mode");
		var _url = "/Clientes/InformeTarjetas";
		var _tipo = $(".tipo").val();
		var _valor = $(".valor").val();
		switch (_tipo) {
			case "nombre":
				_tData = ["Nºde socio", "Cuenta", "Nombre"];
				_vData = ["nID", "sCuenta", "sNombre"];
				_FUNCTIONS.onQuickSearch("/Abstract/GetCliente", "nID", "ApellidoNombre", "socio", _valor, _tData, _vData).then(function (_sel) {
					_VAR.onWait(false);
					if (!_sel.status) { alert(_sel.message); return false; }
					$(".tipo").val(_sel.tipo);
					$(".valor").val(_sel.valor);
					$(".btn-go").click();
				});
				break;
			default:
				var _params = { "Tipo": _tipo, "Valor": _valor };
				_VAR.ExecutePostAjax(_url, _params).then(function (data) {
					$(".areaResultado").html(data.mensaje).removeClass("d-none");
					_VAR.onWait(false);
				}).catch(function (e) {
					alert("Error al solicitar el informe");
					_VAR.onWait(false);
				});
				break;
		}
	},
	onInformeCajaFisica: function (_this) {
		var _validate = _this.attr("data-validate");
		if (!_TOOLS.validate(_validate, true)) { return false; }
		_VAR.onWait(true);
		var _valor = $(".valor").val();
		var _url = "/Clientes/CajaFisica";
		var _params = { "NroDocumento": null, "IdSocio": null };
		switch ($(".tipo").val()) {
			case "dni":
				_params["NroDocumento"] = _valor;
				break;
			case "socio":
				_params["IdSocio"] = _valor;
				break;
		}
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$("input").val("");
			$(".valor").val(_valor);
			if (data.records.length != 0) {
				$(".btn-GrabarCajaFisica").removeClass("d-none");
				$(".CajaFisica").val(data.records[0]["CajaFisica"]);
				$(".Estado").val(data.records[0]["Estado"]);
				$(".IdSocio").val(data.records[0]["IdSocio"]);
				$(".DNI").val(data.records[0]["NroDocumento"]);
				$(".Sexo").val(data.records[0]["Sexo"]);
				$(".Nombre").val(data.records[0]["Nombre"]);
				$(".Apellido").val(data.records[0]["Apellido"]);
				$(".FechaAlta").val(data.records[0]["FechaAlta"].split("T")[0]);
				$(".Telefono").val(data.records[0]["Telefono"]);
				$(".ModoPago").val(data.records[0]["ModoPago"]);
				$(".IdPagoActual").val(data.records[0]["Identificacion"]);
				$(".IdOriginal").val(data.records[0]["IdentificacionOriginal"]);
				$(".Empresa").val(data.records[0]["NombreEmpresa"]);
				$(".Equipo").val(data.records[0]["Equipo"]);
				$(".Vendedor").val(data.records[0]["Vendedor"]);
				$(".Empresario").val(data.records[0]["Empresario"]);
				var _nro = data.records[0]["CajaFisica"];
				if (_nro == "") { _nro = 0; }
				if (parseInt(_nro) != 0) { $(".btn-GrabarCajaFisica").addClass("d-none"); }
			}
			$(".rowResultado").removeClass("d-none");
			_VAR.onWait(false);
		});
	},
	onInformeCajaFisicaSave: function (_this) {
		if (!_TOOLS.validate(".verifyCaja", true)) { return false; }
		_VAR.onWait(true);
		var _valor = $(".valor").val();
		var _url = "/Clientes/CajaFisicaSave";
		var _params = { "IdSocio": $(".IdSocio").val(), "CajaFisica": $(".CajaFisica").val(), "sLKEstado": $(".Estado").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			if (data.estado != "ERROR") {
				$("input").val("");
				$(".rowResultado").addClass("d-none");
				alert("Se ha grabado correctamente la caja física");
			} else {
				alert(data.error);
			}
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onInformeComerciantes: function (_this) {
		var _validate = _this.attr("data-validate");
		if (!_TOOLS.validate(_validate, true)) { return false; }
		_VAR.onWait(true);
		var _mode = _this.attr("data-mode");
		var _url = "/Clientes/InformeComerciantes";
		var _tipo = $(".tipo").val();
		var _valor = $(".valor").val();
		switch (_tipo) {
			case "nombre":
				_tData = ["Sucursal", "Nombre", "Código", "CUIT"];
				_vData = ["sSucursalComercio", "sNombre", "nCodigoComercio", "nCUIT"];
				_FUNCTIONS.onQuickSearch("/Administracion/GetComerciante", "nCodigoComercio", "RazonSocial", "codigo", _valor, _tData, _vData).then(function (_sel) {
					_VAR.onWait(false);
					if (!_sel.status) { alert(_sel.message); return false; }
					$(".tipo").val(_sel.tipo);
					$(".valor").val(_sel.valor);
					$(".btn-go").click();
				});
				break;
			default:
				var _params = { "Tipo": _tipo, "Valor": _valor };
				_VAR.ExecutePostAjax(_url, _params).then(function (data) {
					switch (_mode) {
						case "informe":
							$(".areaResultado").html(data.mensaje).removeClass("d-none");
							break;
						case "valores":
							if (data.id != 0) {
								$(".idcomercio").val(data.id);
								$(".IdSucursalPago").val(data.records[0].nIDSucursal);
								var _html = "<div class='p-2' style='border:double 3px darkviolet;'>";
								_html += ("<h3>Comercio seleccionado</h3>");
								_html += ("<h5>Nombre: <b>" + data.records[0].sNombre + "</b> | Código: <b>" + data.records[0].nCodigoComercio + "</b> | CUIT: <b>" + data.records[0].nCUIT + "</b></h5>");
								_html += ("<h5>Sucursal: <b>" + data.records[0].sSucursalComercio + "</b> | ");
								if (data.records[0].sEMail != "") { _html += ("Email: <b>" + data.records[0].sEMail + "</b> | "); }
								_html += ("Teléfono: <b>" + data.records[0].sTeleComercio + "-" + data.records[0].sTelefonoComercio + "</b></h5>");
								_html += "</div>";
								$(".area1").html(_html);
								$(".area2").removeClass("d-none");
							}
							break;
					}
					_VAR.onWait(false);
				}).catch(function (e) {
					alert("Error al solicitar el informe Comerciante");
					_VAR.onWait(false);
				});
				break;
		}
	},
	onInformeIndicadoresOperaciones: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Transaccion/InformeIndicadoresOperaciones";
		var _params = { "FechaDesde": $(".FechaDesde").val(), "FechaHasta": $(".FechaHasta").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeIndicadoresCredipaz: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Marketing/InformeIndicadoresCredipaz";
		var _params = { "FechaDesde": $(".FechaDesde").val(), "FechaHasta": $(".FechaHasta").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeIndicadoresMediya: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Marketing/InformeIndicadoresMediya";
		var _params = { "FechaDesde": $(".FechaDesde").val(), "FechaHasta": $(".FechaHasta").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onInformeIndicadoresCobrosExternos: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Finanzas/InformeIndicadoresCobrosExternos";
		var _params = { "FechaDesde": $(".FechaDesde").val(), "FechaHasta": $(".FechaHasta").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onBotonDePagos: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		_PAYMENTS.DNI = $(".Documento").val();
		var _url = "/Clientes/InterfaceSegmentosDeDeuda";
		var _params = { "Documento": _PAYMENTS.DNI };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			console.log(data);
			console.log(data.manyResponses);

			$(".data-payment2").addClass("d-none");
			if (data.estado == "OK") {
				$(".areaResultado").html(data.html).removeClass("d-none");
				_PAYMENTS.onLoadPaymentData(1, data.manyResponses, 0);
			}
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar la interface");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onNoTransaction: function (_this) {
		$("input").attr("disabled", false);
		$("select").attr("disabled", false);
		var _params = _TOOLS.getFormValues(".dbAll");
		_params["idEstadoForzado"] = _this.attr("data-estado");
		_VAR.ExecutePostAjax("/Transaccion/FirstEvaluation", _params).then(function (data) {
			window.location = "/Transaccion/Grilla?tipo=" + _params["Tipo"];
		}).catch(function (err) {
			console.log("err");
			console.log(err);
		});
	},
	onRejectTransaction: function (_this) {
		$("input").attr("disabled", false);
		$("select").attr("disabled", false);
		var _params = {};
		_params["Tipo"] = _this.attr("data-tipo");
		_params["Id"] = $(".Id").val();
		_params["id_type_status"] = _this.attr("data-estado");
		_VAR.ExecutePostAjax("/Transaccion/CambiarEstadoTransaccion", _params).then(function (data) {
			window.location = "/Transaccion/Grilla?tipo=" + _params["Tipo"];
		}).catch(function (err) {
			console.log("err");
			console.log(err);
		});
	},
	onGetTitularMediya: function (_this) {
		var _ok = true;
		var _redirect = true;
		$(".info-verify").html("");
		_VAR.onWait(true);
		try {
			var _message = "Complete los datos requeridos para verificar";
			if (_TOOLS.validate(".validateInit", true)) {
				var _params = _TOOLS.getFormValues(".validateInit", $(this));
				_VAR.ExecutePostAjax("/Mediya/GetAdicionalMediya", _params).then(function (_adic) {
					if (_adic.records.length != 0 && _adic.records[0]["EstadoSocio"] == "VIG") {
						_VAR.onShowInfoModal({ "id": "errModal", "title": "Alerta", "body": "No se puede dar de alta este DNI como socio, ya que es adicional" }, function () {
							$(".btn-Save-modal").remove();
						});
						_VAR.onWait(false);
					} else {
						_VAR.ExecutePostAjax("/Mediya/GetTitularMediya", _params).then(function (_data) {
							if (_data.records == null || _data.records.length == 0) {
								_message = "Todo está en orden.  El DNI no es de un cliente ni de un socio.  Complete todos los datos solicitados.";
								$(".info-verify").removeClass("badge-warning").addClass("badge-success");
								$(".allData").removeClass("d-none");
								$(".Id").val(0);
							} else {
								$(".info-verify").removeClass("badge-success").addClass("badge-warning");
								_message = "Aviso.  El DNI es de un cliente, revise y complete todos los datos propuestos para solicitar el alta.";
								if (_data.records[0].IdSocio == "") {
									$(".sCuenta").val(_data.records[0]["sCuenta"]);
									$(".sEstado").val(_data.records[0]["sEstado"]);
									_FUNCTIONS.onSetDataTitularMediya(_data.records);
									$(".allData").removeClass("d-none");
								} else {
									_ok = false;
									if (_redirect) { window.location.href = "/Mediya/ABMMediya?_id=" + _data.records[0].IdSocio; }
								}
							}
							if (_ok) {
								if (_data.mensaje != "") { $(".CUIL").attr("disabled", true).val(_data.mensaje); }
								$(".off-init").removeClass("d-none");
								$(".col-verify").remove();
							}
							$(".info-verify").html(_message);
							_VAR.onWait(false);
						}).catch(function (error) {
							console.log(error);
							$(".info-verify").removeClass("badge-success").addClass("badge-warning");
							$(".info-verify").html(error.message).addClass("badge-danger");
							_VAR.onWait(false);
							throw error;
						});
					}
				});
			}
			_VAR.onWait(false);
		} catch (rex) {
			_VAR.onShowInfoModal({ "id": "errModal", "title": "Alerta", "body": rex.message }, function () { });
			_VAR.onWait(false);
		}
	},
	onGetAdicionalesMediya: function (_id, _username, _ro) {
		_VAR.ExecutePostAjax("/Mediya/GetAdicionalesMediya", { "Id": _id }).then(function (_data) {
			$(".adicionales").html("<span class='badge badge-info'>Sin adicionales informados</span>");
			var _html = "<table class='table table-hover'>";
			_html += "      <thead>";
			_html += "         <tr>";
			if (!_ro) { _html += "<th><a href='#' data-record='' data-id='0' data-id_socio='" + _id + "' data-username='" + _username + "' class='btnEditAdicional'><i class='material-icons' style='color:grey;'>add_circle_outline</i></a></th>"; }
			_html += "            <th>Nombre</th>";
			_html += "            <th>Documento</th>";
			_html += "            <th>Sexo</th>";
			_html += "            <th>Parentesco</th>";
			_html += "            <th>Nacimiento</th>";
			_html += "            <th>Edad</th>";
			_html += "            <th>Alta</th>";
			_html += "            <th>Tipo</th>";
			_html += "      </thead>";
			if (!_ro) { _html += "<th></th>"; }
			_html += "      <tbody>";
			$.each(_data.records, function (i, item) {
				var _record = _TOOLS.utf8_to_b64(JSON.stringify(item));
				var _idFamiliar = item["IDFamiliar"];
				var _nombre = (item["Nombre"] + " " + item["Apellido"]);
				var _dni = item["NroDocumento"];
				var _sexo = item["Sexo"];
				_html += "     <tr class='tr-" + _idFamiliar + "'>";
				if (!_ro) { _html += "<td><a href='#' data-record='" + _record + "' data-id='" + _idFamiliar + "' data-id_socio='" + _id + "' data-username='" + _username + "' class='btnEditAdicional'><i class='material-icons' style='color:black;'>mode_edit_outline</i></a></td>"; }
				_html += "        <td>" + _nombre + "</td>";
				_html += "        <td>" + _dni + "</td>";
				_html += "        <td>" + _sexo + "</td>";
				_html += "        <td>" + item["Parentesco"] + "</td>";
				_html += "        <td>";
				if (item["FechaNacimiento"] != "") { _html += moment((new Date(item["FechaNacimiento"]).toISOString().split('T')[0])).format('DD/MM/YYYY'); }
				_html += "        </td>"
				_html += "        <td>" + _TOOLS.getAge(item["FechaNacimiento"]) + "</td>";
				_html += "        <td>" + moment((new Date(item["FechaAlta"]).toISOString().split('T')[0])).format('DD/MM/YYYY') + "</td>";
				_html += "        <td>" + item["TipoAdicional"] + "</td>";
				if (!_ro) { _html += "<td><a href='#' data-record='' data-id='" + _idFamiliar + "' class='btnDeleteAdicional d-none'><i class='material-icons' style='color:red;'>delete_forever</i></a></td>"; }
				_html += "     </tr>";
				if (parseInt(item["Empresa"]) == 999) {
					if (parseInt($(".IdModoPago").val()) == 4) { $(".IdModoPago").val(-1).attr("disabled", false); }
				}
			});
			_html += "      </tbody>";
			_html += "   </table>";
			$(".adicionales").html(_html);
			if (_TOOLS.isInSecurityGroups("X_MEDIYA_REVISORES", ".securityGroups")) {
				$(".btnDeleteAdicional").removeClass("d-none");
			}
		});
	},
	onSetDataTitularMediya: function (_data) {
		var _new = (parseInt($(".Id").val()) == 0);
		if (_data != null) {
			_TOOLS.itemToControl(_data[0], "NroDocumento", "");
			_TOOLS.itemToControl(_data[0], "Sexo", "-1");
			_TOOLS.itemToControl(_data[0], "Nombre", "");
			_TOOLS.itemToControl(_data[0], "Apellido", "");
			_TOOLS.itemToControl(_data[0], "IdEstadoCivil", "-1");
			_TOOLS.itemToControl(_data[0], "IdNacionalidad", "-1");
			_TOOLS.itemToControl(_data[0], "IdOcupacion", "-1");
			_TOOLS.itemToControl(_data[0], "CUIL", "");
			_TOOLS.itemToControl(_data[0], "AreaTelefonoSocio", "-1");
			_TOOLS.itemToControl(_data[0], "TelefonoSocio", "");
			_TOOLS.itemToControl(_data[0], "Email", "");
			_TOOLS.itemToControl(_data[0], "Calle", "");
			_TOOLS.itemToControl(_data[0], "Numeracion", "");
			_TOOLS.itemToControl(_data[0], "Piso", "");
			_TOOLS.itemToControl(_data[0], "DptoOficLoc", "");
			_TOOLS.itemToControl(_data[0], "Torre", "");
			_TOOLS.itemToControl(_data[0], "CodigoPostal", "");
			_TOOLS.itemToControl(_data[0], "Provincia", "");
			_TOOLS.itemToControl(_data[0], "Localidad", "");
			_TOOLS.itemToControl(_data[0], "Marca", "");
			_TOOLS.itemToControl(_data[0], "AnioVTO", "");
			_TOOLS.itemToControl(_data[0], "MesVTO", "");
			_TOOLS.itemToControl(_data[0], "CBU", "");
			_TOOLS.itemToControl(_data[0], "NombreTarjeta", "");
			_TOOLS.itemToControl(_data[0], "PAN", "");
			_TOOLS.itemToControl(_data[0], "Latitud", "0");
			_TOOLS.itemToControl(_data[0], "Longitud", "0");
			_TOOLS.itemToControl(_data[0], "Longitud", "0");
			_TOOLS.itemToControl(_data[0], "EmpresaNombre", "");
			_TOOLS.itemToControl(_data[0], "EquipoVenta", "");
			_TOOLS.itemToControl(_data[0], "CajaFisica", "");
			_TOOLS.itemToControl(_data[0], "diaCobroDesde", "");
			_TOOLS.itemToControl(_data[0], "diaCobroHasta", "");
			$(".btnVerCredenciales").attr("data-dni", $(".NroDocumento").val());
			$(".btnVerCredenciales").attr("data-sexo", $(".Sexo").val());
			$(".FechaNacimiento").val(new Date(_data[0].FechaNacimientoF));
		}

		switch (parseInt($(".IdModoPago").val())) {
			case 4: // pago empresa
				$(".dataEmpresa").html("<span class='p-2 badge badge-dark'>Empresa: <b>" + $(".RazonSocial").val() + "</b></span>");
				break;
		}
		var _color = "badge-danger";
		var _stateAdditional = "";
		var _estadoSocio = $(".EstadoSocio").val();
		var _dayLastPay = parseInt($(".dayLastPay").val());
		if (_estadoSocio == "VIG" || _estadoSocio == "PPI") { _color = "badge-success"; }
		/* Si menos que cero o mayor a 90 activar boton de pago al pie de cuota inicial */
		if (_dayLastPay < 0 || _dayLastPay > 90) {
			_color = "badge-warning";
			if (_dayLastPay < 0) { _stateAdditional = "<span class='p-2 badge badge-info'><b>Sin pagos de servicios aún</b></span>"; }
			if (_dayLastPay > 90) { _stateAdditional = "<span class='p-2 badge badge-warning'><b>Más de 90 días sin pagos de servicios</b></span>"; }
		}
		var _html = "<table class='tblBarTopMediya'>";
		_html += "		<tr>";
		if ($(".disponible").val() == "S") { _html += "<td><a href='#' class='p-2 btn btn-raised btn-warning btn-Reservar'>Reservar</></td>"; }
		if ($(".AltaSocioF").val() != "") { _html += "<td class='datosAlta'><span class='p-2 badge badge-success'>Alta: <b>" + $(".AltaSocioF").val() + "</b></span></td>"; }
		if ($(".IdSocio").val() != "") {
			_html += "<td><span class='p-2 badge badge-dark'>ID socio: <b>" + $(".IdSocio").val() + "</b></span></td>";
			_html += "<td><span class='p-2 badge " + _color + "'>Estado: <b>" + $(".EstadoSocio").val() + "</b></span></td>";
		}
		if ($(".FUP").val() != "") { _html += "<td class='datosPago'><span class='p-2 badge badge-success'>Último pago: <b>" + $(".FUP").val() + "-" + $(".MUP").val() + "</b></span></td>"; }
		if (_stateAdditional != "") { _html += "<td>" + _stateAdditional + "</td>"; }
		if ($(".empleadoCredipaz").val() == "S") { $(".Empresa").val(999); }
		_html += "</tr>";
		_html += "<tr>";
		_html += "<td><span class='p-2 badge badge-primary'>Empresa: " + $(".EmpresaNombre").val() + "</span></td>";
		_html += "<td><span class='p-2 badge badge-dark'>Equipo: " + $(".EquipoVenta").val() + "</span></td>";
		_html += "<td><span class='p-2 badge badge-dark'>Empresario: " + $(".DatosEmpresario").val() + "</span></td>";
		_color = "badge-success";
		$(".TarjetaCP").val($(".sCuenta").val());
		$(".TarjetaCPHabilitada").val(0);
		if ($(".sCuenta").val() != "" && $(".sEstado").val() == "Vigente") {
			_html += "<td><span class='p-2 badge badge-danger'>Tarjeta: " + $(".sCuenta").val() + "</span></td>";
			$(".TarjetaCPHabilitada").val(1);
		}
		_html += "		</tr>";
		_html += "      <tr>";
		_html += "         <td colspan='2'><span class='p-2 badge badge-primary'>Caja física: " + $(".CajaFisica").val() + "</span></td>";
		_html += "      </tr>";
		_html += "	</table>";
		$(".toolBar").html(_html);
		$(".IdModoPago").change();

		if (_new) {
			$(".tblBarTopMediya").addClass("d-none");
		} else {
			if (!_TOOLS.isInSecurityGroups("X_MEDIYA_REVISORES", ".securityGroups")) {
				$(".NroDocumento").attr("disabled", true);
				$(".Sexo").attr("disabled", true);
				$(".IdModoPago").attr("disabled", true);
				$(".CBU").attr("disabled", true);
				$(".Marca").attr("disabled", true);
				$(".PAN").attr("disabled", true);
				$(".NombreTarjeta").attr("disabled", true);
				$(".MesVTO").attr("disabled", true);
				$(".AnioVTO").attr("disabled", true);
			}
		}
	},
	onSetAdicionalMediya: function (_username, _idFamiliar, _idSocio, _record) {
		var _item = null;
		if (_record != "") {
			_item = JSON.parse(_TOOLS.b64_to_utf8(_record));
			_id_socio = 0;
		}
		var _title = "Nuevo adicional";
		if (parseInt(_idFamiliar) != 0) { _title = "Editar adicional"; }
		var _html = "<div class='container'>";
		_html += "		<div class='row'>";
		_html += "			<div class='col-2'>";
		_html += "				<label for='a_NroDocumento'>DNI</label>";
		_html += "				<input type='number' maxlength='9' class='form-control validateAdicional number dbaseAdicional a_NroDocumento' id='a_NroDocumento' name='a_NroDocumento' placeholder='DNI' />";
		_html += "				<input type='hidden' class='dbaseAdicional a_IDSocio' id='a_IDSocio' name='a_IDSocio' value='" + _idSocio + "'/>";
		_html += "				<input type='hidden' class='dbaseAdicional a_IDFamiliar' id='a_IDFamiliar' name='a_IDFamiliar' value='" + _idFamiliar + "'/>";
		_html += "				<input type='hidden' class='dbaseAdicional a_username' id='a_username' name='a_username' value='" + _username + "'/>";
		_html += "			</div>";
		_html += "			<div class='col-2'>";
		_html += "				<label for='a_Sexo'>Sexo</label>";
		_html += "				<select class='form-control validateAdicional dbaseAdicional a_Sexo' id='a_Sexo' name='a_Sexo'>";
		_html += "					<option value='' selected>[Sexo]</option>";
		_html += "					<option value='F'>Femenino</option>";
		_html += "					<option value='M'>Masculino</option>";
		_html += "				</select>";
		_html += "			</div>";
		_html += "			<div class='col-4'>";
		_html += "				<label for='a_Nombre'>Nombre</label>";
		_html += "				<input type='text' class='form-control validateAdicional dbaseAdicional a_Nombre' id='a_Nombre' name='a_Nombre' placeholder='Nombre' />";
		_html += "			</div>";
		_html += "			<div class='col-4'>";
		_html += "				<label for='a_Apellido'>Apellido</label>";
		_html += "				<input type='text' class='form-control validateAdicional dbaseAdicional a_Apellido' id='a_Apellido' name='a_Apellido' placeholder='Apellido' />";
		_html += "			</div>";
		_html += "		</div>";
		_html += "		<div class='row'>";
		_html += "			<div class='col-3'>";
		_html += "				<label for='a_IdParentesco'>Parentesco</label>";
		_html += "				<select id='a_IdParentesco' name='a_IdParentesco' class='form-control validateAdicional dbaseAdicional a_IdParentesco'></select>";
		_html += "			</div>";
		_html += "			<div class='col-3'>";
		_html += "				<label for='a_FechaNacimiento'>Nacimiento</label>";
		_html += "				<input type='date' class='form-control validateAdicional dbaseAdicional a_FechaNacimiento' id='a_FechaNacimiento' name='a_FechaNacimiento' placeholder='Nacimiento' />";
		_html += "			</div>";
		_html += "			<div class='col-6'>";
		_html += "				<label for='a_Email'>Email</label>";
		_html += "				<input type='email' class='form-control dbaseAdicional a_Email' id='a_Email' name='a_Email' placeholder='Email' />";
		_html += "			</div>";
		_html += "		</div>";
		_html += "		<div class='row'>";
		_html += "			<div class='col-2'>";
		_html += "				<label for='a_AreaTelefonoSocio'>Área</label>";
		_html += "				<input inputmode='numeric' list='prefijos' type='number' maxlength='4' class='form-control dbaseAdicional a_AreaTelefonoSocio onlyNumbers' id='a_AreaTelefonoSocio' name = 'a_AreaTelefonoSocio' placeholder='Prefijo área' /> ";
		_html += "			</div>";
		_html += "			<div class='col-4'>";
		_html += "				<label for='a_TelefonoSocio'>Teléfono</label>";
		_html += "				<input type='number' maxlength='8' class='form-control dbaseAdicional a_TelefonoSocio onlyNumbers' inputmode='numeric' id='a_TelefonoSocio' name='a_TelefonoSocio' placeholder='Teléfono'/> ";
		_html += "			</div>";
		_html += "			<div class='col-3'>";
		_html += "				<label for='a_IdTipoAdicional'>Tipo de adicional</label>";
		_html += "				<select id='a_IdTipoAdicional' name='a_IdTipoAdicional' class='form-control validateAdicional dbaseAdicional a_IdTipoAdicional'></select>";
		_html += "			</div>";
		_html += "		</div>";
		_html += "</div>";

		_html += "<div class='panel-footer mt-2'>";
		_html += " <hr/>";
		_html += " <div class='row text-center'>";
		_html += "  <div class='col-6'>";
		_html += "   <a data-id_socio='" + _idSocio + "' class='btn-success-adicional btn btn-success btn-raised btn-md' style='background-color:#2648b6;'>Aceptar</a>";
		_html += "  </div>";
		_html += "  <div class='col-6'>";
		_html += "   <a class='btn-close-modal btn btn-danger btn-raised btn-md'>Cancelar</a>";
		_html += "  </div>";
		_html += " </div>";
		_html += "</div>";
		_VAR.onShowInfoModal({ "id": "modal-adicional", "title": _title, "body": _html }, function () {
			$(".modal-footer").remove();
			$("#a_AreaTelefonoSocio").html($("#AreaTelefonoSocio").html());
			$("#a_IdParentesco").html($("#lsParentesco").html());
			$("#a_IdTipoAdicional").html($("#lsTipoAdicional").html());
			$(".a_NroDocumento").focus();
			if (_item != null) {
				$(".a_NroDocumento").val(_item.NroDocumento);
				$(".a_Sexo").val(_item.Sexo);
				$(".a_Apellido").val(_item.Apellido);
				$(".a_Nombre").val(_item.Nombre);
				$(".a_IdParentesco").val(_item.IDParentesco);
				$(".a_AreaTelefonoSocio").val(_item.AreaTelefono);
				$(".a_TelefonoSocio").val(_item.Telefono);
				$(".a_Email").val(_item.sMail);
				$(".a_FechaNacimiento").val(new Date(_item.FechaNacimiento).toISOString().split('T')[0]);
				$(".a_IdTipoAdicional").val(_item.idTipoAdicional);
			}
		});
		$("body").off("click", ".btn-success-adicional").on("click", ".btn-success-adicional", function () {
			if (!_TOOLS.validate(".validateAdicional", false)) { return false; }
			var _params = { "NroDocumento": $(".a_NroDocumento").val(), "Sexo": $(".a_Sexo").val() };
			_VAR.ExecutePostAjax("/Mediya/GetTitularMediya", _params).then(function (_data) {
				if (_data.records.length != 0) {
					var _estado = _data.records[0]["nCodBaja"];
					if (_estado != "BAJ" && _estado != "SBJ") {
						alert("No se puede dar de alta este DNI como adicional, ya que es un titular");
						return false;
					}
				}
				//var _json = _TOOLS.getFormValues(".dbaseAdicional", null);
				var _json = {};
				_json["IDFamiliar"] = _idFamiliar;
				_json["IDSocio"] = $(".Id").val();
				_json["idTipoAdicional"] = $(".a_IdTipoAdicional").val();
				_json["Nombre"] = $(".a_Nombre").val();
				_json["Apellido"] = $(".a_Apellido").val();
				_json["NroDocumento"] = $(".a_NroDocumento").val();
				_json["Sexo"] = $(".a_Sexo").val();
				_json["IDParentesco"] = $(".a_IdParentesco").val();
				_json["FechaNacimiento"] = $(".a_FechaNacimiento").val();
				_json["AreaTelefono"] = $(".a_AreaTelefonoSocio").val();
				_json["Telefono"] = $(".a_TelefonoSocio").val();
				_json["sMail"] = $(".a_Email").val();
				_json["Username"] = $(".username").val();

				_VAR.ExecutePostAjax("/Mediya/SetAdicionalMediya", _json).then(function (_data) {
					if (_data.estado == "ERROR") { alert(_data.mensaje); }
					$(".adicionales").fadeOut("fast", function () {
						_FUNCTIONS.onGetAdicionalesMediya(_idSocio, _username, false);
						$(".adicionales").fadeIn("fast");
						$(".btn-close-modal").click();
					});
				}).catch(function (err) {
					alert("Error al grabar adicional");
				});
			});
		});
	},
	onDelAdicionalMediya: function (_username, _idFamiliar) {
		_VAR.ExecutePostAjax("/Mediya/DelAdicionalMediya", { "IDFamiliar": _idFamiliar, "Username": _username }).then(function (_data) {
			$(".tr-" + _idFamiliar).fadeOut("slow", function () { $(".tr-" + _idFamiliar).remove(); })
		}).catch(function (err) {
			alert(err.message);
		});
		$("body").off("click", ".btn-cancel-adicional").on("click", ".btn-cancel-adicional", function () {
			$("#modal-adicional").modal("hide").data("bs.modal", null);
			_VAR.onDestroyModal("#modal-adicional");
		});
	},
	onVerCredencialesMediya: function (_this) {
		var _dni = _this.attr("data-dni");
		var _sexo = _this.attr("data-sexo");
		var _nombre = _this.attr("data-nombre");
		var _titular = _this.attr("data-titular");
		var _title = "Credenciales";
		var _html = "<div class='container'>";
		_html += "		<div class='row m-0 p-0 p-2'>";
		_html += "		   <div class='col-6 p-2 m-0 text-center area-swiss skeleton card-loader'></div>";
		_html += "		   <div class='col-6 p-2 m-0 text-center area-gerdanna skeleton card-loader'></div>";
		_html += "		</div>";
		_html += "</div>";

		var _params = { "id": "infoModalCredenciales", "title": _title, "body": _html };
		_VAR.onShowInfoModal(_params, function () {

			_VAR.ExecutePostAjax("/Mediya/GetCredencialesMediya", { "Tipo": "SWISS", "NroDocumento": _dni, "Sexo": _sexo }).then(function (_data) {
				$.each(_data.records, function (i, item) {
					if (_titular == "S") {
						if (parseInt(item.IDParentesco) == 1) { _TOOLS.drawCredentialSwiss(item); }
					} else {
						if (parseInt(item.IDParentesco) != 1 && parseInt(item.NroDocumento) == _dni && item.Nombre == _nombre) { _TOOLS.drawCredentialSwiss(item); }
					}
				});
			});
			_VAR.ExecutePostAjax("/Mediya/GetCredencialesMediya", { "Tipo": "GERDANNA", "NroDocumento": _dni, "Sexo": _sexo }).then(function (_data) {
				$.each(_data.records, function (i, item) {
					if (_titular == "S") {
						if (parseInt(item.IDParentesco) == 1) { _TOOLS.drawCredentialGerdanna(item); }
					} else {
						if (parseInt(item.IDParentesco) != 1 && parseInt(item.NroDocumento) == _dni && item.Nombre == _nombre) { _TOOLS.drawCredentialGerdanna(item); }
					}
				});
			});
			$(".btn-Save-modal").remove();
		});
	},
	onVerHistorialDePagos: function (_this) {
		var _idSocio = _this.attr("data-id_socio");
		var _title = "Historial de pagos";
		var _html = "<div class='container'>";
		_html += "	    <div class='row px-1 py-4 m-0'>";
		_html += "	       <div class='col-12 areaPagos'></div>";
		_html += "      </div>";
		_html += "</div>";
		var _params = { "id": "infoModalHistorial", "title": _title, "body": _html };
		_VAR.onShowInfoModal(_params, function () {
			_VAR.ExecutePostAjax("/Mediya/GetHistorialDePagosMediya", { "IdSocio": _idSocio }).then(function (_data) {
				var _html = "<table style='width:100%'>";
				_html += "<tr style='font-weight:bold;background-color:silver;'>";
				_html += "   <td align='center'>Fecha</td>";
				_html += "   <td>Origen</td>";
				_html += "   <td align='right'>Importe</td>";
				_html += "</tr>";
				$.each(_data.records, function (i, item) {
					_html += "<tr>";
					_html += "   <td align='center'>" + item.FechaAlta + "</td>";
					_html += "   <td>" + item.Origen + "</td>";
					_html += "   <td align='right'>" + item.Importe + "</td>";
					_html += "</tr>";
				});
				_html += "</table>";
				$(".areaPagos").html(_html);

			});
			$(".btn-Save-modal").remove();
		});
		$("#modal-pagos").on('hide.bs.modal', function () { });
		$("#modal-pagos").modal({ backdrop: false, keyboard: true });
		$("body").off("click", ".btn-cancel-pagos").on("click", ".btn-cancel-pagos", function () {
			$("#modal-pagos").modal("hide").data("bs.modal", null);
			_VAR.onDestroyModal("#modal-pagos");
		});
	},
	onVerNovedades: function (_this) {
		var _idSocio = _this.attr("data-id_socio");
		var _title = "Novedades";
		var _html = "<div class='container'>";
		_html += "	    <div class='row px-1 py-4 m-0'>";
		_html += "	       <div class='col-12 areaNovedades'></div>";
		_html += "      </div>";
		_html += "</div>";
		var _params = { "id": "infoModalHistorial", "title": _title, "body": _html };
		_VAR.onShowInfoModal(_params, function () {
			_VAR.ExecutePostAjax("/Mediya/GetNovedadesMediya", { "IdSocio": _idSocio }).then(function (_data) {
				var _html = "<table style='width:100%'>";
				_html += "<tr style='font-weight:bold;background-color:silver;'>";
				_html += "   <td align='center'>Fecha</td>";
				_html += "   <td>Origen</td>";
				_html += "   <td align='right'>Importe</td>";
				_html += "</tr>";
				$.each(_data.records, function (i, item) {
					_html += "<tr>";
					_html += "   <td align='center'>" + item.FechaAlta + "</td>";
					_html += "   <td>" + item.Origen + "</td>";
					_html += "   <td align='right'>" + item.Importe + "</td>";
					_html += "</tr>";
				});
				_html += "</table>";
				$(".areaNovedades").html(_html);

			});
			$(".btn-Save-modal").remove();
		});
		$("#modal-pagos").on('hide.bs.modal', function () { });
		$("#modal-pagos").modal({ backdrop: false, keyboard: true });
		$("body").off("click", ".btn-cancel-pagos").on("click", ".btn-cancel-pagos", function () {
			$("#modal-pagos").modal("hide").data("bs.modal", null);
			_VAR.onDestroyModal("#modal-pagos");
		});
	},
	onAccionSobreProducto: function (_this) {
		var _id = _this.attr("data-id");
		var _producto = _this.attr("data-producto");
		var _accion = _this.attr("data-action");
		_VAR.ExecutePostAjax("/Transaccion/AccionSobreProducto", { "Id": _id, "Producto": _producto, "Accion": _accion }).then(function (_data) {

		}).catch(function (err) {
			alert(err.message);
		});
	},
	onReleaseLock: function (_this) {
		var _id = _this.attr("data-id");
		var _tabla = _this.attr("data-lock");
		_VAR.ExecutePostAjax("/Transaccion/ReleaseLock", { "Id": _id, "Tabla": _tabla }).then(function (_data) {
			if ($(".btnConsultarGrillaTransaccion").html() != undefined) { $("form").submit(); } else {
				_VAR.onWait(true);
				window.location.reload();
			}
		}).catch(function (err) {
			alert(err.message);
		});
	},
	onSelectSucursalPago: function (_this) {
		var _val = _this.val();
		if (_val == $(".IdSucursal").val() && parseInt($(".pagaOtraSucursal").val() == 1)) {
			alert("No puede seleccionar esta sucursal para el pago");
			_val = $(".IdSucursalPago").val();
			_this.val(-1);
		}
		$(".IdSucursalPago").val(_val);
	},
	onSelectModoPago: function (_this) {
		var _iModo = parseInt(_this.val());
		var _iSuc = $(".IdSucursal").val();
		$(".alertaCBUComercianteResuelto").addClass("d-none");
		$(".alertaCBUComerciante").addClass("d-none");
		switch (_iModo) {
			case -1:
			case 0:
			case 2:
				$(".IdSucursalPago").val(_iSuc);
				$(".Sucursales_Activas").val(_iSuc);
				$(".Sucursales_Activas").attr("disabled", true);
				try {
					$(".divCBU").removeClass("d-none");
					$(".CBU").addClass("validate");
				} catch (err) { }
				break;
			case 1:
				var _nochange = (parseInt($(".pagaOtraSucursal").val()) == 0);
				$(".Sucursales_Activas").attr("disabled", _nochange);
				try {
					$(".divCBU").addClass("d-none");
					$(".CBU").removeClass("validate");
				} catch (err) { }
				break;
		}
		if (parseInt($(".asignaCBU").val()) == 1) {
			$(".CBU").attr("disabled", true);
			$(".divCBU").addClass("d-none");
			$(".CBU").removeClass("validate");
			if ($(".CBU").val() == "") {
				$(".alertaCBUComercianteResuelto").addClass("d-none");
				$(".alertaCBUComerciante").removeClass("d-none");
			} else {
				$(".alertaCBUComercianteResuelto").removeClass("d-none");
				$(".alertaCBUComerciante").addClass("d-none");
			}
		}
	},
	onSelectOperacionPago: function (_this) {
		var _producto = _this.attr("data-producto");
		var _accion = "uncheck";
		if (_this.prop("checked")) { _accion = "checked"; }
		_VAR.ExecutePostAjax("/Utilidades/Toggle", { "Id": _this.val(), "Producto": _producto, "Accion": _accion, "Modo": "toggle" }).then(function (_data) { }).catch(function (err) { alert(err.message); });
		_FUNCTIONS.onUpDateTotalesGrillaPago();
	},
	onSelectPagoAll: function (_this) {
		_VAR.onWait(true);
		setTimeout(function () {
			$(".chkPago").prop("checked", _this.prop("checked")).change();
			_VAR.onWait(false);
		}, 200);
	},
	onUpDateTotalesGrillaImputaciones: function () {
		var iRec = 0;
		var iMonto = 0;
		$(".totalizacion").addClass("d-none");
		$(".imputado").each(function (index) {
			iRec += 1;
			$(this).closest('tr').find("td:eq(4)").each(function () { iMonto += parseInt($(this).attr("data-imputado").replace(/\D/g, '')); });
			$(".rtOperaciones").html(iRec);
			$(".rtMonto").html(_TOOLS.formatMoney(iMonto, 0));
			$(".totalizacion").removeClass("d-none");
		});
	},
	onUpDateTotalesGrillaPago: function () {
		var iRec = 0;
		var iMonto = 0;
		$(".btnArmarAccionesOperaciones").addClass("d-none");
		$(".chkPago").each(function (index) {
			if (this.checked) {
				iRec += 1;
				$(this).closest('tr').find("td:eq(8)").each(function () { iMonto += parseInt($(this).html().replace(/\D/g, '')); });
			}
			$(".rtOperaciones").html(iRec);
			$(".rtMonto").html(_TOOLS.formatMoney(iMonto, 0));
			if (iRec != 0) { $(".btnArmarAccionesOperaciones").removeClass("d-none"); }
		});
	},
	onSelectReasignarAll: function (_this) {
		_VAR.onWait(true);
		setTimeout(function () {
			$(".chkReasignar").prop("checked", _this.prop("checked")).change();
			_VAR.onWait(false);
		}, 200);
	},
	onSelectReasignarOperador: function (_this) {
		_FUNCTIONS.onCountReasignarOperadorItems(_this);
	},
	onSelectReasignarOperadorAll: function (_this) {
		_VAR.onWait(true);
		setTimeout(function () {
			$(".chkReasignarOperador").prop("checked", _this.prop("checked")).change();
			_FUNCTIONS.onCountReasignarOperadorItems(_this);
			_VAR.onWait(false);
		}, 200);
	},
	onCountCampaignItems: function (_IdPlantilla) {
		return new Promise(
			function (resolve, reject) {
				var iTotal = 0;
				$(".btnGenerarCampaign").addClass("d-none");
				var _params = { "Descripcion": "TOTAL", "Id": _IdPlantilla, "Id_Type": $(".id_type_plantilla").val() };
				_VAR.ExecutePostAjax("/Marketing/ResolveCampaign", _params)
					.then(function (_data) {
						iTotal = parseInt(_data.records[0]["Total"]);
						if (iTotal != 0) { $(".btnGenerarCampaign").removeClass("d-none"); }
						resolve(iTotal);
					})
					.catch(function (err) {
						alert(err.message);
						reject(err);
					});
			});
	},
	onCountReasignarOperadorItems: function (_this) {
		$(".btnReasignarOperador").addClass("d-none");
		var _ret = [];
		var iTotal = 0;
		$(".chkReasignarOperador").each(function (index) {
			if (this.checked) {
				iTotal += 1;
				_ret.push($(this).val());
			}
		});
		if (iTotal != 0) { $(".btnReasignarOperador").removeClass("d-none"); }
		return _ret;
	},
	onConfirmarOperacionPago: function (_this) {
		var _producto = _this.attr("data-producto");
		if (_VAR._bPreventPropagate) { return false; }
		var _t = 'off';
		var _accion = "uncheck";
		if (_this.prop("checked")) {
			_accion = "checked";
			_t = 'on';
		}
		_VAR.ExecutePostAjax("/Utilidades/Toggle", { "Id": _this.val(), "Producto": _producto, "Accion": _accion, "Modo": "confirm" }).then(function (_data) { }).catch(function (err) { alert(err.message); });

		_VAR._bPreventPropagate = true;
		$('.chkConfirm[value="' + _this.val() + '"]').bootstrapToggle(_t);
		_VAR._bPreventPropagate = false;
	},
	onConfirmarAuditoriaInforme: function (_this) {
		if (_VAR._bPreventPropagate) { return false; }
		var _t = 'off';
		var _id = _this.attr("data-id");
		var _keyNota = (".notaAuditoria-" + _id);
		var _keyType = (".typeObservacion-" + _id);
		var _nota = $(_keyNota).val();
		var _type = $(_keyType).val();

		var _idEstado = 2;
		if (_this.prop("checked")) {
			_idEstado = 1;
			_t = 'on';
			$(_keyNota).addClass("d-none").val("");
			$(_keyType).addClass("d-none").val("");
		} else {
			$(_keyNota).removeClass("d-none");
			$(_keyType).removeClass("d-none");
		}
		_VAR.ExecutePostAjax("/Transaccion/AuditoriaInforme", { "Id": _id, "IdType": _type, "IdEstado": _idEstado, "Nota": _nota, "Usuario": $(".Username").val() }).then(function (_data) {

		}).catch(function (err) { alert(err.message); });

		_VAR._bPreventPropagate = true;
		$('.chkConfirmAuditoria[value="' + _this.val() + '"]').bootstrapToggle(_t);
		_VAR._bPreventPropagate = false;
	},
	onTerminarConciliacionDia: function (_this) {
		var _producto = _this.attr("data-producto");
		_VAR.ExecutePostAjax("/Utilidades/Toggle", { "Id": 0, "Producto": _producto, "Accion": "freeze", "Modo": "freeze" }).then(function (_data) {
			_VAR.onWait(true);
			window.location.reload();
		}).catch(function (err) { alert(err.message); });
	},
	onArmarAccionesLotesOperaciones: function (_this) {
		var _id_canal = parseInt(_this.attr("data-canal"));
		_VAR.ExecutePostAjax("/Utilidades/RecuperarLoteDePago", {})
			.then(function (_dataLote) {
				var _body = "<div class='row'>";
				_body += "      <div class='col-12 seleccionadosEnGrilla'></div>";
				_body += "      <div class='dLotes col-12 areaLotesInterbanking p-2'></div>";
				_body += "      <div class='dLotes col-12 areaLotesHomebanking p-2'></div>";
				_body += "      <div class='dLotes col-12 areaLotesCardCred p-2'></div>";
				_body += "      <div class='col-12 walbot text-center' style='font-size:0.8rem;'></div>";
				_body += "</div>";

				var _params = { "id": "infoModalPagoOperaciones", "title": "", "body": _body };
				_VAR.onShowInfoModal(_params, function () {
					switch (_id_canal) {
						case 0: //Transferencia
							_FUNCTIONS.onBuildAreaBancos("Interbanking");
							_FUNCTIONS.onBuildAreaBancos("Homebanking");
							break;
						case 1: //Tarjeta debito
							_FUNCTIONS.onBuildAreaApi("CardCred");
							break;
					}
					var _status = JSON.parse("[]");
					var _bData = false;
					var _dataExport = "";
					var _seleccionGrilla = "<ul class='list-group list-group-horizontal flex-wrap'>";
					$(".chkPago").each(function (index) {
						if (this.checked) {
							_bData = true;
							_seleccionGrilla += "<li class='list-group-item p-1 m-0'>" + this.value + "</li>";
							if (_dataExport != "") { _dataExport += ","; }
							_dataExport += this.value;
							var _itemArr = { "id": this.value, "pagoconfirmado": this.getAttribute("data-pagado"), "impagoconfirmado": this.getAttribute("data-impago"), "freezed": this.getAttribute("data-freezed") };
							_status.push(_itemArr);
						}
					});
					_seleccionGrilla += "</ul>";
					/*--------------------------------------*/
					/* Armado de interfaces de conciliación */
					/*--------------------------------------*/
					_VAR._bLoteGenerado = false;
					_VAR._bReadyConciliacion = true;
					$.each(_dataLote.records, function (i, item) {
						_FUNCTIONS.onBuildAreasConciliacionPagos(_status, item, item.code.split("_")[0], _id_canal);
					});
					if (_bData) { // Si hay datos seleccionados en la grilla
						$(".seleccionadosEnGrilla").html("<input type='hidden' id='dataExport' name='dataExport' class='dataExport' value='" + _dataExport + "'/>");
						$(".seleccionadosEnGrilla").append(_seleccionGrilla + "<hr/>");

						if (_VAR._bLoteGenerado) { // Si se ha generado lote con archivo CBUs
							//$(".seleccionadosEnGrilla").addClass("d-none");
							if (_VAR._bReadyConciliacion) { // Si se ha finalizado de marcar los tems conciliados
								$(".tblGenerar").remove();
								$(".seleccionadosEnGrilla").remove();
								$(".modal-title").html("Paso 3 - Pagos realizados y estado de confirmación para generar archivos planos");
								$(".modal-content").css({ "background-color": "#d5f5e3" });
								$(".walbot").html("<hr/><a href='#' data-canal='" + _id_canal + "' class='btn btn-success btnExportarArchivoPlano pagos_planos' data-banco='' data-out='pagos_planos' data-path='PATHCONTABLE_OP' data-description='' data-mime='text/csv' data-separator=','>Generar archivos planos de los pagos conciliados</a>");
							} else {
								$(".modal-title").html("Paso 2 - Pagos en proceso de verificación");
								$(".modal-content").css({ "background-color": "#fcf3cf" });
								$(".walbot").html("<hr/><a href='#' class='btn btn-lg btn-dribbble btnTerminarConciliacionDia' data-producto='" + _id_canal + "'>Terminar conciliación del día</a>");
								$(".walbot").append("<hr/><span class='badge badge-warning rounded-pill p-2' style='font-size:0.75rem;'>No se ha finalizado el proceso de conciliación o no se ha generado lote de pagos para el día.  <b style='color:red;'>No puede generar archivos planos de exportación</b></span>");
								$(".walbot").append("<p class='p-1'><b>Para poder generar la exportación de archivos planos, debe confirmar todos los estados de 'Pagado' o 'No pagado', presionando el botón de 'Terminar conciliación del día'</b></p>");
							}
						} else {
							$(".modal-title").html("Paso 1 - Pagos seleccionados para generar lotes a procesar");
							$(".modal-content").css({ "background-color": "#ebf5fb" });
						}
					} else {
						$(".dLotes").remove();
						$(".modal-title").html("No hay datos seleccionados");
						$(".seleccionadosEnGrilla").append("<h5 style='font-weight:bold;color:red;'>Por favor marque los ítems a pagar en la grilla antes de efectuar estas acciones de pago</h5>");
					}

					/*--------------------------------------*/
					$(".btn-Save-modal").remove();
					$(".btn-close-modal").remove();
					$("#infoModalPagoOperaciones").on('hide.bs.modal', function () {
						_VAR.onWait(true);
						window.location.reload();
					});
				});
			});
	},
	onBuildAreaApi: function (_area) {
		var _areas = "";
		_areas += "<h5>Lotes " + _area + "</h5>";
		_areas += "<table class='tblGenerar' style='width:100%;font-size:0.75rem;'>";
		_areas += "   <tr>";
		_areas += "      <td class='tdAccion" + _area + "'></td>";
		_areas += "   </tr>";
		_areas += "</table>";
		_areas += "<div class='conciliar" + _area + "'></div>";
		$(".areaLotes" + _area).append(_areas);
		_VAR.LoadDataAjax("/Abstract/GetLookUp?Tipo=bcraEntidades_" + _area).then(function (data) {
			var _acciones = "";
			_acciones += "<div class='btn-group'>";
			_acciones += "   <div class='p-1 dropdown-centered newSelector' style='display:inline;'>";
			_acciones += "      <button class='btn btn-primary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'>Generar lote de transferencia</button>";
			_acciones += "	    <ul class='dropdown-menu'>";
			for (var i = 0; i < data.length; i++) {
				var _code = data[i]["codigo"];
				var _producto = (_area + "_" + _code);
				_acciones += "     <li>";
				_acciones += "        <a href='#' class='dropdown-item btnExportarApi " + _producto + "' data-banco='" + _code + "' data-out='" + _producto + "' data-path='' data-description='" + _producto + "' data-mime='text/csv' data-separator=','>" + data[i]["descripcion"];
				_acciones += "           <span class='p-1 badge-" + _producto + "'></span>";
				_acciones += "        </a>"
				_acciones += "     </li>"
			}
			_acciones += "	    </ul>";
			_acciones += "   </div>";
			_acciones += "</div>";
			$(".tdAccion" + _area).html(_acciones);
		});
	},
	onBuildAreaBancos: function (_area) {
		var _areas = "";
		_areas += "<h5>Lotes " + _area + "</h5>";
		_areas += "<table class='tblGenerar' style='width:100%;font-size:0.75rem;'>";
		_areas += "   <tr>";
		_areas += "      <td class='tdAccion" + _area + "'></td>";
		_areas += "   </tr>";
		_areas += "</table>";
		_areas += "<div class='conciliar" + _area + "'></div>";
		$(".areaLotes" + _area).append(_areas);
		_VAR.LoadDataAjax("/Abstract/GetLookUp?Tipo=bcraEntidades_" + _area).then(function (data) {
			var _acciones = "";
			_acciones += "<div class='btn-group'>";
			_acciones += "   <div class='p-1 dropdown-centered newSelector' style='display:inline;'>";
			_acciones += "      <button class='btn btn-primary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'>Generar archivos CBUs</button>";
			_acciones += "	    <ul class='dropdown-menu'>";
			for (var i = 0; i < data.length; i++) {
				var _code = data[i]["codigo"];
				var _producto = (_area + "_" + _code);
				_acciones += "     <li>";
				_acciones += "        <a href='#' data-canal='0' class='dropdown-item btnExportarArchivoPlano " + _producto + "' data-banco='" + _code + "' data-out='" + _producto + "' data-path='' data-description='" + _producto + "' data-mime='text/csv' data-separator=','>" + data[i]["descripcion"];
				_acciones += "           <span class='p-1 badge-" + _producto + "'></span>";
				_acciones += "        </a>"
				_acciones += "     </li>"
			}
			_acciones += "	    </ul>";
			_acciones += "   </div>";
			_acciones += "</div>";
			$(".tdAccion" + _area).html(_acciones);
		});
	},
	onBuildAreasConciliacionPagos: function (_status, _record, _area, _id_canal_pago) {
		_VAR.onWait(true);
		var _forceRebuild = false;
		var _producto = "";
		if (_record != undefined) {
			$(".badge-" + _record.code).addClass("badge-success").html("Lote activo");
			var _conciliacion = "<table class='p-2 mt-2' style='width:100%;font-size:0.75rem;'>";
			var _json = JSON.parse(_record.textData);
			var _sufix = _TOOLS.getNowDDMMYYYY();
			var _titBanco = "Banco";
			switch (parseInt(_id_canal_pago)) {
				case 0: // Transferencia
					_producto = "TesoreriaPago";
					_conciliacion += "   <tr style='background-color:silver;font-weight:bold;color:black;'>";
					_conciliacion += "      <td class='p-1' colspan='20'><a href='/Utilidades/DownloadExportacionesArchivos?idType=0&tipo=altacbu&name=Interbanking Alta Cuentas" + _sufix + ".txt&idAccion=0&id=" + _record.id + "' target='_blank' class='btnDownloadLote'>Descargar archivo 'Alta Cuentas' para " + _record.sEntidadNombre + "</a></td>";
					_conciliacion += "   </tr>";
					_conciliacion += "   <tr style='background-color:silver;font-weight:bold;color:black;'>";
					_conciliacion += "      <td class='p-1' colspan='20'><a href='/Utilidades/DownloadExportacionesArchivos?idType=0&tipo=transferencia&name=Interbanking Transferencia" + _sufix + ".txt&idAccion=0&id=" + _record.id + "' target='_blank' class='btnDownloadLote'>Descargar archivo 'Transferencia' para " + _record.sEntidadNombre + "</a></td>";
					_conciliacion += "   </tr>";
					break;
				case 1: //Tarjeta de débito
					_producto = "TesoreriaDebito";
					_titBanco = "Procesadora";
					break;
			}

			_conciliacion += "   <tr style='background-color:silver;font-weight:bold;color:black;'>";
			_conciliacion += "      <td class='p-1'>Estado</td>";
			_conciliacion += "      <td class='p-1'>" + _titBanco + "</td>";
			_conciliacion += "      <td class='p-1'>Solicitud</td>";
			_conciliacion += "   </tr>";
			$.each(_json, function (x, line) {
				var _checked = "";
				var _id = line.split(",")[0];
				var _st = _status.filter(elem => elem.id == _id);
				if (_st[0] != undefined) {
					_VAR._bLoteGenerado = true;
					_conciliacion += "<tr class='itemValido'>";
					if (_st[0].freezed == "") {
						_VAR._bReadyConciliacion = false;
						if (parseInt(_st[0].pagoconfirmado) == 1) { _checked = "checked"; }
						_conciliacion += "<td><input " + _checked + " class='chkConfirm' data-producto='" + _producto + "' data-size='small' type='checkbox' id='chkConfirm' name='chkConfirm' data-toggle='toggle' data-onstyle='success' data-offstyle='danger' value='" + _st[0].id + "' /></td>";
					} else {
						_conciliacion += "<td>";
						if (parseInt(_st[0].pagoconfirmado) == 1) {
							_conciliacion += "<span class='badge badge-success'>Se pagó: " + _st[0].freezed + "</span>";
						} else {
							_conciliacion += "<span class='badge badge-danger'>No se pagó: " + _st[0].freezed + "</span>";
						}
						_conciliacion += "</td>";
					}
					_conciliacion += "   <td>" + _record.banco + "</td>";
					_conciliacion += "   <td>" + _id + "</td>";
					_conciliacion += "</tr>";
				} else {
					if (!_forceRebuild) {
						_forceRebuild = true;
						_conciliacion += "<tr><td colspan='20'><h5 style='color:red;'><b>Se ha modificado la selección en la grilla principal.  Regenere archivo con CBUs del día.</b></h5></td></tr>";
					}
				}
			});
			_conciliacion += "</table>";
			$(".conciliar" + _area).append(_conciliacion);
			if (_forceRebuild) { $(".itemValido").remove(); }
			$('.chkConfirm').bootstrapToggle({ on: 'Pagado', off: 'No pagado', width: '90' });
			_VAR.onWait(false);
		}
	},
	onExportarApi: function (_params) {
		return new Promise(
			function (resolve, reject) {
				_VAR.ExecutePostAjax("/Utilidades/ExportarApi", _params)
					.then(function (_data) {
						_params["id"] = _data.id;
						resolve(_params);
					})
					.catch(function (err) {
						alert(err.message);
						reject(err);
					});
			});
	},
	onExportarArchivoPlano: function (_params) {
		return new Promise(
			function (resolve, reject) {

				_VAR.ExecutePostAjax("/Utilidades/ExportarArchivoPlano", _params)
					.then(function (_data) {
						_params["id"] = _data.id;
						resolve(_params);
					})
					.catch(function (err) {
						alert(err.message);
						reject(err);
					});
			});
	},
	onAprobarTransaccion: function (_this) {
		_VAR.p1 = _this.attr("data-idcliente");
		_VAR.p2 = _this.attr("data-id");
		var _final = _this.attr("data-final");
		$(".TipoProducto").val(_this.attr("data-tipo"));
		var _pAprobar = { "Id": _VAR.p2, "Usuario": $(".Username").val(), "final": _final };
		var _title = "Control para pre probación de operación ";
		var _labelOk = "Pre aprobar";
		if (_final == "S") {
			_title = "Control final para probación de operación ";
			_labelOk = "Aprobar para emisión";
		}
		var _html = "<div class='container'>";
		_html += "	    <div class='row px-1 p-0 m-0'>";
		_html += "	       <div class='col-6'><a href='#' class='btn btn-success btn-Save-modal'>" + _labelOk + "</a></div>";
		_html += "	       <div class='col-6'><a href='#' class='btn btn-danger btn-md btnResolverCondicional' data-request='0' data-enteexterno='16' data-security='' data-transaccion='" + _VAR.p2 + "' data-parent='0' data-title='Comprobante manual para: Informe de rechazo'>Informe de rechazo</a></div>";
		_html += "      </div>";
		_html += "	    <div class='row px-1 py-4 m-0'>";
		_html += "	       <div class='col-12 areaDatosTransaccion'></div>";
		_html += "	       <div class='col-12'><b>Informes automáticos</b></div>";
		_html += "	       <div class='col-12 areaInformesAutomaticos'></div>";
		_html += "	       <div class='col-12'><b>Informes manuales</b></div>";
		_html += "	       <div class='col-12 areaInformesManuales'></div>";
		_html += "	       <div class='col-12'><b>Teléfonos</b></div>";
		_html += "	       <div class='col-12 areaTelefonos'></div>";
		_html += "      </div>";
		_html += "   </div>";
		var _params = { "id": "infoModalAprobacion", "title": _title, "body": _html };
		_VAR.onShowInfoModal(_params, function () {
			$(".modal-footer").remove();
			_VAR.buildAutomaticos("", ".areaInformesAutomaticos", true).then(function (data) {
				_VAR.buildManuales("", ".areaInformesManuales", true);
			});
			_VAR.buildTelefonos("P", ".areaTelefonos", true);
			_VAR.ExecutePostAjax("/Transaccion/GetAreaDatosTransaccion", { "Id": _VAR.p2 }).then(function (_detalles) {
				if (_detalles.estado != "OK") {
					alert(_detalles.error);
				} else {
					$(".areaDatosTransaccion").html(_detalles.mensaje);
				}
			});
			$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
				if (!confirm("Está a punto de " + _labelOk + " la operación, dejando la misma lista para la emisión del producto.\n¿Confirma?")) { return false; }
				_VAR.ExecutePostAjax("/Transaccion/AprobarTransaccion", _pAprobar)
					.then(function (_data) {
						var _htmlMsg = "<span class='badge badge-info blink_me p-1' style='font-size:0.75rem;'>Listo para ser aprobado</span>";
						if (_final == "S") {
							_htmlMsg = "<span class='badge badge-primary blink_me p-1' style='font-size:0.75rem;'>Falta firma del cliente</span>";
						}
						$(".tdAprueba-" + _VAR.p2).html(_htmlMsg);
						$(".btn-close-modal").click();
					})
					.catch(function (err) { alert(err.message); });
			});
		});
	},
	onEnviarLinkGestionProducto: function (_this) {
		var _linkToken = _this.find("option:selected").attr('data-link');
		var _grupoApruebaEmision = $(".grupoApruebaEmision").val();
		var _emite = parseInt(_this.find("option:selected").attr('data-emite'));
		var _note_message = _this.find("option:selected").attr('data-note');
		var _monopage = _this.find("option:selected").attr('data-monopage');
		var _text = $(".ws-EnviarLinkGestionProducto option:selected").text();
		var _step = "/Abstract/StepWhatsApp?Emite=" + _emite + "&Identificacion=" + _this.val() + "&IdTransaccion=" + $(".Id").val() + "&Usuario=" + $(".Username").val() + "&Descripcion=" + _text;
		var _tel = _this.find("option:selected").attr('data-tel');
		var _forzarTel = (_tel == "1111111111");
		_tel = ("+54" + _tel.replace(/^0+/, ''));
		var _html = "";
		if (!_forzarTel) {
			_html += "<div class='row'>";
			_html += "   <div class='col-4'>";
			_html += "      <label>Registrado para envío</label><br/>";
			_html += "      <p><b>" + _tel + "</b></p>";
			_html += "   </div>";
			_html += "   <div class='col-8'>";
			_html += "      <input class='chkForceTelefono' data-size='small' type='checkbox' id='chkForceTelefono' name='chkForceTelefono' data-toggle='toggle' data-onstyle='success' data-offstyle='danger' value = '0' />";
			_html += "   </div>";
			_html += "</div>";
		}
		_html += "<div class='row rForzarTelefono d-none'>";
		_html += "   <div class='col-4'>";
		_html += "      <label>Prefijo</label><br/>";
		_html += "      <input type='text' inputmode='numeric' id='fArea' name='fArea' class='form-control onlyNumbers fArea' value='' placeholder='Prefijo' maxlength='4' list='prefijos'/>";
		_html += "   </div>";
		_html += "   <div class='col-8'>";
		_html += "      <label>Teléfono</label><br/>";
		_html += "      <input type='text' inputmode='numeric' id='fTelefono' name='fTelefono' class='form-control onlyNumbers fTelefono' value='' placeholder='Teléfono' maxlength='8'/>";
		_html += "   </div>";
		_html += "</div>";
		_VAR.onDestroyModal("#modalMediosCobro");
		var _params = { "id": "infoModalLink", "title": "Confirme datos para enviar link Whatsapp", "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			$('.chkForceTelefono').bootstrapToggle({ on: 'Cambiar por otro teléfono', off: 'No cambiar', width: '200' });
			$(".btn-accept-modal").html("Enviar link");
			$(".btn-cancel-modal").remove();
			$("body").off("change", ".chkForceTelefono").on("change", ".chkForceTelefono", function () {
				if ($(this).prop('checked')) {
					$(".rForzarTelefono").removeClass("d-none");
					$(".fArea").addClass("fValidate");
					$(".fTelefono").addClass("fValidate");
				} else {
					$(".rForzarTelefono").addClass("d-none");
					$(".fArea").val("").removeClass("fValidate");
					$(".fTelefono").val("").removeClass("fValidate");
				}
			});
			$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
				if (!_TOOLS.validate(".fValidate", true)) { return false; }
				_VAR.onWait(true);
				_note_message = _note_message.replace("[NAME]", "");
				_note_message = _note_message.replace("[LINK]", _linkToken);
				if ($(".fArea").val() != "" && $(".fTelefono").val() != "") { _tel = ("+54" + $(".fArea").val() + $(".fTelefono").val()); }
				var _link = ("https://wa.me/" + _tel + "?text=" + encodeURIComponent(_note_message));
				/*Registrar el LogStep con el envio del link */
				_VAR.LoadDataAjax(_step).then(function (data) { });
				switch (_monopage) {
					case "Raw":
						window.open(_link, '_blank');
						_VAR.onWait(false);
						break;
					case "BlackBox": //Ejecuta endpoint en la blackbox!
						var _id = $("#id_obj").val();
						if (!confirm("¿Confirma la generación de crédito para Rq.# " + _id + "?")) { return false; }
						var xhttp = new XMLHttpRequest();
						xhttp.open("POST", _note_message, false);
						xhttp.onreadystatechange = function () {
							if (xhttp.readyState == 4 && xhttp.status == 200) {
								_VAR.onWait(false);
								alert("Se ha generado el crédito en forma exitosa");
								$(".btn-Back").click();
							};
						};
						var form = new FormData();
						form.append("id", _id);
						form.append("CBU", "NOSIGN");
						xhttp.send(form);
						break;
					default: //Acciones normales
						window.open(_link, '_blank');
						_VAR.onWait(false);
						if (_emite == 1) { $(".btn-Grabar").click(); }
						break;
				};
				$(".modal-backdrop").remove();
				$("#infoModalLink").remove();
				$("body").css({ "overflow-y": "auto" });
			});
			if (_forzarTel) {
				$(".rForzarTelefono").removeClass("d-none");
				$(".fArea").addClass("fValidate");
				$(".fTelefono").addClass("fValidate");
			}
		});
	},
	onModificarEndeudamiento: function (_this) {
		var _params = {
			"IdTransaccion": _VAR.idValorRegistroActivo,
			"IdEnteExterno": _this.attr("data-id"),
			"endeudamientoTarjeta": $(".endeudamientoTarjeta").val(),
			"endeudamientoCredito": $(".endeudamientoCredito").val(),
		};
		_VAR.ExecutePostAjax("/Transaccion/ModificarEndeudamiento", _params)
			.then(function (_data) {
				_VAR.onWait(true);
				window.location.reload();
			})
			.catch(function (err) { alert(err.message); });

	},
	onEmitirProducto: function (_this) {
		if (!confirm("Se intentará reemitir el producto.  Si soporte le ha indicado proceder, puede hacerlo.\n¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _params = { "IdRequest": _this.attr("data-id"), "sAltaUsuario": $(".Username").val() };
		_VAR.ExecutePostAjax("/Transaccion/EmisionProducto", _params)
			.then(function (_data) {
				window.location.reload();
			})
			.catch(function (err) {
				_VAR.onWait(false);
				alert(err.message);
			});
	},
	onReservarMediya: function (_this) {
		if (!confirm("¿Confirma la acción de reserva?")) { return false; }
		var _params = { "Id": $(".Id").val(), "Username": $(".Username").val() };
		_VAR.ExecutePostAjax("/Mediya/ReservarMediya", _params)
			.then(function (_data) {
				$(".btn-Reservar").remove();
				alert("¡Se ha efectuado la reserva!");
			})
			.catch(function (err) { alert(err.message); });
	},
	onReasignarLanding: function (_this) {
		var _id_destino = parseInt(_this.val());
		if (_id_destino == -1) { return false; }
		var _ids_origen = "";
		if (confirm("Se reasignarán las operaciones seleccionadas cambiando su tipo a: '" + $("#reasignarLanding option:selected").text() + "'\n¿Confirma?")) {
			$(".chkReasignar").each(function (index) {
				if (this.checked) {
					if (_ids_origen != "") { _ids_origen += ","; }
					_ids_origen += $(this).val();
				}
			});
			var _params = { "nID": _id_destino, "Contacto": _ids_origen, "Usuario": $(".Username").val() };
			_VAR.ExecutePostAjax("/Transaccion/ReasignarLanding", _params)
				.then(function (_data) {
					_VAR.onWait(true);
					window.location.reload();
				})
				.catch(function (err) { alert(err.message); });
		}
	},
	onReasignarGestor: function (_this) {
		var _gestor_destino = _this.val();
		if (_gestor_destino == "") { return false; }
		var _ids_origen = "";
		if (confirm("Se asignará el gestor '" + $("#gestorReasignado option:selected").text() + "' a las operaciones seleccionadas\n¿Confirma?")) {
			$(".chkReasignarOperador").each(function (index) {
				if (this.checked) {
					if (_ids_origen != "") { _ids_origen += ","; }
					_ids_origen += $(this).val();
				}
			});
			var _params = { "Contacto": _ids_origen, "Resultado": _gestor_destino, "Usuario": $(".Username").val() };
			_VAR.ExecutePostAjax("/Transaccion/ReasignarOperador", _params)
				.then(function (_data) {
					_VAR.onWait(true);
					window.location.reload();
				})
				.catch(function (err) { alert(err.message); });
		}
	},
	onGenerarCampaign: function (_this) {
		_VAR.onWait(true);
		var _IdPlantilla = _this.attr("data-id");
		var _id_type_plantilla = $(".id_type_plantilla").val();
		_VAR.ExecutePostAjax("/Marketing/GetCampaigns", { Id_type: _id_type_plantilla })
			.then(function (_data) {
				var _html = "";
				_html += "   <h5 class='p-0 mt-2' style='color:darkviolet;font-weight:bold;'>Seleccione campañas a generar con los datos seleccionados</h5>";
				_html += "<div class='row my-2'>";
				_html += "   <div class='col-12'><span class='badge badge-dark totalCartera' style='font-size:0.80rem;'></div>";
				_html += "</div>";
				_html += "<div class='row p-2'>";
				_html += "   <div class='col-12'>";
				_html += "      <input class='chkTipoCampaignToggle' data-size='small' type='checkbox' id='chkTipoCampaignToggle' name='chkTipoCampaignToggle' data-toggle='toggle' data-onstyle='success' data-offstyle='danger'/>";
				_html += "   </div>";
				_html += "</div>";

				$.each(_data.records, function (i, item) {
					_html += "<div class='row'>";
					_html += "   <div class='col-1'><input id='chkTipoCampaign' name='chkTipoCampaign' class='chkTipoCampaign' style='width:20px;height:20px;' data-description='" + item["Description"] + "' data-fields='" + item["salida"] + "' data-separator=',' data-mime='text/csv' type='checkbox' value='" + item["id"] + "' /></div>";
					_html += "   <div class='col-4'>" + item["description"] + "</div>";
					_html += "   <div class='col-4 linkCampaign-" + item["id"] + "' ></div>";
					_html += "   <div class='col-3 linkAction-" + item["id"] + "' ></div>";
					_html += "</div>";
				});
				var _params = { "id": "infoCampaignCartera", "title": "Configuración del proceso de salida de campañas", "body": _html };
				_VAR.onShowStaticModal(_params, function () {
					$('.chkTipoCampaignToggle').bootstrapToggle({ on: 'Todas', off: 'Ninguna', width: '90' });
					$(".btn-accept-modal").html("Generar").addClass("d-none");
					_FUNCTIONS.onCountCampaignItems(_IdPlantilla).then(function (xTot) {
						var iTotal = xTot;
						if (iTotal == 0) {
							$(".totalCartera").html("No hay nada seleccionado, imposible generar campañas");
							$(".btn-accept-modal").remove();
						}
						if (iTotal == 1) { $(".totalCartera").html("Se incluirá " + iTotal + " elemento de cartera seleccionado"); }
						if (iTotal > 1) { $(".totalCartera").html("Se incluirán " + iTotal + " elementos de cartera seleccionados"); }
					});
					$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
						$(".chkTipoCampaign").each(function (index) {
							if (this.checked) {
								_VAR.onWait(true);
								var _id = $(this).val();
								var _params = {
									"IdPlantilla": _IdPlantilla,
									"Tipo": _id_type_plantilla,
									"Id": _id,
									"Proceso": ("campaña_" + _id),
									"Data": "",
									"Description": $(this).attr("data-description"),
									"Mime_type": $(this).attr("data-mime"),
									"Separator": $(this).attr("data-separator"),
									"Username": $(".Username").val(),
									"UsaPath": "",
									"Banco": _id,
								};
								_FUNCTIONS.onExportarArchivoPlano(_params).then(function (_data) {
									var _file = (_TOOLS.todayYYYYMMDD("") + $(".description").val() + ".csv");
									var _link = "<a href='/Utilidades/DownloadExportacionesArchivos?idType=" + _id_type_plantilla + "&tipo=campaña&name=" + _file + "&idAccion=" + _id + "&id=" + _IdPlantilla + "' target='_blank' class='btnDownloadLote'><i class='material-icons'>download</i>Descargar archivo</a></td>";
									var _action = "<i class='material-icons'>bolt</i>";
									$(".linkCampaign-" + _id).html(_link);
									$(".linkAction-" + _id).html(_action);
									_VAR.onWait(false);
								});
							}
						});
					});
					$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
						_VAR.onDestroyModal("#infoCampaignCartera");
					});
					$("body").off("change", ".chkTipoCampaign").on("change", ".chkTipoCampaign", function () {
						$(".btn-accept-modal").addClass("d-none");
						$(".chkTipoCampaign").each(function (index) {
							if (this.checked) { $(".btn-accept-modal").removeClass("d-none"); }
						});
					});
					$("body").off("change", ".chkTipoCampaignToggle").on("change", ".chkTipoCampaignToggle", function () {
						var _checked = $(this).prop("checked");
						$(".chkTipoCampaign").prop("checked", _checked);
						if (_checked) {
							$(".btn-accept-modal").removeClass("d-none");
						} else {
							$(".btn-accept-modal").addClass("d-none");
						}
					});
					_VAR.onWait(false);
				});
			})
			.catch(function (err) {
				_VAR.onWait(false);
				alert(err.message);
			});
	},
	onEjecutarAlerta: function (_this) {
		_VAR.ExecutePostAjax("/Administracion/EjecutarAlerta", { code: _this.attr("data-code") })
			.then(function (_data) {
				var _logic = "<span class='badge badge-success'>No se alerta</span>";
				var _message = "<span class='badge badge-secondary'>Sin mensaje</span>";
				if (parseInt(_data.records[0].Logic) == 1) {
					_logic = "<span class='badge badge-danger'>ALERTA</span>";
					_message = "<span class='badge badge-danger'>" + _data.records[0].Message + "</span>";
				}
				var _html = "<div class='container'>";
				_html += "		<div class='row'>";
				_html += "			<div class='col-2'><label>Resultado</label></div>";
				_html += "			<div class='col-10'>" + _logic + "</div>";
				_html += "		</div>";
				_html += "		<div class='row'>";
				_html += "			<div class='col-2'><label>Mensaje</label></div>";
				_html += "			<div class='col-10'>" + _message + "</div>";
				_html += "		</div>";

				_html += "</div>";
				var _params = { "id": "infoModalAlerta", "title": "Resultado de la alerta", "body": _html };
				_VAR.onShowInfoModal(_params, function () {
					$(".modal-footer").remove();
					$(".modal-dialog").removeClass("modal-xl").addClass("modal-md");
				});

			})
			.catch(function (err) { alert(err.message); });
	},
	onInitScoringInForm: function (_eval) {
		if (!_eval) { return true; }
		var _idRequest = $("#id_obj").val();
		var _idTransaccion = $("#Id").val();
		_VAR._simuladorScoringActivo = false;
		$(".areaScoring").hide();
		/*
		switch (parseInt($(".iOcupacion").val())) {
			  case 53: // promocion
				  $(".chkIngresos").prop("checked", false).change();
				  break;
		}
		*/
		try {
			_FUNCTIONS.onResolverScoring($("#Nombre").val(), $("#NroDocumento").val(), $("#Sexo").val(), $(".ingresoMensual").val(), $(".importeSolicitado").val(), _idTransaccion, _idRequest, 1, "simulador", 0, $(".idcomercio").val()).then(function (data) {
				if (parseInt($(".checkIngresoForzados").val()) > 0) {
					$(".chkIngresos").prop("checked", true); //.prop("disabled", true);
					$(".divInformeIngresos").removeClass("d-none");
					//} else {
					//$(".forzarTitle").html("");
					//$(".chkIngresos").hide();
				}
				//$(".chkIngresos").prop("disabled", true);
			});
		} catch (e) { }

		var _html = "Descartar la transacción con un ";
		_html += "<a href='#' class='m-2 btn btn-danger btn-md btnResolverCondicional' data-request='" + _idRequest + "' data-enteexterno='16' data-security='' data-transaccion='" + _idTransaccion + "' data-parent='0' data-title='Comprobante manual para: Informe de rechazo'>Informe de rechazo</a>";
		$(".areaSemaforo").html(_html);
		return false;
	},
	CreateRange: function (i, _tipo, _field, _items, _title) {
		let div = document.createElement('div');
		var _fromKey = ('f_' + _field + '_' + i);
		var _toKey = ('t_' + _field + '_' + i);
		div.setAttribute('id', (_field + '_' + i));
		div.classList.add('dropup');
		div.classList.add('p-0');
		div.classList.add('m-0');
		div.classList.add('shadow-none');
		var _type = _field;
		var _attr = "";
		var _styleTD = "border:solid 0px black !important;font-weight:normal !important;padding-top:10px !important;font-size:0.8rem !important;";
		var _html = "";
		_html += "<button class='btn dropdown-toggle' type='button' data-toggle='dropdown'>" + _title + "<span class='caret'></span></button>";
		_html += "<ul class='dropdown-menu'>";
		_html += "   <li>";
		_html += "      <center><a href='#' class='btn btn-primary btnResetRange' data-id='" + i + "' data-from-key='" + _fromKey + "' data-to-key='" + _toKey + "'>Todos</a></center>";
		_html += "   </li>";
		_html += "   <li>";
		_html += "      <table>";
		_html += "         <tr><td style='" + _styleTD + "'>Desde</td></tr>";
		_html += "         <tr><td style='" + _styleTD + "'><input data-id='" + i + "' data-field='" + _field + "' type='" + _tipo + "' id='" + _fromKey + "' name='" + _fromKey + "' class='form-control " + _field + "From' " + _attr + "/></td></tr>";
		_html += "         <tr><td style='" + _styleTD + "'>hasta</td></tr>";
		_html += "         <tr><td style='" + _styleTD + "'><input data-id='" + i + "' data-field='" + _field + "'  type='" + _tipo + "' id='" + _toKey + "' name='" + _toKey + "' class='form-control " + _field + "To' " + _attr + "/></td></tr>";
		_html += "      </table>";
		_html += "   </li>";
		_html += "</ul>";
		div.innerHTML = _html.trim();
		return div;
	},
	onGenerarPlanosWaldbott: function (_this) {
		var _html = "<hr/>";
		var _mode = _this.attr("data-mode");
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_this.fadeOut("fast");
		_VAR.onWait(true);
		var _json = _TOOLS.getFormValues(".dbAll", null);
		_json["Mode"] = _mode;
		var _url = "/Cajas/GenerarPlanosWaldbott";
		_VAR.ExecutePostAjax(_url, _json).then(function (data) {
			switch (parseInt(data.id)) {
				case -1: //error
				case -2: // con cajas abiertas
					_html += ("<h3>" + data.mensaje + "</h3>");
					_html += ("<h4 style='color:red;'>" + data.error + "</h3>");
					_html += "<table style='width:100%' clase='table table-condensed'>";
					_html += "   <tr style='background-color:silver;font-weight:bold;'>";
					_html += "      <td>Sucursal</td>";
					_html += "      <td>Caja</td>";
					_html += "      <td>Fecha</td>";
					_html += "      <td>Estado</td>";
					_html += "   </tr>";
					for (var i = 0; i < data.records.length; i++) {
						_html += "   <tr>";
						_html += "      <td>" + data.records[i]["Sucursal"] + "</td>";
						_html += "      <td>" + data.records[i]["nIDCaja"] + "</td>";
						_html += "      <td>" + data.records[i]["Fecha"] + "</td>";
						_html += "      <td>" + data.records[i]["sLKEstado"] + "</td>";
						_html += "   </tr>";
					};
					_html += "</table>";
					break;
				default: //con el proceso realizado ok
					_html += ("<h3>" + data.mensaje + "</h3>");
					_html += data.html;
					_html += ("<hr/><h5 style='color:navy;'>" + data.error + "</h3>");
					var _fileT = ("T" + data.funcion + ".dat").toUpperCase();
					var _fileM = ("M" + data.funcion + ".dat").toUpperCase();
					var _fileE = ("E" + data.funcion + ".dat").toUpperCase();
					_html += "<a class='btn btn-md btn-primary mt-2' href='/Utilidades/DownloadExportacionesArchivos?idType=0&tipo=waldbott-t&name=" + _fileT + "&idAccion=0&id=0' target='_blank' class='btnDownloadLote'><i class='material-icons'>download</i>Descargar archivo " + _fileT + "</a>";
					_html += "<a class='btn btn-md btn-primary ml-2 mt-2' href='/Utilidades/DownloadExportacionesArchivos?idType=0&tipo=waldbott-m&name=" + _fileM + "&idAccion=0&id=0' target='_blank' class='btnDownloadLote'><i class='material-icons'>download</i>Descargar archivo " + _fileM + "</a>";
					_html += "<a class='btn btn-md btn-primary ml-2 mt-2' href='/Utilidades/DownloadExportacionesArchivos?idType=0&tipo=waldbott-e&name=" + _fileE + "&idAccion=0&id=0' target='_blank' class='btnDownloadLote'><i class='material-icons'>download</i>Descargar archivo " + _fileE + "</a>";
					break;
			}
			$(".areaResultado").html(_html).removeClass("d-none");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al ejecutar el proceso");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onRefreshQRcode: function (_this) {
		var _ts = new Date().getTime();
		var _b64 = "";
		var _id_request = _this.attr("data-request");
		var _identification = _this.attr("data-identification");
		var _step = ("/Abstract/StepWhatsApp?Emite=0&Identificacion=" + _identification + "&IdTransaccion=" + $(".IdTransaccion").val() + "&Usuario=" + $(".Username").val() + "&Descripcion=QR");
		_VAR.LoadDataAjax(_step).then(function (data) { });
		_VAR.readConfigServers("Onboarding").then(function (data) {
			switch (_this.attr("data-link")) {
				case "V":
					_b64 = _TOOLS.utf8_to_b64(data.url + "?verificated=" + _id_request + "&monopage=app-a-1pre&ts=" + _ts);
					break;
					break;
				case "L":
					_b64 = _TOOLS.utf8_to_b64(data.url + "?verificated=" + _id_request + "&monopage=app-a-2&ts=" + _ts);
					break;
			}
			$(_this.attr("data-target")).attr("src", "https://api.gruponeodata.com/neotools.v1/QR?b64=" + _b64);
		});
	},
	onCtrlAllnone: function (_this) {
		$("." + _this.attr("data-target")).prop("checked", _this.prop("checked"));
	},
	onDeleteTransfer: function (_this) {
		if (!confirm("Se eliminarán los registros de la cabecera seleccionada. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _id = parseInt(_this.attr("data-id"));
		var _params = { "Id": _id };
		var _url = "/Operaciones/BorrarPorCabecera";
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			window.location.reload();
			_VAR.onWait(false);
		}).catch(function (err) {
			var _params = { "id": "infoModalDeletePorCabecera", "title": "Error", "body": "<b>Error al eliminar registros por datos de cabecera.</b>" };
			_VAR.onShowInfoModal(_params, function () {
				$(".modal-dialog").removeClass("modal-xl").addClass("modal-sm");
				$(".modal-footer").remove();
			});
			_VAR.onWait(false);
		});
	},
	onGoTransfer: function (_this) {
		var _id = parseInt(_this.attr("data-id"));
		var _id_type_transfer = parseInt($(".Id").val());
		var _id_type_transfer_direction = parseInt($(".id_type_transfer_direction").val());
		var _code = $(".code").val();
		var _description = $(".description").val();
		var _type_direction = $(".type_direction").val();
		var _extension = $(".extension").val();
		var _mime_type = $(".mime_type").val();
		var _header = $(".header").val();
		var _body = $(".body").val();
		var _footer = $(".footer").val();
		var _filename = _this.attr("data-filename");
		if (_filename == "") { _filename = (_code + "-" + _description + "." + _extension); }

		var _html = "<div class='row'>";
		_html += "      <div class='col-12'>";
		switch (_id_type_transfer_direction) {
			case 1: //Importar
				_html += "   <label>Seleccione archivo de origen</label><br/>";
				_html += "   <input class='form-control' type='file' id='filename' name='filename' accept='text/*'/>";
				break;
			case 2: //Exportar
				_html += "   <label>Archivo de destino</label><br/>";
				_html += "   <input class='filename form-control' type='text' id='filename' name='filename' value='" + _filename + "'/>";
				break;
		}
		_html += "      </div>";
		_html += "   </div>";
		_html += "  <div class='row shadow-lg mt-2 p-2'>";
		_html += "      <div class='col-12 header'></div>";
		_html += "      <div class='col-12 body'></div>";
		_html += "      <div class='col-12 footer'></div>";
		_html += "      <div class='col-12 message'></div>";
		_html += "   </div>";
		var _title = (_type_direction.toUpperCase() + " - " + _code + " " + _description);
		var _params = { "id": "infoTransfer", "title": _title, "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			$(".btn-accept-modal").html(_type_direction);
			$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
				$(".modal-backdrop").remove();
				$("#infoTransfer").remove();
				_VAR.onWait(true);
				window.location.reload();
			});
			switch (_id_type_transfer_direction) {
				case 1: //Importar
					$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
						_VAR.onWait(true);
						var archivo = $("#filename").prop("files")[0];
						if (!archivo) { _FUNCTIONS.onMessageProcessIO("No se ha detectado archivo seleccionado. ¡Nada que importar!", "red"); return false; }
						if (archivo.type != _mime_type) { _FUNCTIONS.onMessageProcessIO("El tipo de datos del archivo [" + archivo.type + "] no se corresponde con el esperado en la definición del proceso [" + _mime_type + "]", "red"); return false; }
						var _size = parseInt(archivo.size);
						var _name = archivo.name;
						var lector = new FileReader();
						lector.onload = function (e) {
							_FUNCTIONS.onProcessImport(e.target.result, _header, _body, _footer).then(function (_resolve) {
								var _sizeP = (parseInt(_resolve[0].length) + parseInt(_resolve[1].length) + parseInt(_resolve[2].length));
								//if (_size < _sizeP) { throw "Se han procesado menos bytes de los que contiene el archivo seleccionado."; }
								var _params = {
									"Id_type_transfer": _id_type_transfer,
									"Name": _name,
									"Bytes": _sizeP,
									"Header": _TOOLS.utf8_to_b64(_resolve[0]),
									"Body": _TOOLS.utf8_to_b64(_resolve[1]),
									"Footer": _TOOLS.utf8_to_b64(_resolve[2]),
									"Filename": _name,
									"Integrity": 1, // siempre en 1 SALVO, cambie la lógica de control y se decida grabar lo que viene MAL
									"Malformed": 0 //siempre en 0 SALVO, cambie la lógica de control y se decida grabar lo que viene MAL
								};
								var _url = "/Operaciones/ImportarArchivo";
								_VAR.ExecutePostAjax(_url, _params).then(function (data) {
									console.log(data);
									if (!data.logica) {
										_FUNCTIONS.onMessageProcessIO(data.error, "red");
									} else {
										_FUNCTIONS.onMessageProcessIO(data.mensaje, "green");
										$(".header").html("HEADER procesado <i class='material-icons' style='color:green;'>check</i>");
										$(".body").html("BODY procesado <i class='material-icons' style='color:green;'>check</i>");
										$(".footer").html("FOOTER procesado <i class='material-icons' style='color:green;'>check</i>");
									}
									_VAR.onWait(false);
								}).catch(function (err) {
									_FUNCTIONS.onMessageProcessIO("Error al enviar datos de la importación a la base de datos.", "red");
									_VAR.onWait(false);
								});
							}).catch(function (err) {
								_FUNCTIONS.onMessageProcessIO(err, "red");
								_VAR.onWait(false);
							});
						};
						lector.readAsText(archivo);
					});
					break;
				case 2: //Exportar
					$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
						_VAR.onWait(true);
						var _params = { "Id": _id, "Filename": $(".filename").val(), "Mime_type": _mime_type, "Id_type_transfer": _id_type_transfer };
						var _url = "/Operaciones/ExportarArchivo";
						_VAR.ExecutePostAjax(_url, _params).then(function (data) {
							if (!data.logica) {
								_FUNCTIONS.onMessageProcessIO(data.error, "red");
							} else {
								_FUNCTIONS.onMessageProcessIO(data.mensaje, "green");
							}
							_VAR.onWait(false);
						}).catch(function (err) {
							_FUNCTIONS.onMessageProcessIO("Error al leer datos de la exportación desde la base de datos.", "red");
							_VAR.onWait(false);
						});
					});
					break;
			}
		});
	},
	onProcessImport: function (data, _fHeader, _fBody, _fFooter) {
		return new Promise(
			function (resolve, reject) {
				try {
					var _init = 1;
					var _end = 1;
					var _ok = true;
					var i = 0;
					var lines = data.split(/\r?\n/).filter(line => line.trim() !== '').join('\n').split('\n');
					var _resolve = ["", "", ""];

					if (_fHeader == "") { _init = 0; }
					if (_fFooter == "") { _end = 0; }

					/*Verificar estructura del header */
					if (_fHeader != "") {
						_resolve[0] = lines[0];
						try { _FUNCTIONS.onAnalizeLine(_fHeader, _resolve[0], null); } catch (err) { throw err; }
					}

					/*Verificar estructura del footer */
					var _integrity = null;
					if (_fFooter != "") {
						_resolve[2] = lines[lines.length - _end];
						try {
							_integrity = _FUNCTIONS.onAnalizeLine(_fFooter, _resolve[2], null);
						} catch (err) { throw err; }
					}

					/*Verificar estructura del body */
					var _body = "";
					var _bodyLines = 0;
					for (var line = _init;
						(line < (lines.length - _end)); line++) {
						_body += (lines[line] + '\n');
						i++;
						try {
							_integrity = _FUNCTIONS.onAnalizeLine(_fBody, lines[line], _integrity);
						} catch (err) { throw err; }
						_bodyLines += 1;
					}
					_resolve[1] = _body;

					/** Revisión de las totalizaciones, sumarizaciones y controles de integridad definidos en el footer! */
					for (var _i = 0;
						(_i < _integrity.length); _i++) {
						if (parseInt(_integrity[_i]["value"]) != parseInt(_integrity[_i]["verify"])) {
							throw "<div class='p-1 text-center' style='border:double 3px red;'>EL ARCHIVO A PROCESAR TIENE <b>ERRORES.</b></div><br/><div style='color:red;'>[" + _integrity[_i]["type"] + "] con valor [" + _integrity[_i]["value"] + "] no coincide con [" + _integrity[_i]["verify"] + "] obtenido de procesar el cuerpo del archivo. Campo: [" + _integrity[_i]["field"] + "] Condición: [" + _integrity[_i]["condition"] + "]</div>";
						}
					}

					resolve(_resolve);
				} catch (err) {
					reject(err);
				}
			});
	},
	onAnalizeLine: function (_validation, _line, _integrity) {
		var index = 0;
		var _fromPos = 0;
		var _pos = 0;
		var _newPos = 0;
		try {
			var _return = [];
			var _root = _validation.split("-");
			var _lineSizeDef = parseInt(_root[0].split(":")[0]);
			var _lineSizeActual = _line.replace(/[\n\r]/g, '').length;
			var _valores = "";
			if (_lineSizeDef != _lineSizeActual) { throw "La longitud de la línea no se corresponde con la definición.<br/>" + _line; }
			var _segmentos = _root[1].split("|");
			for (var _seg = 0;
				(_seg < _segmentos.length); _seg++) {
				index = (_seg + 1);
				_valores = _segmentos[_seg];

				var _compare = _segmentos[_seg].split(":");
				var _size = _compare[0];
				var _specs = _compare[1].split("=");
				var _type = _specs[0];
				var _vals = [];
				if (_specs.length > 1) { _vals = _specs[1].split(","); }
				_newPos = (parseInt(_pos) + parseInt(_size));
				var _cut = _line.substring(_pos, _newPos);
				_fromPos = _pos;
				_pos = _newPos;
				switch (_type) {
					case "SFLD": // Sumatoria de valores del campo especificado en =x
						_return.push({ "type": _type, "value": _cut, "field": _specs[1], "condition": "", "verify": 0 });
						if (!$.isNumeric(_cut)) { throw "Se ha encontrado un caracter no numérico en un segmento de suma [" + _cut + "]."; }
						break;
					case "CFLD": // Conteo de ocurrencias del campo especificado en =x dada la condicion ?x
						var _arrData = _specs[1].split("?");
						_return.push({ "type": _type, "value": _cut, "field": _arrData[0], "condition": _arrData[1], "verify": 0 });
						if (!$.isNumeric(_cut)) { throw "Se ha encontrado un caracter no numérico en un segmento de conteo variable [" + _cut + "]."; }
						break;
					case "CREG": // Conteo de registros sin especificación de campo asociada
						_return.push({ "type": _type, "value": _cut, "field": "", "condition": "", "verify": 0 });
						if (!$.isNumeric(_cut)) { throw "Se ha encontrado un caracter no numérico en un segmento de conteo [" + _cut + "]."; }
						break;
					case "F": // Valor fijo
						if (_integrity != null) { _return = _integrity; }
						if (_cut != _specs[1]) { throw "El valor analizado [" + _cut + "] no es igual al valor fijo esperado [" + _specs[1] + "]"; }
						break;
					case "L": // Lista de valores
						if (_integrity != null) { _return = _integrity; }
						var err = true;
						var ix = 0;
						for (var ix = 0;
							(ix < _vals.length); ix++) {
							if (_vals[ix] == _cut) { err = false; }
						}
						if (err) { throw "El valor analizado [" + _cut + "] no es es un valor que exista en la lista de control"; }
						break;
					case "R": // Valor fijo repetido N veces
						if (_integrity != null) { _return = _integrity; }
						switch (_specs) {
							case "SPACE":
								var _repeated = (" ".repeat(_size));
								if (_cut != _repeated) { throw "El valor analizado [" + _cut + "] no es igual valor fijo esperado [" + _specs + "]"; }
								break;
						}
						break;
					case "N": // Valor numerico
						if (_integrity != null) { _return = _integrity; }
						if (!$.isNumeric(_cut)) { throw "Se ha encontrado un caracter no numérico en un segmento numérico [" + _cut + "]."; }
						break;
					case "T": // Valor de texto
						if (_integrity != null) { _return = _integrity; }
						break;
					case "HHxMMxSS": // Fecha con formato determinado
						if (_integrity != null) { _return = _integrity; }
						if (!moment(_cut, "HH:mm:ss", true).isValid()) { throw "El segmento analizado [" + _cut + "] no contiene una hora [" + _type + "], tal y como se especifica en la definición."; }
						break;
					case "YYYYMMDD": // Fecha con formato determinado
						if (_integrity != null) { _return = _integrity; }
						if (!moment(_cut, _type, true).isValid()) { throw "El segmento analizado [" + _cut + "] no contiene una fecha [" + _type + "], tal y como se especifica en la definición."; }
						break;
				}

				/** Consolidacion running in de los valores de integridad y control a nivel de CAMPO */
				if (_integrity != null) {
					for (var _i = 0;
						(_i < _integrity.length); _i++) {
						switch (_integrity[_i]["type"]) {
							case "SFLD": // Sumatoria de valores del campo especificado en =x
								if (index == parseInt(_integrity[_i]["field"])) {
									_return[_i]["verify"] = (parseInt(_integrity[_i]["verify"]) + parseInt(_cut));
								}
								break;
							case "CFLD": // Conteo de ocurrencias del campo especificado en =x dada la condicion ?x
								if (index == parseInt(_integrity[_i]["field"])) {
									if (_integrity[_i]["condition"] == "" || (_integrity[_i]["condition"].toLowerCase().trim() == _cut.toLowerCase().trim())) {
										_return[_i]["verify"] = (parseInt(_integrity[_i]["verify"]) + 1);
									}
								}
								break;
						}
					}
				}

			}

			/** Consolidacion running in de los valores de integridad y control a nivle de REGISTRO */
			if (_integrity != null) {
				for (var _i = 0;
					(_i < _integrity.length); _i++) {
					switch (_integrity[_i]["type"]) {
						case "CREG": // Conteo de registros sin especificación de campo asociada
							_return[_i]["verify"] = (parseInt(_integrity[_i]["verify"]) + 1);
							break;
					}
				}
			}
			return _return;
		} catch (err) {
			throw ("<div class='p-1 text-center' style='border:double 3px red;'>EL ARCHIVO A PROCESAR TIENE <b>ERRORES.</b></div><br/>" + err + "<br/><div style='color:black;'>" + _line + "<br/>Nºde segmento: " + index + "<br/>Posición: " + _fromPos + " -> " + _newPos + "<br/>Valores: " + _valores + "</div>");
		}
	},
	onMessageProcessIO: function (err, color) {
		$(".message").html("<b style='color:" + color + ";'>" + err + "</b>");
		$(".header").html("");
		$(".body").html("");
		$(".footer").html("");
	},
	onProcessImportInternal: function (_this) {
		try {
			if (!confirm("Se va a realizar el proceso interno el cual afectará la base de datos y no puede ser reversado por el operador\n¿Confirma?")) { return false; }
			var _params = { "Id": _this.attr("data-id"), "IdType": _this.attr("data-id_type"), "Accion": _this.attr("data-accion") };
			_VAR.ExecutePostAjax("/Operaciones/ProcessImportInternal", _params).then(function (_detalles) {
				if (_detalles.estado == "OK") {
					_VAR.onWait(true);
					window.location.reload();
				} else {
					throw _detalles.message;
				}
			});
		} catch (err) {
			alert("Se ha producido un error: " + err);
		}
	},
	onProcessExportInternal: function (_this) {
		try {
			if (!confirm("Se va a generar una nueva exportación basada en el proceso seleccionado \n¿Confirma?")) { return false; }
			var _params = { "Id": _this.attr("data-id"), "IdType": _this.attr("data-id_type"), "Accion": _this.attr("data-accion") };
			_VAR.ExecutePostAjax("/Operaciones/ProcessExportInternal", _params).then(function (_detalles) {
				if (_detalles.estado == "OK") {
					_VAR.onWait(true);
					window.location.reload();
				} else {
					throw _detalles.message;
				}
			});
		} catch (err) {
			alert("Se ha producido un error: " + err);
		}
	},
	onChangeComercianteCBU: function (_this) {
		try {
			var _cbu = $(".cbuComerciante").val();
			if (!_TOOLS.validarCBU(_cbu)) {
				alert('¡El CBU especificado no es un CBU válido!');
				return false;
			}
			if (!confirm("Va a modificar el CBU del Comerciante \n¿Confirma?")) { return false; }
			var _params = { "Codigo": _this.attr("data-codigo"), "CBU": _cbu };
			_VAR.ExecutePostAjax("/Clientes/ChangeComercianteCBU", _params).then(function (_ret) {
				if (_ret.estado == "OK") {
					alert("El CBU se a registrado correctamente");
				} else {
					throw _ret.message;
				}
			});
		} catch (err) {
			alert("Se ha producido un error: " + err);
		}
	},
	onQuitarTodosLosFiltros: function (_this) {
		$(".ctrlAllNone").each(function () {
			$("." + $(this).attr("data-target")).prop("checked", false);
			$(this).prop("checked", false).click();
		});
	},
	onCrearCardCred: function (_this) {
		if (!confirm("Se intentará generar datos de lotes a enviar a CardCred. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		_VAR.ExecutePostAjax("/Cardcred/Crear", { "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			var _msg = "Se ejecutó correctamente";
			if (!data.logica && data.mensaje != "") { _msg = data.mensaje; }
			var _params = { "id": "infoCrearCardCred", "title": "Resultado del proceso", "body": ("<b>" + _msg + "</b>") };
			_VAR.onShowStaticModal(_params, function () {
				$(".btn-cancel-modal").remove();
				$(".btn-accept-modal").html("Cerrar");
				_VAR.onWait(false);
				$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
					window.location.reload();
				});
			});
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onEnviarCardCred: function (_this) {
		if (!confirm("Se intentará generar datos de lotes a enviar a CardCred. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		_VAR.ExecutePostAjax("/Cardcred/Enviar", { "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			console.log(data);
			var _msg = "Se ejecutó correctamente";
			if (!data.logica && data.error != "") { _msg = data.error; }
			var _params = { "id": "infoEnviarCardCred", "title": "Resultado del proceso", "body": ("<b>" + _msg + "</b>") };
			_VAR.onShowStaticModal(_params, function () {
				$(".btn-cancel-modal").remove();
				$(".btn-accept-modal").html("Cerrar");
				_VAR.onWait(false);
				$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
					window.location.reload();
				});
			});
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onActualizarCardCred: function (_this) {
		if (!confirm("Se forzará una actualización de los ítems CardCred activos. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		_VAR.ExecutePostAjax("/Cardcred/Actualizar", { "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			var _msg = "Se ejecutó correctamente";
			if (!data.logica && data.mensaje != "") { _msg = data.mensaje; }
			var _params = { "id": "infoActualizarCardCred", "title": "Resultado del proceso", "body": ("<b>" + _msg + "</b>") };
			_VAR.onShowStaticModal(_params, function () {
				$(".btn-cancel-modal").remove();
				$(".btn-accept-modal").html("Cerrar");
				_VAR.onWait(false);
				$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
					window.location.reload();
				});
			});
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onImputacionesCardCred: function (_this) {
		if (!confirm("Se forzará una actualización de los ítems CardCred activos. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		_VAR.ExecutePostAjax("/Cardcred/Imputaciones", { "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			var _msg = "Se ejecutó correctamente";
			if (!data.logica && data.mensaje != "") { _msg = data.mensaje; }
			var _params = { "id": "infoImputacionesCardCred", "title": "Resultado del proceso", "body": ("<b>" + _msg + "</b>") };
			_VAR.onShowStaticModal(_params, function () {
				$(".btn-cancel-modal").remove();
				$(".btn-accept-modal").html("Cerrar");
				_VAR.onWait(false);
				$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
					window.location.reload();
				});
			});
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onCheckTotalesCobroCardCred: function (_this) {
		_VAR.ExecutePostAjax("/Cardcred/TotalesCobro", { "FechaDesde": $(".wFecha").val(), "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			var _detalle = data.html;
			var _params = { "id": "infoTotalesCobroCardCred", "title": "Resultado del proceso", "body": _detalle };
			_VAR.onShowStaticModal(_params, function () {
				$(".btn-accept-modal").remove();
				$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
					_VAR.onDestroyModal("#infoTotalesCobroCardCred");
				});
				_VAR.onWait(false);
			});
		});
	},
	onRecaudacionCardCred: function (_this) {
		var _step = parseInt(_this.attr("data-step"));
		_VAR.onWait(true);
		_VAR.ExecutePostAjax("/Cardcred/Recaudacion", { "Id_type": _step, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			switch (_step) {
				case 1: // imputar
					var _msg = "Se ejecutó correctamente";
					var _detalle = "";
					if (!data.logica && data.mensaje != "") { _msg = data.mensaje; }
					if (data.records != null) {
						if (data.records.length != 0) {
							_detalle += "<br/><table class='table table-sm' style='width=100%'>";
							_detalle += "   <tr>";
							_detalle += "      <td align='center'>Registros a imputar</td>";
							_detalle += "      <td align='right'>Capital</td>";
							_detalle += "      <td align='right'>Interes</td>";
							_detalle += "      <td align='right'>Punitorios</td>";
							_detalle += "      <td align='right'>Total</td>";
							_detalle += "   </tr>";
							_detalle += "   <tr style='font-weight:bold;'>";
							_detalle += "      <td align='center'>" + data.records[0]["registros"] + "</td>";
							_detalle += "      <td align='right'>" + _TOOLS.formatMoney(data.records[0]["imputacion_capital"], 2) + "</td>";
							_detalle += "      <td align='right'>" + _TOOLS.formatMoney(data.records[0]["imputacion_interes"], 2) + "</td>";
							_detalle += "      <td align='right'>" + _TOOLS.formatMoney(data.records[0]["imputacion_punitorios"], 2) + "</td>";
							_detalle += "      <td align='right'>" + _TOOLS.formatMoney(data.records[0]["imputacion_total"], 2) + "</td>";
							_detalle += "   </tr>";
							_detalle += "</table>";
						}
					}
					var _params = { "id": "infoRecaudacionCardCred", "title": "Resultado del proceso", "body": ("<b>" + _msg + "</b>" + _detalle) };
					_VAR.onShowStaticModal(_params, function () {
						$(".btn-accept-modal").addClass("btnRecaudacionCardCred").attr("data-step", "2").html("Procesar");
						$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
							_VAR.onDestroyModal("#infoRecaudacionCardCred");
						});
						_VAR.onWait(false);
					});
					break
				case 2:
					window.location.reload();
					break;
			}
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onBorrarSolicitud: function (_this) {
		if (!confirm("Se borrará completamente el crédito aún impago ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _params = { "Id": _ths.attr("data-id"), "Usuario": $(".Username").val() };
		_VAR.ExecutePostAjax("/Transaccion/BorrarSolicitud", _params).then(function (data) {
			window.location.reload();
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onLinkToFrame: function (_this) {
		_VAR.onWait(true);
		$(_this.attr("data-target")).attr("src", _this.attr("data-link"));
		setTimeout(function () { _VAR.onWait(false); }, 2500);
	},
	onCancelarLote: function (_this) {
		if (!confirm("Se anulará completamente el lote ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _id = _this.attr("data-id");
		_VAR.ExecutePostAjax("/CardCred/CancelarLote", { "Id": _id, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			window.location.reload();
		}).catch(function (err) {
			_VAR.onWait(false);
		});
	},
	onDetalleCabeceraLote: function (_this) {
		var _html = "";
		var _id = _this.attr("data-id");
		_VAR.ExecutePostAjax("/CardCred/GetRows", { "Id": _id, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			_html += "<table class='table table-sm table-borderless table-striped'>";
			_html += "   <tbody>";
			_html += "      <tr>";
			_html += "         <td>Id CC</td><td align='right'>" + data.records[0]["id_lote_cardcred"] + "</td>";
			_html += "      </tr>";
			_html += "      <tr>";
			_html += "         <td>Lote CC</td><td align='right'>" + data.records[0]["lote_cardcred"] + "</td>";
			_html += "      </tr>";
			_html += "      <tr>";
			_html += "         <td>Creado</td><td align='right'>" + data.records[0]["fCreado"] + "</td>";
			_html += "      </tr>";
			_html += "      <tr>";
			_html += "         <td>Enviados</td><td align='right'>" + data.records[0]["enviados"] + "</td>";
			_html += "      </tr>";
			_html += "      <tr>";
			_html += "         <td>Recibidos</td><td align='right'>" + data.records[0]["recibidos"] + "</td>";
			_html += "      </tr>";
			_html += "      <tr>";
			_html += "         <td>Rechazados</td><td align='right'>" + data.records[0]["rechazados"] + "</td>";
			_html += "      </tr>";
			_html += "   </tbody>";
			_html += "</table>";
			_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Detalle de la cabecera del lote", "body": _html },
				function () {
					$(".btn-Save-modal").remove();
					$(".btn-close-modal").html("Cerrar").removeClass("d-none").removeClass("btn-danger").addClass("btn-success");
					$(".close").html("X")
					_VAR.onWait(false);
				}
			);
		});
	},
	onReenviarRechazados: function (_this) {
		if (!confirm("Está a punto de reenviar los items de lote rechazados.\n¿Confirma?")) { return false; }
		_VAR.ExecutePostAjax("/CardCred/ReEnviar", { "Id": _this.attr("data-id"), "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			window.location.reload();
		});
	},
	onDetalleLote: function (_this) {
		var _html = "";
		var _id = _this.attr("data-id");
		_VAR.ExecutePostAjax("/CardCred/GetRows", { "Id": _id, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			_html += "<table class='table table'>";
			_html += "   <thead class='thead-dark'>";
			_html += "      <tr>";
			_html += "         <th>Creado</th>";
			_html += "         <th>Finalizado</th>";
			_html += "         <th>Registros</th>";
			_html += "         <th>Total</th>";
			_html += "         <th>Creados</th>";
			_html += "         <th>Enviados</th>";
			_html += "         <th>Recibidos</th>";
			_html += "         <th>Rechazados</th>";
			_html += "         <th>Procesados</th>";
			_html += "      </tr>";
			_html += "   </thead>";
			_html += "   <tbody>";
			_html += "      <tr>";
			_html += "         <td align='center'>" + data.records[0]["fCreado"] + "</td>";
			_html += "         <td align='center'>" + data.records[0]["fFinalizado"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["registros"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["total"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["creados"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["enviados"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["recibidos"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["rechazados"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["procesados"] + "</td>";
			_html += "      </tr>";
			_html += "   </tbody>";
			_html += "</table>";
			_VAR.ExecutePostAjax("/CardCred/GetItemsLote", { "Id": _id, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (items) {
				_html += "<div class='container'>";
				_html += "   <table class='table table-sm table-hover' style='width:100%;'>";
				_html += "   <thead class='thead-primary'>";
				_html += "      <tr>";
				_html += "         <th>Estado</th>";
				_html += "         <th>Procesado</th>";
				_html += "         <th>Imputable</th>";
				_html += "         <th>Imputado</th>";
				_html += "         <th>Saldo</th>";
				_html += "         <th>Part.</th>";
				_html += "         <th>Hs.</th>";
				_html += "         <th>Días</th>";
				_html += "         <th>Nºcrédito</th>";
				_html += "      </tr>";
				_html += "   </thead>";
				_html += "   <tbody>";
				for (var i = 0; i < items.records.length; i++) {
					_html += "      <tr>";
					_html += "         <td align='center'>" + items.records[i]["estado"] + "</td>";
					_html += "         <td align='center'>" + items.records[i]["fProcesado"] + "</td>";
					_html += "         <td align='right'>" + items.records[i]["fImputable"] + "</td>";
					_html += "         <td align='right'>" + items.records[i]["fImputado"] + "</td>";
					_html += "         <td align='right'>" + items.records[i]["fSaldo"] + "</td>";
					_html += "         <td align='center'>" + items.records[i]["cant_particiones"] + "</td>";
					_html += "         <td align='center'>" + items.records[i]["hora_inicio"] + "</td>";
					_html += "         <td align='center'>" + items.records[i]["dias_barrido"] + "</td>";
					_html += "         <td align='right'>" + items.records[i]["nSolicitud"] + "</td>";
					_html += "      </tr>";
				}
				_html += "   </tbody>";
				_html += "   </table>";
				_html += "</div>";
				_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Composición del lote", "body": _html },
					function () {
						$(".btn-Save-modal").remove();
						$(".btn-close-modal").html("Cerrar").removeClass("d-none").removeClass("btn-danger").addClass("btn-success");
						$(".close").html("X")
						$(".modal-dialog").addClass("modal-xl");
						_VAR.onWait(false);
					}
				);
			})
		});
	},
	onDetalleImputacion: function (_this) {
		var _html = "";
		var _id = _this.attr("data-id");
		_VAR.ExecutePostAjax("/CardCred/GetRowsImputaciones", { "Id": _id, "Id_empresa_origen": $(".Id_empresa_origen").val() }).then(function (data) {
			_html += "<table class='table table-sm'>";
			_html += "   <thead class='thead-dark'>";
			_html += "      <tr>";
			_html += "         <th>Lote</th>";
			_html += "         <th>TX</th>";
			_html += "         <th>Imputado</th>";
			_html += "         <th>Cobranza</th>";
			_html += "         <th>Recibido</th>";
			_html += "         <th>Impactado</th>";
			_html += "         <th>F.Fiserv</th>";
			_html += "         <th>Liq.Fiserv</th>";
			_html += "         <th>Comercio</th>";
			_html += "         <th>Marca</th>";
			_html += "      </tr>";
			_html += "   </thead>";
			_html += "   <tbody>";
			_html += "      <tr>";
			_html += "         <td align='center'>" + data.records[0]["lote"] + "</td>";
			_html += "         <td align='center'>" + data.records[0]["tx"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["fImputado"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["idcobranza"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["fRecibido"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["fImpacto"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["fFiserv"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["nro_liquidacion_fiserv"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["ExternalMerchantID"] + "</td>";
			_html += "         <td align='right'>" + data.records[0]["marca"] + "</td>";
			_html += "      </tr>";
			_html += "   </tbody>";
			_html += "</table>";
			_html += "<div class='container'>";
			_html += "   <div class='row'>";
			_html += "      <div class='col-6'>Webhook</div>";
			_html += "      <div class='col-6'>Conciliación</div>";
			_html += "   </div>";
			_html += "   <div class='row'>";
			var _j = {};
			var _j2 = {};
			var _pData = data.records[0]["raw_data"];
			var _pData2 = data.records[0]["raw_data2"];
			if (_pData != "") { _j = JSON.parse(_pData); }
			if (_pData2 != "") { _j2 = JSON.parse(_pData2); }
			_html += "      <div class='col-6'><pre>" + JSON.stringify(_j, null, 2) + "</pre></div>";
			_html += "      <div class='col-6'><pre>" + JSON.stringify(_j2, null, 2) + "</pre></div>";
			_html += "   </div>";
			_html += "</div>";
			_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Detalle de la imputación", "body": _html },
				function () {
					$(".btn-Save-modal").remove();
					$(".btn-close-modal").html("Cerrar").removeClass("d-none").removeClass("btn-danger").addClass("btn-success");
					$(".close").html("X")
					$(".modal-dialog").addClass("modal-xl");
					_VAR.onWait(false);
				}
			);
		})
	},
	onBuildPublishSoporte: function (_estado) {
		if (_estado == "5" || _estado == 5) {
			var _html = "";
			_VAR.ExecutePostAjax("/Administracion/GetRowsServiciosRelacionados", {}).then(function (data) {
				_html += "<table class='table table-sm table-borderless table-striped'>";
				_html += "   <thead class='thead-dark'>";
				_html += "      <tr>";
				_html += "         <th>Servidor</th>";
				_html += "         <th>Servicio</th>";
				_html += "      </tr>";
				_html += "   </thead>";
				_html += "   <tbody>";
				for (var i = 0; i < data.records.length; i++) {
					_html += "      <tr>";
					_html += "         <td align='left'>" + data.records[i]["servidor"] + "</td>";
					_html += "         <td align='left'><b>" + data.records[i]["servicio"] + "</b></td>";
					_html += "      </tr>";
				}
				_html += "   </tbody>";
				_html += "</table>";
				_VAR.onShowHtmlModal({ "id": "modal-preloader", "title": "Servicios a actualizar", "body": _html },
					function () {
						$(".btn-Save-modal").html("Marcar como publicado");
						$(".close").html("X")
						$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
							_VAR.ExecutePostAjax("/Administracion/UpdateServiciosRelacionados", {}).then(function (data) {
								window.location.reload();
							});
						});
						_VAR.onWait(false);
					}
				);
			});
		} else {
			return false;
		}
	},
	onResolverAccion: function (_this) {
		$(_this.attr("data-target")).val(_this.attr("data-id"));
	},
	onConfirmarResolverAccion: function (_this) {
		var _id = $(".IdAccion").val();
		var Origen = $(".origen").val();
		var Destino = $(".destino").val();
		if (Origen == "" || Destino == "") { alert("Debe indicar origen y destino"); return false; }
		_VAR.onWait(true);
		_this.fadeOut("fast");
		var _url = "/Utilidades/ResolverAccionesSoporte";
		var _params = { "Id": _id, "Origen": Origen, "Destino": Destino };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			_VAR.onWait(false);
			window.location.reload();
		}).catch(function (e) {
			alert("Error al ejecutar el proceso");
			_this.fadeIn("slow");
			_VAR.onWait(false);
		});
	},
	onGestionarAlerta: function (_this) {
		_VAR.idValorRegistroActivo = _this.attr("data-idTransaccion");
		var _id_socio = _this.attr("data-id_socio");
		var _accion = _this.attr("data-accion");
		switch (_accion) {
			case "NUEVO_MEDIO_COBRO":
				var _tipo = ".accMediosCobro";
				if (parseInt(_id_socio) != 0) { _tipo = ".accMediosCobroMediya"; }
				var _x = $('<a href="#" data-interface="' + _tipo + '" data-id_socio="' + _id_socio + '" data-id="0">+</a>');
				_VAR.onClickActivateModalInterface(_x);
				break;
			default:
				alert("No hay acción definida para este tipo de alerta.  No puede gestionarse.");
				break;
		}
	},
	onDescartarAlerta: function (_this) {
		var _html = "<h5 style='color:blue;'>Seleccione el motivo por el cual se descarta esta alerta.</h5>";
		_html += "</hr>";
		_html += "<div class='py-4 px-0'>";
		_html += "   <table style='width:100%;'>";
		_html += "      <tr>";
		_html += "         <td><label>Motivo</label></td>";
		_html += "         <td><select class='form-control wvalidate wid_type_status_alert' data-id='id' data-descripcion='descripcion' id='wid_type_status_alert' name='wid_type_status_alert'></select></td>";
		_html += "      </tr>";
		_html += "   </table>";
		_html += "   <input id='wid' name='wid' class='wid' type='hidden' value='" + _this.attr("data-id") + "'>";
		_html += "</div>";
		var _params = { "id": "modal-status-alert", "title": "Descartar alerta", "body": _html };
		_VAR.onShowHtmlModal(
			_params,
			function () {
				_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=NS_Type_Status_Alert", "wid_type_status_alert", "").then(function (data) { });

				$("body").off("click", ".btn-close-modal").on("click", ".btn-close-modal", function () {
					$(".modal-backdrop").remove();
					$("#" + _params.id).remove();
					$("body").css({ "overflow-y": "auto" });
					_VAR.RestorePosY();
				});
				$("body").off("click", ".btn-Save-modal").on("click", ".btn-Save-modal", function () {
					if (!_TOOLS.validate(".wvalidate", false)) { return false; }
					/*revisar los valores que se pasan porque no va el iduser o idcliente ni idtransaccion en casos de telefonos laborales */
					if (!confirm("Se marcará la alerta como descartada y no podrá gestionarse nuevamente ¿Confirma?")) { return false; }
					_VAR.onWait(true);
					_this.fadeOut("fast");
					var _url = "/Clientes/DescartarAlerta";
					var _params = { "Id": $(".wid").val(), "Id_user": _VAR.idUser, "IdStatusAlert": $(".wid_type_status_alert").val() };
					_VAR.ExecutePostAjax(_url, _params).then(function (data) {
						_this.fadeIn("slow");
						_VAR.onWait(false);
						$(".btn-close-modal").click();
					}).catch(function (e) {
						alert("Error al ejecutar el proceso");
						_this.fadeIn("slow");
						_VAR.onWait(false);
					});
				});
			}
		);
	},
	onAlertTransaccionState: function (_this) {
		if (!_VAR._forzarReadOnly) {
			var _foot = "";
			var _items = "";
			_items += _VAR.buildAlertLine(".alert-warning .alert-message strong", "warning");
			_items += _VAR.buildAlertLine(".alertaPlan", "danger");
			_items += _VAR.buildAlertLine(".alertaModoCobro", "danger");
			_items += _VAR.buildAlertLine(".alertaPendientes", "danger");
			_items += _VAR.buildAlertLine(".alertaManualesPendientes", "danger");
			_items += _VAR.buildAlertLine(".alertaDomicilios", "danger");
			_items += _VAR.buildAlertLine(".alertaTelefonos", "danger");
			_items += _VAR.buildAlertLine(".alertaDomiciliosLaboral", "danger");
			_items += _VAR.buildAlertLine(".alertaTelefonosLaboral", "danger");
			_items += _VAR.buildAlertLine(".alert-danger .alert-message", "info");
			if ($(".alertaPlan").html() != undefined && $(".alertaPlan").html() != "") { _items += _VAR.buildAlertLineText(("Resolver oferta: " + $(".alertaPlan").html()), "primary"); }
			if ($(".msgEndeudamiento").html() != undefined && $(".msgEndeudamiento").html() != "") { _foot += "<div style='padding:3px;border:double 3px red;'>" + $(".msgEndeudamiento").html() + "</div>"; }
			if (!_TOOLS.validate(".validate", false)) {
				_foot += "<br/><div style='padding:3px;border:double 3px red;'>" + _TOOLS.msgValidate(".validate") + "</div>";
			}

			if (_items != "") {
				var _body = ("<div style='padding:3px;border:double 3px red;'><ul>" + _items + "</ul></div>");
				if (_foot != "") { _body += ("<br/>" + _foot); }
				var _params = { "id": "infoModalAlertStateTransaccion", "title": "Alerta de estado de pendientes", "body": _body };
				_VAR.onShowHtmlModal(_params, function () {
					$(".modal-dialog").removeClass("modal-xl").addClass("modal-sm");
					$(".btn-Save-modal").remove();
					$(".btn-close-modal").html("Cerrar");
				});
			}
		} else {
			if (parseInt($(".iEstadoTransaccion").val()) != 7 && parseInt($(".iEstadoTransaccion").val()) != 6) {
				setTimeout(function () {
					$(".btnNewModal").remove();
					$(".form-select").attr("disabled", true);
					$(".form-control").attr("disabled", true);
					$(".btnCambiarFormaDePago").remove();
				}, 2000);
			}
		}
	},
	onEmitirMediya: function (_this) {
		_VAR.onWait(true);
		var _emitirMediya = 0;
		if (_this.prop("checked")) { _emitirMediya = 1; }
		var _p = { "idRequest": $(".id_obj").val(), "emitirMediya": _emitirMediya };
		_VAR.ExecutePostAjax("/Transaccion/EmitirMediya", _p).then(function (data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onChangeIdModoPagoMediya: function (_this) {
		var _new = (parseInt($(".Id").val()) == 0);
		var _iModoPago = parseInt(_this.val());
		$(".cbuMediya").removeClass("validarCBU");
		$(".relative").removeClass("validateAdherir");
		$(".PAN").removeClass("validarPAN");
		$(".DAC").addClass("d-none");
		$(".DAT").addClass("d-none");
		$(".DATCOBRO").addClass("d-none");
		switch (_iModoPago) {
			case 1: // tarjeta de credito
				_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=OpcionModoPagoDBClub&Field=IdModoPago&Filter=" + _iModoPago, "Marca", "");
				$(".DAT").removeClass("d-none");
				$(".Marca").addClass("validateAdherir");
				$(".PAN").addClass("validateAdherir");
				$(".PAN").addClass("validarPAN");
				$(".NombreTarjeta").addClass("validateAdherir");
				$(".MesVTO").addClass("validateAdherir");
				$(".AnioVTO").addClass("validateAdherir");
				break;
			case 5: // tarjeta de débito
				_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=OpcionModoPagoDBClub&Field=IdModoPago&Filter=" + _iModoPago, "Marca", "");
				$(".DAT").removeClass("d-none");
				$(".Marca").addClass("validateAdherir");
				$(".PAN").addClass("validateAdherir");
				$(".PAN").addClass("validarPAN");
				$(".NombreTarjeta").addClass("validateAdherir");
				$(".MesVTO").addClass("validateAdherir");
				$(".AnioVTO").addClass("validateAdherir");
				$(".DATCOBRO").removeClass("d-none");
				break;
			case 2: // CBU
				$(".cbuMediya").addClass("validarCBU");
				$(".DAC").removeClass("d-none");
				break;
			case 3: // Tarjeta CP
				if (parseInt($(".TarjetaCPHabilitada").val()) != 1) {
					alert("No puede utilizar este medio de pago para esta operación.  El DNI no tiene tarjeta activa.");
					$(".IdModoPago").val(-1);
				} else {
					$(".CBU").val($(".TarjetaCP").val());
				}
				break;
			case 4: // Pago empresa
				break;
			case 6: // Efectivo
				$(".validateAdherir").removeClass("validateAdherir");
				break;
			case 11: // debito cardcred
				_VAR.buildMediosCobro("", ".accMediosCobroMediya", false, true).then(function () {
					if ($(".accMediosCobroMediya").html() == "") {
						alert("Debe cargar lo datos de la tarjeta de débito en el área de Datos de Cobro o enviando el link al cliente para que se autogestione el alta desde el despegable 'Acciones'");
					}
					$(".DAC").addClass("d-none");
					$(".DAT").addClass("d-none");
					$(".DATCOBRO").removeClass("d-none");
					$(".Marca").removeClass("validateAdherir");
					$(".PAN").removeClass("validateAdherir");
					$(".PAN").removeClass("validarPAN");
					$(".NombreTarjeta").removeClass("validateAdherir");
					$(".MesVTO").removeClass("validateAdherir");
					$(".AnioVTO").removeClass("validateAdherir");
					_VAR.p3 = $("#NroDocumento").val();
				});
				break;
		}
	},
	onMediyaCambioEstado: function (_this) {
		var _EstadoActual = $(".EstadoSocio").val();
		var _html = "<table class='table table-sm table-borderless'>";
		_html += "   <tr>";
		_html += "      <td><label>Estado actual</label></td><td><span class='badge badge-dark'>" + _EstadoActual + "</span></td>";
		_html += "      <td><label>pasar a</label></td><td><select id='wNuevoEstado' name='wNuevoEstado' data-id='codigo' data-descripcion='descripcion' class='form-control dbase wvalidate wNuevoEstado'></select></td>";
		_html += "   </tr>";
		_html += "   <tr><td colspan='4'><label>Observaciones</label><br/><textarea id='wObservaciones' name='wObservaciones' type='text' class='form-control wObservaciones wvalidate' rows='3' value=''></textarea></td></tr>";
		_html += "</table>";

		_html += "<h5>Últimos pagos</h5>";
		_html += "<div class='accordion-body accUltimosPagos'></div>";
		_html += "<h5>Cambios de estado</h5>";
		_html += "<div class='accordion-body accCambiosEstado'></div>";

		_html += "<input id='wEstadoActual' name='wEstadoActual' type='hidden' class='form-control wEstadoActual' value='" + _EstadoActual + "'/><br/>";
		var _params = { "id": "infoMediyaCambioEstado", "title": "Cambio de estado socio Mediya", "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			$(".modal-dialog").addClass("modal-lg");
			_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=EstadoSocio", "wNuevoEstado", "").then(function () { });
			_VAR.LoadDataAjax("/Abstract/GetLookUpSpecial?Segmento=MediyaUltimosPagos&p1=" + _VAR.p1).then(function (data) {
				var _fields = ["TransaccionOrigen", "FechaAlta", "Origen", "Importe"];
				var _labels = ["Transacción", "Fecha", "Origen", "Importe"];
				var _params = { "one": true, "interface": ".accUltimosPagos", "idKey": "id", "class": "table table-sm", "fields": _fields, "labels": _labels, "records": data.records, "new": false, "edit": false, "delete": false, "verify": false };
				$(".accUltimosPagos").html(_VAR.BuildTable(_params, ""));
			});
			_VAR.LoadDataAjax("/Abstract/GetLookUpSpecial?Segmento=MediyaCambiosEstado&p1=" + _VAR.p1).then(function (data) {
				var _fields = ["Fecha", "Tipo", "Codigo", "ValorAnterior", "ValorNuevo", "Usuario", "Observaciones"];
				var _labels = ["Fecha", "Tipo", "Código", "Anterior", "Nuevo", "Usuario", "Observaciones"];
				var _params = { "one": true, "interface": ".accCambiosEstado", "idKey": "id", "class": "table table-sm", "fields": _fields, "labels": _labels, "records": data.records, "new": false, "edit": false, "delete": false, "verify": false };
				$(".accCambiosEstado").html(_VAR.BuildTable(_params, ""));
			});
			$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
				_VAR.onDestroyModal("#" + _params.id);
			});
			$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
				if (!_TOOLS.validate(".wvalidate", false)) { return false; }
				if (!confirm("Está a punto de cambiar el estado del socio.\n¿Confirma?")) { return false; }

				var _p = { "Id": _VAR.p1, "Observaciones": $(".wObservaciones").val(), "EstadoNuevo": $(".wNuevoEstado").val(), "Usuario": $(".Username").val() };
				_VAR.onWait(true);
				_VAR.ExecutePostAjax("/Mediya/SetCambiosEstadoMediya", _p).then(function (data) {
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
	onMediyaReactivacion: function (_this) {
		var _html = "<table class='table table-sm table-borderless'>";
		_html += "   <tr><td>" + $(".datosAlta").html() + "</td></tr>";
		_html += "   <tr><td>" + $(".datosPago").html() + "</td></tr>";
		_html += "   <tr><td><span class='badge badge-dark'>Pago anterior: " + $(".ANTEUltimoPago").val() + "</span></td></tr>";
		_html += "</table>";
		_html += "<h5>Cambio de empresario</h5>";
		_html += "<table class='table table-sm table-borderless'>";
		_html += "   <tr>";
		_html += "      <td width='20%'><label>DNI empresario</label></td>";
		_html += "      <td width='25%'><input type='text' inputmode='numeric' id='wDniEmpresario' name='wDniEmpresario' class='form-control dbase onlyNumbers wDniEmpresario wvalidate' value='' placeholder='DNI'/></td>";
		_html += "      <td width='35%' class='dataEmpresario'></td>";
		_html += "      <td width='30%'><input id='wIdSocioEmpresario' name='wIdSocioEmpresario' disabled type='text' class='form-control wIdSocioEmpresario wvalidate' value=''/></td>";
		_html += "   </tr>";
		_html += "</table>";
		_html += "<input id='wNombre' name='wNombre' type='hidden' class='form-control wNombre' value=''/><br/>";
		_html += "<input id='wApellido' name='wApellido' type='hidden' class='form-control wApellido' value='wApellido'/><br/>";
		_html += "<input id='wEmpresario' name='wEmpresario' type='hidden' class='form-control wEmpresario' value=''/><br/>";

		var _params = { "id": "infoMediyaReactivacion", "title": "Reactivación", "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			_VAR.LoadDataAjax("/Abstract/GetLookUpSpecial?Segmento=MediyaModosPago&p1=" + _VAR.p1).then(function (data) {
				var _fields = ["Fecha", "Descripcion", "Identificacion", "Marca", "NombreTarjeta", "FechaVtoPAN", "Estado", "Observaciones"];
				var _labels = ["Fecha", "Descripción", "Nº", "Marca", "Nombre", "Fecha VTO", "Estado", "Observaciones"];
				var _params = { "one": true, "interface": ".accCambiosEstado", "idKey": "id", "class": "table table-sm", "fields": _fields, "labels": _labels, "records": data.records, "new": false, "edit": false, "delete": false, "verify": false };
				$(".accModosPago").html(_VAR.BuildTable(_params, ""));
			});
			$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
				_VAR.onDestroyModal("#" + _params.id);
			});
			$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
				if (!_TOOLS.validate(".wvalidate", false)) { return false; }
				if (!confirm("Está a punto de cambiar el empresario del socio.\n¿Confirma?")) { return false; }

				var _p = { "Id": _VAR.p1, "IdEmpresario": $(".wIdSocioEmpresario").val(), "Usuario": $(".Username").val() };
				_VAR.onWait(true);
				_VAR.ExecutePostAjax("/Mediya/SetCambioEmpresarioSocioMediya", _p).then(function (data) {
					if (!data.logica) { alert(data.mensaje); }
					$(".btn-close-modal").click();
					_VAR.onWait(false);
				}).catch(function (err) {
					alert("Se ha producido un error indeterminado");
					_VAR.onWait(false);
				});
			});
			$("body").off("keyup", ".wDniEmpresario").on("keyup", ".wDniEmpresario", function (e) {
				var _this = $(this);
				clearTimeout(_VAR._TIMER_LAZY);
				_VAR._TIMER_LAZY = setTimeout(function () {
					$(".dataEmpresario").html("");
					$(".wIdSocioEmpresario").val("");
					$(".wNombre").val("");
					$(".wApellido").val("");
					$(".wEmpresario").val("");

					var _url = "/Clientes/CajaFisica";
					var _params = { "NroDocumento": $(".wDniEmpresario").val(), "IdSocio": null };
					_VAR.ExecutePostAjax(_url, _params).then(function (data) {
						if (data.records.length != 0) {
							var _dataEmpresario = "<span class='badge badge-primary'>" + data.records[0]["Nombre"] + " " + data.records[0]["Apellido"] + "</span>";
							$(".dataEmpresario").html(_dataEmpresario);
							$(".wIdSocioEmpresario").val(data.records[0]["IdSocio"]);
							$(".wNombre").val(data.records[0]["Nombre"]);
							$(".wApellido").val(data.records[0]["Apellido"]);
							$(".wEmpresario").val(data.records[0]["Empresario"]);
						}
					});
				}, 1000);
			});
		});
	},
	onMediyaModosPago: function (_this) {
		var _html = "<h5>Modos de pago</h5>";
		_html += "<div class='accordion-body accModosPago'></div>";
		var _params = { "id": "infoMediyaModosPago", "title": "Histórico de modos de pago", "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			$(".modal-dialog").addClass("modal-lg");
			$(".btn-cancel-modal").html("Cerrar");
			$(".btn-accept-modal").remove();
			_VAR.LoadDataAjax("/Abstract/GetLookUpSpecial?Segmento=MediyaModosPago&p1=" + _VAR.p1).then(function (data) {
				var _fields = ["Fecha", "Descripcion", "Identificacion", "Marca", "NombreTarjeta", "FechaVtoPAN", "Estado", "Observaciones"];
				var _labels = ["Fecha", "Descripción", "Nº", "Marca", "Nombre", "Fecha VTO", "Estado", "Observaciones"];
				var _params = { "one": true, "interface": ".accCambiosEstado", "idKey": "id", "class": "table table-sm", "fields": _fields, "labels": _labels, "records": data.records, "new": false, "edit": false, "delete": false, "verify": false };
				$(".accModosPago").html(_VAR.BuildTable(_params, ""));
			});
			$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
				_VAR.onDestroyModal("#" + _params.id);
			});
		});
	},
	onBuscarMediyaFacturaLote: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		$(".LoteImportacion").val("");
		var _p = { "Fecha": $(".FechaFacturaLote").val() };
		_VAR.ExecutePostAjax("/Mediya/GetCobranzaPorLote", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onProcesarMediyaFacturaLote: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		if (!confirm("Se procesará la tarea solicitada, consulte detalles de ubicaciones de descarga. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-links").html("").addClass("d-none");
		var _email = 0;
		if ($(".chkEmailLoteImportacion").prop("checked")) { _email = 1; }
		var _p = { "Lote": $(".LoteImportacion").val(), "Email": _email, "GenerarPlanillaDetalle": 1, "GeneraAsiento": 0 }
		_VAR.ExecutePostAjax("/Mediya/GenerarFacturasPorLote", _p).then(function (data) {
			$("." + _tab + "-links").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarMediyaNominaSwiss: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		$(".FechaCierreSwiss").val("");
		$(".CierreAnteriorSwiss").val("");
		$(".PagosDesdeSwiss").val("");
		$(".PagosHastaSwiss").val("");
		var _p = { "pYear": $(".LiquidacionYear").val(), "pMonth": $(".LiquidacionMonth").val() };
		_VAR.ExecutePostAjax("/Mediya/GetParametrosCierre", _p).then(function (data) {
			if (!data.logica) {
				alert(data.mensaje);
			} else {
				$(".FechaCierreSwiss").val(data.records[0]["fFechaCierre"]);
				$(".CierreAnteriorSwiss").val(data.records[0]["fFechaCierreANT"]);
				$(".PagosDesdeSwiss").val(data.records[0]["fPagosDesde"]);
				$(".PagosHastaSwiss").val(data.records[0]["fPagosHasta"]);
				$("." + _tab + "-proccess").removeClass("d-none");
			}
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onProcesarMediyaNominaSwiss: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		if (!_TOOLS.validate(".optSwiss", false)) { alert("¡Debe seleccionar alguna de las opciones!"); return false; };
		if (!confirm("Se procesará la tarea solicitada, consulte detalles de ubicaciones de descarga. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "pYear": $(".LiquidacionYear").val(), "pMonth": $(".LiquidacionMonth").val(), "optSwiss": $('input[name="optSwiss"]:checked').val() };
		_VAR.ExecutePostAjax("/Mediya/ProcesarMediyaNominaSwiss", _p).then(function (data) {
			$("." + _tab + "-links").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarMoraTempranaConsulta: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "FechaDesde": $(".FechaDesdeMoraTempranaConsulta").val(), "FechaHasta": $(".FechaHastaMoraTempranaConsulta").val() };
		_VAR.ExecutePostAjax("/Clientes/BuscarMoraTempranaConsulta", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarMoraTempranaPagos: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "Estado": $(".EstadoPagoMoraTempranaPagos").val(), "FechaDesde": $(".FechaDesdeMoraTempranaPagos").val(), "FechaHasta": $(".FechaHastaMoraTempranaPagos").val() };
		_VAR.ExecutePostAjax("/Clientes/BuscarMoraTempranaPagos", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarCreditoAnularRefinanciacion: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		var _p = { "Valor": $(".NroCreditoAnularRefinanciacion").val() };
		_VAR.ExecutePostAjax("/Clientes/BuscarCreditoAnularRefinanciacion", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			if (data.logica) {
				$("." + _tab + "-proccess").removeClass("d-none");
			}
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onProcesarCreditosAnularRefinanciacion: function (_this) {
		if (!confirm("Se procesará la tarea solicitada, consulte detalles de ubicaciones de descarga. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "Valor": $(".IdSolicitudRefinanciacion").val(), "Username": $(".Username").val() };
		_VAR.ExecutePostAjax("/Clientes/ProcesarCreditosAnularRefinanciacion", _p).then(function (data) {
			$("." + _tab + "-links").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarCreditoTotalizar: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		var _p = { "Valor": $(".NroCreditoTotalizar").val() };
		_VAR.ExecutePostAjax("/Clientes/BuscarCreditoTotalizar", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			if (data.logica) {
				$("." + _tab + "-proccess").removeClass("d-none");
			}
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onProcesarCreditosTotalizar: function (_this) {
		if (!confirm("Se procesará la tarea solicitada, consulte detalles de ubicaciones de descarga. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "Valor": $(".IdSolicitudTotalizar").val() };
		_VAR.ExecutePostAjax("/Clientes/ProcesarCreditosTotalizar", _p).then(function (data) {
			$("." + _tab + "-links").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarOperacionMil: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		var _p = { "Valor": $(".IdVentaMil").val() };
		_VAR.ExecutePostAjax("/Administracion/BuscarOperacionMil", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			if (data.logica) {
				$("." + _tab + "-proccess").removeClass("d-none");
			}
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onProcesarOperacionMil: function (_this) {
		if (!confirm("Se procesará la tarea solicitada, consulte detalles de ubicaciones de descarga. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		var _p = { "Valor": $(".xmlMovimientoMil").val() };
		_VAR.ExecutePostAjax("/Administracion/ProcesarOperacionMil", _p).then(function (data) {
			$("." + _tab + "-links").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onBuscarMovimientosTarjetasMil: function (_this) {
		if (!_TOOLS.validate(_this.attr("data-validate"), true)) { return false; }
		_VAR.onWait(true);
		var _tab = _this.attr("data-tab");
		$("." + _tab + "-proccess").addClass("d-none");
		var _p = { "Valor": $(".CuentaTarjetMil").val(), "iDesde": $(".TransaccionDesdeMil").val(), "iHasta": $(".TransaccionHastaMil").val() };
		_VAR.ExecutePostAjax("/Administracion/BuscarMovimientosTarjetasMil", _p).then(function (data) {
			$(".areaResultado-" + _tab).html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onSelectXml: function (_this) {
		$(_this.attr("data-target")).val(_TOOLS.b64_to_utf8(_this.attr("data-xml")));
	},
	onValidateCbu: function (_this) {
		var _source = _this.attr("data-validate");
		if (!_TOOLS.validate(_source, true)) { return false; }
		_VAR.onWait(true);
		var _p = { "ValorConsulta": $(_source).val(), "TipoConsulta": _this.attr("data-tab") };
		_VAR.ExecutePostAjax("/Utilidades/ValidarCBU", _p).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onPriorityItemFolder: function (_this) {
		_VAR.onWait(true);
		if (isNaN(_this.val())) { _this.val("0"); }
		var _params = { "Id": _this.attr("data-id"), "prioridad": _this.val() };
		_VAR.ExecutePostAjax("/Documentacion/TogglePriority", _params).then(function (_data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onReadFolderItem: function (_this) {
		_VAR.onWait(true);
		var _active = 0;
		if (_this.prop("checked")) { _active = 1; }
		var _params = { "Id": _this.attr("data-id"), "Id_status": _active, "Id_user": $(".idUser").val() };
		_VAR.ExecutePostAjax("/Documentacion/ToggleViewed", _params).then(function (_data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onGetRowsFuncionesByGrupo: function (_this) {
		_VAR.onWait(true);
		var _p = { "Id_group": _VAR.idValorRegistroActivo };
		_VAR.ExecutePostAjax("/Administracion/GetRowsFuncionesByGrupo", _p).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onGetRowsGruposByFolder: function (_this, _edit) {
		if (!_edit) { return false; }
		_VAR.onWait(true);
		var _p = { "Id": _VAR.idValorRegistroActivo };
		_VAR.ExecutePostAjax("/Administracion/GetRowsGruposByFolder", _p).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onGetRowsItemsByFolder: function (_this, _edit) {
		_VAR.onWait(true);
		var _p = { "Id": _VAR.idValorRegistroActivo, "id_user": $(".idUser").val() };
		_VAR.ExecutePostAjax("/Documentacion/GetRowsItemsByFolder", _p).then(function (data) {
			$(".areaItems").html(data.html).removeClass("d-none");
			if (!_edit) { $(".btnOfflineRecord").remove(); $(".btnNewFolderItem").remove(); }
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onActiveFunction: function (_this) {
		_VAR.onWait(true);
		var _active = 0;
		if (_this.prop("checked")) { _active = 1; }
		var _params = { "Id_function": _this.attr("data-id_function"), "Id_group": _this.attr("data-id_group"), "Id_status": _active };
		_VAR.ExecutePostAjax("/Administracion/ToggleActivateFunction", _params).then(function (_data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onActiveGroupFolder: function (_this) {
		_VAR.onWait(true);
		var _active = 0;
		if (_this.prop("checked")) { _active = 1; }
		var _params = { "Id": _this.attr("data-id_folder"), "Id_group": _this.attr("data-id_group"), "Id_status": _active };
		_VAR.ExecutePostAjax("/Administracion/ToggleActivateGroupFolder", _params).then(function (_data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onGetRowsAplicacionesByFuncion: function (_this) {
		_VAR.onWait(true);
		var _p = { "Id_function": _VAR.idValorRegistroActivo };
		_VAR.ExecutePostAjax("/Administracion/GetRowsAplicacionesByFuncion", _p).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (err) {
			alert("Se ha producido un error indeterminado");
			_VAR.onWait(false);
		});
	},
	onActiveApplication: function (_this) {
		_VAR.onWait(true);
		var _active = 0;
		if (_this.prop("checked")) { _active = 1; }
		var _params = { "Id_function": _this.attr("data-id_function"), "Id_application": _this.attr("data-id_application"), "Id_status": _active };
		_VAR.ExecutePostAjax("/Administracion/ToggleActivateApplication", _params).then(function (_data) {
			_VAR.onWait(false);
		}).catch(function (err) {
			alert(err.message);
			_VAR.onWait(false);
		});
	},
	onMapaPermisos: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		var _url = "/Administracion/MapaPermisos";
		var _params = { "Username": $(".Usuario").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_VAR.onWait(false);
		});

	},
	onMarcarLeidos: function (_this) {
		if (!_TOOLS.validate(".validateFirst", true)) { return false; }
		_VAR.onWait(true);
		var _url = "/Administracion/MarcarLeidos";
		var _params = { "Username": $(".Usuario").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			$(".areaResultado").html(data.html).removeClass("d-none");
			_VAR.onWait(false);
		}).catch(function (e) {
			alert("Error al solicitar el informe");
			_VAR.onWait(false);
		});

	},
	onImportarSocios: function (_this) {
		try {
			var _id = _this.attr("data-id");
			var _razonSocial = _this.attr("data-name");
			var _html = "";
			_html += "<h4>Seleccione archivo a importar por la empresa <b>" + _razonSocial + "</b>:</h4>";
			_html += "<input data-id='" + _id + "' class='btn-upload-socios btn btn-dark' type='file' id='importarSocios' name='importarSocios' accept='text/plain, text/csv'>";
			_VAR.onShowHtmlModal({ "id": "mediyaModalImportarSocios", "title": "Importar socios", "body": _html },
				function () {
					$("body").off("click", ".btn-upload-socios").on("click", ".btn-upload-socios", function (event) {
						$(this).val(null);
					});
					$("body").off("change", ".btn-upload-socios").on("change", ".btn-upload-socios", function (event) {
						if (!confirm("¿Confirma la importación?")) { return false; }
						var _id_empresa = $(this).attr("data-id");
						var base64 = "";
						var reader = new FileReader();
						reader.readAsDataURL($(".btn-upload-socios").prop('files')[0]);
						reader.onload = function () {
							base64 = reader.result;
							var _url = "/Mediya/ImportarSocios";
							var _params = { "base64": base64, "IdEmpresa": _id_empresa, "Username": $(".Username").val() };
							_VAR.ExecutePostAjax(_url, _params).then(function (data) {
								alert(data.error);
								_VAR.onDestroyModal("#mediyaModalImportarSocios");
								_VAR.onWait(false);
							}).catch(function (e) {
								_VAR.onWait(false);
							});
						};
					});
				}
			);
			return true;
		} catch (rex) {
			alert(rex.message);
			return false;
		}
	},
	onStopGo: function (_this) {
		if (!confirm("Se cambiará el modeo STOP / GO de la empresa. ¿Confirma?")) { return false; }
		_VAR.onWait(true);
		var _url = "/Mediya/StopGo";
		var _params = { "id": _this.attr("data-id") };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			window.location.reload();
			_VAR.onWait(false);
		}).catch(function (e) {
			_VAR.onWait(false);
		});
	},
	onTrackArea: function (_area, _id_user) {
		var _params = { "Descripcion": _area, "Id_user": _id_user };
		var _url = "/Utilidades/TrackArea";
		_VAR.ExecutePostAjax(_url, _params).then(function (data) { });
	},
	onAlertaClienteMil: function (_id) {
		var _params = { "Id": _id };
		var _url = "/Mil/AlertaCliente";
		_VAR.ExecutePostAjax(_url, _params).then(function (data) { });
	},
	onFoldersNotViewedNotification: function (_this) {
		return new Promise(
			function (resolve, reject) {
				try {
					$(".TYPE").html("");
					$(".divHome").addClass("d-none").hide();
					var _json = _TOOLS.getFormValues(null, _this);
					var _url = "/Utilidades/FoldersNotViewedNotification";
					var _params = { "Id_user": $(".idUser").val(), "Id_type": 0 };
					_VAR.ExecutePostAjax(_url, _params).then(function (data) {
						$.each(data.records, function (i, val) {
							if (val.total != 0) {
								var _html = "<div class='py-1' style='color:cadetblue;'>Documentos sin leer <span class='float-right badge badge-primary' style='background-color:transparent;color:rgb(235, 0, 139);font-size:14px;'>" + val.total + "</span></div>";
								$(".TYPE-" + val.id_type_folder).html(_html);
								$(".divHome-" + val.id_type_folder).removeClass("d-none").fadeIn("slow");
							}
						});
						_params = { "Id_user": $(".idUser").val(), "Id_type": 1 };
						_VAR.ExecutePostAjax(_url, _params).then(function (data) {
							$.each(data.records, function (i, val) {
								var _html = "<div class='py-1'>Documentos totales <span class='float-right badge badge-primary mr-2'>" + val.total + "</span></div>";
								var _t = $(".TYPE-" + val.code_type_folder).html();
								$(".TYPE-" + val.code_type_folder).html(_t + _html);
								$(".divHome-" + val.code_type_folder).removeClass("d-none").fadeIn("fast");
								_params = { "Id_user": $(".idUser").val(), "Id_type": 2 };
								_VAR.ExecutePostAjax(_url, _params).then(function (data) {
									$.each(data.records, function (i, val) {
										var _html = "<div class='py-1'>Documentos para revisar <span class='float-right badge badge-primary magenta' style='background-color:rgb(235, 0, 139);'>" + val.total + "</span></div>";
										var _t = $(".TYPE-" + val.id_type_folder).html();
										$(".TYPE-" + val.id_type_folder).html(_t + _html);
									});
									_params = { "Id_user": $(".idUser").val(), "Id_type": 3 };
									_VAR.ExecutePostAjax(_url, _params).then(function (data) {
										$.each(data.records, function (i, val) {
											var _html = "<div class='py-1'>Documentos para publicar <span class='float-right badge badge-primary magenta' style='background-color:rgb(235, 0, 139);'>" + val.total + "</span></div>";
											var _t = $(".TYPE-" + val.id_type_folder).html();
											$(".TYPE-" + val.id_type_folder).html(_t + _html);
										});
									});
								});
							});
						});
					});
				} catch (rex) {
					_FUNCTIONS.onAlert({ "message": rex.message, "class": "alert-danger" });
					reject(rex);
				}
			});
	},
	onFinalizarImprimirOperacionCaja: function (_this) {
		if (!confirm("Se finalizará e imprimirá la operación en curso.  Todo será registrado en la caja.  ¿Confirma?")) { return false; }
		/*Se procesará todo el array _VAR._ITEMS_COBRANZA_ACTIVA, se grabarán N ítems y se realizará la impresión */
		/*reset final*/
		_FUNCTIONS.onResetAltaMovimientosCaja(_this, false);
		/* recarga el form para refresh y dejar todo ok para nueva operación de caja */
		window.location.reload();
	},
	onResetAltaMovimientosCaja: function (_this, bAlert) {
		if (bAlert) {
			if (!confirm("Se eliminarán los ítems de la cobranza en curso.  Nada se registrará en la caja.  ¿Confirma?")) { return false; }
		}
		/*Reset de array de datos de la cobranza en curso, previo a la finalización e impresión */
		$(".itemsOperacionActual").html("Sin ítems por el momento...");
		_VAR._ITEMS_COBRANZA_ACTIVA = [];
		_F._itemsPagos = [];
		$(".barFin").addClass("d-none");
		$(".areaAcciones").css({ "background-color": "white" });
	},
	onAgregarCobranzaActiva: function (_this) {
		if (_F._itemsPagos.length == 0) {
			alert("¡No puede ingresar un movimiento con monto cero!");
			return false;
		}
		$(".itemsOperacionActual").html("¡Acá se agrega el item!");
		/*Se debe aregar el item al array _VAR._ITEMS_COBRANZA_ACTIVA,
		  el cual se va a procesar al terminar e imprimir */
		_VAR._ITEMS_COBRANZA_ACTIVA.push(_F._itemsPagos);
		_F._itemsPagos = [];
		$(".barFin").removeClass("d-none");
		$(".areaAcciones").css({ "background-color": "lightgreen" });
		return true;
	},
	onAgregarMovimientoCaja: function (_this) {
		var _id_caja = _this.attr("data-id");
		var _iface = _this.attr("data-iface");
		var _html = "";
		/*Decidir por el tipo de movivimento de caja, si se controla el dni */
		switch (_iface) {
			case "xxx": // movimientos que pudieran no requerir chequear datos según DNI
				break;
			default:
				if (!_TOOLS.validate(".validateMovimiento", false)) { return false; }
				break;
		}
		_VAR.onWait(true);
		var _dni = $(".dni").val();
		var _url = "/Cajas/InterfaceMovimientoCaja";
		var _params = { "nID": _id_caja, "sDescripcion": _iface, "documento": _dni, "nIDSucursal": $(".idUserSucursal").val() };
		_VAR.ExecutePostAjax(_url, _params).then(function (data) {
			var _params = { "id": "infoMovimientoCaja", "title": "Agregar ítem a la cobranza en curso", "body": data.html };
			_VAR.onShowInfoModal(_params, function () {
				$(".modal-footer").remove();
				var _footer = "<div class='modal-footer wfooter my-2'>";
				_footer += "<a href='#' class='btn btn-sm btn-danger btn-cancel-modal'>Cancelar</a>";
				_footer += "<a href='#' class='btn btn-md btn-success btn-accept-modal'>Aceptar</a>";
				_footer += "</div>";
				_VAR.onWait(false);
				$(".modal-content").append(_footer);
				$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
					_VAR.onDestroyModal("#infoMovimientoCaja");
				});
				$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
					switch (_iface) {
						case "completo":
							break;
						default:
							if (!_TOOLS.validate(".wvalidate", false)) { return false; }
							var _importe = $(".importe").val();
							var _verificarimporte = $(".verificarimporte").val();
							if (_importe != _verificarimporte) {
								$(".msgAlertaMovimiento").html("¡El importe y su verificación difieren!");
								return false;
							}
							/*Aca debe armarse el contenido de $(".verificarimporte").val() de acuerdo a los datos segun cada _iface */
							var _identificacion = "";
							$(".identify").each(function (index) { _identificacion += ($(this).attr("id") + ":" + $(this).val() + "|"); });
							/* Agregar linea de pago de acuerdo a lo que se esté procesando! */
							_F._itemsPagos = { "Identificacion": _identificacion.slice(-1), "Tipo": _iface, "Importe": _importe };
							break;
					}
					if (_FUNCTIONS.onAgregarCobranzaActiva($(this))) { $(".btn-cancel-modal").click(); }
				});
			});
			_VAR.onWait(false);
		}).catch(function (e) {
			_VAR.onWait(false);
		});
	},
	onChangeStatusFolder: function (_this) {
		var _id = _this.attr("data-id");
		var _control = _this.attr("data-control");
		var _html = "<table class='table table-sm table-borderless'>";
		_html += "   <tr>";
		_html += "      <td><label>Estado actual</label></td><td><span class='badge badge-dark'>" + _control + "</span></td>";
		_html += "      <td><label>pasar a</label></td><td><select id='wNuevoEstado' name='wNuevoEstado' data-id='id' data-descripcion='descripcion' class='form-control dbase wvalidate wNuevoEstado'></select></td>";
		_html += "   </tr>";
		_html += "</table>";
		var _params = { "id": "infoStatus", "title": "Cambiar estado de la carpeta", "body": _html };
		_VAR.onShowStaticModal(_params, function () {
			_VAR.LoadComboAjax("/Abstract/GetLookUp?Tipo=mod_folders_type_control_points", "wNuevoEstado", "").then(function () { });

			$("body").off("click", ".btn-accept-modal").on("click", ".btn-accept-modal", function () {
				_params = { "Id_user": $(".idUser").val(), "id": _id, "id_type_control_point": $("#wNuevoEstado").val() };
				_VAR.ExecutePostAjax("/Documentacion/ChangeStatus", _params).then(function (data) {
					if (data.records[0]["msg"] != "") {
						alert(data.records[0]["msg"]);
						$(".btn-cancel-modal").click();
					} else {
						$(".btnConsultarGrilla").click();
					}
				});
			});
			$("body").off("click", ".btn-cancel-modal").on("click", ".btn-cancel-modal", function () {
				_VAR.onDestroyModal("#infoStatus");
			});
		});
	},
	onBuscarIntranetHome: function (_this) {
		window.location = "\\Documentacion\\Grilla?description=" + $("#Buscar").val();
	},
}