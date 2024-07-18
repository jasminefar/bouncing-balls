(function() {
    var canvas = document.querySelector('canvas'),
        cx = canvas.getContext('2d'),
        balls = [],
        MAX_BALLS = 50,
        BALL_RADIUS = 20,
        COLORS = [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
        ];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function Ball(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    Ball.prototype.draw = function() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        cx.fillStyle = this.color;
        cx.fill();
        cx.closePath();
    };

    Ball.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
            this.changeColor();
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
            this.changeColor();
        }

        for (var i = 0; i < balls.length; i++) {
            if (this !== balls[i] && this.isCollidingWith(balls[i])) {
                this.changeColor();
                balls[i].changeColor();
                this.resolveCollision(balls[i]);
            }
        }
    };

    Ball.prototype.changeColor = function() {
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    };

    Ball.prototype.isCollidingWith = function(otherBall) {
        var dx = this.x - otherBall.x;
        var dy = this.y - otherBall.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherBall.radius;
    };

    Ball.prototype.resolveCollision = function(otherBall) {
        var dx = otherBall.x - this.x;
        var dy = otherBall.y - this.y;
        var collisionAngle = Math.atan2(dy, dx);

        var speed1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        var speed2 = Math.sqrt(otherBall.vx * otherBall.vx + otherBall.vy * otherBall.vy);

        var direction1 = Math.atan2(this.vy, this.vx);
        var direction2 = Math.atan2(otherBall.vy, otherBall.vx);

        var newVx1 = speed1 * Math.cos(direction1 - collisionAngle);
        var newVy1 = speed1 * Math.sin(direction1 - collisionAngle);
        var newVx2 = speed2 * Math.cos(direction2 - collisionAngle);
        var newVy2 = speed2 * Math.sin(direction2 - collisionAngle);

        var finalVx1 = ((this.radius - otherBall.radius) * newVx1 + (otherBall.radius + otherBall.radius) * newVx2) / (this.radius + otherBall.radius);
        var finalVx2 = ((this.radius + this.radius) * newVx1 + (otherBall.radius - this.radius) * newVx2) / (this.radius + otherBall.radius);
        var finalVy1 = newVy1;
        var finalVy2 = newVy2;

        this.vx = Math.cos(collisionAngle) * finalVx1 + Math.cos(collisionAngle + Math.PI / 2) * finalVy1;
        this.vy = Math.sin(collisionAngle) * finalVx1 + Math.sin(collisionAngle + Math.PI / 2) * finalVy1;
        otherBall.vx = Math.cos(collisionAngle) * finalVx2 + Math.cos(collisionAngle + Math.PI / 2) * finalVy2;
        otherBall.vy = Math.sin(collisionAngle) * finalVx2 + Math.sin(collisionAngle + Math.PI / 2) * finalVy2;
    };

    function createBalls() {
        for (var i = 0; i < MAX_BALLS; i++) {
            var radius = BALL_RADIUS;
            var x = Math.random() * (canvas.width - radius * 2) + radius;
            var y = Math.random() * (canvas.height - radius * 2) + radius;
            var vx = (Math.random() - 0.5) * 4;
            var vy = (Math.random() - 0.5) * 4;
            var color = COLORS[Math.floor(Math.random() * COLORS.length)];

            balls.push(new Ball(x, y, vx, vy, radius, color));
        }
    }

    function animate() {
        cx.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach(function(ball) {
            ball.draw();
            ball.update();
        });

        requestAnimationFrame(animate);
    }

    createBalls();
    animate();

    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        balls.forEach(function(ball) {
            var dx = mouseX - ball.x;
            var dy = mouseY - ball.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ball.vx += dx / 100;
                ball.vy += dy / 100;
            }
        });
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

})();
