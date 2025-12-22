// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://ssqgqkvttrwipvhltvxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcWdxa3Z0dHJ3aXB2aGx0dnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNTE0OTAsImV4cCI6MjA4MTkyNzQ5MH0.IdpquKkTIWf-4eTcskCKVCWQdpgPImJmJhcG8ZXDwro";
const CLAVE_ADMIN = "25767.Ctes@26";

let numElegido = null;

// CARGAR NÚMEROS AL INICIAR
async function cargarVendidos() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa?select=numero`, {
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}` 
            }
        });
        
        if (!res.ok) throw new Error("Error en la respuesta de la base de datos");
        
        const datos = await res.json();
        
        datos.forEach(item => {
            const el = document.getElementById(`num-${item.numero}`);
            if(el) {
                el.classList.add('vendido');
                el.onclick = null;
            }
        });
        document.getElementById('contador-ventas').innerText = `${datos.length}/100 Vendidos`;
    } catch (e) {
        console.error("Error cargando datos:", e);
    }
}

// GUARDAR EN BASE DE DATOS
async function confirmarCompra() {
    const btn = document.getElementById('btn-confirmar-final');
    
    // Aseguramos que los nombres coincidan EXACTAMENTE con el SQL
    const datos = {
        numero: parseInt(numElegido),
        nombre: document.getElementById('nombre').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };

    if(!datos.nombre || !datos.dni || !datos.celular) {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "CONECTANDO...";

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
            alert("¡Número " + numElegido + " reservado con éxito!");
            location.reload();
        } else {
            const errorInfo = await res.json();
            alert("Error de Base de Datos: " + (errorInfo.message || "No autorizado"));
            console.error(errorInfo);
            btn.disabled = false;
        }
    } catch(e) {
        alert("Error de conexión: Verifica tu URL de Supabase.");
        btn.disabled = false;
    }
}