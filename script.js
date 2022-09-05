// DATOS INICIALES

if (localStorage.getItem("categorias") === null) {
    let categorias = ['Comida', 'Servicios', 'Salidas', 'Educación', 'Transporte', 'Trabajo']
    localStorage.setItem('categorias', JSON.stringify(categorias))
}
if (localStorage.getItem("operaciones") === null) {
    let operaciones = []
    localStorage.setItem('operaciones', JSON.stringify(operaciones))
}
if (localStorage.getItem("contador") === null) {
    localStorage.setItem('contador', 0)
}

try {
    localStorage.setItem("fecha", sortOperacionesFechaMenosReciente(getOperaciones())[0].fecha)
} catch (error) {
    localStorage.setItem("fecha", new Date().toISOString().split('T')[0])
}

document.getElementById("filtros-fecha").value = localStorage.getItem("fecha")
document.getElementById("nueva-operacion-fecha").value = localStorage.getItem("fecha")
document.getElementById("editar-operacion-fecha").value = localStorage.getItem("fecha")

populateCategorias()
populateOperaciones()

// Funciones show/hide

function showBalance() {
    hideAll()
    document.getElementById("seccion-balance").classList.remove('visually-hidden')
}

function showNuevaOperacion() {
    hideAll()
    document.getElementById("nueva-operacion").classList.remove('visually-hidden')
}

function showCategorias() {
    hideAll()
    document.getElementById("seccion-categorias").classList.remove('visually-hidden')
}

function showEditar(index) {
    hideAll()
    let categorias = JSON.parse(localStorage.getItem("categorias"))
    document.getElementById("input-editar-categoria").setAttribute('placeholder', categorias[index])
    document.getElementById("boton-editar-categoria").setAttribute('onclick', `editarCategoria('${index}')`)
    document.getElementById("editar-categoria").classList.remove('visually-hidden')
}

function showReportes() {
    hideAll()
    if (getOperaciones().length > 0) {
        showReportesResults()
    }
    else {
        showReportesNoResults()
    }
    document.getElementById("seccion-reportes").classList.remove('visually-hidden')
}

function hideAll() {
    document.getElementById("seccion-balance").classList.add('visually-hidden')
    document.getElementById("nueva-operacion").classList.add('visually-hidden')
    document.getElementById("editar-operacion").classList.add('visually-hidden')
    document.getElementById("seccion-categorias").classList.add('visually-hidden')
    document.getElementById("editar-categoria").classList.add('visually-hidden')
    document.getElementById("seccion-reportes").classList.add('visually-hidden')
}

function hideFilters() {
    document.getElementById("ocultar-filtros").classList.add('visually-hidden')
    document.getElementById("mostrar-filtros").classList.remove('visually-hidden')
    document.getElementById("filtros").classList.add('visually-hidden')
}

function showFilters() {
    document.getElementById("mostrar-filtros").classList.add('visually-hidden')
    document.getElementById("ocultar-filtros").classList.remove('visually-hidden')
    document.getElementById("filtros").classList.remove('visually-hidden')
}

function showOperaciones() {
    document.getElementById("operaciones-no-results").classList.add('visually-hidden')
    document.getElementById("operaciones-results").classList.remove('visually-hidden')
}

function showEditarOperacion(id) {
    hideAll()
    document.getElementById("boton-editar-operacion").setAttribute('onclick', `editOperacion('${id}')`)
    document.getElementById("editar-operacion").classList.remove('visually-hidden')
}

function showReportesResults() {
    document.getElementById("reportes-no-results").classList.add('visually-hidden')
    document.getElementById("reportes-results").classList.remove('visually-hidden')
}

function showReportesNoResults() {
    document.getElementById("reportes-results").classList.add('visually-hidden')
    document.getElementById("reportes-no-results").classList.remove('visually-hidden')
}

// Mostrar Categorias

function populateCategorias() {

    let categorias = getCategorias()

    // select-categorias en filtros

    document.getElementById("filtros-categoria").innerHTML = ``
    document.getElementById("filtros-categoria").innerHTML +=
        `<option>Todas</option>`
    for (let i = 0; i < categorias.length; i++) {
        document.getElementById("filtros-categoria").innerHTML +=
            `<option value="${i}">${categorias[i]}</option>`
    }

    // select categorias en nueva operacion

    document.getElementById("nueva-operacion-categoria").innerHTML = ``
    for (let i = 0; i < categorias.length; i++) {
        document.getElementById("nueva-operacion-categoria").innerHTML +=
            `<option value="${i}">${categorias[i]}</option>`
    }

    // select categorias en editar operacion

    document.getElementById("editar-operacion-categoria").innerHTML = ``
    for (let i = 0; i < categorias.length; i++) {
        document.getElementById("editar-operacion-categoria").innerHTML +=
            `<option value="${i}">${categorias[i]}</option>`
    }

    // lista de categorias en seccion categorias

    document.getElementById("lista-categorias").innerHTML = ``
    for (let i = 0; i < categorias.length; i++) {
        document.getElementById("lista-categorias").innerHTML +=
            `<p class="row p-2 ">
    <span class="col">${categorias[i]}</span>
    <span class="col text-end">
        <a href="#" onclick="showEditar(${i})">Editar</a>
        <a href="#" onclick="eliminarCategoria(${i})">Eliminar</a>
    </span>
    </p>`
    }
}

// Mostrar Operaciones

function populateOperaciones() {
    let operaciones = getOperaciones()
    renderBalance(operaciones)
    renderOperaciones(operaciones)
    renderReportes(operaciones)
}

function renderBalance(operaciones) {
    let ganancias = montoOperaciones(getGanancias(operaciones))
    let gastos = montoOperaciones(getGastos(operaciones))
    document.getElementById("balance-ganancias").innerHTML = `${'+ $' + ganancias}`
    document.getElementById("balance-gastos").innerHTML = `${'- $' + gastos}`
    if (ganancias - gastos > 0) {
        document.getElementById("balance-total").innerHTML = `${'+ $' + (ganancias - gastos)}`
    }
    if (ganancias - gastos < 0) {
        document.getElementById("balance-total").innerHTML = `${'- $' + (Math.abs(ganancias - gastos))}`
    }
    if (ganancias - gastos == 0) {
        document.getElementById("balance-total").innerHTML = `${'$' + 0}`
    }
}

function renderOperaciones(operaciones) {
    if (operaciones.length > 0) {
        document.getElementById("operaciones-no-results").classList.add('visually-hidden')
        document.getElementById("operaciones-results").classList.remove('visually-hidden')
        showOperaciones()
        document.getElementById("operaciones-results").innerHTML =
            `<tr>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Acciones</th>
        </tr>`
        for (let i = 0; i < operaciones.length; i++) {
            document.getElementById("operaciones-results").innerHTML +=
                `<tr>
                <td>${operaciones[i].descripcion}</td>
                <td>${operaciones[i].categoria}</td>
                <td>${operaciones[i].fecha}</td>
                <td>${operaciones[i].monto}</td>
                <td>
                    <a href="#" onclick="showEditarOperacion(${operaciones[i].id})">Editar</a>
                    <a href="#" onclick="deleteOperacion(${operaciones[i].id})">Eliminar</a>
                </td>
            </tr>`
        }
    }
    else {
        document.getElementById("operaciones-results").classList.add('visually-hidden')
        document.getElementById("operaciones-no-results").classList.remove('visually-hidden')
    }
}

function renderReportes() {
    document.getElementById("reportes-resumen").innerHTML = ``
    document.getElementById("reportes-resumen").innerHTML +=
        `<tr>
            <td class="col-4">Categoría con mayor ganancia</td>
            <td class="col-4 text-end">${categoriaMayorGanancia().categoriaConMayorGanancia}</td>
            <td class="col-4 text-end"><span class="text-success">${'+$' + categoriaMayorGanancia().mayorGanancia}</span></td>
        </tr>
        <tr>
            <td class="col-4">Categoría con mayor gasto</td>
            <td class="col-4 text-end">${categoriaMayorGasto().categoriaConMayorGasto}</td>
            <td class="col-4 text-end"><span class="text-danger">${'-$' + categoriaMayorGasto().mayorGasto}</span></td>
        </tr>
        <tr>
            <td class="col-4">Categoría con mayor balance</td>
            <td class="col-4 text-end">${categoriaMayorBalance().categoriaConMayorBalance}</td>
            <td class="col-4 text-end"><span>${'$' + categoriaMayorBalance().balance}</span></td>
        </tr>
        <tr>
            <td class="col-4">Mes con mayor ganancia</td>
            <td class="col-4 text-end">${mesMayorGanancia().mesConMayorGanancia}</td>
            <td class="col-4 text-end"><span class="text-success">${'+$' + mesMayorGanancia().mayorGanancia}</span></td>
        </tr>
        <tr>
            <td class="col-4">Mes con mayor gasto</td>
            <td class="col-4 text-end">${mesMayorGasto().mesConMayorGasto}</td>
            <td class="col-4 text-end"><span class="text-danger">${'-$' + mesMayorGasto().mayorGasto}</span></td>
        </tr>`
    document.getElementById("reportes-totales-categoria").innerHTML = ``
    document.getElementById("reportes-totales-categoria").innerHTML +=
        `<tr>
            <th class="col-3">Categoria</th>
            <th class="col-3 text-end">Ganancias</th>
            <th class="col-3 text-end">Gastos</th>
            <th class="col-3 text-end">Balance</th>
        </tr>`
    for (let i = 0; i < getCategorias().length; i++) {
        if (getOperaciones().filter(operacion => operacion.categoria == getCategorias()[i]).length > 0) {
            if (gananciaPorCategoria(getCategorias[i], getOperaciones()) >= 0) {
                document.getElementById("reportes-totales-categoria").innerHTML +=
                    `<tr>
                    <td>${getCategorias()[i]}</td>
                    <td class="text-end"><span class="text-success">${'+ ' + montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGanancias(getOperaciones())))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGastos(getOperaciones())))}</span></td>
                    <td class="text-end"><span class="text-success">${'+ ' + (montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGanancias(getOperaciones()))) - montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGastos(getOperaciones()))))}</span></td>
                </tr>`
            } else {
                document.getElementById("reportes-totales-categoria").innerHTML +=
                    `<tr>
                    <td>${getCategorias()[i]}</td>
                    <td class="text-end"><span class="text-success">${'+ ' + montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGanancias(getOperaciones())))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGastos(getOperaciones())))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + (montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGanancias(getOperaciones()))) - montoOperaciones(filtrarOperacionesCategoria(getCategorias()[i], getGastos(getOperaciones()))))}</span></td>
                </tr>`
            }
        }
    }
    document.getElementById("reportes-totales-mes").innerHTML = ``
    document.getElementById("reportes-totales-mes").innerHTML +=
        `<tr>
            <th class="col-3">Mes</th>
            <th class="col-3 text-end">Ganancias</th>
            <th class="col-3 text-end">Gastos</th>
            <th class="col-3 text-end">Balance</th>
        </tr>`
    let anios = getAnios(getOperaciones())
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    for (let i = 0; i < anios.length; i++) {
        for (let j = 0; j < meses.length; j++) {
            let operaciones = operacionesPorMes(meses[j], operacionesPorAnio(anios[i], getOperaciones()))
            if (operaciones.length > 0) {
                if (montoOperaciones(operaciones) >= 0) {
                    document.getElementById("reportes-totales-mes").innerHTML +=
                        `<tr>
                    <td>${anios[i] + '-' + meses[j]}</td>
                    <td class="text-end"><span class="text-success">${'+ ' + montoOperaciones(getGanancias(operaciones))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + montoOperaciones(getGastos(operaciones))}</span></td>
                    <td class="text-end"><span class="text-success">${'+ ' + (montoOperaciones(getGanancias(operaciones)) - montoOperaciones(getGastos(operaciones)))}</span></td>
                </tr>`
                } else {
                    `<tr>
                    <td>${anios[i] + '-' + meses[j]}</td>
                    <td class="text-end"><span class="text-success">${'+ ' + montoOperaciones(getGanancias(operaciones))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + montoOperaciones(getGastos(operaciones))}</span></td>
                    <td class="text-end"><span class="text-danger">${'- ' + (montoOperaciones(getGanancias(operaciones)) - montoOperaciones(getGastos(operaciones)))}</span></td>
                </tr>`
                }
            }
        }
    }
}

// FUNCIONES CRUD

// Categorias

function getCategorias() {
    return JSON.parse(localStorage.getItem("categorias"))
}

function newCategoria() {
    let categoria = document.getElementById("agregar-categoria").value
    if (categoria != '') {
        let categorias = JSON.parse(localStorage.getItem("categorias")).concat([categoria])
        localStorage.removeItem('categorias')
        localStorage.setItem('categorias', JSON.stringify(categorias))
        populateCategorias()
    }
}

function editarCategoria(index) {
    let categorias = JSON.parse(localStorage.getItem("categorias"))
    categorias[index] = document.getElementById("input-editar-categoria").value
    localStorage.removeItem('categorias')
    localStorage.setItem('categorias', JSON.stringify(categorias))
    populateCategorias()
    showCategorias()
}

function eliminarCategoria(index) {
    let categorias = JSON.parse(localStorage.getItem("categorias"))
    let categoria = categorias[index]
    let operaciones = filtrarOperacionesCategoria(categoria, getOperaciones())
    for (let i = 0; i < operaciones.length; i++) {
        deleteOperacion(operaciones[i].id)        
    }
    categorias.splice(index, 1)
    localStorage.removeItem('categorias')
    localStorage.setItem('categorias', JSON.stringify(categorias))
    populateCategorias()
}

// Operaciones

function getOperaciones() {
    return JSON.parse(localStorage.getItem("operaciones"))
}

function newOperacion() {
    let count = localStorage.getItem("contador")
    let operacion = {
        id: count,
        descripcion: document.getElementById('nueva-operacion-descripcion').value,
        monto: document.getElementById("nueva-operacion-monto").value,
        tipo: getValueFromSelect("nueva-operacion-tipo"),
        categoria: getValueFromSelect("nueva-operacion-categoria"),
        fecha: document.getElementById("nueva-operacion-fecha").value
    }
    let operaciones = getOperaciones().concat([operacion])
    localStorage.setItem('operaciones', JSON.stringify(operaciones))
    localStorage.setItem('contador', parseInt(count) + 1)
    populateOperaciones()
    showBalance()
}

function getOperacionById(id) {
    let operaciones = getOperaciones()
    for (let i = 0; i < operaciones.length; i++) {
        if (operaciones[i].id == id) {
            return operaciones[i]
        }
    }
}

function editOperacion(id) {
    let operacion = getOperacionById(id)
    let descripcion = document.getElementById('editar-operacion-descripcion').value
    let monto = document.getElementById("editar-operacion-monto").value
    let tipo = getValueFromSelect("editar-operacion-tipo")
    let categoria = getValueFromSelect("editar-operacion-categoria")
    let fecha = document.getElementById("editar-operacion-fecha").value
    if (descripcion != '') {
        operacion.descripcion = descripcion
    }
    if (monto != '') {
        operacion.monto = monto
    }
    if (tipo != '') {
        operacion.tipo = tipo
    }
    if (categoria != '') {
        operacion.categoria = categoria
    }
    if (fecha != '') {
        operacion.fecha = fecha
    }
    let operaciones = getOperaciones()
    operaciones.splice(operaciones.indexOf(operacion), 1)
    localStorage.removeItem('operaciones')
    localStorage.setItem('operaciones', JSON.stringify(operaciones.concat([operacion])))
    populateOperaciones()
    showBalance()
}

function deleteOperacion(id) {
    let operaciones = getOperaciones()
    operaciones.splice(operaciones.indexOf(getOperacionById(id)), 1)
    localStorage.removeItem('operaciones')
    localStorage.setItem('operaciones', JSON.stringify(operaciones))
    populateOperaciones()
}

// Mostrar Filtrado

function changeFilter(operaciones) {
    let tipo = getValueFromSelect("filtros-tipo")
    let categoria = getValueFromSelect("filtros-categoria")
    let fecha = document.getElementById("filtros-fecha").value
    if (getValueFromSelect("filtros-orden") == 'Más reciente') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesFechaMenosReciente(operaciones).reverse()
                    )
                )
            )
        )
    }
    if (getValueFromSelect("filtros-orden") == 'Menos reciente') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesFechaMenosReciente(operaciones)
                    )
                )
            )
        )
    }
    if (getValueFromSelect("filtros-orden") == 'Mayor monto') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesMenorMonto(operaciones).reverse()
                    )
                )
            )
        )
    }
    if (getValueFromSelect("filtros-orden") == 'Menor monto') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesMenorMonto(operaciones)
                    )
                )
            )
        )
    }
    if (getValueFromSelect("filtros-orden") == 'A/Z') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesAZ(operaciones)
                    )
                )
            )
        )
    }
    if (getValueFromSelect("filtros-orden") == 'Z/A') {
        renderOperaciones(
            filtrarOperacionesTipo(tipo,
                filtrarOperacionesCategoria(categoria,
                    filtrarOperacionesSinceDate(fecha,
                        sortOperacionesAZ(operaciones).reverse()
                    )
                )
            )
        )
    }
}

// filtros funciones

function filtrarOperacionesTipo(tipo, operaciones) {
    if (tipo !== 'Todos') {
        return operaciones.filter(operacion => operacion.tipo === tipo)
    }
    return operaciones
}

function filtrarOperacionesCategoria(categoria, operaciones) {
    if (categoria !== 'Todas') {
        return operaciones.filter(operacion => operacion.categoria === categoria)
    }
    return operaciones
}

function filtrarOperacionesSinceDate(fecha, operaciones) {
    return operaciones.filter(operacion => operacion.fecha > fecha)
}

function sortOperacionesFechaMenosReciente(operaciones) {
    return operaciones.sort((a, b) => a.fecha.localeCompare(b.fecha))
}

function sortOperacionesMenorMonto(operaciones) {
    return operaciones.sort(function (a, b) {
        a.monto = parseFloat(a.monto)
        b.monto = parseFloat(b.monto)
        return a.monto - b.monto
    })
}

function sortOperacionesAZ(operaciones) {
    return operaciones.sort((a, b) => a.descripcion.localeCompare(b.descripcion))
}

// Funciones para Balance

function getGanancias(operaciones) {
    let ganancias = []
    for (let i = 0; i < operaciones.length; i++) {
        if (operaciones[i].tipo === 'Ganancia') {
            ganancias.push(operaciones[i])
        }
    }
    return ganancias
}

function getGastos(operaciones) {
    let gastos = []
    for (let i = 0; i < operaciones.length; i++) {
        if (operaciones[i].tipo === 'Gasto') {
            gastos.push(operaciones[i])
        }
    }
    return gastos
}

function getGananciaDeOperacion(operacion) {
    if (operacion.tipo == 'Ganancia') {
        return parseFloat(operacion.monto)
    }
}

function getGastoDeOperacion(operacion) {
    if (operacion.tipo == 'Gasto') {
        return parseFloat(operacion.monto)
    }
}

// Reportes

function operacionMayorMonto(operaciones) {
    let mayorMonto = 0
    let operacionConMayorMonto
    for (let i = 0; i < operaciones.length; i++) {
        if (parseFloat(operaciones[i].monto) > mayorMonto) {
            operacionConMayorMonto = operaciones[i]
            mayorMonto = operaciones[i].monto
        }
    }
    return operacionConMayorMonto
}

function categoriaMayorGanancia() {
    let operaciones = getOperaciones()
    let categorias = getCategorias()
    let categoriaConMayorGanancia = ''
    let mayorGanancia = 0
    for (let i = 0; i < categorias.length; i++) {
        if (gananciaPorCategoria(categorias[i], operaciones) > mayorGanancia) {
            mayorGanancia = gananciaPorCategoria(categorias[i], operaciones)
            categoriaConMayorGanancia = categorias[i]
        }
    }
    return {
        categoriaConMayorGanancia: categoriaConMayorGanancia,
        mayorGanancia: mayorGanancia
    }
}

function categoriaMayorGasto() {
    let operaciones = getOperaciones()
    let categorias = getCategorias()
    let categoriaConMayorGasto = ''
    let mayorGasto = 0
    for (let i = 0; i < categorias.length; i++) {
        if (gastoPorCategoria(categorias[i], operaciones) > mayorGasto) {
            mayorGasto = gastoPorCategoria(categorias[i], operaciones)
            categoriaConMayorGasto = categorias[i]
        }
    }
    return {
        categoriaConMayorGasto: categoriaConMayorGasto,
        mayorGasto: mayorGasto
    }
}

function categoriaMayorBalance() {
    let operaciones = getOperaciones()
    let categorias = getCategorias()
    let balance = 0
    let categoriaConMayorBalance = ''
    for (let i = 0; i < categorias.length; i++) {
        if (gananciaPorCategoria(categorias[i], getGanancias(operaciones)) - gastoPorCategoria(categorias[i], getGastos(operaciones)) > balance) {
            balance = gananciaPorCategoria(categorias[i], getGanancias(operaciones)) - gastoPorCategoria(categorias[i], getGastos(operaciones))
            categoriaConMayorBalance = categorias[i]
        }
    }
    return {
        categoriaConMayorBalance: categoriaConMayorBalance,
        balance: balance
    }
}

function getMesOperacion(operacion) {
    return operacion.fecha.split('-')[1]
}

function getAnioOperacion(operacion) {
    return operacion.fecha.split('-')[0]
}

function getFechaOperacion(operacion) {
    return operacion.fecha.split('-')[0] + '-' + operacion.fecha.split('-')[1]
}

function getAnios(operaciones) {
    operaciones = sortOperacionesFechaMenosReciente(operaciones)
    let primerAnio = parseInt(getAnioOperacion(operaciones[0]))
    let ultimoAnio = parseInt(getAnioOperacion(operaciones[operaciones.length - 1]))
    let anios = []
    for (let i = 0; primerAnio + i <= ultimoAnio; i++) {
        anios.push(primerAnio + i)
    }
    return anios
}

function operacionesPorAnio(anio, operaciones) {
    let operacionesDelAnio = []
    for (let i = 0; i < operaciones.length; i++) {
        if (getAnioOperacion(operaciones[i]) == anio) {
            operacionesDelAnio.push(operaciones[i])
        }
    }
    return operacionesDelAnio
}

function operacionesPorMes(mes, operaciones) {
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    let operacionesDelMes = []
    for (let i = 0; i < operaciones.length; i++) {
        if (meses[parseInt(getMesOperacion(operaciones[i])) - 1] == mes) {
            operacionesDelMes.push(operaciones[i])
        }
    }
    return operacionesDelMes
}

function mesMayorGanancia() {
    let mesConMayorGanancia = ''
    let mayorGanancia = 0
    let anios = getAnios(getOperaciones())
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    for (let i = 0; i < anios.length; i++) {
        for (let j = 0; j < meses.length; j++) {
            let operaciones = operacionesPorMes(meses[j], operacionesPorAnio(anios[i], getGanancias(getOperaciones())))
            if (operaciones.length > 0) {
                if (montoOperaciones(operaciones) > mayorGanancia) {
                    mayorGanancia = montoOperaciones(operaciones)
                    mesConMayorGanancia = meses[j]
                }
            }
        }
    }
    return {
        mesConMayorGanancia: mesConMayorGanancia,
        mayorGanancia: mayorGanancia
    }
}

function mesMayorGasto() {
    let mesConMayorGasto = ''
    let mayorGasto = 0
    let anios = getAnios(getOperaciones())
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    for (let i = 0; i < anios.length; i++) {
        for (let j = 0; j < meses.length; j++) {
            let operaciones = operacionesPorMes(meses[j], operacionesPorAnio(anios[i], getGastos(getOperaciones())))
            if (operaciones.length > 0) {
                if (montoOperaciones(operaciones) > mayorGasto) {
                    mayorGasto = montoOperaciones(operaciones)
                    mesConMayorGasto = meses[j]
                }
            }
        }
    }
    return {
        mesConMayorGasto: mesConMayorGasto,
        mayorGasto: mayorGasto
    }
}

function gananciaPorCategoria(categoria, operaciones) {
    return montoOperaciones(filtrarOperacionesCategoria(categoria, getGanancias(operaciones)))
}

function gastoPorCategoria(categoria, operaciones) {
    return montoOperaciones(filtrarOperacionesCategoria(categoria, getGastos(operaciones)))
}

function montoOperaciones(operaciones) {
    let monto = 0
    for (let i = 0; i < operaciones.length; i++) {
        monto += parseFloat(operaciones[i].monto)
    }
    return monto
}

// UTILS

function getValueFromSelect(id) {
    let select = document.getElementById(id);
    let value = select.options[select.selectedIndex].text
    return value
}