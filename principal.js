// import Rutas from './files/index';

import Cortar from './cortar/index';
import Rutas from './capturar/index'
import moldear from './moldear/index';
import uploadS3 from './upload/index';
import sendmail from './mail/mail';
async function initProcess() {
   
   try {
        const obtenerRuta = await Rutas()
        console.log(obtenerRuta)
        const datos = await Cortar(obtenerRuta)
        console.log(datos)
        
        const datos2 = await moldear()
        console.log(datos2)
        await setTimeout(() => {
             uploadS3()      
        }, 60000);
        await setTimeout(() => {
            const email = sendmail()
            console.log (email)
        },120000)
       

    } catch (error) {
        console.log(error)
    }

}
initProcess();