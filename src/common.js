const { Client } = require('pg');
const moment = require("moment");
const Hashids = require("hashids");

function PrintLogo() {
  console.log(' /////////////////////////////////////////////////////////////////////////  ');
  console.log('    _____                      _            _____                _          ');
  console.log('   |_   _|  _ __    __ _    __| |   ___    |_   _|   ___  ___   | |__       ');
  console.log('     | |   |  __|  / _` |  / _` |  / _ \     | |    / _ \  / __|  |  _ \    ');
  console.log('     | |   | |    | (_| | | (_| | |  __/    | |   |  __/ | (__  | | | |     ');
  console.log('     |_|   |_|      \__,_|   \__,_|   \___|    |_|     \___|  \___|  |_| |_|');
  console.log('                                                                            ');
  console.log('                                       D A T A    I N T E G R A T I O N     ');
  console.log('                                                                            ');
  console.log(' /////////////////////////////////////////////////////////////////////////  ');
  console.log('                                                                            ');
}

async function execSQL(nConnection, cQuery, aParam) {
    let responseSQL = null;
    let lProducao = true;
    let cTipoDataBase = '';
    let clientMYSQL = null;
    let clientPG = null;

    if ( ( nConnection == 1) || (nConnection ==2) ) {
        cTipoDataBase = 'POSTGRE';
    }

    let cHost = 'localhost';    
    let nPort = 5432;
    let cDatabase = 'gtradedb';
    let cUser = 'postgres';
    let cPassword = 'pop@2021';

    if (nConnection == 1) {  // SSBI_POP (POSTGRE)

        if (lProducao == true) {
            // console.log('parametros de producao');
            cHost = '34.151.251.73';    
            nPort = 5432;
            cDatabase = 'SSBI_POP';
            cUser = 'Denis';
            cPassword = '*YHc(XnZu,)I<m)D';    
        }

    }
    else if (nConnection == 2) { // Lactalis (POSTGRE)

        if (lProducao == true) {
            // console.log('parametros de producao');
            cHost = '34.151.251.73';    
            nPort = 5432;
            cDatabase = 'lactalis';
            cUser = 'Denis';
            cPassword = '*YHc(XnZu,)I<m)D';    
        }
    }

    if (cTipoDataBase == 'POSTGRE')  {
        clientPG = new Client({
            host: cHost,
            port: nPort,
            database: cDatabase,
            user: cUser,
            password: cPassword,
            });

        await clientPG.connect();    

    }

    try {
        if (cTipoDataBase == 'POSTGRE') {
            responseSQL = await clientPG.query(cQuery, aParam);
        }
    }
    catch (err) {
        console.log(moment().format('DD/MM/YYYY HH:mm:ss') + ' Query => ' + cQuery + '\n');
        console.log(moment().format('DD/MM/YYYY HH:mm:ss') + ' Params => ' + aParam);
        console.log(moment().format('DD/MM/YYYY HH:mm:ss') + ' ' + err);
        if (cTipoDataBase == 'POSTGRE') {
            await clientPG.end();
        }
        process.exit();
    }

    if (cTipoDataBase == 'POSTGRE') {
        await clientPG.end()
    }
    return responseSQL;
    
}


function delay(ms) {
    const date = Date.now();
    let currentDate = null;
 
    while (currentDate - date < ms) {
        currentDate = Date.now();
    } ;
}

function strzero( nNumero, nTamanho ) {
    let cStringRetorno = nNumero.toString();

    cStringRetorno = cStringRetorno.padStart( nTamanho, '0');

    return cStringRetorno;
}


module.exports = { PrintLogo, execSQL, delay, strzero };