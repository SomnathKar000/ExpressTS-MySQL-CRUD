import mySql from "mysql";
import databaseConfig from "../config/database";

const conection = mySql.createConnection(databaseConfig);

export default conection;
