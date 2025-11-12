import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || firstName.length < 2) throw new Error("Invalid first name");
  if (!validator.isEmail(email)) throw new Error("Invalid email");
  if (!validator.isStrongPassword(password))
    throw new Error("Weak password (add symbols, caps, numbers)");
};
