const Sequelize = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE_URL ||'postgres://localhost/acme_db')
const { STRING, UUID, UUIDV4 } = Sequelize






const Department = sequelize.define('department', {
    name: {
        type: STRING(20)
    }
});

const Employee = sequelize.define('employee', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(20)
    }
    
});

Department.belongsTo(Employee, { as: 'manager'});
Employee.hasMany(Department, { foreignKey: 'managerId'})

Employee.belongsTo(Employee, {as: 'supervisor'});
Employee.hasMany(Employee, { foreignKey: 'supervisorId'})


const syncAndSeed = async() => {
    await sequelize.sync({ force: true})
    const [moe, lucy, larry, hr, engineering] = await Promise.all([
        Employee.create({ name: 'moe'}),
        Employee.create({ name: 'lucy'}),
         Employee.create({ name: 'larry'}),
        Department.create({ name: 'hr'}),
        Department.create({ name: 'engineering'})
        ])
        
        
        hr.managerId = lucy.id;
        await hr.save()
        moe.supervisorId = lucy.id;
        larry.supervisorId = lucy.id
        await Promise.all([ 
              moe.save(),
              larry.save()
            ])
        
}






module.exports = {
    sequelize, syncAndSeed, 
    models: {
        Department,
        Employee
    }
}