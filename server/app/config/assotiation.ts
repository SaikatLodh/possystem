import Food from "../models/foodModel.ts";
import User from "../models/userModel.ts";

// one to one association
// User.hasOne(Food, { foreignKey: "userId", as: "foods" });
// Food.belongsTo(User, { foreignKey: "userId", as: "user" });

// const getUserFoods = () => {
//   Food.findAll({
//     where: { isDeleted: false },
//     include: {
//       model: User,
//     },
//   });
// };

// one to many association
// User.hasMany(Food, { foreignKey: "userId", as: "foods" });
// Food.belongsTo(User, { foreignKey: "userId", as: "user" });

// const getUserFood = () => {
//   return User.findAll({
//     where: {
//       isDeleted: false,
//     },
//     include: {
//       model: Food,
//     },
//   });
// };

// many to many association
// User.belongsToMany(Food, { through: "user_foods" });
// Food.belongsToMany(User, { through: "user_foods" });

// const getUserFoods = () => {
//   return User.findAll({
//     where: {
//       isDeleted: false,
//     },
//     include: {
//       model: Food,
//     },
//   });
// };
