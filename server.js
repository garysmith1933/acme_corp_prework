const { sequelize, syncAndSeed, models: { Department, Employee } } = require('./db')
const express = require("express")
const app = express()

app.get('/', (req,res)=> res.redirect('/api/departments'))

// LEFT OF AT 29:22

app.get('/api/departments', async(req, res, next) => {
    try {
        res.send(await Department.findAll({
            include: [ 
                
                { 
                model: Employee, 
                as: 'manager'
                }
                
                ]
            
        }))
    } catch(ex) {
        console.log(ex)
    }
})



app.get('/api/employees', async(req, res, next) => {
    try {
        res.send(await Employee.findAll({
            include: [ 
                
                { 
                model: Employee, 
                as: 'supervisor' 
                },
                
                
            Employee,
            Department
                
                ]
            
        }))
    } catch(ex) {
        console.log(ex)
    }
})




const init = async() => {
    try {
        await sequelize.authenticate() 
        syncAndSeed()
        const port = process.env.PORT || 8080;
        
        app.listen(port, ()=> console.log(`listening on port ${port}`))
    } 
    
    catch(err) {
        console.log(err)
    }
};

init()

