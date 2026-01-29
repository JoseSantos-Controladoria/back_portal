create or replace view hub.vw_pos as
select  tb_pos.id,
		tb_pos.name,
		tb_pos.trade_name,
		tb_pos.legal_name,
		tb_pos.cnpj,
		tb_pos.inscricao_estadual,
		tb_pos.id_chain,
		tb_pos_chain."name" as chain,
		tb_pos.id_brand,
		tb_pos_brand."name" as brand,	
		tb_pos.id_channel,
		tb_pos_channel."name" as channel,
		tb_pos.id_business_unit_type,
		tb_pos_business_unit_type."name" as business_unit_type,
		tb_pos.id_location_type,
		tb_pos_location_type."name" as location_type,
		tb_pos.id_shopping,
		tb_shopping."name" as shopping,
		tb_pos.id_address_type,
		tb_address_type.abbreviation as address_type,
		tb_pos.address,
		tb_pos.number,
		tb_pos.complement,
		tb_pos.neighborhood,
		tb_pos.postal_code,
		tb_pos.id_city,
		tb_city."name" as city,
		tb_city.id_state,
		tb_state.abbreviation as state,
		tb_state.name as state_fullname,
		tb_pos.phone,
		tb_pos.email,
		tb_pos.latitude,
		tb_pos.longitude,
		tb_pos.id_status,
		tb_pos_status."name" as status,
		tb_pos.cnpj_status,
		tb_pos.cnpj_status_date,
		tb_pos.id_user_last_update,
		tb_user."name" as user_last_update,
		tb_pos.created_at,
		tb_pos.updated_at,
		tb_pos.active
from hub.tb_pos
left join hub.tb_city on (tb_city.id = tb_pos.id_city)
left join hub.tb_state on (tb_state.id = tb_city.id_state)
left join hub.tb_pos_chain on (tb_pos_chain.id = tb_pos.id_chain)
left join hub.tb_pos_brand on (tb_pos_brand.id = tb_pos.id_brand)
left join hub.tb_pos_channel on (tb_pos_channel.id = tb_pos.id_channel)
left join hub.tb_pos_business_unit_type on (tb_pos_business_unit_type.id = tb_pos.id_business_unit_type)
left join hub.tb_pos_location_type on (tb_pos_location_type.id = tb_pos.id_location_type)
left join hub.tb_shopping on (tb_shopping.id = tb_pos.id_shopping)
left join hub.tb_address_type on (tb_address_type.id = tb_pos.id_address_type)
left join hub.tb_pos_status on (tb_pos_status.id = tb_pos.id_status)
left join hub.tb_user on (tb_user.id = tb_pos.id_user_last_update);
