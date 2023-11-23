import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Please enter a valid street"],
    trim: true
  },
  city: {
    type: String,
    required: [true, "Please enter a valid city"],
    trim: true
  },
  state: {
    type: String,
    required: [true, "Please enter a valid state"],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, "Please enter a valid zipCode"],
    trim: true
  },
  country: {
    type: String,
    required: [true, "Please enter a valid country"],
    trim: true
  }
});

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter a valid first name"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Please enter a valid last name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
    unique: [true, "Email address already exists"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Please enter a valid phone number"],
    trim: true,
    unique: [true, "Phone number already exists"]
  },
  address: addressSchema,
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
