import Bmob from "hydrogen-js-sdk";
import common from "@/utils/common.js";
export default {
	//得到出入库的线形图数据
	getLineChart(year, month) {
		let categories = []
		let _data = []

		let uid = JSON.parse(localStorage.getItem('bmob')).objectId
		let Day = new Date()
		let d
		let now_month = Day.getMonth() + 1
		let now_year = Day.getFullYear();
		let start_date
		let end_date

		d = Day.getDate()
		start_date = common.getDay(1) + " 00:00:00"
		end_date = common.getDay(-d + 1) + " 00:00:00"


		return new Promise((resolve, reject) => {
			const query = Bmob.Query("Bills");
			query.equalTo("userId", "==", uid);
			query.equalTo("createdAt", "<=", start_date);
			query.equalTo("createdAt", ">=", end_date);
			query.statTo("sum", "num,total_money,really_total_money");
			query.statTo("groupby", "createdAt,type");
			query.statTo("order", "-createdAt");
			query.limit(1000)
			query.find().then(res => {

				for (let i = 0; i < 31; i++) {
					let data = {}
					let data1 = {}
					categories.push(common.getDay(-i))
					data._sumNum = 0
					data.desc = "入库"
					data.type = 1
					data.date = common.getDay(-i)
					_data.push(data)
					data1._sumNum = 0
					data1.desc = "出库"
					data1.type = -1
					data1.date = common.getDay(-i)
					_data.push(data1)
				}

				for (let a_data of _data) {
					if (a_data.type == 1) {
						for (let item of res) {
							if (item.createdAt == a_data.date && item.type == 1) {
								a_data._sumNum = item._sumNum
							}
						}
					} else {
						for (let item of res) {
							if (item.createdAt == a_data.date && item.type == -1) {
								a_data._sumNum = item._sumNum
							}
						}
					}
				}

				resolve(_data)
				//console.log(lineReserve)
			});

		});
	}
}
