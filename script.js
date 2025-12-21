const URL_GOOGLE = "TU_URL_DE_APPS_SCRIPT_AQUIhttps://script.google.com/macros/s/AKfycbzoakIRy8AXz1b3gVm0zrRQXJWl0F2oXwhM6qdMYBJm7Ms3vJsIaeTXMcqmlMOSXF_dCA/exec"; 
const CLAVE_ADMIN = "25767.Ctes.76"; 

let numElegido = null;

document.addEventListener('DOMContentLoaded', () => {
    const grilla = document.getElementById('grilla');
    for (let i = 1; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        div.id = `num-${i}`;
        div.textContent = i.toString().padStart(2, '0');
        div.onclick = () => abrirRegistro(i);
        grilla.appendChild(div);
    }
    iniciarNieve();
    animarSanta();
    cargarVendidos();
});

async function cargarVendidos() {
    try {
        const res = await fetch(URL_GOOGLE);
        const ocupados = await res.json();
        ocupados.forEach(n => {
            const el = document.getElementById(`num-${n}`);
            if(el) { el.classList.add('vendido'); el.onclick = null; }
        });
        document.getElementById('contador-ventas').innerText = `${ocupados.length}/100 Vendidos`;
    } catch(e) { document.getElementById('contador-ventas').innerText = "Disponibilidad: 100 Números"; }
}

function abrirRegistro(n) {
    const audio = document.getElementById('sonido-campana');
    audio.currentTime = 0; audio.play();
    numElegido = n;
    document.getElementById('txtNumeroSeleccionado').innerText = `NÚMERO ELEGIDO: ${n}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function validarCheck() {
    const check = document.getElementById('acepto-terminos');
    document.getElementById('btn-confirmar-final').disabled = !check.checked;
}

function mostrarTextoTerminos() {
    alert(
`Términos y Condiciones: Rifa Notebook Banghó Best Pro T5
i7 8gb RAM 480GB SSD

1. OBJETO: Notebook Banghó i7 15" + Auriculares BT de Regalo.
2. VALOR: $15.000 por número. Confirmación tras pago y registro.
3. VENTA TOTAL: Sorteo sujeto a la venta de los 100 números. La fecha se fijará al completar el 100%.
4. NOTIFICACIÓN: Vía Grupo de WhatsApp con 48hs de antelación.
5. MECÁNICA: App Sorteos en vivo. Ganador titular y suplente.
6. ENTREGA: Coordinar en Corrientes Capital. Envío a cargo de organizador si es al interior. Presentar DNI.
7. CANCELACIÓN: Devolución del 100% en 5 días hábiles si se cancela.`
    );
}

async function confirmarCompra() {
    const datos = {
        Numero: numElegido,
        Nombre: document.getElementById('nombre').value,
        DNI: document.getElementById('dni').value,
        Celular: document.getElementById('celular').value,
        Direccion: document.getElementById('direccion').value,
        Fecha: new Date().toLocaleString()
    };
    if(!datos.Nombre || !datos.DNI || !datos.Celular) return alert("Completa los campos.");

    try {
        await fetch(URL_GOOGLE, { method: 'POST', mode: 'no-cors', body: JSON.stringify(datos) });
        alert("¡Reserva exitosa! Envíe el comprobante por WhatsApp.");
        location.reload();
    } catch(e) { alert("Error al registrar."); }
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function animarSanta() {
    const santa = document.getElementById('papa-noel');
    let i = 0;
    setInterval(() => {
        const nums = document.querySelectorAll('.numero');
        const rect = nums[i].getBoundingClientRect();
        const wrapper = document.querySelector('.grilla-wrapper').getBoundingClientRect();
        santa.style.left = (rect.left - wrapper.left) + "px";
        santa.style.top = (rect.top - wrapper.top - 25) + "px";
        i = (i + 1) % 100;
    }, 1200);
}

function iniciarNieve() {
    const container = document.getElementById('snow');
    setInterval(() => {
        const f = document.createElement('div');
        f.innerHTML = "❄"; f.style.position = "absolute"; f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw"; f.style.top = "-20px";
        container.appendChild(f);
        f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100vh)' }], { duration: 5000 });
        setTimeout(() => f.remove(), 5000);
    }, 300);
}

function accesoAdmin() {
    if(prompt("Clave:") === CLAVE_ADMIN) alert("Acceso correcto.");
}