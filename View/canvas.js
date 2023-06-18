var canvas = {
    reset: function(width, height) {
      Demo.el.canvas.width  = width  + 1;
      Demo.el.canvas.height = height + 1;
      Demo.el.draw.clearRect(0, 0, Demo.el.canvas.width, Demo.el.canvas.height);
    },

    rect:  function(x, y, w, h, color, num) {
      Demo.el.draw.fillStyle = color;
      Demo.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
      Demo.el.draw.fillStyle = '#000';
      Demo.el.draw.fillText(num.toString(), x + 2, y + 10);
    },

    stroke: function(x, y, w, h) {
      Demo.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
    },

    blocks: function(sheets) {
      var diffSheets = 0;
      for (let i = 0; i < sheets.length; i++) {
        for (let n = 0 ; n < sheets[i].blocks.length ; n++) {
          var block = sheets[i].blocks[n];
          canvas.rect(block.x, block.y + diffSheets, block.w, block.h, canvas.color(n), block.num);
          canvas.stroke(block.x, block.y + diffSheets, block.w, block.h);
        }
        canvas.stroke(0, diffSheets, sheets[0].w, 1);
        diffSheets += sheets[0].h;
      }
    // blocks: function(sheets) {
    //     var diffSheets = 0;
    //     for (let i = 0; i < sheets.length; i++) {
    //       for (let n = 0 ; n < sheets[i].blocks.length ; n++) {
    //         var block = sheets[i].blocks[n];
    //         // if (block.block.orientation === "vertical") 
    //             canvas.rect(block.x, block.y + diffSheets, block.block.w, block.block.h, canvas.color(n), block.block.num);
    //             canvas.stroke(block.x, block.y + diffSheets, block.block.w, block.block.h);
    //         // }else{
    //         //     canvas.rect(block.x, block.y + diffSheets, block.block.h, block.block.w, canvas.color(n), n);
    //         // canvas.stroke(block.x, block.y + diffSheets, block.block.h, block.block.w);
    //         // }
            
    //       }
    //       canvas.stroke(0, diffSheets, parseInt(Demo.el.size_w.val()), 1);
    //       diffSheets += parseInt(Demo.el.size_h.val());
    //     }
    },

    saveToPdf: function () {
      var doc = new jsPDF();

      // Получение данных изображения в формате base64
      var imgData = Demo.el.canvas.toDataURL('image/png');

      // Получение ширины и высоты элемента <canvas>
        var canvasWidth = Demo.el.canvas.width;
        var canvasHeight = Demo.el.canvas.height;

        // Определение доступной ширины и высоты в PDF
        var availableWidth = 210;  // Здесь указываете доступную ширину в PDF
        var availableHeight = 290; // Здесь указываете доступную высоту в PDF

        // Масштабирование изображения
        var scale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight);
        var imageWidth = canvasWidth * scale;
        var imageHeight = canvasHeight * scale;
      
      // Добавление изображения в PDF
      doc.addImage(imgData, 'PNG', 0, 0, imageWidth, imageHeight);

      // Сохранение PDF-файла
      doc.save('canvas_image.pdf');
    },

    color: function(n) {
        var cols = ["#AFFFB5", "#FFA7B5", "#BFA5E0", "#B5A3FF", "#FACBB5", "#FBAAAF", "#A3FFF1"];
        return cols[n % cols.length];
      },
  };