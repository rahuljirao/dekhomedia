const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const { getDateTimeString } = require("../../common/lib");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");

class GetDashboardDetailsController {

    static async getDashboardDetails(event, context) {
        let corelationId = await getDateTimeString();
        const request = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        let authorizer = await utils.getAdvertiserDetails(event);

        try {
            
            // Perform update operation
            const updateUserResponse = await GetDashboardDetailsController.getDashboardDetailsOperation(
                request,
                corelationId,
                context,
                authorizer
            );

            if (updateUserResponse?.responseCode === "OK") {
                return context.send(updateUserResponse);
            } else {
                return context.status(400).send(updateUserResponse);
            }
        } catch (err) {
            // Handle errors
            console.log("err=============>",err)
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }

    static async getDashboardDetailsOperation(data, corelationId, context, authorizer) {
        try {
            const formatRevenue = (value) => {
                const num = parseFloat(value);
                const k = num / 1000;
                return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}`;
            };
            const [users] = await db.query('SELECT COUNT(*) as total FROM users WHERE is_deleted = 0');
            const [series] = await db.query('SELECT COUNT(*) as total FROM series WHERE is_deleted = 0');
            const [genres] = await db.query('SELECT COUNT(*) as total FROM categories WHERE is_deleted = 0');
            const [languages] = await db.query('SELECT COUNT(*) as total FROM languages WHERE is_deleted = 0');
            const [totalRevenue] = await db.query('SELECT IFNULL(SUM(amount), 0) as total FROM users_payments WHERE status = 2');
            const [monthly] = await db.query(`SELECT months.month, COALESCE(users_data.users, 0) AS users, COALESCE(revenue_data.revenue, 0) AS revenu FROM ( SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m') AS month FROM ( SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 ) AS seqs ) AS months LEFT JOIN ( SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS users FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(created_at, '%Y-%m') ) AS users_data ON users_data.month = months.month LEFT JOIN ( SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS revenue FROM users_payments WHERE status = 2 AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY DATE_FORMAT(created_at, '%Y-%m') ) AS revenue_data ON revenue_data.month = months.month ORDER BY months.month`);
            const [weekly] = await db.query(`SELECT weeks.week, COALESCE(users_data.users, 0) AS users, COALESCE(revenue_data.revenue, 0) AS revenue FROM ( SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq WEEK), '%x-W%v') AS week FROM ( SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 ) AS seqs ) AS weeks LEFT JOIN ( SELECT DATE_FORMAT(created_at, '%x-W%v') AS week, COUNT(*) AS users FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK) GROUP BY DATE_FORMAT(created_at, '%x-W%v') ) AS users_data ON users_data.week = weeks.week LEFT JOIN ( SELECT DATE_FORMAT(created_at, '%x-W%v') AS week, SUM(amount) AS revenue FROM users_payments WHERE status = 2 AND created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK) GROUP BY DATE_FORMAT(created_at, '%x-W%v') ) AS revenue_data ON revenue_data.week = weeks.week ORDER BY weeks.week;`);
            const [daily] = await db.query(`SELECT days.day, COALESCE(users_data.users, 0) AS users, COALESCE(revenue_data.revenue, 0) AS revenue FROM ( SELECT DATE(DATE_SUB(CURDATE(), INTERVAL seq DAY)) AS day FROM ( SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 ) AS seqs ) AS days LEFT JOIN ( SELECT DATE(created_at) AS day, COUNT(*) AS users FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ) AS users_data ON users_data.day = days.day LEFT JOIN ( SELECT DATE(created_at) AS day, SUM(amount) AS revenue FROM users_payments WHERE status = 2 AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ) AS revenue_data ON revenue_data.day = days.day ORDER BY days.day`);
            const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
            const labelsMonthlyChart = monthly.map(item => monthNames[parseInt(item.month.split('-')[1]) - 1]);
            const usersMonthlyChart = monthly.map(item => item.users);
            const revenueMonthlyChart = monthly.map(item => formatRevenue(item.revenu));

            const labelsWeeklyChart = weekly.map((item, index) => `Week ${index + 1}`);
            const usersWeeklyChart = weekly.map(item => item.users);
            const revenueWeeklyChart = weekly.map(item => formatRevenue(item.revenue));

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const labelsDailyChart = daily.map(item => {
                const date = new Date(item.day);
                return dayNames[date.getDay()];
            });

            const usersDailyChart = daily.map(item => item.users);
            const revenueDailyChart = daily.map(item => formatRevenue(item.revenue));

            return await utils.generateResponseObj({
                responseCode: responsecodes().SUCCESS_OK,
                responseMessage: getStatusText(responsecodes().SUCCESS_OK),
                responseData: {
                    users: users[0]?.total || 0,
                    series: series[0]?.total || 0,
                    genres: genres[0]?.total || 0,
                    languages: languages[0]?.total || 0,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    monthlyChart: {
                        labels: labelsMonthlyChart,
                        users: usersMonthlyChart,
                        revenue: revenueMonthlyChart
                    },
                    weeklyChart: {
                        labels: labelsWeeklyChart,
                        users: usersWeeklyChart,
                        revenue: revenueWeeklyChart
                    },
                    dailyChart: {
                        labels: labelsDailyChart,
                        users: usersDailyChart,
                        revenue: revenueDailyChart
                    }
                }
            });
        } catch (err) {
            return context.status(400).send(await utils.throwCatchError(err));
        }
    }
}

module.exports = GetDashboardDetailsController;
