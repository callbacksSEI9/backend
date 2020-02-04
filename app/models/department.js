const mongoose = require("mongoose")

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner:{//the manager of the department
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    employees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{ usePushEach: true })

const DepartmentModel = mongoose.model("Department",departmentSchema)

module.exports = DepartmentModel