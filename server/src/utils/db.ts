import { createPool, Pool, PoolConnection } from 'mariadb';
import logger from './logger';

let conn: Pool;
let rec = 0;

export const getConnection = async (): Promise<Pool> => {
    if (conn !== undefined) {
        return conn;
    }
    try {
        rec++;
        if (rec > 5) {
            return conn;
        }
        console.log('port' , process.env.DB_PORT);
        
        const password = process.env.DB_PASSWORD;
        const host = process.env.DB_HOST;
        const port = Number(process.env.DB_PORT);
        const database = process.env.DB_NAME_MHFSL;
        const user = process.env.DB_USER;
        // if (process.env.NODE_ENV && process.env.NODE_ENV == 'development') {
        //     password = 'admin123';
        //     host= 'localhost';
        //     port = 3307;
        // } else {
        //     password = 'tJwkHQbWJXwgCngTXTKr';
        //     host= 'mariadb-1.c1yayegiwvkd.us-east-1.rds.amazonaws.com';
        //     console.log('Production');
        //     port = 3306;
        // }
        const _conn = createPool({
            user,
            // host: '139.59.61.44',
            host,
            database,
            password,
            port,
            connectionLimit: 10, 
            connectTimeout: 10000, 
            acquireTimeout: 10000, 
            dateStrings:true
        });
        logger.info('Connected to database');
        conn = _conn;
        rec = 0;
        return conn;
    } catch (err) {
        logger.error(`Error connecting to database ${err}`);
        return getConnection();
    }
};

interface getIdInput {
    table: string;
    column: string;
    where: { [key: string]: any };
}
interface Insert {
    table: string;
    data: { [key: string]: any };
    skip?: string[];
}
interface Update extends Insert {
    where?: { [key: string]: any };
    skip?: string[];
}

export async function query<T>(
    query: string,
    params?: (string | number | boolean | null | undefined)[],
    log = false,
    connection ?: PoolConnection
) {
    try {
        let conn;
        if(connection){
            conn = connection;
        }else {
            conn = await getConnection();
        }
        logger.info({ query: query, query_params: params });
        const result = await conn.query(query, params);
        
        if (log) {
            console.log(result);
        }

        return { result: true, data: result };
    } catch (e) {
        logger.info({ query: query, query_params: params });
        logger.error(e);
        return { result: false, data: null, message: JSON.stringify(e) };
    }
}

export const getId = (input: getIdInput) => {
    let _query = `SELECT COALESCE(MAX(${input.column}), 0) + 1 AS ${input.column} FROM ${input.table} `;
    
    const _params = [];
    let i = 0;
    for (const key in input.where) {
        if (i === 0) {
            _query += ' WHERE ';
        } else {
            _query += ' AND ';
        }
        _query += ` ${key} = ?`;
        _params.push(input.where[key]);
        i++;
    }
    _query += '  ;';
    console.log(_query);
    
    return query(_query, _params);
};

export function insertTable<T extends any[]>(input: Insert) {
    let _query = `INSERT INTO ${input.table} (`;
    let _value_query = ` VALUES (`;
    const _params = [];

    if (input.skip) {
        for (const key of input.skip) {
            delete input.data[key];
        }
    }

    for (const key in input.data) {
        _query += `${key},`;
        _value_query += '?,';
        _params.push(input.data[key]);
    }

   if(Object.keys(input.data).includes('cr_on')){
    console.log("")
   }else{
    _query += `cr_on,`;
    _value_query += 'NOW(),';
   }
   
    _query = _query.slice(0, _query.length - 1);
    _value_query = _value_query.slice(0, _value_query.length - 1);
    _query += ') ';
    _value_query += ') ';
    const _final_query = _query + _value_query + ';';

    return query<T>(_final_query, _params);
}

export function lengthOfMap(a: { [key: string]: any }) {
    let i = 0;
    for (const _ in a) i++;
    return i;
}

export function updateTable(input: Update) {
    const _data = input.data;
    if (input.skip) {
        for (const key of input.skip) {
            delete _data[key];
        }
    }
    let _query = `UPDATE ${input.table} SET `;
    const _params = [];
    let n = lengthOfMap(input.data);
    for (const key in input.data) {
        n--;
        if (input.where && key in input.where) continue;
        _query += ` ${key} = ?`;
        if (n > 0) _query += ', ';

        _params.push(input.data[key]);
    }
    _query += ' , mo_on = NOW()';
    if (input.where && lengthOfMap(input.where) > 0) {
        let i = 0;
        for (const key in input.where) {
            if (i === 0) {
                _query += ' WHERE ';
            } else {
                _query += ' AND ';
            }
            i++;
            _query += ` ${key} = ?`;
            _params.push(input.where[key]);
        }
    }
    _query += ' ; ';

    return query(_query, _params);
}
