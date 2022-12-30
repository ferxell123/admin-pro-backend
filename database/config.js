const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
   await mongoose.connect(process.env.DB_CNN); 
   console.log('DB Connected')
}


module.exports={
    main
}