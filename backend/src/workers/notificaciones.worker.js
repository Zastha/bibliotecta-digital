const cron = require('node-cron')
const axios = require('axios')
const PrestamoModel = require('../models/prestamo.model')

const calcularDiasRestantes = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - hoy;
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return diasRestantes;
}

const calcularPrioridad = (diasRestantes) => 'alta';

const enviarRecordatorio = async(prestamo, diasRestantes) =>{
    try{
        await axios.post(process.env.NOTIFICACIONES_RECORDATORIOS_URL, {
            userId: prestamo.usuario_id,
            tituloLibro: prestamo.libro_titulo,
            autorLibro: prestamo.libro_autor || 'Desconocido',
            fechaVencimiento: prestamo.fecha_vencimiento,
            diasRestantes,
            prioridad: calcularPrioridad(diasRestantes)
        });
        console.log(`Notificacion enviada a ${prestamo.usuario_id} - ${prestamo.libro_titulo}`);
    }catch(error){
        console.log(`Error al enviar notificacion a ${prestamo.usuario_id} - ${prestamo.libro_titulo}: ${error.message}`);
    }
};

const verificarPrestamos = async () =>{
    console.log('Verificando Prestamos a vencer');
    try{
        const prestamos = await PrestamoModel.getProximosAVencer(3);
        if(prestamos.length === 0){
            console.log('No hay préstamos a vencer');
            return;
        }

        for(const prestamo of prestamos){
            const diasRestantes = calcularDiasRestantes(prestamo.fecha_vencimiento);
            await enviarRecordatorio(prestamo, diasRestantes);
        }
    }catch(error){
        console.log(`Error al verificar préstamos a vencer: ${error.message}`);
    }
}

const iniciarWorker = () => {
    console.log('Worker de notificaciones iniciado');

    //cron.schedule('*/10 * * * * *', verificarPrestamos); //<- para pruebas cada 10 segundos
    cron.schedule('0 8 * * * *', verificarPrestamos); // <- para pruebas cada dia a las 8am
}

module.exports = {iniciarWorker};