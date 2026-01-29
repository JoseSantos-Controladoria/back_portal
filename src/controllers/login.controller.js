const db = require('../config/database.js');
const params = require('../config/params.js');
const crypto = require('crypto')

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

exports.login = async (req, res) => {

  let cQuery = ``;
  let request = req.body;
  let responseSQL = null;
  let loginOK = false;

  if ((request.username == undefined) || (request.password == undefined)) {
    res.status(200).send({ status: 'ERROR', error_message: 'Usuário ou senha não informado!'  })
  }
  else {

    cQuery = `select  tb_user.id, tb_user.name, tb_user.email, tb_user.active, tb_user.last_update,
                      tb_user.password, tb_user.company_id, tb_company."name" company_name,
                      tb_user.profile_id, tb_profile."name" profile_name
                  from portalbi.tb_user
                  left join portalbi.tb_company on (tb_user.company_id = tb_company.id)
                  left join portalbi.tb_profile on (tb_user.profile_id = tb_profile.id )
                  where lower(tb_user.email) = $1 
                    and tb_user.active = true`
    responseSQL = await db.query( cQuery, [request.username.toLowerCase()] );

    let usuario = responseSQL.rows[0];
    let sessionToken = crypto.randomBytes(32).toString('hex')
    let userProjects = [];
    let userFeatures = [];

    if (responseSQL.rowCount > 0 ) {
      if (usuario.password == request.password)  {
        loginOK = true;

        cQuery = `select	tb_group.id group_id, upper(tb_group.name) group_name
                  from portalbi.tb_group
                  join portalbi.tb_user_group on (tb_user_group.group_id = tb_group.id and tb_user_group.user_id = $1)
                  order by tb_group.name`;

        responseSQL = await db.query( cQuery, [usuario.id] );

        userGroups = responseSQL.rows;

      }
    }


    if (loginOK == true) {
      // res.status(200).send({ status: 'SUCCESS', sessionToken: sessionToken, userdata: 'teste' });

      res.status(200).send({ status: 'SUCCESS', sessionToken: sessionToken, userdata: { id: usuario.id, 
                                                                                        name: usuario.name,
                                                                                        email: usuario.email,
                                                                                        company_id: usuario.company_id,
                                                                                        company_name: usuario.company_name,
                                                                                        profile_id: usuario.profile_id,
                                                                                        profile_name: usuario.profile_name
                                                                                      },
                                                                            groups: userGroups });
    }
    else {
      res.status(200).send({ status: 'ERROR', error_message: 'Usuário ou senha inválido!'  })  
    }

  }

  return

};
