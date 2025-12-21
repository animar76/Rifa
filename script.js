// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "db.ssqgqkvttrwipvhltvxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcWdxa3Z0dHJ3aXB2aGx0dnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNTE0OTAsImV4cCI6MjA4MTkyNzQ5MH0.IdpquKkTIWf-4eTcskCKVCWQdpgPImJmJhcG8ZXDwro";
const CLAVE_ADMIN = "25767.Ctes@26";

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

// LEER DE LA BASE DE DATOS
async function cargarVendidos() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa?select=numero`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const datos = await res.json();
        datos.forEach(item => marcarComoVendido(item.numero));
        document.getElementById('contador-ventas').innerText = `${datos.length}/100 Vendidos`;
    } catch (e) { console.error("Error BD:", e); }
}

function marcarComoVendido(n) {
    const el = document.getElementById(`num-${n}`);
    if(el) { el.classList.add('vendido'); el.onclick = null; }
}

// INSERTAR EN LA BASE DE DATOS
async function confirmarCompra() {
    const btn = document.getElementById('btn-confirmar-final');
    const datos = {
        numero: numElegido,
        nombre: document.getElementById('nombre').value,
        dni: document.getElementById('dni').value,
        celular: document.getElementById('celular').value,
        direccion: document.getElementById('direccion').value
    };

    if(!datos.nombre || !datos.dni) return alert("Completa los datos");

    btn.disabled = true;
    btn.innerText = "PROCESANDO...";

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa`, {
            method: 'POST',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(datos)
        });

        if(res.ok) {
            alert("¡Reserva guardada en Base de Datos!");
            location.reload();
        } else { throw new Error(); }
    } catch(e) {
        alert("Error al guardar. Quizás el número ya se vendió.");
        btn.disabled = false;
    }
}

// FUNCIÓN DE ADMINISTRADOR: LIBERAR NÚMERO
async function accesoAdmin() {
    const pass = prompt("Clave Admin:");
    if(pass !== CLAVE_ADMIN) return alert("Incorrecta");

    const numParaLiberar = prompt("Número a liberar (1-100):");
    if(!numParaLiberar) return;

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa?numero=eq.${numParaLiberar}`, {
            method: 'DELETE',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}` 
            }
        });
        if(res.ok) {
            alert("Número liberado con éxito");
            location.reload();
        }
    } catch(e) { alert("Error al borrar"); }
}

// --- (Mantener funciones de cerrarModal, animarSanta, iniciarNieve, mostrarTextoTerminos igual que antes) ---
function abrirRegistro(n) {
    const audio = document.getElementById('sonido-campana');
    audio.currentTime = 0; audio.play();
    numElegido = n;
    document.getElementById('txtNumeroSeleccionado').innerText = `NÚMERO ELEGIDO: ${n}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function validarCheck() {
    const check = document.getElementById('acepto-terminos');
    document.getElementById('btn-confirmar-final').disabled = !check.checked;
}

function animarSanta() {
    const santa = document.getElementById('papa-noel');
    let i = 0;
    setInterval(() => {
        const nums = document.querySelectorAll('.numero:not(.vendido)');
        if(nums.length > 0) {
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
    setInterval(() => {
        const f = document.createElement('div');
        f.innerHTML = "❄"; f.style.position = "absolute"; f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw"; f.style.top = "-20px";
        container.appendChild(f);
        f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100vh)' }], { duration: 5000 });
        setTimeout(() => f.remove(), 5000);
    }, 300);
}

function mostrarTextoTerminos() {
    alert("Términos: Notebook Banghó i7. Sorteo al vender los 100 números. Precio $15.000.");
}