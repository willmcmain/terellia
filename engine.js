Engine = {};

(function() {
Engine.state = {};


Engine._pages = {};


Engine.add_page = function(name, data) {
    if(Engine._pages[name] !== undefined) {
        throw Error("Page with name " + name + " already exists!");
    }
    Engine._pages[name] = data;
};


Engine.set_start = function(page) {
    this._start = page;
}


Engine.start = function() {
    this.load(this._start);
}


Engine.load = function(page) {
    //var page = this._pages[page];
    var filename = "pages/" + page + ".page";

    $.ajax(filename).done(function(data) {
        var el = $('#content');
        el.css("opacity", 0);
        el.html(Engine.process(data));
        el.fadeTo("slow", 1);
        /*if(typeof page['post_load'] === "function") {
            page['post_load'](Engine.state);
        }*/
    });
}


Engine.render_links = function(str) {
    var regx = /\[\[(\w+)\|?(.*)\]\]/g;
    return str.replace(regx, function(match, target, text) {
        /*if(Engine._pages[target] === undefined) {
            throw Error("Target '" + target + "' does not exist!");
        }*/
        if(text === '') {
            text = target;
        }
        return "<a href='javascript:Engine.load(\"" + target + "\")'>"
            + text + "</a>";
    });
};


Engine.process = function(text) {
    var md = new Remarkable({
        html: true,
        xhtmlOut: true,
        breaks: true,
    });

    text = _.template(text)({s: Engine.state});
    text = this.render_links(text);
    text = md.render(text);
    return text;
}


})();


Page = Engine.add_page;
