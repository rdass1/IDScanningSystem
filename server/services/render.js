const { default: axios } = require("axios")

exports.homeRoutes = (req,res)=>{
    axios.get('http://localhost:3000/api/members')
    .then(function(response){
        res.render('index',{users:response.data})
    })
    .catch(err=>{
        res.send(err);
    });
}

