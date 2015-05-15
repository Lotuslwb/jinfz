define(function () {
    /*Timer*/
    var Timer = function (target, method, interval) {
        this.status = 0;
        this.target = target;
        this.method = method;
        this.interval = interval;
    };
    Timer.prototype.getTask = function () {
        if (this.timer == null) {
            var instance = this;
            this.task = function () {
                instance.run();
            };
        }
        return this.task;
    };
    Timer.prototype.start = function (interval) {
        if (this.status == 0) {
            this.status = 1;
            this.run(interval);
        }
    };
    Timer.prototype.pause = function (interval) {
        var result = this.status;
        this.status = 0;
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        return result;
    };
    Timer.prototype.stop = function () {
        this.pause();
    };
    Timer.prototype.run = function (interval) {
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.status == 1) {
            if (interval != null) {
                this.timer = setTimeout(this.getTask(), interval);
                return;
            }
            this.method.call(this.target);
            this.timer = setTimeout(this.getTask(), this.interval);
        }
    };
    return Timer;
    /*Timer*/
});
