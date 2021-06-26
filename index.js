const app = require('express')();
const mysql = require('mysql2');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 5006;

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'jj',
    password: 'V1d3G0w0',
    database: 'york_mbase'
  });
  app.set('view engine', 'ejs');

  app.get('/', function (req, res) {
    res.render('index');
  });
   
  server.listen(PORT,()=> {console.log(`Server some text started( lichniy kabinet ) on port ${PORT}`)});

  io.on('connection', socket => {

    socket.on('form_mess', d =>{
      
var sql_by_town;
if(d.region == ''){
sql_by_town = `SELECT functions.first_500, functions.next_500, functions.t_first, functions.t_next from functions left JOIN town_names on town_names.subject_id = functions.id WHERE town_names.town_name = '${d.town_name}'`;
}else{
  sql_by_town = `SELECT region_functions.t_first, region_functions.t_next from region_functions join regions_towns on regions_towns.traif_id = region_functions.id WHERE regions_towns.town = '${d.town_name}' and regions_towns.region = '${d.region}'`;
}

pool.query(sql_by_town, function(err, results) {
  // console.dir(results[0].mdev_name);
  // console.dir(results[0]);

 
try{
  
   var final_bez_nds = parseFloat(results[0].t_first.replace(',','.')) + Math.ceil((Number(d.weight) - 500)/500) * parseFloat(results[0].t_next.replace(',','.'));
  console.log(final_bez_nds);
   //console.log(parseFloat(results[0].t_next.replace(',','.')));
  var otvet = {
bez_nds: final_bez_nds,
s_nds: Math.round(final_bez_nds * 1.2)
   };
socket.emit('otvet', otvet);
}catch(e){
  if(d.region == ''){
  console.log(e);
  socket.emit('otvet', 'alert_town_doesnot_exist');
  }else{
var id_t_3 = `SELECT t_first, t_next from region_functions WHERE id = 3`;
    pool.query(id_t_3, function(err, results) {
      var final_bez_nds = parseFloat(results[0].t_first.replace(',','.')) + Math.ceil((Number(d.weight) - 500)/500) * parseFloat(results[0].t_next.replace(',','.'));
      console.log(Math.round(final_bez_nds,2));
       //console.log(parseFloat(results[0].t_next.replace(',','.')));
      var otvet = {
    bez_nds: Math.round(final_bez_nds),
    s_nds: Math.round(final_bez_nds * 1.2)
       };
    socket.emit('otvet', otvet);
    });

  }
}
});




      console.log(d);
    });
    
    console.log(`someone is connected`);
    //console.dir(socket);
    socket.on('disconnect', d =>{
      console.log('someone was disconnected');
    });
    // client.on('event', data => { /* … */ });
    // client.on('disconnect', () => { /* … */ });
  });




  // var sql_all_devs = "SELECT DISTINCT mdev_name FROM u_md_relations";


// function mysql_q(q, weight){
 
// }
 