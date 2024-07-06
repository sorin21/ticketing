// scrypt is the hashing function, that will use.
// Downside to this function is that is callback based
import { scrypt, randomBytes } from "crypto";
// will use promisify to have async, await functionality
import { promisify } from "util";

// transform scrypt, from a callback based implementation, into a promise based implementation
const scryptAsync = promisify(scrypt);

export class Password {
  /* 
    I. Hash the password
  */
  // Make in this class 2 static methods: toHash and compare
  // static methods can be access wihout making an instance of this class
  // like Password.toHash
  static async toHash(password: string) {
    // 1. Generate a salt
    // this will return a Buffer, that is like an array with raw data(original data, how it was first time, unmodified)
    const salt = randomBytes(8).toString("hex");
    // 2. Hash the password
    // if we hover on buf will get unknown, because TS is confused
    // will use this salt Buffer here and will return as Buffer
    // because TS doesn't know about this promisify(scrypt) function
    // So as Buffer will tell to TS to treat this line as a Buffer
    // 64 It is the length of the key and it must be a number
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    // console.log("bufffer1", buf);
    // 2. Return the hash password with the salt
    // hex is because we work with the buffer, that is not a string
    // so we turn it into a string with toString()
    return `${buf.toString("hex")}.${salt}`;
  }

  /* 
    II. Compare the hashed password with the one from login
  */
  // suppliedPassword is the one that comes from the user after login
  static async compare(storedPassword: string, suppliedPassword: string) {
    // hashedPassword is the one stored in database
    const [hashedPassword, salt] = storedPassword.split(".");
    // this is the password after login
    // salt is the salt that we generated during the initial hashing process
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    // console.log("bufffer2", buf);
    // Compare new hashed password from login with the original stored in db hashedPassword
    return buf.toString("hex") === hashedPassword;
  }
}
