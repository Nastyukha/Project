var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
class Parametrs {
    static illRadius;
    static illChance;
    static deathChance;
    static illTime;
    static allMasks;
    static privito;
    static people = 5000;
}
class Changes {
    static changeMasksIll = 10;
    static changeVacineIll = 10;
    static changeVacineDeath = 10;
}
class Point {
    masks = false;
    vacine = false;
    startIll;  // начало болезни
    beIllChance = Parametrs.illChance;
    beDeathChance = Parametrs.deathChance;
    static ballsCounter = 0;  // счетчик шаров
    static illCounter = 0;  // счетчик заболевших
    static deathCounter = 0;  // счетчик умерших
    static aliveCounter = 50;
    counterVer2 = 0;  // производственная переменная для изменения направления
    static counterVer3 = 0;  // производственная переменная для подсчета вероятности
    counterVer4 = 0;  // производственная переменная для подсчета смерть/выздоровление
    color = "white";  // цвет незараженного шара
    ballRadius;  //радиус шара
    ill = false;  // болен/нет
    x = 0;
    y = 0;  // координаты
    dx = 2;
    dy = -2;  //изменение координат
    constructor(ballRadius, mask, vacin) {
        Point.ballsCounter++;
        this.ballRadius = ballRadius;
        this.x = Math.floor(Math.random() * (canvas.width));
        this.y = Math.floor(Math.random() * (canvas.height));  //начальные координаты
        this.masks = mask;
        if (this.masks == true){
            this.beIllChance -= Changes.changeMasksIll;
        }
        this.vacine = vacin;
        if (this.vacine == true){
            this.beIllChance -= Changes.changeVacineIll;
            this.beDeathChance -= Changes.changeVacineDeath;
        }
    }

    drawBall() {  //метод для рисования шара
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {  // движение
        this.x += this.dx;
        this.y += this.dy;
        // проверка на каасание стенки:
        if (this.y + this.dy < this.ballRadius || this.y + this.dy > canvas.height - this.ballRadius) {
            this.dy = -this.dy;
        }
        if (this.x + this.dx < this.ballRadius || this.x + this.dx > canvas.width - this.ballRadius) {
            this.dx = -this.dx;
        }
        this.drawBall();
    }

    makeIll() {  // метод заболел/заразил
        Point.counterVer3 = Math.floor(Math.random() * (100 - 1)) + 1;
        if (Point.counterVer3 <= this.beIllChance){
            this.ill = true;
            Point.illCounter++;
            this.color = "blue";  // цвет зараженного шарика
            this.startIll = new Date().getTime();
            Point.aliveCounter -= 1;
        }
    }

    change() {  // метод для изменения направления
        this.counterVer2 = Math.round(Math.random());
        if (this.counterVer2 === 0) {
            this.dx = -this.dx;
        } else {
            this.dy = -this.dy;
        }
    }

    death(ind, balls) {
        let nowTime = new Date().getTime();
         if (nowTime / 1000 - this.startIll / 1000 >= Parametrs.illTime){
            this.counterVer4 = Math.floor(Math.random() * (100 - 1)) + 1;
            if (this.counterVer4 <= this.beDeathChance) {
                balls.splice(ind, 1);
                Point.deathCounter++;
                Point.illCounter--;
            }
            else {
                this.ill = false;
                Point.illCounter--;
                this.color = "#FF66FF";
            }
         }
    }
}
start.onclick = function() {
    Parametrs.illRadius = parseInt(document.getElementById("radIll").value);
    Parametrs.illChance = parseInt(document.getElementById("chanceIll").value);
    Parametrs.deathChance = parseInt(document.getElementById("chanceDeath").value);
    Parametrs.illTime = parseInt(document.getElementById("timeIll").value);
    Parametrs.allMasks = parseInt(document.getElementById("masksOnAll").value);
    Parametrs.privito = parseInt(document.getElementById("vacine").value);
    standart();
    graphik();
    var second = 0;
    setInterval(()=>{
        second = second + 2;
        graphik(second);
    }, 2000);
}
var massiv = [['Секунда', 'Количество зараженных']];
var massiv2 = [['Секунда', 'Количество смертей']];
var massiv3 = [['Кол-во', 'Здоровые'], ['Кол-во2', 'Мертвые'], ['Кол-во3', 'Зараженные']]

function graphik(second){
    google.charts.load('current', {'packages':['corechart', 'line']});
      google.charts.setOnLoadCallback(drawFirstChart);
      google.charts.setOnLoadCallback(drawSecondChart);
      google.charts.setOnLoadCallback(drawPieChart);

      massiv.push([second, Point.illCounter]);
      massiv2.push([second, Point.deathCounter]);

      function drawFirstChart() {
        var data = google.visualization.arrayToDataTable(massiv);

        var options = {
          title: 'Статистика заражения',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('first_curve_chart'));

        chart.draw(data, options);
      }

      function drawSecondChart() {
        var data = google.visualization.arrayToDataTable(massiv2);

        var options = {
          title: 'Статистика смертей',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('second_curve_chart'));

        chart.draw(data, options);
      }

      function drawPieChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Тип людей');
        data.addColumn('number', 'Кол-во');
        data.addRows([
          ['Зараженные', Point.illCounter],
          ['Здоровые', Point.aliveCounter],
          ['Мертвые', Point.deathCounter]
        ]);

        var options = {
          'title': 'Соотношение',
          'width': 500,
          'height': 500
        };

        var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
        chart.draw(data, options);
      }
}
function standart() {
    let balls = []  // список шаров на экране
    // заполняем список
    for (let i = 0; i < Parametrs.people; i++){
        let ver = Math.floor(Math.random() * (100 - 1)) + 1;
        let ver2 = Math.floor(Math.random() * (100 - 1)) + 1;
        if (ver <= Parametrs.allMasks){
            if (ver2 <= Parametrs.privito){
                balls.push(new Point(3, true, true));
            }
            else{
                balls.push(new Point(3, true, false));
            }
        }
        else{
            if (ver2 <= Parametrs.privito){
                balls.push(new Point(3, false, true));
            }
            else{
                balls.push(new Point(3, false, false));
            }
        }
    }
    let ballIll = new Point(3, false);  // создаем зараженный шарик
    ballIll.ill = true;
    Point.illCounter++;
    ballIll.color = "blue";  // цвет зараженного шарика
    ballIll.startIll = new Date().getTime();
    balls.push(ballIll);  // добавляем его в список
    setInterval(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // очищаем экран
        for (let p of balls){
          if (p.ill == true){
            p.death(balls.findIndex(i => i == p), balls);
          }
            p.move();  // двигаем шары
            for (let n of balls){
              if (Math.abs(p.x - n.x) <= Parametrs.illRadius && Math.abs(p.y - n.y) <= Parametrs.illRadius && p != n){  // проверяем касание с радиусом заражения
                if (p.ill == true && n.ill != true){  // проверяем есть ли при касании зараженные
                  n.makeIll();
                }
                if (p.ill != true && n.ill == true){  // проверяем есть ли при касании зараженные
                  p.makeIll();
                }
              }
            }
        }
        } ,10)
    setInterval(()=>{  // изменяем направление (рандомно)
        for (let p of balls){
            p.change();
        }
        } ,100)
}