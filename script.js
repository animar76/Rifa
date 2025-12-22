// 1. CONFIGURACIÓN
const SUPABASE_URL = "https://ssqgqkvttrwipvhltvxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcWdxa3Z0dHJ3aXB2aGx0dnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNTE0OTAsImV4cCI6MjA4MTkyNzQ5MH0.IdpquKkTIWf-4eTcskCKVCWQdpgPImJmJhcG8ZXDwro";
const CLAVE_ADMIN = "25767.Ctes@26";

let numElegido = null;

// 2. FUNCIÓN PRINCIPAL DE ARRANQUE
window.onload = function() {
    console.log("Iniciando aplicación...");
    
    // Paso A: Generar la grilla (Si esto falla, el error saldrá en consola)
    try {
        generarGrilla();
    } catch (e) {
        console.error("Error crítico al generar grilla:", e);
    }

    // Paso B: Cargar datos de la base de datos
    cargarVendidos();

    // Paso C: Iniciar efectos (dentro de try/catch para que no rompan lo demás)
    try { iniciarNieve(); } catch (e) {}
    try { animarSanta(); } catch (e) {}
};

// 3. GENERAR LA GRILLA (Independiente de la base de datos)
function generarGrilla() {
    const grilla = document.getElementById('grilla');
    if (!grilla) {
        console.error("No se encontró el elemento con ID 'grilla' en el HTML.");
        return;
    }
    
    grilla.innerHTML = ""; // Limpiar
    for (let i = 1; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        div.id = `num-${i}`; // ID simple: num-1, num-2...
        div.textContent = i.toString().padStart(2, '0');
        div.onclick = function() { abrirRegistro(i); };
        grilla.appendChild(div);
    }
    console.log("Grilla generada con éxito.");
}

// 4. CARGAR VENDIDOS DESDE SUPABASE
async function cargarVendidos() {
    const statusText = document.getElementById('contador-ventas');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rifa?select=numero`, {
            method: 'GET',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error en la respuesta de Supabase");

        const datos = await response.json();
        console.log("Datos recibidos:", datos);

        datos.forEach(item => {
            const el = document.getElementById(`num-${item.numero}`);
            if (el) {
                el.classList.add('vendido');
                el.onclick = null;
            }
        });

        if (statusText) statusText.innerText = `${datos.length}/100 Números vendidos`;
    } catch (e) {
        console.error("Error al conectar con Supabase:", e);
        if (statusText) statusText.innerText = "Error al conectar. Verifica tu clave API.";
    }
}

// 5. GUARDAR COMPRA
async function confirmarCompra() {
    const btn = document.getElementById('btn-confirmar-final');
    const datos = {
        numero: parseInt(numElegido),
        nombre: document.getElementById('nombre').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };

    if (!datos.nombre || !datos.dni) {
        alert("Completa los datos obligatorios.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "REGISTRANDO...";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rifa`, {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Reserva exitosa.");
            location.reload();
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
            btn.disabled = false;
        }
    } catch (e) {
        alert("Error de red.");
        btn.disabled = false;
    }
}

// 6. PANEL ADMIN
async function accesoAdmin() {
    const pass = prompt("Clave:");
    if (pass !== CLAVE_ADMIN) return;
    const num = prompt("Número a liberar:");
    if (!num) return;

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa?numero=eq.${parseInt(num)}`, {
            method: 'DELETE',
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) { alert("Liberado."); location.reload(); }
    } catch (e) { alert("Error."); }
}

// 7. FUNCIONES VISUALES
function abrirRegistro(n) {
    numElegido = n;
    document.getElementById('txtNumeroSeleccionado').innerText = `NÚMERO ELEGIDO: ${n}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    try { document.getElementById('sonido-campana').play(); } catch(e) {}
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function validarCheck() {
    document.getElementById('btn-confirmar-final').disabled = !document.getElementById('acepto-terminos').checked;
}

function animarSanta() {
    const santa = document.getElementById('papa-noel');
    if (!santa) return;
    let i = 0;
    setInterval(() => {
        const nums = document.querySelectorAll('.numero:not(.vendido)');
        if (nums.length > 0) {
            const target = nums[i % nums.length];
            const rect = target.getBoundingClientRect();
            const wrapper = document.querySelector('.grilla-wrapper').getBoundingClientRect();
            santa.style.left = (rect.left - wrapper.left) + "px";
            santa.style.top = (rect.top - wrapper.top - 25) + "px";
            i++;
        }
    }, 1200);
}

function iniciarNieve() {
    const container = document.getElementById('snow');
    if (!container) return;
    setInterval(() => {
        const f = document.createElement('div');
        f.innerHTML = "❄";
        f.style.position = "absolute";
        f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-20px";
        f.style.pointerEvents = "none";
        container.appendChild(f);
        f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100vh)' }], { duration: 5000 });
        setTimeout(() => f.remove(), 5000);
    }, 400);
}

function mostrarTextoTerminos() {
    alert(
`Términos y Condiciones: Rifa Notebook Banghó Best Pro T5
i7 8gb RAM 480GB SSD

1. OBJETO: Sorteo de Notebook Banghó i7 + Auriculares BT.
2. VALOR: $15.000 por número.
3. CONDICIÓN: El sorteo se realiza al vender los 100 números.
4. SORTEO: Vivo por App Sorteos (se avisará 48hs antes).
5. ENTREGA: Corrientes Capital (interior envío a cargo de organizador).`
    );
}