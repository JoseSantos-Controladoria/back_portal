const db = require('../config/database.js');

async function getNextLogID() {
  const query = `SELECT (COALESCE(MAX(id), 0) + 1) as id FROM portalbi.tb_report_log_access`;
  const res = await db.query(query);
  return parseInt(res.rows[0].id);
}

exports.createLog = async (req, res) => {
  const { userid, reportid, action } = req.body;

  if (!userid || !action) {
    return res.status(400).send({ status: 'ERROR', error_message: 'Dados incompletos.' });
  }

  try {
    let groupId = null;

    // 1. Descobrir o Grupo (lógica existente)
    if (reportid) {
      const findGroupQuery = `
        SELECT ug.group_id 
        FROM portalbi.tb_user_group ug
        INNER JOIN portalbi.tb_report_group rg ON ug.group_id = rg.group_id
        WHERE ug.user_id = $1 
          AND rg.report_id = $2
          AND ug.active = true
        LIMIT 1
      `;
      const groupRes = await db.query(findGroupQuery, [userid, reportid]);
      if (groupRes.rowCount > 0) {
        groupId = groupRes.rows[0].group_id;
      }
    }

    const nextId = await getNextLogID();

    const insertQuery = `
      INSERT INTO portalbi.tb_report_log_access 
      (id, user_id, report_id, group_id, "action", created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;

    await db.query(insertQuery, [nextId, userid, reportid || null, groupId, action]);
    
    res.status(201).send({ status: 'SUCCESS' });

  } catch (error) {
    console.error("Erro ao criar log:", error);
    res.status(500).send({ 
      status: 'ERROR', 
      error_message: 'Falha ao registrar log.',
      detail: error.message 
    });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const query = `
      SELECT 
        l.id,
        l.created_at,
        l.action,
        u.name as user_name,
        u.email as user_email,
        r.title as report_name,
        g.name as group_name
      FROM portalbi.tb_report_log_access l
      INNER JOIN portalbi.tb_user u ON l.user_id = u.id
      LEFT JOIN portalbi.tb_report r ON l.report_id = r.id
      LEFT JOIN portalbi.tb_group g  ON l.group_id = g.id
      ORDER BY l.created_at DESC
      LIMIT 500
    `;

    const response = await db.query(query);
    res.status(200).send({ status: 'SUCCESS', items: response.rows });

  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    res.status(500).send({ status: 'ERROR', error_message: 'Falha ao buscar logs.' });
  }
};