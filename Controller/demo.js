var Demo = {

  init: function() {
    // Initialize DOM elements
    Demo.el = {
      details: $('#details'),
      block_h:      $('#block_h'),
      block_w:      $('#block_w'),
      block_n:      $('#block_n'),
      canvas:       $('#canvas')[0],
      size_h:       $('#size_h'),
      size_w:       $('#size_w'),
      numSheets:    $('#numSheets'),
      ratio:        $('#ratio'),
      edit_block_n: $('#edit_block_n'),
      edit_block_w: $('#edit_block_w'),
      edit_block_h: $('#edit_block_h'),
      add_block:    $('#add_block'),
      edit_block:   $('#edit_block')
    };

    if (!Demo.el.canvas.getContext) // no support for canvas
      return false;

    // Get the 2D drawing context for the canvas
    Demo.el.draw = Demo.el.canvas.getContext("2d");
    Demo.run();

    $(Demo.el.add_block).click(function(event) {
      if(parseInt(Demo.el.size_h.val())<=3000 && parseInt(Demo.el.size_w.val())<=3000){
        details.add_block();
      } else {
        var el = document.getElementById('size_report');
        el.style.display = 'block';
        }
      
    });
    $(Demo.el.edit_block).click(function(event) {details.edit_block()});

    // Set up event listeners for input changes
    Demo.el.size_h.change(function(ev) {
      if(parseInt(Demo.el.size_h.val())<=3000){
      details.saveValuesToLocalStorage('size_h');
      Demo.run(); // run on <enter> while entering size information
      var el = document.getElementById('size_report');
      el.style.display = 'none';
    } else {
      var el = document.getElementById('size_report');
      el.style.display = 'block';
      }
    });
    Demo.el.size_w.change(function(ev) {
      if(parseInt(Demo.el.size_h.val())<=3000){
        details.saveValuesToLocalStorage('size_w');
        Demo.run(); // run on <enter> while entering size information
        var el = document.getElementById('size_report');
        el.style.display = 'none';
      } else {
        var el = document.getElementById('size_report');
        el.style.display = 'block';
        }
    });
    Demo.el.block_h.change(function(ev) {
      details.saveValuesToLocalStorage('block_h');
    });
    Demo.el.block_w.change(function(ev) {
      details.saveValuesToLocalStorage('block_w');
    });
    Demo.el.block_n.change(function(ev) {
      details.saveValuesToLocalStorage('block_n');
    });
    
    // Set up event listeners for click events
    $(Demo.el.size_h).click(function(event) {
      var savedSH = localStorage.getItem('size_h');
      details.populateDropdownList('size_h', savedSH ? savedSH.split(',') : []);
    });
    $(Demo.el.size_w).click(function(event) {
      var savedSW = localStorage.getItem('size_w');
      details.populateDropdownList('size_w', savedSW ? savedSW.split(',') : []);
    });
    $(Demo.el.block_w).click(function(event) {
      var savedW = localStorage.getItem('block_w');
      details.populateDropdownList('block_w', savedW ? savedW.split(',') : []);
    });
    $(Demo.el.block_h).click(function(event) {
      var savedH = localStorage.getItem('block_h');
      details.populateDropdownList('block_h', savedH ? savedH.split(',') : []);
    });
    $(Demo.el.block_n).click(function(event) {
      var savedN = localStorage.getItem('block_n');
      details.populateDropdownList('block_n', savedN ? savedN.split(',') : []);
    });
  },

  run: function() {
    
    var newBlocks = details.list.slice(0);

    if(newBlocks.length>0){
    // Cut the blocks and get the result sheets
    var resSheets = BestFit.cutBlocks(newBlocks, parseInt(Demo.el.size_w.val()), parseInt(Demo.el.size_h.val()));

    // Calculate the height of the canvas
    var hCanvas = parseInt(Demo.el.size_h.val())*resSheets.length;

    canvas.reset(parseInt(Demo.el.size_w.val()), hCanvas);
    canvas.blocks(resSheets);
    details.report(resSheets.length, newBlocks, parseInt(Demo.el.size_w.val()), hCanvas);
    details.print_det();}
  },
}

$(Demo.init);
