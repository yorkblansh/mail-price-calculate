require('dotenv').config();
const app = require('express')();
const mysql = require('mysql2');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT;
// проба коммента
// ^ Модули npm и настройка порта

 const pool = mysql.createConnection({//Подключение к бд mysql
     host: process.env.host,
     user: process.env.user,
     password: process.env.password,
     database: process.env.database
   });
let uytrreq = {};
let y =1;
 // app.set('view engine', 'ejs');//Настройка шаблонизатора (страница *.html или *.ejs)
//app.set('view engine', 'html');
  app.get('/', function (req, res) {//Выдача страницы пользователю по адресу -> http://77.246.158.51:5006/
      res.sendFile(__dirname + '/views/index_prod.html');
   // res.sendFile('view/index_prod.html');
  });
   
  server.listen(PORT,()=> {console.log(`Server some text started( lichniy kabinet ) on port ${PORT}`)});
// ^ Запуск сервера 

  io.on('connection', socket => {//Callback функция для подключения пользователя к сокету при выдаче страницы


    socket.on('form_mess', d =>{//Если пользователь отправляет форму, разбираем приниятый обьект
      
var sql_query;
if(d.region == ''){//Если пользователь не вводит регион, то ищем в городах, иначе - ищем в регионах
sql_query = `SELECT functions.first_500, functions.next_500, functions.t_first, functions.t_next from functions left JOIN town_names on town_names.subject_id = functions.id WHERE town_names.town_name = '${d.town_name}'`;
}else{
  sql_query = `SELECT region_functions.t_first, region_functions.t_next from region_functions join regions_towns on regions_towns.traif_id = region_functions.id WHERE regions_towns.town = '${d.town_name}' and regions_towns.region = '${d.region}'`;
}

pool.query(sql_query, function(err, results) {//Запрос в бд

try{
  if(d.weight == ''){
    console.log(e);
    socket.emit('otvet', 'alert_noweight');//Если ничего не введено, пользователь получает уведомление
    return;
  }
  //Формула для вычисления суммы без ндс
   var final_bez_nds = parseFloat(results[0].t_first.replace(',','.')) + Math.ceil((Number(d.weight) - 500)/500) * parseFloat(results[0].t_next.replace(',','.'));
  console.log(final_bez_nds);
 

  var otvet = {
bez_nds: final_bez_nds,//без ндс
s_nds: Math.round(final_bez_nds * 1.2)//с ндс
  };


socket.emit('otvet', otvet);//Отправка "ответа" пользователю

  }catch(e){

    if(d.town_name == ''){
      console.log(e);
      socket.emit('otvet', 'alert_town_didnotenter');//Если ничего не введено, пользователь получает уведомление
return;
  }
  if(d.weight == ''){
    console.log(e);
    socket.emit('otvet', 'alert_noweight');//Если ничего не введено, пользователь получает уведомление
    return;
  }
  if(d.region == ''){

  console.log(e);
  socket.emit('otvet', 'alert_town_doesnot_exist');//Если ничего не введено, пользователь получает уведомление

  }else{

var id_t_3 = `SELECT t_first, t_next from region_functions WHERE id = 3`;
// ^ Если город не найден, то формула расчитывается по общим исходным данным
    pool.query(id_t_3, function(err, results) {
      var final_bez_nds = parseFloat(results[0].t_first.replace(',','.')) + Math.ceil((Number(d.weight) - 500)/500) * parseFloat(results[0].t_next.replace(',','.'));
      console.log(Math.round(final_bez_nds,2));
     

      var otvet = {
    bez_nds: Math.round(final_bez_nds),
    s_nds: Math.round(final_bez_nds * 1.2)
      };


    socket.emit('otvet', otvet);
    });

  }
  }
});
      //console.log(d); //Вывод обьекта в консоль
    });
    
    console.log(`someone is connected`);

    socket.on('disconnect', d =>{
      //Если пользователь отключен, пишем это в консоль
      console.log('someone was disconnected');
    });

  });
