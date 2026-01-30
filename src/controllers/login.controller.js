const db = require('../config/database.js');
const params = require('../config/params.js');
const crypto = require('crypto');

// Função auxiliar para pegar o próximo ID (Necessário pois a tabela não é auto-incremento)
async function getNextID() {
  try {
    const cQuery = `select (coalesce(max(id),0)+1) as id from portalbi.tb_api_access_control`;
    const responseSQL = await db.query(cQuery);
    if (responseSQL.rowCount > 0) {
      return parseInt(responseSQL.rows[0].id);
    }
    return 1;
  } catch (e) {
    console.error("Erro ao gerar ID:", e);
    throw e;
  }
}

exports.login = async (req, res) => {
  let cQuery = ``;
  let request = req.body;
  let responseSQL = null;
  let loginOK = false;

  // 1. Validação Básica
  if ((request.username == undefined) || (request.password == undefined)) {
    return res.status(200).send({ status: 'ERROR', error_message: 'Usuário ou senha não informado!' });
  }

  // 2. Busca o Usuário
  cQuery = `select tb_user.id, tb_user.name, tb_user.email, tb_user.active, 
                   tb_user.password, tb_user.company_id, tb_company."name" company_name,
                   tb_user.profile_id, tb_profile."name" profile_name
            from portalbi.tb_user
            left join portalbi.tb_company on (tb_user.company_id = tb_company.id)
            left join portalbi.tb_profile on (tb_user.profile_id = tb_profile.id )
            where lower(tb_user.email) = $1 
              and tb_user.active = true`;

  responseSQL = await db.query(cQuery, [request.username.toLowerCase()]);

  let usuario = responseSQL.rows[0];
  let userGroups = [];

  if (responseSQL.rowCount > 0) {
    if (usuario.password == request.password) {
      loginOK = true;

      // 3. Busca Grupos
      cQuery = `select tb_group.id group_id, upper(tb_group.name) group_name
                from portalbi.tb_group
                join portalbi.tb_user_group on (tb_user_group.group_id = tb_group.id and tb_user_group.user_id = $1)
                order by tb_group.name`;
      
      const groupsResponse = await db.query(cQuery, [usuario.id]);
      userGroups = groupsResponse.rows;
    }
  }

  if (loginOK) {
    // 4. Gera o Token e Salva
    let sessionToken = crypto.randomBytes(32).toString('hex');

    try {
      const nextId = await getNextID();

      await db.query(
        `INSERT INTO portalbi.tb_api_access_control (id, api_token) VALUES ($1, $2)`,
        [nextId, sessionToken]
      );

    } catch (e) {
      console.error("Erro CRÍTICO ao salvar token:", e);
      return res.status(500).send({ status: 'ERROR', error_message: 'Erro interno de banco de dados ao logar.' });
    }

    res.status(200).send({
      status: 'SUCCESS',
      sessionToken: sessionToken,
      userdata: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        company_id: usuario.company_id,
        company_name: usuario.company_name,
        profile_id: usuario.profile_id,
        profile_name: usuario.profile_name
      },
      groups: userGroups
    });
  } else {
    res.status(200).send({ status: 'ERROR', error_message: 'Usuário ou senha inválido!' });
  }
};