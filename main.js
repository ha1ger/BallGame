  // 设定画布

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;

  // 生成随机数的函数

  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 生成随机颜色的函数

  var para = document.getElementsByTagName("p");

  function randomColor() {
    return 'rgb(' +
      random(0, 255) + ', ' +
      random(0, 255) + ', ' +
      random(0, 255) + ')';
  }
  var restball = 25;
  //定义形状对象
  function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
  //定义球对象 继承自形状对象
  function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
    //随机画出一个小球
    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
    //判断两个小球是否相遇，如果相遇则分别给两小球一个随机的新颜色
    this.collisionDetect = function () {
      for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
          var dx = this.x - balls[j].x;
          var dy = this.y - balls[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + balls[j].size) {
            balls[j].color = this.color = randomColor();
          }
        }
      }
    }
    //判断是否小球撞上画布边界，如果撞上就给予小球一个反向的速度让它弹回画布中
    this.update = function () {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }

      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }

      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }

      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
    }
  }
  //定义恶魔环对象 继承自形状对象
  function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, exists);
    this.color = "white";
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
    //随机画出一个恶魔环
    this.draw = function () {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
    //判断恶魔环是否撞上画布边界，如果撞上让其回弹一点点距离，使其不会移到画布之外
    this.checkBounds = function () {
      if ((this.x + this.size) >= width) {
        this.x -= this.size;
      }

      if ((this.x - this.size) <= 0) {
        this.x += this.size;
      }

      if ((this.y + this.size) >= height) {
        this.y -= this.size;
      }

      if ((this.y - this.size) <= 0) {
        this.y += this.size;
      }


    }
    //用键值映射控制小球移动
    this.setControls = function () {
      var _this = this;
      window.onkeydown = function (e) {
        if (e.keyCode === 37) {
          _this.x -= _this.velX;
        } else if (e.keyCode === 39) {
          _this.x += _this.velX;
        } else if (e.keyCode === 38) {
          _this.y -= _this.velY;
        } else if (e.keyCode === 40) {
          _this.y += _this.velY;
        }
      }
    }
    //判断恶魔环是否与小球相遇，如果相遇让恶魔环“吃掉小球”，让小球消失
    this.collisionDetect = function () {
      for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
          var dx = this.x - balls[j].x;
          var dy = this.y - balls[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 2.5 * balls[j].size) {
            balls[j].velX = -(balls[j].velX);
            balls[j].velY = -(balls[j].velY);
          }//小球靠近恶魔环“逃生”
          if (distance < this.size + balls[j].size) {
            balls[j].exists = false;
            restball--;
          }

        }
      }
    }
  }

  var balls = [];
  var time = 0;
  var time1 = 0;
  para[1].textContent =para[1].textContent = '本次挑战时间为' + time1 + '秒';
  var evilCircle = new EvilCircle(random(0, width), random(0, height), true);
  evilCircle.setControls();
  //主循环方法

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    while (balls.length < 25) {
      var ball = new Ball(
        random(0, width),
        random(0, height),
        random(-7, 7),
        random(-7, 7),
        true,
        randomColor(),
        random(10, 20)
      );
      while (ball.velX === 0 && ball.velY === 0) {
        ball.velX = random(-7, 7);
        ball.velY = random(-7, 7);
      }
      balls.push(ball);
    }

    for (var i = 0; i < balls.length; i++) {
      if (balls[i].exists) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    para[0].textContent = "还剩余" + restball + "个球";
    time++;
    if(time === 120){
      time1++;
      para[1].textContent =para[1].textContent = '本次挑战时间为' + time1 + '秒';
      time = 0;
    }
    requestAnimationFrame(loop);
    if (restball === 0) {
      alert("你赢了！你的成绩是"+time1+"秒");
      location.reload();
    }
  }
  loop();
