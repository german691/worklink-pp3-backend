const { Admin } = require("./model");
const { hashData, verifyHashedData } = require("./../../../util/hashData");
const createToken = require("./../../../util/createToken");

const authenticateAdmin = async (data) => {
    const { username, password } = data

    try {
        const fetchedAdmin = await Admin.findOne({ username });

        if (!fetchedAdmin) {
            throw new Error(`Invalid username`);
        }

        const hashedPassword = fetchedAdmin.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            throw new Error("Incorrect password");
        }

        const tokenData = { userId: fetchedAdmin._id, username: fetchedAdmin.username, userType: fetchedAdmin.userType };
        const token = await createToken(tokenData);

        fetchedAdmin.token = token;
        return fetchedAdmin;

    } catch (error) {
        throw error;
    }
};

const createNewAdmin = async (data) => {
    try {
        const { username, password } = data;

        const usernameExists = await Admin.findOne({ username });
        if (usernameExists) throw Error("Username is not available");

        const hashedPassword = await hashData(password);

        const newAdmin = new Admin({
            username, 
            password: hashedPassword,
        });

        const createdAdmin = await newAdmin.save();

        return createdAdmin;

    } catch (error) {
        throw error;
    }
}

module.exports = { authenticateAdmin, createNewAdmin };