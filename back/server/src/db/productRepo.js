import pool from './defaultClient.js';

const schema = 'products'

// @formatter:off


export async function list() {
    const sql =
        `
            SELECT p.name,
                   p.description,
                   p.type,
                   p.subtype,
                   p.tags,
                   p.preview_image AS "previewImage",
                   p.status,
                   p.sku,
                   p.id,
                   TO_CHAR(p.created_at, 'DD.MM.YYYY HH24:MI:SS') AS created_at,
                   TO_CHAR(p.updated, 'DD.MM.YYYY HH24:MI:SS')    AS updated_at,

                   COALESCE((
                        SELECT json_agg(
                            json_build_object(
                                'id', pv.id,
                                'name', pv.name,
                                'price', pv.price,
                                'stock', pv.stock,
                                'images', COALESCE((
                                    SELECT json_agg(pvi.*)
                                    FROM ${schema}.product_variants_images pvi
                                    WHERE pvi.variant_id = pv.id
                                ), '[]'::json)
                            ) 
                        )
                        FROM ${schema}.product_variants pv 
                        WHERE pv.product_id = p.id
                ),'[]'::json) AS variants
            
            FROM ${schema}.products p;
        `;
    const result = await pool.query(sql);

    return result.rows;
}

async function variants(id) {
    const sql =
        `SELECT *
         FROM ${schema}.product_variants pv
         WHERE pv.product_id = '${id}' `;

    const result = await pool.query(sql);
    const imagesArr = await images(result.rows[0].id);
    result.rows[0].images = imagesArr;

    return result.rows;
}

async function images(id) {
    const sql =
        `SELECT *
         FROM ${schema}.product_variants_images pvi
         WHERE pvi.variant_id = '${id}' `;

    const result = await pool.query(sql);
    return result.rows;

}