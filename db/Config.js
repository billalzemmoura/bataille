const Sequelize = require('sequelize');
const bCrypt = require("bcrypt");
const db ={database:'d991pcpkq61i2g',user:'ukepkneijbjkdm',password:'277bb377a3de024a5a66aa155298dd8f6651d1296047188fea9f195db00bb14e'};
let sequelize;
if (process.env.DATABASE_URL) {
    let match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    sequelize = new Sequelize(match[5], match[1], match[2], {
        dialect: 'postgres',
        protocol: 'postgres',
        port: match[4],
        host: match[3],
        dialectOptions:{
            ssl:true
        }
    })
}else {
    console.log('nope faldji');
    sequelize = new Sequelize(db.database, db.user, db.password, {
        host: 'ec2-54-217-204-34.eu-west-1.compute.amazonaws.com',
        dialect: 'postgres',
        dialectOptions:{
            ssl:true
        }
    });
}
//const sequelize = new Sequelize("postgres://pnlajbvuanvzma:253257240425b112556edb9c55535bfd28061be591a8ae24a5daa72b64f5c770@ec2-34-202-7-83.compute-1.amazonaws.com:5432/dfh6cgogm94jt7");
let User = sequelize.define('joueurs', {
    nom: Sequelize.STRING,
    prenom: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    win:Sequelize.INTEGER,
    lose:Sequelize.INTEGER
});
User.sync();



const  hashPassword = async (password)=>{
    let passHash;
    try {
        passHash = await bCrypt.hashSync(password, 10)
    }
    catch (e) {
        return null;
    }
    return passHash;
};
const addUser = async (user)=>{
    let newUser = await User.findOne({ where: {email:user.email} }).catch(()=> {return null});
    if (newUser)
        return false;
    const genPass = await hashPassword(user.password);
    if (genPass === null)
        return null;
    user.password=genPass;
    return User.create(user).catch(()=>{return null});
};
const checkUser = async (email, password) =>{
    //... fetch user from a db etc.
    let user = await User.findOne({ where: {email:email} }).catch(()=> {return null});
    if (user===null)
        return false;
    return  bCrypt.compareSync(password, user.password) === true ? user : false;
};
module.exports = {User,hashPassword,checkUser,addUser};

