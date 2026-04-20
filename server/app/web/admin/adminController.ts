import { col, fn } from "sequelize";
import Booking from "../../models/bookingModel.ts";
import Food from "../../models/foodModel.ts";
import Table from "../../models/tableModel.ts";
import User from "../../models/userModel.ts";
import Payment from "../../models/paymentModel.ts";

// 6 - 2 9 - 6 10 - 7 2 - 10
class AdminController {

    async dashboardData() {
        try {
            // const users = await User.findAll();
            // const tables = await Table.findAll();
            // const foods = await Food.findAll();

            // total number of table bookings
            // const bookings = await Booking.findAll({
            //     attributes: [
            //         "tableId",
            //         [fn("COUNT", col("tableId")), "numberOfBookings"]
            //     ],
            //     group: ["tableId"]
            // });
            // console.log(JSON.parse(JSON.stringify(bookings)))
            //output
            // [
            //     {
            //         tableId: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b',
            //         numberOfBookings: 1
            //     }
            // ]



            // total number of users bookings
            // const bookins = await Booking.findAll({
            //     attributes: [
            //         "userId",
            //         [fn("COUNT", col("userId")), "numberOfBookings"],
            //     ],
            //     group: ["userId"]
            // })
            // console.log(JSON.parse(JSON.stringify(bookins)))
            //output
            // [
            //     {
            //         userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
            //         numberOfBookings: 1
            //     }
            // ]

            // total number of foods orders
            // const foods = await Food.findAll({
            //     attributes: [
            //         "id",
            //         [fn("COUNT", col("id")), "numberOfOrders"],
            //     ],
            //     group: ["id"]
            // })
            // console.log(JSON.parse(JSON.stringify(foods)))
            //output
            // [
            //     {
            //         id: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b',
            //         numberOfOrders: 1
            //     }
            // ]

            // total foods count by each booking  
            // const foodsCount = await Booking.findAll({
            //     attributes: [
            //         "id",
            //         [fn("COUNT", col("foods.id")), "numberOfFoods"],
            //     ],
            //     include: [
            //         {
            //             model: Food,
            //             as: "foods",
            //             attributes: [],
            //             through: { attributes: [] }
            //         }
            //     ],
            //     group: ["Booking.id"]
            // })
            // console.log(JSON.parse(JSON.stringify(foodsCount)))
            //output
            // [
            //     { id: '04c288dc-0913-494d-ac17-4f4a40950f97', numberOfFoods: 3 }
            // ]


            // total foods perchesed by per user
            // const foodsPerchesedByUser = await Booking.findAll({
            //     attributes: [
            //         "userId",
            //         [fn("COUNT", col("foods.id")), "numberOfFoods"]
            //     ],
            //     include: [
            //         {
            //             model: Food,
            //             as: "foods",
            //             attributes: [],
            //             through: { attributes: [] }
            //         }
            //     ],
            //     group: ["Booking.userId"]
            // })
            // console.log(JSON.parse(JSON.stringify(foodsPerchesedByUser)))
            //output
            // [
            //     { userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65', numberOfFoods: 3 }
            // ]


            // foods for per table 
            // const foodsPertable = await Table.findAll({
            //     attributes: [
            //         "id",
            //         [fn("COUNT", col("foods.id")), "numberOfFoods"]
            //     ],
            //     include: [
            //         {
            //             model: Food,
            //             as: "foods",
            //             attributes: [],
            //             through: { attributes: [] }
            //         }
            //     ],
            //     group: ["Table.id"]
            // })
            // console.log(JSON.parse(JSON.stringify(foodsPertable)))
            //output
            // [
            //     { id: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b', numberOfFoods: 3 },
            //     { id: '04ea15b3-8776-4aa4-89d0-e54090ca193b', numberOfFoods: 0 }
            // ]



            // booking payments details
            // const payments = await Booking.findAll({
            //     where: { id: "041c57f7-34d0-4381-962b-fe580373aac7" },
            //     include: [
            //         {
            //             model: Payment,
            //             as: "payment",
            //             attributes: ["amount", "paymentMethod", "paymentStatus"]
            //         }
            //     ]
            // })
            // console.log(JSON.parse(JSON.stringify(payments)))
            //output
            // [
            //     {
            //         id: '04c288dc-0913-494d-ac17-4f4a40950f97',
            //         bookingId: '04c288dc-0913-494d-ac17-4f4a40950f97',
            //         userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
            //         amount: 100,
            //         paymentMethod: 'cash',
            //         paymentStatus: 'paid'
            //     }
            // ]



            // user payments details
            // const userPayments = await User.findAll({

            //     include: [
            //         {
            //             model: Payment,
            //             as: "payments",
            //             attributes: ["amount", "paymentMethod", "paymentStatus"]
            //         }
            //     ]
            // })
            // console.dir(JSON.parse(JSON.stringify(userPayments)), { depth: null });

            //output
            // [
            //     {
            //         id: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
            //         name: 'saikat',
            //         email: [EMAIL_ADDRESS]',
            //         role: 'user',
            //         createdAt: '2026-04-14T06:43:24.000Z',
            //         updatedAt: '2026-04-14T06:43:24.000Z',
            //         payments: [
            //             {
            //                 id: '041c57f7-34d0-4381-962b-fe580373aac7',
            //                 bookingId: '041c57f7-34d0-4381-962b-fe580373aac7',
            //                 userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
            //                 amount: 100,
            //                 paymentMethod: 'cash',
            //                 paymentStatus: 'paid',
            //                 createdAt: '2026-04-14T06:43:24.000Z',
            //                 updatedAt: '2026-04-14T06:43:24.000Z'
            //             }
            //         ]
            //     }
            // ]
            return {
                success: true,
                message: "Dashboard data fetched successfully",
                // foodsCount
                // users,
                // tables,
                // foods,
                // bookings
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Internal server error"
            }
        }
    }


}

export default new AdminController();