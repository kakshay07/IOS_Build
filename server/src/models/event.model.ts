import { getId, insertTable, query, updateTable } from "../utils/db";
import { ApiError } from "../utils/ApiError";


export class eventModel {
    entity_id?: number | string;
    branch_id?: number | string;
    cr_on?: string;
    cr_by?: string | number;
    mo_on?: string | number;
    mo_by?: string 

    static async getEventLogs(entityCode: number, userId: string, searchByFrom: string, searchByTo: string)
    {
        let _query = `WITH DateSeries AS (
            SELECT DATE_ADD(? , INTERVAL t.n DAY) AS date_value
            FROM (
                SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
                UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 
                UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 
                UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
                UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 
                UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21
                UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 
                UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 
                UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
                UNION ALL SELECT 31
            ) t
            WHERE DATE_ADD(? , INTERVAL t.n DAY) <= ?
        )

        SELECT 
            d.date_value AS login_dateEvent,
            IFNULL(E.LOGIN_DATETIME, '-') AS login_datetime,
            IFNULL(E.LOGOUT_DATETIME, '-') AS logout_datetime,
            IFNULL(E.LOGIN_SESSION_IP, '-') AS LOGIN_SESSION_IP,
            IFNULL(E.LOGOUT_SESSION_IP, '-') AS LOGOUT_SESSION_IP,
            IFNULL(E.ENTRY_FLAG, '-') AS ENTRY_FLAG,
            IFNULL(A.EARLY_LEAVE_PERMISSION, '-') AS EARLY_LEAVE_PERMISSION,
            IF(E.LOGOUT_DATETIME IS NOT NULL, TIMEDIFF(E.LOGOUT_DATETIME, E.LOGIN_DATETIME), '-') AS time_diff,
            COALESCE(
                CASE 
                    WHEN WH.DAY IS NOT NULL THEN 'Weekly Holiday'
                    WHEN H.HOL_DESC IS NOT NULL THEN H.HOL_DESC
                    WHEN A.LEAVE_FLAG = 'ORW' THEN CONCAT('On Remote Work(', A.LEAVE_CODE, ')')
                    WHEN A.LEAVE_FLAG = 'L' THEN CONCAT('On Leave(', A.LEAVE_CODE, ')')
                    WHEN A.LEAVE_FLAG = 'F' THEN 'Leave On Afternoon'
                    WHEN A.LEAVE_FLAG = 'M' THEN 'Leave On Morning'
                    WHEN A.FIRST_HALF = 1 AND A.SECOND_HALF = 0 THEN 'Present Partially'
                    WHEN A.FIRST_HALF = 0 AND A.SECOND_HALF = 1 THEN 'Present Partially'
                    WHEN A.PRESENT = 'P' THEN 'Present'
                    ELSE 'Absent'
                END, 'Absent'
            ) AS remarks,
            COALESCE(
                CASE 
                    WHEN WH.DAY IS NOT NULL THEN 'W'
                    WHEN H.HOL_DESC IS NOT NULL THEN 'H'
                    WHEN A.FIRST_HALF = 1 AND A.SECOND_HALF = 0 THEN 'M'
                    WHEN A.FIRST_HALF = 0 AND A.SECOND_HALF = 1 THEN 'F'
                    WHEN A.PRESENT = 'P' THEN 'P'
                    ELSE 'A'
                END, 'A'
            ) AS type,
            IFNULL(A.PRESENT, '') AS present,
            IFNULL(E.LOGIN_ADDRESS, '-') AS LOGIN_ADDRESS,
            IFNULL(E.LOGOUT_ADDRESS, '-') AS LOGOUT_ADDRESS
        FROM DateSeries d
        LEFT JOIN userslogin E 
            ON DATE(E.LOGIN_DATETIME) = d.date_value 
            AND E.ENTITY_CODE = ? 
            AND E.USER_ID = ?
        LEFT JOIN users U 
            ON U.ENTITY_CODE = E.ENTITY_CODE 
            AND U.USER_ID = E.USER_ID
        LEFT JOIN employee T 
            ON T.ENTITY_CODE = E.ENTITY_CODE 
            AND T.EMP_NUM = U.EMP_NUM
        LEFT JOIN attendance A 
            ON A.ENTITY_CODE = E.ENTITY_CODE  
            AND A.EMP_NUM = U.EMP_NUM 
            AND DATE(A.ATTENDANCE_DATE) = d.date_value
        LEFT JOIN weekly_holidays WH 
            ON WH.ENTITY_CODE = ? 
            AND WH.STATUS = 1 
            AND WH.DAY = DAYNAME(d.date_value)
        LEFT JOIN holiday_list H 
            INNER JOIN branch B 
            ON B.ENTITY_CODE = H.ENTITY_CODE 
            AND H.STATE_CODE = B.STATE_CODE
            ON H.ENTITY_CODE = ? 
            AND DATE(H.HOL_DATE) = d.date_value 
            AND B.BRANCH_CODE = T.EMP_BRANCH_CODE 
            AND H.HOL_OPTION = 'C' 
            AND H.HOL_ACTIVE = 'Y'
        ORDER BY d.date_value DESC;
        `;

        const _params: (string | number)[] = [searchByFrom, searchByFrom, searchByTo, entityCode, userId, entityCode, entityCode];
        return await query(_query, _params);
    }

    static async addEmpLoginLog(entity_id: number, user_id: string, emp_id: number, address: string)
    {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentHour = new Date().getHours();
            const checkHalf = currentHour < 12 ? 'FIRST_HALF' : 'SECOND_HALF';
    
            await query(
                `INSERT INTO userslogin (USER_ID, ENTITY_CODE, LOGIN_SESSION_ID, LOGIN_SESSION_IP, LOGIN_ADDRESS, LOGIN_DATETIME) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [user_id, entity_id, '1111', '192.168.23.56', address]
            );
    
            const rows = await query(
                `SELECT * FROM attendance WHERE ENTITY_CODE = ? AND EMP_NUM = ? AND DATE(ATTENDANCE_DATE) = ?`,
                [entity_id, emp_id, currentDate]
            );
    
            if (rows.data.length == 0) {
                await query(
                    `INSERT INTO attendance (ENTITY_CODE, EMP_NUM, PRESENT, ATTENDANCE_DATE, ${checkHalf})
                     VALUES (?, ?, 'P', NOW(), 1)`,
                    [entity_id, emp_id]
                );
            } else {
                await query(
                    `UPDATE attendance SET PRESENT = 'P', ${checkHalf} = 1
                     WHERE ENTITY_CODE = ? AND EMP_NUM = ? AND DATE(ATTENDANCE_DATE) = ?`,
                    [entity_id, emp_id, currentDate]
                );
            }

            return true;
        } catch (error) {
            console.error(error);
        }
    }

    static async getUserDetails(entity_id: number, user_id: string)
    {
        let _query = `select u.ENTITY_CODE, u.USER_ID, u.USER_NAME, u.EMP_NUM, e.EMP_NAME, b.BRANCH_DESCRIPTION, d.DEPT_DESCRIPTION, g.DESIG_DESC,
        (select LOGIN_DATETIME from userslogin where ENTITY_CODE = u.ENTITY_CODE and USER_ID = u.USER_ID order by LOGIN_DATETIME desc limit 1) as last_login
        from users u 
        join employee e using(ENTITY_CODE, EMP_NUM)
         join branch b on e.ENTITY_CODE=b.ENTITY_CODE and e.EMP_BRANCH_CODE=b.BRANCH_CODE 
         join department d on e.ENTITY_CODE=d.ENTITY_CODE and e.EMP_DEPT_CODE=d.DEPT_CODE 
         join designation g on e.ENTITY_CODE=g.ENTITY_CODE and e.EMP_DESIG_CODE=g.DESIG_CODE 
         where u.ENTITY_CODE = ? and u.USER_ID = ?`;

        const _params: (string | number)[] = [entity_id, user_id];
        return await query(_query, _params);
    }
}