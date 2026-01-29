const db = require('../config/database');

const updateAuditQuery = `
  UPDATE mce.tb_auditoria SET
    id_auditor = $2, 
    id_status_auditoria = $3, 
    data_atualizacao_status = $4
  WHERE id_auditoria = $1
`;

const insertStatusChangeQuery = `
  INSERT INTO mce.tb_mudanca_status_auditoria
  (id_auditoria, usuario_id, status_novo, status_atual, created_at)
  VALUES ($1, $2, $3, $4, $5)
`;

const currentAuditStatusQuery = `
  SELECT id_status_auditoria 
  FROM mce.tb_auditoria
  WHERE id_auditoria = $1
`;

const UpdateAuditoriaAndRegisterStatusChanges = async (auditId, userId, statusId) => {
  const statusAtual = await db.query(currentAuditStatusQuery, [auditId])
    .then(({ rows }) => rows[0].id_status_auditoria);

  if (statusAtual === statusId) return;

  await Promise.all([
    db.query(updateAuditQuery, [auditId, statusId === 1 ? null : userId, statusId, new Date()]),
    db.query(insertStatusChangeQuery, [auditId, userId, statusId, statusAtual, new Date()]),
  ]);
};

module.exports = UpdateAuditoriaAndRegisterStatusChanges;
