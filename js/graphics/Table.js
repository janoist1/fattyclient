(function (graphics, createjs, undefined) {

    graphics.pixelRatio = graphics.pixelRatio || 1;

    function Table(color) {
        this.initialize(color);
    }

    Table.prototype = new createjs.Container();
    Table.prototype.parent_initialize = Table.prototype.initialize;

    Table.prototype.initialize = function (color) {
        this.parent_initialize();

        this.color = color;
        this.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
        this.table = new createjs.Shape;
        this.addChild(this.table);
    };

    Table.prototype.redraw = function() {
        this.table.graphics.clear();
        this.table.graphics
            .beginFill(this.color)
            .drawEllipse(0, 0, this.getBounds().width, this.getBounds().height);
        this.table.setBounds(0, 0, this.getBounds().width, this.getBounds().height);
    };

    graphics.Table = Table;

}(window.graphics = window.graphics || {}, createjs));