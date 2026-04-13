import Booking from "../models/bookingModel.ts";
import Food from "../models/foodModel.ts";
import Table from "../models/tableModel.ts";
import User from "../models/userModel.ts";
import BookingFood from "../models/bookingFoodModel.ts";
import TableFood from "../models/tableFoodModel.ts";
import UserFood from "../models/userFoodModel.ts";
import TableCustomer from "../models/tableCustomerModel.ts";
import TableWaiter from "../models/tableWaiterModel.ts";
import Payment from "../models/paymentModel.ts";


// Booking -> Table Association (One Booking belongs to One Table)
Table.hasMany(Booking, {
  foreignKey: "tableId",
  as: "bookings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Booking.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Booking -> User Association (One Booking has One User) 
// Booking.hasOne(User, {
//   foreignKey: "userId",
//   as: "user",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// })

// User.belongsTo(Booking, {
//   foreignKey: "userId",
//   as: "booking",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// })

User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})


// Booking -> Payment Association (One Booking has One Payment)
Booking.hasOne(Payment, {
  foreignKey: "bookingId",
  as: "payment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Payment.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})


// User -> Payment Association (One User has Many Payments)
User.hasMany(Payment, {
  foreignKey: "userId",
  as: "payments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// Booking -> Food Association (One Booking has Many Foods)
Booking.belongsToMany(Food, {
  through: {
    model: BookingFood,
    unique: false,
  },
  foreignKey: "bookingId",
  otherKey: "foodId",
  as: "foods",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",

});

Food.belongsToMany(Booking, {
  through: {
    model: BookingFood,
    unique: false,
  },
  foreignKey: "foodId",
  otherKey: "bookingId",
  as: "bookings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Table -> Food Association (One Table has Many Foods)
Table.belongsToMany(Food, {
  through: {
    model: TableFood,
    unique: false,
  },
  foreignKey: "tableId",
  otherKey: "foodId",
  as: "foods",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Food.belongsToMany(Table, {
  through: {
    model: TableFood,
    unique: false,
  },
  foreignKey: "foodId",
  otherKey: "tableId",
  as: "tables",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// Table -> User Association (One Table has Many Users)
Table.belongsToMany(User, {
  through: {
    model: TableWaiter,
    unique: false,
  },
  foreignKey: "tableId",
  otherKey: "userId",
  as: "waiters",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})


User.belongsToMany(Table, {
  through: {
    model: TableWaiter,
    unique: false,
  },
  foreignKey: "userId",
  otherKey: "tableId",
  as: "waiterTables",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// Table -> Customer Association (One Table has Many Customers)
Table.belongsToMany(User, {
  through: {
    model: TableCustomer,
    unique: false,
  },
  foreignKey: "tableId",
  otherKey: "userId",
  as: "customers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})


User.belongsToMany(Table, {
  through: {
    model: TableCustomer,
    unique: false,
  },
  foreignKey: "userId",
  otherKey: "tableId",
  as: "customerTables",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// User -> Food Association (One User has Many Foods)
User.belongsToMany(Food, {
  through: {
    model: UserFood,
    unique: false,
  },
  foreignKey: "userId",
  otherKey: "foodId",
  as: "foods",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Food.belongsToMany(User, {
  through: {
    model: UserFood,
    unique: false,
  },
  foreignKey: "foodId",
  otherKey: "userId",
  as: "users",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})